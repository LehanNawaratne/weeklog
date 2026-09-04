import 'dotenv/config';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { connectDB } from '../config/db.js';
import { Project } from '../models/Project.js';
import { Report } from '../models/Report.js';
import { ReportVersion } from '../models/ReportVersion.js';
import { ReviewComment } from '../models/ReviewComment.js';
import { User } from '../models/User.js';
import { getSubmissionDeadline, getWeekRange } from '../utils/week.js';
import {
  contentLibrary,
  projectAssignments,
  reviewComments,
  SEED_PASSWORD,
  seedProjects,
  seedUsers,
  weeklyPlan
} from './data.js';

const WEEKS = 6;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;

const pick = (list, index) => list[index % list.length];

function weekStarts() {
  const { weekStart: currentWeek } = getWeekRange(new Date());

  return Array.from({ length: WEEKS }, (unused, index) =>
    getWeekRange(new Date(currentWeek.getTime() - (WEEKS - 1 - index) * WEEK_IN_MS))
  );
}

async function wipe() {
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Report.deleteMany({}),
    ReportVersion.deleteMany({}),
    ReviewComment.deleteMany({})
  ]);
}

async function createUsers() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const byKey = {};

  for (const person of seedUsers) {
    byKey[person.key] = await User.create({
      name: person.name,
      email: person.email,
      passwordHash,
      role: person.role,
      accountStatus: 'active'
    });
  }

  return byKey;
}

async function createProjects(manager) {
  const byKey = {};

  for (const project of seedProjects) {
    byKey[project.key] = await Project.create({ ...project, createdBy: manager._id });
  }

  return byKey;
}

async function assignProjects(users, projects) {
  for (const [userKey, projectKeys] of Object.entries(projectAssignments)) {
    users[userKey].assignedProjects = projectKeys.map((key) => projects[key]._id);
    await users[userKey].save();
  }
}

async function snapshot(report, submittedAt, versionNumber) {
  return ReportVersion.create({
    reportId: report._id,
    versionNumber,
    submittedAt,
    content: {
      tasksCompleted: report.tasksCompleted,
      tasksPlannedNextWeek: report.tasksPlannedNextWeek,
      blockers: report.blockers,
      achievements: report.achievements,
      hoursByType: report.hoursByType,
      notes: report.notes
    }
  });
}

async function comment(report, version, manager, action, text, createdAt) {
  const entry = new ReviewComment({
    reportId: report._id,
    versionId: version._id,
    managerId: manager._id,
    action,
    comment: text
  });

  entry.createdAt = createdAt;
  entry.updatedAt = createdAt;

  return entry.save({ timestamps: false });
}

async function buildReport({ user, project, week, plan, manager, contentIndex, commentIndex }) {
  const content = pick(contentLibrary[plan.project], contentIndex);
  const deadline = getSubmissionDeadline(week.weekStart);

  const report = await Report.create({
    userId: user._id,
    projectId: project._id,
    weekStart: week.weekStart,
    weekEnd: week.weekEnd,
    status: 'draft',
    ...content
  });

  if (plan.status === 'draft') {
    return report;
  }

  const firstSubmittedAt = plan.late
    ? new Date(deadline.getTime() + 20 * HOUR_IN_MS)
    : new Date(deadline.getTime() - 26 * HOUR_IN_MS);

  const versionOne = await snapshot(report, firstSubmittedAt, 1);

  report.submittedAt = firstSubmittedAt;
  report.currentVersionId = versionOne._id;
  report.status = 'submitted';

  if (plan.status === 'submitted') {
    await report.save();
    return report;
  }

  if (plan.status === 'needs_correction') {
    const text = pick(reviewComments.requested, commentIndex);
    const at = new Date(firstSubmittedAt.getTime() + 5 * HOUR_IN_MS);

    await comment(report, versionOne, manager, 'requested_changes', text, at);

    report.status = 'needs_correction';
    report.latestComment = text;
    report.reviewedAt = at;
    await report.save();

    return report;
  }

  let reviewedVersion = versionOne;
  let approvedAt = new Date(firstSubmittedAt.getTime() + 6 * HOUR_IN_MS);

  if (plan.corrected) {
    const changeText = pick(reviewComments.requested, commentIndex);
    const sentBackAt = new Date(firstSubmittedAt.getTime() + 4 * HOUR_IN_MS);

    await comment(report, versionOne, manager, 'requested_changes', changeText, sentBackAt);

    const resubmittedAt = new Date(sentBackAt.getTime() + 20 * HOUR_IN_MS);

    reviewedVersion = await snapshot(report, resubmittedAt, 2);
    report.currentVersionId = reviewedVersion._id;
    approvedAt = new Date(resubmittedAt.getTime() + 3 * HOUR_IN_MS);
  }

  const approveText = pick(reviewComments.approved, commentIndex);

  await comment(report, reviewedVersion, manager, 'approved', approveText, approvedAt);

  report.status = 'approved';
  report.latestComment = approveText;
  report.reviewedAt = approvedAt;
  await report.save();

  return report;
}

async function run() {
  await connectDB();
  await wipe();

  const users = await createUsers();
  const projects = await createProjects(users.priya);

  await assignProjects(users, projects);

  const weeks = weekStarts();
  const counts = { draft: 0, submitted: 0, needs_correction: 0, approved: 0, notStarted: 0 };
  let contentIndex = 0;
  let commentIndex = 0;

  for (const [userKey, plans] of Object.entries(weeklyPlan)) {
    for (const [weekIndex, plan] of plans.entries()) {
      if (!plan.status) {
        counts.notStarted += 1;
        continue;
      }

      await buildReport({
        user: users[userKey],
        project: projects[plan.project],
        week: weeks[weekIndex],
        plan,
        manager: users.priya,
        contentIndex: contentIndex++,
        commentIndex: commentIndex++
      });

      counts[plan.status] += 1;
    }
  }

  console.log('');
  console.log(`users     ${await User.countDocuments()}`);
  console.log(`projects  ${await Project.countDocuments()}`);
  console.log(`reports   ${await Report.countDocuments()}`);
  console.log(`versions  ${await ReportVersion.countDocuments()}`);
  console.log(`comments  ${await ReviewComment.countDocuments()}`);
  console.log('');
  console.log(`draft ${counts.draft} | submitted ${counts.submitted} | needs correction ${counts.needs_correction} | approved ${counts.approved} | not started ${counts.notStarted}`);
  console.log('');
  console.log(`weeks     ${weeks[0].weekStart.toISOString().slice(0, 10)} to ${weeks.at(-1).weekStart.toISOString().slice(0, 10)}`);
  console.log(`log in as ${seedUsers[0].email} / ${SEED_PASSWORD}`);
  console.log('');

  await mongoose.connection.close();
}

run();
