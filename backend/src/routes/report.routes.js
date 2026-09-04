import { Router } from 'express';

import {
  addReport,
  editReport,
  getMyReportById,
  getMyReports,
  getReportVersions,
  submitReportForReview
} from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createReportSchema,
  listReportsQuerySchema,
  updateReportSchema
} from '../validators/report.validator.js';

export const reportRoutes = Router();

reportRoutes.use(requireAuth);

reportRoutes.get('/mine', validate(listReportsQuerySchema, 'query'), getMyReports);
reportRoutes.get('/mine/:id', getMyReportById);
reportRoutes.get('/:id/versions', getReportVersions);

reportRoutes.post('/', validate(createReportSchema), addReport);
reportRoutes.put('/:id', validate(updateReportSchema), editReport);
reportRoutes.post('/:id/submit', submitReportForReview);
