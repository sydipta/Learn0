import { Router } from 'express';
import { createPostHandler, getPostHandler, deletePostHandler } from './post.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createPostHandler);
router.get('/', protect, getPostHandler);
router.delete('/:id', protect, deletePostHandler);

export default router;