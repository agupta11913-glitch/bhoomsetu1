import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchStateDashboardApi, fetchStateDistrictsApi } from '../../services/api/stateApi';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Building2,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  BarChart3,
  Globe,
  Filter,
  Eye,
  FileCheck,
  Banknote,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';

const StateOfficerDashboardContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stateData, setStateData] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    Promise.all([
      fetchStateDashboardApi(stateName),
      fetchStateDistrictsApi(stateName),
    ]).then(([d, dists]) => {
      if (d) setStateData(d);
      if (Array.isArray(dists)) setDistricts(dists);
      setLoading(false);
    });
  }, [stateName]);

  const defaultData = {
    state: stateName,
    officerName: 'Sh. Sanjeev Khare, IAS',
    designation: 'Principal Secretary, Revenue & Infrastructure Oversight',
    department: 'Department of Revenue & Land Reforms, Govt. of Uttar Pradesh',
    totalDistricts: 75,
    coveredDistricts: 28,
    totalProjects: 32,
    activeProjects: 30,
    totalLandRequiredAcre: 4850.0,
    totalLandAcquiredAcre: 3280.5,
    acquisitionProgress: 67.8,
    totalCompensationCr: 840.0,
    disbursedCompensationCr: 612.4,
    compensationProgress: 72.9,
    rrProgress: 83.7,
    pendingDisputes: 42,
    delayedProjects: 2,
  };

  const d = stateData || defaultData;

  const chartData = (districts.length > 0 ? districts.slice(0, 7) : [
    { district: 'Agra', totalLandAcquiredAcre: 298.0, totalLandRequiredAcre: 420.5 },
    { district: 'Meerut', totalLandAcquiredAcre: 260.5, totalLandRequiredAcre: 380.0 },
    { district: 'Lucknow', totalLandAcquiredAcre: 390.0, totalLandRequiredAcre: 510.0 },
    { district: 'Varanasi', totalLandAcquiredAcre: 215.0, totalLandRequiredAcre: 290.0 },
    { district: 'Prayagraj', totalLandAcquiredAcre: 205.0, totalLandRequiredAcre: 340.0 },
    { district: 'Jhansi', totalLandAcquiredAcre: 185.0, totalLandRequiredAcre: 210.0 },
    { district: 'Kanpur', totalLandAcquiredAcre: 210.0, totalLandRequiredAcre: 320.0 },
  ]).map((dist) => ({
    name: dist.district,
    Acquired: dist.totalLandAcquiredAcre || 200,
    Target: dist.totalLandRequiredAcre || 300,
  }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header with Authority Profile Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-gov border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-300" />
                <span>State Government Secretariat</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>State Jurisdiction: {d.state}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {d.officerName || 'Sh. Sanjeev Khare, IAS'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-3xl">
              {d.designation || 'Principal Secretary, Revenue & Infrastructure Oversight'} • Apex monitoring of multi-district linear expressways, RFCTLARR land acquisition awards, DBT compensations, and dispute resolution.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-slate-950/40 p-4 rounded-2xl border border-indigo-400/20 backdrop-blur-md self-start lg:self-auto">
            <div className="px-3 border-r border-slate-700/60 text-center">
              <div className="text-[10px] text-indigo-300 font-bold uppercase">Total Projects</div>
              <div className="text-2xl font-black text-white">{d.totalProjects}</div>
            </div>
            <div className="px-3 border-r border-slate-700/60 text-center">
              <div className="text-[10px] text-indigo-300 font-bold uppercase">Disbursed Cr</div>
              <div className="text-2xl font-black text-emerald-400">₹{d.disbursedCompensationCr || 612.4}</div>
            </div>
            <div className="px-3 text-center">
              <div className="text-[10px] text-indigo-300 font-bold uppercase">Disputes</div>
              <div className="text-2xl font-black text-amber-400">{d.pendingDisputes || 42}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards Matching User Prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total & Active Projects */}
        <div
          onClick={() => navigate('/state/projects')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              State Projects
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.totalProjects}</span>
            <span className="text-xs font-bold text-emerald-600">({d.activeProjects} Active)</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Linear & Metro Corridors</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Districts */}
        <div
          onClick={() => navigate('/state/districts')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Districts Monitoring
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.coveredDistricts || 28}</span>
            <span className="text-xs font-bold text-slate-500">/ {d.totalDistricts || 75} Districts</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Collectorates Tracked</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Acquisition Progress */}
        <div
          onClick={() => navigate('/state/acquisition')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Acquisition Progress
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{d.acquisitionProgress || 67.8}%</span>
            <span className="text-xs font-bold text-slate-500">Possession</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{d.totalLandAcquiredAcre || 3280} / {d.totalLandRequiredAcre || 4850} Acres</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: Compensation & R&R */}
        <div
          onClick={() => navigate('/state/compensation-rnr')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Compensation & R&R
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹{d.disbursedCompensationCr || 612.4} Cr</span>
            <span className="text-xs font-bold text-purple-700">({d.rrProgress || 83.7}% R&R)</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>DBT Direct Credit Reconciled</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* 3. Mid Section: Shortcuts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: District Land Acquisition Velocity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>District-wise Acquisition Velocity (Acres)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of required ROW acreage vs. mutated possession across leading districts.
              </p>
            </div>

            <button
              onClick={() => navigate('/state/districts')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
            >
              <span>All Districts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="Acquired" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Target" fill="#e0e7ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Dynamic Shortcuts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div
              onClick={() => navigate('/state/map')}
              className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 hover:bg-indigo-50 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-indigo-900 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-700" />
                  <span>State GIS Cadastre</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-600">
                Vector corridor boundaries & cadastre overlay.
              </p>
            </div>

            <div
              onClick={() => navigate('/state/disputes')}
              className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 hover:bg-amber-50 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Disputes & Stays</span>
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded">
                  {d.pendingDisputes || 42}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Section 15 quasi-judicial hearings & High Court stays.
              </p>
            </div>

            <div
              onClick={() => navigate('/state/escalations')}
              className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 hover:bg-rose-50 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-rose-900 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-700" />
                  <span>State Escalations</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-[11px] text-slate-600">
                Inter-departmental clearance directives & apex review.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Delayed Projects & High Priority Interventions */}
        <div className="space-y-4">
          {/* Delayed Corridors Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Delayed Projects & Bottlenecks</span>
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {d.delayedProjects || 2} Corridors
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Ganga Expressway Feeder Spur</span>
                  <span className="text-rose-700">Prayagraj</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Section 19 declaration stayed by High Court. Counter-affidavit listed for Sept 12.
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Yamuna Expressway Interconnect</span>
                  <span className="text-amber-800">GB Nagar</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Forest Stage-II clearance pending for 14.8 Ha reserved forest land diversion.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/state/escalations')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Adjudicate in State Escalations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Reports Card */}
          <div
            onClick={() => navigate('/state/reports')}
            className="bg-indigo-900 text-white rounded-2xl p-5 border border-indigo-800 shadow-gov hover:bg-indigo-800 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <span>Statutory Reports</span>
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="text-base font-black text-white">Generate State Progress Reports</h4>
            <p className="text-xs text-indigo-200/80">
              Export District-wise, Project-wise, Acquisition, and Compensation dossiers to CSV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StateOfficerDashboard = () => (
  <ErrorBoundary>
    <StateOfficerDashboardContent />
  </ErrorBoundary>
);

export default StateOfficerDashboard;
