import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRevenueCasesApi } from '../../services/api/revenueOfficerApi';
import { formatAcre } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileCheck,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const RevenueOfficerCasesContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initStatus = searchParams.get('status') || 'ALL';

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initStatus);
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueCasesApi({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        village: villageFilter !== 'ALL' ? villageFilter : undefined,
      });
      if (Array.isArray(data)) setCases(data);
    } catch (err) {
      console.error('Error fetching assigned cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [statusFilter, villageFilter]);

  const filteredCases = cases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.caseId?.toLowerCase().includes(q) ||
      c.khasraNumber?.toLowerCase().includes(q) ||
      c.ownerName?.toLowerCase().includes(q) ||
      c.village?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Assigned Jurisdictional Register
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Fatehabad Tehsil Cadastre
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Assigned Land Acquisition Cases
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete registry of land parcels assigned for ownership verification, field inspection, and ground truth compilation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCases}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Cases</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-gov text-xs">
        {/* Status Filter */}
        <div className="sm:col-span-3">
          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
            Verification Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Verification States</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="IN_VERIFICATION">In Verification (Draft Saved)</option>
            <option value="VERIFICATION_SUBMITTED">Submitted to Tehsildar</option>
            <option value="RETURNED_FOR_CORRECTION">Returned for Correction</option>
            <option value="COMPLETED">Approved & Completed</option>
          </select>
        </div>

        {/* Village Filter */}
        <div className="sm:col-span-3">
          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
            Assigned Village
          </label>
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Assigned Villages</option>
            <option value="Nagla">Nagla Village</option>
            <option value="Kasan">Kasan Village</option>
            <option value="Kharabwadi">Kharabwadi Village</option>
            <option value="Vesu">Vesu Village</option>
          </select>
        </div>

        {/* Search */}
        <div className="sm:col-span-6 relative">
          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
            Search Case ID / Khasra No. / Owner / Village
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 101, Ram Kumar, CASE-2026-DME-0101, Nagla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Assigned Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Village</th>
                <th className="py-3.5 px-4">Khasra No.</th>
                <th className="py-3.5 px-4">Claimant Owner</th>
                <th className="py-3.5 px-4">Total / Acquired Area</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.caseId}</td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-[180px] truncate" title={c.projectName}>
                    {c.projectName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{c.village}</td>
                  <td className="py-3.5 px-4 font-black text-amber-900">#{c.khasraNumber}</td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold">
                    {c.ownerName}
                    {c.fatherName && <span className="text-[10px] text-slate-400 block">S/o {c.fatherName}</span>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono">
                    {formatAcre(c.totalAreaAcre)} / <strong className="text-amber-900">{formatAcre(c.affectedAreaAcre)}</strong>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.verificationStatus} size="sm" />
                    {c.tehsildarRemarks && c.verificationStatus === 'RETURNED_FOR_CORRECTION' && (
                      <span className="text-[10px] text-rose-600 block mt-0.5 max-w-[150px] truncate" title={c.tehsildarRemarks}>
                        Note: {c.tehsildarRemarks}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                      c.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      c.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{c.assignedDate}</td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/revenue-officer/cases/${c.caseId}`)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      {c.verificationStatus === 'IN_VERIFICATION' ? 'Continue' : (c.verificationStatus === 'RETURNED_FOR_CORRECTION' ? 'Rectify' : 'Verify')}
                    </button>
                    <button
                      onClick={() => navigate(`/revenue-officer/map?khasra=${c.khasraNumber}`)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold transition"
                      title="Locate on Map"
                    >
                      <MapPin className="w-3.5 h-3.5 inline" />
                    </button>
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

export const RevenueOfficerCases = () => (
  <ErrorBoundary fallbackTitle="Unable to load Assigned Cases">
    <RevenueOfficerCasesContent />
  </ErrorBoundary>
);
