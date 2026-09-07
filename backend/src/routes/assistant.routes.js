import { Router } from 'express';

import { chat } from '../controllers/assistant.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { chatBodySchema } from '../validators/assistant.validator.js';

export const assistantRoutes = Router();

assistantRoutes.use(requireAuth, requireRole('manager'));

assistantRoutes.post('/chat', validate(chatBodySchema), chat);
