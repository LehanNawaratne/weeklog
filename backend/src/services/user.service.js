import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export function listUsers() {
  return User.find().sort({ name: 1 });
}

async function findUserOrFail(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}

export async function changeUserRole(userId, role) {
  const user = await findUserOrFail(userId);

  if (user.role === role) {
    return user;
  }

  if (user.role === 'manager') {
    const managerCount = await User.countDocuments({ role: 'manager', isActive: true });

    if (managerCount <= 1) {
      throw new ApiError(400, 'Cannot demote the last remaining manager');
    }
  }

  user.role = role;
  await user.save();

  return user;
}

export async function assignProjectsToUser(userId, projectIds) {
  const user = await findUserOrFail(userId);
  const existingCount = await Project.countDocuments({ _id: { $in: projectIds } });

  if (existingCount !== projectIds.length) {
    throw new ApiError(400, 'One or more of those projects do not exist');
  }

  user.assignedProjects = projectIds;

  return user.save();
}
