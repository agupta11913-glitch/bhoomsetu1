import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchDistrictCoordinationApi,
  createDistrictCoordinationApi,
  updateDistrictCoordinationStatusApi,
} from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  X,
  Building2,
  Calendar,
  Edit3,
  Bell,
  Save,
} from 'lucide-react';

const DistrictCoordinationContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [department, setDepartment] = useState('State Forest Department (UP)');
  const [project, setProject] = useState('Delhi–Meerut Expressway Expansion (NH-348)');
  const [requestDesc, setRequestDesc] = useState('');
  const [officer, setOfficer] = useState('');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [priority, setPriority] = useState('HIGH');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Status update modal
  const [selectedCoord, setSelectedCoord] = useState(null);
  const [coordStatus, setCoordStatus] = useState('IN_PROGRESS');
  const [coordRemarks, setCoordRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadCoordination = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictCoordinationApi(currentUser?.district || 'Agra');
      if (Array.isArray(data)) setRequests(data);
    } catch (err) {
      console.error('Error fetching coordination:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoordination();
  }, [currentUser]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionSuccess(null);
    try {
      const payload = {
        department,
        project,
        request: requestDesc,
        officer: officer || 'Designated Department Nodal Officer',
        deadline,
        priority,
        remarks: 'Official Collectorate notice issued for time-bound resolution.',
      };
      const res = await createDistrictCoordinationApi(payload);
      if (res.success) {
        setActionSuccess('Inter-departmental coordination notice dispatched successfully.');
        loadCoordination();
        setShowModal(false);
        setRequestDesc('');
      }
    } catch (err) {
      console.error('Create error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedCoord) return;
    setUpdatingStatus(true);
    try {
      const payload = {
        status: coordStatus,
        remarks: coordRemarks || 'Coordination status updated by Collectorate.',
      };
      const res = await updateDistrictCoordinationStatusApi(selectedCoord.id, payload);
      if (res.success) {
        setActionSuccess(`Coordination request ${selectedCoord.id} updated to ${coordStatus}.`);
        setSelectedCoord(null);
        setCoordRemarks('');
        loadCoordination();
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendReminder = async (r) => {
    try {
      const payload = {
        status: r.status,
        remarks: `${r.remarks || ''} | [Statutory Reminder Sent on ${new Date().toLocaleDateString()}]: Expeditious action requested.`,
      };
      const res = await updateDistrictCoordinationStatusApi(r.id, payload);
      if (res.success) {
        setActionSuccess(`Urgent reminder notice dispatched to ${r.department} for ${r.id}.`);
        loadCoordination();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
              Inter-Agency Coordination
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>Department Coordination & Clearances</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-departmental liaison with Forest, Electricity (DVVNL), Irrigation, PWD, and Railways for project ROW clearance.
          </p>
        </div>

        {hasPermission(DISTRICT_PERMISSIONS.MANAGE_COORDINATION) && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Coordination Notice</span>
          </button>
        )}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {r.id}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    r.status === 'RESOLVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900">{r.department}</h3>
                <p className="text-xs text-slate-500">{r.project}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <strong>Subject Matter:</strong>
                <p className="text-slate-700">{r.request}</p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div><strong>Nodal Officer:</strong> {r.officer}</div>
                <div><strong>Statutory Deadline:</strong> <span className="text-rose-600 font-bold">{r.deadline}</span></div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
              <div className="text-slate-500">
                <strong>Status Note:</strong> {r.remarks}
              </div>

              {hasPermission(DISTRICT_PERMISSIONS.MANAGE_COORDINATION) && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedCoord(r);
                      setCoordStatus(r.status);
                      setCoordRemarks(r.remarks || '');
                    }}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Update Status</span>
                  </button>

                  <button
                    onClick={() => handleSendReminder(r)}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Reminder</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Issue Department Coordination Notice</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 bg-slate-100 rounded-lg text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                >
                  <option value="State Forest Department (UP)">State Forest Department (UP)</option>
                  <option value="Dakshinanchal Vidyut Vitran Nigam (DVVNL)">Dakshinanchal Vidyut Vitran Nigam (DVVNL)</option>
                  <option value="Irrigation & Water Resources Department">Irrigation & Water Resources Department</option>
                  <option value="Public Works Department (PWD UP)">Public Works Department (PWD UP)</option>
                  <option value="North Central Railway (NCR Division)">North Central Railway (NCR Division)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Project Corridor</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clearance / Requisition Description</label>
                <textarea
                  rows={3}
                  value={requestDesc}
                  onChange={(e) => setRequestDesc(e.target.value)}
                  placeholder="Details of required tree felling, HT line shifting, canal culvert NOC..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designated Officer</label>
                  <input
                    type="text"
                    value={officer}
                    onChange={(e) => setOfficer(e.target.value)}
                    placeholder="e.g. DFO Agra / SE DVVNL"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Compliance Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Dispatching...' : 'Issue Official Notice'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedCoord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateStatus}
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Inter-Agency Status
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Update Coordination #{selectedCoord.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCoord(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clearance Status</label>
                <select
                  value={coordStatus}
                  onChange={(e) => setCoordStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="IN_PROGRESS">IN_PROGRESS (Under Review by Department)</option>
                  <option value="RESOLVED">RESOLVED (NOC / Clearance Issued)</option>
                  <option value="ACTION_REQUIRED">ACTION_REQUIRED (Joint Inspection Needed)</option>
                  <option value="HELD_FOR_POLICY">HELD_FOR_POLICY (State Level Clarification)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Collectorate Remarks / Reference Number</label>
                <textarea
                  rows={3}
                  value={coordRemarks}
                  onChange={(e) => setCoordRemarks(e.target.value)}
                  placeholder="Enter NOC reference number, joint survey outcome, or meeting notes..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCoord(null)}
                className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatingStatus}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{updatingStatus ? 'Saving...' : 'Update Status'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const DistrictCoordinationPage = () => (
  <ErrorBoundary>
    <DistrictCoordinationContent />
  </ErrorBoundary>
);

export default DistrictCoordinationPage;
