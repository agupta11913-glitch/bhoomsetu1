import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchDistrictDelayedCasesApi,
  actionDistrictDelayedCaseApi,
  addDistrictDelayedRemarkApi,
  updateDistrictDelayedStatusApi,
  updateDistrictDelayedReasonApi,
  forwardDistrictDelayedCaseApi,
  escalateDistrictDelayedCaseApi,
} from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  Building2,
  ChevronRight,
  Send,
  X,
  CheckCircle2,
  Save,
  ShieldAlert,
  Layers,
  MapPin,
  Banknote,
  Users,
  MessageSquareWarning,
  Edit3,
  Share2,
  Eye,
  Filter,
  ArrowRight,
  Map,
  FileText,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'ALL', label: 'All Delayed Workflows', icon: Clock },
  { key: 'DELAYED_PROJECT', label: 'Delayed Projects', icon: Layers },
  { key: 'DELAYED_ACQUISITION', label: 'Delayed Acquisition', icon: FileCheck },
  { key: 'PENDING_VERIFICATION', label: 'Pending Verification', icon: MapPin },
  { key: 'PENDING_COMPENSATION', label: 'Pending Compensation', icon: Banknote },
  { key: 'PENDING_RNR', label: 'Pending R&R', icon: Users },
  { key: 'OVERDUE_OBJECTION', label: 'Overdue Objections', icon: MessageSquareWarning },
];

const DistrictDelayedCasesContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const navigate = useNavigate();

  const [delayedCases, setDelayedCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  // Active Modals State
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'VIEW' | 'REMARK' | 'STATUS' | 'REASON' | 'FORWARD' | 'ESCALATE'

  // Form states
  const [remarkText, setRemarkText] = useState('');
  const [statusVal, setStatusVal] = useState('IN_PROGRESS');
  const [delayReasonVal, setDelayReasonVal] = useState('');
  const [forwardOfficer, setForwardOfficer] = useState('Tehsildar Fatehabad');
  const [escalateAuthority, setEscalateAuthority] = useState('State Infrastructure Committee & Revenue Board');
  const [escalatePriority, setEscalatePriority] = useState('CRITICAL');
  const [escalateRemarks, setEscalateRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadDelayed = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictDelayedCasesApi(currentUser?.district || 'Agra', activeCategory);
      if (Array.isArray(data)) setDelayedCases(data);
    } catch (err) {
      console.error('Error fetching delayed cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDelayed();
  }, [currentUser, activeCategory]);

  const filteredCases = delayedCases.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      (d.caseId && d.caseId.toLowerCase().includes(term)) ||
      (d.project && d.project.toLowerCase().includes(term)) ||
      (d.ownerName && d.ownerName.toLowerCase().includes(term)) ||
      (d.khasraNumber && d.khasraNumber.toLowerCase().includes(term)) ||
      (d.responsibleOfficer && d.responsibleOfficer.toLowerCase().includes(term)) ||
      (d.stage && d.stage.toLowerCase().includes(term)) ||
      (d.delayReason && d.delayReason.toLowerCase().includes(term))
    );
  });

  const handleOpenModal = (item, mode) => {
    setSelectedCase(item);
    setModalMode(mode);
    setRemarkText('');
    setStatusVal(item.currentStatus || 'IN_PROGRESS');
    setDelayReasonVal(item.delayReason || '');
    setForwardOfficer(item.responsibleOfficer || 'Tehsildar Fatehabad');
    setEscalateAuthority('State Infrastructure Committee & Revenue Board');
    setEscalatePriority(item.priority || 'CRITICAL');
    setEscalateRemarks(`SLA threshold breached by ${item.daysDelayed} days on stage: ${item.stage}. Immediate higher intervention required.`);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
    setModalMode(null);
  };

  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!selectedCase || !remarkText.trim()) return;
    setSubmitting(true);
    try {
      const res = await addDistrictDelayedRemarkApi(selectedCase.caseId, { remark: remarkText.trim() });
      if (res.success) {
        setActionNotice(`Mitigation remark recorded for ${selectedCase.caseId}.`);
        handleCloseModal();
        loadDelayed();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    setSubmitting(true);
    try {
      const res = await updateDistrictDelayedStatusApi(selectedCase.caseId, {
        status: statusVal,
        remarks: remarkText || 'Status updated from SLA monitoring desk.',
      });
      if (res.success) {
        setActionNotice(`Status updated to ${statusVal} for ${selectedCase.caseId}.`);
        handleCloseModal();
        loadDelayed();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReason = async (e) => {
    e.preventDefault();
    if (!selectedCase || !delayReasonVal.trim()) return;
    setSubmitting(true);
    try {
      const res = await updateDistrictDelayedReasonApi(selectedCase.caseId, { delayReason: delayReasonVal.trim() });
      if (res.success) {
        setActionNotice(`Delay root cause updated for ${selectedCase.caseId}.`);
        handleCloseModal();
        loadDelayed();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForward = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    setSubmitting(true);
    try {
      const res = await forwardDistrictDelayedCaseApi(selectedCase.caseId, {
        officer: forwardOfficer,
        remarks: remarkText || 'Statutory SLA compliance notice forwarded by Collectorate.',
      });
      if (res.success) {
        setActionNotice(`Notice forwarded to ${forwardOfficer} for ${selectedCase.caseId}.`);
        handleCloseModal();
        loadDelayed();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    setSubmitting(true);
    try {
      const payload = {
        title: `[SLA Delay] ${selectedCase.caseId} - ${selectedCase.stage}`,
        project: selectedCase.project,
        projectId: selectedCase.projectId || 'PRJ-001',
        caseId: selectedCase.caseId,
        khasraNumber: selectedCase.khasraNumber,
        currentAuthority: escalateAuthority,
        priority: escalatePriority,
        reason: delayReasonVal || selectedCase.delayReason,
        remarks: escalateRemarks,
      };
      const res = await escalateDistrictDelayedCaseApi(selectedCase.caseId, payload);
      if (res.success) {
        setActionNotice(`Delayed Case ${selectedCase.caseId} successfully escalated! Generated Escalation ID: ${res.escalationId}`);
        handleCloseModal();
        loadDelayed();
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
              Statutory SLA Monitoring
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Clock className="w-6 h-6 text-rose-600" />
            <span>Delayed Projects & Statutory Workflows</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time SLA calculation identifying overdue tasks in Land Acquisition, Demarcation, PFMS DBT, R&R and Section 15 Objections.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total SLA Breached</span>
          <strong className="text-xl font-black text-rose-700">{filteredCases.length} Workflows Overdue</strong>
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

      {/* Category Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-gov flex items-center gap-1.5 overflow-x-auto">
        {CATEGORIES.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition ${
                isActive
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by case ID, khasra, owner, stage, or officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold hidden sm:inline">
          Showing {filteredCases.length} items
        </span>
      </div>

      {/* Delayed Cards List */}
      <div className="space-y-4">
        {filteredCases.map((d) => (
          <div
            key={d.id || d.caseId}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md transition space-y-4"
          >
            {/* Top Row: IDs, Stage & Delay Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {d.caseId}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {d.categoryLabel || d.category}
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Stage: {d.stage}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{d.daysDelayed} Days Overdue (Limit: {d.statutoryLimitDays}d)</span>
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                    d.priority === 'CRITICAL'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {d.priority} Priority
                </span>
              </div>
            </div>

            {/* Middle Grid: Case, Owner, Officer, Reason */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Corridor & Land Unit</span>
                <h4 className="font-black text-slate-900">{d.project}</h4>
                <p className="text-slate-600">
                  Khasra #{d.khasraNumber} • {d.ownerName}
                </p>
                <p className="text-slate-400 text-[11px]">{d.village} Village, {d.tehsil} Tehsil</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Responsible Officer / Due Date</span>
                <strong className="text-slate-900 block">{d.responsibleOfficer}</strong>
                <p className="text-slate-500">{d.department}</p>
                <p className="text-[11px] text-slate-600">
                  Statutory Due Date: <span className="font-bold text-rose-700">{d.dueDate}</span>
                </p>
              </div>

              <div className="space-y-1 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                <span className="text-rose-900 font-bold block text-[10px] uppercase">Root Cause Bottleneck</span>
                <p className="text-rose-800 font-medium leading-relaxed">{d.delayReason}</p>
                {d.mitigationStatus && (
                  <span className="text-[10px] font-bold text-purple-700 block mt-1">
                    Mitigation: {d.mitigationStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(d, 'VIEW')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => navigate(`/district/map?parcelId=${encodeURIComponent(d.parcelId || d.khasraNumber)}`)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                >
                  <Map className="w-3.5 h-3.5 text-purple-600" />
                  <span>View on Map</span>
                </button>
              </div>

              {/* District Officer Action Toolset */}
              {hasPermission(DISTRICT_PERMISSIONS.ACTION_DELAYED_CASES) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleOpenModal(d, 'REMARK')}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Add Remark</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(d, 'STATUS')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <span>Update Status</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(d, 'REASON')}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <span>Edit Reason</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(d, 'FORWARD')}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Forward</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(d, 'ESCALATE')}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>🚨 Escalate to Authority</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ACTION MODALS */}

      {/* 1. View Details Modal */}
      {modalMode === 'VIEW' && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700">{selectedCase.caseId}</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Statutory Delay Dossier</h3>
              </div>
              <button onClick={handleCloseModal} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div><strong>Corridor Project:</strong> {selectedCase.project}</div>
                <div><strong>Statutory Stage:</strong> {selectedCase.stage}</div>
                <div><strong>Khasra Number:</strong> #{selectedCase.khasraNumber} ({selectedCase.ownerName})</div>
                <div><strong>Location:</strong> {selectedCase.village} Village, {selectedCase.tehsil} Tehsil</div>
                <div><strong>Responsible Officer:</strong> {selectedCase.responsibleOfficer} ({selectedCase.department})</div>
                <div><strong>Statutory SLA Limit:</strong> {selectedCase.statutoryLimitDays} Days (Current Delay: <span className="text-rose-600 font-bold">{selectedCase.daysDelayed} Days</span>)</div>
                <div><strong>Statutory Due Date:</strong> {selectedCase.dueDate}</div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1 text-rose-900">
                <strong>Bottleneck Root Cause:</strong>
                <p>{selectedCase.delayReason}</p>
              </div>

              {selectedCase.remarks && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950">
                  <strong>Mitigation Remarks Log:</strong> {selectedCase.remarks}
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

      {/* 2. Add Remark Modal */}
      {modalMode === 'REMARK' && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddRemark} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add Mitigation Remark</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700">Case: {selectedCase.caseId} (Khasra #{selectedCase.khasraNumber})</span>
              <textarea
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter Collectorate observation, mitigation instruction, or verification update..."
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

      {/* 3. Update Status Modal */}
      {modalMode === 'STATUS' && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateStatus} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Update Workflow Status</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Workflow Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                >
                  <option value="IN_PROGRESS">IN_PROGRESS (Mitigation Underway)</option>
                  <option value="EXPEDITED_BY_DM">EXPEDITED_BY_DM (Directive Issued)</option>
                  <option value="HELD_FOR_HEARING">HELD_FOR_HEARING (Scheduled for Session)</option>
                  <option value="RESOLVED">RESOLVED (SLA Compliance Met)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Reason for status change..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
                <span>{submitting ? 'Updating...' : 'Update Status'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Edit Delay Reason Modal */}
      {modalMode === 'REASON' && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateReason} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Record Root Cause / Delay Reason</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">Official Delay Root Cause Description</label>
              <textarea
                rows={3}
                value={delayReasonVal}
                onChange={(e) => setDelayReasonVal(e.target.value)}
                placeholder="Enter root cause, external agency delay, or court stay reason..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={handleCloseModal} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
                <span>{submitting ? 'Saving...' : 'Update Delay Reason'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Forward Notice Modal */}
      {modalMode === 'FORWARD' && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleForward} className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Forward Statutory Notice</h3>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Officer / Department</label>
                <select
                  value={forwardOfficer}
                  onChange={(e) => setForwardOfficer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                >
                  <option value="Tehsildar Fatehabad">Tehsildar Fatehabad</option>
                  <option value="Revenue Inspector (Field CALA)">Revenue Inspector (Field CALA)</option>
                  <option value="Sub-Divisional Magistrate (SDM)">Sub-Divisional Magistrate (SDM)</option>
                  <option value="Executive Engineer (NHAI PIU Agra)">Executive Engineer (NHAI PIU Agra)</option>
                  <option value="CALA Disbursal Officer (Treasury)">CALA Disbursal Officer (Treasury)</option>
                  <option value="State Forest Department (DFO Agra)">State Forest Department (DFO Agra)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Directive / Requisition Text</label>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter compliance timeline, statutory warning, or field instruction..."
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
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Dispatching...' : 'Dispatch Notice'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Escalate to Authority Modal (Delayed -> Escalation Bridge) */}
      {modalMode === 'ESCALATE' && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleEscalate} className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Authority Escalation Bridge
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Escalate Case #{selectedCase.caseId} to Higher Authority
                </h3>
              </div>
              <button type="button" onClick={handleCloseModal} className="p-1 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div><strong>Corridor:</strong> {selectedCase.project}</div>
                <div><strong>Delayed Stage:</strong> {selectedCase.stage} ({selectedCase.daysDelayed} Days Overdue)</div>
                <div><strong>Khasra:</strong> #{selectedCase.khasraNumber} • {selectedCase.ownerName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Higher Authority</label>
                  <select
                    value={escalateAuthority}
                    onChange={(e) => setEscalateAuthority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    <option value="State Infrastructure Committee & Revenue Board">State Infrastructure Committee & Revenue Board</option>
                    <option value="Divisional Commissioner Bench (Agra Division)">Divisional Commissioner Bench (Agra Division)</option>
                    <option value="District Magistrate Special Hearing Bench">District Magistrate Special Hearing Bench</option>
                    <option value="NHAI Headquarters & Ministry of MoRTH">NHAI Headquarters & Ministry of MoRTH</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Escalation Priority</label>
                  <select
                    value={escalatePriority}
                    onChange={(e) => setEscalatePriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-rose-700"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate Attention)</option>
                    <option value="HIGH">HIGH (Standard Escalation)</option>
                    <option value="MEDIUM">MEDIUM (Administrative Review)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Grounds / Escalation Memorandum</label>
                <textarea
                  rows={3}
                  value={escalateRemarks}
                  onChange={(e) => setEscalateRemarks(e.target.value)}
                  placeholder="State detailed rationale, statutory bottleneck, and requested higher authority decision..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
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
                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Register Official Escalation'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const DistrictDelayedCasesPage = () => (
  <ErrorBoundary>
    <DistrictDelayedCasesContent />
  </ErrorBoundary>
);

export default DistrictDelayedCasesPage;
