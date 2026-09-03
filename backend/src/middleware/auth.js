import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, 'Not authenticated');
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Session expired, please log in again');
  }

  const user = await User.findById(payload.id);

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Not authenticated');
  }

  req.user = user;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    next();
  };
}
