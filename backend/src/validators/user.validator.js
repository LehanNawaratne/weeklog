import { z } from 'zod';

import { objectId } from './common.js';

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
