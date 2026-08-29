import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCentralDisputesApi } from '../../services/api/centralApi';
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
  Globe,
} from 'lucide-react';

const CentralDisputesContent = () => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisputeModal, setSelectedDisputeModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCentralDisputesApi().then((data) => {
      if (Array.isArray(data)) setDisputes(data);
      setLoading(false);
    });
  }, []);

  const defaultDisputes = [
    { id: 'DISP-NAT-001', state: 'Madhya Pradesh', district: 'Panna', projectId: 'PRJ-007', project: 'Ken-Betwa River Interlinking Canal Project', issue: 'Stage-II Forest Advisory & Wildlife Board Clearance Delay', priority: 'CRITICAL', status: 'HIGH_LEVEL_MEETING_SCHEDULED', nextHearingDate: '2026-09-10', bench: 'Cabinet Secretariat Infrastructure Review Bench' },
    { id: 'DISP-NAT-002', state: 'Maharashtra', district: 'Raigad', projectId: 'PRJ-003', project: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', issue: 'Coastal Regulation Zone (CRZ-I) Alignment Representation', priority: 'HIGH', status: 'UNDER_REVIEW', nextHearingDate: '2026-09-14', bench: 'MCZMA State Board & MoEFCC Cell' },
    { id: 'DISP-NAT-003', state: 'Bihar', district: 'Rohtas', projectId: 'PRJ-010', project: 'Eastern Dedicated Freight Corridor Expansion', issue: 'Section 20E Title Determination & Sub-Division Boundary Dispute', priority: 'MEDIUM', status: 'QUASI_JUDICIAL_HEARING', nextHearingDate: '2026-09-16', bench: 'LARRA Tribunal Patna' },
    { id: 'DISP-NAT-004', state: 'Uttar Pradesh', district: 'Prayagraj', projectId: 'PRJ-012', project: 'Ganga Expressway Feeder Node', issue: 'High Court Interim Stay on Agricultural Multi-Crop ROW Alignment', priority: 'CRITICAL', status: 'HEARING_SCHEDULED', nextHearingDate: '2026-09-12', bench: 'Allahabad High Court Division Bench' },
    { id: 'DISP-NAT-005', state: 'Haryana', district: 'Rewari', projectId: 'PRJ-002', project: 'Dedicated Freight Corridor (Western DFC)', issue: 'Commercial Compensation Multiplier Factor Appeal (Section 64)', priority: 'HIGH', status: 'HEARING_SCHEDULED', nextHearingDate: '2026-09-18', bench: 'Punjab & Haryana HC Bench' },
  ];

  const list = disputes.length > 0 ? disputes : defaultDisputes;

  const filtered = list.filter((d) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.state?.toLowerCase().includes(q) ||
        d.district?.toLowerCase().includes(q) ||
        d.project?.toLowerCase().includes(q) ||
        d.issue?.toLowerCase().includes(q) ||
        d.id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider flex items-center gap-1">
              <Gavel className="w-3.5 h-3.5 text-amber-700" />
              <span>National Legal & Statutory Oversight</span>
            </span>
            <span className="text-xs font-bold text-slate-500">PM Gati Shakti Legal Cell</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span>Major Disputes & High Court Stays</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Apex monitoring of High Court interim stays, environmental tribunal litigations, and major inter-state right-of-way disputes.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-amber-700">Active Disputes</div>
          <div className="text-xl font-black text-amber-900">{list.length} Major Cases</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search state, district, project, or issue title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Major Disputes
        </div>
      </div>

      {/* Disputes Table Matching Exact Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Issue</th>
                <th className="py-3.5 px-4">Priority</th>
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
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {d.state}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {d.district}
                  </td>

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

                  <td className="py-4 px-4 max-w-md">
                    <span className="font-semibold text-slate-800 line-clamp-2">{d.issue}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        d.priority === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : d.priority === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {d.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        d.status === 'HIGH_LEVEL_MEETING_SCHEDULED' || d.status === 'HEARING_SCHEDULED'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
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
                  Statutory Litigation Brief
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedDisputeModal.project}
                </h2>
                <p className="text-xs text-slate-500">
                  State: {selectedDisputeModal.state} • District: {selectedDisputeModal.district}
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
                <span className="text-[10px] font-black uppercase text-amber-800">Issue / Roadblock</span>
                <p className="text-xs font-medium text-amber-950 leading-relaxed">
                  {selectedDisputeModal.issue}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Next Bench Listing</span>
                  <strong className="text-slate-800">{selectedDisputeModal.nextHearingDate}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Priority Level</span>
                  <strong className="text-rose-700 uppercase">{selectedDisputeModal.priority}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Adjudicating Authority / Forum</span>
                <p>{selectedDisputeModal.bench}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
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

export const CentralDisputesPage = () => (
  <ErrorBoundary>
    <CentralDisputesContent />
  </ErrorBoundary>
);

export default CentralDisputesPage;
