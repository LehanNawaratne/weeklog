import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ['member', 'manager'], default: 'member' },
    accountStatus: { type: String, enum: ['invited', 'active'], default: 'active' },
    inviteTokenHash: { type: String, select: false },
    inviteExpiresAt: { type: Date, select: false },
    assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
