import { Router } from 'express';
import { getStats } from './stats.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
router.get('/', protect, getStats);

export default router;