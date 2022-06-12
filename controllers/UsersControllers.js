import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';

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
}

module.exports = UsersController;
