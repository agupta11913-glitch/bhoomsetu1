import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCaseDocumentsApi, fetchRevenueCasesApi } from '../../services/api/revenueOfficerApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileText,
  Search,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  ShieldCheck,
} from 'lucide-react';

const RevenueOfficerDocumentsContent = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('CASE-2026-DME-0101');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const cList = await fetchRevenueCasesApi();
      if (Array.isArray(cList)) {
        setCases(cList);
      }
      const docs = await fetchCaseDocumentsApi(selectedCaseId);
      if (Array.isArray(docs)) setDocuments(docs);
    } catch (err) {
      console.error('Documents load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCaseId]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              Land Records & Legal Proofs
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Tehsil Record Room Digital Repository
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Statutory Document Verification Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-verify 12-Year Khatauni extracts, Shajra village maps, Aadhaar identity documents, and field site reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
          >
            {cases.map((c) => (
              <option key={c.caseId} value={c.caseId}>
                Case {c.caseId} (Khasra #{c.khasraNumber} — {c.ownerName})
              </option>
            ))}
          </select>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-gov-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-black uppercase text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {doc.type}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded border border-emerald-300">
                  {doc.status}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {doc.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Format: {doc.format} • Size: {doc.size} • Uploaded: {doc.uploadedDate}
                </p>
                {doc.remarks && (
                  <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 mt-2">
                    ✓ {doc.remarks}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => navigate(`/revenue-officer/cases/${selectedCaseId}`)}
                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 p-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Verify in Dossier</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RevenueOfficerDocuments = () => (
  <ErrorBoundary fallbackTitle="Unable to load Documents">
    <RevenueOfficerDocumentsContent />
  </ErrorBoundary>
);
