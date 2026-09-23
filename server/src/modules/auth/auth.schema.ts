import {z} from 'zod';

export const signupSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6),
    program: z.string().min(1),
    branch: z.string().min(1),
    year: z.number().int().min(1).max(5),
    avatarUrl: z.string().url(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})