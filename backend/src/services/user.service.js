import { Project } from '../models/Project.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export async function listUsers({ page, limit }) {
  const [users, total] = await Promise.all([
    User.find()
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments()
  ]);

  return { users, total, page, limit };
}

const countWhenStatusIs = (status) => ({ $sum: { $cond: [{ $eq: ['$status', status] }, 1, 0] } });

export async function getUserWithStats(userId, requester) {
  if (!requester._id.equals(userId) && requester.role !== 'manager') {
    throw new ApiError(403, 'You can only view your own profile');
  }

  const user = await findUserOrFail(userId);

  const [stats] = await Report.aggregate([
    { $match: { userId: user._id, submittedAt: { $ne: null } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        submitted: countWhenStatusIs('submitted'),
        needsCorrection: countWhenStatusIs('needs_correction'),
        approved: countWhenStatusIs('approved')
      }
    }
  ]);

  return {
    user,
    reportStats: {
      total: stats?.total ?? 0,
      submitted: stats?.submitted ?? 0,
      needsCorrection: stats?.needsCorrection ?? 0,
      approved: stats?.approved ?? 0
    }
  };
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
