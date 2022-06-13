import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../contollers/FilesController';

const router = express.Router();

// GET routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserContoller.getMe);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

// POST routes
router.post('/users', UsersController.postNew);
router.post('files', FilesContoller.postUpload);

module.exports = router;
