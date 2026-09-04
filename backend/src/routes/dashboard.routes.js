import { Router } from 'express';

import {
  getDashboardActivity,
  getDashboardChart,
  getDashboardSummary
} from '../controllers/dashboard.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  activityQuerySchema,
  chartsQuerySchema,
  summaryQuerySchema
} from '../validators/dashboard.validator.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth, requireRole('manager'));

dashboardRoutes.get('/summary', validate(summaryQuerySchema, 'query'), getDashboardSummary);
dashboardRoutes.get('/charts', validate(chartsQuerySchema, 'query'), getDashboardChart);
dashboardRoutes.get('/activity', validate(activityQuerySchema, 'query'), getDashboardActivity);
