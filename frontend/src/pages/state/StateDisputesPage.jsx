import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchStateDisputesApi } from '../../services/api/stateApi';
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
  ExternalLink,
  ChevronRight,
  Gavel,
} from 'lucide-react';

const StateDisputesContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisputeModal, setSelectedDisputeModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    fetchStateDisputesApi(stateName).then((data) => {
      if (Array.isArray(data)) setDisputes(data);
      setLoading(false);
    });
  }, [stateName]);

  const defaultDisputes = [
    { id: 'DISP-UP-001', project: 'Ganga Expressway Feeder Node', projectId: 'PRJ-012', district: 'Prayagraj', total: 18, pending: 12, resolved: 6, status: 'HIGH_COURT_STAY', description: 'High Court Interim Stay on alignment demarcated through agricultural multi-crop belt.', priority: 'CRITICAL', nextHearingDate: '2026-09-12' },
    { id: 'DISP-UP-002', project: 'Delhi–Meerut Expressway Expansion', projectId: 'PRJ-001', district: 'Agra', total: 8, pending: 3, resolved: 5, status: 'HEARING_ACTIVE', description: 'Khasra 102 Peg Boundary demarcation valuation mismatch representation.', priority: 'MEDIUM', nextHearingDate: '2026-09-08' },
    { id: 'DISP-UP-003', project: 'Lucknow Ring Road Phase-3', projectId: 'PRJ-011', district: 'Lucknow', total: 14, pending: 8, resolved: 6, status: 'UNDER_REVIEW', description: 'Gram Sabha Common Grazing Land compensation allocation dispute among co-sharers.', priority: 'HIGH', nextHearingDate: '2026-09-18' },
    { id: 'DISP-UP-004', project: 'National Highway-19 6-Lane Expansion', projectId: 'PRJ-005', district: 'Kanpur Nagar', total: 11, pending: 6, resolved: 5, status: 'HEARING_ACTIVE', description: 'Commercial corridor circle rate multiplier calculation objection.', priority: 'HIGH', nextHearingDate: '2026-09-15' },
    { id: 'DISP-UP-005', project: 'Yamuna Expressway Interconnect', projectId: 'PRJ-003', district: 'Gautam Buddha Nagar', total: 6, pending: 2, resolved: 4, status: 'SETTLEMENT_PENDING', description: 'Tribal community parcel displacement R&R schedule determination.', priority: 'MEDIUM', nextHearingDate: '2026-09-22' },
  ];

  const list = disputes.length > 0 ? disputes : defaultDisputes;

  const filtered = list.filter((d) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.district.toLowerCase().includes(q) ||
        d.project.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalDisputes = list.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const pendingDisputes = list.reduce((acc, curr) => acc + (curr.pending || 0), 0);
  const resolvedDisputes = list.reduce((acc, curr) => acc + (curr.resolved || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider flex items-center gap-1">
              <Gavel className="w-3.5 h-3.5 text-amber-700" />
              <span>Section 15 & Judicial Oversight</span>
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span>Statewide Disputes & Legal Stays</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quasi-judicial Section 15 objections, High Court land acquisition writ petitions, and LARRA Section 64 tribunal determinations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-amber-700">Pending Adjudication</div>
            <div className="text-xl font-black text-amber-900">{pendingDisputes} Cases</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Litigations & Disputes</span>
          <strong className="text-2xl font-black text-slate-900">{totalDisputes} Filed</strong>
          <span className="text-[11px] text-slate-400 block">Across 8 priority infrastructure corridors</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Pending Hearing Bench</span>
          <strong className="text-2xl font-black text-amber-700">{pendingDisputes} Active</strong>
          <span className="text-[11px] text-amber-600 block">Quasi-judicial inquiries underway</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Resolved / Settled</span>
          <strong className="text-2xl font-black text-emerald-700">{resolvedDisputes} Determinations</strong>
          <span className="text-[11px] text-emerald-600 block">Collectorate orders passed</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dispute, project, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Dispute Workflows
        </div>
      </div>

      {/* Disputes Table Matching Exact Requirements */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4 text-center">Total</th>
                <th className="py-3.5 px-4 text-center">Pending</th>
                <th className="py-3.5 px-4 text-center">Resolved</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => setSelectedDisputeModal(d)}
                  className="hover:bg-amber-50/30 transition cursor-pointer group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                        {d.projectId}
                      </span>
                      <span className="font-black text-slate-900 group-hover:text-amber-700 transition">
                        {d.project}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {d.district}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-slate-900">
                    {d.total}
                  </td>

                  <td className="py-4 px-4 text-center font-black text-amber-700">
                    <span className="bg-amber-50 px-2 py-0.5 rounded-md">
                      {d.pending}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-emerald-700">
                    <span className="bg-emerald-50 px-2 py-0.5 rounded-md">
                      {d.resolved}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        d.status === 'HIGH_COURT_STAY'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : d.status === 'UNDER_REVIEW'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {d.status?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDisputeModal(d);
                      }}
                      className="bg-slate-100 group-hover:bg-amber-600 group-hover:text-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Details Modal */}
      {selectedDisputeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  Statutory Dispute Review
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedDisputeModal.project}
                </h2>
                <p className="text-xs text-slate-500">
                  Jurisdiction: {selectedDisputeModal.district} District
                </p>
              </div>

              <button
                onClick={() => setSelectedDisputeModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-800">Litigation Summary</span>
                <p className="text-xs font-medium text-amber-950 leading-relaxed">
                  {selectedDisputeModal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Next Hearing</span>
                  <strong className="text-slate-800">{selectedDisputeModal.nextHearingDate}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Priority Level</span>
                  <strong className="text-rose-700 uppercase">{selectedDisputeModal.priority}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Adjudication Breakdown</span>
                <div className="flex justify-between text-xs pt-1">
                  <span>Total Cases: <strong>{selectedDisputeModal.total}</strong></span>
                  <span className="text-amber-700">Pending: <strong>{selectedDisputeModal.pending}</strong></span>
                  <span className="text-emerald-700">Resolved: <strong>{selectedDisputeModal.resolved}</strong></span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedDisputeModal(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const StateDisputesPage = () => (
  <ErrorBoundary>
    <StateDisputesContent />
  </ErrorBoundary>
);

export default StateDisputesPage;
