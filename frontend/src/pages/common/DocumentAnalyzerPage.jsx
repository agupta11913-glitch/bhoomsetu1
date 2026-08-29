import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { AIDocumentOCRModal } from '../../components/dashboard/AIDocumentOCRModal';
import {
  FileSearch,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X,
} from 'lucide-react';

export const DocumentAnalyzerPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [targetKhasra, setTargetKhasra] = useState('101');

  const handleLaunchScan = (khasraNum) => {
    setTargetKhasra(khasraNum);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Neural OCR & Document Vision
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Sub-Registrar Deed Extraction</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            AI Land Document OCR & Verification Suite
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Extract entities from Hindi/English registered deeds, Khatauni extracts, and Section 11 notices with automatic mismatch comparison.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleLaunchScan('101')}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
          >
            <UploadCloud className="w-4 h-4 text-gov-saffron-500" />
            <span>Launch Scanner</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* 3 Preconfigured Demo Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scenario 1: Khasra 101 Perfect Match */}
        <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-gov p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                100% Match Demo
              </span>
              <span className="font-bold text-xs text-gov-blue-900">Khasra 101</span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900">
              Ram Kumar (Nagla, Agra)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Registered Sale Deed #4102/2018 matches 2.50 Acre Bhulekh RoR with zero discrepancies.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 block">Extracted Owner: <strong>Ram Kumar</strong></span>
              <span className="text-slate-500 block">Extracted Area: <strong>2.50 Acre</strong></span>
            </div>
          </div>

          <button
            onClick={() => handleLaunchScan('101')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Run OCR on Khasra 101 Deed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scenario 2: Khasra 102 Name Discrepancy */}
        <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-gov p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                Name Mismatch Demo
              </span>
              <span className="font-bold text-xs text-gov-blue-900">Khasra 102</span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900">
              Ramesh Kumar vs Rameshwar Kumar
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              OCR detects spelling difference between registered deed ("Ramesh Kumar") and Bhulekh server ("Rameshwar Kumar").
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 block">Deed Name: <strong className="text-rose-600">Ramesh Kumar</strong></span>
              <span className="text-slate-500 block">Bhulekh RoR: <strong className="text-slate-900">Rameshwar Kumar</strong></span>
            </div>
          </div>

          <button
            onClick={() => handleLaunchScan('102')}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Run OCR on Khasra 102 Deed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scenario 3: Khasra 117 Area Variance */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-gov p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Area Variance Demo
              </span>
              <span className="font-bold text-xs text-gov-blue-900">Khasra 117</span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900">
              Vijay Pal Yadav (Area Variance)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              OCR extracts 2.90 Acre from registered partition deed whereas Bhulekh database records 3.50 Acre.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 block">Deed Area: <strong className="text-amber-700">2.90 Acre</strong></span>
              <span className="text-slate-500 block">Bhulekh RoR: <strong className="text-slate-900">3.50 Acre</strong></span>
            </div>
          </div>

          <button
            onClick={() => handleLaunchScan('117')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Run OCR on Khasra 117 Deed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* OCR Modal */}
      <AIDocumentOCRModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultKhasraId={targetKhasra}
      />
    </div>
  );
};
