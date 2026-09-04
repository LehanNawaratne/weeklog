import { Router } from 'express';

import {
  acceptInvitation,
  login,
  logout,
  me,
  register,
  updateMyPassword,
  updateMyProfile
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  acceptInviteSchema,
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema
} from '../validators/auth.validator.js';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), register);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.post('/logout', logout);
authRoutes.post('/accept-invite', validate(acceptInviteSchema), acceptInvitation);
authRoutes.get('/me', requireAuth, me);
authRoutes.patch('/me', requireAuth, validate(updateProfileSchema), updateMyProfile);
authRoutes.patch(
  '/me/password',
  requireAuth,
  validate(changePasswordSchema),
  updateMyPassword
);
