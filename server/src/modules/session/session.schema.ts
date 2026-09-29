import { z } from 'zod';

export const createSessionSchema = z.object({
  connectionId: z.string().uuid(),
  scheduledAt: z.string().min(1),
});

export const updateSessionStatusSchema = z.object({
  status: z.enum(['completed', 'did_not_happen']),
});