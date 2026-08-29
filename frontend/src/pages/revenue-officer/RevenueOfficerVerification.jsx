import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRevenueCasesApi } from '../../services/api/revenueOfficerApi';
import { formatAcre } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileCheck,
  Search,
  RefreshCw,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';

const RevenueOfficerVerificationContent = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [filterType, setFilterType] = useState('PENDING'); // 'ALL' | 'PENDING' | 'SUBMITTED' | 'RETURNED'

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueCasesApi({
        village: selectedVillage !== 'ALL' ? selectedVillage : undefined,
      });
      if (Array.isArray(data)) setCases(data);
    } catch (err) {
      console.error('Error fetching verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedVillage]);

  const filteredCases = cases.filter((c) => {
    if (filterType === 'PENDING') {
      return c.verificationStatus === 'PENDING_VERIFICATION' || c.verificationStatus === 'IN_VERIFICATION';
    }
    if (filterType === 'SUBMITTED') {
      return c.verificationStatus === 'VERIFICATION_SUBMITTED' || c.verificationStatus === 'COMPLETED';
    }
    if (filterType === 'RETURNED') {
      return c.verificationStatus === 'RETURNED_FOR_CORRECTION';
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Statutory Revenue Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Bhulekh RoR & Cadastral Verification
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Land Record & RoR Verification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare official 12-year khatauni records, verify claimant ownership, check affected vs remaining area, and submit verified dossiers to Tehsildar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-gov text-xs">
        <div className="flex items-center gap-2">
          {[
            { key: 'PENDING', label: 'Pending Verification', icon: Clock },
            { key: 'RETURNED', label: 'Returned for Correction', icon: RotateCcw },
            { key: 'SUBMITTED', label: 'Submitted to Tehsildar', icon: CheckCircle2 },
            { key: 'ALL', label: 'All Cases', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition ${
                  filterType === tab.key
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
        >
          <option value="ALL">All Villages</option>
          <option value="Nagla">Nagla</option>
          <option value="Kasan">Kasan</option>
          <option value="Kharabwadi">Kharabwadi</option>
          <option value="Vesu">Vesu</option>
        </select>
      </div>

      {/* 3. Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => (
          <div
            key={c.caseId}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-gov-md transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-mono text-xs font-bold text-slate-500">{c.caseId}</span>
                <StatusBadge status={c.verificationStatus} size="sm" />
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-black text-slate-900">
                    Khasra No. {c.khasraNumber}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {c.village}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">{c.ownerName}</p>
                {c.fatherName && <p className="text-[11px] text-slate-400">S/o {c.fatherName}</p>}
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Total Area:</span>
                  <strong className="text-slate-900">{formatAcre(c.totalAreaAcre)}</strong>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Acquired Area:</span>
                  <strong className="font-bold">{formatAcre(c.affectedAreaAcre)}</strong>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Retained Area:</span>
                  <strong className="font-bold">{formatAcre(c.remainingAreaAcre)}</strong>
                </div>
              </div>

              {c.tehsildarRemarks && c.verificationStatus === 'RETURNED_FOR_CORRECTION' && (
                <div className="mt-2 p-2 bg-rose-50 rounded-lg border border-rose-200 text-[11px] text-rose-800">
                  <strong>Tehsildar Note:</strong> {c.tehsildarRemarks}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigate(`/revenue-officer/map?khasra=${c.khasraNumber}`)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                title="Inspect on GIS Map"
              >
                <MapPin className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate(`/revenue-officer/cases/${c.caseId}`)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>{c.verificationStatus === 'RETURNED_FOR_CORRECTION' ? 'Rectify Verification' : 'Verify Dossier'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RevenueOfficerVerification = () => (
  <ErrorBoundary fallbackTitle="Unable to load Verification Queue">
    <RevenueOfficerVerificationContent />
  </ErrorBoundary>
);
