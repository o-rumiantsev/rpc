'use strict';

const rpc = require('./rpc.js');

const client = new rpc.Client();

client.connect({
  host: 'localhost',
  port: '3000'
});

client.execute('power', [10, 2], (err, result) => {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log(result);
  client.end();
});
