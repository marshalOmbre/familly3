import express from 'express';
import { upload, uploadMedia } from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('file'), uploadMedia);

export default router;
