import { z } from 'zod';

export const summaryQuerySchema = z.object({
  weekStart: z.coerce.date({ error: 'Provide a valid date inside the week' }).optional()
});

export const chartsQuerySchema = z.object({
  type: z.enum(['tasksTrend', 'statusByMember', 'workloadByProject', 'timeByTaskType'], {
    error: 'Type must be tasksTrend, statusByMember, workloadByProject or timeByTaskType'
  }),
  weekStart: z.coerce.date({ error: 'Provide a valid from date' }).optional(),
  weekEnd: z.coerce.date({ error: 'Provide a valid to date' }).optional()
});

export const activityQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be 1 or more')
    .max(100, 'Limit cannot be more than 100')
    .default(20)
});
