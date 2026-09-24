import { Router } from 'express';
import { createConnectionHandler, getMyConnectionsHandler, updateConnectionHandler } from './connection.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createConnectionHandler);
router.get('/', protect, getMyConnectionsHandler);
router.patch('/:id', protect, updateConnectionHandler);

export default router;