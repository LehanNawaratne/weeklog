import bcrypt from 'bcryptjs';

import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { hashInviteToken } from '../utils/inviteToken.js';

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

  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  return user;
}

export async function acceptInvite({ token, password }) {
  const user = await User.findOne({
    inviteTokenHash: hashInviteToken(token),
    accountStatus: 'invited'
  }).select('+inviteExpiresAt');

  if (!user) {
    throw new ApiError(400, 'This invitation is not valid');
  }

  if (user.inviteExpiresAt < new Date()) {
    throw new ApiError(400, 'This invitation has expired');
  }

  user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  user.accountStatus = 'active';
  user.inviteTokenHash = undefined;
  user.inviteExpiresAt = undefined;

  return user.save();
}
