import React, { useState, useEffect } from 'react';
import { fetchCentralReportsApi } from '../../services/api/centralApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  BarChart3,
  Building2,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Layers,
  FileCheck,
  Banknote,
  Clock,
  Globe,
} from 'lucide-react';

const CentralReportsContent = () => {
  const [reports, setReports] = useState(null);
  const [activeReportTab, setActiveReportTab] = useState('STATE_PROGRESS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCentralReportsApi().then((data) => {
      if (data) setReports(data);
      setLoading(false);
    });
  }, []);

  const defaultReports = {
    generatedAt: '2026-08-28 23:00:00',
    stateProgress: [
      { state: 'Uttar Pradesh', stateCode: 'UP', totalProjects: 8, activeProjects: 7, acquisitionProgress: 67.8, compensationRnR: 78.4, delayedProjects: 1, pendingIssues: 3 },
      { state: 'Maharashtra', stateCode: 'MH', totalProjects: 6, activeProjects: 6, acquisitionProgress: 73.1, compensationRnR: 82.0, delayedProjects: 0, pendingIssues: 2 },
      { state: 'Gujarat', stateCode: 'GJ', totalProjects: 5, activeProjects: 5, acquisitionProgress: 93.6, compensationRnR: 96.7, delayedProjects: 0, pendingIssues: 1 },
      { state: 'Haryana', stateCode: 'HR', totalProjects: 4, activeProjects: 4, acquisitionProgress: 80.0, compensationRnR: 85.0, delayedProjects: 0, pendingIssues: 1 },
      { state: 'Madhya Pradesh', stateCode: 'MP', totalProjects: 5, activeProjects: 4, acquisitionProgress: 69.0, compensationRnR: 72.5, delayedProjects: 1, pendingIssues: 4 },
      { state: 'Rajasthan', stateCode: 'RJ', totalProjects: 4, activeProjects: 4, acquisitionProgress: 83.7, compensationRnR: 88.0, delayedProjects: 0, pendingIssues: 1 },
    ],
    projectProgress: [
      { projectId: 'PRJ-001', name: 'Delhi–Meerut Expressway Expansion', state: 'Uttar Pradesh', district: 'Agra', progress: 65.2, status: 'ACTIVE', affectedParcels: 124, agency: 'NHAI' },
      { projectId: 'PRJ-002', name: 'Dedicated Freight Corridor (Western DFC)', state: 'Haryana', district: 'Rewari', progress: 80.0, status: 'ACTIVE', affectedParcels: 210, agency: 'DFCCIL' },
      { projectId: 'PRJ-003', name: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', state: 'Maharashtra', district: 'Raigad', progress: 63.2, status: 'ACTIVE', affectedParcels: 180, agency: 'NICDC' },
      { projectId: 'PRJ-004', name: 'Mumbai–Ahmedabad High Speed Rail (MAHSR)', state: 'Gujarat', district: 'Surat', progress: 98.8, status: 'ACTIVE', affectedParcels: 320, agency: 'NHSRCL' },
      { projectId: 'PRJ-007', name: 'Ken-Betwa River Interlinking Canal Project', state: 'Madhya Pradesh', district: 'Panna', progress: 53.3, status: 'DELAYED', affectedParcels: 450, agency: 'NWDA' },
    ],
    acquisitionSummary: [
      { state: 'Uttar Pradesh', district: 'Agra', projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', totalParcels: 124, verified: 98, pending: 12, acquired: 84, progress: 67.7 },
      { state: 'Haryana', district: 'Rewari', projectId: 'PRJ-002', projectName: 'Dedicated Freight Corridor (Western DFC)', totalParcels: 210, verified: 190, pending: 20, acquired: 168, progress: 80.0 },
      { state: 'Maharashtra', district: 'Raigad', projectId: 'PRJ-003', projectName: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', totalParcels: 180, verified: 140, pending: 40, acquired: 114, progress: 63.3 },
      { state: 'Gujarat', district: 'Surat', projectId: 'PRJ-004', projectName: 'Mumbai–Ahmedabad High Speed Rail (MAHSR)', totalParcels: 320, verified: 320, pending: 0, acquired: 316, progress: 98.8 },
      { state: 'Madhya Pradesh', district: 'Panna', projectId: 'PRJ-007', projectName: 'Ken-Betwa River Interlinking Canal Project', totalParcels: 450, verified: 260, pending: 190, acquired: 240, progress: 53.3 },
    ],
    compensationRnRSummary: [
      { state: 'Uttar Pradesh', district: 'Agra', projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', eligible: 124, approved: 110, completedPaid: 84.5, pending: 22.5, rrCompleted: 380, rrPending: 70 },
      { state: 'Haryana', district: 'Rewari', projectId: 'PRJ-002', projectName: 'Dedicated Freight Corridor (Western DFC)', eligible: 210, approved: 195, completedPaid: 142.0, pending: 18.0, rrCompleted: 560, rrPending: 60 },
      { state: 'Maharashtra', district: 'Raigad', projectId: 'PRJ-003', projectName: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', eligible: 180, approved: 150, completedPaid: 210.0, pending: 54.0, rrCompleted: 420, rrPending: 120 },
      { state: 'Gujarat', district: 'Surat', projectId: 'PRJ-004', projectName: 'Mumbai–Ahmedabad High Speed Rail (MAHSR)', eligible: 320, approved: 320, completedPaid: 480.0, pending: 12.0, rrCompleted: 910, rrPending: 10 },
      { state: 'Madhya Pradesh', district: 'Panna', projectId: 'PRJ-007', projectName: 'Ken-Betwa River Interlinking Canal Project', eligible: 450, approved: 320, completedPaid: 180.0, pending: 85.0, rrCompleted: 820, rrPending: 430 },
    ],
    delayedProjects: [
      { projectId: 'PRJ-007', name: 'Ken-Betwa River Interlinking Canal Project', state: 'Madhya Pradesh', district: 'Panna', progress: 53.3, status: 'DELAYED', department: 'Ministry of Jal Shakti', reason: 'Stage-II Forest clearance & Wildlife Board buffer sanctuary diversion.' },
      { projectId: 'PRJ-012', name: 'Ganga Expressway Feeder Node & Logistics Spur', state: 'Uttar Pradesh', district: 'Prayagraj', progress: 59.4, status: 'DELAYED', department: 'Ministry of Road Transport & Highways', reason: 'High Court stay on agricultural multi-crop ROW alignment.' },
    ],
  };

  const r = reports || defaultReports;

  const exportCSV = () => {
    let rows = [];
    if (activeReportTab === 'STATE_PROGRESS') {
      rows = [['State', 'State Code', 'Total Projects', 'Active Projects', 'Acquisition %', 'Compensation/R&R %', 'Delayed Projects', 'Pending Issues']];
      r.stateProgress?.forEach((s) => {
        rows.push([s.state, s.stateCode, s.totalProjects, s.activeProjects, `${s.acquisitionProgress}%`, `${s.compensationRnR}%`, s.delayedProjects, s.pendingIssues]);
      });
    } else if (activeReportTab === 'PROJECT_PROGRESS') {
      rows = [['Project ID', 'Project Name', 'State', 'District', 'Progress %', 'Status', 'Affected Parcels', 'Agency']];
      r.projectProgress?.forEach((p) => {
        rows.push([p.projectId, p.name, p.state, p.district, `${p.progress}%`, p.status, p.affectedParcels, p.agency]);
      });
    } else if (activeReportTab === 'ACQUISITION_SUMMARY') {
      rows = [['State', 'District', 'Project ID', 'Project Name', 'Total Parcels', 'Verified', 'Pending', 'Acquired', 'Progress %']];
      r.acquisitionSummary?.forEach((a) => {
        rows.push([a.state, a.district, a.projectId, a.projectName, a.totalParcels, a.verified, a.pending, a.acquired, `${a.progress}%`]);
      });
    } else if (activeReportTab === 'COMPENSATION_RNR') {
      rows = [['State', 'District', 'Project ID', 'Project Name', 'Eligible Awards', 'Approved Awards', 'Paid (Cr)', 'Pending (Cr)', 'PAF Resettled', 'PAF Pending']];
      r.compensationRnRSummary?.forEach((c) => {
        rows.push([c.state, c.district, c.projectId, c.projectName, c.eligible, c.approved, c.completedPaid, c.pending, c.rrCompleted, c.rrPending]);
      });
    } else {
      rows = [['Project ID', 'Project Name', 'State', 'District', 'Progress %', 'Status', 'Department / Ministry', 'Roadblock Reason']];
      r.delayedProjects?.forEach((d) => {
        rows.push([d.projectId, d.name, d.state, d.district, `${d.progress}%`, d.status, d.department || d.ministry, d.reason || 'Clearance pending']);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `National_Report_${activeReportTab}.csv`);
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
              <span>National Cabinet Dossiers</span>
            </span>
            <span className="text-xs font-bold text-slate-500">PM Gati Shakti Master Plan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>National Infrastructure & Land Acquisition Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro-level executive compilations for Cabinet Secretary briefings, PMO monitoring, and inter-ministerial coordination.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 5 Report Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveReportTab('STATE_PROGRESS')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'STATE_PROGRESS'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <div className="text-xs font-black">State-wise Progress</div>
            <div className="text-[10px] text-slate-500">Jurisdiction delivery %</div>
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
            <div className="text-[10px] text-slate-500">PFMS DBT & PAF delivery</div>
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('DELAYED_PROJECTS')}
          className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
            activeReportTab === 'DELAYED_PROJECTS'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20 text-rose-900'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <Clock className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <div className="text-xs font-black">Delayed Projects</div>
            <div className="text-[10px] text-slate-500">Inter-State roadblocks</div>
          </div>
        </button>
      </div>

      {/* Active Report Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800">
            {activeReportTab === 'STATE_PROGRESS' && '1. State-wise Infrastructure Delivery & Clearance Dossier'}
            {activeReportTab === 'PROJECT_PROGRESS' && '2. National Master Plan Linear Corridor Milestone Dossier'}
            {activeReportTab === 'ACQUISITION_SUMMARY' && '3. Land Acquisition & Cadastre Possession Summary'}
            {activeReportTab === 'COMPENSATION_RNR' && '4. PFMS DBT Disbursal & PAF Resettlement Dossier'}
            {activeReportTab === 'DELAYED_PROJECTS' && '5. Critical Delayed Projects & Inter-Departmental Roadblocks'}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Generated: {r.generatedAt || '2026-08-28'}
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* 1. State Progress */}
          {activeReportTab === 'STATE_PROGRESS' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4 text-center">Total Projects</th>
                  <th className="py-3 px-4 text-center">Active Projects</th>
                  <th className="py-3 px-4 text-center">Acquisition %</th>
                  <th className="py-3 px-4 text-center">Compensation/R&R %</th>
                  <th className="py-3 px-4 text-center">Delayed Projects</th>
                  <th className="py-3 px-4 text-center">Pending Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.stateProgress?.map((s) => (
                  <tr key={s.state} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-black text-slate-900">{s.state}</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-700">{s.totalProjects}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{s.activeProjects}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{s.acquisitionProgress}%</td>
                    <td className="py-3 px-4 text-center font-bold text-purple-700">{s.compensationRnR}%</td>
                    <td className="py-3 px-4 text-center">
                      {s.delayedProjects > 0 ? (
                        <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold">
                          {s.delayedProjects}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {s.pendingIssues > 0 ? (
                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                          {s.pendingIssues}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
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
                  <th className="py-3 px-4">State</th>
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
                    <td className="py-3 px-4 font-bold">{p.state}</td>
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
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4 text-center">Total Parcels</th>
                  <th className="py-3 px-4 text-center">Verified</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                  <th className="py-3 px-4 text-center">Acquired</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.acquisitionSummary?.map((a) => (
                  <tr key={`${a.state}-${a.projectId}`} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold">{a.state}</td>
                    <td className="py-3 px-4 font-bold">{a.district}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{a.projectName}</td>
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
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Project</th>
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
                  <tr key={`${c.state}-${c.projectId}`} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold">{c.state}</td>
                    <td className="py-3 px-4 font-bold">{c.district}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{c.projectName}</td>
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

          {/* 5. Delayed Projects */}
          {activeReportTab === 'DELAYED_PROJECTS' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                  <th className="py-3 px-4">Ministry / Department</th>
                  <th className="py-3 px-4">Bottleneck Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {r.delayedProjects?.map((d) => (
                  <tr key={d.projectId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">{d.projectId}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 font-bold">{d.state}</td>
                    <td className="py-3 px-4 font-bold">{d.district}</td>
                    <td className="py-3 px-4 text-center font-black text-rose-700">{d.progress}%</td>
                    <td className="py-3 px-4 text-slate-600">{d.department || d.ministry}</td>
                    <td className="py-3 px-4 font-medium text-rose-950">{d.reason || 'Stage-II Environmental clearance pending'}</td>
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

export const CentralReportsPage = () => (
  <ErrorBoundary>
    <CentralReportsContent />
  </ErrorBoundary>
);

export default CentralReportsPage;
