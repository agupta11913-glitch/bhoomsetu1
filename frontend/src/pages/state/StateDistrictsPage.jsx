import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchStateDistrictsApi, fetchStateProjectsApi } from '../../services/api/stateApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Building2,
  MapPin,
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
} from 'lucide-react';

const StateDistrictsContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [districts, setDistricts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDistrictModal, setSelectedDistrictModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    Promise.all([
      fetchStateDistrictsApi(stateName),
      fetchStateProjectsApi(stateName, 'ALL'),
    ]).then(([dists, prjs]) => {
      if (Array.isArray(dists)) setDistricts(dists);
      if (Array.isArray(prjs)) setProjects(prjs);
      setLoading(false);
    });
  }, [stateName]);

  const defaultDistricts = [
    { district: 'Agra', projectsCount: 5, projects: ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-005', 'PRJ-006'], acquisitionProgress: 70.9, compensationTotalCr: 184.6, compensationPaidCr: 136.95, rrProgress: 81.0, delayedCases: 1, activeDisputes: 3, status: 'ON_TRACK', collectorName: 'Dr. Sunita Murthy, IAS' },
    { district: 'Meerut', projectsCount: 4, projects: ['PRJ-001', 'PRJ-004', 'PRJ-007', 'PRJ-008'], acquisitionProgress: 68.6, compensationTotalCr: 142.0, compensationPaidCr: 105.0, rrProgress: 78.4, delayedCases: 0, activeDisputes: 5, status: 'ON_TRACK', collectorName: 'Sh. Deepak Meena, IAS' },
    { district: 'Lucknow', projectsCount: 6, projects: ['PRJ-011', 'PRJ-014', 'PRJ-015', 'PRJ-016', 'PRJ-017', 'PRJ-018'], acquisitionProgress: 76.5, compensationTotalCr: 210.0, compensationPaidCr: 175.5, rrProgress: 86.2, delayedCases: 0, activeDisputes: 8, status: 'ON_TRACK', collectorName: 'Smt. Surya Pal Gangwar, IAS' },
    { district: 'Varanasi', projectsCount: 3, projects: ['PRJ-021', 'PRJ-022', 'PRJ-023'], acquisitionProgress: 74.1, compensationTotalCr: 115.0, compensationPaidCr: 92.0, rrProgress: 84.0, delayedCases: 0, activeDisputes: 4, status: 'ON_TRACK', collectorName: 'Sh. S. Rajalingam, IAS' },
    { district: 'Prayagraj', projectsCount: 4, projects: ['PRJ-012', 'PRJ-024', 'PRJ-025', 'PRJ-026'], acquisitionProgress: 60.3, compensationTotalCr: 130.0, compensationPaidCr: 84.0, rrProgress: 69.5, delayedCases: 1, activeDisputes: 12, status: 'WATCHLIST', collectorName: 'Sh. Sanjay Kumar Khatri, IAS' },
    { district: 'Jhansi', projectsCount: 2, projects: ['PRJ-013', 'PRJ-027'], acquisitionProgress: 88.1, compensationTotalCr: 75.0, compensationPaidCr: 68.0, rrProgress: 91.5, delayedCases: 0, activeDisputes: 1, status: 'ON_TRACK', collectorName: 'Sh. Ravindra Kumar, IAS' },
    { district: 'Gorakhpur', projectsCount: 3, projects: ['PRJ-028', 'PRJ-029', 'PRJ-030'], acquisitionProgress: 69.2, compensationTotalCr: 98.0, compensationPaidCr: 74.0, rrProgress: 76.0, delayedCases: 0, activeDisputes: 3, status: 'ON_TRACK', collectorName: 'Sh. Krishna Karunesh, IAS' },
    { district: 'Kanpur Nagar', projectsCount: 4, projects: ['PRJ-005', 'PRJ-031', 'PRJ-032', 'PRJ-033'], acquisitionProgress: 65.6, compensationTotalCr: 128.0, compensationPaidCr: 90.0, rrProgress: 72.8, delayedCases: 1, activeDisputes: 6, status: 'DELAYED', collectorName: 'Sh. Vishak G. Iyer, IAS' },
    { district: 'Gautam Buddha Nagar', projectsCount: 5, projects: ['PRJ-003', 'PRJ-006', 'PRJ-034', 'PRJ-035', 'PRJ-036'], acquisitionProgress: 83.7, compensationTotalCr: 240.0, compensationPaidCr: 208.0, rrProgress: 89.0, delayedCases: 0, activeDisputes: 2, status: 'ON_TRACK', collectorName: 'Sh. Manish Kumar Verma, IAS' },
  ];

  const list = districts.length > 0 ? districts : defaultDistricts;

  const filtered = list.filter((d) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.district.toLowerCase().includes(q) ||
        d.collectorName?.toLowerCase().includes(q) ||
        d.status?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getDistrictProjects = (distName) => {
    return projects.filter((p) => {
      if (!p.districts && !p.district) return false;
      const target = (p.districts || p.district || '').toLowerCase();
      return target.includes(distName.toLowerCase());
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-700" />
              <span>Collectorate Jurisdiction Oversight</span>
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span>District Monitoring & Collectorate Performance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-district tracking of CALA land acquisition velocity, DBT award disbursements, R&R compliance, and overdue cases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-50/80 border border-indigo-100 px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-indigo-600">Active Districts</div>
            <div className="text-xl font-black text-indigo-900">{list.length} Districts</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search district name, collector name, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Districts
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((dist) => {
          const distProjects = getDistrictProjects(dist.district);
          return (
            <div
              key={dist.district}
              onClick={() => setSelectedDistrictModal(dist)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-indigo-300 transition cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* District Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-black text-indigo-700 uppercase tracking-wide">
                      District Collectorate
                    </span>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition">
                      {dist.district}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      CALA Nodal: <span className="text-slate-800 font-bold">{dist.collectorName}</span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      dist.status === 'ON_TRACK'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : dist.status === 'WATCHLIST'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {dist.status?.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Indicators */}
                <div className="mt-4 space-y-3">
                  {/* Acquisition Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Acquisition Progress</span>
                      </span>
                      <span className="font-black text-slate-900">{dist.acquisitionProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(dist.acquisitionProgress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Compensation & R&R Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Banknote className="w-3 h-3 text-emerald-600" />
                        <span>Compensation</span>
                      </div>
                      <div className="text-sm font-black text-emerald-700 mt-0.5">
                        ₹{dist.compensationPaidCr} Cr
                      </div>
                      <div className="text-[10px] text-slate-400">of ₹{dist.compensationTotalCr} Cr</div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-purple-600" />
                        <span>R&R Velocity</span>
                      </div>
                      <div className="text-sm font-black text-purple-700 mt-0.5">
                        {dist.rrProgress}%
                      </div>
                      <div className="text-[10px] text-slate-400">PAF resettled</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {dist.projectsCount} Corridors
                  </span>
                  {dist.delayedCases > 0 ? (
                    <span className="text-rose-600 font-bold flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" />
                      <span>{dist.delayedCases} Delayed</span>
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>0 Delays</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 font-bold text-indigo-600 group-hover:translate-x-1 transition">
                  <span>View Projects</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* District Click -> Modal showing projects */}
      {selectedDistrictModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  District Jurisdiction Projects
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedDistrictModal.district} District • {selectedDistrictModal.projectsCount} Corridors
                </h2>
                <p className="text-xs text-slate-500">
                  Competent Authority (CALA): {selectedDistrictModal.collectorName}
                </p>
              </div>

              <button
                onClick={() => setSelectedDistrictModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {getDistrictProjects(selectedDistrictModal.district).length > 0 ? (
                getDistrictProjects(selectedDistrictModal.district).map((p) => (
                  <div
                    key={p.projectId}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-md font-mono">
                          {p.projectId}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Agency: {p.agency || 'NHAI'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Progress: <strong className="text-indigo-700">{p.progress}%</strong></span>
                        <span>•</span>
                        <span>Parcels: <strong className="text-slate-800">{p.affectedParcels || 48}</strong></span>
                        <span>•</span>
                        <span>Status: <strong className="text-emerald-700">{p.status}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedDistrictModal(null);
                          navigate(`/state/projects?district=${selectedDistrictModal.district}`);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                      >
                        <span>Project Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-indigo-50/60 rounded-2xl text-center text-xs text-indigo-900 font-bold">
                  All corridors for {selectedDistrictModal.district} are actively mapped.
                  <button
                    onClick={() => {
                      setSelectedDistrictModal(null);
                      navigate(`/state/projects?district=${selectedDistrictModal.district}`);
                    }}
                    className="mt-2 block mx-auto bg-indigo-700 text-white px-4 py-1.5 rounded-xl"
                  >
                    View All {selectedDistrictModal.district} Corridors
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedDistrictModal(null);
                  navigate(`/state/map`);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View {selectedDistrictModal.district} on GIS Map</span>
              </button>

              <button
                onClick={() => setSelectedDistrictModal(null)}
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

export const StateDistrictsPage = () => (
  <ErrorBoundary>
    <StateDistrictsContent />
  </ErrorBoundary>
);

export default StateDistrictsPage;
