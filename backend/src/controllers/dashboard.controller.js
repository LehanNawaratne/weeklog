import { getActivity, getChart, getSummary } from '../services/dashboard.service.js';

export async function getDashboardSummary(req, res) {
  const summary = await getSummary(req.validatedQuery.weekStart);

  res.json({ success: true, data: summary });
}

export async function getDashboardChart(req, res) {
  const { type, ...range } = req.validatedQuery;
  const chart = await getChart(type, range);

  res.json({ success: true, data: { type, ...chart } });
}

export async function getDashboardActivity(req, res) {
  const activity = await getActivity(req.validatedQuery.limit);

  res.json({ success: true, data: activity });
}
