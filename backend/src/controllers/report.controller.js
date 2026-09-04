import {
  createReport,
  getMyReport,
  listAllReports,
  listMyReports,
  listReportVersions,
  submitReport,
  updateReport
} from '../services/report.service.js';
import { toPublicReport, toReportSummary } from '../utils/publicReport.js';
import { toPublicVersion } from '../utils/publicVersion.js';

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

export async function getMyReports(req, res) {
  const { reports, total, page, limit } = await listMyReports(req.user._id, req.validatedQuery);

  res.json({
    success: true,
    data: reports.map(toPublicReport),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}

export async function getMyReportById(req, res) {
  const report = await getMyReport(req.params.id, req.user._id);

  res.json({ success: true, data: toPublicReport(report) });
}

export async function getReportVersions(req, res) {
  const versions = await listReportVersions(req.params.id, req.user);

  res.json({ success: true, data: versions.map(toPublicVersion) });
}

export async function getAllReports(req, res) {
  const { reports, total, page, limit } = await listAllReports(req.validatedQuery);

  res.json({
    success: true,
    data: reports.map(toReportSummary),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}
