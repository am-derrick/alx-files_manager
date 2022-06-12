import redisClient from './redis';
import dbClient from './db';

async function getAuthToken(request) {
    const token = request.headers['x-token'];
    return `auth_${token}`;
}

async function findUserIdByToken(request) {
    const key = await getAuthToken(request);
    const UserId = await redisClient.get(key);
    return userId || null;
}

async function findUserById(userId) {
    const userExists = await dbClient.user.find(`ObjectId("${UserId}")`).toArray();
    return userExists[0] || null;
}

export {
    findUserIdByToken,
    findUserById,
};
