import { Router } from 'express';

import {
  addProject,
  editProject,
  getProjects,
  removeProject
} from '../controllers/project.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator.js';

export const projectRoutes = Router();

projectRoutes.use(requireAuth);

projectRoutes.get('/', getProjects);
projectRoutes.post('/', requireRole('manager'), validate(createProjectSchema), addProject);
projectRoutes.patch('/:id', requireRole('manager'), validate(updateProjectSchema), editProject);
projectRoutes.delete('/:id', requireRole('manager'), removeProject);
