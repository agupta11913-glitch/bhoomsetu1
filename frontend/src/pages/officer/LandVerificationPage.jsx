import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  Database,
  FileSearch,
  X,
} from 'lucide-react';

export const LandVerificationPage = () => {
  const navigate = useNavigate();
  const { khasras, verifyRevenueRecord, showToast } = useLandData();

  const [activeKhasraNum, setActiveKhasraNum] = useState('101');
  const [verificationNotes, setVerificationNotes] = useState('RoR matched 100% with registered deed #4102/2018.');

  const currentKhasra = khasras.find((k) => k.khasraNumber === activeKhasraNum) || khasras[0];

  const handleVerify = () => {
    verifyRevenueRecord(currentKhasra.id, verificationNotes);
  };

  const handleFlagMismatch = () => {
    showToast('Discrepancy Flagged', `Khasra ${currentKhasra.khasraNumber} referred to Tehsildar field inspection.`, 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Side-by-Side Record Comparison
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Bhulekh RoR vs Sub-Registrar Deed</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Land Title & Ownership Verification Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare official digital Khatauni against uploaded registry deeds with AI mismatch assistance.
          </p>
        </div>

        {/* Khasra Switcher + Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            {['101', '102', '103', '104', '105', '117', '134'].map((num) => (
              <button
                key={num}
                onClick={() => setActiveKhasraNum(num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  activeKhasraNum === num
                    ? 'bg-gov-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                #{num}
              </button>
            ))}
          </div>

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

      {/* AI Comparison Result Bar */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        currentKhasra.mismatch?.hasMismatch
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center gap-3">
          {currentKhasra.mismatch?.hasMismatch ? (
            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base">
                {currentKhasra.mismatch?.hasMismatch
                  ? 'POSSIBLE RECORD MISMATCH DETECTED ⚠'
                  : 'LAND RECORD TITLE VERIFIED: 100% MATCH ✓'}
              </h3>
              <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border">
                Confidence: {currentKhasra.uploadedDocument?.ocrConfidence || 98.4}%
              </span>
            </div>
            <p className="text-xs mt-0.5">
              {currentKhasra.mismatch?.hasMismatch
                ? currentKhasra.mismatch.title + ' — ' + currentKhasra.mismatch.recommendation
                : `All 6 key parameters (Owner Name, Father Name, Area ${currentKhasra.areaAcre} Ac, Fasli Year, Village, and Encumbrance) match with 0 discrepancies.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className={`px-2.5 py-1 rounded-lg ${!currentKhasra.mismatch?.hasMismatch ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            OWNER MATCH {currentKhasra.mismatch?.hasMismatch && currentKhasra.mismatch.type === 'OWNER_NAME_DISCREPANCY' ? '❌' : '✓'}
          </span>
          <span className={`px-2.5 py-1 rounded-lg ${!currentKhasra.mismatch?.hasMismatch ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            AREA MATCH {currentKhasra.mismatch?.hasMismatch && currentKhasra.mismatch.type === 'AREA_MISMATCH' ? '⚠' : '✓'}
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Bhulekh Record */}
        <div className="bg-white rounded-2xl border-2 border-gov-blue-800 shadow-gov overflow-hidden">
          <div className="bg-gov-blue-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-gov-saffron-500" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                Official Bhulekh UP RoR (Khatauni)
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-gov-blue-950 px-2 py-0.5 rounded text-gov-saffron-400">
              SIMULATED GOV DATA
            </span>
          </div>

          <div className="p-5 space-y-3.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Recorded Khatedar (Owner):</span>
              <span className="font-extrabold text-slate-900">
                {currentKhasra.bhulekhRecord?.recordedOwner || currentKhasra.ownerName}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Father's / Husband's Name:</span>
              <span className="font-bold text-slate-800">{currentKhasra.fatherName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Khasra / Gata Number:</span>
              <span className="font-black text-gov-blue-900">{currentKhasra.khasraNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Khata Number:</span>
              <span className="font-mono text-slate-800">{currentKhasra.khataNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Recorded Area:</span>
              <span className="font-black text-slate-900">{currentKhasra.areaAcre} Acre ({(currentKhasra.areaAcre * 0.404686).toFixed(2)} Ha)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Village & Tehsil:</span>
              <span className="font-semibold text-slate-800">{currentKhasra.village}, {currentKhasra.tehsil}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-semibold">Encumbrance & Mortgages:</span>
              <span className="font-medium text-slate-700">
                {currentKhasra.bhulekhRecord?.encumbrance || 'Nil (Clear Title)'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Uploaded Certified Document */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-gov overflow-hidden">
          <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                Uploaded Registered Sale Deed (AI OCR)
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-emerald-400">
              Sub-Registrar Certified
            </span>
          </div>

          <div className="p-5 space-y-3.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Document Type & No:</span>
              <span className="font-bold text-slate-900">
                {currentKhasra.uploadedDocument?.documentType || 'Registered Deed No. 4102/2018'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Purchaser / Khatedar:</span>
              <span className={`font-extrabold ${currentKhasra.mismatch?.hasMismatch && currentKhasra.mismatch.type === 'OWNER_NAME_DISCREPANCY' ? 'text-rose-600 bg-rose-50 px-2 rounded' : 'text-slate-900'}`}>
                {currentKhasra.uploadedDocument?.registeredOwner || currentKhasra.ownerName}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Khasra Mentioned:</span>
              <span className="font-black text-gov-blue-900">{currentKhasra.khasraNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Deed Registered Area:</span>
              <span className={`font-black ${currentKhasra.mismatch?.hasMismatch && currentKhasra.mismatch.type === 'AREA_MISMATCH' ? 'text-rose-600 bg-rose-50 px-2 rounded' : 'text-slate-900'}`}>
                {currentKhasra.uploadedDocument?.registeredAreaAcre || currentKhasra.areaAcre} Acre
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Registration Authority:</span>
              <span className="font-semibold text-slate-800">
                {currentKhasra.uploadedDocument?.issuer || 'Sub-Registrar Fatehabad'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-semibold">OCR Verification Score:</span>
              <span className="font-bold text-emerald-700">
                {currentKhasra.uploadedDocument?.ocrConfidence || 98.4}% Confidence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Actions Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Revenue Officer Statutory Confirmation Notes
          </label>
          <textarea
            rows="2"
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gov-blue-800 font-medium"
            placeholder="Record Tehsildar verification findings..."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            *AI assists decision support; final mutation authorization rests with Revenue Officer.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFlagMismatch}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Send for Field Survey</span>
            </button>

            <button
              onClick={handleVerify}
              className="bg-gov-green-600 hover:bg-gov-green-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition transform active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>VERIFY & SANCTION RECORD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
