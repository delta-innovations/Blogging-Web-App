// redis.js
require('dotenv').config();
const { createClient } = require('redis');

// Debug .env values
// console.log('🧪 REDIS_PORT:', process.env.REDIS_PORT);
// console.log('🧪 REDIS_HOST:', process.env.REDIS_HOST);
// console.log('🧪 REDIS_PASSWORD:', process.env.REDIS_PASSWORD ? 'Present' : 'Missing');

const redisPort = parseInt(process.env.REDIS_PORT || '19532', 10);
if (isNaN(redisPort)) {
  throw new Error('❌ REDIS_PORT is invalid or missing in .env');
}

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: redisPort,
  },
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis Connected');

    await redisClient.set('foo', 'bar');
    const result = await redisClient.get('foo');
    console.log('Redis GET foo:', result); // bar
  } catch (err) {
    console.error('❌ Redis Error:', err.message);
  }
};

connectRedis();

module.exports = redisClient;