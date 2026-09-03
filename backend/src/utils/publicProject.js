export function toPublicProject(project) {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    createdBy: project.createdBy,
    createdAt: project.createdAt
  };
}
