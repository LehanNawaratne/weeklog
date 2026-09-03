import mongoose from 'mongoose';

import { reportContentFields } from './reportContent.schema.js';

const reportVersionSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  versionNumber: { type: Number, required: true, min: 1 },
  content: reportContentFields,
  submittedAt: { type: Date, default: Date.now }
});

reportVersionSchema.index({ reportId: 1, versionNumber: 1 }, { unique: true });

export const ReportVersion = mongoose.model('ReportVersion', reportVersionSchema);
