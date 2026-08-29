import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  ArrowRight,
  FileCheck,
  Landmark,
  X,
} from 'lucide-react';

export const FinalAcquisitionPage = () => {
  const navigate = useNavigate();
  const { khasras, markAsAcquired, showToast } = useLandData();

  // Find candidate for final possession handover (e.g. Khasra 101 or ready parcels)
  const readyForHandover = khasras.filter((k) => !k.isAcquired && k.status !== 'ACQUIRED');
  const acquiredParcels = khasras.filter((k) => k.isAcquired || k.status === 'ACQUIRED');

  const handleMarkAcquiredWithConfetti = (khasraId) => {
    markAsAcquired(khasraId);

    // Trigger SIH victory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003366', '#FF9933', '#138808', '#ffffff'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Statutory Possession Handover
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Section 38 & 40 RFCTLARR Act 2013</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Final Land Mutation & Possession Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Execute final legal vesting of acquired parcels into National Highway Corridor ownership.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/gis-map')}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition"
          >
            <MapPin className="w-4 h-4" />
            <span>View Acquired Grid</span>
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

      {/* Handover Ready Stage Card (Khasra 101 Spotlight) */}
      {readyForHandover.length > 0 && (
        <div className="bg-gradient-to-br from-gov-blue-950 to-gov-blue-900 rounded-2xl p-6 text-white shadow-xl border border-gov-blue-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-blue-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gov-saffron-600/30 border border-gov-saffron-500/50">
                <Landmark className="w-6 h-6 text-gov-saffron-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gov-saffron-500 font-bold">
                  Statutory Pre-Possession Verification Clearance
                </span>
                <h3 className="text-xl font-black">
                  Ready for Final Acquisition: Khasra {readyForHandover[0].khasraNumber} ({readyForHandover[0].ownerName})
                </h3>
              </div>
            </div>

            <span className="bg-gov-green-700 text-white font-bold text-xs px-3 py-1 rounded-full">
              Award Value: {formatCurrency(readyForHandover[0].totalCompensation)}
            </span>
          </div>

          {/* 5-Point Mandatory Government Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-gov-blue-900/60 p-3 rounded-xl border border-gov-blue-700/60 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">1. Revenue RoR</span>
                <span className="text-[10px] text-slate-300">Verified ✓</span>
              </div>
            </div>

            <div className="bg-gov-blue-900/60 p-3 rounded-xl border border-gov-blue-700/60 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">2. GIS Boundary</span>
                <span className="text-[10px] text-slate-300">Approved ✓</span>
              </div>
            </div>

            <div className="bg-gov-blue-900/60 p-3 rounded-xl border border-gov-blue-700/60 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">3. Sec 11 Notice</span>
                <span className="text-[10px] text-slate-300">Published ✓</span>
              </div>
            </div>

            <div className="bg-gov-blue-900/60 p-3 rounded-xl border border-gov-blue-700/60 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">4. Authority Order</span>
                <span className="text-[10px] text-slate-300">e-Signed ✓</span>
              </div>
            </div>

            <div className="bg-gov-blue-900/60 p-3 rounded-xl border border-gov-blue-700/60 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">5. Compensation</span>
                <span className="text-[10px] text-slate-300">DBT Ready ✓</span>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-300 max-w-xl">
              Clicking below will legally mutate Khasra {readyForHandover[0].khasraNumber} into government possession, update project statistics in real-time, and mark the cadastral GIS polygon as <strong className="text-emerald-400">ACQUIRED</strong>.
            </p>
            <button
              onClick={() => handleMarkAcquiredWithConfetti(readyForHandover[0].id)}
              className="bg-gradient-to-r from-gov-green-600 to-emerald-600 hover:from-gov-green-500 hover:to-emerald-500 text-white font-black text-sm px-6 py-3 rounded-xl shadow-lg flex items-center gap-2.5 transition transform active:scale-95 border border-emerald-400"
            >
              <Award className="w-5 h-5" />
              <span>MARK AS ACQUIRED (TAKE POSSESSION)</span>
            </button>
          </div>
        </div>
      )}

      {/* Acquired Parcels Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Acquired Land Master Register ({acquiredParcels.length} Parcels In Possession)
            </h4>
            <p className="text-xs text-slate-500">Formally mutated in State Land Records & National Infrastructure Portal</p>
          </div>
          <span className="text-xs font-bold text-gov-green-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Total Acquired: {acquiredParcels.reduce((acc, k) => acc + k.areaAcre, 0).toFixed(1)} Acre
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-left border-b border-slate-200">
                <th className="p-3">Khasra No.</th>
                <th className="p-3">Original Land Owner</th>
                <th className="p-3">Area</th>
                <th className="p-3">Village & Tehsil</th>
                <th className="p-3">Acquisition Date</th>
                <th className="p-3">Disbursed Compensation</th>
                <th className="p-3">Legal Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {acquiredParcels.map((parcel) => (
                <tr key={parcel.khasraNumber} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-gov-blue-900">Khasra {parcel.khasraNumber}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900">{parcel.ownerName}</span>
                    <span className="text-[10px] text-slate-400 block">{parcel.fatherName}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{parcel.areaAcre} Acre</td>
                  <td className="p-3 text-slate-600">{parcel.village}, {parcel.tehsil}</td>
                  <td className="p-3 font-mono text-slate-700">{formatDate(parcel.acquisitionDate || '2026-01-05')}</td>
                  <td className="p-3 font-bold text-gov-green-700">{formatCurrency(parcel.totalCompensation)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 bg-gov-green-700 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ACQUIRED
                    </span>
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
