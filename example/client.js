'use strict';

const rpc = require('../');

const client = new rpc.Client();

client.connect({
  host: 'localhost',
  port: '3000'
}, (err) => {

  client.methods.power([2, 64], (err, res) => {
    if (err) throw err;
    console.log(res);
  });



  client.end();
});
