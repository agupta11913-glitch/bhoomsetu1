import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import {
  FileText,
  PlusCircle,
  Eye,
  Printer,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
} from 'lucide-react';

export const NoticeManagementPage = () => {
  const navigate = useNavigate();
  const { khasras, notices, issueSection11Notice, showToast } = useLandData();

  const [selectedNoticeKhasra, setSelectedNoticeKhasra] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenNotice = (khasra) => {
    setSelectedNoticeKhasra(khasra);
    setShowModal(true);
  };

  const handleDispatchSMS = (khasra) => {
    showToast('SMS Dispatched', `Statutory notice alert sent to ${khasra.ownerName} (${khasra.phone || '+91 98765 43210'}).`, 'success');
  };

  const noticeKhasras = khasras.filter(
    (k) =>
      k.noticeIssued ||
      k.status === 'NOTICE_ISSUED' ||
      k.status === 'OBJECTION_PERIOD' ||
      k.status === 'APPROVED' ||
      k.status === 'COMPENSATION_CALCULATED' ||
      k.status === 'COMPENSATION_PAID' ||
      k.status === 'ACQUIRED'
  );

  const filtered = noticeKhasras.filter(
    (k) =>
      k.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.khasraNumber.includes(searchTerm) ||
      k.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Statutory Gazette Publication
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Section 11(1) RFCTLARR Act 2013</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Official Land Acquisition Notice Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue, publish, and monitor 60-day objection timelines for gazette preliminary notifications.
          </p>
        </div>

        {/* Action Button + Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          {!khasras.find((k) => k.khasraNumber === '101')?.noticeIssued && (
            <button
              onClick={() => {
                issueSection11Notice('101');
                handleOpenNotice(khasras.find((k) => k.khasraNumber === '101'));
              }}
              className="bg-gov-saffron-600 hover:bg-gov-saffron-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Issue Notice (Khasra 101)</span>
            </button>
          )}

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

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter notices by Owner name, Khasra number, or Village..."
          className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Notices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-left border-b border-slate-200">
                <th className="p-3">Notice Ref / Khasra</th>
                <th className="p-3">Land Owner</th>
                <th className="p-3">Project & Village</th>
                <th className="p-3">Area</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Objection Deadline</th>
                <th className="p-3">Notice Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((parcel) => (
                <tr key={parcel.khasraNumber} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-gov-blue-900">
                    SLAO/SEC11-{parcel.khasraNumber}
                    <span className="text-[10px] text-slate-400 block font-normal">Khasra {parcel.khasraNumber}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900">{parcel.ownerName}</span>
                    <span className="text-[10px] text-slate-400 block">{parcel.phone || '+91 98765 43210'}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-slate-800">{parcel.projectName}</span>
                    <span className="text-[10px] text-slate-400 block">{parcel.village}, {parcel.tehsil}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{parcel.areaAcre} Acre</td>
                  <td className="p-3 font-mono text-slate-700">{formatDate(parcel.noticeDate || '2026-02-10')}</td>
                  <td className="p-3 font-mono text-amber-700 font-bold">
                    {formatDate(parcel.objectionDeadline || '2026-04-15')}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                      Notice Served
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenNotice(parcel)}
                        className="bg-gov-blue-50 hover:bg-gov-blue-100 text-gov-blue-900 p-1.5 rounded-lg transition"
                        title="View Official Gazette Notice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenNotice(parcel)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition"
                        title="Print Notice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDispatchSMS(parcel)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-1.5 rounded-lg transition"
                        title="Dispatch Simulated SMS Notice"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gazette Notice Modal */}
      <GazetteNoticeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        khasra={selectedNoticeKhasra}
      />
    </div>
  );
};
