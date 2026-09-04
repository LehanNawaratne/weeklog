import { createHash, randomBytes } from 'node:crypto';

import { INVITE_EXPIRY_DAYS } from '../config/constants.js';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function hashInviteToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function createInviteToken() {
  const token = randomBytes(32).toString('hex');

  return {
    token,
    inviteTokenHash: hashInviteToken(token),
    inviteExpiresAt: new Date(Date.now() + INVITE_EXPIRY_DAYS * DAY_IN_MS)
  };
}
