import { z } from 'zod';

export const createPostSchema = z.object({
    type: z.enum(['learning_request', 'teaching_offer']),
    subject: z.string().min(2),
    description: z.string().min(2),
})

export const updatePostSchema = z.object({
    subject: z.string().min(2).optional(),
    description: z.string().min(2).optional(),
})