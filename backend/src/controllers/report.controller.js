import { createReport, submitReport, updateReport } from '../services/report.service.js';
import { toPublicReport } from '../utils/publicReport.js';

export async function addReport(req, res) {
  const report = await createReport(req.body, req.user._id);

  res.status(201).json({ success: true, data: toPublicReport(report) });
}

export async function editReport(req, res) {
  const report = await updateReport(req.params.id, req.body, req.user._id);

  res.json({ success: true, data: toPublicReport(report) });
}

export async function submitReportForReview(req, res) {
  const report = await submitReport(req.params.id, req.user._id);

  res.json({ success: true, data: toPublicReport(report) });
}
