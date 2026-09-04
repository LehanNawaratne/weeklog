import { Project } from '../models/Project.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

async function ensureNameIsFree(name, excludeId) {
  const query = excludeId ? { name, _id: { $ne: excludeId } } : { name };
  const existing = await Project.findOne(query);

  if (existing) {
    throw new ApiError(409, 'A project with this name already exists');
  }
}

async function findProjectOrFail(projectId) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return project;
}

export function listProjects() {
  return Project.find().sort({ name: 1 });
}

export async function createProject({ name, description }, createdBy) {
  await ensureNameIsFree(name);

  return Project.create({ name, description, createdBy });
}

export async function updateProject(projectId, changes) {
  const project = await findProjectOrFail(projectId);

  if (changes.name && changes.name !== project.name) {
    await ensureNameIsFree(changes.name, project._id);
  }

  Object.assign(project, changes);

  return project.save();
}

export async function deleteProject(projectId) {
  const project = await findProjectOrFail(projectId);
  const reportCount = await Report.countDocuments({ projectId });

  if (reportCount > 0) {
    throw new ApiError(
      409,
      `This project is used by ${reportCount} report${reportCount === 1 ? '' : 's'} and cannot be deleted`
    );
  }

  await User.updateMany({ assignedProjects: projectId }, { $pull: { assignedProjects: projectId } });

  await project.deleteOne();
}
