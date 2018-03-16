'use strict';

const net = require('net');

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

      fn(...args, (...result) => {
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


function Client() {
  this.exec = new Map();
  this.socket = new net.Socket();
  this.socket.on('data', (raw) => {
    const data = JSON.parse(raw);
    const args = data.args;
    const res = data.result;

    const key = JSON.stringify(args);
    const callback = this.exec.get(key);
    callback(...res);
  });
}

Client.prototype.connect = function(options) {
  this.socket.connect(options);
  return this;
}

Client.prototype.execute = function(method, args, callback) {
  if (!Array.isArray(args)) throw new Error('args must be an Array');

  const call = { method, args };
  this.socket.write(JSON.stringify(call));

  const key = JSON.stringify(args);
  this.exec.set(key, callback);
}

Client.prototype.end = function() {
  this.socket.end();
  return this;
};

module.exports = {
  Server,
  Client
}
