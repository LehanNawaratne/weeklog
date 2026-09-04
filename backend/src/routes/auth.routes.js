import { Router } from 'express';

import {
  acceptInvitation,
  login,
  logout,
  me,
  register
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  acceptInviteSchema,
  loginSchema,
  registerSchema
} from '../validators/auth.validator.js';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), register);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.post('/logout', logout);
authRoutes.post('/accept-invite', validate(acceptInviteSchema), acceptInvitation);
authRoutes.get('/me', requireAuth, me);
