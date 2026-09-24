import { z } from 'zod';

export const createReviewSchema = z.object({
    connectionId: z.string().uuid(),
    revieweeId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1).max(800),
})