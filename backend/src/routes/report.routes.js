import { Router } from 'express';

import { addReport, editReport } from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReportSchema, updateReportSchema } from '../validators/report.validator.js';

export const reportRoutes = Router();

reportRoutes.use(requireAuth);

reportRoutes.post('/', validate(createReportSchema), addReport);
reportRoutes.put('/:id', validate(updateReportSchema), editReport);
