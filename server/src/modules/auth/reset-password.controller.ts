import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { resetPasswordSchema } from './reset-password.schema';
import {
  resetPassword,
  resetPasswordWithTicket,
  sendForgotPasswordCode,
  sendResetPasswordCode,
} from './reset-password.service';
import { z } from 'zod';

const forgotPasswordEmailSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export const sendResetPasswordCodeHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    await sendResetPasswordCode(req.userId);
    res.status(200).json({ message: 'Password verification code sent' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
      return;
    }
    await resetPassword(req.userId, parsed.data.code, parsed.data.newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const sendForgotPasswordCodeHandler = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = forgotPasswordEmailSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid email address' });
      return;
    }
    const ticket = await sendForgotPasswordCode(parsed.data.email);
    res.status(200).json({ message: 'Password verification code sent', ticket });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const forgotPasswordHandler = async (req: AuthRequest, res: Response) => {
  try {
    const ticket = req.header('x-reset-password-ticket');
    if (!ticket) {
      res.status(400).json({ message: 'Reset request is missing' });
      return;
    }
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
      return;
    }
    await resetPasswordWithTicket(ticket, parsed.data.code, parsed.data.newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
