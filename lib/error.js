'use strict';

const error = (err) => {
  if (!err) return err;
  return {
    name: err.name,
    message: err.toString(),
    stack: err.stack,
    inspect: () => err.stack
  }
};

module.exports = error;
