import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '../../db/prisma';
import redis from '../../db/redis';
import { sendOtpEmail } from '../../utils/mailer';

const OTP_TTL_SECONDS = 600;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

const codeKey = (userId: string) => `reset-password:code:${userId}`;
const attemptsKey = (userId: string) => `reset-password:attempts:${userId}`;
const cooldownKey = (userId: string) => `reset-password:cooldown:${userId}`;
const forgotTicketKey = (ticket: string) => `reset-password:ticket:${ticket}`;
const forgotCodeKey = (ticket: string) => `reset-password:forgot-code:${ticket}`;
const forgotAttemptsKey = (ticket: string) => `reset-password:forgot-attempts:${ticket}`;
const forgotCooldownKey = (email: string) => `reset-password:forgot-cooldown:${email}`;

export const sendResetPasswordCode = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isVerified) throw new Error('Verified user account not found');
  if (await redis.get(cooldownKey(userId))) {
    throw new Error('Please wait a minute before requesting another code');
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = await bcrypt.hash(code, 10);
  await redis.set(codeKey(userId), codeHash, 'EX', OTP_TTL_SECONDS);
  await redis.del(attemptsKey(userId));
  await sendOtpEmail(user.email, code);
  await redis.set(cooldownKey(userId), '1', 'EX', RESEND_COOLDOWN_SECONDS);
};

export const resetPassword = async (userId: string, code: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const storedHash = await redis.get(codeKey(userId));
  if (!storedHash) throw new Error('Code expired or not found. Request a new one');

  const attempts = await redis.incr(attemptsKey(userId));
  if (attempts === 1) await redis.expire(attemptsKey(userId), OTP_TTL_SECONDS);
  if (attempts > MAX_ATTEMPTS) {
    await redis.del(codeKey(userId), attemptsKey(userId));
    throw new Error('Too many wrong attempts. Request a new code');
  }
  if (!await bcrypt.compare(code, storedHash)) throw new Error('Incorrect code');

  await redis.del(codeKey(userId), attemptsKey(userId));
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      passwordVersion: { increment: 1 },
    },
  });
};

export const sendForgotPasswordCode = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isVerified) throw new Error('No verified account found for this email');
  if (await redis.get(forgotCooldownKey(email))) {
    throw new Error('Please wait a minute before requesting another code');
  }

  const ticket = crypto.randomBytes(32).toString('hex');
  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = await bcrypt.hash(code, 10);
  await redis.set(forgotTicketKey(ticket), user.id, 'EX', OTP_TTL_SECONDS);
  await redis.set(forgotCodeKey(ticket), codeHash, 'EX', OTP_TTL_SECONDS);
  await redis.del(forgotAttemptsKey(ticket));
  await sendOtpEmail(user.email, code);
  await redis.set(forgotCooldownKey(email), '1', 'EX', RESEND_COOLDOWN_SECONDS);
  return ticket;
};

export const resetPasswordWithTicket = async (ticket: string, code: string, newPassword: string) => {
  const userId = await redis.get(forgotTicketKey(ticket));
  if (!userId) throw new Error('Reset request expired. Request a new code');

  const storedHash = await redis.get(forgotCodeKey(ticket));
  if (!storedHash) throw new Error('Code expired or not found. Request a new one');
  const attempts = await redis.incr(forgotAttemptsKey(ticket));
  if (attempts === 1) await redis.expire(forgotAttemptsKey(ticket), OTP_TTL_SECONDS);
  if (attempts > MAX_ATTEMPTS) {
    await redis.del(forgotTicketKey(ticket), forgotCodeKey(ticket), forgotAttemptsKey(ticket));
    throw new Error('Too many wrong attempts. Request a new code');
  }
  if (!await bcrypt.compare(code, storedHash)) throw new Error('Incorrect code');

  await redis.del(forgotTicketKey(ticket), forgotCodeKey(ticket), forgotAttemptsKey(ticket));
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      passwordVersion: { increment: 1 },
    },
  });
};
