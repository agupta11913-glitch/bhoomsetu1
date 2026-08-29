import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchDistrictDisputesApi,
  escalateDistrictDisputeApi,
  resolveDistrictDisputeApi,
  addDistrictDisputeApi,
  reviewDistrictDisputeApi,
} from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  MessageSquareWarning,
  Search,
  Filter,
  AlertTriangle,
  Gavel,
  CheckCircle2,
  X,
  Share2,
  Clock,
  User,
  MapPin,
  Send,
  Plus,
  Save,
  Scale,
} from 'lucide-react';

const DistrictDisputesContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [actionModalType, setActionModalType] = useState(null); // 'RESOLVE' | 'FORWARD_TRIBUNAL' | 'ESCALATE_STATE'
  const [orderText, setOrderText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // New Dispute Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClaimant, setNewClaimant] = useState('');
  const [newKhasra, setNewKhasra] = useState('');
  const [newType, setNewType] = useState('Valuation / Circle Rate Objection');
  const [newDescription, setNewDescription] = useState('');
  const [creatingDispute, setCreatingDispute] = useState(false);

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictDisputesApi(currentUser?.district || 'Agra');
      if (Array.isArray(data)) {
        setDisputes(data);
      }
    } catch (err) {
      console.error('Error loading disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, [currentUser]);

  const filteredDisputes = disputes.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      (d.claimantName && d.claimantName.toLowerCase().includes(term)) ||
      (d.khasraNumber && d.khasraNumber.toLowerCase().includes(term)) ||
      (d.disputeId && d.disputeId.toLowerCase().includes(term)) ||
      (d.disputeType && d.disputeType.toLowerCase().includes(term))
    );
  });

  const handleAction = async () => {
    if (!selectedDispute) return;
    setSubmitting(true);
    setActionSuccess(null);
    try {
      const payload = {
        action: actionModalType,
        remarks: orderText || 'Statutory order passed by District Magistrate / Collector.',
      };
      const res = await reviewDistrictDisputeApi(selectedDispute.disputeId, payload);
      if (res.success) {
        setActionSuccess(`Dispute ${selectedDispute.disputeId} processed successfully: ${actionModalType}.`);
        loadDisputes();
        setActionModalType(null);
        setSelectedDispute(null);
      }
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDispute = async (e) => {
    e.preventDefault();
    if (!newClaimant.trim() || !newKhasra.trim()) return;
    setCreatingDispute(true);
    try {
      const payload = {
        claimantName: newClaimant.trim(),
        khasraNumber: newKhasra.trim(),
        disputeType: newType,
        description: newDescription.trim(),
      };
      const res = await addDistrictDisputeApi(payload);
      if (res.success) {
        setActionSuccess(`New dispute registered successfully under ID ${res.disputeId}.`);
        setShowAddModal(false);
        setNewClaimant('');
        setNewKhasra('');
        setNewDescription('');
        loadDisputes();
      }
    } catch (err) {
      console.error('Error creating dispute:', err);
    } finally {
      setCreatingDispute(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Quasi-Judicial Adjudication
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-amber-600" />
            <span>Section 15 Citizen Objections & Disputes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Collectorate quasi-judicial hearing registry for land valuation disputes, LARRA Section 64 tribunal references, and co-sharer claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission(DISTRICT_PERMISSIONS.REVIEW_DISPUTE) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Register Dispute</span>
            </button>
          )}
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Hearings</span>
            <strong className="text-xl font-black text-amber-700">{filteredDisputes.length} Disputes</strong>
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

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search dispute by claimant, khasra number, or dispute ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Disputes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDisputes.map((d) => (
          <div
            key={d.disputeId}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {d.disputeId}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    d.status === 'RESOLVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : d.status === 'FORWARDED_TO_TRIBUNAL'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {d.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900">Khasra #{d.khasraNumber} — {d.claimantName}</h3>
                <p className="text-xs text-amber-700 font-bold mt-0.5">{d.disputeType}</p>
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-3">
                  "{d.description}"
                </p>
              </div>

              {d.authorityOrder && (
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900">
                  <strong>Collector Order:</strong> {d.authorityOrder}
                </div>
              )}
            </div>

            {/* Permission-Based Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {hasPermission(DISTRICT_PERMISSIONS.REVIEW_DISPUTE) && d.status !== 'RESOLVED' ? (
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedDispute(d);
                      setActionModalType('RESOLVE');
                      setOrderText('');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
                    title="Pass Statutory Order (Sec 15)"
                  >
                    <Gavel className="w-3 h-3" />
                    <span>Pass Order</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDispute(d);
                      setActionModalType('FORWARD_TRIBUNAL');
                      setOrderText('Referred to LARRA Tribunal under Section 64 for judicial valuation.');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
                    title="Refer to LARRA Tribunal (Sec 64)"
                  >
                    <Scale className="w-3 h-3" />
                    <span>Tribunal</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDispute(d);
                      setActionModalType('ESCALATE_STATE');
                      setOrderText('Escalated to Divisional Commissioner & Revenue Board.');
                    }}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                    title="Escalate to State Revenue Board"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Escalate</span>
                  </button>
                </div>
              ) : (
                <div className="w-full text-center text-slate-400 text-xs py-1">
                  {d.status === 'RESOLVED' ? 'Adjudicated Order Passed' : 'Read-Only Hearing Record'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action / Order Modal */}
      {actionModalType && selectedDispute && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700">{selectedDispute.disputeId}</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {actionModalType === 'RESOLVE'
                    ? 'Pass Collectorate Statutory Order (Sec 15)'
                    : actionModalType === 'FORWARD_TRIBUNAL'
                    ? 'Refer Case to LARRA Tribunal (Sec 64)'
                    : 'Escalate Dispute to State Revenue Board'}
                </h3>
              </div>
              <button
                onClick={() => setActionModalType(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div><strong>Claimant:</strong> {selectedDispute.claimantName}</div>
              <div><strong>Khasra Number:</strong> #{selectedDispute.khasraNumber}</div>
              <div><strong>Dispute Category:</strong> {selectedDispute.disputeType}</div>
              <div><strong>Claim Summary:</strong> {selectedDispute.description}</div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-slate-800">
                Official Determination / Statutory Note
              </label>
              <textarea
                rows={4}
                value={orderText}
                onChange={(e) => setOrderText(e.target.value)}
                placeholder="Enter statutory grounds, evidence recorded, or LARRA reference memorandum..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500 font-medium"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActionModalType(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={submitting}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Processing...' : 'Execute Statutory Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Dispute Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Quasi-Judicial Intake
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Register Section 15 Objection / Dispute
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Claimant Name</label>
                  <input
                    type="text"
                    value={newClaimant}
                    onChange={(e) => setNewClaimant(e.target.value)}
                    placeholder="e.g. Sh. Devendra Singh"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khasra Number</label>
                  <input
                    type="text"
                    value={newKhasra}
                    onChange={(e) => setNewKhasra(e.target.value)}
                    placeholder="e.g. 104/2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dispute Classification</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="Valuation / Circle Rate Objection">Valuation / Circle Rate Objection</option>
                  <option value="Boundary Alignment & Severance Objection">Boundary Alignment & Severance Objection</option>
                  <option value="Co-Sharer Title & Succession Dispute">Co-Sharer Title & Succession Dispute</option>
                  <option value="Structure / Tree Compensation Omission">Structure / Tree Compensation Omission</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dispute Summary & Grounds</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter specific grounds of objection under Section 15..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDispute}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{creatingDispute ? 'Registering...' : 'Register Dispute Case'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DistrictDisputesPage = () => (
  <ErrorBoundary>
    <DistrictDisputesContent />
  </ErrorBoundary>
);

export default DistrictDisputesPage;
