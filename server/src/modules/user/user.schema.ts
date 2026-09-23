import { z } from 'zod';

export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    program: z.string().min(1).optional(),
    branch: z.string().min(1).optional(),
    year: z.number().int().min(1).max(5).optional(),
    avatarUrl: z.string().url().optional(),
});