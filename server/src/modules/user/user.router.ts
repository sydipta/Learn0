import { Router } from 'express';
import { getProfile, getPublicProfile, updateProfile } from './user.controller';
import { protect } from '../../middlewares/auth.middleware';

const router =  Router();

router.get('/profile', protect, getProfile);
router.get('/:userId/profile', protect, getPublicProfile);
router.patch('/me', protect, updateProfile);

export default router;