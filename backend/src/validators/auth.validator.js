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

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    email: email.optional()
  })
  .refine((changes) => changes.name !== undefined || changes.email !== undefined, {
    error: 'Provide a name or an email to update'
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Your current password is required'),
    newPassword: strongPassword
  })
  .refine((passwords) => passwords.currentPassword !== passwords.newPassword, {
    error: 'Your new password must be different from the current one',
    path: ['newPassword']
  });
