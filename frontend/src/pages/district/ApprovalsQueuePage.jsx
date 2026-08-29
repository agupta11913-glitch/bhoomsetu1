import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  Gavel,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Banknote,
  Eye,
  RotateCcw,
  X,
} from 'lucide-react';

export const ApprovalsQueuePage = () => {
  const navigate = useNavigate();
  const { khasras, approveAcquisitionAuthority, showToast } = useLandData();

  const [selectedKhasra, setSelectedKhasra] = useState(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  const pendingParcels = khasras.filter((k) => !k.authorityApproved && k.selectedForAcquisition);

  const handleApprove = (khasraId) => {
    approveAcquisitionAuthority(khasraId);
  };

  const handleReject = (khasraNum) => {
    showToast('Sent Back', `Acquisition package for Khasra ${khasraNum} returned to SLAO for clarification.`, 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Statutory Sanctions Queue
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Section 19 Declaration (RFCTLARR 2013)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Section 19 Statutory Approvals & Sanctions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            District Magistrate & Competent Authority chamber for e-Signing final acquisition declarations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gov-blue-900 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-sm">
            {pendingParcels.length} Awaiting Sanction
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

      {/* Main List */}
      <div className="grid grid-cols-1 gap-4">
        {pendingParcels.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">
              All Section 19 Declarations Sanctioned!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are currently no pending land acquisition packages awaiting Competent Authority approval.
            </p>
          </div>
        ) : (
          pendingParcels.map((parcel) => (
            <div
              key={parcel.khasraNumber}
              className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-blue-800">
                    Acquisition Package
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Khasra {parcel.khasraNumber} • {parcel.ownerName} ({parcel.areaAcre} Acre)
                  </h3>
                  <p className="text-xs text-slate-500">{parcel.village}, {parcel.tehsil} ({parcel.projectName})</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned Award</span>
                  <span className="text-xl font-black text-gov-green-700">{formatCurrency(parcel.totalCompensation)}</span>
                </div>
              </div>

              {/* Clearance checklist pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Revenue RoR Clear</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>GIS Boundary Clear</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sec 11 Notice Served</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hearing Cleared</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedKhasra(parcel);
                      setShowNoticeModal(true);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inspect Gazette Notice</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedKhasra(parcel);
                      setShowAwardModal(true);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Inspect Award Statement</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(parcel.khasraNumber)}
                    className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition border border-slate-200"
                  >
                    Send Back with Observations
                  </button>
                  <button
                    onClick={() => handleApprove(parcel.id)}
                    className="bg-gov-green-600 hover:bg-gov-green-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition transform active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>e-Sign & Sanction (DM Order)</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <GazetteNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        khasra={selectedKhasra}
      />
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={selectedKhasra}
      />
    </div>
  );
};
