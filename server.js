'use strict';

const rpc = require('./rpc.js');

const api = {
  power: (a, b, callback) => callback(null, Math.pow(a, b))
}

const server = new rpc.Server(api);
server.listen('3000');
