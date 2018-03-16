# rpc

RPC library, which was inspired by [JSTP](https://github.com/metarhia/jstp)
_________________________________________
# Server side
```javascript
const rpc = require('rpc');

const api = {
  power: (a, b, callback) => {
    const result = Math.pow(a, b);
    callback(null, result);
  }
}

const server = new rpc.Server(api);
server.listen('3000');
```

# Client side
```javascript
const rpc = require('rpc');

const client = new rpc.Client();
client.connect({
  host: 'localhost',
  port: '3000'
});

client.execute('power', [10, 2], (err, result) => {
  if (err) throw err;
  console.log(result) // 100
});
```
