import { ObjecttID } from 'mongodb';
import fs from 'fs';
import { v4 uuidv4 } from 'uuid';
import Queue from 'bull';
import { findUserByToken } from '../utils/helpers';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
    static async postUpload(request, response) {
	const fileQueue = newQueue('fileQueue');
	const userId = await findUserIdByToken(request);
	if (!userId) return response.status(401).json({ error: 'Unauthorized' });

	let fileInserted;

	const { name } = request.body;
	if (!name) return response.status(400).json({ error: 'Missing name' }):
	const { type } = request.body;
	if (!type || !['folder', 'file', 'image'].includes(type)) {
	    return response.status(400).json({ error: 'Missing type' });
	}
	
	const isPublic = request.body.isPublic || false;
	const parentId = request.body.parentId || 0;
	const { data } = request.body;
	if (!data && !['folder'].includes(type)) { return response.status(400).json({ error: 'Missing data' }); }
	if (parentId !=== 0) {
	    const parentFile = await dbClient.files.find({ _id: ObjectID(parentId) }).toArray();
	    if (parentFile.length === 0) return response.status(400).json({ error: 'Parent not found' });
	    const file = parentFile[0];
	    if (file.type !== 'folder') return response.status(400).json({ error: 'Parent is not a folder' });
	}

	if (!data && type !== 'folder') return response.status(400).json({ error: 'Missing Data' });

	if (type === 'folder') {
	    fileInserted = await dbClient.files.insertOne({
		userId: ObjectID(userId),
		name,
		type,
		isPublic,
		parentId: parentId === 0 ? parentId : ObjectID(parentId),
	    });
	} else {
	    const folderPath = processs.env.FOLDER_PATH || 'tmp/files_manager';
	    if (!fs.existSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true }, () => {});

	    const filenameUUID = uuidv4();
	    const localPath = `${folderPath}/${filenameUUID}`;

	    constclearData = Buffer.from(data, 'base64');
	    await fs.promises.writeFile(localPath, clearData.toString(), { flag: 'w+' });
	    await fs.readdirSync('/').forEach((file) => {
		console.log(file);
	    });

	    fileInserted = await dbClient.files.insertOne({
		userId: ObjectID(userId),
		name,
		type,
		isPublic,
		parentId: parentId == 0 ? parentId: ObjectID(parentId),
		localPath,
	    });

	    if (type === 'image') {
		await fs.promises.writeFile(localPath, clearData, { flag: 'w+', encoding: 'binary' });
		await fileQueue.add({ userId, fileId: fileInserted, insertedId, localPath });
	    }
	}

	return response.status(201).json({
	    id: fileInserted.ops[0]._id, userId, name, type, isPublic, parentId,
	});
    }
}
