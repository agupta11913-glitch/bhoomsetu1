import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchStateEscalationsApi,
  addStateEscalationRemarkApi,
  forwardStateEscalationApi,
  escalateStateToChiefSecretaryApi,
  updateStateEscalationStatusApi,
} from '../../services/api/stateApi';
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
  ExternalLink,
  ChevronRight,
  Send,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

const StateEscalationsContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [escalations, setEscalations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'VIEW', 'REMARK', 'FORWARD', 'ESCALATE', 'STATUS'
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  const loadEscalations = async () => {
    try {
      const data = await fetchStateEscalationsApi(stateName, statusFilter);
      if (Array.isArray(data)) setEscalations(data);
    } catch (err) {
      console.error('Error loading state escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEscalations();
  }, [stateName, statusFilter]);

  const defaultEscalations = [
    { id: 'ESC-UP-001', issue: 'High Court Interim Stay on Feeder Node Corridor Section 19 Declaration', project: 'Ganga Expressway Feeder Node & Logistics Spur', projectId: 'PRJ-012', district: 'Prayagraj', priority: 'CRITICAL', status: 'UNDER_REVIEW', date: '2026-08-15', raisedBy: 'District Magistrate Prayagraj', currentAuthority: 'State Infrastructure Committee & High Court Cell', reason: 'Interim stay granted by Hon\'ble High Court over multi-crop fertile land acquisition challenge.', actionRequired: 'File special leave counter-affidavit with revised environmental buffer zone.' },
    { id: 'ESC-UP-002', issue: 'Inter-Departmental Forest Stage-II Clearance Bottleneck for Power Utility Shifting', project: 'Agra Western Ring Road Phase-2', projectId: 'PRJ-002', district: 'Agra', priority: 'HIGH', status: 'NEW', date: '2026-08-20', raisedBy: 'Competent Authority (CALA) Agra', currentAuthority: 'Principal Chief Conservator of Forests (PCCF), UP', reason: 'Stage-II clearance pending for 14.8 hectares of reserved forest land diversion.', actionRequired: 'Expedite state forest advisory council recommendation to MoEFCC.' },
    { id: 'ESC-UP-003', issue: 'Gram Sabha Grazing Land Title Dispute & Compensation Trust Sanction', project: 'Lucknow Ring Road Phase-3', projectId: 'PRJ-011', district: 'Lucknow', priority: 'MEDIUM', status: 'FORWARDED', date: '2026-08-24', raisedBy: 'Special Land Acquisition Officer, Lucknow', currentAuthority: 'Board of Revenue, Uttar Pradesh', reason: 'Title determination between village panchayat community asset and recorded tenure holders.', actionRequired: 'Issue special directive for Section 64 court deposit.' },
  ];

  const list = escalations.length > 0 ? escalations : defaultEscalations;

  const filtered = list.filter((e) => {
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        e.issue?.toLowerCase().includes(q) ||
        e.project?.toLowerCase().includes(q) ||
        e.district?.toLowerCase().includes(q) ||
        e.id?.toLowerCase().includes(q) ||
        e.currentAuthority?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openActionModal = (esc, type) => {
    setSelectedEscalation(esc);
    setActiveModal(type);
    setFormData({});
  };

  const handleActionSubmit = async () => {
    if (!selectedEscalation) return;
    setSubmitting(true);
    try {
      if (activeModal === 'REMARK') {
        await addStateEscalationRemarkApi(selectedEscalation.id, {
          remark: formData.remark || 'Secretariat legal opinion noted.',
        });
      } else if (activeModal === 'FORWARD') {
        await forwardStateEscalationApi(selectedEscalation.id, {
          department: formData.department || 'State Revenue Board',
          remarks: formData.remarks || 'Forwarded for compliance verification.',
        });
      } else if (activeModal === 'ESCALATE') {
        await escalateStateToChiefSecretaryApi(selectedEscalation.id, {
          remarks: formData.remarks || 'Escalated to Apex Cabinet / Chief Secretary review.',
        });
      } else if (activeModal === 'STATUS') {
        await updateStateEscalationStatusApi(selectedEscalation.id, {
          status: formData.status || 'RESOLVED',
          remarks: formData.remarks || 'State resolution order passed.',
        });
      }
      setActiveModal(null);
      await loadEscalations();
    } catch (err) {
      console.error('Error submitting state escalation action:', err);
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
            <span className="bg-rose-50 text-rose-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>Apex State Escalations</span>
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>State Level Escalations & High-Priority Interventions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Decisive secretariat adjudication on High Court stays, inter-departmental forest/utility clearances, and critical acquisition roadblocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-rose-700">Open Escalations</div>
            <div className="text-xl font-black text-rose-900">
              {list.filter((e) => e.status !== 'RESOLVED').length} Active
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issue, project, district, or authority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="FORWARDED">Forwarded</option>
              <option value="ESCALATED_APEX">Escalated to Apex</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Escalations
        </div>
      </div>

      {/* Escalations Table Matching Required Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Issue</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-4 max-w-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {e.id}
                      </span>
                      <span className="text-[10px] text-slate-400">By: {e.raisedBy}</span>
                    </div>
                    <div className="font-black text-slate-900 line-clamp-2">{e.issue}</div>
                    {e.currentAuthority && (
                      <div className="text-[10px] text-indigo-700 mt-1 font-bold">
                        Authority: {e.currentAuthority}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {e.project}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {e.district}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        e.priority === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : e.priority === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {e.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        e.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : e.status === 'NEW'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {e.status?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                    {e.date}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openActionModal(e, 'VIEW')}
                        title="View Details"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openActionModal(e, 'REMARK')}
                        title="Add Remark"
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Add Remark
                      </button>

                      <button
                        onClick={() => openActionModal(e, 'FORWARD')}
                        title="Forward"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Forward
                      </button>

                      <button
                        onClick={() => openActionModal(e, 'ESCALATE')}
                        title="Escalate to Apex Authority"
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Escalate
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
      {activeModal && selectedEscalation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  State Escalation Action
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {activeModal === 'VIEW' && 'Escalation Details Dossier'}
                  {activeModal === 'REMARK' && 'Add State Legal / Policy Note'}
                  {activeModal === 'FORWARD' && 'Forward to Concerned Department'}
                  {activeModal === 'ESCALATE' && '🚨 Escalate to Chief Secretary / Apex Cabinet'}
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
            {activeModal === 'VIEW' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">Issue Title</span>
                  <p className="text-slate-700">{selectedEscalation.issue}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-bold block">Project</span>
                    <strong className="text-slate-800">{selectedEscalation.project}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-bold block">District</span>
                    <strong className="text-slate-800">{selectedEscalation.district}</strong>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl text-rose-950 space-y-1">
                  <span className="font-bold block">Roadblock Cause</span>
                  <p>{selectedEscalation.reason}</p>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-950 space-y-1">
                  <span className="font-bold block">Action Mandated</span>
                  <p>{selectedEscalation.actionRequired}</p>
                </div>
              </div>
            )}

            {activeModal === 'REMARK' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Enter Secretariat Ledger Observation:
                </label>
                <textarea
                  rows={4}
                  value={formData.remark || ''}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="e.g. Legal Cell instructed District Government Counsel to move urgent listing before High Court..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            )}

            {activeModal === 'FORWARD' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Department / Entity:</label>
                  <select
                    value={formData.department || 'State Revenue Board'}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="State Revenue Board">State Revenue Board (Uttar Pradesh)</option>
                    <option value="Principal Chief Conservator of Forests (PCCF)">Forest Department / PCCF</option>
                    <option value="Dakshinanchal Vidyut Vitran Nigam (DVVNL)">Power Transmission / DVVNL</option>
                    <option value="High Court Cell & Advocate General">Advocate General & HC Cell</option>
                    <option value="NHAI Regional Office Lucknow">NHAI Regional Office</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Forwarding Directive:</label>
                  <textarea
                    rows={3}
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Enter compliance timeline and forwarding instructions..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {activeModal === 'ESCALATE' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-xl text-rose-950 text-xs">
                  This will escalate the issue directly to the <strong>Chief Secretary High-Level Infrastructure Committee</strong> for inter-ministerial resolution.
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cabinet / Apex Note:</label>
                  <textarea
                    rows={4}
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Provide justification for Chief Secretary intervention..."
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
                  className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
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

export const StateEscalationsPage = () => (
  <ErrorBoundary>
    <StateEscalationsContent />
  </ErrorBoundary>
);

export default StateEscalationsPage;
