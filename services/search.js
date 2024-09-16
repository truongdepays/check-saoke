const { Repository } = require('redis-om');
const { client } = require('../config/redis');
const { transactionSchema } = require('../schemas/transaction');
const search = async (query) => {
  try {
    const offset = 0;
    const count = 30;
    const repository = new Repository(transactionSchema, client);
    const result = await repository.search().where('description').matches(query).return.page(offset, count);
    return result;
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};

module.exports = {
  search,
};