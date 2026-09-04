import { z } from 'zod';

import { objectId, paginationFields } from './common.js';

const percentage = (label) =>
  z
    .number()
    .min(0, `${label} cannot be negative`)
    .max(100, `${label} cannot be more than 100`);

const hours = (label) => z.number().min(0, `${label} cannot be negative`).default(0);

const taskSchema = z.object({
  taskName: z.string().trim().min(1, 'Task name is required'),
  priority: z.enum(['low', 'medium', 'high'], {
    error: 'Priority must be low, medium or high'
  }),
  plannedPct: percentage('Planned %'),
  actualPct: percentage('Actual %'),
  status: z.enum(['completed', 'in_progress', 'blocked'], {
    error: 'Task status must be completed, in_progress or blocked'
  }),
  timePlanned: hours('Time planned'),
  timeSpent: hours('Time spent'),
  output: z.string().trim().default('')
});

const blockerSchema = z.object({
  text: z.string().trim().min(1, 'Blocker text is required'),
  isKeyIssue: z.boolean().default(false)
});

const achievementSchema = z.object({
  text: z.string().trim().min(1, 'Achievement text is required'),
  isKeyAchievement: z.boolean().default(false)
});

const atMostOneFlagged = (flag, message) => [
  (items) => items.filter((item) => item[flag]).length <= 1,
  { error: message }
];

export const createReportSchema = z.object({
  weekStart: z.coerce.date({ error: 'Provide a valid date inside the week' }),
  projectId: objectId
});

export const updateReportSchema = z.object({
  projectId: objectId,
  tasksCompleted: z.array(taskSchema).default([]),
  tasksPlannedNextWeek: z.array(z.string().trim().min(1, 'Task cannot be empty')).default([]),
  blockers: z
    .array(blockerSchema)
    .default([])
    .refine(...atMostOneFlagged('isKeyIssue', 'Only one blocker can be the key issue')),
  achievements: z
    .array(achievementSchema)
    .default([])
    .refine(...atMostOneFlagged('isKeyAchievement', 'Only one achievement can be the key highlight')),
  hoursByType: z
    .object({
      development: hours('Development hours'),
      testing: hours('Testing hours'),
      meetings: hours('Meeting hours'),
      documentation: hours('Documentation hours')
    })
    .default({ development: 0, testing: 0, meetings: 0, documentation: 0 }),
  notes: z.string().trim().max(2000, 'Notes cannot be longer than 2000 characters').default('')
});

export const listReportsQuerySchema = z.object({
  status: z
    .enum(['draft', 'submitted', 'needs_correction', 'approved'], {
      error: 'Unknown report status'
    })
    .optional(),
  projectId: objectId.optional(),
  from: z.coerce.date({ error: 'Provide a valid from date' }).optional(),
  to: z.coerce.date({ error: 'Provide a valid to date' }).optional(),
  ...paginationFields
});

export const listAllReportsQuerySchema = listReportsQuerySchema
  .omit({ status: true })
  .extend({
    userId: objectId.optional(),
    status: z
      .enum(['submitted', 'needs_correction', 'approved'], {
        error: 'A manager can only filter by submitted, needs_correction or approved'
      })
      .optional()
  });

export const reviewReportSchema = z
  .object({
    action: z.enum(['approve', 'request_changes'], {
      error: 'Action must be approve or request_changes'
    }),
    comment: z.string().trim().max(2000, 'Comment cannot be longer than 2000 characters').default('')
  })
  .refine((review) => review.action === 'approve' || review.comment.length > 0, {
    error: 'A comment is required when requesting changes',
    path: ['comment']
  });
