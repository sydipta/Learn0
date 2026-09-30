import { Router } from 'express';
import {
  getNotificationsHandler,
  markAllNotificationsReadHandler,
  markNotificationReadHandler,
} from './notification.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, getNotificationsHandler);
router.patch('/read-all', protect, markAllNotificationsReadHandler);
router.patch('/:id/read', protect, markNotificationReadHandler);

export default router;
