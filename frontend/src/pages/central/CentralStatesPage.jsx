import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCentralStatesApi, fetchCentralProjectsApi } from '../../services/api/centralApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Globe,
  Building2,
  Layers,
  FileCheck,
  Banknote,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MapPin,
} from 'lucide-react';

const CentralStatesContent = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [selectedStateModal, setSelectedStateModal] = useState(null);
  const [selectedDistrictDetail, setSelectedDistrictDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCentralStatesApi().then((data) => {
      if (Array.isArray(data)) setStates(data);
      setLoading(false);
    });
  }, []);

  const defaultStates = [
    {
      state: 'Uttar Pradesh',
      stateCode: 'UP',
      totalProjects: 8,
      activeProjects: 7,
      acquisitionProgress: 67.8,
      compensationRnR: 78.4,
      delayedProjects: 1,
      pendingIssues: 3,
      principalSecretary: 'Sh. Sanjeev Khare, IAS',
      districts: [
        { district: 'Agra', projectsCount: 4, acquisitionProgress: 70.9, compensationPaidCr: 136.95, rrProgress: 81.0, delayedCases: 1, projectIds: ['PRJ-001', 'PRJ-002', 'PRJ-005', 'PRJ-006'] },
        { district: 'Meerut', projectsCount: 3, acquisitionProgress: 68.6, compensationPaidCr: 105.0, rrProgress: 78.4, delayedCases: 0, projectIds: ['PRJ-001', 'PRJ-004'] },
        { district: 'Lucknow', projectsCount: 4, acquisitionProgress: 76.5, compensationPaidCr: 175.5, rrProgress: 86.2, delayedCases: 0, projectIds: ['PRJ-011'] },
        { district: 'Prayagraj', projectsCount: 2, acquisitionProgress: 60.3, compensationPaidCr: 84.0, rrProgress: 69.5, delayedCases: 1, projectIds: ['PRJ-012'] },
        { district: 'Jhansi', projectsCount: 2, acquisitionProgress: 88.1, compensationPaidCr: 68.0, rrProgress: 91.5, delayedCases: 0, projectIds: ['PRJ-013'] },
      ],
    },
    {
      state: 'Maharashtra',
      stateCode: 'MH',
      totalProjects: 6,
      activeProjects: 6,
      acquisitionProgress: 73.1,
      compensationRnR: 82.0,
      delayedProjects: 0,
      pendingIssues: 2,
      principalSecretary: 'Dr. Nitin Kareer, IAS',
      districts: [
        { district: 'Pune', projectsCount: 3, acquisitionProgress: 75.0, compensationPaidCr: 240.0, rrProgress: 84.0, delayedCases: 0, projectIds: ['PRJ-003'] },
        { district: 'Raigad', projectsCount: 2, acquisitionProgress: 68.5, compensationPaidCr: 180.0, rrProgress: 79.0, delayedCases: 0, projectIds: ['PRJ-003'] },
      ],
    },
    {
      state: 'Gujarat',
      stateCode: 'GJ',
      totalProjects: 5,
      activeProjects: 5,
      acquisitionProgress: 93.6,
      compensationRnR: 96.7,
      delayedProjects: 0,
      pendingIssues: 1,
      principalSecretary: 'Sh. Manoj Kumar Das, IAS',
      districts: [
        { district: 'Surat', projectsCount: 2, acquisitionProgress: 98.0, compensationPaidCr: 310.0, rrProgress: 99.0, delayedCases: 0, projectIds: ['PRJ-004', 'PRJ-002'] },
        { district: 'Ahmedabad', projectsCount: 2, acquisitionProgress: 95.0, compensationPaidCr: 290.0, rrProgress: 97.0, delayedCases: 0, projectIds: ['PRJ-004'] },
      ],
    },
    {
      state: 'Haryana',
      stateCode: 'HR',
      totalProjects: 4,
      activeProjects: 4,
      acquisitionProgress: 80.0,
      compensationRnR: 85.0,
      delayedProjects: 0,
      pendingIssues: 1,
      principalSecretary: 'Sh. Anurag Rastogi, IAS',
      districts: [
        { district: 'Gurugram', projectsCount: 2, acquisitionProgress: 84.0, compensationPaidCr: 190.0, rrProgress: 88.0, delayedCases: 0, projectIds: ['PRJ-002'] },
        { district: 'Rewari', projectsCount: 2, acquisitionProgress: 76.0, compensationPaidCr: 140.0, rrProgress: 82.0, delayedCases: 0, projectIds: ['PRJ-002'] },
      ],
    },
    {
      state: 'Madhya Pradesh',
      stateCode: 'MP',
      totalProjects: 5,
      activeProjects: 4,
      acquisitionProgress: 69.0,
      compensationRnR: 72.5,
      delayedProjects: 1,
      pendingIssues: 4,
      principalSecretary: 'Sh. Rajesh Rajora, IAS',
      districts: [
        { district: 'Panna', projectsCount: 2, acquisitionProgress: 52.0, compensationPaidCr: 110.0, rrProgress: 60.0, delayedCases: 1, projectIds: ['PRJ-007'] },
        { district: 'Chhatarpur', projectsCount: 2, acquisitionProgress: 65.0, compensationPaidCr: 130.0, rrProgress: 71.0, delayedCases: 0, projectIds: ['PRJ-007'] },
      ],
    },
    {
      state: 'Rajasthan',
      stateCode: 'RJ',
      totalProjects: 4,
      activeProjects: 4,
      acquisitionProgress: 83.7,
      compensationRnR: 88.0,
      delayedProjects: 0,
      pendingIssues: 1,
      principalSecretary: 'Sh. Subodh Agarwal, IAS',
      districts: [
        { district: 'Jodhpur', projectsCount: 2, acquisitionProgress: 94.0, compensationPaidCr: 210.0, rrProgress: 95.0, delayedCases: 0, projectIds: ['PRJ-008'] },
      ],
    },
    {
      state: 'Karnataka',
      stateCode: 'KA',
      totalProjects: 3,
      activeProjects: 3,
      acquisitionProgress: 76.5,
      compensationRnR: 79.8,
      delayedProjects: 0,
      pendingIssues: 2,
      principalSecretary: 'Sh. Rajender Kumar Kataria, IAS',
      districts: [
        { district: 'Kolar', projectsCount: 2, acquisitionProgress: 78.0, compensationPaidCr: 150.0, rrProgress: 81.0, delayedCases: 0, projectIds: ['PRJ-009'] },
      ],
    },
    {
      state: 'Bihar',
      stateCode: 'BR',
      totalProjects: 3,
      activeProjects: 2,
      acquisitionProgress: 60.0,
      compensationRnR: 62.0,
      delayedProjects: 1,
      pendingIssues: 5,
      principalSecretary: 'Sh. Brajesh Mehrotra, IAS',
      districts: [
        { district: 'Rohtas', projectsCount: 2, acquisitionProgress: 58.0, compensationPaidCr: 90.0, rrProgress: 60.0, delayedCases: 1, projectIds: ['PRJ-010'] },
      ],
    },
  ];

  const list = states.length > 0 ? states : defaultStates;

  const filtered = list.filter((s) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.state.toLowerCase().includes(q) ||
        s.stateCode?.toLowerCase().includes(q) ||
        s.principalSecretary?.toLowerCase().includes(q)
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
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-700" />
              <span>Federal Infrastructure Oversight</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Pan-India States</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span>State-wise Delivery & Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarchical state monitoring of land acquisition velocity, DBT award disbursements, R&R compliance, and overdue bottlenecks.
          </p>
        </div>

        <div className="bg-indigo-50/80 border border-indigo-100 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-indigo-600">Tracked States</div>
          <div className="text-xl font-black text-indigo-900">{list.length} States</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search state name, code, or nodal secretary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} States
        </div>
      </div>

      {/* States Table Matching Required Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4 text-center">Total Projects</th>
                <th className="py-3.5 px-4 text-center">Active Projects</th>
                <th className="py-3.5 px-4 min-w-[150px]">Acquisition Progress</th>
                <th className="py-3.5 px-4 text-center">Compensation / R&R</th>
                <th className="py-3.5 px-4 text-center">Delayed Projects</th>
                <th className="py-3.5 px-4 text-center">Pending Issues</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((s) => (
                <tr
                  key={s.state}
                  onClick={() => setSelectedStateModal(s)}
                  className="hover:bg-indigo-50/40 transition cursor-pointer group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                        {s.stateCode || s.state.substring(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <span className="font-black text-slate-900 group-hover:text-indigo-600 transition block">
                          {s.state}
                        </span>
                        <span className="text-[10px] text-slate-400">Sec: {s.principalSecretary}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-black text-slate-900">
                    {s.totalProjects}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-emerald-700">
                    {s.activeProjects}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-black text-slate-900">{s.acquisitionProgress}%</span>
                      <span className="text-slate-400 font-normal">Possessed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(s.acquisitionProgress, 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-black text-emerald-700">
                    {s.compensationRnR}%
                  </td>

                  <td className="py-4 px-4 text-center">
                    {s.delayedProjects > 0 ? (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-md">
                        {s.delayedProjects} Delayed
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">0 Delays</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">
                    {s.pendingIssues > 0 ? (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-md">
                        {s.pendingIssues}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStateModal(s);
                      }}
                      className="bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                    >
                      <span>Drill-down</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* State Click -> Modal: State → Districts → Projects Hierarchy */}
      {selectedStateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  State Infrastructure Hierarchy (State → Districts → Projects)
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedStateModal.state} • {selectedStateModal.totalProjects} National Projects
                </h2>
                <p className="text-xs text-slate-500">
                  Principal Secretary: {selectedStateModal.principalSecretary}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedStateModal(null);
                  setSelectedDistrictDetail(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs font-bold text-slate-600 mb-2">
                Collectorates & Districts in {selectedStateModal.state}:
              </div>

              {selectedStateModal.districts?.map((d) => (
                <div
                  key={d.district}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 hover:border-indigo-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{d.district} District</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Acquisition: <strong className="text-indigo-700">{d.acquisitionProgress}%</strong></span>
                        <span>•</span>
                        <span>Compensation Paid: <strong className="text-emerald-700">₹{d.compensationPaidCr} Cr</strong></span>
                        <span>•</span>
                        <span>R&R: <strong className="text-purple-700">{d.rrProgress}%</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStateModal(null);
                        navigate(`/central/projects?state=${selectedStateModal.state}&district=${d.district}`);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 self-start sm:self-center"
                    >
                      <span>View Projects ({d.projectsCount})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {d.projectIds && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold">Corridors:</span>
                      {d.projectIds.map((pid) => (
                        <span
                          key={pid}
                          className="bg-white border border-slate-200 text-indigo-700 font-mono text-[10px] font-black px-2 py-0.5 rounded-md"
                        >
                          {pid}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedStateModal(null);
                  navigate(`/central/projects?state=${selectedStateModal.state}`);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View All Projects in {selectedStateModal.state}</span>
              </button>

              <button
                onClick={() => setSelectedStateModal(null)}
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

export const CentralStatesPage = () => (
  <ErrorBoundary>
    <CentralStatesContent />
  </ErrorBoundary>
);

export default CentralStatesPage;
