import React, { useState, useEffect } from 'react';
import { fetchAgencyCompensationRnRApi } from '../../services/api/agencyApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Users,
} from 'lucide-react';

const AgencyCompensationRnRContent = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'COMPENSATION' | 'RNR'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyCompensationRnRApi().then((crData) => {
      if (Array.isArray(crData)) setData(crData);
      setLoading(false);
    });
  }, []);

  const defaultData = [
    { projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', district: 'Agra', eligible: 124, approved: 110, completedPaid: 84.5, pending: 22.5, rrEligible: 450, rrApproved: 410, rrCompleted: 380, rrPending: 70 },
    { projectId: 'PRJ-002', projectName: 'Agra Western Ring Road Phase-2', district: 'Agra', eligible: 48, approved: 45, completedPaid: 38.2, pending: 8.4, rrEligible: 180, rrApproved: 165, rrCompleted: 150, rrPending: 30 },
    { projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', eligible: 96, approved: 82, completedPaid: 64.0, pending: 18.0, rrEligible: 380, rrApproved: 330, rrCompleted: 310, rrPending: 70 },
    { projectId: 'PRJ-011', projectName: 'Lucknow Ring Road Phase-3', district: 'Lucknow', eligible: 82, approved: 70, completedPaid: 56.4, pending: 18.2, rrEligible: 310, rrApproved: 270, rrCompleted: 240, rrPending: 70 },
  ];

  const list = data.length > 0 ? data : defaultData;

  const filtered = list.filter((item) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.projectName?.toLowerCase().includes(q) ||
        item.projectId?.toLowerCase().includes(q) ||
        item.district?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPaidCr = list.reduce((acc, curr) => acc + (curr.completedPaid || 0), 0);
  const totalPendingCr = list.reduce((acc, curr) => acc + (curr.pending || 0), 0);
  const totalPAFResettled = list.reduce((acc, curr) => acc + (curr.rrCompleted || 0), 0);
  const totalPAFEligible = list.reduce((acc, curr) => acc + (curr.rrEligible || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct Benefit Transfer & Resettlement</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Assigned Corridors</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-600" />
            <span>Compensation & R&R Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversight of statutory land compensation disbursement and Project Affected Family (PAF) rehabilitation entitlements.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Compensation Disbursed</span>
          <strong className="text-2xl font-black text-emerald-700">₹{totalPaidCr.toFixed(1)} Cr</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Compensation Disbursed</span>
          <strong className="text-2xl font-black text-emerald-700">₹{totalPaidCr.toFixed(1)} Cr</strong>
          <span className="text-[11px] text-emerald-600 block">Paid directly via PFMS DBT</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Pending Disbursal</span>
          <strong className="text-2xl font-black text-amber-700">₹{totalPendingCr.toFixed(1)} Cr</strong>
          <span className="text-[11px] text-amber-600 block">Under CALA account sanction</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-purple-700 block">PAF Families Resettled</span>
          <strong className="text-2xl font-black text-purple-700">{totalPAFResettled}</strong>
          <span className="text-[11px] text-purple-600 block">Rehabilitation plots/cash allocated</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-indigo-700 block">R&R Settlement Rate</span>
          <strong className="text-2xl font-black text-indigo-700">
            {totalPAFEligible > 0 ? ((totalPAFResettled / totalPAFEligible) * 100).toFixed(1) : 81.2}%
          </strong>
          <span className="text-[11px] text-indigo-600 block">Entitlements handed over</span>
        </div>
      </div>

      {/* Tab Switcher & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                activeTab === 'ALL'
                  ? 'bg-white text-cyan-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unified Overview
            </button>
            <button
              onClick={() => setActiveTab('COMPENSATION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                activeTab === 'COMPENSATION'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compensation Awards
            </button>
            <button
              onClick={() => setActiveTab('RNR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                activeTab === 'RNR'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              R&R Entitlements
            </button>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Records
        </div>
      </div>

      {/* Main Table Matching Required Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4 text-center">
                  {activeTab === 'RNR' ? 'Eligible PAF' : 'Eligible Awards'}
                </th>
                <th className="py-3.5 px-4 text-center">
                  {activeTab === 'RNR' ? 'Sanctioned PAF' : 'Approved Awards'}
                </th>
                <th className="py-3.5 px-4 text-center">
                  {activeTab === 'RNR' ? 'Resettled Families' : 'Completed / Paid (Cr)'}
                </th>
                <th className="py-3.5 px-4 text-center">
                  {activeTab === 'RNR' ? 'Pending Resettlement' : 'Pending Disbursal (Cr)'}
                </th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={item.projectId} className="hover:bg-cyan-50/40 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-100">
                        {item.projectId}
                      </span>
                      <span className="font-black text-slate-900">{item.projectName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {item.district}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-slate-900">
                    {activeTab === 'RNR' ? item.rrEligible : item.eligible}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-cyan-700">
                    {activeTab === 'RNR' ? item.rrApproved : item.approved}
                  </td>

                  <td className="py-4 px-4 text-center font-black text-emerald-700">
                    {activeTab === 'RNR' ? `${item.rrCompleted} Families` : `₹${item.completedPaid} Cr`}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-amber-700">
                    {activeTab === 'RNR' ? `${item.rrPending} Families` : `₹${item.pending} Cr`}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      Reconciled
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

export const AgencyCompensationRnRPage = () => (
  <ErrorBoundary>
    <AgencyCompensationRnRContent />
  </ErrorBoundary>
);

export default AgencyCompensationRnRPage;
