import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

export const get = async (key) => {
    try {
        const data = await redis.get(key);

        if (data) {
            console.log(`Cache hit: ${key}`);
            return JSON.parse(data);
        }

        console.log(`Cache miss: ${key}`);
        return null;

    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
};

export const set = async (key, data, expireTime = 3600) => {
    try {
        await redis.setex(key, expireTime, JSON.stringify(data));
        console.log(`Cache set: ${key} (${expireTime}s)`);
        return true;

    } catch (error) {
        console.error('Cache set error:', error);
        return false;
    }
};

export const remove = async (key) => {
    try {
        await redis.del(key);
        console.log(`Cache deleted: ${key}`);
        return true;
    } catch (error) {
        console.error('Cache delete error:', error);
        return false;
    }
};

export const clear = async () => {
    try {
        await redis.flushall();
        console.log('All cache cleared');
        return true;
    } catch (error) {
        console.error('Cache clear error:', error);
        return false;
    }
};
