import {
  assignProjectsToUser,
  changeUserRole,
  getUserWithStats,
  inviteUser,
  listUsers
} from '../services/user.service.js';
import { toPublicUser } from '../utils/publicUser.js';

export async function getUsers(req, res) {
  const { users, total, page, limit } = await listUsers(req.validatedQuery);

  res.json({
    success: true,
    data: users.map(toPublicUser),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function getUserById(req, res) {
  const { user, reportStats } = await getUserWithStats(req.params.id, req.user);

  res.json({ success: true, data: { ...toPublicUser(user), reportStats } });
}

export async function updateUserRole(req, res) {
  const user = await changeUserRole(req.params.id, req.body.role);

  res.json({ success: true, data: toPublicUser(user) });
}

export async function updateUserProjects(req, res) {
  const user = await assignProjectsToUser(req.params.id, req.body.projectIds);

  res.json({ success: true, data: toPublicUser(user) });
}

export async function postUserInvite(req, res) {
  const { user, token } = await inviteUser(req.body);

  res.status(201).json({ success: true, data: { ...toPublicUser(user), inviteToken: token } });
}
