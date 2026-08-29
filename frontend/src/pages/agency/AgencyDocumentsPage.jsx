import React, { useState, useEffect } from 'react';
import {
  fetchAgencyDocumentsApi,
  fetchAgencyProjectsApi,
  uploadAgencyDocumentApi,
} from '../../services/api/agencyApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Building2,
  Calendar,
} from 'lucide-react';

const AgencyDocumentsContent = () => {
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewDocModal, setViewDocModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [docs, prjs] = await Promise.all([
        fetchAgencyDocumentsApi(selectedProject),
        fetchAgencyProjectsApi(),
      ]);
      if (Array.isArray(docs)) setDocuments(docs);
      if (Array.isArray(prjs)) setProjects(prjs);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProject]);

  const defaultDocs = [
    { id: 'DOC-PIA-001', projectId: 'PRJ-001', title: 'Detailed Project Report (DPR) & Alignment Feasibility Vol-I', type: 'DPR', size: 'PDF (18.4 MB)', date: '2024-02-10', uploadedBy: 'NHAI Planning Cell' },
    { id: 'DOC-PIA-002', projectId: 'PRJ-001', title: 'Section 3A Gazette Notification & Boundary Cadastre Map', type: 'Gazette', size: 'PDF (4.2 MB)', date: '2024-03-12', uploadedBy: 'MoRTH Land Division' },
    { id: 'DOC-PIA-003', projectId: 'PRJ-001', title: 'Section 19 Final Declaration & Sanctioned Acquisition Schedule', type: 'Statutory Sanction', size: 'PDF (8.6 MB)', date: '2025-02-25', uploadedBy: 'CALA District Magistrate Agra' },
    { id: 'DOC-PIA-004', projectId: 'PRJ-001', title: 'UPPTCL High-Tension Transmission Line Shifting Estimate & Drawing', type: 'Utility NOC', size: 'PDF (12.1 MB)', date: '2025-11-20', uploadedBy: 'UPPTCL Transmission Division' },
    { id: 'DOC-PIA-005', projectId: 'PRJ-002', title: 'Agra Western Ring Road Phase-2 Environment & Forest Clearance Application', type: 'Forest Clearance', size: 'PDF (15.8 MB)', date: '2025-06-14', uploadedBy: 'NHAI & UP PWD Cell' },
    { id: 'DOC-PIA-006', projectId: 'PRJ-005', title: 'NH-19 6-Lane Expansion Section 23 Compensation Award Schedule', type: 'Award Schedule', size: 'PDF (6.7 MB)', date: '2025-04-18', uploadedBy: 'CALA Kanpur Nagar' },
  ];

  const list = documents.length > 0 ? documents : defaultDocs;

  const filtered = list.filter((d) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.title?.toLowerCase().includes(q) ||
        d.projectId?.toLowerCase().includes(q) ||
        d.type?.toLowerCase().includes(q) ||
        d.uploadedBy?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUploadSubmit = async () => {
    setSubmitting(true);
    try {
      await uploadAgencyDocumentApi({
        projectId: formData.projectId || (projects[0]?.projectId || 'PRJ-001'),
        title: formData.title || 'Project Technical Document',
        type: formData.type || 'Field Report',
      });
      setUploadModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Error uploading document:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = (doc) => {
    const dummyContent = `BhoomiSetu Project Implementing Agency Repository\nDocument: ${doc.title}\nProject: ${doc.projectId}\nType: ${doc.type}\nDate: ${doc.date}\nUploaded By: ${doc.uploadedBy}`;
    const element = document.createElement('a');
    const file = new Blob([dummyContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.id}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-50 text-cyan-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-700" />
              <span>Technical & Statutory Repository</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Assigned Corridors</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-600" />
            <span>Project Documents Repository</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Access, view, download, and upload DPRs, Section 3A gazettes, utility shift drawings, and CALA sanction orders.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ projectId: projects[0]?.projectId || 'PRJ-001', type: 'DPR' });
            setUploadModalOpen(true);
          }}
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Assigned Project:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="ALL">All Assigned Projects ({projects.length || 4})</option>
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search document title, type, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Documents
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Upload Date</th>
                <th className="py-3.5 px-4">Author / Authority</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-cyan-50/30 transition">
                  <td className="py-4 px-4 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 font-black text-[10px] flex items-center justify-center border border-red-200 shrink-0">
                        PDF
                      </span>
                      <div>
                        <span className="font-black text-slate-900 block line-clamp-1">{d.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">{d.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-cyan-700">
                    {d.projectId}
                  </td>

                  <td className="py-4 px-4">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                      {d.type}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                    {d.size}
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                    {d.date}
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    {d.uploadedBy}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewDocModal(d)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleDownload(d)}
                        className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold px-2.5 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wide">
                  {viewDocModal.projectId} • {viewDocModal.id}
                </span>
                <h3 className="text-base font-black text-slate-900">{viewDocModal.title}</h3>
              </div>
              <button
                onClick={() => setViewDocModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Document Type:</span>
                <strong className="text-slate-800">{viewDocModal.type}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">File Format / Size:</span>
                <strong className="text-slate-800">{viewDocModal.size}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Upload Date:</span>
                <strong className="text-slate-800">{viewDocModal.date}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Issuing Authority:</span>
                <strong className="text-slate-800">{viewDocModal.uploadedBy}</strong>
              </div>
            </div>

            <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-100 text-xs text-cyan-950">
              <p>
                This document is certified under the National Land Records & Infrastructure Repository. You may download the verified PDF artifact for statutory records.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewDocModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(viewDocModal)}
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wide">
                  PIA Technical Upload
                </span>
                <h3 className="text-base font-black text-slate-900">Upload Project Document</h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Project:</label>
                <select
                  value={formData.projectId || projects[0]?.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  {projects.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.projectId} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title:</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Package-2 Culvert & Bridge Drawing"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Type:</label>
                <select
                  value={formData.type || 'DPR'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="DPR">Detailed Project Report (DPR)</option>
                  <option value="Gazette">Gazette 3A / 19 Notice</option>
                  <option value="Utility NOC">Utility Shifting NOC</option>
                  <option value="Award Schedule">Compensation Award Schedule</option>
                  <option value="Field Report">Site Inspection / Field Report</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center space-y-1">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Choose PDF / CAD / TIFF File</div>
                <div className="text-[10px] text-slate-400">Max size: 50MB (Standard statutory format)</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleUploadSubmit}
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
              >
                {submitting ? 'Uploading...' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AgencyDocumentsPage = () => (
  <ErrorBoundary>
    <AgencyDocumentsContent />
  </ErrorBoundary>
);

export default AgencyDocumentsPage;
