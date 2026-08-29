import React, { useState, useEffect } from 'react';
import {
  fetchAgencyIssuesApi,
  fetchAgencyProjectsApi,
  reportAgencyIssueApi,
  addAgencyIssueRemarkApi,
  forwardAgencyIssueApi,
} from '../../services/api/agencyApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  Plus,
  Send,
  MessageSquare,
} from 'lucide-react';

const AgencyIssuesContent = () => {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'VIEW' | 'REMARK' | 'FORWARD' | 'NEW'
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [iss, prjs] = await Promise.all([
        fetchAgencyIssuesApi(statusFilter),
        fetchAgencyProjectsApi(),
      ]);
      if (Array.isArray(iss)) setIssues(iss);
      if (Array.isArray(prjs)) setProjects(prjs);
    } catch (err) {
      console.error('Error loading agency issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const defaultIssues = [
    { id: 'ISSUE-PIA-001', issue: 'High-Tension Power Transmission Line Utility Shift Delay', projectId: 'PRJ-001', parcelCase: 'CASE-2026-DME-0102 / Khasra 102', priority: 'HIGH', description: 'UPPTCL 400kV line tower foundation falls inside 60m ROW corridor between Ch. 14+200 to 14+500.', status: 'IN_PROGRESS', date: '2026-08-14', assignedTo: 'UP Power Transmission Corp (UPPTCL)' },
    { id: 'ISSUE-PIA-002', issue: 'Khasra 103 Commercial Orchard Valuation Re-assessment Pending', projectId: 'PRJ-001', parcelCase: 'CASE-2026-DME-0103 / Khasra 103', priority: 'MEDIUM', description: 'Claimant submitted objection regarding fruit-bearing mango grove valuation calculation.', status: 'UNDER_REVIEW', date: '2026-08-20', assignedTo: 'SLAO Agra / Horticulture Dept' },
    { id: 'ISSUE-PIA-003', issue: 'Inter-Departmental Forest Stage-II Clearance Bottleneck', projectId: 'PRJ-002', parcelCase: 'CASE-2026-AWR-0201 / Reserved Forest 14.8 Ha', priority: 'CRITICAL', description: 'Stage-II clearance pending for 14.8 hectares of reserved forest land diversion.', status: 'OPEN', date: '2026-08-22', assignedTo: 'Principal Chief Conservator of Forests (PCCF), UP' },
    { id: 'ISSUE-PIA-004', issue: 'Gram Sabha Grazing Land Title Dispute & Compensation Trust Sanction', projectId: 'PRJ-011', parcelCase: 'CASE-2026-LRR-0301 / Khasra 88', priority: 'MEDIUM', description: 'Title determination between village panchayat community asset and recorded tenure holders.', status: 'FORWARDED', date: '2026-08-24', assignedTo: 'Board of Revenue, Uttar Pradesh' },
  ];

  const list = issues.length > 0 ? issues : defaultIssues;

  const filtered = list.filter((i) => {
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        i.issue?.toLowerCase().includes(q) ||
        i.projectId?.toLowerCase().includes(q) ||
        i.parcelCase?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openActionModal = (issue, type) => {
    setSelectedIssue(issue);
    setActiveModal(type);
    setFormData({});
  };

  const handleActionSubmit = async () => {
    setSubmitting(true);
    try {
      if (activeModal === 'NEW') {
        await reportAgencyIssueApi({
          projectId: formData.projectId || (projects[0]?.projectId || 'PRJ-001'),
          issue: formData.issue || 'Corridor Execution Roadblock',
          parcelCase: formData.parcelCase || 'Main Alignment ROW',
          priority: formData.priority || 'HIGH',
          description: formData.description || 'Roadblock reported by PIA.',
        });
      } else if (activeModal === 'REMARK' && selectedIssue) {
        await addAgencyIssueRemarkApi(selectedIssue.id, {
          remark: formData.remark || 'PIA site log note added.',
        });
      } else if (activeModal === 'FORWARD' && selectedIssue) {
        await forwardAgencyIssueApi(selectedIssue.id, {
          authority: formData.authority || 'Office of District Magistrate & CALA',
          directive: formData.directive || 'Forwarded for inter-departmental statutory resolution.',
        });
      }
      setActiveModal(null);
      await loadData();
    } catch (err) {
      console.error('Error submitting issue action:', err);
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
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Implementation Bottlenecks</span>
            </span>
            <span className="text-xs font-bold text-slate-500">PIA Escalation Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span>Project Issues & Roadblock Escalation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log, track, and forward utility shifting impediments, RoR disputes, and inter-departmental clearances to CALA and District Authorities.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedIssue(null);
            setFormData({ projectId: projects[0]?.projectId || 'PRJ-001', priority: 'HIGH' });
            setActiveModal('NEW');
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issue title, project, parcel, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="FORWARDED">Forwarded</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Project Issues
        </div>
      </div>

      {/* Issues Table Matching Exact Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Issue</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Parcel / Case</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 max-w-xs">Description</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((i) => (
                <tr key={i.id} className="hover:bg-amber-50/30 transition">
                  <td className="py-4 px-4 max-w-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-black bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                        {i.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{i.date}</span>
                    </div>
                    <span className="font-black text-slate-900 block">{i.issue}</span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-cyan-700">
                    {i.projectId}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {i.parcelCase}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        i.priority === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : i.priority === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {i.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <span className="text-slate-600 line-clamp-2">{i.description}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        i.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : i.status === 'OPEN'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {i.status?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openActionModal(i, 'VIEW')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openActionModal(i, 'REMARK')}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Add Remark
                      </button>

                      <button
                        onClick={() => openActionModal(i, 'FORWARD')}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Forward
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  {selectedIssue ? `${selectedIssue.id} • ${selectedIssue.projectId}` : 'PIA Issue Desk'}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {activeModal === 'VIEW' && 'Issue Details Dossier'}
                  {activeModal === 'REMARK' && 'Add PIA Site Observation'}
                  {activeModal === 'FORWARD' && 'Forward to District Authority / CALA'}
                  {activeModal === 'NEW' && 'Report New Project Roadblock'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {activeModal === 'VIEW' && selectedIssue && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">Issue Title</span>
                  <p className="text-slate-700">{selectedIssue.issue}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-bold block">Assigned Project</span>
                    <strong className="text-slate-800">{selectedIssue.projectId}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-bold block">Parcel / Chainage</span>
                    <strong className="text-slate-800">{selectedIssue.parcelCase}</strong>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl text-amber-950 space-y-1">
                  <span className="font-bold block">Description</span>
                  <p>{selectedIssue.description}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 space-y-1">
                  <span className="font-bold block">Assigned Nodal Authority</span>
                  <p>{selectedIssue.assignedTo || 'District Collectorate / CALA'}</p>
                </div>
              </div>
            )}

            {activeModal === 'REMARK' && selectedIssue && (
              <div className="space-y-3 text-xs">
                <label className="font-bold text-slate-700 block mb-1">Enter Site Inspection Log / Remark:</label>
                <textarea
                  rows={4}
                  value={formData.remark || ''}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="e.g. Met with UPPTCL Executive Engineer; tower foundation realignment drawing submitted..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                />
              </div>
            )}

            {activeModal === 'FORWARD' && selectedIssue && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Authority:</label>
                  <select
                    value={formData.authority || 'Office of District Magistrate & CALA'}
                    onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Office of District Magistrate & CALA">Office of the District Magistrate (CALA)</option>
                    <option value="Tehsildar & SLAO Revenue Division">Tehsildar & SLAO Revenue Division</option>
                    <option value="UP Power Transmission Corp (UPPTCL)">UP Power Transmission Corp (UPPTCL)</option>
                    <option value="Principal Chief Conservator of Forests (PCCF)">PCCF Forest & Environment Board</option>
                    <option value="State Infrastructure Coordination Committee">State Infrastructure Committee</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Directive / Action Request:</label>
                  <textarea
                    rows={3}
                    value={formData.directive || ''}
                    onChange={(e) => setFormData({ ...formData, directive: e.target.value })}
                    placeholder="Enter urgent compliance directive and clearance timeline..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {activeModal === 'NEW' && (
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
                  <label className="font-bold text-slate-700 block mb-1">Issue / Roadblock Title:</label>
                  <input
                    type="text"
                    value={formData.issue || ''}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    placeholder="e.g. Canal Crossing Forest Stage-II Clearance Pending"
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
                      <option value="CRITICAL">Critical (Halts Construction)</option>
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
                      placeholder="e.g. Ch. 18+400 / Khasra 88"
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
                    placeholder="Describe the roadblock, affected chainage, contractor impact..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
              {activeModal !== 'VIEW' && (
                <button
                  disabled={submitting}
                  onClick={handleActionSubmit}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
                >
                  {submitting ? 'Submitting...' : 'Confirm Action'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AgencyIssuesPage = () => (
  <ErrorBoundary>
    <AgencyIssuesContent />
  </ErrorBoundary>
);

export default AgencyIssuesPage;
