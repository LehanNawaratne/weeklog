import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(['member', 'manager'], { error: 'Role must be either member or manager' })
});
