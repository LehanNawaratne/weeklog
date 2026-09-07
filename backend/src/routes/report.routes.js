import { Router } from 'express';

import {
  addReport,
  editReport,
  getAllReports,
  getMyReportById,
  getMyReports,
  getReportDetail,
  getReportVersions,
  postReportReview,
  submitReportForReview
} from '../controllers/report.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createReportSchema,
  listAllReportsQuerySchema,
  listReportsQuerySchema,
  reviewReportSchema,
  updateReportSchema
} from '../validators/report.validator.js';

export const reportRoutes = Router();

reportRoutes.use(requireAuth);

reportRoutes.get(
  '/mine',
  requireRole('member'),
  validate(listReportsQuerySchema, 'query'),
  getMyReports
);
reportRoutes.get('/mine/:id', requireRole('member'), getMyReportById);
reportRoutes.get('/:id/versions', getReportVersions);

reportRoutes.get(
  '/',
  requireRole('manager'),
  validate(listAllReportsQuerySchema, 'query'),
  getAllReports
);

reportRoutes.get('/:id', requireRole('manager'), getReportDetail);

reportRoutes.post('/', requireRole('member'), validate(createReportSchema), addReport);
reportRoutes.put('/:id', requireRole('member'), validate(updateReportSchema), editReport);
reportRoutes.post('/:id/submit', requireRole('member'), submitReportForReview);
reportRoutes.post(
  '/:id/review',
  requireRole('manager'),
  validate(reviewReportSchema),
  postReportReview
);
