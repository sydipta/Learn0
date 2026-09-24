import { z } from 'zod';

export const createConnectionSchema = z.object({
    postId: z.string().uuid(),
    receiverId: z.string().uuid(),
});

export const updateConnectionSchema = z.object({
    status: z.enum(['accepted', 'rejected']),
});