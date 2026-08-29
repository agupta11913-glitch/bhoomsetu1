import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRevenueStatsApi, fetchRevenueCasesApi } from '../../services/api/revenueOfficerApi';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileCheck,
  Clock,
  MapPin,
  FileText,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Building2,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const RevenueOfficerDashboardContent = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, casesData] = await Promise.all([
        fetchRevenueStatsApi(),
        fetchRevenueCasesApi({ village: selectedVillage !== 'ALL' ? selectedVillage : undefined }),
      ]);
      if (statsData) setStats(statsData);
      if (Array.isArray(casesData)) setCases(casesData);
    } catch (err) {
      console.error('Revenue Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedVillage]);

  // Stat Card Config
  const statCards = [
    {
      title: 'Assigned Cases',
      value: stats?.assignedCases ?? 48,
      subtitle: 'Total land parcels in jurisdiction',
      icon: FileCheck,
      color: 'blue',
      path: '/revenue-officer/cases',
    },
    {
      title: 'Pending Verification',
      value: stats?.pendingVerification ?? 12,
      subtitle: 'Awaiting RoR & ownership checks',
      icon: Clock,
      color: 'amber',
      path: '/revenue-officer/cases?status=PENDING_VERIFICATION',
      badge: 'Action Needed',
    },
    {
      title: 'Field Verification',
      value: stats?.fieldVerificationPending ?? 7,
      subtitle: 'Physical site visits scheduled',
      icon: MapPin,
      color: 'purple',
      path: '/revenue-officer/field-verification',
    },
    {
      title: 'Document Verification',
      value: stats?.documentVerificationPending ?? 5,
      subtitle: 'Khatauni / Shajra review pending',
      icon: FileText,
      color: 'indigo',
      path: '/revenue-officer/documents',
    },
    {
      title: 'GIS Matching Pending',
      value: stats?.gisVerificationPending ?? 4,
      subtitle: 'Boundary demarcation cross-check',
      icon: Layers,
      color: 'cyan',
      path: '/revenue-officer/map',
    },
    {
      title: 'Submitted to Tehsildar',
      value: stats?.verificationSubmitted ?? 24,
      subtitle: 'Under Tehsildar statutory review',
      icon: Send,
      color: 'emerald',
      path: '/revenue-officer/cases?status=VERIFICATION_SUBMITTED',
    },
    {
      title: 'Returned for Correction',
      value: stats?.returnedForCorrection ?? 4,
      subtitle: 'Tehsildar requested rectification',
      icon: RotateCcw,
      color: 'rose',
      path: '/revenue-officer/cases?status=RETURNED_FOR_CORRECTION',
      badge: 'Priority',
    },
    {
      title: 'Completed & Approved',
      value: stats?.completed ?? 18,
      subtitle: 'Tehsildar approved acquisitions',
      icon: CheckCircle2,
      color: 'teal',
      path: '/revenue-officer/cases?status=COMPLETED',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Revenue Officer Command Portal
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Field CALA & Cadastral Verification Desk
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Revenue Verification & Ground Fact-Finding Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jurisdiction: <strong className="text-slate-800">Fatehabad Tehsil, District Agra (UP)</strong> • Assigned Villages: <span className="font-semibold text-slate-700">Nagla, Kasan, Kharabwadi, Vesu</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">🌐 All Assigned Villages</option>
            <option value="Nagla">Nagla Village (420 Parcels)</option>
            <option value="Kasan">Kasan Village (310 Parcels)</option>
            <option value="Kharabwadi">Kharabwadi Village (280 Parcels)</option>
            <option value="Vesu">Vesu Village (215 Parcels)</option>
          </select>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. Statutory KPIs Grid (8 Live Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-gov-md hover:border-amber-400 transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{card.title}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-900 group-hover:text-amber-700 transition font-mono">
                      {card.value}
                    </span>
                    {card.badge && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded border border-rose-200">
                        {card.badge}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 group-hover:bg-amber-50 group-hover:text-amber-800 transition">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium truncate">{card.subtitle}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Action Workflow Strip */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white rounded-2xl p-6 shadow-gov border border-amber-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Statutory Revenue Protocol
            </span>
          </div>
          <h3 className="text-lg font-black">
            Verify Land Records & Submit Field Evidence to Tehsildar
          </h3>
          <p className="text-xs text-amber-200/80 max-w-2xl">
            Revenue Officer performs field inspection, cross-verifies Bhulekh RoR with acquisition proposals, and forwards findings for statutory review. Final acquisition decision rests with Tehsildar.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/revenue-officer/verification')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
          >
            <FileCheck className="w-4 h-4" />
            <span>Start RoR Verification</span>
          </button>
          <button
            onClick={() => navigate('/revenue-officer/field-verification')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition border border-white/20"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Record Field Visit</span>
          </button>
        </div>
      </div>

      {/* 4. Priority Queue: Returned / Pending Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Priority Verification Queue ({cases.length} Cases)
            </h3>
            <p className="text-xs text-slate-500">
              Parcels requiring ownership verification, field inspection, or Tehsildar corrections.
            </p>
          </div>

          <button
            onClick={() => navigate('/revenue-officer/cases')}
            className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Khasra No.</th>
                <th className="py-3 px-4">Recorded Owner</th>
                <th className="py-3 px-4">Total / Acquired Area</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {cases.slice(0, 6).map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.caseId}</td>
                  <td className="py-3 px-4 text-slate-700">{c.village}</td>
                  <td className="py-3 px-4 font-black text-amber-900">#{c.khasraNumber}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold">{c.ownerName}</td>
                  <td className="py-3 px-4 text-slate-700 font-mono">
                    {formatAcre(c.totalAreaAcre)} / <strong className="text-amber-900">{formatAcre(c.affectedAreaAcre)}</strong>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={c.verificationStatus} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                      c.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      c.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/revenue-officer/cases/${c.caseId}`)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold transition"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => navigate(`/revenue-officer/map?khasra=${c.khasraNumber}`)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold transition"
                      title="Inspect on GIS Map"
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

export const RevenueOfficerDashboard = () => (
  <ErrorBoundary fallbackTitle="Unable to load Revenue Officer Dashboard">
    <RevenueOfficerDashboardContent />
  </ErrorBoundary>
);
