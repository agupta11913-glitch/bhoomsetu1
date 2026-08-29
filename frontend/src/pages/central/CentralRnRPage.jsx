import React, { useState, useEffect } from 'react';
import { fetchCentralRnRApi } from '../../services/api/centralApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Building2, ShieldCheck, Home, Users, CheckCircle2 } from 'lucide-react';

const CentralRnRContent = () => {
  const [rnr, setRnR] = useState(null);

  useEffect(() => {
    fetchCentralRnRApi().then((data) => {
      if (data) setRnR(data);
    });
  }, []);

  const defaultRnR = {
    totalDisplacedFamilies: 24800,
    resettledFamilies: 21900,
    resettlementCentersActive: 142,
    totalGrantsCr: 284.0,
    complianceRatePct: 88.3,
  };

  const r = rnr || defaultRnR;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200 uppercase tracking-wider">
              RFCTLARR Second Schedule National Portal
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-gov-blue-800" />
            <span>National Rehabilitation & Resettlement (R&R) Master Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pan-India oversight of Project Affected Families (PAF), constructed housing units, and mandatory resettlement grants.
          </p>
        </div>

        <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pan-India Compliance: {r.complianceRatePct}%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Displaced Families</span>
          <strong className="text-2xl font-black text-slate-900">{r.totalDisplacedFamilies?.toLocaleString()}</strong>
          <span className="text-[11px] text-slate-400 block">Across 100+ Corridors</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Physically Resettled</span>
          <strong className="text-2xl font-black text-emerald-700">{r.resettledFamilies?.toLocaleString()}</strong>
          <span className="text-[11px] text-emerald-600 block">Allotted developed plots / homes</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-indigo-700 block">Resettlement Colonies Active</span>
          <strong className="text-2xl font-black text-indigo-700">{r.resettlementCentersActive} Model Colonies</strong>
          <span className="text-[11px] text-indigo-600 block">PMAY Infrastructure Norms</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-purple-700 block">Total R&R Outlay Disbursed</span>
          <strong className="text-2xl font-black text-purple-700">₹{r.totalGrantsCr} Cr</strong>
          <span className="text-[11px] text-purple-600 block">One-time Grants & Allowances</span>
        </div>
      </div>
    </div>
  );
};

export const CentralRnRPage = () => (
  <ErrorBoundary>
    <CentralRnRContent />
  </ErrorBoundary>
);

export default CentralRnRPage;
