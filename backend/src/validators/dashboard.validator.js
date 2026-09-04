import { z } from 'zod';

export const summaryQuerySchema = z.object({
  weekStart: z.coerce.date({ error: 'Provide a valid date inside the week' }).optional()
});
