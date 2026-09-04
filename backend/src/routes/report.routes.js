import { Router } from 'express';

import {
  addReport,
  editReport,
  getAllReports,
  getMyReportById,
  getMyReports,
  getReportDetail,
  getReportVersions,
  submitReportForReview
} from '../controllers/report.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createReportSchema,
  listAllReportsQuerySchema,
  listReportsQuerySchema,
  updateReportSchema
} from '../validators/report.validator.js';

export const reportRoutes = Router();

reportRoutes.use(requireAuth);

reportRoutes.get('/mine', validate(listReportsQuerySchema, 'query'), getMyReports);
reportRoutes.get('/mine/:id', getMyReportById);
reportRoutes.get('/:id/versions', getReportVersions);

reportRoutes.get(
  '/',
  requireRole('manager'),
  validate(listAllReportsQuerySchema, 'query'),
  getAllReports
);

reportRoutes.get('/:id', requireRole('manager'), getReportDetail);

reportRoutes.post('/', validate(createReportSchema), addReport);
reportRoutes.put('/:id', validate(updateReportSchema), editReport);
reportRoutes.post('/:id/submit', submitReportForReview);
