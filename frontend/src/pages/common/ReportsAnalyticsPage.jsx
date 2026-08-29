import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { StatCard } from '../../components/common/StatCard';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  BarChart3,
  Printer,
  Download,
  FileText,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  Users,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const ReportsAnalyticsPage = () => {
  const navigate = useNavigate();
  const { projects, khasras, objections, auditLogs } = useLandData();

  const mainProject = projects[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Khasra,Khata,Owner,Father,Area_Acre,Land_Type,Village,Tehsil,District,Status,Compensation_INR\n';
    const rows = khasras
      .map(
        (k) =>
          `"${k.khasraNumber}","${k.khataNumber}","${k.ownerName}","${k.fatherName}","${k.areaAcre}","${k.landType}","${k.village}","${k.tehsil}","${k.district}","${k.status}","${k.totalCompensation}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BhoomiSetu_Executive_Land_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Chart datasets
  const timelineData = [
    { month: 'Jan 2026', identified: 420, verified: 120, acquired: 40 },
    { month: 'Feb 2026', identified: 420, verified: 210, acquired: 110 },
    { month: 'Mar 2026', identified: 420, verified: 310, acquired: 190 },
    { month: 'Apr 2026', identified: 420, verified: 357, acquired: 280 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              National Infrastructure Monitoring
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">PM Gati Shakti & Cabinet Secretariat Feed</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Executive Land Acquisition & Compensation Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of corridor acreage clearances, disbursement velocity, and objection resolution.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-gov-saffron-600 hover:bg-gov-saffron-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report (PDF)</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Target</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">420.0 Acre</span>
          <span className="text-[11px] text-slate-500">8 National Corridors</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Total Acquired</span>
          <span className="text-2xl font-black text-gov-green-700 mt-1 block">280.0 Acre</span>
          <span className="text-[11px] text-emerald-700 font-semibold">66.7% Complete</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-amber-800 block">Pending Clearance</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">140.0 Acre</span>
          <span className="text-[11px] text-slate-500">Active Hearings</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-purple-900 block">Disbursed DBT</span>
          <span className="text-2xl font-black text-purple-900 mt-1 block">₹40.0 Cr</span>
          <span className="text-[11px] text-slate-500">Via PFMS / e-Kuber</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Line Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-sm font-extrabold text-slate-900">
              Acquisition & Possession Progression Velocity (2026)
            </h4>
            <p className="text-xs text-slate-500">Monthly cumulative acreage mutated into NHAI possession</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="identified" stroke="#64748b" strokeWidth={2} name="Identified (Ac)" />
                <Line type="monotone" dataKey="verified" stroke="#3b82f6" strokeWidth={2} name="Verified (Ac)" />
                <Line type="monotone" dataKey="acquired" stroke="#15803d" strokeWidth={3} name="Acquired (Ac)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Statistics Table Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Corridor Package Status ({mainProject.name})
            </h4>
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Required Land:</span>
                <span className="font-bold text-slate-900">{mainProject.requiredLand} Acre</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Verified Land:</span>
                <span className="font-bold text-slate-900">{mainProject.verifiedLand} Acre</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Acquired Land:</span>
                <span className="font-bold text-gov-green-700">{mainProject.acquiredLand} Acre</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pending Land:</span>
                <span className="font-bold text-amber-600">{mainProject.pendingLand} Acre</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Affected Owners:</span>
                <span className="font-bold text-slate-900">{mainProject.affectedOwners}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Active Objections:</span>
                <span className="font-bold text-orange-600">{mainProject.activeObjections}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Statutory Risk</span>
            <span className="font-extrabold text-rose-600">{mainProject.aiRiskLevel} ({mainProject.aiRiskScore}/100)</span>
          </div>
        </div>
      </div>

      {/* Complete Project Master Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h4 className="text-sm font-extrabold text-slate-900">
            Cadastral Acquisition Master Report
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-left border-b border-slate-200">
                <th className="p-3">Khasra</th>
                <th className="p-3">Khata</th>
                <th className="p-3">Land Owner</th>
                <th className="p-3">Area</th>
                <th className="p-3">Village</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Compensation Award</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {khasras.map((k) => (
                <tr key={k.khasraNumber} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-gov-blue-900">{k.khasraNumber}</td>
                  <td className="p-3 font-mono text-slate-500">{k.khataNumber}</td>
                  <td className="p-3 font-semibold text-slate-900">{k.ownerName}</td>
                  <td className="p-3 font-bold text-slate-800">{k.areaAcre} Acre</td>
                  <td className="p-3 text-slate-600">{k.village}</td>
                  <td className="p-3 font-semibold text-slate-700">{k.status}</td>
                  <td className="p-3 text-right font-black text-gov-green-700">{formatCurrency(k.totalCompensation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
