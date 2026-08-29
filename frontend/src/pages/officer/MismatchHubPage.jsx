import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import {
  AlertTriangle,
  ShieldAlert,
  FileSearch,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  X,
} from 'lucide-react';

export const MismatchHubPage = () => {
  const navigate = useNavigate();
  const { khasras, showToast } = useLandData();

  const flaggedParcels = khasras.filter(
    (k) => k.mismatch?.hasMismatch || k.status === 'MISMATCH_FLAGGED' || k.status === 'BOUNDARY_ISSUE'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
              AI Decision Support
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Anomaly & Conflict Detection</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            AI Land Record Mismatch Detection Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated tri-factor comparison between Bhulekh RoR, Uploaded Registry Deeds, and GIS Cadastral Boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-2 rounded-xl border border-rose-300">
            {flaggedParcels.length} Discrepancies
          </span>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-sm">IMPORTANT LEGAL RESTRICTION:</h4>
          <p className="mt-0.5 leading-relaxed">
            AI mismatch detection functions strictly as an advisory decision support tool for administrative officers. AI must <strong>NEVER</strong> automatically approve, cancel, or reject legal property titles. All flagged records require manual field verification or Tehsildar order.
          </p>
        </div>
      </div>

      {/* Mismatch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario 1: Ramesh Kumar Name Discrepancy */}
        <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-gov p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                Owner Spelling & Alias Mismatch
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Khasra 102 (Nagla, Fatehabad)
              </h3>
            </div>
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              High Priority
            </span>
          </div>

          {/* Side-by-side discrepancy table */}
          <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-200">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Bhulekh RoR:</span>
              <span className="font-bold text-slate-900">Rameshwar Kumar s/o Badri Prasad</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Uploaded Deed (AI OCR):</span>
              <span className="font-bold text-rose-600">Ramesh Kumar s/o Badri Prasad ❌</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">Area:</span>
              <span className="font-semibold text-slate-800">1.80 Acre (Match ✓)</span>
            </div>
          </div>

          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
            <span className="font-bold block">AI Decision Recommendation:</span>
            <p className="text-[11px] leading-relaxed">
              Name phonetically similar (91.2% confidence). Tehsildar affidavit or sub-divisional family tree certification required to verify whether "Rameshwar Kumar" and "Ramesh Kumar" are the same legal individual.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => showToast('Hearing Order Logged', 'Notice dispatched to Ramesh Kumar for alias affidavit.', 'info')}
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Issue Notice for Alias Affidavit
            </button>
          </div>
        </div>

        {/* Scenario 2: Vijay Pal Yadav Area Variance */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-gov p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Area Variance / Un-mutated Partition
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Khasra 117 (Nagla, Fatehabad)
              </h3>
            </div>
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Medium Priority
            </span>
          </div>

          {/* Side-by-side discrepancy table */}
          <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-200">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Bhulekh RoR Area:</span>
              <span className="font-black text-slate-900">3.50 Acre</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Partition Deed Area:</span>
              <span className="font-black text-amber-700">2.90 Acre (0.60 Ac Variance) ⚠</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">Owner Name:</span>
              <span className="font-semibold text-slate-800">Vijay Pal Yadav (Match ✓)</span>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">AI Decision Recommendation:</span>
            <p className="text-[11px] leading-relaxed">
              Family partition deed was executed in 2020 but mutation entry was not updated on Bhulekh server. Update mutation records before compensation disbursement.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => showToast('Order Generated', 'Expedited Tehsil mutation order generated for Khasra 117.', 'info')}
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Order Expedited Mutation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
