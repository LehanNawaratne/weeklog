import { z } from 'zod';

import { objectId, paginationFields } from './common.js';

export const updateRoleSchema = z.object({
  role: z.enum(['member', 'manager'], { error: 'Role must be either member or manager' })
});

export const assignProjectsSchema = z.object({
  projectIds: z
    .array(objectId)
    .refine((ids) => new Set(ids).size === ids.length, {
      error: 'The same project cannot be assigned twice'
    })
});

export const listUsersQuerySchema = z.object({ ...paginationFields });

export const inviteUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address')),
  role: z
    .enum(['member', 'manager'], { error: 'Role must be either member or manager' })
    .default('member')
});
