import React, { useState, useEffect } from 'react';
import { fetchTehsildarDocumentsApi } from '../../services/api/tehsildarApi';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Building2,
  Layers,
  FolderOpen,
  RefreshCw,
  X,
} from 'lucide-react';

export const TehsildarDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchTehsildarDocumentsApi({ category: categoryFilter });
      if (data && Array.isArray(data)) {
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (e) {
      console.error('Failed to load documents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [categoryFilter]);

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'Khatauni', label: 'Bhulekh Khatauni' },
    { id: 'Khasra Map', label: 'Cadastral Shajra Map' },
    { id: 'Sale Deed', label: 'Registered Sale Deed' },
    { id: 'Verification Report', label: 'Field Verification Reports' },
    { id: 'Section 11 Notice', label: 'Section 11 Gazette Notices' },
    { id: 'Award Statement', label: 'Compensation Awards (Sec 23)' },
  ];

  const filtered = documents.filter((doc) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (doc.name && doc.name.toLowerCase().includes(q)) ||
      (doc.type && doc.type.toLowerCase().includes(q)) ||
      (doc.caseId && doc.caseId.toLowerCase().includes(q)) ||
      (doc.khasraNumber && doc.khasraNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Electronic Land Records Management (e-Records)
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Tehsil Registry Archive & Statutory Case Files
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Statutory Acquisition Documents & Evidence Repository
          </h1>
        </div>

        <button
          onClick={loadDocuments}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                categoryFilter === cat.id
                  ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-md text-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title, case ID, or khasra..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-900/20"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs">
            Loading document repository...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs">
            No documents found for selected category.
          </div>
        ) : (
          filtered.map((doc) => (
            <div
              key={doc.id || doc.name}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-gov hover:border-gov-blue-800 transition flex flex-col justify-between space-y-3 text-xs group"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2 bg-gov-blue-50 text-gov-blue-900 rounded-xl group-hover:bg-gov-blue-900 group-hover:text-white transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {doc.name || 'Bhulekh Certified Copy'}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Case ID: {doc.caseId || 'CASE-2026-DME-0101'} • Khasra {doc.khasraNumber || '101'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Uploaded: {doc.uploadedAt || '12 Feb 2026'}
                </span>

                <button
                  onClick={() => setActivePreviewDoc(doc)}
                  className="bg-slate-100 hover:bg-gov-blue-900 text-slate-700 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Preview Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gov-blue-900 uppercase">Document Archive</span>
                <h3 className="font-black text-sm text-slate-900 mt-0.5">{activePreviewDoc.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">Case ID: {activePreviewDoc.caseId}</span>
              </div>
              <button onClick={() => setActivePreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <FileText className="w-12 h-12 text-gov-blue-900 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">Authenticated Government Record</p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Digitally stamped by Tehsil Fatehabad Revenue Records Repository. Integrity Hash: SHA-256 (UP-REV-DOC-9921)
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Downloading verified copy of ${activePreviewDoc.name}`)}
                className="px-4 py-2 rounded-xl bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold flex items-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
