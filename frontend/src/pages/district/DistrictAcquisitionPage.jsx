import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchDistrictAcquisitionApi,
  updateDistrictAcquisitionStatusApi,
  addDistrictAcquisitionRemarkApi,
} from '../../services/api/districtApi';
import { formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileCheck,
  Search,
  Filter,
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  Building2,
  Edit3,
  MessageSquare,
  Send,
  X,
  Save,
  ShieldCheck,
} from 'lucide-react';

const DistrictAcquisitionContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionNotice, setActionNotice] = useState(null);

  // Status Modal
  const [statusModalCase, setStatusModalCase] = useState(null);
  const [targetStatus, setTargetStatus] = useState('APPROVED');
  const [targetAction, setTargetAction] = useState('SANCTION_SECTION_19');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Remark Modal
  const [remarkModalCase, setRemarkModalCase] = useState(null);
  const [calaRemark, setCalaRemark] = useState('');
  const [savingRemark, setSavingRemark] = useState(false);

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictAcquisitionApi({ district: currentUser?.district || 'Agra' });
      if (Array.isArray(data)) {
        setCases(data);
      }
    } catch (err) {
      console.error('Error fetching acquisition cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [currentUser]);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      (c.caseId && c.caseId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.khasraNumber && c.khasraNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.village && c.village.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || c.tehsildarStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusModalCase) return;
    setSavingStatus(true);
    try {
      const payload = {
        status: targetStatus,
        action: targetAction,
        remarks: statusRemarks || 'Acquisition stage updated by CALA / District Magistrate.',
      };
      const res = await updateDistrictAcquisitionStatusApi(statusModalCase.caseId, payload);
      if (res.success) {
        setActionNotice(`Case ${statusModalCase.caseId} updated successfully: ${targetAction}.`);
        setStatusModalCase(null);
        setStatusRemarks('');
        loadCases();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!remarkModalCase || !calaRemark.trim()) return;
    setSavingRemark(true);
    try {
      const payload = { remark: calaRemark.trim() };
      const res = await addDistrictAcquisitionRemarkApi(remarkModalCase.caseId, payload);
      if (res.success) {
        setActionNotice(`District CALA remark recorded for Case ${remarkModalCase.caseId}.`);
        setRemarkModalCase(null);
        setCalaRemark('');
        loadCases();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRemark(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Land Acquisition Monitoring
            </span>
            <span className="text-xs font-bold text-slate-500">Agra District • Multi-Tehsil Oversight</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-purple-600" />
            <span>District Land Acquisition Cases Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track individual parcel case files, update statutory acquisition stages (3A/3D/3G), record CALA orders, and forward to State Gazette.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Monitored Cases</span>
          <strong className="text-xl font-black text-purple-700">{filteredCases.length} Cases</strong>
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

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by case ID, owner name, khasra number, or village..."
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
            <option value="ALL">All Statutory Statuses</option>
            <option value="APPROVED">Approved & Sanctioned</option>
            <option value="PENDING">Pending Review</option>
            <option value="UNDER_REVIEW">Under Inquiry</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Project Corridor</th>
                <th className="p-4">Khasra & Village</th>
                <th className="p-4">Landowner</th>
                <th className="p-4">Affected Area</th>
                <th className="p-4">Award Amount</th>
                <th className="p-4">Tehsildar Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">District Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-purple-700">{c.caseId}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800 block truncate max-w-[200px]" title={c.projectName}>
                      {c.projectName}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.projectId}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">Khasra #{c.khasraNumber}</span>
                    <span className="text-[10px] text-slate-500">{c.village}, {c.tehsil}</span>
                  </td>
                  <td className="p-4 text-slate-800 font-bold">{c.ownerName}</td>
                  <td className="p-4">
                    <span className="font-bold text-purple-700">{formatAcre(c.affectedAreaAcre)}</span>
                    <span className="text-[10px] text-slate-400 block">Total: {formatAcre(c.totalAreaAcre)}</span>
                  </td>
                  <td className="p-4 font-bold text-emerald-700">₹{c.compensationAwardedCr || 0.52} Cr</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        c.tehsildarStatus === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {c.tehsildarStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {c.paymentStatus || 'DISBURSED'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {hasPermission(DISTRICT_PERMISSIONS.UPDATE_ACQUISITION) && (
                        <button
                          onClick={() => {
                            setStatusModalCase(c);
                            setTargetStatus(c.tehsildarStatus || 'APPROVED');
                            setTargetAction('SANCTION_SECTION_19');
                            setStatusRemarks('');
                          }}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition"
                          title="Update Statutory Acquisition Status"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Update Stage</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setRemarkModalCase(c);
                          setCalaRemark('');
                        }}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition"
                        title="Add CALA Remark"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Remark</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Acquisition Stage Modal */}
      {statusModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  CALA Statutory Determination
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Update Case #{statusModalCase.caseId} (Khasra #{statusModalCase.khasraNumber})
                </h3>
              </div>
              <button
                onClick={() => setStatusModalCase(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Statutory Action / Determination</label>
                <select
                  value={targetAction}
                  onChange={(e) => setTargetAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="SANCTION_SECTION_19">Sanction Section 19 Final Declaration</option>
                  <option value="FORWARD_TO_STATE">Forward to State Gazette for Publication</option>
                  <option value="PASS_SECTION_23_AWARD">Pass Section 23 Final Land Award</option>
                  <option value="AUTHORIZE_POSSESSION">Authorize Section 38 Possession Handover</option>
                  <option value="RETURN_TO_TEHSILDAR">Return to Tehsildar for Resurvey</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resulting Case Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="APPROVED">APPROVED & SANCTIONED</option>
                  <option value="SECTION_19_DECLARED">SECTION 19 DECLARED</option>
                  <option value="AWARD_PASSED">AWARD PASSED (SEC 23)</option>
                  <option value="POSSESSION_TAKEN">POSSESSION TAKEN</option>
                  <option value="RETURNED_FOR_INQUIRY">RETURNED FOR INQUIRY</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Collectorate / CALA Remarks & Order Reference</label>
                <textarea
                  rows={3}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="Enter statutory award reference number, surveyor instructions, or gazette order reference..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalCase(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStatus}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingStatus ? 'Saving...' : 'Record Statutory Order'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add CALA Remark Modal */}
      {remarkModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Case Note Ledger
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Add CALA Observation Note
                </h3>
                <p className="text-xs text-slate-500">Case {remarkModalCase.caseId} (Khasra #{remarkModalCase.khasraNumber})</p>
              </div>
              <button
                onClick={() => setRemarkModalCase(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRemark} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official CALA Observation / Directive</label>
                <textarea
                  rows={4}
                  value={calaRemark}
                  onChange={(e) => setCalaRemark(e.target.value)}
                  placeholder="Record note regarding field verification, tree/structure valuation, or family co-sharer inquiry..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRemarkModalCase(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRemark}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{savingRemark ? 'Recording...' : 'Add to Permanent Ledger'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DistrictAcquisitionPage = () => (
  <ErrorBoundary>
    <DistrictAcquisitionContent />
  </ErrorBoundary>
);

export default DistrictAcquisitionPage;
