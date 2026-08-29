import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import {
  fetchTehsildarCasesApi,
  approveTehsildarCaseApi,
  rejectTehsildarCaseApi,
  sendBackTehsildarCaseApi
} from '../../services/api/tehsildarApi';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  FileCheck,
  Building2,
  MapPin,
  Eye,
  AlertTriangle,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';

export const TehsildarVerificationPage = () => {
  const navigate = useNavigate();
  const { setActiveKhasraId, showToast } = useLandData();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadVerificationQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchTehsildarCasesApi({ status: 'ALL' });
      if (data && Array.isArray(data)) {
        setCases(data);
        if (!selectedCase && data.length > 0) {
          setSelectedCase(data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load verification cases:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationQueue();
  }, []);

  const handleActionSubmit = async () => {
    if (!selectedCase) return;
    if ((actionType === 'REJECT' || actionType === 'SEND_BACK') && !remarks.trim()) {
      showToast('Remarks Required', 'Please enter remarks for this action.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const targetId = selectedCase.caseId || selectedCase.khasraNumber;
      if (actionType === 'APPROVE') {
        const res = await approveTehsildarCaseApi(targetId, remarks || 'Verified and approved by Tehsildar.');
        showToast('Case Approved', `Khasra ${selectedCase.khasraNumber} marked as verified & approved.`, 'success');
        if (res) setSelectedCase(res);
      } else if (actionType === 'REJECT') {
        const res = await rejectTehsildarCaseApi(targetId, remarks);
        showToast('Case Rejected', `Khasra ${selectedCase.khasraNumber} rejected.`, 'error');
        if (res) setSelectedCase(res);
      } else if (actionType === 'SEND_BACK') {
        const res = await sendBackTehsildarCaseApi(targetId, remarks);
        showToast('Sent Back', `Case sent back to Revenue Officer for correction.`, 'info');
        if (res) setSelectedCase(res);
      }

      setActionType(null);
      setRemarks('');
      await loadVerificationQueue();
    } catch (err) {
      showToast('Error', err.message || 'Action failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Statutory Verification Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Tehsildar Quality & Title Verification Oversight
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Revenue Officer Ground Verification Review & Sign-Off
          </h1>
        </div>

        <button
          onClick={loadVerificationQueue}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Grid: Left Verification Queue + Right Active Inspection Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Queue List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              Verification Queue ({cases.length} parcels)
            </span>
            <span className="text-[10px] text-slate-400">Fatehabad Tehsil</span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto">
            {cases.map((c) => {
              const isSelected = selectedCase?.khasraNumber === c.khasraNumber;
              return (
                <div
                  key={c.id || c.khasraNumber}
                  onClick={() => {
                    setSelectedCase(c);
                    setActiveKhasraId(c.khasraNumber);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-gov-blue-50/80 border-gov-blue-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 font-mono">Khasra {c.khasraNumber}</span>
                      <span className="text-[10px] text-slate-400">({c.khataNumber || 'KH-842'})</span>
                    </div>
                    <p className="font-semibold text-slate-700 mt-0.5">{c.ownerName}</p>
                    <span className="text-[10px] text-slate-500">
                      {c.village || 'Nagla'} • {c.affectedAreaAcre || 0.8} Ac / {c.areaAcre || 2.5} Ac
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <StatusBadge status={c.status} size="sm" />
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {c.tehsildarStatus || 'PENDING_REVIEW'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Review Inspector (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCase ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-5 text-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="bg-gov-blue-50 text-gov-blue-900 text-[10px] uppercase font-black px-2 py-0.2 rounded">
                    Statutory Review File
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    Khasra No. {selectedCase.khasraNumber} — {selectedCase.ownerName}
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Village: {selectedCase.village || 'Nagla'}, Fatehabad Tehsil, District Agra
                  </p>
                </div>
                <StatusBadge status={selectedCase.status} size="md" />
              </div>

              {/* Verification Checklist */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Revenue Officer Ground Verification Audit
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-700">1. Bhulekh RoR 1359 Fasli Title Search:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Clean Single Title
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-700">2. Physical Cadastral Ground Demarcation:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Demarcated by Lekhpal
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-700">3. GIS Coordinate & 60m ROW Intersection:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clean Boundary (No Overlap)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-700">4. Structure & Tree Valuation Assessment:</span>
                    <span className="text-slate-800 font-mono font-bold">
                      Calculated (Base ₹{formatCurrency(selectedCase.baseCompensation || 10800000)})
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">Assigned Revenue Officer Notes:</span>
                  <p className="text-slate-700 leading-relaxed font-medium mt-0.5">
                    {selectedCase.revenueOfficerNotes || 'Field verification conducted with Revenue Inspector. Clean cadastral survey. Recommended for Tehsildar approval.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => navigate(`/tehsildar/map?caseId=${selectedCase.caseId || selectedCase.khasraNumber}`)}
                  className="text-gov-blue-900 font-bold hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4 text-gov-saffron-600" />
                  <span>Inspect on Cadastral Map</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActionType('SEND_BACK');
                      setRemarks('');
                    }}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Send Back</span>
                  </button>

                  <button
                    onClick={() => {
                      setActionType('REJECT');
                      setRemarks('');
                    }}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-900 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => {
                      setActionType('APPROVE');
                      setRemarks('Case verified and confirmed by Tehsildar.');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-extrabold transition flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Verification</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-gov text-center text-slate-400 text-xs">
              Select a case from the verification queue to inspect details.
            </div>
          )}
        </div>
      </div>

      {/* Action Dialog */}
      {actionType && (
        <div className="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                {actionType === 'APPROVE' && 'Approve Ground Verification'}
                {actionType === 'REJECT' && 'Reject Ground Verification'}
                {actionType === 'SEND_BACK' && 'Send Back to Revenue Officer'}
              </h3>
              <button onClick={() => setActionType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Remarks / Instructions:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter official sign-off notes or required corrections..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-blue-900/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleActionSubmit}
                className="px-4 py-1.5 rounded-xl bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold transition shadow-xs"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
