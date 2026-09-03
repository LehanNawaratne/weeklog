import { loginUser, registerUser } from '../services/auth.service.js';
import { toPublicUser } from '../utils/publicUser.js';
import { clearCookieOptions, cookieOptions, signToken } from '../utils/token.js';

export async function register(req, res) {
  const user = await registerUser(req.body);

  res.cookie('token', signToken(user), cookieOptions);
  res.status(201).json({ success: true, data: toPublicUser(user) });
}

export async function login(req, res) {
  const user = await loginUser(req.body);

  res.cookie('token', signToken(user), cookieOptions);
  res.json({ success: true, data: toPublicUser(user) });
}

export function logout(req, res) {
  res.clearCookie('token', clearCookieOptions);
  res.json({ success: true, message: 'Logged out' });
}
