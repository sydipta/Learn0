import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import {
  sendResetPasswordCodeHandler,
  resetPasswordHandler,
  sendForgotPasswordCodeHandler,
  forgotPasswordHandler,
} from './reset-password.controller';

const router = Router();

router.post('/send-code', protect, sendResetPasswordCodeHandler);
router.post('/', protect, resetPasswordHandler);
router.post('/forgot/send-code', sendForgotPasswordCodeHandler);
router.post('/forgot', forgotPasswordHandler);

export default router;
