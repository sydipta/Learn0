import { z } from 'zod';

export const createSessionSchema = z.object({
  connectionId: z.string().uuid(),
  scheduledAt: z.string().min(1).refine(value => {
    const scheduledAt = new Date(value);
    return !Number.isNaN(scheduledAt.getTime()) && scheduledAt.getTime() > Date.now();
  }, 'Session must be scheduled for a future date and time'),
});

export const updateSessionStatusSchema = z.object({
  status: z.enum(['completed', 'did_not_happen']),
});