import { z } from 'zod';

export const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Must be a valid id');
