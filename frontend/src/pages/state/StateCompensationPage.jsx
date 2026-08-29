import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchStateCompensationApi, fetchStateDistrictsApi } from '../../services/api/stateApi';
import { formatCurrency } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const StateCompensationContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [compData, setCompData] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    Promise.all([
      fetchStateCompensationApi(stateName),
      fetchStateDistrictsApi(stateName),
    ]).then(([comp, dists]) => {
      if (comp) setCompData(comp);
      if (Array.isArray(dists)) setDistricts(dists);
      setLoading(false);
    });
  }, [stateName]);

  const defaultComp = {
    totalPoolCr: 840.0,
    disbursedCr: 612.4,
    pendingCr: 227.6,
    dbtSuccessRatePct: 98.4,
  };

  const c = compData || defaultComp;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              PFMS DBT State Portal
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-indigo-600" />
            <span>Statewide Compensation & Direct Benefit Transfer (DBT) Oversight</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time reconciliation of statutory RFCTLARR compensation awards and bank disbursements across all districts.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Disbursed</span>
          <strong className="text-2xl font-black text-emerald-700">₹{c.disbursedCr} Cr</strong>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Sanctioned Pool</span>
          <strong className="text-2xl font-black text-slate-900">₹{c.totalPoolCr} Cr</strong>
          <span className="text-[11px] text-slate-400 block">Approved Section 19 Packages</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Disbursed into Landowner Accounts</span>
          <strong className="text-2xl font-black text-emerald-700">₹{c.disbursedCr} Cr</strong>
          <span className="text-[11px] text-emerald-600 block">
            {Math.round((c.disbursedCr / c.totalPoolCr) * 1000) / 10}% Disbursed
          </span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Pending Escrow / Processing</span>
          <strong className="text-2xl font-black text-amber-700">₹{c.pendingCr} Cr</strong>
          <span className="text-[11px] text-amber-600 block">Awaiting Final Award Sanction</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-blue-700 block">PFMS Gateway Success Rate</span>
          <strong className="text-2xl font-black text-blue-700">{c.dbtSuccessRatePct}%</strong>
          <span className="text-[11px] text-blue-600 block">Zero Failed Escrow Drops</span>
        </div>
      </div>

      {/* District-wise Compensation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Collectorate PFMS Fund Flow Performance</h3>
            <p className="text-xs text-slate-500">District-by-district breakdown of allocated vs disbursed compensation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">District</th>
                <th className="p-4">Allocated Pool (Cr)</th>
                <th className="p-4">Disbursed (Cr)</th>
                <th className="p-4">Pending (Cr)</th>
                <th className="p-4">Disbursement Velocity</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {districts.map((d) => (
                <tr key={d.district} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-black text-slate-900">{d.district} District</td>
                  <td className="p-4 font-bold text-slate-800">₹{d.compensationTotalCr} Cr</td>
                  <td className="p-4 font-black text-emerald-700">₹{d.compensationPaidCr} Cr</td>
                  <td className="p-4 font-mono text-amber-700">
                    ₹{Math.max(0, Math.round((d.compensationTotalCr - d.compensationPaidCr) * 100) / 100)} Cr
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((d.compensationPaidCr / d.compensationTotalCr) * 100))}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-800 text-[11px]">
                        {Math.round((d.compensationPaidCr / d.compensationTotalCr) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/district/compensation?district=${encodeURIComponent(d.district)}`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-lg text-xs transition inline-flex items-center gap-1"
                    >
                      <span>Ledger</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const StateCompensationPage = () => (
  <ErrorBoundary>
    <StateCompensationContent />
  </ErrorBoundary>
);

export default StateCompensationPage;
