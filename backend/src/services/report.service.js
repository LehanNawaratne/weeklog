import { Project } from '../models/Project.js';
import { Report } from '../models/Report.js';
import { ApiError } from '../utils/ApiError.js';
import { getWeekRange } from '../utils/week.js';

export async function createReport({ weekStart, projectId }, userId) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const range = getWeekRange(weekStart);
  const existing = await Report.findOne({ userId, weekStart: range.weekStart });

  if (existing) {
    throw new ApiError(409, 'You already have a report for that week');
  }

  return Report.create({
    userId,
    projectId,
    weekStart: range.weekStart,
    weekEnd: range.weekEnd
  });
}
