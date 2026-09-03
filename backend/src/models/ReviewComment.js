import mongoose from 'mongoose';

const reviewCommentSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReportVersion',
      required: true
    },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['approved', 'requested_changes'], required: true },
    comment: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

reviewCommentSchema.index({ reportId: 1, createdAt: -1 });

export const ReviewComment = mongoose.model('ReviewComment', reviewCommentSchema);
