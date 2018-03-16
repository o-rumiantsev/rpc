'use strict';

const rpc = require('../');

const client = new rpc.Client();

client.connect({
  host: 'localhost',
  port: '3000'
});

client.execute('power', [2, 64], (err, result) => {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log(result);

  client.execute('error', [], (err) => {
    if (err) throw err;
  })
});
