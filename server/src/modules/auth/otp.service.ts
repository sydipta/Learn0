import crypto from 'crypto';
import bcrypt from 'bcrypt';
import redis from '../../db/redis';
import prisma from '../../db/prisma';
import { sendOtpEmail } from '../../utils/mailer';

const OTP_TTL_SECONDS = 600;          // code lives 10 minutes
const RESEND_COOLDOWN_SECONDS = 60;   // one new code per minute
const MAX_ATTEMPTS = 5;

const otpKey = (email: string) => `otp:${email}`;
const attemptsKey = (email: string) => `otp:attempts:${email}`;
const cooldownKey = (email: string) => `otp:cooldown:${email}`;

export const sendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('No account found for this email');
  if (user.isVerified) throw new Error('Email is already verified');

  if (await redis.get(cooldownKey(email))) {
    throw new Error('Please wait a minute before requesting another code');
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = await bcrypt.hash(code, 10);

  await redis.set(otpKey(email), codeHash, 'EX', OTP_TTL_SECONDS);
  await redis.del(attemptsKey(email));

  await sendOtpEmail(email, code);
  await redis.set(cooldownKey(email), '1', 'EX', RESEND_COOLDOWN_SECONDS);
};

export const verifyOtp = async (email: string, code: string) => {
  const storedHash = await redis.get(otpKey(email));
  if (!storedHash) {
    throw new Error('Code expired or not found. Request a new one');
  }

  const attempts = await redis.incr(attemptsKey(email));
  if (attempts === 1) await redis.expire(attemptsKey(email), OTP_TTL_SECONDS);
  if (attempts > MAX_ATTEMPTS) {
    await redis.del(otpKey(email), attemptsKey(email));
    throw new Error('Too many wrong attempts. Request a new code');
  }

  const match = await bcrypt.compare(code, storedHash);
  if (!match) throw new Error('Incorrect code');

  await redis.del(otpKey(email), attemptsKey(email));
  await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });
};