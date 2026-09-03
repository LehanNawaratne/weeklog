import { createReport } from '../services/report.service.js';
import { toPublicReport } from '../utils/publicReport.js';

export async function addReport(req, res) {
  const report = await createReport(req.body, req.user._id);

  res.status(201).json({ success: true, data: toPublicReport(report) });
}
