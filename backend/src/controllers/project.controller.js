import {
  createProject,
  deleteProject,
  listProjects,
  updateProject
} from '../services/project.service.js';
import { toPublicProject } from '../utils/publicProject.js';

export async function getProjects(req, res) {
  const projects = await listProjects();

  res.json({ success: true, data: projects.map(toPublicProject) });
}

export async function addProject(req, res) {
  const project = await createProject(req.body, req.user._id);

  res.status(201).json({ success: true, data: toPublicProject(project) });
}

export async function editProject(req, res) {
  const project = await updateProject(req.params.id, req.body);

  res.json({ success: true, data: toPublicProject(project) });
}

export async function removeProject(req, res) {
  await deleteProject(req.params.id);

  res.json({ success: true, message: 'Project deleted' });
}
