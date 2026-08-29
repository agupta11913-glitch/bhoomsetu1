import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictDocumentsApi, uploadDistrictDocumentApi } from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Building2,
  FileCheck,
  Upload,
  Plus,
  X,
  CheckCircle2,
  Save,
} from 'lucide-react';

const DistrictDocumentsContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Statutory Gazette Notification');
  const [docStatus, setDocStatus] = useState('PUBLISHED');
  const [uploading, setUploading] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictDocumentsApi(currentUser?.district || 'Agra');
      if (Array.isArray(data)) setDocs(data);
    } catch (err) {
      console.error('Error fetching district documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [currentUser]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    setUploading(true);
    try {
      const payload = {
        name: docTitle.trim(),
        type: docType,
        format: 'PDF',
        size: '3.1 MB',
        status: docStatus,
      };
      const res = await uploadDistrictDocumentApi(payload);
      if (res.success) {
        setActionNotice(`Document "${docTitle}" published to District Gazette Archive.`);
        setShowUploadModal(false);
        setDocTitle('');
        loadDocs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Statutory Gazette Archive
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <span>District Gazette Notifications & Statutory Orders</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official repository of published Section 3A/11, Section 3D/19 Gazette notifications, and Collectorate award orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission(DISTRICT_PERMISSIONS.UPLOAD_DOCUMENTS) && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          )}

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Documents</span>
            <strong className="text-xl font-black text-purple-700">{docs.length} Official Files</strong>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md transition flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                {d.format || 'PDF'}
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 line-clamp-1">{d.name}</h3>
                <p className="text-[11px] text-slate-500">{d.type} • {d.size} • Published: {d.date}</p>
                {d.uploader && <span className="text-[10px] text-purple-700 font-bold">Uploaded by: {d.uploader}</span>}
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading statutory document: ${d.name}`)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-purple-700 rounded-xl text-xs flex items-center gap-1 font-bold shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Gazette Registry
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Publish Official Document
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Name / Gazette Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Section 3D Declaration of Acquisition (Fatehabad Tehsil)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Classification</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="Statutory Gazette Notification">Statutory Gazette Notification</option>
                  <option value="Section 11 Preliminary Notification">Section 11 Preliminary Notification</option>
                  <option value="Section 19 Declaration Order">Section 19 Declaration Order</option>
                  <option value="Collectorate Final Land Award (Sec 23)">Collectorate Final Land Award (Sec 23)</option>
                  <option value="R&R Master Scheme Approval">R&R Master Scheme Approval</option>
                  <option value="Divisional Commissioner NOC">Divisional Commissioner NOC</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-purple-200 rounded-2xl p-4 text-center bg-purple-50/40">
                <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <span className="text-[11px] text-slate-600 block font-bold">
                  Official Gazette File Ready for Upload
                </span>
                <span className="text-[10px] text-slate-400">PDF Document (Max 25MB)</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Publishing...' : 'Publish to Archive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DistrictDocumentsPage = () => (
  <ErrorBoundary>
    <DistrictDocumentsContent />
  </ErrorBoundary>
);

export default DistrictDocumentsPage;
