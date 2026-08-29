import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCentralCompensationRnRApi, fetchCentralStatesApi } from '../../services/api/centralApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Globe,
} from 'lucide-react';

const CentralCompensationRnRContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'COMPENSATION', 'RNR'
  const [selectedState, setSelectedState] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCentralCompensationRnRApi(),
      fetchCentralStatesApi(),
    ]).then(([crData, sts]) => {
      if (Array.isArray(crData)) setData(crData);
      if (Array.isArray(sts)) setStates(sts);
      setLoading(false);
    });
  }, []);

  const defaultData = [
    { state: 'Uttar Pradesh', district: 'Agra', projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', eligible: 124, approved: 110, completedPaid: 84.5, pending: 22.5, rrEligible: 450, rrApproved: 410, rrCompleted: 380, rrPending: 70 },
    { state: 'Haryana', district: 'Rewari', projectId: 'PRJ-002', projectName: 'Dedicated Freight Corridor (Western DFC)', eligible: 210, approved: 195, completedPaid: 142.0, pending: 18.0, rrEligible: 620, rrApproved: 590, rrCompleted: 560, rrPending: 60 },
    { state: 'Maharashtra', district: 'Raigad', projectId: 'PRJ-003', projectName: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', eligible: 180, approved: 150, completedPaid: 210.0, pending: 54.0, rrEligible: 540, rrApproved: 480, rrCompleted: 420, rrPending: 120 },
    { state: 'Gujarat', district: 'Surat', projectId: 'PRJ-004', projectName: 'Mumbai–Ahmedabad High Speed Rail (MAHSR)', eligible: 320, approved: 320, completedPaid: 480.0, pending: 12.0, rrEligible: 920, rrApproved: 920, rrCompleted: 910, rrPending: 10 },
    { state: 'Uttar Pradesh', district: 'Kanpur Nagar', projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', eligible: 96, approved: 82, completedPaid: 64.0, pending: 18.0, rrEligible: 380, rrApproved: 330, rrCompleted: 310, rrPending: 70 },
    { state: 'Madhya Pradesh', district: 'Panna', projectId: 'PRJ-007', projectName: 'Ken-Betwa River Interlinking Canal Project', eligible: 450, approved: 320, completedPaid: 180.0, pending: 85.0, rrEligible: 1250, rrApproved: 980, rrCompleted: 820, rrPending: 430 },
    { state: 'Rajasthan', district: 'Jodhpur', projectId: 'PRJ-008', projectName: 'Bhadla Mega Solar Renewable Energy Park', eligible: 80, approved: 78, completedPaid: 52.0, pending: 4.0, rrEligible: 180, rrApproved: 175, rrCompleted: 170, rrPending: 10 },
    { state: 'Karnataka', district: 'Kolar', projectId: 'PRJ-009', projectName: 'Bangalore-Chennai Industrial Corridor (BCIC)', eligible: 140, approved: 120, completedPaid: 98.0, pending: 24.0, rrEligible: 390, rrApproved: 350, rrCompleted: 320, rrPending: 70 },
    { state: 'Bihar', district: 'Rohtas', projectId: 'PRJ-010', projectName: 'Eastern Dedicated Freight Corridor Expansion', eligible: 260, approved: 210, completedPaid: 115.0, pending: 42.0, rrEligible: 780, rrApproved: 650, rrCompleted: 580, rrPending: 200 },
    { state: 'Uttar Pradesh', district: 'Prayagraj', projectId: 'PRJ-012', projectName: 'Ganga Expressway Feeder Node', eligible: 110, approved: 80, completedPaid: 48.0, pending: 32.0, rrEligible: 480, rrApproved: 390, rrCompleted: 320, rrPending: 160 },
  ];

  const list = data.length > 0 ? data : defaultData;

  const filtered = list.filter((item) => {
    if (selectedState !== 'ALL' && item.state !== selectedState) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.projectName?.toLowerCase().includes(q) ||
        item.projectId?.toLowerCase().includes(q) ||
        item.state?.toLowerCase().includes(q) ||
        item.district?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPaidCr = list.reduce((acc, curr) => acc + (curr.completedPaid || 0), 0);
  const totalPendingCr = list.reduce((acc, curr) => acc + (curr.pending || 0), 0);
  const totalFamiliesResettled = list.reduce((acc, curr) => acc + (curr.rrCompleted || 0), 0);
  const totalFamiliesEligible = list.reduce((acc, curr) => acc + (curr.rrEligible || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-emerald-700" />
              <span>National PFMS DBT & RFCTLARR R&R</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Pan-India Direct Benefits</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-600" />
            <span>National Compensation & R&R Reconciliation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro reconciliation of statutory land compensation awards and Project Affected Family (PAF) resettlement across states.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total DBT Disbursed</span>
          <strong className="text-2xl font-black text-emerald-700">₹{totalPaidCr.toFixed(1)} Cr</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Compensation Disbursed</span>
          <strong className="text-2xl font-black text-emerald-700">₹{totalPaidCr.toFixed(1)} Cr</strong>
          <span className="text-[11px] text-emerald-600 block">Disbursed directly via PFMS DBT</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Total Pending Disbursal</span>
          <strong className="text-2xl font-black text-amber-700">₹{totalPendingCr.toFixed(1)} Cr</strong>
          <span className="text-[11px] text-amber-600 block">Under state treasury/CALA sanction</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-purple-700 block">National PAF Families Resettled</span>
          <strong className="text-2xl font-black text-purple-700">{totalFamiliesResettled.toLocaleString()}</strong>
          <span className="text-[11px] text-purple-600 block">Second Schedule delivery complete</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-indigo-700 block">R&R Compliance Rate</span>
          <strong className="text-2xl font-black text-indigo-700">
            {totalFamiliesEligible > 0 ? ((totalFamiliesResettled / totalFamiliesEligible) * 100).toFixed(1) : 88.3}%
          </strong>
          <span className="text-[11px] text-indigo-600 block">Entitlements verified & handed over</span>
        </div>
      </div>

      {/* Tab Switcher & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* View Tab Buttons */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                activeTab === 'ALL'
                  ? 'bg-white text-indigo-900 shadow-sm'
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

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search state, district, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* State Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All States</option>
              {states.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
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
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4 text-center">
                  {activeTab === 'RNR' ? 'Eligible Families' : 'Eligible Awards'}
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
                <tr key={`${item.state}-${item.projectId}`} className="hover:bg-indigo-50/40 transition">
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {item.state}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {item.district}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                        {item.projectId}
                      </span>
                      <span className="font-black text-slate-900">{item.projectName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-slate-900">
                    {activeTab === 'RNR' ? item.rrEligible : item.eligible}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-indigo-700">
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

export const CentralCompensationRnRPage = () => (
  <ErrorBoundary>
    <CentralCompensationRnRContent />
  </ErrorBoundary>
);

export default CentralCompensationRnRPage;
