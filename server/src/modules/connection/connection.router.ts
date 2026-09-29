import { Router } from 'express';
import { createConnectionHandler, deleteConnectionHandler, getMyConnectionsHandler, updateConnectionHandler } from './connection.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createConnectionHandler);
router.get('/me', protect, getMyConnectionsHandler);
router.patch('/:id', protect, updateConnectionHandler);
router.delete('/:id', protect, deleteConnectionHandler);

export default router;