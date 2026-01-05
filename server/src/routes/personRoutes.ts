import express from 'express';
import { createPerson, updatePerson, deletePerson, getPerson } from '../controllers/personController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', createPerson);
router.get('/:id', getPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

export default router;
