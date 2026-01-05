import express from 'express';
import { createRelationship, deleteRelationship } from '../controllers/relationshipController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', createRelationship);
router.delete('/:id', deleteRelationship);

export default router;
