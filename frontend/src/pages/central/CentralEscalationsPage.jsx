import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchCentralEscalationsApi,
  addCentralEscalationRemarkApi,
  forwardCentralEscalationApi,
  updateCentralEscalationStatusApi,
} from '../../services/api/centralApi';
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
  Globe,
} from 'lucide-react';

const CentralEscalationsContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [escalations, setEscalations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'VIEW', 'REMARK', 'FORWARD', 'STATUS'
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadEscalations = async () => {
    try {
      const data = await fetchCentralEscalationsApi(statusFilter);
      if (Array.isArray(data)) setEscalations(data);
    } catch (err) {
      console.error('Error loading central escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEscalations();
  }, [statusFilter]);

  const defaultEscalations = [
    { id: 'ESC-NAT-001', issue: 'Stage-II Forest Clearance & Wildlife Sanctuary Buffer Diversion', state: 'Madhya Pradesh', district: 'Panna', projectId: 'PRJ-007', project: 'Ken-Betwa River Interlinking Canal Project', priority: 'CRITICAL', status: 'UNDER_REVIEW', date: '2026-08-18', raisedBy: 'PCCF Madhya Pradesh', currentAuthority: 'MoEFCC Wildlife Board & PMO Infrastructure Cell', reason: 'Stage-II forest diversion for 4,200 hectares of buffer corridor required.', actionRequired: 'Inter-ministerial meeting scheduled with MoEFCC Secretary.' },
    { id: 'ESC-NAT-002', issue: 'Inter-State Right of Way Demarcation Dispute on Western DFC Border', state: 'Haryana', district: 'Rewari', projectId: 'PRJ-002', project: 'Dedicated Freight Corridor (Western DFC)', priority: 'HIGH', status: 'NEW', date: '2026-08-21', raisedBy: 'DFCCIL Chief Project Manager', currentAuthority: 'Ministry of Railways & Revenue Board Haryana', reason: 'Border peg survey alignment mismatch between Haryana and Rajasthan boundary.', actionRequired: 'Joint survey directive issued under Chief Surveyors.' },
    { id: 'ESC-NAT-003', issue: 'Coastal Regulation Zone (CRZ-I) Clearance Roadblock for DMIC Node', state: 'Maharashtra', district: 'Raigad', projectId: 'PRJ-003', project: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', priority: 'HIGH', status: 'FORWARDED', date: '2026-08-23', raisedBy: 'NICDC Special Projects Cell', currentAuthority: 'Maharashtra Coastal Zone Management Authority', reason: 'Tidal wetland boundary notification requires apex environmental clearance.', actionRequired: 'Forwarded to State Environment Department for urgent review.' },
    { id: 'ESC-NAT-004', issue: 'High Court Interim Stay on Feeder Node Corridor Section 19 Declaration', state: 'Uttar Pradesh', district: 'Prayagraj', projectId: 'PRJ-012', project: 'Ganga Expressway Feeder Node', priority: 'CRITICAL', status: 'UNDER_REVIEW', date: '2026-08-25', raisedBy: 'UPEIDA Chief Executive', currentAuthority: 'State Infrastructure Committee & High Court Cell', reason: 'Multi-crop fertile land acquisition challenge by petitioner co-sharers.', actionRequired: 'Counter-affidavit filed; special mention listing requested.' },
    { id: 'ESC-NAT-005', issue: 'Railway Overbridge (ROB) Clearance Mismatch for EDFC-II Spur', state: 'Bihar', district: 'Rohtas', projectId: 'PRJ-010', project: 'Eastern Dedicated Freight Corridor Expansion', priority: 'MEDIUM', status: 'NEW', date: '2026-08-26', raisedBy: 'District Magistrate Rohtas', currentAuthority: 'Eastern Railway Headquarters', reason: 'Safety clearance pending for 132kV overhead high-tension line crossing.', actionRequired: 'Coordinated inspection with Power Grid Corporation.' },
  ];

  const list = escalations.length > 0 ? escalations : defaultEscalations;

  const filtered = list.filter((e) => {
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        e.issue?.toLowerCase().includes(q) ||
        e.state?.toLowerCase().includes(q) ||
        e.district?.toLowerCase().includes(q) ||
        e.project?.toLowerCase().includes(q) ||
        e.id?.toLowerCase().includes(q)
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
        await addCentralEscalationRemarkApi(selectedEscalation.id, {
          remark: formData.remark || 'PM Gati Shakti Secretariat note recorded.',
        });
      } else if (activeModal === 'FORWARD') {
        await forwardCentralEscalationApi(selectedEscalation.id, {
          ministry: formData.ministry || 'Cabinet Secretariat Infrastructure Unit',
          directive: formData.directive || 'Forwarded for inter-ministerial clearance.',
        });
      } else if (activeModal === 'STATUS') {
        await updateCentralEscalationStatusApi(selectedEscalation.id, {
          status: formData.status || 'RESOLVED',
          remarks: formData.remarks || 'National clearance granted.',
        });
      }
      setActiveModal(null);
      await loadEscalations();
    } catch (err) {
      console.error('Error submitting central escalation action:', err);
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
              <span>Federal Infrastructure Roadblocks</span>
            </span>
            <span className="text-xs font-bold text-slate-500">PM Gati Shakti Secretariat</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>State-to-Central Infrastructure Escalations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Apex resolution mechanism for inter-state boundary disputes, MoEFCC forest clearances, and critical linear corridor bottlenecks.
          </p>
        </div>

        <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-rose-700">Open Escalations</div>
          <div className="text-xl font-black text-rose-900">
            {list.filter((e) => e.status !== 'RESOLVED').length} Active
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
              placeholder="Search issue, state, district, or project..."
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
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Escalations
        </div>
      </div>

      {/* Escalations Table Matching Exact Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Issue</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Project</th>
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
                      <span className="text-[10px] text-slate-400">Raised: {e.raisedBy}</span>
                    </div>
                    <div className="font-black text-slate-900 line-clamp-2">{e.issue}</div>
                    {e.currentAuthority && (
                      <div className="text-[10px] text-indigo-700 mt-1 font-bold">
                        Nodal Forum: {e.currentAuthority}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {e.state}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {e.district}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {e.project}
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
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openActionModal(e, 'REMARK')}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Add Remark
                      </button>

                      <button
                        onClick={() => openActionModal(e, 'FORWARD')}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Forward
                      </button>

                      <button
                        onClick={() => openActionModal(e, 'STATUS')}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
                      >
                        Update Status
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
                  Central Secretariat Action
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {activeModal === 'VIEW' && 'Escalation Dossier'}
                  {activeModal === 'REMARK' && 'Add Federal Ledger Note'}
                  {activeModal === 'FORWARD' && 'Forward to Central Ministry / PMO'}
                  {activeModal === 'STATUS' && 'Update Escalation Status'}
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
                    <span className="text-slate-400 font-bold block">State</span>
                    <strong className="text-slate-800">{selectedEscalation.state}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-bold block">District</span>
                    <strong className="text-slate-800">{selectedEscalation.district}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block">Project</span>
                  <strong className="text-slate-800">{selectedEscalation.project}</strong>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl text-rose-950 space-y-1">
                  <span className="font-bold block">Bottleneck Cause</span>
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
                  Enter National Master Plan Secretariat Note:
                </label>
                <textarea
                  rows={4}
                  value={formData.remark || ''}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="e.g. Cabinet Secretary directed MoEFCC Wildlife Board to fast-track Stage-II forest clearance..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            )}

            {activeModal === 'FORWARD' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Central Ministry / Apex Committee:</label>
                  <select
                    value={formData.ministry || 'PMO Infrastructure Committee'}
                    onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="PMO Infrastructure Committee">Prime Minister's Office (PMO) Infrastructure Cell</option>
                    <option value="Ministry of Environment, Forest and Climate Change (MoEFCC)">MoEFCC Wildlife & Forest Board</option>
                    <option value="Ministry of Railways / Railway Board">Ministry of Railways / Railway Board</option>
                    <option value="Ministry of Road Transport and Highways (MoRTH)">MoRTH Projects Division</option>
                    <option value="Cabinet Secretariat Project Monitoring Group (PMG)">Cabinet Secretariat PMG</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Forwarding Directive:</label>
                  <textarea
                    rows={3}
                    value={formData.directive || ''}
                    onChange={(e) => setFormData({ ...formData, directive: e.target.value })}
                    placeholder="Enter compliance directive and target clearance timeline..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {activeModal === 'STATUS' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Resolution Status:</label>
                  <select
                    value={formData.status || 'RESOLVED'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="FORWARDED">Forwarded to Ministry</option>
                    <option value="RESOLVED">Resolved / Clearance Granted</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Resolution Remark:</label>
                  <textarea
                    rows={3}
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Enter resolution details and order sanction number..."
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

export const CentralEscalationsPage = () => (
  <ErrorBoundary>
    <CentralEscalationsContent />
  </ErrorBoundary>
);

export default CentralEscalationsPage;
