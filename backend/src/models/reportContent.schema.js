import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    taskName: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    plannedPct: { type: Number, min: 0, max: 100, default: 0 },
    actualPct: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ['completed', 'in_progress', 'blocked'],
      default: 'in_progress'
    },
    timePlanned: { type: Number, min: 0, default: 0 },
    timeSpent: { type: Number, min: 0, default: 0 },
    output: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const blockerSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    isKeyIssue: { type: Boolean, default: false }
  },
  { _id: false }
);

const achievementSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    isKeyAchievement: { type: Boolean, default: false }
  },
  { _id: false }
);

export const reportContentFields = {
  tasksCompleted: { type: [taskSchema], default: [] },
  tasksPlannedNextWeek: { type: [String], default: [] },
  blockers: { type: [blockerSchema], default: [] },
  achievements: { type: [achievementSchema], default: [] },
  hoursByType: {
    development: { type: Number, min: 0, default: 0 },
    testing: { type: Number, min: 0, default: 0 },
    meetings: { type: Number, min: 0, default: 0 },
    documentation: { type: Number, min: 0, default: 0 }
  },
  notes: { type: String, trim: true, default: '' }
};
