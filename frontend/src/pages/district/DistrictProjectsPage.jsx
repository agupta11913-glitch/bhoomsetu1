import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictProjectsApi, updateDistrictProjectProgressApi, uploadDistrictProjectDocumentApi } from '../../services/api/districtApi';
import { formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Layers,
  Building2,
  MapPin,
  FileCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  X,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Edit3,
  Upload,
  Send,
  Save,
  Plus,
} from 'lucide-react';

const DistrictProjectsContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Edit Progress Modal
  const [editModalProject, setEditModalProject] = useState(null);
  const [editProgress, setEditProgress] = useState(65);
  const [editStage, setEditStage] = useState('Joint Demarcation Survey (Section 11)');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editTimeline, setEditTimeline] = useState('HIGH');
  const [editRemarks, setEditRemarks] = useState('');
  const [editForwardState, setEditForwardState] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  // Upload Doc Modal
  const [uploadDocProject, setUploadDocProject] = useState(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Clearance Certificate');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictProjectsApi(currentUser?.district || 'Agra');
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching district projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentUser]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.projectId && p.projectId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.agency && p.agency.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (p) => {
    setEditModalProject(p);
    setEditProgress(p.progress || 65);
    setEditStage(p.currentStage || 'Joint Demarcation Survey (Section 11)');
    setEditStatus(p.status || 'ACTIVE');
    setEditTimeline(p.priority || 'HIGH');
    setEditRemarks('');
    setEditForwardState(false);
  };

  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!editModalProject) return;
    setSavingProgress(true);
    try {
      const payload = {
        progress: editProgress,
        currentStage: editStage,
        status: editStatus,
        timelineStatus: editTimeline,
        remarks: editRemarks || 'District progress milestone updated by Collectorate.',
        forwardToState: editForwardState,
      };
      const res = await updateDistrictProjectProgressApi(editModalProject.projectId, payload);
      if (res.success) {
        setActionNotice(`Project "${editModalProject.name}" milestone updated successfully.${editForwardState ? ' Escalated to State Government.' : ''}`);
        setEditModalProject(null);
        loadProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!uploadDocProject || !docName.trim()) return;
    setUploadingDoc(true);
    try {
      const payload = {
        name: docName.trim(),
        type: docType,
        format: 'PDF',
        size: '2.4 MB',
      };
      const res = await uploadDistrictProjectDocumentApi(uploadDocProject.projectId, payload);
      if (res.success) {
        setActionNotice(`Document "${docName}" attached to Project "${uploadDocProject.projectId}" successfully.`);
        setUploadDocProject(null);
        setDocName('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingDoc(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Jurisdictional Oversight
            </span>
            <span className="text-xs font-bold text-slate-500">District: {currentUser?.district || 'Agra'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-600" />
            <span>Infrastructure Projects & Highway Corridors</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor linear alignment acquisition milestones, update project progress, upload clearances, and escalate bottlenecks to State.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Authorized Projects</div>
            <div className="text-xl font-black text-purple-700">{filteredProjects.length} Corridors</div>
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

      {/* 2. Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search corridor by name, project ID, or executing agency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Project Statuses</option>
            <option value="ACTIVE">Active Acquisition</option>
            <option value="IN_PROGRESS">In Progress / Hearings</option>
            <option value="PLANNING">Planning / Alignment Survey</option>
          </select>
        </div>
      </div>

      {/* 3. Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.projectId}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov hover:shadow-md hover:border-purple-300 transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {p.projectId}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    p.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 line-clamp-2">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.agency}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Land Required</span>
                  <strong className="text-slate-800">{formatAcre(p.totalLandAcre)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Affected Parcels</span>
                  <strong className="text-slate-800">{p.affectedParcels} Khasras</strong>
                </div>
              </div>

              {/* Progress Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Acquisition Progress</span>
                  <span className="text-purple-700">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedProject(p)}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>

                {hasPermission(DISTRICT_PERMISSIONS.EDIT_PROJECT) && (
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Progress</span>
                  </button>
                )}
              </div>

              {hasPermission(DISTRICT_PERMISSIONS.UPLOAD_DOCUMENTS) && (
                <button
                  onClick={() => {
                    setUploadDocProject(p);
                    setDocName('');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Clearance / Document</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Project Dossier Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700">{selectedProject.projectId}</span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">{selectedProject.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-bold text-[10px]">Implementing Agency</span>
                <strong className="text-slate-800">{selectedProject.agency}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-bold text-[10px]">Statutory Jurisdiction</span>
                <strong className="text-slate-800">{currentUser?.district || 'Agra'} District</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-bold text-[10px]">Total Alignment Area</span>
                <strong className="text-slate-800">{formatAcre(selectedProject.totalLandAcre)}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-bold text-[10px]">Total Cadastral Parcels</span>
                <strong className="text-slate-800">{selectedProject.affectedParcels} Khasras</strong>
              </div>
            </div>

            {/* Statutory Action Controls (Rendered by Permission) */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Collectorate Statutory Actions & Sanctions
              </h4>

              {hasPermission(DISTRICT_PERMISSIONS.EDIT_PROJECT) && (
                <button
                  onClick={() => {
                    const p = selectedProject;
                    setSelectedProject(null);
                    handleOpenEdit(p);
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Update Milestone, Stage & Progress</span>
                </button>
              )}

              {hasPermission(DISTRICT_PERMISSIONS.MANAGE_COORDINATION) && (
                <button
                  onClick={() => handleIssueDirection('Expedite Joint Revenue Survey & Demarcation')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Issue Section 11 / Joint Survey Expedited Directive</span>
                </button>
              )}

              {hasPermission(DISTRICT_PERMISSIONS.MANAGE_ESCALATIONS) && (
                <button
                  onClick={() => handleIssueDirection('Sanction Section 19 Final Acquisition Declaration')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Sanction Section 19 Final Declaration Gazette</span>
                </button>
              )}

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2.5 rounded-xl text-xs"
              >
                Close Project Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Update Project Progress Modal */}
      {editModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Project Progress Desk
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Update Project Milestone & Status
                </h3>
                <p className="text-xs text-slate-500">{editModalProject.name}</p>
              </div>
              <button
                onClick={() => setEditModalProject(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Acquisition Progress:</span>
                  <span className="text-purple-700 font-black">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Milestone Stage</label>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="Joint Demarcation Survey (Section 11)">Joint Demarcation Survey (Section 11)</option>
                  <option value="Quasi-Judicial Hearing (Section 15)">Quasi-Judicial Hearing (Section 15)</option>
                  <option value="Final Declaration (Section 19)">Final Declaration (Section 19)</option>
                  <option value="Award Determination (Section 23)">Award Determination (Section 23)</option>
                  <option value="PFMS Compensation Disbursement">PFMS Compensation Disbursement</option>
                  <option value="Possession Taken & Contractor Handover">Possession Taken & Contractor Handover</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="HELD_FOR_REVIEW">HELD_FOR_REVIEW</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Timeline Priority</label>
                  <select
                    value={editTimeline}
                    onChange={(e) => setEditTimeline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                  >
                    <option value="ON_TRACK">ON_TRACK</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="DELAYED">DELAYED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District Milestone Remarks</label>
                <textarea
                  rows={2}
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Enter collectorate observations, clearance status, or bottleneck notes..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <label className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl border border-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForwardState}
                  onChange={(e) => setEditForwardState(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-bold text-purple-950 text-xs">
                  Forward / Escalate this update to State Infrastructure Desk
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProgress}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProgress ? 'Saving...' : 'Save Milestone Progress'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Upload Project Document Modal */}
      {uploadDocProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Document Attachment
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Upload Project Clearance Document
                </h3>
              </div>
              <button
                onClick={() => setUploadDocProject(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Forest Stage-II Statutory Clearance Certificate"
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
                  <option value="Clearance Certificate">Clearance Certificate</option>
                  <option value="Statutory Gazette">Statutory Gazette</option>
                  <option value="Joint Survey Report">Joint Survey Report</option>
                  <option value="Inter-Department NOC">Inter-Department NOC</option>
                  <option value="Land Award Order">Land Award Order</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-purple-200 rounded-2xl p-4 text-center bg-purple-50/40">
                <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <span className="text-[11px] text-slate-600 block font-bold">
                  Document verified & stamped with Collectorate Seal
                </span>
                <span className="text-[10px] text-slate-400">PDF, Max 10MB</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadDocProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingDoc ? 'Uploading...' : 'Publish Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DistrictProjectsPage = () => (
  <ErrorBoundary>
    <DistrictProjectsContent />
  </ErrorBoundary>
);

export default DistrictProjectsPage;
