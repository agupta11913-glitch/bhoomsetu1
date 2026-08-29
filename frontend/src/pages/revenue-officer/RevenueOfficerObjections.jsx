import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRevenueObjectionsApi, submitObjectionFactReportApi } from '../../services/api/revenueOfficerApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  AlertTriangle,
  FileCheck,
  Send,
  CheckCircle2,
  RefreshCw,
  Search,
  MessageSquareWarning,
  Eye,
  ShieldCheck,
} from 'lucide-react';

const RevenueOfficerObjectionsContent = () => {
  const navigate = useNavigate();
  const [objections, setObjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedObjection, setSelectedObjection] = useState(null);
  const [reportRemarks, setReportRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueObjectionsApi();
      if (Array.isArray(data)) setObjections(data);
    } catch (err) {
      console.error('Objections load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitFactReport = async (e) => {
    e.preventDefault();
    if (!selectedObjection) return;

    setSubmitting(true);
    setSuccessMsg(null);
    try {
      const res = await submitObjectionFactReportApi(selectedObjection.objectionId, { remarks: reportRemarks });
      if (res.success) {
        setSuccessMsg(`Fact-finding report for ${selectedObjection.objectionId} submitted to Tehsildar successfully.`);
        setSelectedObjection(null);
        setReportRemarks('');
        loadData();
      }
    } catch (err) {
      console.error('Report submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider">
              Section 15 Fact-Finding Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Citizen Objection Field Reports
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Citizen Objections & Field Ground Truth Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct on-ground inquiry into citizen representations, verify boundary disputes, and submit objective fact-finding reports to the Tehsildar.
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

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Objections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objections.map((obj) => (
          <div
            key={obj.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-gov-md transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-mono text-xs font-bold text-slate-500">{obj.objectionId}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                  obj.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                  obj.status === 'FIELD_INVESTIGATED' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                  'bg-rose-100 text-rose-900 border-rose-300'
                }`}>
                  {obj.status}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Khasra #{obj.khasraNumber} — {obj.claimantName}
                </h3>
                <span className="text-xs font-bold text-rose-700 block">
                  Ground: {obj.objectionType || 'Valuation & Boundary Dispute'}
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                  "{obj.description}"
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedObjection(obj)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Submit Field Fact Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fact-Finding Report Modal */}
      {selectedObjection && (
        <div className="fixed inset-0 z-[1200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Field Inquiry Submission
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Objection #{selectedObjection.objectionId}
                </h3>
                <p className="text-xs text-slate-500">Claimant: {selectedObjection.claimantName} (Khasra #{selectedObjection.khasraNumber})</p>
              </div>
            </div>

            <form onSubmit={handleSubmitFactReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Revenue Officer Field Inquiry Findings & Evidence Notes
                </label>
                <textarea
                  rows={4}
                  value={reportRemarks}
                  onChange={(e) => setReportRemarks(e.target.value)}
                  placeholder="Record on-site measurement results, tube-well existence, boundary pillar status, and objective factual summary..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedObjection(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Tehsildar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const RevenueOfficerObjections = () => (
  <ErrorBoundary fallbackTitle="Unable to load Objections">
    <RevenueOfficerObjectionsContent />
  </ErrorBoundary>
);
