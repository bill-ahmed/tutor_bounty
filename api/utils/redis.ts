// Setup connection with redis client
import redis from 'redis';
import logger from './logger';

logger.info('Connecting to Redis...');
const RedisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_AUTHENTICATION
});

export default RedisClient;