export const SEED_PASSWORD = 'Password123';

export const seedUsers = [
  { key: 'priya', name: 'Priya Perera', email: 'priya@weeklog.app', role: 'manager' },
  { key: 'sam', name: 'Sam Fernando', email: 'sam@weeklog.app', role: 'member' },
  { key: 'nadia', name: 'Nadia Rahman', email: 'nadia@weeklog.app', role: 'member' },
  { key: 'kasun', name: 'Kasun Silva', email: 'kasun@weeklog.app', role: 'member' },
  { key: 'ayesha', name: 'Ayesha Jayawardena', email: 'ayesha@weeklog.app', role: 'member' }
];

export const seedProjects = [
  { key: 'clientA', name: 'Client A', description: 'Delivery work for our largest external client' },
  { key: 'tooling', name: 'Internal Tooling', description: 'Developer platform and internal services' },
  { key: 'research', name: 'R&D', description: 'Prototypes and technical spikes' },
  { key: 'marketing', name: 'Marketing Site', description: 'Public website and campaign pages' }
];

export const projectAssignments = {
  priya: ['clientA', 'tooling'],
  sam: ['clientA', 'tooling'],
  nadia: ['clientA', 'marketing'],
  kasun: ['tooling', 'research'],
  ayesha: ['marketing', 'research']
};

const DONE = 'completed';
const DOING = 'in_progress';
const STUCK = 'blocked';

const task = (taskName, priority, plannedPct, actualPct, status, timePlanned, timeSpent, output) => ({
  taskName,
  priority,
  plannedPct,
  actualPct,
  status,
  timePlanned,
  timeSpent,
  output
});

export const contentLibrary = {
  clientA: [
    {
      tasksCompleted: [
        task('Checkout redesign', 'high', 100, 100, DONE, 14, 15, 'PR #211 merged'),
        task('Payment retry logic', 'medium', 100, 100, DONE, 6, 5, 'PR #214 merged')
      ],
      tasksPlannedNextWeek: ['Start refund flow', 'Pair on the reporting screen'],
      blockers: [],
      achievements: [{ text: 'Checkout errors down 40% after the retry fix', isKeyAchievement: true }],
      hoursByType: { development: 20, testing: 6, meetings: 4, documentation: 2 },
      notes: 'Steady week, no surprises.'
    },
    {
      tasksCompleted: [
        task('Refund flow', 'high', 100, 70, DOING, 16, 12, 'Branch feature/refunds'),
        task('Client demo prep', 'medium', 100, 100, DONE, 4, 5, 'Slides shared')
      ],
      tasksPlannedNextWeek: ['Finish refund flow', 'Handle partial refunds'],
      blockers: [
        { text: 'Waiting on the payment provider sandbox account', isKeyIssue: true },
        { text: 'Staging database keeps resetting overnight', isKeyIssue: false }
      ],
      achievements: [{ text: 'Client signed off on the checkout redesign', isKeyAchievement: true }],
      hoursByType: { development: 18, testing: 3, meetings: 7, documentation: 1 },
      notes: 'Refunds slipped because of the sandbox delay.'
    },
    {
      tasksCompleted: [
        task('Partial refunds', 'high', 100, 100, DONE, 10, 11, 'PR #229 merged'),
        task('Invoice PDF export', 'low', 100, 60, DOING, 6, 4, 'Draft branch')
      ],
      tasksPlannedNextWeek: ['Finish invoice export', 'Write the refund runbook'],
      blockers: [{ text: 'PDF library licence still unconfirmed', isKeyIssue: true }],
      achievements: [{ text: 'Refund flow shipped end to end', isKeyAchievement: true }],
      hoursByType: { development: 17, testing: 5, meetings: 5, documentation: 3 },
      notes: ''
    }
  ],
  tooling: [
    {
      tasksCompleted: [
        task('Split the CI pipeline', 'high', 100, 100, DONE, 10, 9, 'Build time 11m -> 4m'),
        task('Flaky test cleanup', 'medium', 100, 80, DOING, 6, 7, '12 of 15 fixed')
      ],
      tasksPlannedNextWeek: ['Finish flaky tests', 'Add a deploy preview per PR'],
      blockers: [],
      achievements: [{ text: 'CI is now under five minutes', isKeyAchievement: true }],
      hoursByType: { development: 16, testing: 8, meetings: 3, documentation: 3 },
      notes: 'Good week for the platform.'
    },
    {
      tasksCompleted: [
        task('Deploy previews', 'high', 100, 100, DONE, 12, 14, 'Live on every PR'),
        task('Secrets rotation script', 'medium', 100, 40, STUCK, 8, 3, 'Blocked')
      ],
      tasksPlannedNextWeek: ['Unblock secrets rotation', 'Document the deploy flow'],
      blockers: [{ text: 'No access to the production secret store', isKeyIssue: true }],
      achievements: [{ text: 'Every PR now gets its own preview URL', isKeyAchievement: true }],
      hoursByType: { development: 14, testing: 4, meetings: 6, documentation: 4 },
      notes: 'Access request has been open for nine days.'
    },
    {
      tasksCompleted: [
        task('Deploy runbook', 'medium', 100, 100, DONE, 5, 4, 'Wiki page published'),
        task('Log aggregation spike', 'low', 100, 100, DONE, 8, 8, 'Comparison written up')
      ],
      tasksPlannedNextWeek: ['Pick a logging vendor', 'Start rollout plan'],
      blockers: [],
      achievements: [{ text: 'Runbook cut onboarding time for new deploys', isKeyAchievement: true }],
      hoursByType: { development: 9, testing: 2, meetings: 5, documentation: 8 },
      notes: ''
    }
  ],
  research: [
    {
      tasksCompleted: [
        task('Vector search prototype', 'high', 100, 100, DONE, 18, 20, 'Demo notebook'),
        task('Benchmark write-up', 'medium', 100, 100, DONE, 5, 4, 'Doc shared')
      ],
      tasksPlannedNextWeek: ['Try a smaller embedding model', 'Cost estimate'],
      blockers: [],
      achievements: [{ text: 'Search prototype beat the baseline by 30%', isKeyAchievement: true }],
      hoursByType: { development: 20, testing: 3, meetings: 2, documentation: 6 },
      notes: 'Promising direction.'
    },
    {
      tasksCompleted: [
        task('Smaller model trial', 'high', 100, 60, DOING, 14, 9, 'Partial results'),
        task('Cost model', 'medium', 100, 100, DONE, 4, 5, 'Spreadsheet')
      ],
      tasksPlannedNextWeek: ['Finish the trial', 'Present findings'],
      blockers: [{ text: 'GPU quota exhausted for the month', isKeyIssue: true }],
      achievements: [{ text: 'Costs projected 60% lower than the vendor option', isKeyAchievement: true }],
      hoursByType: { development: 15, testing: 4, meetings: 4, documentation: 3 },
      notes: 'Quota reset is on the 1st.'
    }
  ],
  marketing: [
    {
      tasksCompleted: [
        task('Campaign landing page', 'high', 100, 100, DONE, 12, 12, 'Live'),
        task('Analytics events', 'medium', 100, 100, DONE, 4, 3, 'Tracked in GA')
      ],
      tasksPlannedNextWeek: ['A/B test the hero copy', 'Fix mobile spacing'],
      blockers: [],
      achievements: [{ text: 'Landing page shipped two days early', isKeyAchievement: true }],
      hoursByType: { development: 13, testing: 3, meetings: 5, documentation: 2 },
      notes: ''
    },
    {
      tasksCompleted: [
        task('Hero copy A/B test', 'medium', 100, 100, DONE, 6, 6, 'Running'),
        task('Mobile spacing fixes', 'low', 100, 100, DONE, 4, 3, 'PR #77 merged'),
        task('Blog template', 'low', 100, 50, DOING, 8, 4, 'Draft')
      ],
      tasksPlannedNextWeek: ['Read the A/B results', 'Finish the blog template'],
      blockers: [{ text: 'Design has not delivered the blog mockups', isKeyIssue: true }],
      achievements: [{ text: 'Mobile bounce rate down 12%', isKeyAchievement: true }],
      hoursByType: { development: 11, testing: 4, meetings: 6, documentation: 2 },
      notes: 'Waiting on design for the blog work.'
    }
  ]
};

export const weeklyPlan = {
  priya: [
    { project: 'tooling', status: 'approved' },
    { project: 'tooling', status: 'approved' },
    { project: 'clientA', status: 'approved' },
    { project: 'tooling', status: 'approved' },
    { project: 'tooling', status: 'approved' },
    { project: 'tooling', status: 'submitted' }
  ],
  sam: [
    { project: 'clientA', status: 'approved' },
    { project: 'clientA', status: 'approved', corrected: true, late: true },
    { project: 'clientA', status: 'approved' },
    { project: 'clientA', status: 'needs_correction' },
    { project: 'clientA', status: 'approved' },
    { project: 'clientA', status: 'submitted' }
  ],
  nadia: [
    { project: 'marketing', status: 'approved' },
    { project: 'marketing', status: 'approved' },
    { project: null, status: null },
    { project: 'marketing', status: 'approved', corrected: true },
    { project: 'marketing', status: 'approved', late: true },
    { project: 'marketing', status: 'needs_correction' }
  ],
  kasun: [
    { project: 'tooling', status: 'approved' },
    { project: 'research', status: 'needs_correction' },
    { project: 'research', status: 'approved' },
    { project: 'tooling', status: 'approved' },
    { project: 'research', status: 'approved' },
    { project: 'research', status: 'draft' }
  ],
  ayesha: [
    { project: 'marketing', status: 'approved' },
    { project: 'research', status: 'approved' },
    { project: 'marketing', status: 'approved', corrected: true },
    { project: 'research', status: 'submitted' },
    { project: 'marketing', status: 'approved' },
    { project: null, status: null }
  ]
};

export const reviewComments = {
  requested: [
    'Please break the bigger tasks down - a single 16 hour row is hard to review.',
    'Actual percentages look optimistic against the hours spent. Can you double check?',
    'Add the blocker you mentioned in standup, it should be on the record here.',
    'Missing the deliverable link for the second task.'
  ],
  approved: [
    'Clear and complete, thanks.',
    'Good detail on the blockers, approved.',
    'Nice week. Approved.',
    ''
  ]
};
