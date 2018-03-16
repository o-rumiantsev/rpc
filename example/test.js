'use strict';

const err = new Error('error');


const newErr = {
  name: err.name,
  message: err.toString(),
  stack: err.stack,
  inspect: () => `${err.stack}`
}

console.log(newErr);
