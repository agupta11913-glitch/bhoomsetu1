import React from 'react';
import { useLandData } from '../../context/LandDataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { GovEmblem } from '../common/GovEmblem';
import { Banknote, CheckCircle2, ShieldCheck, Printer, ArrowRight, X } from 'lucide-react';

export const CompensationAwardModal = ({ isOpen, onClose, khasra }) => {
  const { processDisbursement, showToast } = useLandData();

  if (!isOpen || !khasra) return null;

  const baseRate = khasra.circleRatePerAcre || 2000000;
  const baseValue = (khasra.areaAcre || 2.5) * baseRate;
  const solatium = baseValue * 1.0;
  const totalAward = baseValue + solatium;

  const handleDisburse = () => {
    processDisbursement(khasra.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gov-blue-900 text-white px-4 sm:px-5 py-3 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-gov-saffron-500 shrink-0" />
            <span className="font-extrabold text-xs sm:text-sm text-white truncate">
              COMPENSATION DETERMINATION STATEMENT
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="bg-gov-blue-800 hover:bg-gov-blue-700 text-white px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Award</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-gov-blue-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Award Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 bg-slate-50">
          {/* Top Banner */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Awardee (Land Owner)</span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{khasra.ownerName}</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Khasra: <strong>{khasra.khasraNumber}</strong> ({khasra.areaAcre} Acre) • Village: {khasra.village}
              </p>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Sanctioned Award</span>
              <h2 className="text-xl sm:text-2xl font-black text-gov-green-700">{formatCurrency(khasra.totalCompensation || totalAward)}</h2>
              <span className="text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                RFCTLARR Act 2013 Aligned
              </span>
            </div>
          </div>

          {/* Formula Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-100/80 px-3 sm:px-4 py-2 border-b border-slate-200 font-bold text-[11px] sm:text-xs text-slate-800 uppercase tracking-wider">
              Statutory Compensation Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 sm:p-3 text-slate-600 font-medium">1. Base Circle Rate</td>
                    <td className="p-2.5 sm:p-3 text-slate-900 font-semibold">{formatCurrency(baseRate)} / Acre</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 sm:p-3 text-slate-600 font-medium">2. Acreage Acquired</td>
                    <td className="p-2.5 sm:p-3 text-slate-900 font-semibold">{khasra.areaAcre} Acre</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 sm:p-3 text-slate-800 font-bold">3. Total Market Value</td>
                    <td className="p-2.5 sm:p-3 text-slate-900 font-extrabold">{formatCurrency(baseValue)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 sm:p-3 text-slate-600 font-medium">4. Solatium (100% under Sec 30(1))</td>
                    <td className="p-2.5 sm:p-3 text-slate-900 font-semibold">{formatCurrency(solatium)}</td>
                  </tr>
                  <tr className="bg-gov-blue-50/60 font-bold text-xs sm:text-sm">
                    <td className="p-2.5 sm:p-3 text-gov-blue-950">NET PAYABLE COMPENSATION</td>
                    <td className="p-2.5 sm:p-3 text-gov-blue-900 font-black">{formatCurrency(khasra.totalCompensation || totalAward)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PFMS Mandate */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Public Financial Management System (PFMS)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Beneficiary Account</span>
                <span className="font-bold text-slate-900 truncate block">{khasra.bankAccount || 'SBI - A/C ********8832'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Disbursement Status</span>
                <span className="font-extrabold text-gov-green-700">
                  {khasra.paymentStatus || 'Pending Initiation'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 no-print shrink-0">
          <span className="text-[10px] sm:text-xs text-slate-500 text-center sm:text-left">
            *Simulated PFMS DBT Escrow Payment Gateway
          </span>
          <div className="flex items-center justify-end gap-2">
            {khasra.paymentStatus !== 'DBT Credit Successful' ? (
              <button
                onClick={handleDisburse}
                className="bg-gov-green-600 hover:bg-gov-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition w-full sm:w-auto"
              >
                <Banknote className="w-4 h-4" />
                <span>Simulate PFMS DBT Payout</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Payment Disbursed
              </span>
            )}
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
