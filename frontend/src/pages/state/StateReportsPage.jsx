import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStateReportsApi } from '../../services/api/stateApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  BarChart3,
  Building2,
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Layers,
  FileCheck,
  Banknote,
} from 'lucide-react';

const StateReportsContent = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState(null);
  const [activeReportTab, setActiveReportTab] = useState('DISTRICT_PROGRESS');
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    fetchStateReportsApi(stateName).then((data) => {
      if (data) setReports(data);
      setLoading(false);
    });
  }, [stateName]);

  const defaultReports = {
    state: stateName,
    generatedAt: '2026-08-28 22:30:00',
    districtProgress: [
      { district: 'Agra', projectsCount: 5, acquisitionProgress: 70.9, compensationPaidCr: 136.95, rrProgress: 81.0, delayedCases: 1, collectorName: 'Dr. Sunita Murthy, IAS' },
      { district: 'Meerut', projectsCount: 4, acquisitionProgress: 68.6, compensationPaidCr: 105.0, rrProgress: 78.4, delayedCases: 0, collectorName: 'Sh. Deepak Meena, IAS' },
      { district: 'Lucknow', projectsCount: 6, acquisitionProgress: 76.5, compensationPaidCr: 175.5, rrProgress: 86.2, delayedCases: 0, collectorName: 'Smt. Surya Pal Gangwar, IAS' },
      { district: 'Varanasi', projectsCount: 3, acquisitionProgress: 74.1, compensationPaidCr: 92.0, rrProgress: 84.0, delayedCases: 0, collectorName: 'Sh. S. Rajalingam, IAS' },
      { district: 'Prayagraj', projectsCount: 4, acquisitionProgress: 60.3, compensationPaidCr: 84.0, rrProgress: 69.5, delayedCases: 1, collectorName: 'Sh. Sanjay Kumar Khatri, IAS' },
    ],
    projectProgress: [
      { projectId: 'PRJ-001', name: 'Delhi–Meerut Expressway Expansion', district: 'Agra', progress: 65.2, status: 'ACTIVE', affectedParcels: 124, agency: 'NHAI' },
      { projectId: 'PRJ-002', name: 'Agra Western Ring Road Phase-2', district: 'Agra', progress: 76.5, status: 'ACTIVE', affectedParcels: 48, agency: 'NHAI & UP PWD' },
      { projectId: 'PRJ-003', name: 'Yamuna Expressway Interconnect Corridor', district: 'Gautam Buddha Nagar', progress: 43.8, status: 'DELAYED', affectedParcels: 64, agency: 'YEIDA' },
      { projectId: 'PRJ-005', name: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', progress: 69.3, status: 'ACTIVE', affectedParcels: 96, agency: 'NHAI' },
      { projectId: 'PRJ-006', name: 'Agra & Delhi Metro Rail Phase 4', district: 'Agra', progress: 88.6, status: 'ACTIVE', affectedParcels: 36, agency: 'UPMRC' },
    ],
    acquisitionSummary: [
      { projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', district: 'Agra', totalParcels: 124, verified: 98, pending: 12, acquired: 84, progress: 67.7 },
      { projectId: 'PRJ-002', projectName: 'Agra Western Ring Road Phase-2', district: 'Agra', totalParcels: 48, verified: 42, pending: 6, acquired: 36, progress: 75.0 },
      { projectId: 'PRJ-003', projectName: 'Yamuna Expressway Interconnect Corridor', district: 'Gautam Buddha Nagar', totalParcels: 64, verified: 40, pending: 24, acquired: 28, progress: 43.8 },
      { projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', totalParcels: 96, verified: 74, pending: 22, acquired: 65, progress: 67.7 },
    ],
    compensationRnRSummary: [
      { projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', district: 'Agra', eligible: 124, approved: 110, completedPaid: 84.5, pending: 22.5, rrCompleted: 380, rrPending: 70 },
      { projectId: 'PRJ-002', projectName: 'Agra Western Ring Road Phase-2', district: 'Agra', eligible: 48, approved: 45, completedPaid: 38.2, pending: 8.4, rrCompleted: 150, rrPending: 30 },
      { projectId: 'PRJ-003', projectName: 'Yamuna Expressway Interconnect', district: 'Gautam Buddha Nagar', eligible: 64, approved: 48, completedPaid: 42.0, pending: 26.5, rrCompleted: 160, rrPending: 80 },
    ],
  };

  const r = reports || defaultReports;

  const exportCSV = () => {
    let rows = [];
    if (activeReportTab === 'DISTRICT_PROGRESS') {
      rows = [['District', 'Projects Count', 'Acquisition %', 'Compensation Paid (Cr)', 'R&R %', 'Delayed Cases', 'Collector']];
      r.districtProgress?.forEach((d) => {
        rows.push([d.district, d.projectsCount, `${d.acquisitionProgress}%`, d.compensationPaidCr, `${d.rrProgress}%`, d.delayedCases, d.collectorName]);
      });
    } else if (activeReportTab === 'PROJECT_PROGRESS') {
      rows = [['Project ID', 'Project Name', 'District', 'Progress %', 'Status', 'Affected Parcels', 'Agency']];
      r.projectProgress?.forEach((p) => {
        rows.push([p.projectId, p.name, p.district, `${p.progress}%`, p.status, p.affectedParcels, p.agency]);
      });
    } else if (activeReportTab === 'ACQUISITION_SUMMARY') {
      rows = [['Project', 'District', 'Total Parcels', 'Verified', 'Pending', 'Acquired', 'Progress %']];
      r.acquisitionSummary?.forEach((a) => {
        rows.push([a.projectName, a.district, a.totalParcels, a.verified, a.pending, a.acquired, `${a.progress}%`]);
      });
    } else {
      rows = [['Project', 'District', 'Eligible Awards', 'Approved Awards', 'Compensation Paid (Cr)', 'Compensation Pending (Cr)', 'R&R Families Resettled', 'R&R Pending']];
      r.compensationRnRSummary?.forEach((c) => {
        rows.push([c.projectName, c.district, c.eligible, c.approved, c.completedPaid, c.pending, c.rrCompleted, c.rrPending]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `State_Report_${activeReportTab}_${stateName}.csv`);
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
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-700" />
              <span>State Statutory Dossiers</span>
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Statewide Infrastructure & Land Acquisition Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official statutory compilations for Cabinet briefings, Chief Secretary review, and inter-departmental audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Report Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveReportTab('DISTRICT_PROGRESS')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'DISTRICT_PROGRESS'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <div className="text-xs font-black">District-wise Progress</div>
            <div className="text-[10px] text-slate-500">Collectorate metrics & delays</div>
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('PROJECT_PROGRESS')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'PROJECT_PROGRESS'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <Layers className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Project-wise Progress</div>
            <div className="text-[10px] text-slate-500">Corridor possession %</div>
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('ACQUISITION_SUMMARY')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'ACQUISITION_SUMMARY'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Acquisition Summary</div>
            <div className="text-[10px] text-slate-500">Parcels, verified, acquired</div>
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('COMPENSATION_RNR')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'COMPENSATION_RNR'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <Banknote className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Compensation/R&R Summary</div>
            <div className="text-[10px] text-slate-500">PFMS DBT and PAF grants</div>
          </div>
        </button>
      </div>

      {/* Active Report Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800">
            {activeReportTab === 'DISTRICT_PROGRESS' && '1. District-wise Infrastructure & CALA Performance Dossier'}
            {activeReportTab === 'PROJECT_PROGRESS' && '2. State Linear Corridor & Project Milestone Dossier'}
            {activeReportTab === 'ACQUISITION_SUMMARY' && '3. Land Acquisition & Survey Boundary Reconciliation Summary'}
            {activeReportTab === 'COMPENSATION_RNR' && '4. RFCTLARR Award Disbursal & PAF Resettlement Dossier'}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Generated: {r.generatedAt || '2026-08-28'}
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* 1. District Progress */}
          {activeReportTab === 'DISTRICT_PROGRESS' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Corridors</th>
                  <th className="py-3 px-4 text-center">Acquisition %</th>
                  <th className="py-3 px-4 text-center">Compensation Paid (Cr)</th>
                  <th className="py-3 px-4 text-center">R&R Progress</th>
                  <th className="py-3 px-4 text-center">Delayed Cases</th>
                  <th className="py-3 px-4">Collector / CALA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.districtProgress?.map((d) => (
                  <tr key={d.district} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-black text-slate-900">{d.district}</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-700">{d.projectsCount}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{d.acquisitionProgress}%</td>
                    <td className="py-3 px-4 text-center font-bold">₹{d.compensationPaidCr} Cr</td>
                    <td className="py-3 px-4 text-center font-bold text-purple-700">{d.rrProgress}%</td>
                    <td className="py-3 px-4 text-center">
                      {d.delayedCases > 0 ? (
                        <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold">
                          {d.delayedCases}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{d.collectorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 2. Project Progress */}
          {activeReportTab === 'PROJECT_PROGRESS' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Affected Parcels</th>
                  <th className="py-3 px-4">Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.projectProgress?.map((p) => (
                  <tr key={p.projectId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{p.projectId}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 font-bold">{p.district}</td>
                    <td className="py-3 px-4 text-center font-black text-emerald-700">{p.progress}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[10px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{p.affectedParcels}</td>
                    <td className="py-3 px-4 text-slate-500">{p.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 3. Acquisition Summary */}
          {activeReportTab === 'ACQUISITION_SUMMARY' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Total Parcels</th>
                  <th className="py-3 px-4 text-center">Verified</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                  <th className="py-3 px-4 text-center">Acquired</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.acquisitionSummary?.map((a) => (
                  <tr key={a.projectId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-black text-slate-900">{a.projectName}</td>
                    <td className="py-3 px-4 font-bold">{a.district}</td>
                    <td className="py-3 px-4 text-center font-bold">{a.totalParcels}</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-700">{a.verified}</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-700">{a.pending}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{a.acquired}</td>
                    <td className="py-3 px-4 text-center font-black text-emerald-700">{a.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 4. Compensation / R&R Summary */}
          {activeReportTab === 'COMPENSATION_RNR' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Eligible Awards</th>
                  <th className="py-3 px-4 text-center">Approved Awards</th>
                  <th className="py-3 px-4 text-center">Paid (Cr)</th>
                  <th className="py-3 px-4 text-center">Pending (Cr)</th>
                  <th className="py-3 px-4 text-center">R&R Resettled</th>
                  <th className="py-3 px-4 text-center">R&R Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.compensationRnRSummary?.map((c) => (
                  <tr key={c.projectId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-black text-slate-900">{c.projectName}</td>
                    <td className="py-3 px-4 font-bold">{c.district}</td>
                    <td className="py-3 px-4 text-center font-bold">{c.eligible}</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-700">{c.approved}</td>
                    <td className="py-3 px-4 text-center font-black text-emerald-700">₹{c.completedPaid} Cr</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-700">₹{c.pending} Cr</td>
                    <td className="py-3 px-4 text-center font-bold text-purple-700">{c.rrCompleted || 0}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{c.rrPending || 0}</td>
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

export const StateReportsPage = () => (
  <ErrorBoundary>
    <StateReportsContent />
  </ErrorBoundary>
);

export default StateReportsPage;
