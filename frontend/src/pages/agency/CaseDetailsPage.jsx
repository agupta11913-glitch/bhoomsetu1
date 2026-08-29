import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { CASE_WORKFLOW_STAGES } from '../../utils/constants';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  FileText,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Banknote,
  Users,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  Printer,
  ChevronRight,
  User,
  Phone,
  Mail,
  Download,
  Eye,
  Check,
  X,
  Play,
} from 'lucide-react';

export const CaseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, advanceCaseStage, khasras } = useLandData();

  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [advanceNotes, setAdvanceNotes] = useState('');
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [targetStageSelect, setTargetStageSelect] = useState('');

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const stageIndex = CASE_WORKFLOW_STAGES.findIndex((s) => s.id === currentCase.currentStage);
  const currentStageConfig = CASE_WORKFLOW_STAGES[stageIndex] || CASE_WORKFLOW_STAGES[0];
  const nextStageConfig = CASE_WORKFLOW_STAGES[stageIndex + 1] || null;

  const handleAdvanceConfirm = (stageId) => {
    advanceCaseStage(currentCase.id, stageId || nextStageConfig?.id, advanceNotes);
    setAdvanceNotes('');
    setShowAdvanceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => navigate('/cases')}
            className="text-slate-500 hover:text-gov-blue-900 font-bold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Cases</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-mono font-extrabold text-gov-blue-900">{currentCase.id}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-semibold truncate">{currentCase.projectName}</span>
        </div>

        <div className="flex items-center gap-2">
          {nextStageConfig && (
            <button
              onClick={() => handleAdvanceConfirm(nextStageConfig.id)}
              className="bg-gov-saffron-600 hover:bg-gov-saffron-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Advance to: {nextStageConfig.label}</span>
            </button>
          )}

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

      {/* Case Header Master Card */}
      <div className="bg-gradient-to-br from-gov-blue-950 via-gov-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gov-blue-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-gov-saffron-500/20 text-gov-saffron-400 font-mono font-extrabold text-xs px-3 py-1 rounded-lg border border-gov-saffron-500/30">
                CASE ID: {currentCase.id}
              </span>
              <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-semibold">
                {currentCase.projectType}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${currentStageConfig.color}`}>
                Stage {currentStageConfig.step}/13: {currentStageConfig.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {currentCase.projectName}
            </h1>

            <p className="text-xs text-slate-300">
              Khasra: <strong>{currentCase.surveyNumber}</strong> • Khata: <strong>{currentCase.khataNumber}</strong> • Village: <strong>{currentCase.village}</strong>, Tehsil: <strong>{currentCase.tehsil}</strong>, District: <strong>{currentCase.district}</strong>
            </p>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur p-3.5 rounded-2xl border border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Acquisition Area</span>
              <span className="text-xl font-black text-white">{currentCase.areaAcre} Acre</span>
              <span className="text-[10px] text-slate-400 block">{currentCase.areaHectare} Hectare</span>
            </div>

            <div className="bg-white/10 backdrop-blur p-3.5 rounded-2xl border border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-saffron-400 block">Total Award Value</span>
              <span className="text-xl font-black text-white">{formatCurrency(currentCase.totalCompensation)}</span>
              <span className="text-[10px] text-emerald-300 block font-semibold">{currentCase.paymentStatus}</span>
            </div>

            <div className="bg-white/10 backdrop-blur p-3.5 rounded-2xl border border-white/15 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">AI Delay Risk</span>
              <span className={`text-xl font-black ${currentCase.aiRiskLevel === 'LOW' ? 'text-emerald-400' : currentCase.aiRiskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}`}>
                {currentCase.aiRiskLevel} ({currentCase.aiRiskScore}%)
              </span>
              <span className="text-[10px] text-slate-300 block">Est Delay: {currentCase.aiDelayDays} Days</span>
            </div>
          </div>
        </div>

        {/* Assigned Officer & Owner Strip */}
        <div className="pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-gov-saffron-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Land Owner</span>
              <span className="font-extrabold text-white text-sm">{currentCase.ownerName}</span>
              <span className="text-[11px] text-slate-300 block">{currentCase.fatherName} • {currentCase.ownerPhone}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Statutory Officer</span>
              <span className="font-extrabold text-white text-sm">{currentCase.assignedOfficer}</span>
              <span className="text-[11px] text-slate-300 block">{currentCase.officerPhone} • {currentCase.officerEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 12-Stage Interactive Lifecycle Stepper */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gov-blue-900" />
              <span>Complete 12-Stage Acquisition Lifecycle Progression</span>
            </h3>
            <p className="text-xs text-slate-500">Judges can click any stage below to simulate direct stage advancement with mock data mutation</p>
          </div>

          <span className="text-xs font-bold text-gov-blue-900 bg-gov-blue-50 border border-gov-blue-200 px-3 py-1 rounded-full">
            Active: {currentStageConfig.label}
          </span>
        </div>

        {/* Stepper Scroll Container */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-[950px] gap-1">
            {CASE_WORKFLOW_STAGES.map((stage, idx) => {
              const isPast = idx < stageIndex;
              const isCurrent = idx === stageIndex;
              const isFuture = idx > stageIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleAdvanceConfirm(stage.id)}
                  className={`flex-1 p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between min-h-[72px] ${
                    isCurrent
                      ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-md ring-2 ring-gov-saffron-500/60'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`Click to set stage to: ${stage.label}`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold">Step {stage.step}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-gov-saffron-500 animate-pulse" />}
                  </div>

                  <span className={`text-[11px] font-extrabold leading-tight ${isCurrent ? 'text-white' : isPast ? 'text-slate-900' : 'text-slate-500'}`}>
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'OVERVIEW', label: 'Statutory Valuation & RoR' },
          { id: 'DOCUMENTS', label: `Documents (${currentCase.documents?.length || 0})` },
          { id: 'OBJECTIONS', label: `Objections & Claims (${currentCase.objections?.length || 0})` },
          { id: 'RR_PLAN', label: 'R&R Schedule II Package' },
          { id: 'APPROVALS', label: `Approval History (${currentCase.approvalHistory?.length || 0})` },
          { id: 'TIMELINE', label: 'Event Timeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition shrink-0 ${
              activeTab === tab.id
                ? 'bg-gov-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Statutory Valuation */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Statutory RFCTLARR Valuation Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-gov-green-700" />
              <span>Statutory Compensation Award Calculation (RFCTLARR 2013)</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Notified Area (Acre):</span>
                <span className="font-bold text-slate-900">{currentCase.areaAcre} Acre ({currentCase.areaHectare} Ha)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">District Circle Rate:</span>
                <span className="font-bold text-slate-900">{formatCurrency(currentCase.circleRatePerAcre)} / Acre</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Assessed Market Value:</span>
                <span className="font-bold text-slate-900">{formatCurrency(currentCase.marketValue)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Rural Multiplier Factor:</span>
                <span className="font-bold text-gov-blue-900 bg-blue-50 px-2 py-0.5 rounded">× {currentCase.multiplyingFactor} (Rural 2.0x Multiplier)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Base Compensation:</span>
                <span className="font-bold text-slate-900">{formatCurrency(currentCase.baseCompensation)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">100% Solatium (Sec 30):</span>
                <span className="font-bold text-slate-900">{formatCurrency(currentCase.solatium)}</span>
              </div>
              <div className="flex justify-between py-3 bg-emerald-50 px-3 rounded-xl border border-emerald-200 text-sm">
                <span className="font-extrabold text-emerald-950">Net Statutory Award:</span>
                <span className="font-black text-gov-green-700 text-base">{formatCurrency(currentCase.totalCompensation)}</span>
              </div>
            </div>

            {/* PFMS Mandate status */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">PFMS DBT Disbursement Mandate</span>
              <p className="font-bold text-slate-800">Account: {currentCase.bankAccount}</p>
              <p className="text-slate-500">Payment Status: <strong className="text-emerald-700">{currentCase.paymentStatus}</strong></p>
              {currentCase.paymentUtr && (
                <p className="font-mono text-[11px] text-gov-blue-900 font-extrabold">UTR: {currentCase.paymentUtr} ({formatDate(currentCase.paymentDate)})</p>
              )}
            </div>
          </div>

          {/* RoR Cadastral Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gov-blue-900" />
                <span>Bhulekh RoR & Land Record Parameters</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Land Classification:</span>
                  <span className="font-bold text-slate-900">{currentCase.landType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Dispute Status:</span>
                  <span className="font-bold text-emerald-700">{currentCase.disputeStatus}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Fasli Mutation Year:</span>
                  <span className="font-bold text-slate-800">1431-1436 Fasli (2018 Mutation)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Revenue Encumbrance:</span>
                  <span className="font-bold text-slate-800">Nil (Clear Title)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/gis-map')}
              className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <MapPin className="w-4 h-4 text-gov-saffron-500" />
              <span>Inspect Cadastral GIS Map Boundary</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Documents */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gov-blue-900" />
            <span>Statutory Case Documents & Extracts</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentCase.documents?.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-gov-blue-50 text-gov-blue-900 px-2 py-0.5 rounded border border-gov-blue-200">
                      {doc.type}
                    </span>
                    <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 mt-2">{doc.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Authority: {doc.authority} • Date: {doc.date}</p>
                </div>

                <button
                  onClick={() => alert(`Simulating viewing certified ${doc.name}`)}
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-1.5 rounded-lg border border-slate-200 text-xs flex items-center justify-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-gov-blue-900" />
                  <span>Inspect Document</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Objections & Claims */}
      {activeTab === 'OBJECTIONS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Section 15 Citizen Claims & Hearing Records</span>
            </h3>
            <button
              onClick={() => navigate('/citizen/submit-objection')}
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition"
            >
              + File New Objection
            </button>
          </div>

          {currentCase.objections && currentCase.objections.length > 0 ? (
            <div className="space-y-3">
              {currentCase.objections.map((obj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-orange-950">Claim ID: {obj.id || `OBJ-${idx+1}`}</span>
                    <span className="bg-orange-200 text-orange-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {obj.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800">{obj.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-800 mt-2">Zero Active Objections</h4>
              <p className="text-xs text-slate-500 mt-0.5">This land parcel has a clear title and no pending Section 15 statutory disputes.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Rehabilitation & Resettlement (R&R) */}
      {activeTab === 'RR_PLAN' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>Rehabilitation & Resettlement (R&R) Entitlements (RFCTLARR Schedule II)</span>
              </h3>
              <p className="text-xs text-slate-500">Applicable for Project Affected Family (PAF) of Sh. {currentCase.ownerName}</p>
            </div>

            <button
              onClick={() => navigate('/rehabilitation-resettlement')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition"
            >
              Open Full R&R Hub
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCase.rrPackage?.entitlements?.map((ent, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-emerald-950">{ent.title}</span>
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    {ent.status}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 font-semibold">{ent.amount || ent.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Approval History */}
      {activeTab === 'APPROVALS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gov-blue-900" />
            <span>Digital Approvals & Statutory Sanctions Ledger</span>
          </h3>

          <div className="space-y-3">
            {currentCase.approvalHistory?.map((app, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{app.stage}</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-slate-500">Authority: <strong>{app.authority}</strong> • Date: <span className="font-mono">{app.date}</span></p>
                  <p className="text-slate-700 italic">"{app.remarks}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Timeline */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gov-blue-900" />
            <span>Chronological Lifecycle Event History</span>
          </h3>

          <div className="space-y-4 pl-2">
            {currentCase.timeline?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  item.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {item.completed ? '✓' : idx + 1}
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.date})</span>
                  </div>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
