import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchAgencyMilestonesApi,
  fetchAgencyProjectsApi,
  updateAgencyMilestoneApi,
} from '../../services/api/agencyApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  TrendingUp,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Edit3,
  Building2,
  ChevronRight,
} from 'lucide-react';

const AgencyProgressContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProject = searchParams.get('projectId');

  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(urlProject || 'ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [ms, prjs] = await Promise.all([
        fetchAgencyMilestonesApi(selectedProject),
        fetchAgencyProjectsApi(),
      ]);
      if (Array.isArray(ms)) setMilestones(ms);
      if (Array.isArray(prjs)) setProjects(prjs);
    } catch (err) {
      console.error('Error loading milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProject]);

  const defaultMilestones = [
    { id: 'MS-001', projectId: 'PRJ-001', milestone: 'Section 3A Requisition Alignment Finalization', plannedDate: '2024-03-15', actualDate: '2024-03-10', progress: 100.0, status: 'COMPLETED', remarks: 'Joint survey verified with Revenue Inspector & CALA' },
    { id: 'MS-002', projectId: 'PRJ-001', milestone: 'Joint Measurement Verification (JMV) 100% Boundary Demarcation', plannedDate: '2024-08-30', actualDate: '2024-09-15', progress: 100.0, status: 'COMPLETED', remarks: 'All 124 pegs established across Nagla and Fatehabad' },
    { id: 'MS-003', projectId: 'PRJ-001', milestone: 'Section 19 Declaration & CALA Competent Sanction', plannedDate: '2025-02-28', actualDate: '2025-02-20', progress: 100.0, status: 'COMPLETED', remarks: 'Published in District Gazette & National Dailies' },
    { id: 'MS-004', projectId: 'PRJ-001', milestone: 'Utility Shifting (400kV Power Transmission Lines)', plannedDate: '2025-11-30', actualDate: '2026-02-15', progress: 65.0, status: 'DELAYED', remarks: 'UPPTCL tower foundation relocation ongoing between Ch. 14+200 to 14+500' },
    { id: 'MS-005', projectId: 'PRJ-001', milestone: 'Civil Contractor Physical Site Possession Handover', plannedDate: '2026-06-30', actualDate: '—', progress: 45.0, status: 'IN_PROGRESS', remarks: '84 parcels handed over to L&T Infrastructure; 40 in progress' },
    { id: 'MS-006', projectId: 'PRJ-001', milestone: 'Main Carriageway Paving & Commercial Traffic Commissioning', plannedDate: '2027-03-31', actualDate: '—', progress: 15.0, status: 'PLANNED', remarks: 'Earthwork and drainage culverts in progress' },
  ];

  const list = milestones.length > 0 ? milestones : defaultMilestones;

  const filtered = list.filter((m) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        m.milestone?.toLowerCase().includes(q) ||
        m.projectId?.toLowerCase().includes(q) ||
        m.remarks?.toLowerCase().includes(q) ||
        m.status?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openEditModal = (m) => {
    setEditingMilestone(m);
    setEditFormData({
      progress: m.progress,
      status: m.status,
      actualDate: m.actualDate === '—' ? '' : m.actualDate,
      remarks: m.remarks,
    });
  };

  const handleUpdateMilestone = async () => {
    if (!editingMilestone) return;
    setSubmitting(true);
    try {
      await updateAgencyMilestoneApi(editingMilestone.id, {
        progress: parseFloat(editFormData.progress || 0),
        status: editFormData.status || 'IN_PROGRESS',
        actualDate: editFormData.actualDate || '—',
        remarks: editFormData.remarks || 'Updated by PIA.',
      });
      setEditingMilestone(null);
      await loadData();
    } catch (err) {
      console.error('Error updating milestone:', err);
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
              <TrendingUp className="w-3.5 h-3.5 text-cyan-700" />
              <span>Implementation Milestones & Delivery</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Live Progress Tracking</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            <span>Project Milestones & Physical Progress</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track statutory gazette notifications, joint boundary surveys, contractor site possession, and commissioning milestones.
          </p>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-cyan-700">Total Milestones</div>
          <div className="text-xl font-black text-cyan-900">{list.length} Milestones</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Project Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Assigned Project:</span>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSearchParams(e.target.value === 'ALL' ? {} : { projectId: e.target.value });
              }}
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

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search milestone title, remarks, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Milestones
        </div>
      </div>

      {/* Milestones Table Matching Exact Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Milestone</th>
                <th className="py-3.5 px-4">Planned Date</th>
                <th className="py-3.5 px-4">Actual Date</th>
                <th className="py-3.5 px-4 min-w-[140px]">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 max-w-sm">Remarks</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-cyan-50/30 transition">
                  <td className="py-4 px-4 max-w-md">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-black bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-100">
                        {m.projectId}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{m.id}</span>
                    </div>
                    <span className="font-black text-slate-900 block">{m.milestone}</span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                    {m.plannedDate}
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px]">
                    <span
                      className={`font-bold ${
                        m.actualDate === '—'
                          ? 'text-slate-400'
                          : m.actualDate > m.plannedDate
                          ? 'text-rose-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {m.actualDate}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-black text-slate-900">{m.progress}%</span>
                      <span className="text-slate-400 font-normal">Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          m.progress >= 100
                            ? 'bg-emerald-500'
                            : m.status === 'DELAYED'
                            ? 'bg-rose-500'
                            : 'bg-cyan-600'
                        }`}
                        style={{ width: `${Math.min(m.progress, 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : m.status === 'DELAYED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {m.status?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 max-w-sm">
                    <span className="text-slate-600 line-clamp-2">{m.remarks}</span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => openEditModal(m)}
                      className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Milestone Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wide">
                  {editingMilestone.projectId} • {editingMilestone.id}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Update Milestone Progress
                </h3>
              </div>
              <button
                onClick={() => setEditingMilestone(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Milestone Name:</label>
                <div className="p-2.5 bg-slate-100 rounded-xl font-bold text-slate-800">
                  {editingMilestone.milestone}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Progress (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={editFormData.progress || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, progress: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status:</label>
                  <select
                    value={editFormData.status || 'IN_PROGRESS'}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Actual Completion Date:</label>
                <input
                  type="date"
                  value={editFormData.actualDate || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, actualDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Remarks / Handover Details:</label>
                <textarea
                  rows={3}
                  value={editFormData.remarks || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                  placeholder="Enter physical progress updates, civil milestones achieved..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingMilestone(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleUpdateMilestone}
                className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
              >
                {submitting ? 'Saving...' : 'Save Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AgencyProgressPage = () => (
  <ErrorBoundary>
    <AgencyProgressContent />
  </ErrorBoundary>
);

export default AgencyProgressPage;
