import mongoose from 'mongoose';

import { reportContentFields } from './reportContent.schema.js';

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'needs_correction', 'approved'],
      default: 'draft'
    },
    ...reportContentFields,
    latestComment: { type: String, trim: true, default: '' },
    currentVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReportVersion',
      default: null
    },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

reportSchema.index({ userId: 1, weekStart: 1 }, { unique: true });
reportSchema.index({ weekStart: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ projectId: 1 });

export const Report = mongoose.model('Report', reportSchema);
