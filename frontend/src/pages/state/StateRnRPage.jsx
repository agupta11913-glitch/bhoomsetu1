import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStateRnRApi } from '../../services/api/stateApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Building2, CheckCircle2, ShieldCheck, Home, Users } from 'lucide-react';

const StateRnRContent = () => {
  const { currentUser } = useAuth();
  const [rnr, setRnR] = useState(null);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    fetchStateRnRApi(stateName).then((data) => {
      if (data) setRnR(data);
    });
  }, [stateName]);

  const defaultRnR = {
    totalFamilies: 4120,
    resettledFamilies: 3450,
    housingUnitsDelivered: 2890,
    grantsDisbursedCr: 34.5,
    complianceRatePct: 83.7,
  };

  const r = rnr || defaultRnR;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              RFCTLARR Second Schedule State Scheme
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span>Statewide Rehabilitation & Resettlement (R&R) Master Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring Project Affected Families (PAF), constructed housing units, and mandatory resettlement grants across Uttar Pradesh.
          </p>
        </div>

        <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Compliance: {r.complianceRatePct}%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Displaced Families</span>
          <strong className="text-2xl font-black text-slate-900">{r.totalFamilies?.toLocaleString()}</strong>
          <span className="text-[11px] text-slate-400 block">Across 32 Corridors</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Resettled Families</span>
          <strong className="text-2xl font-black text-emerald-700">{r.resettledFamilies?.toLocaleString()}</strong>
          <span className="text-[11px] text-emerald-600 block">Possession handed over</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-indigo-700 block">Constructed Housing Delivered</span>
          <strong className="text-2xl font-black text-indigo-700">{r.housingUnitsDelivered?.toLocaleString()}</strong>
          <span className="text-[11px] text-indigo-600 block">PMAY-G / Resettlement Colony Norms</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-purple-700 block">Resettlement Grants Disbursed</span>
          <strong className="text-2xl font-black text-purple-700">₹{r.grantsDisbursedCr} Cr</strong>
          <span className="text-[11px] text-purple-600 block">One-time Rehabilitation Subsidy</span>
        </div>
      </div>
    </div>
  );
};

export const StateRnRPage = () => (
  <ErrorBoundary>
    <StateRnRContent />
  </ErrorBoundary>
);

export default StateRnRPage;
