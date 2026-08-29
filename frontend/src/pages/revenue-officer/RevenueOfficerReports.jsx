import React, { useState, useEffect } from 'react';
import { fetchRevenueReportsApi } from '../../services/api/revenueOfficerApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  BarChart3,
  Download,
  RefreshCw,
  FileCheck,
  MapPin,
  RotateCcw,
  CheckCircle2,
  Clock,
  Building2,
} from 'lucide-react';

const RevenueOfficerReportsContent = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueReportsApi();
      if (data) setReports(data);
    } catch (err) {
      console.error('Reports load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadCSV = () => {
    const rows = [
      ['Report Parameter', 'Count / Value'],
      ['Total Assigned Acquisition Cases', reports?.totalAssignedCases || 48],
      ['Pending RoR Verification', reports?.pendingVerificationCount || 12],
      ['Submitted to Tehsildar', reports?.submittedVerificationCount || 24],
      ['Field Inspections Completed', reports?.fieldVerificationCompletedCount || 7],
      ['Returned for Correction', reports?.returnedForCorrectionCount || 4],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Revenue_Officer_Verification_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Verification Analytics & Compliance
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Tehsil Revenue Officer Output Audit
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Verification-Focused Management Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Turnaround metrics, pending RoR queues, field inspection progress, and village-wise clearance summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov space-y-1">
          <span className="text-slate-500 font-bold block">Assigned Cases</span>
          <strong className="text-2xl font-black text-slate-900 font-mono">{reports?.totalAssignedCases || 48}</strong>
          <span className="text-[11px] text-slate-400 block">Total active parcels</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov space-y-1">
          <span className="text-amber-800 font-bold block">Pending RoR Checks</span>
          <strong className="text-2xl font-black text-amber-700 font-mono">{reports?.pendingVerificationCount || 12}</strong>
          <span className="text-[11px] text-amber-600 block">Action required</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov space-y-1">
          <span className="text-emerald-800 font-bold block">Submitted to Tehsildar</span>
          <strong className="text-2xl font-black text-emerald-700 font-mono">{reports?.submittedVerificationCount || 24}</strong>
          <span className="text-[11px] text-emerald-600 block">Under statutory review</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-gov space-y-1">
          <span className="text-rose-800 font-bold block">Returned for Correction</span>
          <strong className="text-2xl font-black text-rose-700 font-mono">{reports?.returnedForCorrectionCount || 4}</strong>
          <span className="text-[11px] text-rose-600 block">Requires rectification</span>
        </div>
      </div>

      {/* 3. Village Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-5 space-y-4">
        <h3 className="text-base font-black text-slate-900">
          Village-Wise Verification Clearance Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4">Village Name</th>
                <th className="py-2.5 px-4">Tehsil</th>
                <th className="py-2.5 px-4">District</th>
                <th className="py-2.5 px-4">Assigned Cases</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { name: 'Nagla', tehsil: 'Fatehabad', dist: 'Agra', count: 420, status: 'Fast-Track Active' },
                { name: 'Kasan', tehsil: 'Bah', dist: 'Agra', count: 310, status: 'Active' },
                { name: 'Kharabwadi', tehsil: 'Etmadpur', dist: 'Agra', count: 280, status: 'Active' },
                { name: 'Vesu', tehsil: 'Kheragarh', dist: 'Agra', count: 215, status: 'Active' },
              ].map((v) => (
                <tr key={v.name} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{v.name}</td>
                  <td className="py-2.5 px-4 text-slate-700">{v.tehsil}</td>
                  <td className="py-2.5 px-4 text-slate-700">{v.dist}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{v.count}</td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const RevenueOfficerReports = () => (
  <ErrorBoundary fallbackTitle="Unable to load Reports">
    <RevenueOfficerReportsContent />
  </ErrorBoundary>
);
