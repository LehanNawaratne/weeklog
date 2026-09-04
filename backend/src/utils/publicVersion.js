export function toPublicVersion(version) {
  return {
    id: version._id,
    reportId: version.reportId,
    versionNumber: version.versionNumber,
    content: version.content,
    submittedAt: version.submittedAt
  };
}
