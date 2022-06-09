import redis from 'redis';
import { promisify } from 'util';

/**
 * Class with constructor that creates a client to Redis
 */
class RedisClient {
    constructor() {
	this.client = redis.createClient();
	this.getAsync = promisify(this.client.get).bind(this.client);
	this.client.on('error', (error) => {
	    console.log(`Redis client not connected to the server: ${error.message}`);
	});
	this.client.on('connect', () => {
	    // console.log('Redis client connected to the server');
	});
    }

    /**
     * Checks if connection to Redis is a success
     * @return true if connection is a success, otherwise false
     */
    isAlive() {
	return this.client.connected;
    }

    /**
     * gets Redis value stored for this key
     * @key {string} key to search for
     * @return {string} value of the key
     */
    async get(key) {
	const value = await this.getAsync(key);
	return value;
    }

    /** Creates a new Redis key with TTL
     * @key {string} key to be created
     * @value {string}corresponding value for key
     * @duration {number} TTL of key
     * @return {undefined} No return
     */
    async set(key, value, duration) {
	this.client.setex(key, duration, value);
    }

    /**
     * Removes value for a Redis key
     * @key {string} key to be removed
     * @return {undefined} No return
     */
    async del(key) {
	this.client.del(key);
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;

	    
