import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to: string, code: string) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Campus Learn <onboarding@resend.dev>',
    to,
    subject: 'Your Campus Learn verification code',
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }
};