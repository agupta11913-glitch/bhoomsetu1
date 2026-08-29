import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchCentralProjectsApi, fetchCentralStatesApi } from '../../services/api/centralApi';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Layers,
  MapPin,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Clock,
  Banknote,
  Globe,
} from 'lucide-react';

const CentralProjectsContent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlState = searchParams.get('state');

  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(urlState || 'ALL');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCentralProjectsApi(selectedState, 'ALL'),
      fetchCentralStatesApi(),
    ]).then(([prjs, sts]) => {
      if (Array.isArray(prjs)) setProjects(prjs);
      if (Array.isArray(sts)) setStates(sts);
      setLoading(false);
    });
  }, [selectedState]);

  const defaultProjects = [
    { projectId: 'PRJ-001', name: 'Delhi–Meerut Expressway Expansion (NH-348)', state: 'Uttar Pradesh', district: 'Agra', districts: 'Agra, Meerut, Ghaziabad', department: 'Ministry of Road Transport & Highways', agency: 'NHAI', progress: 65.2, status: 'ACTIVE', affectedParcels: 124, totalLandAcre: 1450.0, acquiredLandAcre: 945.5, currentStage: 'Section 19 Sanctioned', estimatedCostCr: 840.0 },
    { projectId: 'PRJ-002', name: 'Dedicated Freight Corridor (Western DFC)', state: 'Haryana', district: 'Rewari', districts: 'Gurugram, Rewari, Surat', department: 'Ministry of Railways', agency: 'DFCCIL', progress: 80.0, status: 'ACTIVE', affectedParcels: 210, totalLandAcre: 2100.0, acquiredLandAcre: 1680.0, currentStage: 'Track Laying & Electrification', estimatedCostCr: 1450.0 },
    { projectId: 'PRJ-003', name: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', state: 'Maharashtra', district: 'Raigad', districts: 'Pune, Nashik, Raigad', department: 'Ministry of Commerce & Industry', agency: 'NICDC', progress: 63.2, status: 'ACTIVE', affectedParcels: 180, totalLandAcre: 3400.0, acquiredLandAcre: 2150.0, currentStage: 'Industrial Plot Demarcation', estimatedCostCr: 2200.0 },
    { projectId: 'PRJ-004', name: 'Mumbai–Ahmedabad High Speed Rail (MAHSR)', state: 'Gujarat', district: 'Surat', districts: 'Surat, Vadodara, Ahmedabad', department: 'Ministry of Railways', agency: 'NHSRCL', progress: 98.8, status: 'ACTIVE', affectedParcels: 320, totalLandAcre: 1396.0, acquiredLandAcre: 1380.0, currentStage: 'Viaduct Construction & Signaling', estimatedCostCr: 10800.0 },
    { projectId: 'PRJ-005', name: 'National Highway-19 6-Lane Expansion', state: 'Uttar Pradesh', district: 'Agra', districts: 'Agra, Mathura, Kanpur Nagar', department: 'Ministry of Road Transport & Highways', agency: 'NHAI', progress: 69.3, status: 'ACTIVE', affectedParcels: 96, totalLandAcre: 880.0, acquiredLandAcre: 610.0, currentStage: 'Section 23 Award Declared', estimatedCostCr: 560.0 },
    { projectId: 'PRJ-007', name: 'Ken-Betwa River Interlinking Canal Project', state: 'Madhya Pradesh', district: 'Panna', districts: 'Panna, Chhatarpur, Banda', department: 'Ministry of Jal Shakti', agency: 'NWDA', progress: 53.3, status: 'DELAYED', affectedParcels: 450, totalLandAcre: 9000.0, acquiredLandAcre: 4800.0, currentStage: 'Stage-II Forest Clearance Pending', estimatedCostCr: 4460.0 },
    { projectId: 'PRJ-008', name: 'Bhadla Mega Solar Renewable Energy Park', state: 'Rajasthan', district: 'Jodhpur', districts: 'Jodhpur, Bikaner, Phalodi', department: 'Ministry of New & Renewable Energy', agency: 'SECI', progress: 93.0, status: 'ACTIVE', affectedParcels: 80, totalLandAcre: 5000.0, acquiredLandAcre: 4650.0, currentStage: 'Grid Synchronization', estimatedCostCr: 1200.0 },
    { projectId: 'PRJ-009', name: 'Bangalore-Chennai Industrial Corridor (BCIC Node)', state: 'Karnataka', district: 'Kolar', districts: 'Kolar, Bangalore Rural, Chennai', department: 'Ministry of Commerce & Industry', agency: 'NICDC', progress: 66.1, status: 'ACTIVE', affectedParcels: 140, totalLandAcre: 2800.0, acquiredLandAcre: 1850.0, currentStage: 'Section 19 Sanctioned', estimatedCostCr: 1850.0 },
    { projectId: 'PRJ-010', name: 'Eastern Dedicated Freight Corridor Expansion (EDFC-II)', state: 'Bihar', district: 'Rohtas', districts: 'Rohtas, Gaya, Mughalsarai', department: 'Ministry of Railways', agency: 'DFCCIL', progress: 79.0, status: 'ACTIVE', affectedParcels: 260, totalLandAcre: 3100.0, acquiredLandAcre: 2450.0, currentStage: 'Physical Possession Handover', estimatedCostCr: 2800.0 },
  ];

  const list = projects.length > 0 ? projects : defaultProjects;

  const filtered = list.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.projectId?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        p.department?.toLowerCase().includes(q) ||
        p.agency?.toLowerCase().includes(q)
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
              <Layers className="w-3.5 h-3.5 text-indigo-700" />
              <span>PM Gati Shakti Master Registry</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Pan-India Infrastructure</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>National Infrastructure Projects Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro-level registry of multi-state economic corridors, dedicated freight lines, expressways, and renewable parks.
          </p>
        </div>

        <button
          onClick={() => navigate('/central/map')}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>View on Pan-India Map</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project name, code, state, district, ministry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">State:</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSearchParams(e.target.value === 'ALL' ? {} : { state: e.target.value });
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All States ({states.length || 10})</option>
              {states.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
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
              <option value="ACTIVE">Active</option>
              <option value="DELAYED">Delayed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Projects
        </div>
      </div>

      {/* Projects Table Matching Exact Requirements */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Department / Ministry</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Affected Parcels</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((p) => (
                <tr
                  key={p.projectId}
                  onClick={() => setSelectedProjectModal(p)}
                  className="hover:bg-indigo-50/40 transition cursor-pointer group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                        {p.projectId}
                      </span>
                      <span className="font-black text-slate-900 group-hover:text-indigo-600 transition">
                        {p.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {p.state}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {p.district || p.districts?.split(',')[0]}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 block">{p.agency || 'NHAI'}</span>
                    <span className="text-[10px] text-slate-500">{p.department || p.ministry || 'MoRTH'}</span>
                  </td>

                  <td className="py-4 px-4 min-w-[150px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-black text-slate-900">{p.progress}%</span>
                      <span className="text-slate-400 font-normal">Possessed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          p.progress >= 75
                            ? 'bg-emerald-500'
                            : p.progress >= 50
                            ? 'bg-indigo-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(p.progress, 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : p.status === 'DELAYED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center font-black text-slate-900">
                    {p.affectedParcels || 124} Parcels
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectModal(p);
                      }}
                      className="bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                    {selectedProjectModal.projectId}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      selectedProjectModal.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {selectedProjectModal.status}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedProjectModal.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProjectModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">State Jurisdiction</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.state}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Districts Alignment</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.districts || selectedProjectModal.district}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Stage</span>
                  <strong className="text-xs font-black text-indigo-700">{selectedProjectModal.currentStage || 'Section 19 Sanctioned'}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Affected Parcels</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.affectedParcels || 124} Parcels</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Land Required</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.totalLandAcre} Acres</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Sanctioned Outlay</span>
                  <strong className="text-xs font-black text-emerald-700">₹{selectedProjectModal.estimatedCostCr || 840} Cr</strong>
                </div>
              </div>

              {/* Progress Detail */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex justify-between text-xs font-bold text-indigo-900">
                  <span>Physical Possession Velocity</span>
                  <span>{selectedProjectModal.progress}% Completed</span>
                </div>
                <div className="w-full bg-indigo-200/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(selectedProjectModal.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-indigo-700/80">
                  <span>Acquired: {selectedProjectModal.acquiredLandAcre || 945} Acres</span>
                  <span>Target: {selectedProjectModal.totalLandAcre || 1450} Acres</span>
                </div>
              </div>

              {/* Sponsoring Ministry */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Nodal Ministry / Agency</span>
                <p>{selectedProjectModal.department || selectedProjectModal.ministry} • Executing Agency: {selectedProjectModal.agency}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedProjectModal(null);
                  navigate('/central/map');
                }}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-2 transition"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>View on Pan-India GIS Map</span>
              </button>

              <button
                onClick={() => setSelectedProjectModal(null)}
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

export const CentralProjectsPage = () => (
  <ErrorBoundary>
    <CentralProjectsContent />
  </ErrorBoundary>
);

export default CentralProjectsPage;
