import { Router } from 'express';
import { createReviewHandler, getReviewsHandler } from './review.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createReviewHandler);
router.get('/:userId', protect, getReviewsHandler);

export default router;