'use strict';

const net = require('net');
const http = require('http');
const { EventEmitter } = require('events');

const setApiMethods = (client, data) => {
  client._apiMethods = new Set(data.methods);
  client.methods = new Proxy(client.methods, {
    get(target, key) {
      if (!client._apiMethods.has(key)) return target[key];
      return (args, callback) => client._execute(key, args, callback);
    }
  });

};

class Client extends EventEmitter {
  constructor() {
    super();
    this.exec = new Map();
    this.methods = {};
    this.socket = new net.Socket();
    this.socket.writing = false;

    this.socket.send = (call) => {
      this.socket.writing = true;
      this.socket.write(call, () => {
        this.socket.writing = false;
        this.emit('written');
      });
    }

    this.socket.on('data', (raw) => {
      const data = JSON.parse(raw);
      const args = data.args;
      const res = data.result;

      const key = JSON.stringify(args.filter(arg => !!arg));
      const callback = this.exec.get(key);
      callback(...res);
    });
  }

  connect(options, callback) {
    this.socket.connect(options);
    options.port = '8000';
    http.get(options, (res) => {
      const raw = [];
      res.on('data', (data) => raw.push(data));
      res.on('end', () => {
        try {
          const data = JSON.parse(raw.join(''));

          callback(null);
        } catch (e) {
          callback(e);
        }
      });
    })
    return this;
  }

  _execute(method, args, callback) {
    if (!Array.isArray(args)) throw new Error('args must be an Array');

    const call = JSON.stringify({ method, args });

    if (this.socket.writing) {
      this.once('written', () => {
        this.socket.send(call);
      });
    } else {
      this.socket.send(call);
    }


    const key = JSON.stringify(args);
    this.exec.set(key, callback);
  }

  end() {
    this.socket.end();
    return this;
  }
}

module.exports = Client;
