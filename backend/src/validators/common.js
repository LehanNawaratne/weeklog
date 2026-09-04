import { z } from 'zod';

export const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Must be a valid id');

export const paginationFields = {
  page: z.coerce.number().int().min(1, 'Page must be 1 or more').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be 1 or more')
    .max(100, 'Limit cannot be more than 100')
    .default(10)
};

export const strongPassword = z.string().min(8, 'Password must be at least 8 characters');
