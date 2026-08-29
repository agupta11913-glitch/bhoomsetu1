import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchDistrictEscalationsApi,
  createDistrictEscalationApi,
  actionDistrictEscalationApi,
  updateDistrictEscalationStatusApi,
  addDistrictEscalationRemarkApi,
  forwardDistrictEscalationApi,
  escalateToStateDistrictEscalationApi,
  resolveDistrictEscalationApi,
} from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  AlertTriangle,
  Gavel,
  CheckCircle2,
  X,
  Send,
  Clock,
  Building2,
  FileText,
  Share2,
  Save,
  Plus,
  Search,
  Eye,
  Edit3,
  Map,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

const STATUS_TABS = [
  { key: 'ALL', label: 'All Escalations' },
  { key: 'NEW', label: 'New' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'FORWARDED', label: 'Forwarded' },
  { key: 'RESOLVED', label: 'Resolved' },
];

const DistrictEscalationsContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const navigate = useNavigate();

  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  // Active Modals State
  const [selectedEsc, setSelectedEsc] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'VIEW' | 'CREATE' | 'REMARK' | 'STATUS' | 'FORWARD' | 'ESCALATE_STATE' | 'RESOLVE'

  // Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('Delhi–Meerut Expressway Expansion (NH-348)');
  const [newProjectId, setNewProjectId] = useState('PRJ-001');
  const [newCaseId, setNewCaseId] = useState('CAS-2026-001');
  const [newKhasra, setNewKhasra] = useState('101');
  const [newAuthority, setNewAuthority] = useState('District Magistrate & Collectorate');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newReason, setNewReason] = useState('');
  const [newActionReq, setNewActionReq] = useState('');

  const [remarkText, setRemarkText] = useState('');
  const [targetStatus, setTargetStatus] = useState('UNDER_REVIEW');
  const [targetDept, setTargetDept] = useState('State Forest Department (UP)');
  const [submitting, setSubmitting] = useState(false);

  const loadEsc = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictEscalationsApi(currentUser?.district || 'Agra', activeTab);
      if (Array.isArray(data)) setEscalations(data);
    } catch (err) {
      console.error('Error fetching escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEsc();
  }, [currentUser, activeTab]);

  const filteredEscalations = escalations.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      (e.id && e.id.toLowerCase().includes(term)) ||
      (e.title && e.title.toLowerCase().includes(term)) ||
      (e.project && e.project.toLowerCase().includes(term)) ||
      (e.caseId && e.caseId.toLowerCase().includes(term)) ||
      (e.khasraNumber && e.khasraNumber.toLowerCase().includes(term)) ||
      (e.fromOfficer && e.fromOfficer.toLowerCase().includes(term)) ||
      (e.currentAuthority && e.currentAuthority.toLowerCase().includes(term)) ||
      (e.reason && e.reason.toLowerCase().includes(term))
    );
  });

  const handleOpenModal = (esc, mode) => {
    setSelectedEsc(esc);
    setModalMode(mode);
    setRemarkText('');
    if (esc) {
      setTargetStatus(esc.status || 'UNDER_REVIEW');
      setTargetDept(esc.currentAuthority || 'State Forest Department (UP)');
    }
  };

  const handleCloseModal = () => {
    setSelectedEsc(null);
    setModalMode(null);
  };

  // 1. Create New Escalation
  const handleCreateEscalation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: newTitle,
        issue: newTitle,
        project: newProject,
        projectId: newProjectId,
        caseId: newCaseId,
        khasraNumber: newKhasra,
        currentAuthority: newAuthority,
        priority: newPriority,
        reason: newReason,
        actionRequired: newActionReq,
        fromOfficer: currentUser?.name || 'District Authority',
      };
      const res = await createDistrictEscalationApi(payload);
      if (res.success) {
        setActionSuccess(`Escalation ${res.id} registered successfully.`);
        handleCloseModal();
        setNewTitle('');
        setNewReason('');
        setNewActionReq('');
        loadEsc();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Add Remark
  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!selectedEsc || !remarkText.trim()) return;
    setSubmitting(true);
    try {
      const res = await addDistrictEscalationRemarkApi(selectedEsc.id, { remark: remarkText.trim() });
      if (res.success) {
        setActionSuccess(`Remark attached to Escalation ${selectedEsc.id}.`);
        handleCloseModal();
        loadEsc();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Update Status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedEsc) return;
    setSubmitting(true);
    try {
      const res = await updateDistrictEscalationStatusApi(selectedEsc.id, {
        status: targetStatus,
        remarks: remarkText || 'Status changed from Collectorate management desk.',
      });
      if (res.success) {
        setActionSuccess(`Escalation ${selectedEsc.id} status updated to ${targetStatus}.`);
        handleCloseModal();
        loadEsc();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Forward Escalation to Dept
  const handleForwardDept = async (e) => {
    e.preventDefault();
    if (!selectedEsc) return;
    setSubmitting(true);
    try {
      const res = await forwardDistrictEscalationApi(selectedEsc.id, {
        department: targetDept,
        remarks: remarkText || 'Forwarded for inter-departmental determination.',
      });
      if (res.success) {
        setActionSuccess(`Escalation ${selectedEsc.id} forwarded to ${targetDept}.`);
        handleCloseModal();
        loadEsc();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Escalate to State
  const handleEscalateToState = async (e) => {
    e.preventDefault();
    if (!selectedEsc) return;
    setSubmitting(true);
    try {
      const res = await escalateToStateDistrictEscalationApi(selectedEsc.id, {
        remarks: remarkText || 'Collectorate requisition forwarded to State High-Level Infrastructure Committee.',
      });
      if (res.success) {
        setActionSuccess(`Escalation ${selectedEsc.id} escalated to State Government successfully!`);
        handleCloseModal();
        loadEsc();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Resolve Escalation
  const handleResolveEscalation = async (e) => {
    e.preventDefault();
    if (!selectedEsc) return;
    setSubmitting(true);
    try {
      const res = await resolveDistrictEscalationApi(selectedEsc.id, {
        remarks: remarkText || 'Collectorate quasi-judicial / executive resolution order passed.',
      });
      if (res.success) {
        setActionSuccess(`Escalation ${selectedEsc.id} marked as RESOLVED.`);
        handleCloseModal();
        loadEsc();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider">
              Executive Governance
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>District High-Level Escalations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage high-priority bottlenecks, policy waivers, court stays, and inter-agency issues requiring Collectorate or State intervention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission(DISTRICT_PERMISSIONS.MANAGE_ESCALATIONS) && (
            <button
              onClick={() => handleOpenModal(null, 'CREATE')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Escalation</span>
            </button>
          )}
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Active Cases</span>
            <strong className="text-xl font-black text-rose-700">{filteredEscalations.length} Cases</strong>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-gov flex items-center gap-1.5 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, title, project, case, officer, authority..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold hidden sm:inline">
          Showing {filteredEscalations.length} Escalations
        </span>
      </div>

      {/* Escalation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEscalations.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-gov space-y-4 flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    {e.id}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      e.priority === 'CRITICAL'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {e.priority} Priority
                  </span>
                </div>

                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    e.status === 'RESOLVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : e.status === 'FORWARDED_TO_STATE'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {e.status}
                </span>
              </div>

              {/* Title & Case Links */}
              <div>
                <h3 className="text-base font-black text-slate-900 leading-snug">{e.title || e.issue}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Corridor:</strong> {e.project} • <strong>Case:</strong> {e.caseId} (Khasra #{e.khasraNumber})
                </p>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-700">
                <div><strong>Raised By:</strong> {e.fromOfficer || e.raisedBy}</div>
                <div><strong>Current Authority:</strong> {e.currentAuthority}</div>
                <div><strong>Date Raised:</strong> {e.createdDate || e.dateRaised}</div>
                <div><strong>Source:</strong> {e.source || 'Direct Escalation'}</div>
              </div>

              {/* Reason Summary */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
                <strong className="text-slate-900 block">Root Cause / Reason:</strong>
                <p className="leading-relaxed">{e.reason || e.summary}</p>
              </div>

              {/* Action Required */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <strong>Mandate / Action Required:</strong>
                <p className="font-medium">{e.actionRequired || 'High-level Collectorate determination and sanction order.'}</p>
              </div>

              {/* Remarks History */}
              {e.remarks && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <strong>Remarks Trail:</strong>
                  <p className="text-[11px]">{e.remarks}</p>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenModal(e, 'VIEW')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review</span>
                </button>

                <button
                  onClick={() => navigate(`/district/map?parcelId=${encodeURIComponent(e.parcelId || e.khasraNumber || '')}`)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
                >
                  <Map className="w-3.5 h-3.5 text-purple-600" />
                  <span>Map</span>
                </button>
              </div>

              {hasPermission(DISTRICT_PERMISSIONS.MANAGE_ESCALATIONS) && e.status !== 'RESOLVED' && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleOpenModal(e, 'REMARK')}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold px-2 py-1.5 rounded-xl text-xs"
                  >
                    Add Note
                  </button>

                  <button
                    onClick={() => handleOpenModal(e, 'FORWARD')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold px-2 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Forward</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(e, 'ESCALATE_STATE')}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold px-2 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    <span>State</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(e, 'RESOLVE')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Gavel className="w-3 h-3" />
                    <span>Resolve</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}

      {/* 1. View Modal */}
      {modalMode === 'VIEW' && selectedEsc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700">{selectedEsc.id}</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Escalation Comprehensive Review</h3>
              </div>
              <button onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div><strong>Issue:</strong> {selectedEsc.title || selectedEsc.issue}</div>
                <div><strong>Project:</strong> {selectedEsc.project}</div>
                <div><strong>Related Case:</strong> {selectedEsc.caseId} (Khasra #{selectedEsc.khasraNumber})</div>
                <div><strong>Raised By:</strong> {selectedEsc.fromOfficer || selectedEsc.raisedBy}</div>
                <div><strong>Current Authority:</strong> {selectedEsc.currentAuthority}</div>
                <div><strong>Priority:</strong> {selectedEsc.priority}</div>
                <div><strong>Status:</strong> {selectedEsc.status}</div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-purple-950">
                <strong>Executive Order Mandate:</strong>
                <p>{selectedEsc.actionRequired}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <strong>Grounds / Reason:</strong>
                <p>{selectedEsc.reason || selectedEsc.summary}</p>
              </div>

              {selectedEsc.remarks && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 space-y-1">
                  <strong>Remarks History:</strong>
                  <p>{selectedEsc.remarks}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Create Escalation Modal */}
      {modalMode === 'CREATE' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateEscalation} className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Direct Intake
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">Register New District Escalation</h3>
              </div>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Escalation Subject / Issue</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. High Court stay on Section 3H compensation disbursement"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Corridor</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  >
                    <option value="Delhi–Meerut Expressway Expansion (NH-348)">Delhi–Meerut Expressway Expansion</option>
                    <option value="Agra Western Ring Road Phase-2">Agra Western Ring Road Phase-2</option>
                    <option value="Yamuna Expressway to Agra Airport Interconnect">Yamuna Expressway Interconnect</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Case / Khasra No.</label>
                  <input
                    type="text"
                    value={newCaseId}
                    onChange={(e) => setNewCaseId(e.target.value)}
                    placeholder="CAS-2026-001 / Khasra 101"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Authority</label>
                  <select
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    <option value="District Magistrate & Collectorate">District Magistrate & Collectorate</option>
                    <option value="State Infrastructure Committee & Revenue Board">State Infrastructure Committee</option>
                    <option value="Divisional Commissioner Bench (Agra Division)">Divisional Commissioner Bench</option>
                    <option value="NHAI Headquarters & Regional Office">NHAI Headquarters & Regional Office</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-rose-700"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason / Statutory Bottleneck</label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Describe root cause, stakeholder objection, or legal hindrance..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mandate / Executive Action Required</label>
                <textarea
                  rows={2}
                  value={newActionReq}
                  onChange={(e) => setNewActionReq(e.target.value)}
                  placeholder="Specific executive determination requested from the authority..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{submitting ? 'Registering...' : 'Register Escalation'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Add Remark Modal */}
      {modalMode === 'REMARK' && selectedEsc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddRemark} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add Note to Escalation Ledger</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700">Escalation: {selectedEsc.id} — {selectedEsc.title}</span>
              <textarea
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter legal observation, hearing notes, or departmental directives..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-purple-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                <Save className="w-3.5 h-3.5" />
                <span>{submitting ? 'Saving...' : 'Record Remark'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Forward to Department Modal */}
      {modalMode === 'FORWARD' && selectedEsc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleForwardDept} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Forward Escalation to Department</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Department / External Agency</label>
                <select
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                >
                  <option value="State Forest Department (UP)">State Forest Department (UP)</option>
                  <option value="Dakshinanchal Vidyut Vitran Nigam (DVVNL)">DVVNL (Electricity Shifting Cell)</option>
                  <option value="Irrigation & Water Resources Department">Irrigation & Water Resources Department</option>
                  <option value="NHAI Regional Office Lucknow">NHAI Regional Office Lucknow</option>
                  <option value="Land Acquisition Tribunal (LARRA Court)">Land Acquisition Tribunal (LARRA Court)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Directive / Forwarding Note</label>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter Collectorate instruction and statutory compliance deadline..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Forwarding...' : 'Dispatch to Department'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Escalate to State Modal */}
      {modalMode === 'ESCALATE_STATE' && selectedEsc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleEscalateToState} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Escalate to State Government</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                <div><strong>Escalation:</strong> {selectedEsc.id} — {selectedEsc.title}</div>
                <div><strong>Project:</strong> {selectedEsc.project}</div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">State Requisition Rationale</label>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter policy clarification request, cabinet waiver requirement, or state committee agenda note..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Escalate to State Board'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Resolve Escalation Modal */}
      {modalMode === 'RESOLVE' && selectedEsc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleResolveEscalation} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Pass Collectorate Resolution Order</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                <div><strong>Escalation:</strong> {selectedEsc.id} — {selectedEsc.title}</div>
                <div><strong>Action Required:</strong> {selectedEsc.actionRequired}</div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Statutory Determination / Final Order</label>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter final order number, court deposit confirmation, or statutory sanction terms..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                <Gavel className="w-3.5 h-3.5" />
                <span>{submitting ? 'Recording...' : 'Pass Resolution Order'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const DistrictEscalationsPage = () => (
  <ErrorBoundary>
    <DistrictEscalationsContent />
  </ErrorBoundary>
);

export default DistrictEscalationsPage;
