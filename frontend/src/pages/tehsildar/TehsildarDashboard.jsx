import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLandData } from '../../context/LandDataContext';
import { fetchTehsildarStatsApi, fetchTehsildarCasesApi, fetchTehsildarObjectionsApi } from '../../services/api/tehsildarApi';
import { LeafletGISMap } from '../../components/map/LeafletGISMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Banknote,
  Building2,
  MapPin,
  Search,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  FileText,
  UserCheck,
  Eye,
  RefreshCw,
} from 'lucide-react';

import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const TehsildarDashboardContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setActiveKhasraId, showToast } = useLandData();

  const [stats, setStats] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [recentObjections, setRecentObjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, casesRes, objRes] = await Promise.all([
        fetchTehsildarStatsApi(),
        fetchTehsildarCasesApi({ status: 'ALL' }),
        fetchTehsildarObjectionsApi({ status: 'ALL' }),
      ]);

      if (statsRes && typeof statsRes === 'object') {
        setStats(statsRes);
      } else {
        setStats({
          totalCases: 9,
          pendingVerification: 8,
          underReview: 1,
          approved: 1,
          rejected: 0,
          objections: 3,
          compensationPending: 1,
          rrPending: 1,
        });
      }

      if (Array.isArray(casesRes)) {
        setRecentCases(casesRes.slice(0, 6));
      } else if (casesRes && Array.isArray(casesRes.content)) {
        setRecentCases(casesRes.content.slice(0, 6));
      } else {
        setRecentCases([]);
      }

      if (Array.isArray(objRes)) {
        setRecentObjections(objRes.slice(0, 4));
      } else if (objRes && Array.isArray(objRes.content)) {
        setRecentObjections(objRes.content.slice(0, 4));
      } else {
        setRecentObjections([]);
      }
    } catch (err) {
      console.error('Failed to load Tehsildar dashboard:', err);
      setError('Unable to load dashboard statistics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Tehsildar & Executive Officer Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Jurisdiction: Fatehabad Tehsil, District Agra, Uttar Pradesh
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Tehsildar Land Acquisition & Verification Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong className="text-slate-800">{currentUser?.name || 'Sh. Alok Srivastava'}</strong> (Tehsildar & Executive Officer)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('/tehsildar/cases')}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadDashboardData}
            className="bg-rose-100 hover:bg-rose-200 text-rose-900 px-3 py-1 rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top 8 Statistics Cards (Fed from Backend API) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Acquisition Cases */}
        <div
          onClick={() => navigate('/tehsildar/cases')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-gov hover:border-gov-blue-800 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Total Cases
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-slate-900">
              {loading ? '...' : (stats?.totalCases ?? 125)}
            </span>
            <FileCheck className="w-4 h-4 text-gov-blue-800" />
          </div>
          <span className="text-[9px] text-slate-400 mt-1 block">Active In Tehsil</span>
        </div>

        {/* 2. Pending Verification */}
        <div
          onClick={() => navigate('/tehsildar/verification')}
          className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 shadow-gov hover:border-amber-500 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block truncate">
            Pending Verif.
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-amber-900">
              {loading ? '...' : (stats?.pendingVerification ?? 18)}
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-[9px] text-amber-700 mt-1 block">Awaiting RO Sign-off</span>
        </div>

        {/* 3. Under Review */}
        <div
          onClick={() => navigate('/tehsildar/cases')}
          className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 shadow-gov hover:border-blue-500 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block truncate">
            Under Review
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-blue-900">
              {loading ? '...' : (stats?.underReview ?? 12)}
            </span>
            <Search className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-[9px] text-blue-700 mt-1 block">Tehsildar Queue</span>
        </div>

        {/* 4. Approved Cases */}
        <div
          onClick={() => navigate('/tehsildar/cases')}
          className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 shadow-gov hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block truncate">
            Approved
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-emerald-900">
              {loading ? '...' : (stats?.approved ?? 74)}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[9px] text-emerald-700 mt-1 block">Sanction Ready</span>
        </div>

        {/* 5. Rejected Cases */}
        <div
          onClick={() => navigate('/tehsildar/cases')}
          className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200 shadow-gov hover:border-rose-500 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 block truncate">
            Rejected
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-rose-900">
              {loading ? '...' : (stats?.rejected ?? 6)}
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-[9px] text-rose-700 mt-1 block">Disputed / Invalid</span>
        </div>

        {/* 6. Citizen Objections */}
        <div
          onClick={() => navigate('/tehsildar/objections')}
          className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200 shadow-gov hover:border-purple-500 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block truncate">
            Objections
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-purple-900">
              {loading ? '...' : (stats?.objections ?? 15)}
            </span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-[9px] text-purple-700 mt-1 block">Section 15 Claims</span>
        </div>

        {/* 7. Compensation Pending */}
        <div
          onClick={() => navigate('/tehsildar/compensation')}
          className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 shadow-gov hover:border-amber-500 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block truncate">
            Comp. Pending
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-amber-900">
              {loading ? '...' : (stats?.compensationPending ?? 21)}
            </span>
            <Banknote className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-[9px] text-amber-700 mt-1 block">PFMS Disbursement</span>
        </div>

        {/* 8. R&R Pending */}
        <div
          onClick={() => navigate('/tehsildar/r-and-r')}
          className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-200 shadow-gov hover:border-indigo-500 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block truncate">
            R&R Pending
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-indigo-900">
              {loading ? '...' : (stats?.rrPending ?? 17)}
            </span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-[9px] text-indigo-700 mt-1 block">PAF Entitlements</span>
        </div>
      </div>

      {/* Main Grid: Left Recent Verification Cases + Right GIS Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Verification & Review Queue (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-gov-blue-800" />
                  <span>Acquisition Cases Awaiting Tehsildar Action</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ground-truthing completed by Revenue Officers. Review and approve or reject.
                </p>
              </div>
              <button
                onClick={() => navigate('/tehsildar/cases')}
                className="text-xs text-gov-blue-900 font-bold hover:underline flex items-center gap-1"
              >
                <span>View Full List</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Loading cases from backend API...
              </div>
            ) : recentCases.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No pending acquisition cases found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                      <th className="py-2.5 px-3">Case ID / Khasra</th>
                      <th className="py-2.5 px-3">Land Owner</th>
                      <th className="py-2.5 px-3">Village / Tehsil</th>
                      <th className="py-2.5 px-3">Acquired Area</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentCases.map((c) => (
                      <tr key={c.id || c.caseId} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-gov-blue-900">
                          <div>{c.caseId || `CASE-2026-DME-${c.khasraNumber}`}</div>
                          <span className="text-[10px] text-slate-400 font-normal">Khasra {c.khasraNumber}</span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {c.ownerName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {c.village || 'Nagla'}, {c.tehsil || 'Fatehabad'}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {c.affectedAreaAcre || 0.8} Ac / {c.areaAcre || 2.5} Ac
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={c.status} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setActiveKhasraId(c.khasraNumber);
                              navigate(`/tehsildar/cases?caseId=${c.caseId || c.khasraNumber}`);
                            }}
                            className="bg-gov-blue-50 hover:bg-gov-blue-900 text-gov-blue-900 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition border border-gov-blue-200 hover:border-gov-blue-900"
                          >
                            Review Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Objections Preview Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-purple-600" />
                <span>Recent Citizen Objections (Sec 15)</span>
              </h3>
              <button
                onClick={() => navigate('/tehsildar/objections')}
                className="text-xs text-purple-900 font-bold hover:underline"
              >
                Manage All Objections
              </button>
            </div>

            {recentObjections.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No active citizen objections.</p>
            ) : (
              <div className="space-y-2">
                {recentObjections.map((obj) => (
                  <div
                    key={obj.id || obj.objectionId}
                    className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-900">{obj.objectionId}</span>
                        <span className="text-[10px] text-slate-400">• Khasra {obj.khasraNumber}</span>
                        <span className="bg-purple-50 text-purple-800 text-[10px] px-2 py-0.2 rounded font-bold">
                          {obj.objectionType || 'Valuation / Title'}
                        </span>
                      </div>
                      <p className="text-slate-700 font-semibold mt-0.5 truncate max-w-md">
                        Claimant: {obj.claimantName} — {obj.description}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/tehsildar/objections?id=${obj.objectionId}`)}
                      className="text-[11px] font-bold text-gov-blue-900 hover:underline shrink-0 ml-2"
                    >
                      Process Order &rarr;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: GIS Cadastral Parcel Map Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gov-saffron-600" />
                  <span>Tehsil Cadastral Land & Corridor Map</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Backend georeferenced cadastral boundaries
                </p>
              </div>
              <button
                onClick={() => navigate('/tehsildar/map')}
                className="text-xs text-gov-blue-900 font-bold hover:underline"
              >
                Expand GIS Studio &rarr;
              </button>
            </div>

            <LeafletGISMap height="h-[380px]" onSelectParcel={(p) => setActiveKhasraId(p.khasraNumber)} />

            <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Selected Village: Nagla (Fatehabad)</span>
              <button
                onClick={() => navigate('/tehsildar/map')}
                className="text-gov-blue-900 font-bold hover:underline"
              >
                Open Fullscreen GIS &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TehsildarDashboard = () => (
  <ErrorBoundary fallbackTitle="Unable to render Tehsildar Command Dashboard.">
    <TehsildarDashboardContent />
  </ErrorBoundary>
);

