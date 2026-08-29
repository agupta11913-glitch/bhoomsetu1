import React from 'react';
import { formatDate } from '../../utils/formatters';
import { GovEmblem } from '../common/GovEmblem';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';

export const GazetteNoticeModal = ({ isOpen, onClose, khasra }) => {
  if (!isOpen || !khasra) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="bg-gov-blue-900 text-white px-4 sm:px-5 py-3 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-extrabold text-xs sm:text-sm text-gov-saffron-500 truncate">
              STATUTORY GAZETTE NOTIFICATION
            </span>
            <span className="text-[10px] sm:text-xs bg-gov-blue-800 text-slate-300 px-2 py-0.5 rounded hidden sm:inline">
              Sec 11(1), RFCTLARR Act 2013
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="bg-gov-saffron-600 hover:bg-gov-saffron-500 text-white px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-gov-blue-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gazette Sheet (Printable Layout) */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-white text-slate-900 space-y-4 sm:space-y-6 font-serif border-2 sm:border-4 border-double border-slate-300 m-2 sm:m-4 rounded-xl">
          {/* Official Emblem Header */}
          <div className="text-center space-y-1 sm:space-y-1.5 border-b-2 border-slate-900 pb-3 sm:pb-4">
            <div className="flex justify-center mb-1">
              <GovEmblem size="md" className="sm:hidden" />
              <GovEmblem size="lg" className="hidden sm:flex" />
            </div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-900">
              THE GAZETTE OF INDIA : EXTRAORDINARY
            </h2>
            <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-700">
              PUBLISHED BY AUTHORITY • GOVERNMENT OF UTTAR PRADESH
            </h3>
            <p className="text-[10px] sm:text-[11px] font-sans text-slate-500">
              Department of Revenue & Land Acquisition • Office of the Special Land Acquisition Officer (SLAO)
            </p>
          </div>

          {/* Notification Header */}
          <div className="flex flex-col sm:flex-row justify-between text-[11px] sm:text-xs font-sans text-slate-700 border-b border-slate-200 pb-2 gap-1">
            <div>
              <p><strong>Ref:</strong> SLAO/AGR/2026/SEC11-{khasra.khasraNumber}</p>
              <p><strong>Gazette:</strong> UP-GZ-2026-VOL-94</p>
            </div>
            <div className="sm:text-right">
              <p><strong>Published:</strong> {formatDate(khasra.noticeDate || new Date().toISOString())}</p>
              <p><strong>Objection Deadline:</strong> {formatDate(khasra.objectionDeadline || '2026-04-15')}</p>
            </div>
          </div>

          {/* Gazette Body Text */}
          <div className="space-y-3 sm:space-y-4 text-[11px] sm:text-xs leading-relaxed text-justify text-slate-800">
            <p>
              <strong>WHEREAS,</strong> it appears to the Appropriate Government that land in Tehsil <u>{khasra.tehsil}</u>, District <u>{khasra.district}</u> is required for a public purpose, namely for the <strong>{khasra.projectName || 'Agra-Lucknow Highway 6-Lane Expansion'}</strong> under Project ID: <code>{khasra.projectId || 'PRJ-001'}</code>;
            </p>
            <p>
              <strong>NOW, THEREFORE,</strong> in exercise of the powers conferred by Section 11(1) of the <em>RFCTLARR Act 2013</em>, notice is hereby given to all persons interested that the land specified in the Schedule below is proposed to be acquired.
            </p>
          </div>

          {/* Schedule of Land Table */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-slate-900">
              SCHEDULE OF LAND PARCEL TO BE ACQUIRED
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] sm:text-xs font-sans border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-400 p-1.5 sm:p-2 text-left">District & Tehsil</th>
                    <th className="border border-slate-400 p-1.5 sm:p-2 text-left">Village</th>
                    <th className="border border-slate-400 p-1.5 sm:p-2 text-left">Khasra</th>
                    <th className="border border-slate-400 p-1.5 sm:p-2 text-left">Khata</th>
                    <th className="border border-slate-400 p-1.5 sm:p-2 text-left">Owner</th>
                    <th className="border border-slate-400 p-1.5 sm:p-2 text-right">Area</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-1.5 sm:p-2">{khasra.district}, {khasra.tehsil}</td>
                    <td className="border border-slate-400 p-1.5 sm:p-2">{khasra.village}</td>
                    <td className="border border-slate-400 p-1.5 sm:p-2 font-bold">{khasra.khasraNumber}</td>
                    <td className="border border-slate-400 p-1.5 sm:p-2">{khasra.khataNumber || 'KHT-0042'}</td>
                    <td className="border border-slate-400 p-1.5 sm:p-2 font-bold">{khasra.ownerName}</td>
                    <td className="border border-slate-400 p-1.5 sm:p-2 text-right font-bold">{khasra.areaAcre} Ac</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end font-sans text-[11px] sm:text-xs gap-3">
            <div className="space-y-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-gov-blue-800 flex items-center justify-center text-center p-1 text-[8px] sm:text-[9px] text-gov-blue-900 font-bold uppercase">
                Digital Seal Verified
              </div>
              <p className="text-[9px] text-slate-500 font-mono">BHOOMISETU-VERIFIED</p>
            </div>

            <div className="sm:text-right space-y-0.5">
              <p className="font-bold text-slate-900">By Order of the Governor,</p>
              <p className="font-extrabold text-xs sm:text-sm text-gov-blue-900">Sh. Rajesh Verma, IAS</p>
              <p className="text-slate-600">Special Land Acquisition Officer (SLAO)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-right no-print shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
