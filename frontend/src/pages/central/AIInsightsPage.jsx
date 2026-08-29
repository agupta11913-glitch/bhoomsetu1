import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { StatCard } from '../../components/common/StatCard';
import { HIGH_RISK_PROJECTS, RISK_DISTRIBUTION } from '../../data/mockNationalData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Brain,
  Layers,
  ArrowRight,
  HelpCircle,
  FileSearch,
  Users,
  Activity,
  Calendar,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const AIInsightsPage = () => {
  const navigate = useNavigate();
  const { projects, cases } = useLandData();
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-001');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Radar dataset for risk driver dimensions
  const riskDimensions = [
    { dimension: 'Title Disputes', score: 88 },
    { dimension: 'Officer Workload', score: 75 },
    { dimension: 'Section 15 Objections', score: 82 },
    { dimension: 'Compensation Lag', score: 70 },
    { dimension: 'GIS Overlap', score: 62 },
    { dimension: 'R&R Compliance', score: 55 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-purple-600" />
              BhoomiSetu Neural Delay Risk Engine
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Predictive AI Analytics (Prototype)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            AI-Based Project Risk & Delay Forecasting
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Machine learning assessment of cadastral title friction, officer workload queues, and statutory delay probabilities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-700"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Mandatory Prototype Transparency Notice */}
      <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200 flex items-start gap-3 text-xs text-purple-900">
        <Sparkles className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-sm text-purple-950">PROTOTYPE AI DECISION-SUPPORT NOTICE:</h4>
          <p className="mt-0.5 leading-relaxed text-purple-800">
            BhoomiSetu AI provides simulated predictive risk scores and automated recommendations for decision support only. Statutory orders, compensation sanctions, and quasi-judicial declarations are strictly made by authorized government officers.
          </p>
        </div>
      </div>

      {/* Flagship Project AI Delay Risk Hero Card */}
      <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
              Predictive AI Corridor Assessment • {selectedProject.name}
            </span>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                AI Delay Risk: <span className="text-rose-400">{selectedProject.aiRiskLevel}</span>
              </h1>
              <span className="bg-rose-500/20 text-rose-300 font-mono font-black text-xl px-3 py-1 rounded-xl border border-rose-500/40">
                {selectedProject.aiRiskScore}%
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Target Completion: <strong className="text-white">{formatDate(selectedProject.targetDate)}</strong> • Predicted Completion: <strong className="text-rose-300">{formatDate(selectedProject.predictedCompletionDate || '2027-07-15')}</strong> (Estimated Delay: <strong className="text-gov-saffron-400">+{selectedProject.aiDelayMonths || 3.5} Months / 105 Days</strong>)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] uppercase font-bold text-purple-300 block">Risk Category</span>
              <span className="text-lg font-black text-white">{selectedProject.aiRiskLevel} Risk</span>
              <span className="text-[10px] text-slate-300 block">Confidence: 94.2%</span>
            </div>

            <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] uppercase font-bold text-gov-saffron-300 block">Bottleneck Parcels</span>
              <span className="text-lg font-black text-white">{selectedProject.activeObjections || 5} High Risk</span>
              <span className="text-[10px] text-slate-300 block">Sec 15 Objections</span>
            </div>
          </div>
        </div>

        {/* AI Actionable Recommendation Box */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-purple-400/30 space-y-2">
          <div className="flex items-center gap-2 text-gov-saffron-400 font-extrabold text-xs">
            <Brain className="w-4 h-4" />
            <span>AI EXECUTIVE RECOMMENDATION</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            "{selectedProject.aiRecommendations?.[0] || 'Prioritize ownership verification for 12 disputed parcels and schedule district-level review because the project has a high probability of delay.'}"
          </p>
        </div>
      </div>

      {/* Risk Drivers & Multi-Dimensional Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Drivers Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Key Delay Risk Drivers & Friction Points</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">6 Active Drivers</span>
          </div>

          <div className="space-y-2.5">
            {selectedProject.riskFactors?.map((factor, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-800 font-semibold leading-snug">{factor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Dimensional Radar Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-700" />
              <span>Multi-Dimensional Risk Vector</span>
            </h3>
            <p className="text-xs text-slate-500 pt-1">Relative severity across statutory acquisition friction parameters</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskDimensions}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Risk Index" dataKey="score" stroke="#9333ea" fill="#a855f7" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Next Actions Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gov-green-700" />
          <span>Recommended Mitigation Action Plan</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-2">
            <span className="font-extrabold text-xs text-blue-950 block">1. Fast-Track Alias Affidavits</span>
            <p className="text-xs text-blue-800 leading-snug">
              Convene special Tehsil Lok Adalats to resolve Ramesh Kumar vs Rameshwar Kumar name discrepancies within 10 days.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
            <span className="font-extrabold text-xs text-amber-950 block">2. Drone ETS Canal Buffer Survey</span>
            <p className="text-xs text-amber-800 leading-snug">
              Depute GIS drone mapping team to finalize irrigation canal buffer on Khasra 103 and update cadastral layer.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2">
            <span className="font-extrabold text-xs text-emerald-950 block">3. Batch PFMS Compensation Release</span>
            <p className="text-xs text-emerald-800 leading-snug">
              Queue ₹5.20 Cr direct bank credits for all undisputed parcels to accelerate physical possession handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
