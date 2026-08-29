import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAgencyProjectsApi,
  updateAgencyProjectProgressApi,
  addAgencyProjectRemarkApi,
  uploadAgencyDocumentApi,
  reportAgencyIssueApi,
} from '../../services/api/agencyApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Layers,
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  Building2,
  Calendar,
} from 'lucide-react';

const AgencyProjectsContent = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [activeActionModal, setActiveActionModal] = useState(null); // 'PROGRESS', 'REMARK', 'DOCUMENT', 'ISSUE'
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const data = await fetchAgencyProjectsApi();
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error('Error loading agency projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const defaultProjects = [
    { projectId: 'PRJ-001', name: 'Delhi–Meerut Expressway Expansion (NH-348)', district: 'Agra', department: 'Ministry of Road Transport & Highways', progress: 65.2, status: 'ACTIVE', startDate: '2024-01-15', expectedCompletion: '2027-03-31', affectedParcels: 124, totalLandAcre: 1450.0, acquiredLandAcre: 945.5, currentStage: 'Section 19 Sanctioned', estimatedCostCr: 840.0 },
    { projectId: 'PRJ-002', name: 'Agra Western Ring Road Phase-2', district: 'Agra', department: 'Public Works Department, UP', progress: 76.5, status: 'ACTIVE', startDate: '2024-06-01', expectedCompletion: '2026-12-31', affectedParcels: 48, totalLandAcre: 320.0, acquiredLandAcre: 245.0, currentStage: 'Physical Possession Handover', estimatedCostCr: 320.0 },
    { projectId: 'PRJ-005', name: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', department: 'Ministry of Road Transport & Highways', progress: 69.3, status: 'ACTIVE', startDate: '2024-03-10', expectedCompletion: '2026-10-31', affectedParcels: 96, totalLandAcre: 880.0, acquiredLandAcre: 610.0, currentStage: 'Section 23 Award Declared', estimatedCostCr: 560.0 },
    { projectId: 'PRJ-011', name: 'Lucknow Ring Road Phase-3 Infrastructure Belt', district: 'Lucknow', department: 'Ministry of Road Transport & Highways', progress: 62.7, status: 'ACTIVE', startDate: '2024-09-01', expectedCompletion: '2027-06-30', affectedParcels: 82, totalLandAcre: 510.0, acquiredLandAcre: 320.0, currentStage: 'Section 19 Sanctioned', estimatedCostCr: 620.0 },
  ];

  const list = projects.length > 0 ? projects : defaultProjects;

  const filtered = list.filter((p) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.projectId?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        p.department?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openAction = (prj, type) => {
    setSelectedProjectModal(prj);
    setActiveActionModal(type);
    setFormData({ progress: prj.progress });
  };

  const handleActionSubmit = async () => {
    if (!selectedProjectModal) return;
    setSubmitting(true);
    try {
      if (activeActionModal === 'PROGRESS') {
        await updateAgencyProjectProgressApi(selectedProjectModal.projectId, {
          progress: formData.progress,
          remarks: formData.remarks || 'Project velocity updated by PIA.',
        });
      } else if (activeActionModal === 'REMARK') {
        await addAgencyProjectRemarkApi(selectedProjectModal.projectId, {
          remark: formData.remark || 'Site observation recorded.',
        });
      } else if (activeActionModal === 'DOCUMENT') {
        await uploadAgencyDocumentApi({
          projectId: selectedProjectModal.projectId,
          title: formData.title || 'Technical Field Report',
          type: formData.type || 'Field Report',
        });
      } else if (activeActionModal === 'ISSUE') {
        await reportAgencyIssueApi({
          projectId: selectedProjectModal.projectId,
          issue: formData.issue || 'Corridor Execution Roadblock',
          priority: formData.priority || 'HIGH',
          description: formData.description || 'Reported from My Projects dashboard.',
          parcelCase: formData.parcelCase || 'Main Alignment ROW',
        });
      }
      setActiveActionModal(null);
      await loadProjects();
    } catch (err) {
      console.error('Error submitting project action:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-50 text-cyan-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-700" />
              <span>Assigned Infrastructure Packages</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Authorized Corridors</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-600" />
            <span>My Assigned Projects</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct implementation registry of expressway and highway corridors allocated to this implementing agency.
          </p>
        </div>

        <button
          onClick={() => navigate('/agency/map')}
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>View on Agency GIS Map</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assigned project name, code, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Assigned Projects
        </div>
      </div>

      {/* Projects Table Matching Exact Requirements */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 min-w-[140px]">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">Expected Completion</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((p) => (
                <tr
                  key={p.projectId}
                  onClick={() => setSelectedProjectModal(p)}
                  className="hover:bg-cyan-50/40 transition cursor-pointer group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-100">
                        {p.projectId}
                      </span>
                      <span className="font-black text-slate-900 group-hover:text-cyan-700 transition">
                        {p.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {p.district}
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    {p.department}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-black text-slate-900">{p.progress}%</span>
                      <span className="text-slate-400 font-normal">Executed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(p.progress, 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      {p.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                    {p.startDate}
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                    {p.expectedCompletion}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openAction(p, 'PROGRESS')}
                        className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                      >
                        Update Progress
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProjectModal(p);
                          navigate(`/project-agency/progress?projectId=${p.projectId}`);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                      >
                        Milestones
                      </button>

                      <button
                        onClick={() => openAction(p, 'REMARK')}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                      >
                        Remark
                      </button>

                      <button
                        onClick={() => openAction(p, 'DOCUMENT')}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                      >
                        Upload Doc
                      </button>

                      <button
                        onClick={() => openAction(p, 'ISSUE')}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                      >
                        Report Issue
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProjectModal && !activeActionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-100">
                    {selectedProjectModal.projectId}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    {selectedProjectModal.status}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedProjectModal.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProjectModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">District</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.district}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Stage</span>
                  <strong className="text-xs font-black text-cyan-700">{selectedProjectModal.currentStage}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Affected Parcels</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.affectedParcels} Parcels</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Outlay</span>
                  <strong className="text-xs font-black text-emerald-700">₹{selectedProjectModal.estimatedCostCr} Cr</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Start Date</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.startDate}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Date</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.expectedCompletion}</strong>
                </div>
              </div>

              {/* Progress Detail */}
              <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-100 space-y-2">
                <div className="flex justify-between text-xs font-bold text-cyan-900">
                  <span>Physical Construction Velocity</span>
                  <span>{selectedProjectModal.progress}% Completed</span>
                </div>
                <div className="w-full bg-cyan-200/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-cyan-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(selectedProjectModal.progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions inside Modal */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => openAction(selectedProjectModal, 'PROGRESS')}
                  className="bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold p-2.5 rounded-xl text-xs text-center border border-cyan-200"
                >
                  Update Progress
                </button>
                <button
                  onClick={() => {
                    const pid = selectedProjectModal.projectId;
                    setSelectedProjectModal(null);
                    navigate(`/project-agency/progress?projectId=${pid}`);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-2.5 rounded-xl text-xs text-center border border-slate-200"
                >
                  Update Milestone
                </button>
                <button
                  onClick={() => openAction(selectedProjectModal, 'REMARK')}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold p-2.5 rounded-xl text-xs text-center border border-indigo-200"
                >
                  Add Remark
                </button>
                <button
                  onClick={() => openAction(selectedProjectModal, 'DOCUMENT')}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold p-2.5 rounded-xl text-xs text-center border border-blue-200"
                >
                  Upload Document
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const pid = selectedProjectModal.projectId;
                  setSelectedProjectModal(null);
                  navigate(`/project-agency/map?projectId=${pid}`);
                }}
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-2 transition"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>View on GIS Map</span>
              </button>

              <button
                onClick={() => setSelectedProjectModal(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modals */}
      {activeActionModal && selectedProjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wide">
                  {selectedProjectModal.projectId} • {selectedProjectModal.name}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {activeActionModal === 'PROGRESS' && 'Update Project Execution Velocity'}
                  {activeActionModal === 'REMARK' && 'Add Implementation Observation'}
                  {activeActionModal === 'DOCUMENT' && 'Upload Project Document'}
                  {activeActionModal === 'ISSUE' && 'Report Project Roadblock / Issue'}
                </h3>
              </div>
              <button
                onClick={() => setActiveActionModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            {activeActionModal === 'PROGRESS' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cumulative Progress Percentage (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.progress || ''}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Execution Remarks / Site Log:</label>
                  <textarea
                    rows={3}
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Enter physical progress updates, contractor handover details..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {activeActionModal === 'REMARK' && (
              <div className="space-y-3 text-xs">
                <label className="font-bold text-slate-700 block mb-1">Implementation Note:</label>
                <textarea
                  rows={4}
                  value={formData.remark || ''}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="Record site inspection notes, contractor coordination..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                />
              </div>
            )}

            {activeActionModal === 'DOCUMENT' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Document Title:</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Utility Shifting Estimation Drawing"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Document Type:</label>
                  <select
                    value={formData.type || 'Field Report'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="DPR">Detailed Project Report (DPR)</option>
                    <option value="Field Report">Field / Technical Report</option>
                    <option value="Gazette">Gazette Notification</option>
                    <option value="Utility NOC">Utility Shifting NOC</option>
                    <option value="Site Photo">Site Drone / Ortho Image</option>
                  </select>
                </div>
              </div>
            )}

            {activeActionModal === 'ISSUE' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Roadblock / Issue Title:</label>
                  <input
                    type="text"
                    value={formData.issue || ''}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    placeholder="e.g. 400kV Power Line Foundation Inside ROW"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Priority:</label>
                    <select
                      value={formData.priority || 'HIGH'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="CRITICAL">Critical (Halts Civil Work)</option>
                      <option value="HIGH">High (Clearance Pending)</option>
                      <option value="MEDIUM">Medium</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Chainage / Parcel:</label>
                    <input
                      type="text"
                      value={formData.parcelCase || ''}
                      onChange={(e) => setFormData({ ...formData, parcelCase: e.target.value })}
                      placeholder="e.g. Khasra 102 / Ch. 14+200"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Detailed Description:</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the bottleneck, required department coordination..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveActionModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleActionSubmit}
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
              >
                {submitting ? 'Saving...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AgencyProjectsPage = () => (
  <ErrorBoundary>
    <AgencyProjectsContent />
  </ErrorBoundary>
);

export default AgencyProjectsPage;
