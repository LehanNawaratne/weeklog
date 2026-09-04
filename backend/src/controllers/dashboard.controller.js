import { getSummary } from '../services/dashboard.service.js';

export async function getDashboardSummary(req, res) {
  const summary = await getSummary(req.validatedQuery.weekStart);

  res.json({ success: true, data: summary });
}
