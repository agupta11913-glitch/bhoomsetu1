import React, { useState, useEffect } from 'react';
import { fetchCentralCompensationApi, fetchCentralStatesApi } from '../../services/api/centralApi';
import { formatCurrency } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Banknote, Globe, CheckCircle2, Building2, TrendingUp } from 'lucide-react';

const CentralCompensationContent = () => {
  const [comp, setComp] = useState(null);
  const [states, setStates] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchCentralCompensationApi(),
      fetchCentralStatesApi(),
    ]).then(([c, stList]) => {
      if (c) setComp(c);
      if (Array.isArray(stList)) setStates(stList);
    });
  }, []);

  const defaultComp = {
    totalNationalPoolCr: 38400.0,
    disbursedCr: 31250.0,
    pendingCr: 7150.0,
    dbtGatewaySuccessRatePct: 99.1,
  };

  const c = comp || defaultComp;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gov-blue-700" />
              <span>National PFMS Direct Benefit Gateway</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-gov-blue-800" />
            <span>Pan-India Compensation & Direct Benefit Transfer (DBT) Oversight</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro reconciliation of Central Ministry treasury outlays and direct bank disbursements to Project Affected Landowners.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Pan-India DBT Disbursed</span>
          <strong className="text-2xl font-black text-emerald-700">₹{c.disbursedCr?.toLocaleString()} Cr</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">National Allocated Pool</span>
          <strong className="text-2xl font-black text-slate-900">₹{c.totalNationalPoolCr?.toLocaleString()} Cr</strong>
          <span className="text-[11px] text-slate-400 block">Approved Section 19 packages</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Credited into Bank Accounts</span>
          <strong className="text-2xl font-black text-emerald-700">₹{c.disbursedCr?.toLocaleString()} Cr</strong>
          <span className="text-[11px] text-emerald-600 block">
            {Math.round((c.disbursedCr / c.totalNationalPoolCr) * 1000) / 10}% Disbursed
          </span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Pending Escrow Allocation</span>
          <strong className="text-2xl font-black text-amber-700">₹{c.pendingCr?.toLocaleString()} Cr</strong>
          <span className="text-[11px] text-amber-600 block">Under final CALA awards</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-blue-700 block">PFMS Gateway Success Rate</span>
          <strong className="text-2xl font-black text-blue-700">{c.dbtGatewaySuccessRatePct}%</strong>
          <span className="text-[11px] text-blue-600 block">Near-Zero Rejections</span>
        </div>
      </div>
    </div>
  );
};

export const CentralCompensationPage = () => (
  <ErrorBoundary>
    <CentralCompensationContent />
  </ErrorBoundary>
);

export default CentralCompensationPage;
