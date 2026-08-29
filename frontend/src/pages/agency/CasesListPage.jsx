import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { StatCard } from '../../components/common/StatCard';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { CASE_WORKFLOW_STAGES } from '../../utils/constants';
import {
  ClipboardCheck,
  Search,
  Filter,
  PlusCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Play,
  X,
} from 'lucide-react';

export const CasesListPage = () => {
  const navigate = useNavigate();
  const { cases, advanceCaseStage } = useLandData();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const totalCases = cases.length;
  const completedCases = cases.filter(c => c.currentStage === 'COMPLETED').length;
  const activeObjections = cases.filter(c => c.currentStage === 'OBJECTION_CLAIM' || (c.objections && c.objections.length > 0)).length;
  const paymentPending = cases.filter(c => c.currentStage === 'COMPENSATION_PAYMENT' || c.currentStage === 'COMPENSATION_ASSESSMENT').length;

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.surveyNumber.includes(searchTerm) ||
      c.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.village.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (stageFilter === 'ALL') return matchesSearch;
    return matchesSearch && c.currentStage === stageFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              End-to-End Case Management
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">RFCTLARR Act 2013 Statutory Lifecycle</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Land Acquisition Case Directory & Workflow Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor and execute statutory acquisition stages from Project Proposal to Possession and Rehabilitation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/cases/CASE-2026-DME-0101')}
            className="bg-gov-saffron-600 hover:bg-gov-saffron-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition animate-pulse"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Demo Case (Ram Kumar - Khasra 101)</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Cases"
          value={totalCases}
          subtitle="All Corridor Packages"
          icon={Layers}
          variant="default"
        />
        <StatCard
          title="Payment / Award Phase"
          value={paymentPending}
          subtitle="PFMS DBT Processing"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Dispute & Objections"
          value={activeObjections}
          subtitle="Section 15 Hearings"
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Possession Completed"
          value={completedCases}
          subtitle="Mutated & Handed Over"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Case Directory Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-gov-blue-900" />
              <span>Active Acquisition Case Files</span>
            </h3>
            <p className="text-xs text-slate-500">Click any case to inspect detailed documents, objections, timeline, and approval actions</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Case ID, Owner, Khasra..."
                className="w-full text-xs bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-gov-blue-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 w-full sm:w-auto"
            >
              <option value="ALL">All Lifecycle Stages</option>
              {CASE_WORKFLOW_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  Stage {s.step}: {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-left border-b border-slate-200">
                <th className="p-3.5">Case ID / Project</th>
                <th className="p-3.5">Survey (Khasra) / Owner</th>
                <th className="p-3.5">Location & Area</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Compensation Award</th>
                <th className="p-3.5">AI Delay Risk</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCases.map((c) => {
                const stageConfig = CASE_WORKFLOW_STAGES.find(s => s.id === c.currentStage) || CASE_WORKFLOW_STAGES[0];
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <span className="font-extrabold text-gov-blue-900 text-sm block font-mono">{c.id}</span>
                      <span className="text-[10px] text-slate-500 font-semibold truncate block max-w-xs">{c.projectName}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">Khasra {c.surveyNumber} ({c.ownerName})</span>
                      <span className="text-[10px] text-slate-400">{c.fatherName}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{c.areaAcre} Acre</span>
                      <span className="text-[10px] text-slate-500">{c.village}, {c.district}</span>
                    </td>

                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 font-bold text-[10px] px-2.5 py-1 rounded-full border ${stageConfig.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stageConfig.dot}`} />
                        Stage {stageConfig.step}: {stageConfig.label}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-black text-slate-900 block">{formatCurrency(c.totalCompensation)}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{c.paymentStatus}</span>
                    </td>

                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded ${
                        c.aiRiskLevel === 'LOW' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        c.aiRiskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        c.aiRiskLevel === 'HIGH' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                        'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {c.aiRiskLevel} ({c.aiRiskScore}%)
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => navigate(`/cases/${c.id}`)}
                        className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ml-auto shadow-xs"
                      >
                        <span>Open Case</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
