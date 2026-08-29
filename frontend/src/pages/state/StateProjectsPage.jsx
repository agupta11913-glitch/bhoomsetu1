import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchStateProjectsApi, fetchStateDistrictsApi } from '../../services/api/stateApi';
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
  ShieldCheck,
} from 'lucide-react';

const StateProjectsContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDistrict = searchParams.get('district');

  const [projects, setProjects] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(urlDistrict || 'ALL');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    Promise.all([
      fetchStateProjectsApi(stateName, selectedDistrict),
      fetchStateDistrictsApi(stateName),
    ]).then(([prjs, dists]) => {
      if (Array.isArray(prjs)) setProjects(prjs);
      if (Array.isArray(dists)) setDistricts(dists);
      setLoading(false);
    });
  }, [stateName, selectedDistrict]);

  const defaultProjects = [
    { projectId: 'PRJ-001', name: 'Delhi–Meerut Expressway Expansion (NH-348)', district: 'Agra', districts: 'Agra, Meerut, Ghaziabad', agency: 'NHAI', department: 'Ministry of Road Transport & Highways', progress: 65.2, status: 'ACTIVE', timelineStatus: 'On-Track', affectedParcels: 124, totalLandAcre: 1450.0, acquiredLandAcre: 945.5, currentStage: 'Section 19 Sanctioned', estimatedCostCr: 840.0, affectedFamilies: 450 },
    { projectId: 'PRJ-002', name: 'Agra Western Ring Road Phase-2', district: 'Agra', districts: 'Agra', agency: 'NHAI & UP PWD', department: 'Public Works Department, UP', progress: 76.5, status: 'ACTIVE', timelineStatus: 'On-Track', affectedParcels: 48, totalLandAcre: 320.0, acquiredLandAcre: 245.0, currentStage: 'Section 19 Sanctioned', estimatedCostCr: 320.0, affectedFamilies: 180 },
    { projectId: 'PRJ-003', name: 'Yamuna Expressway Interconnect Corridor', district: 'Gautam Buddha Nagar', districts: 'Gautam Buddha Nagar, Agra', agency: 'YEIDA', department: 'Infrastructure & Industrial Dev Dept', progress: 43.8, status: 'DELAYED', timelineStatus: 'Delayed', affectedParcels: 64, totalLandAcre: 480.0, acquiredLandAcre: 290.0, currentStage: 'Section 15 Hearings Ongoing', estimatedCostCr: 540.0, affectedFamilies: 240 },
    { projectId: 'PRJ-005', name: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', districts: 'Agra, Mathura, Kanpur Nagar', agency: 'NHAI', department: 'MoRTH', progress: 69.3, status: 'ACTIVE', timelineStatus: 'On-Track', affectedParcels: 96, totalLandAcre: 880.0, acquiredLandAcre: 610.0, currentStage: 'Section 23 Award Declared', estimatedCostCr: 680.0, affectedFamilies: 380 },
    { projectId: 'PRJ-006', name: 'Agra & Delhi Metro Rail Phase 4 Expansion', district: 'Agra', districts: 'Agra, Gautam Buddha Nagar', agency: 'UPMRC', department: 'Housing & Urban Planning Dept', progress: 88.6, status: 'ACTIVE', timelineStatus: 'On-Track', affectedParcels: 36, totalLandAcre: 220.0, acquiredLandAcre: 195.0, currentStage: 'Physical Possession Handover', estimatedCostCr: 1250.0, affectedFamilies: 120 },
    { projectId: 'PRJ-011', name: 'Lucknow Ring Road Phase-3 Infrastructure Belt', district: 'Lucknow', districts: 'Lucknow, Unnao', agency: 'NHAI & UP PWD', department: 'Public Works Department, UP', progress: 62.7, status: 'ACTIVE', timelineStatus: 'Watchlist', affectedParcels: 82, totalLandAcre: 510.0, acquiredLandAcre: 320.0, currentStage: 'Section 19 Sanctioned', estimatedCostCr: 620.0, affectedFamilies: 310 },
    { projectId: 'PRJ-012', name: 'Ganga Expressway Feeder Node & Logistics Spur', district: 'Prayagraj', districts: 'Prayagraj, Rae Bareli', agency: 'UPEIDA', department: 'Expressways Authority, UP', progress: 49.1, status: 'DELAYED', timelineStatus: 'Delayed', affectedParcels: 110, totalLandAcre: 640.0, acquiredLandAcre: 380.0, currentStage: 'Section 15 Hearings Ongoing', estimatedCostCr: 780.0, affectedFamilies: 480 },
    { projectId: 'PRJ-013', name: 'Bundelkhand Mega Solar Renewable Park', district: 'Jhansi', districts: 'Jhansi, Lalitpur', agency: 'UPNEDA', department: 'Additional Sources of Energy Dept', progress: 88.6, status: 'ACTIVE', timelineStatus: 'On-Track', affectedParcels: 42, totalLandAcre: 350.0, acquiredLandAcre: 310.0, currentStage: 'Land Mutated & Possessed', estimatedCostCr: 410.0, affectedFamilies: 160 },
  ];

  const list = projects.length > 0 ? projects : defaultProjects;

  const filtered = list.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.projectId.toLowerCase().includes(q) ||
        p.agency?.toLowerCase().includes(q) ||
        p.department?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        p.districts?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-700" />
              <span>State Projects Portfolio</span>
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>State Infrastructure Projects Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized monitoring of linear expressway corridors, metro transit systems, and industrial zones across Uttar Pradesh.
          </p>
        </div>

        <button
          onClick={() => navigate('/state/map')}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start md:self-auto"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>View All on GIS Map</span>
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
              placeholder="Search project name, code, district, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* District Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSearchParams(e.target.value === 'ALL' ? {} : { district: e.target.value });
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Districts ({districts.length || 9})</option>
              {districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district}
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

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Department / Agency</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Affected Parcels</th>
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

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800">{p.district || p.districts?.split(',')[0]}</span>
                    {p.districts?.includes(',') && (
                      <span className="text-[10px] text-slate-400 block">+ multi-district</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 block">{p.agency || 'NHAI'}</span>
                    <span className="text-[10px] text-slate-500">{p.department || 'MoRTH'}</span>
                  </td>

                  <td className="py-4 px-4 min-w-[160px]">
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

                  <td className="py-4 px-4">
                    <span className="font-black text-slate-900 block">{p.affectedParcels || 48} Parcels</span>
                    <span className="text-[10px] text-slate-400">{p.totalLandAcre || 450} Acres</span>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Jurisdiction</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.districts || selectedProjectModal.district}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Requiring Agency</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.agency}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Stage</span>
                  <strong className="text-xs font-black text-indigo-700">{selectedProjectModal.currentStage || 'Section 19 Sanctioned'}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Affected Parcels</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.affectedParcels || 48} Parcels</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Land Required</span>
                  <strong className="text-xs font-black text-slate-900">{selectedProjectModal.totalLandAcre} Acres</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Outlay</span>
                  <strong className="text-xs font-black text-emerald-700">₹{selectedProjectModal.estimatedCostCr || 840} Cr</strong>
                </div>
              </div>

              {/* Progress Detail */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex justify-between text-xs font-bold text-indigo-900">
                  <span>Corridor Possession Velocity</span>
                  <span>{selectedProjectModal.progress}% Completed</span>
                </div>
                <div className="w-full bg-indigo-200/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(selectedProjectModal.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-indigo-700/80">
                  <span>Acquired: {selectedProjectModal.acquiredLandAcre || 310} Acres</span>
                  <span>Target: {selectedProjectModal.totalLandAcre || 450} Acres</span>
                </div>
              </div>

              {/* Department Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Sponsoring Department</span>
                <p>{selectedProjectModal.department || 'Ministry of Road Transport & Highways, Government of India'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedProjectModal(null);
                  navigate('/state/map');
                }}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-2 transition"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>View on Statewide Map</span>
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

export const StateProjectsPage = () => (
  <ErrorBoundary>
    <StateProjectsContent />
  </ErrorBoundary>
);

export default StateProjectsPage;
