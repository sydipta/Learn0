import { Router } from 'express';
import {
	signup,
	login,
	sendOtpHandler,
	verifyOtpHandler,
} from './auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtpHandler);
router.post('/verify-otp', verifyOtpHandler);

export default router;