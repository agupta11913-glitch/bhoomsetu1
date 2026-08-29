import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCentralDashboardApi, fetchCentralStatesApi } from '../../services/api/centralApi';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Globe,
  Layers,
  Building2,
  MapPin,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Banknote,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  BarChart3,
  CheckCircle2,
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

const CentralDashboardContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCentralDashboardApi(),
      fetchCentralStatesApi(),
    ]).then(([d, s]) => {
      if (d) setData(d);
      if (Array.isArray(s)) setStates(s);
      setLoading(false);
    });
  }, []);

  const defaultData = {
    officerName: 'Dr. Arvind Meena, IAS',
    designation: 'Joint Secretary, PM Gati Shakti National Master Plan',
    ministry: 'Cabinet Secretariat & PM Gati Shakti Infrastructure Unit',
    totalStates: 28,
    activeStates: 18,
    totalProjects: 32,
    activeProjects: 30,
    overallAcquisitionProgress: 75.9,
    compensationRnRProgress: 81.4,
    pendingMajorDisputes: 14,
    delayedProjects: 4,
    pendingEscalations: 5,
    totalLandRequiredAcre: 48500.0,
    totalLandAcquiredAcre: 36800.0,
    totalBudgetCr: 148500.0,
    disbursedCompensationCr: 31250.0,
  };

  const d = data || defaultData;

  const chartData = (states.length > 0 ? states.slice(0, 8) : [
    { state: 'Uttar Pradesh', acquisitionProgress: 67.8, compensationRnR: 78.4 },
    { state: 'Maharashtra', acquisitionProgress: 73.1, compensationRnR: 82.0 },
    { state: 'Gujarat', acquisitionProgress: 93.6, compensationRnR: 96.7 },
    { state: 'Haryana', acquisitionProgress: 80.0, compensationRnR: 85.0 },
    { state: 'Madhya Pradesh', acquisitionProgress: 69.0, compensationRnR: 72.5 },
    { state: 'Rajasthan', acquisitionProgress: 83.7, compensationRnR: 88.0 },
    { state: 'Karnataka', acquisitionProgress: 76.5, compensationRnR: 79.8 },
    { state: 'Bihar', acquisitionProgress: 60.0, compensationRnR: 62.0 },
  ]).map((s) => ({
    name: s.stateCode || s.state.substring(0, 4),
    Acquisition: s.acquisitionProgress || 70,
    CompRnR: s.compensationRnR || 75,
  }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-gov border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-300" />
                <span>Central Government • PM Gati Shakti</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pan-India Infrastructure Master Plan</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {d.officerName || 'Dr. Arvind Meena, IAS'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              {d.designation || 'Joint Secretary, PM Gati Shakti National Master Plan'} • Apex monitoring of multi-state expressways, dedicated freight corridors, high-speed rail networks, and inter-state statutory clearances.
            </p>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md self-start lg:self-auto">
            <div className="px-3 border-r border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Total States</div>
              <div className="text-2xl font-black text-white">{d.totalStates || 28}</div>
            </div>
            <div className="px-3 border-r border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Active Projects</div>
              <div className="text-2xl font-black text-indigo-400">{d.activeProjects || 30}</div>
            </div>
            <div className="px-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">DBT Disbursed</div>
              <div className="text-2xl font-black text-emerald-400">₹{(d.disbursedCompensationCr || 31250).toLocaleString()} Cr</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: 8 Required Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total States */}
        <div
          onClick={() => navigate('/central/states')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-indigo-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total States</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.totalStates || 28}</span>
            <span className="text-xs font-bold text-slate-500">({d.activeStates || 18} Active)</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>State Jurisdictions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 2. Total & Active Projects */}
        <div
          onClick={() => navigate('/central/projects')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-blue-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">National Projects</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.totalProjects || 32}</span>
            <span className="text-xs font-bold text-emerald-600">({d.activeProjects || 30} Active)</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Mega Corridors</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 3. Overall Acquisition Progress */}
        <div
          onClick={() => navigate('/central/acquisition')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-emerald-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acquisition Progress</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{d.overallAcquisitionProgress || 75.9}%</span>
            <span className="text-xs font-bold text-slate-500">Possession</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>36,800 / 48,500 Acres</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 4. Compensation & R&R Progress */}
        <div
          onClick={() => navigate('/central/compensation-rnr')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-purple-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compensation & R&R</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.compensationRnRProgress || 81.4}%</span>
            <span className="text-xs font-bold text-purple-700">(88.3% PAF)</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>PFMS DBT Settled</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 5. Pending Major Disputes */}
        <div
          onClick={() => navigate('/central/disputes')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-amber-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Major Disputes</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800">{d.pendingMajorDisputes || 14}</span>
            <span className="text-xs font-bold text-amber-700">Litigations</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>High Court & Tribunals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 6. Delayed Projects */}
        <div
          onClick={() => navigate('/central/reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-rose-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delayed Projects</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">{d.delayedProjects || 4}</span>
            <span className="text-xs font-bold text-rose-600">Corridors</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Inter-State Roadblocks</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 7. Pending Escalations */}
        <div
          onClick={() => navigate('/central/escalations')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-indigo-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Escalations</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-900">{d.pendingEscalations || 5}</span>
            <span className="text-xs font-bold text-indigo-600">State Referrals</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Apex Cabinet Action</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 8. Pan-India GIS Map Quick Link */}
        <div
          onClick={() => navigate('/central/map')}
          className="bg-indigo-900 text-white rounded-2xl p-5 border border-indigo-800 shadow-gov hover:bg-indigo-800 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">National GIS Cadastre</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center group-hover:scale-110 transition">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">Full Map</span>
            <span className="text-xs font-bold text-indigo-300">All Corridors</span>
          </div>
          <div className="text-xs text-indigo-200 flex items-center justify-between pt-1">
            <span>Vector Alignment Overlay</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Mid Section: State Performance Bar Chart & Active Delays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: State Performance Velocity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>State-wise Acquisition & Compensation Progress (%)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Comparative delivery benchmarks across high-priority corridor states.
              </p>
            </div>

            <button
              onClick={() => navigate('/central/states')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
            >
              <span>View All States</span>
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
                <Bar dataKey="Acquisition" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="CompRnR" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Direct Shortcuts Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div
              onClick={() => navigate('/central/projects')}
              className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 hover:bg-indigo-50 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-indigo-900 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-700" />
                  <span>National Projects</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-600">
                Expressway, railway, and energy corridor registry.
              </p>
            </div>

            <div
              onClick={() => navigate('/central/disputes')}
              className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 hover:bg-amber-50 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Major Disputes</span>
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded">
                  {d.pendingMajorDisputes || 14}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                High Court stays & LARRA tribunal litigations.
              </p>
            </div>

            <div
              onClick={() => navigate('/central/escalations')}
              className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 hover:bg-rose-50 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-rose-900 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-700" />
                  <span>Central Escalations</span>
                </span>
                <span className="bg-rose-200 text-rose-900 text-[10px] font-black px-1.5 py-0.2 rounded">
                  {d.pendingEscalations || 5}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                PMO & Cabinet Infrastructure committee directives.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Key Central Focus Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Inter-State Roadblocks</span>
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {d.delayedProjects || 4} Critical
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Ken-Betwa Canal (MP)</span>
                  <span className="text-rose-700">Stage-II Forest</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Buffer zone diversion clearance pending with Wildlife Board.
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Ganga Exp Spur (UP)</span>
                  <span className="text-amber-800">High Court Stay</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Section 19 notification stayed; special counsel list on Sept 12.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/central/escalations')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Take Central Action in Escalations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => navigate('/central/reports')}
            className="bg-indigo-900 text-white rounded-2xl p-5 border border-indigo-800 shadow-gov hover:bg-indigo-800 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <span>National Reports</span>
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="text-base font-black text-white">Generate PM Gati Shakti Reports</h4>
            <p className="text-xs text-indigo-200/80">
              Export State-wise, Project-wise, Acquisition, Compensation & Delayed projects to CSV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NationalMonitoringDashboard = () => (
  <ErrorBoundary>
    <CentralDashboardContent />
  </ErrorBoundary>
);

export default NationalMonitoringDashboard;
