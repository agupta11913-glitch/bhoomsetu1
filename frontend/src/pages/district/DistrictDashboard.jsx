import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictDashboardApi } from '../../services/api/districtApi';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Building2,
  Layers,
  FileCheck,
  MapPin,
  Banknote,
  Users,
  AlertTriangle,
  Clock,
  ShieldCheck,
  BarChart3,
  FileText,
  Radio,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const DistrictDashboardContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(false);
    try {
      const data = await fetchDistrictDashboardApi(currentUser?.district || 'Agra');
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading district dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const defaultStats = {
    district: currentUser?.district || 'Agra',
    state: 'Uttar Pradesh',
    officerName: currentUser?.name || 'Dr. Sunita Murthy, IAS',
    designation: currentUser?.designation || 'District Magistrate & Competent Authority (CALA)',
    totalProjects: 5,
    activeProjects: 4,
    affectedVillages: 4,
    affectedParcels: 48,
    affectedLandAcre: 142.50,
    acquiredParcels: 18,
    acquisitionProgress: 68.4,
    compensationProgress: 74.2,
    totalCompensationCr: 184.60,
    disbursedCompensationCr: 136.95,
    rrProgress: 81.0,
    pendingDisputes: 6,
    criticalCases: 2,
    delayedProjects: 1,
    activeOfficersCount: 12,
    openCoordinationRequests: 2,
  };

  const data = stats || defaultStats;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header with Jurisdiction & Officer Profile Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-gov border border-purple-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-300" />
                <span>District Administration Portal</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Jurisdiction: {data.district} District</span>
              </span>
              <span className="bg-slate-700/60 text-slate-200 text-xs font-mono px-2 py-0.5 rounded-md">
                Role: {currentUser?.role || 'DISTRICT_MAGISTRATE'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {data.officerName}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl">
              {data.designation} • Oversight of linear infrastructure corridors, RFCTLARR land acquisition awards, inter-departmental clearances, and grievance adjudication.
            </p>
          </div>

            {/* Quick Stats Pill */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-slate-950/40 p-4 rounded-2xl border border-purple-400/20 backdrop-blur-md">
              <div className="px-3 border-r border-slate-700/60 text-center">
                <div className="text-[10px] text-purple-300 font-bold uppercase">Active Projects</div>
                <div className="text-2xl font-black text-white">{data.activeProjects}</div>
              </div>
              <div className="px-3 border-r border-slate-700/60 text-center">
                <div className="text-[10px] text-purple-300 font-bold uppercase">Disbursed Cr</div>
                <div className="text-2xl font-black text-emerald-400">₹{data.disbursedCompensationCr}</div>
              </div>
              <div className="px-3 text-center">
                <div className="text-[10px] text-purple-300 font-bold uppercase">Clearance</div>
                <div className="text-2xl font-black text-amber-300">{data.acquisitionProgress}%</div>
              </div>
            </div>
          </div>

          {/* Quick Authority Action Shortcuts */}
          <div className="mt-5 pt-4 border-t border-purple-800/60 flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold text-purple-300 mr-1">Quick Authority Actions:</span>
            
            {hasPermission(DISTRICT_PERMISSIONS.EDIT_PROJECT) && (
              <button
                onClick={() => navigate('/district/projects')}
                className="bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-purple-400/30 flex items-center gap-1.5 transition shadow-xs"
              >
                <span>⚡ Update Corridor Progress</span>
              </button>
            )}

            {hasPermission(DISTRICT_PERMISSIONS.UPDATE_ACQUISITION) && (
              <button
                onClick={() => navigate('/district/acquisition')}
                className="bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-indigo-400/30 flex items-center gap-1.5 transition shadow-xs"
              >
                <span>📋 Progress Statutory Stage</span>
              </button>
            )}

            {hasPermission(DISTRICT_PERMISSIONS.REVIEW_DISPUTE) && (
              <button
                onClick={() => navigate('/district/disputes')}
                className="bg-amber-600/80 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-400/30 flex items-center gap-1.5 transition shadow-xs"
              >
                <span>⚖️ Review Sec 15 Objections</span>
              </button>
            )}

            {hasPermission(DISTRICT_PERMISSIONS.UPLOAD_DOCUMENTS) && (
              <button
                onClick={() => navigate('/district/documents')}
                className="bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-600/50 flex items-center gap-1.5 transition shadow-xs"
              >
                <span>📄 Publish Official Gazette</span>
              </button>
            )}

            {hasPermission(DISTRICT_PERMISSIONS.GENERATE_REPORTS) && (
              <button
                onClick={() => navigate('/district/reports')}
                className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition shadow-xs"
              >
                <span>📊 Generate Statutory Report</span>
              </button>
            )}
          </div>
        </div>

      {/* 2. Permission-Aware Overview KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total & Active Projects */}
        {hasPermission(DISTRICT_PERMISSIONS.VIEW_PROJECTS) && (
          <div
            onClick={() => navigate('/district/projects')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-purple-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Corridor Projects
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{data.totalProjects}</span>
              <span className="text-xs font-bold text-emerald-600">({data.activeProjects} Active)</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>{data.affectedVillages} Villages Involved</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        )}

        {/* Card 2: Land & Parcels Under Acquisition */}
        {hasPermission(DISTRICT_PERMISSIONS.VIEW_LAND) && (
          <div
            onClick={() => navigate('/district/land')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Land Acquisition
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{formatAcre(data.affectedLandAcre)}</span>
              <span className="text-xs font-bold text-slate-600">({data.affectedParcels} Parcels)</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>{data.acquiredParcels} Mutated & Possessed</span>
              <span className="font-bold text-blue-600">{data.acquisitionProgress}%</span>
            </div>
          </div>
        )}

        {/* Card 3: Compensation Disbursed */}
        {hasPermission(DISTRICT_PERMISSIONS.VIEW_COMPENSATION) && (
          <div
            onClick={() => navigate('/district/compensation')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                PFMS Compensation
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
                <Banknote className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">₹{data.disbursedCompensationCr} Cr</span>
              <span className="text-xs font-bold text-slate-500">/ ₹{data.totalCompensationCr} Cr</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>DBT Direct Credit</span>
              <span className="font-bold text-emerald-600">{data.compensationProgress}%</span>
            </div>
          </div>
        )}

        {/* Card 4: Disputes & Critical Escalations */}
        {hasPermission(DISTRICT_PERMISSIONS.VIEW_DISPUTES) && (
          <div
            onClick={() => navigate('/district/disputes')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-amber-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Grievances
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{data.pendingDisputes}</span>
              <span className="text-xs font-bold text-rose-600">({data.criticalCases} Critical)</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Section 15 Hearings</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        )}
      </div>

      {/* 3. Operational Quick Modules & Map Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Key Action Areas & Progress Gauges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Linear Corridor Progress Progress Bars */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>District Linear Corridor Statutory Milestones</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time statutory clearance tracking across National Highway & Expressway projects.
                </p>
              </div>
              <button
                onClick={() => navigate('/district/projects')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Delhi–Meerut Expressway Expansion (NH-348)</span>
                  <span className="text-purple-700">72% Completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '72%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Target: 142.50 Acres • 420 Parcels</span>
                  <span>CALA Posssession: 302 Parcels</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Agra Western Ring Road Phase-2</span>
                  <span className="text-blue-700">64% Completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '64%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Target: 98.20 Acres • 310 Parcels</span>
                  <span>CALA Posssession: 198 Parcels</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Yamuna Expressway to Agra Airport Interconnect</span>
                  <span className="text-amber-700">45% Completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '45%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Target: 65.00 Acres • 280 Parcels</span>
                  <span>Section 15 Hearings Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Dynamic Shortcuts Filtered by Permissions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hasPermission(DISTRICT_PERMISSIONS.VIEW_GIS) && (
              <div
                onClick={() => navigate('/district/map')}
                className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 hover:bg-purple-50 transition cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-purple-900">
                  <MapPin className="w-5 h-5 text-purple-700" />
                  <span className="text-[10px] font-black uppercase bg-purple-200/60 px-2 py-0.5 rounded-md">
                    GIS Cadastre
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">District Cadastral Map</h4>
                <p className="text-[11px] text-slate-600">
                  Inspect multi-corridor ROW lines and superimposed Bhulekh survey boundaries.
                </p>
              </div>
            )}

            {hasPermission(DISTRICT_PERMISSIONS.VIEW_DELAYED_CASES) && (
              <div
                onClick={() => navigate('/district/delayed-cases')}
                className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 hover:bg-rose-50 transition cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-rose-900">
                  <Clock className="w-5 h-5 text-rose-700" />
                  <span className="text-[10px] font-black uppercase bg-rose-200/60 px-2 py-0.5 rounded-md">
                    SLA Breached
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">Delayed Workflows</h4>
                <p className="text-[11px] text-slate-600">
                  Inspect overdue acquisitions, field verifications, DBT credits, and objections.
                </p>
              </div>
            )}

            {hasPermission(DISTRICT_PERMISSIONS.VIEW_ESCALATIONS) && (
              <div
                onClick={() => navigate('/district/escalations')}
                className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 hover:bg-amber-50 transition cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <span className="text-[10px] font-black uppercase bg-amber-200/60 px-2 py-0.5 rounded-md">
                    High Priority
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">District Escalations</h4>
                <p className="text-[11px] text-slate-600">
                  Review High Court stays, court deposits, and inter-agency issues.
                </p>
              </div>
            )}

            {hasPermission(DISTRICT_PERMISSIONS.VIEW_COORDINATION) && (
              <div
                onClick={() => navigate('/district/coordination')}
                className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 hover:bg-blue-50 transition cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-blue-900">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                  <span className="text-[10px] font-black uppercase bg-blue-200/60 px-2 py-0.5 rounded-md">
                    Inter-Dept
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">Department Clearances</h4>
                <p className="text-[11px] text-slate-600">
                  Coordinate Forest Stage-II, DVVNL transmission shifting, and Canal NOCs.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Authority Actions & Jurisdictional Summary */}
        <div className="space-y-6">
          {/* Statutory Authority Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>Collectorate Mandate</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block">Section 19 Declaration Sanction</span>
                <span className="text-[11px] text-slate-500">
                  Final declaration under RFCTLARR Act 2013 vesting absolute ownership with Govt.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block">Quasi-Judicial Section 15 Orders</span>
                <span className="text-[11px] text-slate-500">
                  Hearing and statutory determination of landowner objections within 60 days.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block">PFMS DBT Award Authorization</span>
                <span className="text-[11px] text-slate-500">
                  Digital sign-off on 100% solatium and 12% additional market value calculations.
                </span>
              </div>
            </div>

            {hasPermission(DISTRICT_PERMISSIONS.MANAGE_ESCALATIONS) && (
              <button
                onClick={() => navigate('/district/disputes')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>Adjudicate Pending Disputes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* SLA Delayed Cases Alert */}
          {hasPermission(DISTRICT_PERMISSIONS.VIEW_DELAYED_CASES) && (
            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-900">
                <Clock className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-black uppercase">Statutory SLA Alert</span>
              </div>
              <p className="text-xs text-rose-800">
                <strong>2 cases</strong> in Fatehabad Tehsil have exceeded the 60-day inquiry window under RFCTLARR statutory guidelines.
              </p>
              <button
                onClick={() => navigate('/district/delayed-cases')}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
              >
                <span>Inspect Delayed Cases</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DistrictDashboard = () => (
  <ErrorBoundary>
    <DistrictDashboardContent />
  </ErrorBoundary>
);

export default DistrictDashboard;
