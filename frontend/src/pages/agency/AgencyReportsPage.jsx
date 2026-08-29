import React, { useState, useEffect } from 'react';
import { fetchAgencyReportsApi } from '../../services/api/agencyApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  BarChart3,
  Layers,
  FileCheck,
  Banknote,
  AlertTriangle,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';

const AgencyReportsContent = () => {
  const [reports, setReports] = useState(null);
  const [activeReportTab, setActiveReportTab] = useState('PROJECT_PROGRESS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyReportsApi().then((data) => {
      if (data) setReports(data);
      setLoading(false);
    });
  }, []);

  const defaultReports = {
    generatedAt: '2026-08-28 23:15:00',
    projectProgress: [
      { projectId: 'PRJ-001', name: 'Delhi–Meerut Expressway Expansion (NH-348)', district: 'Agra', progress: 65.2, status: 'ACTIVE', startDate: '2024-01-15', expectedCompletion: '2027-03-31', affectedParcels: 124 },
      { projectId: 'PRJ-002', name: 'Agra Western Ring Road Phase-2', district: 'Agra', progress: 76.5, status: 'ACTIVE', startDate: '2024-06-01', expectedCompletion: '2026-12-31', affectedParcels: 48 },
      { projectId: 'PRJ-005', name: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', progress: 69.3, status: 'ACTIVE', startDate: '2024-03-10', expectedCompletion: '2026-10-31', affectedParcels: 96 },
      { projectId: 'PRJ-011', name: 'Lucknow Ring Road Phase-3 Infrastructure Belt', district: 'Lucknow', progress: 62.7, status: 'ACTIVE', startDate: '2024-09-01', expectedCompletion: '2027-06-30', affectedParcels: 82 },
    ],
    acquisitionProgress: [
      { projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', district: 'Agra', totalParcels: 124, verified: 98, pending: 12, acquired: 84, disputed: 14, progress: 67.7 },
      { projectId: 'PRJ-002', projectName: 'Agra Western Ring Road Phase-2', district: 'Agra', totalParcels: 48, verified: 42, pending: 6, acquired: 36, disputed: 4, progress: 75.0 },
      { projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', totalParcels: 96, verified: 74, pending: 22, acquired: 65, disputed: 9, progress: 67.7 },
      { projectId: 'PRJ-011', projectName: 'Lucknow Ring Road Phase-3', district: 'Lucknow', totalParcels: 82, verified: 60, pending: 22, acquired: 51, disputed: 9, progress: 62.2 },
    ],
    compensationRnR: [
      { projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', district: 'Agra', eligible: 124, approved: 110, completedPaid: 84.5, pending: 22.5, rrCompleted: 380, rrPending: 70 },
      { projectId: 'PRJ-002', projectName: 'Agra Western Ring Road Phase-2', district: 'Agra', eligible: 48, approved: 45, completedPaid: 38.2, pending: 8.4, rrCompleted: 150, rrPending: 30 },
      { projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', eligible: 96, approved: 82, completedPaid: 64.0, pending: 18.0, rrCompleted: 310, rrPending: 70 },
      { projectId: 'PRJ-011', projectName: 'Lucknow Ring Road Phase-3', district: 'Lucknow', eligible: 82, approved: 70, completedPaid: 56.4, pending: 18.2, rrCompleted: 240, rrPending: 70 },
    ],
    pendingIssues: [
      { id: 'ISSUE-PIA-001', issue: 'High-Tension Power Transmission Line Utility Shift Delay', projectId: 'PRJ-001', parcelCase: 'Khasra 102', priority: 'HIGH', status: 'IN_PROGRESS', date: '2026-08-14' },
      { id: 'ISSUE-PIA-002', issue: 'Khasra 103 Commercial Orchard Valuation Re-assessment', projectId: 'PRJ-001', parcelCase: 'Khasra 103', priority: 'MEDIUM', status: 'UNDER_REVIEW', date: '2026-08-20' },
      { id: 'ISSUE-PIA-003', issue: 'Forest Stage-II Clearance Bottleneck for Canal Diversion', projectId: 'PRJ-002', parcelCase: 'Reserved Forest', priority: 'CRITICAL', status: 'OPEN', date: '2026-08-22' },
    ],
  };

  const r = reports || defaultReports;

  const exportCSV = () => {
    let rows = [];
    if (activeReportTab === 'PROJECT_PROGRESS') {
      rows = [['Project ID', 'Project Name', 'District', 'Progress %', 'Status', 'Start Date', 'Expected Completion', 'Affected Parcels']];
      r.projectProgress?.forEach((p) => {
        rows.push([p.projectId, p.name, p.district, `${p.progress}%`, p.status, p.startDate, p.expectedCompletion, p.affectedParcels]);
      });
    } else if (activeReportTab === 'ACQUISITION_PROGRESS') {
      rows = [['Project ID', 'Project Name', 'District', 'Total Parcels', 'Verified', 'Pending', 'Acquired', 'Disputed', 'Progress %']];
      r.acquisitionProgress?.forEach((a) => {
        rows.push([a.projectId, a.projectName, a.district, a.totalParcels, a.verified, a.pending, a.acquired, a.disputed, `${a.progress}%`]);
      });
    } else if (activeReportTab === 'COMPENSATION_RNR') {
      rows = [['Project ID', 'Project Name', 'District', 'Eligible Awards', 'Approved Awards', 'Paid (Cr)', 'Pending (Cr)', 'PAF Resettled', 'PAF Pending']];
      r.compensationRnR?.forEach((c) => {
        rows.push([c.projectId, c.projectName, c.district, c.eligible, c.approved, c.completedPaid, c.pending, c.rrCompleted, c.rrPending]);
      });
    } else {
      rows = [['Issue ID', 'Project ID', 'Issue Title', 'Parcel/Case', 'Priority', 'Status', 'Date']];
      r.pendingIssues?.forEach((i) => {
        rows.push([i.id, i.projectId, i.issue, i.parcelCase, i.priority, i.status, i.date]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PIA_Report_${activeReportTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-50 text-cyan-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase tracking-wider flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-700" />
              <span>Implementation Analytics</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Assigned Corridors</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-600" />
            <span>Assigned Projects Statutory Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive summaries of physical execution progress, land acquisition handovers, compensation disbursements, and active site roadblocks.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 4 Report Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveReportTab('PROJECT_PROGRESS')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'PROJECT_PROGRESS'
              ? 'bg-cyan-50/80 border-cyan-300 ring-2 ring-cyan-500/20 text-cyan-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <Layers className="w-5 h-5 text-cyan-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Project Progress</div>
            <div className="text-[10px] text-slate-500">Milestones & completion</div>
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('ACQUISITION_PROGRESS')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'ACQUISITION_PROGRESS'
              ? 'bg-cyan-50/80 border-cyan-300 ring-2 ring-cyan-500/20 text-cyan-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Acquisition Progress</div>
            <div className="text-[10px] text-slate-500">Parcels, verified, acquired</div>
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('COMPENSATION_RNR')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'COMPENSATION_RNR'
              ? 'bg-cyan-50/80 border-cyan-300 ring-2 ring-cyan-500/20 text-cyan-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <Banknote className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Compensation / R&R</div>
            <div className="text-[10px] text-slate-500">PFMS DBT & PAF support</div>
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('PENDING_ISSUES')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'PENDING_ISSUES'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 text-amber-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Pending Issues</div>
            <div className="text-[10px] text-slate-500">Site roadblocks & delays</div>
          </div>
        </button>
      </div>

      {/* Active Report Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800">
            {activeReportTab === 'PROJECT_PROGRESS' && '1. Assigned Infrastructure Packages — Physical Progress Summary'}
            {activeReportTab === 'ACQUISITION_PROGRESS' && '2. Right of Way Land Acquisition & Demarcation Summary'}
            {activeReportTab === 'COMPENSATION_RNR' && '3. Compensation Awards & PAF Rehabilitation Summary'}
            {activeReportTab === 'PENDING_ISSUES' && '4. Active Site Impediments & Departmental Roadblocks'}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Generated: {r.generatedAt || '2026-08-28'}
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* 1. Project Progress */}
          {activeReportTab === 'PROJECT_PROGRESS' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4 text-center">Affected Parcels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.projectProgress?.map((p) => (
                  <tr key={p.projectId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-700">{p.projectId}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 font-bold">{p.district}</td>
                    <td className="py-3 px-4 text-center font-black text-cyan-700">{p.progress}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">{p.startDate}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">{p.expectedCompletion}</td>
                    <td className="py-3 px-4 text-center font-bold">{p.affectedParcels}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 2. Acquisition Progress */}
          {activeReportTab === 'ACQUISITION_PROGRESS' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Total Parcels</th>
                  <th className="py-3 px-4 text-center">Verified</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                  <th className="py-3 px-4 text-center">Acquired</th>
                  <th className="py-3 px-4 text-center">Disputed</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.acquisitionProgress?.map((a) => (
                  <tr key={a.projectId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-700">{a.projectId}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{a.projectName}</td>
                    <td className="py-3 px-4 font-bold">{a.district}</td>
                    <td className="py-3 px-4 text-center font-bold">{a.totalParcels}</td>
                    <td className="py-3 px-4 text-center font-bold text-cyan-700">{a.verified}</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-700">{a.pending}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{a.acquired}</td>
                    <td className="py-3 px-4 text-center font-bold text-rose-700">{a.disputed}</td>
                    <td className="py-3 px-4 text-center font-black text-cyan-700">{a.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 3. Compensation / R&R */}
          {activeReportTab === 'COMPENSATION_RNR' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Eligible Awards</th>
                  <th className="py-3 px-4 text-center">Approved Awards</th>
                  <th className="py-3 px-4 text-center">Paid (Cr)</th>
                  <th className="py-3 px-4 text-center">Pending (Cr)</th>
                  <th className="py-3 px-4 text-center">PAF Resettled</th>
                  <th className="py-3 px-4 text-center">PAF Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.compensationRnR?.map((c) => (
                  <tr key={c.projectId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-700">{c.projectId}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{c.projectName}</td>
                    <td className="py-3 px-4 font-bold">{c.district}</td>
                    <td className="py-3 px-4 text-center font-bold">{c.eligible}</td>
                    <td className="py-3 px-4 text-center font-bold text-cyan-700">{c.approved}</td>
                    <td className="py-3 px-4 text-center font-black text-emerald-700">₹{c.completedPaid} Cr</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-700">₹{c.pending} Cr</td>
                    <td className="py-3 px-4 text-center font-bold text-purple-700">{c.rrCompleted || 0}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{c.rrPending || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 4. Pending Issues */}
          {activeReportTab === 'PENDING_ISSUES' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Issue ID</th>
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Roadblock Title</th>
                  <th className="py-3 px-4">Parcel / Chainage</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Reported Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.pendingIssues?.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-amber-800">{i.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-700">{i.projectId}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{i.issue}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{i.parcelCase}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold text-[10px]">
                        {i.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">
                        {i.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">{i.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export const AgencyReportsPage = () => (
  <ErrorBoundary>
    <AgencyReportsContent />
  </ErrorBoundary>
);

export default AgencyReportsPage;
