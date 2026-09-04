export function toPublicComment(comment) {
  return {
    id: comment._id,
    reportId: comment.reportId,
    versionId: comment.versionId,
    manager: comment.managerId && { id: comment.managerId._id, name: comment.managerId.name },
    action: comment.action,
    comment: comment.comment,
    createdAt: comment.createdAt
  };
}
