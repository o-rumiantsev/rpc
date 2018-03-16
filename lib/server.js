'use strict';

const net = require('net');
const error = require('./error.js');

function Server(api) {
  const onConnection = (socket) => {
    socket.on('data', (raw) => {
      let data;

      try {
        data = JSON.parse(raw);
      } catch (err) {
        socket.write(JSON.stringify(err));
        socket.end();
        return;
      }

      const fn = api[data.method];
      const args = data.args;

      for (let i = args.length; i < fn.length - 1; ++i) args.push(null);

      fn(...args, (...result) => {
        result[0] = error(result[0]);
        socket.write(JSON.stringify({ args, result }));
      });
    })
  };

  this.server = new net.Server(onConnection);
}

Server.prototype.listen = function(port, host, listener) {
  if (typeof port === 'object') {
    listener = host;
    this.server.listen(port, listener);
    return this;
  }

  this.server.listen(port, host, listener);
  return this;
}

module.exports = Server;
