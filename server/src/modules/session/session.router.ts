import { Router } from 'express';
import { createSessionHandler, getUpcomingSessionsHandler, updateSessionStatusHandler } from './session.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createSessionHandler);
router.get('/upcoming', protect, getUpcomingSessionsHandler);
router.patch('/:id/status', protect, updateSessionStatusHandler);

export default router;