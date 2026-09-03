export function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    assignedProjects: user.assignedProjects,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
}
