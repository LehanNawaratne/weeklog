import bcrypt from 'bcryptjs';

import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const isFirstUser = (await User.countDocuments()) === 0;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return User.create({
    name,
    email,
    passwordHash,
    role: isFirstUser ? 'manager' : 'member'
  });
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  return user;
}
