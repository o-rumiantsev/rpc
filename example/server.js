'use strict';

const rpc = require('../');

const api = {
  power: (a, b, callback) => callback(null, Math.pow(a, b)),
  error: (callback) => callback(new Error('hello)'))
}

const server = new rpc.Server(api);
const options = {
  host: 'localhost',
  port: '3000'
};

server.listen(options, () => console.log('RPC server listening'));
