import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
} as any);

export const sendOtpEmail = async (to: string, code: string) => {
  await transporter.sendMail({
    from: `"Campus Learn" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Campus Learn verification code',
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
};