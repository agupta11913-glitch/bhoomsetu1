import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import {
  Banknote,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Printer,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';

export const CitizenPaymentPage = () => {
  const navigate = useNavigate();
  const { khasras, processDisbursement } = useLandData();
  const [showAwardModal, setShowAwardModal] = useState(false);

  const myParcel = khasras.find((k) => k.khasraNumber === '101') || khasras[0] || {
    khasraNumber: '101',
    areaAcre: 2.50,
    totalCompensation: 21600000,
    authorityApproved: true,
    paymentStatus: 'DBT Credit Successful',
    paymentDate: '2026-06-20',
    paymentUtr: 'PFMS-2026-99218',
  };

  const paymentSteps = [
    { label: 'Award Calculated', date: '10-Feb-2026', done: true },
    { label: 'SLAO Review', date: '25-Feb-2026', done: true },
    { label: 'DM Sanctioned', date: myParcel?.authorityApproved ? '15-Jun-2026' : 'Pending', done: !!myParcel?.authorityApproved },
    { label: 'PFMS Mandate Ready', date: myParcel?.authorityApproved ? '18-Jun-2026' : 'Pending', done: !!myParcel?.authorityApproved },
    { label: 'DBT Bank Credit', date: myParcel?.paymentDate ? formatDate(myParcel.paymentDate) : 'Pending Execution', done: myParcel?.paymentStatus === 'DBT Credit Successful' || myParcel?.paymentStatus === 'PAID' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Direct Benefit Transfer (PFMS DBT)
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Public Financial Management System</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Compensation Award & Bank DBT Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of statutory compensation and real-time electronic credit tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAwardModal(true)}
            className="bg-gov-green-700 hover:bg-gov-green-800 text-white font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Award Certificate</span>
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

      {/* Compensation Card */}
      <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
            Net Statutory Award Amount
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {formatCurrency(myParcel.totalCompensation)}
          </h1>
          <p className="text-xs text-slate-300">
            Awardee: <strong>{myParcel.ownerName}</strong> • Khasra: <strong>{myParcel.khasraNumber}</strong> ({myParcel.areaAcre} Acre)
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 text-xs space-y-1.5 shrink-0">
          <span className="text-[10px] font-bold uppercase text-emerald-300 block">Bank Mandate</span>
          <p className="font-bold text-white">SBI - A/C ********8832</p>
          <p className="text-[11px] text-slate-300">Aadhaar Payment Bridge (APB) Verified</p>
          <div className="mt-2 pt-1 border-t border-white/20">
            <span className="font-mono text-emerald-400 font-extrabold block">
              Status: {myParcel.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Progression Stepper */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
        <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          PFMS Electronic Payment Stage Tracker
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {paymentSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                step.done
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Step {idx + 1}</span>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <div>
                <span className="font-black text-xs block text-slate-900">{step.label}</span>
                <span className="text-[10px] text-slate-500 font-mono">{step.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Award Modal */}
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={myParcel}
      />
    </div>
  );
};
