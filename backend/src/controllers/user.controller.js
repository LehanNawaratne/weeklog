import {
  assignProjectsToUser,
  changeUserRole,
  listUsers
} from '../services/user.service.js';
import { toPublicUser } from '../utils/publicUser.js';

export async function getUsers(req, res) {
  const users = await listUsers();

  res.json({ success: true, data: users.map(toPublicUser) });
}

export async function updateUserRole(req, res) {
  const user = await changeUserRole(req.params.id, req.body.role);

  res.json({ success: true, data: toPublicUser(user) });
}

export async function updateUserProjects(req, res) {
  const user = await assignProjectsToUser(req.params.id, req.body.projectIds);

  res.json({ success: true, data: toPublicUser(user) });
}
