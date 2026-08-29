import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import {
  fetchTehsildarObjectionsApi,
  actOnTehsildarObjectionApi
} from '../../services/api/tehsildarApi';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Eye,
  Send,
  Building2,
  MapPin,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  X,
} from 'lucide-react';

export const TehsildarObjectionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setActiveKhasraId, showToast } = useLandData();

  const [objections, setObjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Objection Modal & Action
  const [selectedObjection, setSelectedObjection] = useState(null);
  const [actionType, setActionType] = useState(null); // 'ACCEPT' | 'REJECT' | 'REQUEST_INFO' | 'FORWARD'
  const [actionRemarks, setActionRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadObjections = async () => {
    setLoading(true);
    try {
      const data = await fetchTehsildarObjectionsApi({ status: statusFilter });
      if (data && Array.isArray(data)) {
        setObjections(data);
      } else {
        setObjections([]);
      }
    } catch (err) {
      console.error('Failed to load objections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadObjections();
  }, [statusFilter]);

  // Handle URL query param
  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId && objections.length > 0) {
      const matched = objections.find((o) => o.objectionId === urlId);
      if (matched) setSelectedObjection(matched);
    }
  }, [searchParams, objections]);

  const handleActionSubmit = async () => {
    if (!selectedObjection) return;
    if (!actionRemarks.trim()) {
      showToast('Remarks Required', 'Please enter order notes / rationale for this action.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await actOnTehsildarObjectionApi(
        selectedObjection.objectionId,
        actionType,
        actionRemarks
      );
      showToast('Objection Processed', `Objection ${selectedObjection.objectionId} updated with order: ${actionType}.`, 'success');
      if (res) setSelectedObjection(res);
      setActionType(null);
      setActionRemarks('');
      await loadObjections();
    } catch (err) {
      showToast('Action Failed', err.message || 'Failed to update objection on server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = objections.filter((obj) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (obj.objectionId && obj.objectionId.toLowerCase().includes(q)) ||
      (obj.claimantName && obj.claimantName.toLowerCase().includes(q)) ||
      (obj.khasraNumber && obj.khasraNumber.toLowerCase().includes(q)) ||
      (obj.description && obj.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
              Section 15 Quasi-Judicial Review
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              RFCTLARR Act 2013 Statutory Objection Hearings
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Citizen Claims, Objections & RO Inquiry Reports
          </h1>
        </div>

        <button
          onClick={loadObjections}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Objections</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Objection ID, Claimant, Khasra No..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-900/20 focus:border-gov-blue-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Objections</option>
            <option value="PENDING_HEARING">Pending Hearing</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="MORE_INFO_REQUESTED">More Info Requested</option>
            <option value="FORWARDED_TO_CALA">Forwarded to CALA</option>
          </select>
        </div>
      </div>

      {/* Objections List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading citizen objections from backend...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No citizen objections matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Objection ID</th>
                  <th className="py-3 px-4">Claimant Name</th>
                  <th className="py-3 px-4">Khasra / Case ID</th>
                  <th className="py-3 px-4">Objection Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Hearing Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((obj) => (
                  <tr key={obj.id || obj.objectionId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-purple-900">
                      {obj.objectionId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {obj.claimantName}
                      <span className="text-[10px] text-slate-400 font-normal block">{obj.claimantPhone}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gov-blue-900">
                      Khasra {obj.khasraNumber}
                      <span className="text-[10px] text-slate-400 font-normal block">{obj.caseId || 'CASE-2026-DME-0101'}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {obj.objectionType || 'Valuation / Land Boundary'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={obj.description}>
                      {obj.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {obj.hearingDate || '15 Mar 2026'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={obj.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedObjection(obj)}
                        className="bg-purple-900 hover:bg-purple-800 text-white px-3 py-1 rounded-lg text-[11px] font-bold transition shadow-xs"
                      >
                        View & Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Objection Dossier & Hearing Modal */}
      {selectedObjection && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            {/* Header */}
            <div className="bg-purple-950 text-white p-5 flex items-start justify-between">
              <div>
                <span className="bg-purple-500 text-white text-[9px] uppercase font-black px-2 py-0.2 rounded">
                  Section 15 Citizen Claim
                </span>
                <h2 className="text-lg font-black text-white mt-1">
                  Objection ID: {selectedObjection.objectionId}
                </h2>
                <p className="text-[11px] text-purple-200">
                  Claimant: {selectedObjection.claimantName} ({selectedObjection.claimantEmail || 'contact via phone'})
                </p>
              </div>

              <button
                onClick={() => setSelectedObjection(null)}
                className="text-purple-300 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Claim Description */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2">
                <span className="text-[10px] text-purple-800 font-bold uppercase tracking-wider block">
                  Grounds of Objection / Grievance:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium text-xs">
                  "{selectedObjection.description}"
                </p>
              </div>

              {/* Related Parcel & RO Inquiry Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-extrabold text-slate-900 block border-b border-slate-200 pb-1">
                    Related Land Parcel
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khasra Number:</span>
                    <strong className="text-gov-blue-900 font-mono font-bold">{selectedObjection.khasraNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project:</span>
                    <span className="font-semibold text-slate-800">{selectedObjection.projectId || 'PRJ-001'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Hearing:</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedObjection.hearingDate || '15 Mar 2026'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-extrabold text-slate-900 block border-b border-slate-200 pb-1">
                    Revenue Officer Field Inquiry Report
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Site verification conducted. Physical boundary verified with Chak road. No overlapping encroachment detected.
                  </p>
                </div>
              </div>

              {/* Order Notes / Action Section */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-900 text-xs block">
                  Tehsildar Statutory Order / Remarks:
                </label>
                <textarea
                  rows={3}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Enter quasi-judicial order or referral instructions..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-900/20"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  setActiveKhasraId(selectedObjection.khasraNumber);
                  navigate(`/tehsildar/map?caseId=${selectedObjection.khasraNumber}`);
                }}
                className="text-gov-blue-900 font-bold hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-gov-saffron-600" />
                <span>Locate Khasra on Map</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  disabled={isSubmitting}
                  onClick={() => {
                    setActionType('REQUEST_INFO');
                    handleActionSubmit();
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-1.5 rounded-xl font-bold transition"
                >
                  Request Info
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={() => {
                    setActionType('FORWARD');
                    handleActionSubmit();
                  }}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-900 px-3 py-1.5 rounded-xl font-bold transition"
                >
                  Forward to CALA
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={() => {
                    setActionType('REJECT');
                    handleActionSubmit();
                  }}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-900 px-3 py-1.5 rounded-xl font-bold transition"
                >
                  Reject Claim
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={() => {
                    setActionType('ACCEPT');
                    handleActionSubmit();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-extrabold transition shadow-xs"
                >
                  Accept Objection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
