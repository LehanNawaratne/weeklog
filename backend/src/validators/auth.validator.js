import { z } from 'zod';

import { strongPassword } from './common.js';

const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email,
  password: strongPassword
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required')
});

export const acceptInviteSchema = z.object({
  token: z.string().trim().min(1, 'Invite token is required'),
  password: strongPassword
});
