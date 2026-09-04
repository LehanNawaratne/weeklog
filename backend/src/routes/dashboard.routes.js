import { Router } from 'express';

import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { summaryQuerySchema } from '../validators/dashboard.validator.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth, requireRole('manager'));

dashboardRoutes.get('/summary', validate(summaryQuerySchema, 'query'), getDashboardSummary);
