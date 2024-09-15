const { Client, Entity, Schema, Repository } = require('redis-om');
const transactionSchema = new Schema('transaction', {
  date: { type: 'string' },
  code: { type: 'string' },
  balance: { type: 'string' },
  description: { type: 'text', textSearch: true },
  },
  {
    dataStructure: 'HASH',
  },
);

module.exports = {
  transactionSchema,
};