import { isValidObjectId } from 'mongoose';

import { User } from '../models/User.js';
import { listProjects } from './project.service.js';
import { listAllReports } from './report.service.js';
import {
  formatMembersForPrompt,
  formatProjectsForPrompt,
  formatReportsForPrompt
} from '../utils/reportContext.js';

const SEARCH_LIMIT = 50;

const SEARCHABLE_STATUSES = ['submitted', 'needs_correction', 'approved'];

export const assistantTools = [
  {
    type: 'function',
    function: {
      name: 'search_reports',
      description:
        'Search submitted weekly reports written by team members. Every filter is optional, and leaving them all out returns the most recent reports for the whole team. Call list_team_and_projects first when the question names a person or a project, because this tool needs their id.',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Only return reports written by this member.'
          },
          projectId: {
            type: 'string',
            description: 'Only return reports for this project.'
          },
          from: {
            type: 'string',
            description:
              'Earliest week to include, as a YYYY-MM-DD date. Any date inside a week selects that whole week.'
          },
          to: {
            type: 'string',
            description:
              'Latest week to include, as a YYYY-MM-DD date. Any date inside a week selects that whole week.'
          },
          status: {
            type: 'string',
            enum: SEARCHABLE_STATUSES,
            description: 'Only return reports in this review state.'
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_team_and_projects',
      description:
        'List the active team members and the projects, each with the id that search_reports needs. Use this to turn a name mentioned in the question into an id.',
      parameters: { type: 'object', properties: {}, required: [] }
    }
  }
];

function validId(value) {
  return isValidObjectId(value) ? value : undefined;
}

function validDate(value) {
  return value && !Number.isNaN(new Date(value).getTime()) ? value : undefined;
}

function validStatus(value) {
  return SEARCHABLE_STATUSES.includes(value) ? value : undefined;
}

async function searchReports({ userId, projectId, from, to, status } = {}) {
  const { reports } = await listAllReports({
    userId: validId(userId),
    projectId: validId(projectId),
    from: validDate(from),
    to: validDate(to),
    status: validStatus(status),
    page: 1,
    limit: SEARCH_LIMIT
  });

  return formatReportsForPrompt(reports);
}

async function listTeamAndProjects() {
  const [members, projects] = await Promise.all([
    User.find({ role: 'member', isActive: true }).sort({ name: 1 }).select('name'),
    listProjects()
  ]);

  return [
    'Team members:',
    formatMembersForPrompt(members),
    '',
    'Projects:',
    formatProjectsForPrompt(projects)
  ].join('\n');
}

const toolHandlers = {
  search_reports: searchReports,
  list_team_and_projects: listTeamAndProjects
};

export async function runAssistantTool(name, args) {
  const handler = toolHandlers[name];

  if (!handler) {
    return `Unknown tool: ${name}`;
  }

  try {
    return await handler(args);
  } catch (error) {
    return `That lookup failed: ${error.message}`;
  }
}
