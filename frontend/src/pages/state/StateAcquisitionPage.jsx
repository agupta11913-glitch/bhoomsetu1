import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchStateAcquisitionApi, fetchStateDistrictsApi } from '../../services/api/stateApi';
import { formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileCheck,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ArrowRight,
  Filter,
} from 'lucide-react';

const StateAcquisitionContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    Promise.all([
      fetchStateAcquisitionApi(stateName),
      fetchStateDistrictsApi(stateName),
    ]).then(([acq, dists]) => {
      if (Array.isArray(acq)) setData(acq);
      if (Array.isArray(dists)) setDistricts(dists);
      setLoading(false);
    });
  }, [stateName]);

  const defaultAcquisitions = [
    { projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion (NH-348)', district: 'Agra', totalParcels: 124, verified: 98, pending: 12, acquired: 84, progress: 67.7 },
    { projectId: 'PRJ-002', projectName: 'Agra Western Ring Road Phase-2', district: 'Agra', totalParcels: 48, verified: 42, pending: 6, acquired: 36, progress: 75.0 },
    { projectId: 'PRJ-003', projectName: 'Yamuna Expressway Interconnect Corridor', district: 'Gautam Buddha Nagar', totalParcels: 64, verified: 40, pending: 24, acquired: 28, progress: 43.8 },
    { projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', totalParcels: 96, verified: 74, pending: 22, acquired: 65, progress: 67.7 },
    { projectId: 'PRJ-006', projectName: 'Agra & Delhi Metro Rail Phase 4 Expansion', district: 'Agra', totalParcels: 36, verified: 34, pending: 2, acquired: 32, progress: 88.9 },
    { projectId: 'PRJ-011', projectName: 'Lucknow Ring Road Phase-3', district: 'Lucknow', totalParcels: 82, verified: 60, pending: 22, acquired: 51, progress: 62.2 },
    { projectId: 'PRJ-012', projectName: 'Ganga Expressway Feeder Node', district: 'Prayagraj', totalParcels: 110, verified: 68, pending: 42, acquired: 54, progress: 49.1 },
    { projectId: 'PRJ-013', projectName: 'Bundelkhand Mega Solar Renewable Park', district: 'Jhansi', totalParcels: 42, verified: 40, pending: 2, acquired: 38, progress: 90.5 },
  ];

  const list = data.length > 0 ? data : defaultAcquisitions;

  const filtered = list.filter((item) => {
    if (selectedDistrict !== 'ALL' && item.district !== selectedDistrict) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.projectName.toLowerCase().includes(q) ||
        item.projectId.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalParcelsCount = list.reduce((acc, curr) => acc + (curr.totalParcels || 0), 0);
  const totalAcquiredCount = list.reduce((acc, curr) => acc + (curr.acquired || 0), 0);
  const totalVerifiedCount = list.reduce((acc, curr) => acc + (curr.verified || 0), 0);
  const totalPendingCount = list.reduce((acc, curr) => acc + (curr.pending || 0), 0);
  const overallRate = totalParcelsCount > 0 ? Math.round((totalAcquiredCount / totalParcelsCount) * 1000) / 10 : 68.5;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-indigo-700" />
              <span>Right of Way (ROW) Cadastre</span>
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-600" />
            <span>State Land Acquisition Velocity</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Project and district wise breakdown of verified survey boundaries, pending joint verifications, and mutated government land.
          </p>
        </div>

        <button
          onClick={() => navigate('/state/map')}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>View on Statewide Map</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total State Parcels</span>
          <strong className="text-2xl font-black text-slate-900">{totalParcelsCount.toLocaleString()}</strong>
          <span className="text-[11px] text-slate-400 block">Across active linear corridors</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Acquired & Possessed</span>
          <strong className="text-2xl font-black text-emerald-700">{totalAcquiredCount.toLocaleString()}</strong>
          <span className="text-[11px] text-emerald-600 block">{overallRate}% State clearance rate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-indigo-700 block">Verified Surveyed</span>
          <strong className="text-2xl font-black text-indigo-700">{totalVerifiedCount.toLocaleString()}</strong>
          <span className="text-[11px] text-indigo-600 block">JMV joint inspections complete</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Pending Verification</span>
          <strong className="text-2xl font-black text-amber-700">{totalPendingCount.toLocaleString()}</strong>
          <span className="text-[11px] text-amber-600 block">Under Tehsildar/CALA inquiry</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project name, code, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Districts</option>
              {districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Acquisition Records
        </div>
      </div>

      {/* Acquisition Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4 text-center">Total Parcels</th>
                <th className="py-3.5 px-4 text-center">Verified</th>
                <th className="py-3.5 px-4 text-center">Pending</th>
                <th className="py-3.5 px-4 text-center">Acquired</th>
                <th className="py-3.5 px-4 min-w-[160px]">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={item.projectId} className="hover:bg-indigo-50/40 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                        {item.projectId}
                      </span>
                      <span className="font-black text-slate-900">{item.projectName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {item.district}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-slate-900">
                    {item.totalParcels}
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-indigo-700">
                    {item.verified}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {item.pending}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.acquired}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-black text-slate-900">{item.progress}%</span>
                      <span className="text-slate-400 font-normal">Possessed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.progress >= 75
                            ? 'bg-emerald-500'
                            : item.progress >= 50
                            ? 'bg-indigo-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(item.progress, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const StateAcquisitionPage = () => (
  <ErrorBoundary>
    <StateAcquisitionContent />
  </ErrorBoundary>
);

export default StateAcquisitionPage;
