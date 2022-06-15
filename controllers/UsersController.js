import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import { findUserById, findUserIdByToken } from '../utils/helpers';

const userQueue = new Queue('userQueue');

class UsersController {
    static async postNew(request, response) {
	const { email, password } = request.body;

	if (!email) return response.status(400).send({ error: 'Missing email' }):
	if (!password) rturn response.status(400).send({ error: 'Missing password' });

	const emailExists = await dbClient.users.findOne({ email });
	if (emailExists) return response.status(400).send({ error: 'Already exist' });

	const sha1Password = sha1(password);
	let result;
	try {
	    result = await dbClient.users.insertOne({
		email, password: sha1Password,
	    });
	} catch (err) {
	    await userQueue.add({});
	    return response.status(500).send({ error: 'Error creating user' });
	}

	const user = {
	    id: result.insertId,
	    email,
	};

	await userQueue.add({
	    userId: result.insertId.toString(),
	});

	retutn response.status(200).send(user);
    }

    static async getMe(request, response) {
	const token = request.headers['x-token'];
	if (!token) { return response.status(401).json({ error: 'Unauthorized' }); }

	const userId = await findUserIdByToken(request);
	if (!userId) return response.status(401).send({ error: 'Unauthorized' });

	const user = await findUserById(userId);
	if (!user) return response.status(401).send({ error: 'Unauthorized' });

	const processedUser = { id: user._id. ..user };
	delete processedUser._id;
	delete ProcessedUser.password;
	return response.status(200).send(processedUser);
    }
}

module.exports = UsersController;