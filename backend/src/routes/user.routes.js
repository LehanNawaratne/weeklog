import { Router } from 'express';

import {
  getUserById,
  getUsers,
  updateUserProjects,
  updateUserRole
} from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  assignProjectsSchema,
  listUsersQuerySchema,
  updateRoleSchema
} from '../validators/user.validator.js';

export const userRoutes = Router();

userRoutes.use(requireAuth);

userRoutes.get('/', requireRole('manager'), validate(listUsersQuerySchema, 'query'), getUsers);
userRoutes.get('/:id', getUserById);

userRoutes.patch(
  '/:id/role',
  requireRole('manager'),
  validate(updateRoleSchema),
  updateUserRole
);

userRoutes.patch(
  '/:id/projects',
  requireRole('manager'),
  validate(assignProjectsSchema),
  updateUserProjects
);
