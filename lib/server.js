'use strict';

const net = require('net');
const http = require('http');
const error = require('./error.js');
const { EventEmitter } = require('events');

const onConnection = (api) => (socket) => {
  socket.writing = false;
  socket.send = (result) => {
    socket.writing = true;
    socket.write(result, () => {
      socket.writing = false;
      socket.emit('written');
    });
  }

  socket.on('data', (raw) => {
    let data;

    try {
      data = JSON.parse(raw);
    } catch (err) {
      err = JSON.stringify(error(err));
      socket.send(err);
      socket.end();
      return;
    }

    const fn = api[data.method];
    const args = data.args;

    for (let i = args.length; i < fn.length - 1; ++i) args.push(null);

    fn(...args, (...result) => {
      result[0] = error(result[0]);
      const res = JSON.stringify({ args, result });

      if (socket.writing) {
        socket.on('written', () => socket.send(res));
      } else {
        socket.send(res);
      }
    });
  })
};

const onRequest = (api) => (req, res) => {
  const methods = Object.keys(api);
  const apiMethods = JSON.stringify({ methods });
  res.end(apiMethods);
};

class Server extends EventEmitter {
  constructor(api) {
    super();

    const reqListener = onRequest(api);
    this._methodsSender = new http.Server(reqListener);
    this._methodsSender.listen('8000');

    const connListener = onConnection(api);
    this.server = new net.Server(connListener);
  }

  listen(port, host, listener) {
    if (typeof port === 'object') {
      listener = host;
      this.server.listen(port, listener);
      return this;
    }

    this.server.listen(port, host, listener);
    return this;
  }
}


module.exports = Server;
