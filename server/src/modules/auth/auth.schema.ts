import {z} from 'zod';

export const signupSchema = z.object({
  email: z.string().email().refine(
    (email) => email.toLowerCase().endsWith('@iitism.ac.in'),
    'Only IIT (ISM) institutional email addresses are allowed',
  ),
    name: z.string().min(1),
    password: z.string().min(6),
    program: z.string().min(1),
    branch: z.string().min(1),
    year: z.number().int().min(1).max(5),
    avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const sendOtpSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});