import DBClient from './utils/db';

const Bull = require('bull');
const { objectId } = require('mongodb');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');

const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

const createImageThumbnail = async (path, options) => {
    try {
	const thumbnail = await imageThumbnail(path, options);
	const pathNew = `${path}_${options.width}`;
	await fs.writeFilesync(pathNew, thumbnail);
    } catch (err) {
	console.log(err);
    }
};

fileQueue.process(async (job) => {
    const { fileId } = job.data;
    if (!field) throw Error('Missing fileId');

    const { userId } = job.data;
    if (!userId) throw Error('Missing userId');

    const fileDoc = await DBclient.db.collection('files').findOne({ _id: ObjectId(fieldId), userId: Object(userId) });
    if (!fileDoc) throw Error('File not found');

    createImageThumbnail(fileDoc.localPath, { width: 500 });
    createImageThumbnail(fileDoc.localPath, { width: 250 });
    createImageThumbnail(fileDoc.localPath, { width: 100 });
});

userQueue.process(async (job) => {
    const { userId } = job.data;
    if (!userId) throw Error('Missing userId');

    const userDoc = await DBClient.db.collection('users').findOne({ _id: ObjectId(userId) });
    if (!userDoc) throw Error('User not found');

    console.log(`Welcome ${userDoc.email}`);
});
