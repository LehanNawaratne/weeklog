import { Router } from 'express';

import { getUsers, updateUserRole } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateRoleSchema } from '../validators/user.validator.js';

export const userRoutes = Router();

userRoutes.use(requireAuth, requireRole('manager'));

userRoutes.get('/', getUsers);
userRoutes.patch('/:id/role', validate(updateRoleSchema), updateUserRole);
