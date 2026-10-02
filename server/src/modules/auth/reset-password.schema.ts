import { z } from 'zod';

export const resetPasswordSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
  newPassword: z.string().min(6),
});
