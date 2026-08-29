import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { LeafletGISMap } from '../../components/map/LeafletGISMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Banknote,
  Sparkles,
  Layers,
  ArrowRight,
  Crosshair,
  FileSearch,
  X,
} from 'lucide-react';

export const GISMapPage = ({ onOpenAI, onOpenOCR }) => {
  const navigate = useNavigate();
  const { currentRole } = useAuth();
  const {
    khasras,
    activeKhasraId,
    setActiveKhasraId,
    verifyRevenueRecord,
    verifyGISBoundary,
    toggleParcelSelection,
    issueSection11Notice,
    markAsAcquired,
    showToast,
  } = useLandData();

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  const activeParcel = khasras.find(
    (k) => k.id === activeKhasraId || k.khasraNumber === activeKhasraId
  ) || khasras[0] || {
    khasraNumber: '101',
    khataNumber: 'KH-842',
    caseId: 'CASE-2026-DME-0101',
    ownerName: 'Sh. Ram Kumar',
    fatherName: 'Late Sh. Harish Chandra',
    areaAcre: 2.50,
    affectedAreaAcre: 0.80,
    remainingAreaAcre: 1.70,
    village: 'Nagla',
    tehsil: 'Fatehabad',
    district: 'Agra',
    status: 'VERIFIED',
    totalCompensation: 45000000,
    revenueVerified: true,
    gisVerified: true,
    noticeIssued: true,
    authorityApproved: true,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Cadastral GIS Engine
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Survey of India & Bhulekh Georeferenced Grid</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            GIS Land Acquisition & Cadastral Parcel Workspace
          </h2>
        </div>

        {/* Quick Khasra Quick-bar + Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Quick Select:</span>
            {['101', '102', '103', '104', '105', '117', '134'].map((num) => (
              <button
                key={num}
                onClick={() => setActiveKhasraId(num)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold transition ${
                  activeKhasraId === num
                    ? 'bg-gov-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                #{num}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs shrink-0 ml-1"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Map + Right Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left GIS Map: 8 Cols */}
        <div className="lg:col-span-8">
          <LeafletGISMap height="h-[680px]" onSelectParcel={(p) => setActiveKhasraId(p.khasraNumber)} />
        </div>

        {/* Right Inspection Panel: 4 Cols */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-gov p-5 space-y-4 flex flex-col justify-between overflow-y-auto max-h-[680px]">
          <div className="space-y-4">
            {/* Active Parcel Header */}
            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gov-blue-800">
                  Active Selected Parcel
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Khasra {activeParcel.khasraNumber}
                </h3>
                <p className="text-xs text-slate-500">Khata: {activeParcel.khataNumber || 'KHT-0042'}</p>
              </div>
              <StatusBadge status={activeParcel.status} size="sm" />
            </div>

            {/* Owner & Land Metadata */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Land Owner:</span>
                <span className="font-bold text-slate-900">{activeParcel.ownerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Father / Spouse:</span>
                <span className="font-semibold text-slate-800">{activeParcel.fatherName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Parcel Area:</span>
                <span className="font-bold text-slate-900">{activeParcel.areaAcre} Acre ({(activeParcel.areaAcre * 0.404686).toFixed(2)} Ha)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Land Classification:</span>
                <span className="font-semibold text-slate-800">{activeParcel.landType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Village & Tehsil:</span>
                <span className="font-medium text-slate-800">{activeParcel.village}, {activeParcel.tehsil}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Est. Compensation:</span>
                <span className="font-extrabold text-gov-green-700 text-sm">
                  {formatCurrency(activeParcel.totalCompensation)}
                </span>
              </div>
            </div>

            {/* Clearance Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Statutory Clearances
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  activeParcel.revenueVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-bold">Revenue RoR</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  activeParcel.gisVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-bold">GIS Boundary</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  activeParcel.noticeIssued ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="font-bold">Sec 11 Notice</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  activeParcel.authorityApproved ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-bold">DM Approval</span>
                </div>
              </div>
            </div>

            {/* Mismatch Alert Box if flagged */}
            {activeParcel.mismatch?.hasMismatch && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>AI Mismatch Flagged</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-800">
                  {activeParcel.mismatch.title}: {activeParcel.mismatch.recommendation}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons Stack */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {/* Step 1 Action: Revenue Officer Verify */}
            {!activeParcel.revenueVerified && (
              <button
                onClick={() => verifyRevenueRecord(activeParcel.id)}
                className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4 text-gov-saffron-500" />
                <span>Verify Revenue Record (Bhulekh)</span>
              </button>
            )}

            {/* Step 2 Action: GIS Boundary Approve */}
            {!activeParcel.gisVerified && (
              <button
                onClick={() => verifyGISBoundary(activeParcel.id)}
                className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve GeoJSON Boundary</span>
              </button>
            )}

            {/* Step 3 Action: Add to Selection */}
            {!activeParcel.selectedForAcquisition && (
              <button
                onClick={() => toggleParcelSelection(activeParcel.id)}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Layers className="w-4 h-4" />
                <span>Add to Acquisition Package</span>
              </button>
            )}

            {/* Step 4 Action: Issue Notice */}
            {activeParcel.selectedForAcquisition && !activeParcel.noticeIssued && (
              <button
                onClick={() => issueSection11Notice(activeParcel.id)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <FileText className="w-4 h-4" />
                <span>Issue Section 11 Notice</span>
              </button>
            )}

            {/* View Notice / View Award */}
            {activeParcel.noticeIssued && (
              <button
                onClick={() => setShowNoticeModal(true)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-gov-blue-800" />
                <span>View Section 11 Gazette Notice</span>
              </button>
            )}

            {activeParcel.authorityApproved && (
              <button
                onClick={() => setShowAwardModal(true)}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-purple-200"
              >
                <Banknote className="w-3.5 h-3.5 text-purple-700" />
                <span>View Compensation Award Breakdown</span>
              </button>
            )}

            {/* Launch OCR Modal */}
            <button
              onClick={onOpenOCR || (() => {})}
              className="w-full bg-slate-50 hover:bg-gov-blue-50 text-slate-700 hover:text-gov-blue-900 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
            >
              <FileSearch className="w-3.5 h-3.5 text-gov-saffron-600" />
              <span>AI Document OCR & Matcher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Notice Modal */}
      <GazetteNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        khasra={activeParcel}
      />

      {/* Compensation Award Modal */}
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={activeParcel}
      />
    </div>
  );
};
