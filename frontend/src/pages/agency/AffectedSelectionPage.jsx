import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  CheckSquare,
  Square,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  X,
} from 'lucide-react';

export const AffectedSelectionPage = () => {
  const navigate = useNavigate();
  const { khasras, toggleParcelSelection, issueSection11Notice, showToast } = useLandData();

  const selectedParcels = khasras.filter((k) => k.selectedForAcquisition);
  const totalSelectedArea = selectedParcels.reduce((acc, k) => acc + k.areaAcre, 0);
  const privateOwners = selectedParcels.filter((k) => !k.landType.includes('Government')).length;
  const govtLandCount = selectedParcels.filter((k) => k.landType.includes('Government')).length;
  const totalEstCompensation = selectedParcels.reduce((acc, k) => acc + k.totalCompensation, 0);

  const handleBulkIssueNotices = () => {
    selectedParcels.forEach((k) => {
      if (!k.noticeIssued) {
        issueSection11Notice(k.id);
      }
    });
    showToast('Notices Issued', `Section 11 notifications published for all ${selectedParcels.length} selected parcels.`, 'success');
    navigate('/notices');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Corridor Planning Matrix
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Agra-Lucknow Highway (PRJ-001)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Affected Land Parcel Selection & Aggregation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select verified cadastral plots to consolidate the formal Section 11 acquisition package.
          </p>
        </div>

        {/* Action button + Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBulkIssueNotices}
            disabled={selectedParcels.length === 0}
            className="bg-gov-saffron-600 hover:bg-gov-saffron-500 disabled:opacity-50 text-white font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition transform active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Publish Notices ({selectedParcels.length})</span>
            <ArrowRight className="w-4 h-4" />
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

      {/* Auto-Calculated Summary Matrix Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
            Selected Parcels
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-indigo-950">{selectedParcels.length}</span>
            <span className="text-xs text-slate-500">/ {khasras.length} Plots</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gov-green-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
            Total Selected Acreage
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-gov-green-800">{totalSelectedArea.toFixed(1)}</span>
            <span className="text-xs text-slate-500">Acre</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            Ownership Mix
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xs font-bold text-slate-800">
              Private: <strong className="text-gov-blue-900">{privateOwners}</strong>
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-xs font-bold text-slate-800">
              Govt: <strong className="text-emerald-700">{govtLandCount}</strong>
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block">
            Est. Compensation Pool
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-purple-950">{formatCurrency(totalEstCompensation)}</span>
          </div>
        </div>
      </div>

      {/* Interactive Selection Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Cadastral Survey Parcel Checklist
          </span>
          <span className="text-xs text-slate-500">
            Click checkbox or row to toggle inclusion in corridor package
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-left border-b border-slate-200">
                <th className="p-3 w-12 text-center">Select</th>
                <th className="p-3">Khasra No.</th>
                <th className="p-3">Land Owner</th>
                <th className="p-3">Area</th>
                <th className="p-3">Land Classification</th>
                <th className="p-3">Revenue RoR</th>
                <th className="p-3">GIS Boundary</th>
                <th className="p-3">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {khasras.map((parcel) => {
                const isSelected = parcel.selectedForAcquisition;

                return (
                  <tr
                    key={parcel.khasraNumber}
                    onClick={() => toggleParcelSelection(parcel.id)}
                    className={`hover:bg-slate-50 transition cursor-pointer ${
                      isSelected ? 'bg-indigo-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleParcelSelection(parcel.id);
                        }}
                        className="text-gov-blue-900 focus:outline-none"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-700" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      Khasra {parcel.khasraNumber}
                      <span className="text-[10px] text-slate-400 block font-normal">{parcel.khataNumber}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900">{parcel.ownerName}</span>
                      <span className="text-[10px] text-slate-400 block">{parcel.fatherName}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{parcel.areaAcre} Acre</td>
                    <td className="p-3 text-slate-600">{parcel.landType}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        parcel.revenueVerified ? 'text-emerald-700' : 'text-amber-600'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {parcel.revenueVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        parcel.gisVerified ? 'text-emerald-700' : 'text-amber-600'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {parcel.gisVerified ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={parcel.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
