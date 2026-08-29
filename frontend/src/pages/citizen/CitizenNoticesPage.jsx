import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { formatDate } from '../../utils/formatters';
import { FileText, Eye, Printer, Download, CheckCircle2, X } from 'lucide-react';

export const CitizenNoticesPage = () => {
  const navigate = useNavigate();
  const { khasras } = useLandData();
  const [showModal, setShowModal] = useState(false);

  const myParcel = khasras.find((k) => k.khasraNumber === '101') || khasras[0] || {
    khasraNumber: '101',
    areaAcre: 2.50,
    noticeDate: '2026-02-10',
    objectionDeadline: '2026-04-15',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              शासकीय सूचनाएं (Official Gazette)
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">RFCTLARR Act 2013</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Official Land Acquisition Notices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Download and view legally binding preliminary and declaration notifications published for your land.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
          >
            <Eye className="w-4 h-4" />
            <span>View Gazette Notice</span>
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

      {/* Notices Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov p-6 space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-700 border border-amber-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase font-mono text-gov-blue-900 bg-gov-blue-50 px-2 py-0.5 rounded border border-gov-blue-200">
                SLAO/AGR/2026/SEC11-101
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Preliminary Notification under Section 11(1)
              </h3>
              <p className="text-xs text-slate-500">Agra-Lucknow Highway 6-Lane Expansion Corridor</p>
            </div>
          </div>

          <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1 rounded-full">
            Objection Window Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Notified Parcel:</span>
            <span className="font-bold text-slate-800">Khasra 101 ({myParcel.areaAcre} Acre)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Gazette Date:</span>
            <span className="font-bold text-slate-800 font-mono">{formatDate(myParcel.noticeDate || '2026-02-10')}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Objection Deadline:</span>
            <span className="font-bold text-amber-700 font-mono">{formatDate(myParcel.objectionDeadline || '2026-04-15')}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Status:</span>
            <span className="font-bold text-emerald-700">Legally Served ✓</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Gazette Sheet</span>
          </button>
        </div>
      </div>

      {/* Gazette Notice Modal */}
      <GazetteNoticeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        khasra={myParcel}
      />
    </div>
  );
};
