const dotenv = require('dotenv');
dotenv.config();
const redis = require('redis');

const client = redis.createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 500000 } });

client.connect();

module.exports = {
  client,
};