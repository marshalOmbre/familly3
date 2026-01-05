import express from 'express';
import { getTrees, createTree, getTree, updateTree, deleteTree } from '../controllers/treeController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get('/', getTrees);
router.post('/', createTree);
router.get('/:id', getTree);
router.put('/:id', updateTree);
router.delete('/:id', deleteTree);

export default router;
