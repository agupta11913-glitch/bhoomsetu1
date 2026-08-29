import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCentralAcquisitionApi, fetchCentralStatesApi } from '../../services/api/centralApi';
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
  Globe,
} from 'lucide-react';

const CentralAcquisitionContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCentralAcquisitionApi(),
      fetchCentralStatesApi(),
    ]).then(([acq, sts]) => {
      if (Array.isArray(acq)) setData(acq);
      if (Array.isArray(sts)) setStates(sts);
      setLoading(false);
    });
  }, []);

  const defaultAcquisitions = [
    { state: 'Uttar Pradesh', district: 'Agra', projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', totalParcels: 124, verified: 98, pending: 12, acquired: 84, progress: 67.7 },
    { state: 'Haryana', district: 'Rewari', projectId: 'PRJ-002', projectName: 'Dedicated Freight Corridor (Western DFC)', totalParcels: 210, verified: 190, pending: 20, acquired: 168, progress: 80.0 },
    { state: 'Maharashtra', district: 'Raigad', projectId: 'PRJ-003', projectName: 'Delhi-Mumbai Industrial Corridor (DMIC Hub)', totalParcels: 180, verified: 140, pending: 40, acquired: 114, progress: 63.3 },
    { state: 'Gujarat', district: 'Surat', projectId: 'PRJ-004', projectName: 'Mumbai–Ahmedabad High Speed Rail (MAHSR)', totalParcels: 320, verified: 320, pending: 0, acquired: 316, progress: 98.8 },
    { state: 'Uttar Pradesh', district: 'Kanpur Nagar', projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', totalParcels: 96, verified: 74, pending: 22, acquired: 65, progress: 67.7 },
    { state: 'Madhya Pradesh', district: 'Panna', projectId: 'PRJ-007', projectName: 'Ken-Betwa River Interlinking Canal Project', totalParcels: 450, verified: 260, pending: 190, acquired: 240, progress: 53.3 },
    { state: 'Rajasthan', district: 'Jodhpur', projectId: 'PRJ-008', projectName: 'Bhadla Mega Solar Renewable Energy Park', totalParcels: 80, verified: 78, pending: 2, acquired: 75, progress: 93.8 },
    { state: 'Karnataka', district: 'Kolar', projectId: 'PRJ-009', projectName: 'Bangalore-Chennai Industrial Corridor (BCIC)', totalParcels: 140, verified: 110, pending: 30, acquired: 92, progress: 65.7 },
    { state: 'Bihar', district: 'Rohtas', projectId: 'PRJ-010', projectName: 'Eastern Dedicated Freight Corridor Expansion', totalParcels: 260, verified: 210, pending: 50, acquired: 205, progress: 78.8 },
    { state: 'Uttar Pradesh', district: 'Prayagraj', projectId: 'PRJ-012', projectName: 'Ganga Expressway Feeder Node', totalParcels: 110, verified: 68, pending: 42, acquired: 54, progress: 49.1 },
  ];

  const list = data.length > 0 ? data : defaultAcquisitions;

  const filtered = list.filter((item) => {
    if (selectedState !== 'ALL' && item.state !== selectedState) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.projectName?.toLowerCase().includes(q) ||
        item.projectId?.toLowerCase().includes(q) ||
        item.state?.toLowerCase().includes(q) ||
        item.district?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalParcelsCount = list.reduce((acc, curr) => acc + (curr.totalParcels || 0), 0);
  const totalAcquiredCount = list.reduce((acc, curr) => acc + (curr.acquired || 0), 0);
  const totalVerifiedCount = list.reduce((acc, curr) => acc + (curr.verified || 0), 0);
  const totalPendingCount = list.reduce((acc, curr) => acc + (curr.pending || 0), 0);
  const overallRate = totalParcelsCount > 0 ? Math.round((totalAcquiredCount / totalParcelsCount) * 1000) / 10 : 75.9;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-700" />
              <span>Pan-India ROW Cadastre</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Central Monitoring</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-600" />
            <span>National Land Acquisition Velocity</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized monitoring of linear corridor land possession, joint survey verifications, and mutated ROW acreage.
          </p>
        </div>

        <button
          onClick={() => navigate('/central/map')}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>View on GIS Map</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Tracked Parcels</span>
          <strong className="text-2xl font-black text-slate-900">{totalParcelsCount.toLocaleString()}</strong>
          <span className="text-[11px] text-slate-400 block">Across national corridors</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Acquired & Possessed</span>
          <strong className="text-2xl font-black text-emerald-700">{totalAcquiredCount.toLocaleString()}</strong>
          <span className="text-[11px] text-emerald-600 block">{overallRate}% National clearance rate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-indigo-700 block">Verified Surveyed</span>
          <strong className="text-2xl font-black text-indigo-700">{totalVerifiedCount.toLocaleString()}</strong>
          <span className="text-[11px] text-indigo-600 block">Joint JMV inspections complete</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Pending Verification</span>
          <strong className="text-2xl font-black text-amber-700">{totalPendingCount.toLocaleString()}</strong>
          <span className="text-[11px] text-amber-600 block">Under CALA/State revenue review</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project name, code, state, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All States</option>
              {states.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Acquisition Records
        </div>
      </div>

      {/* Acquisition Table Matching Exact Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4 text-center">Total Parcels</th>
                <th className="py-3.5 px-4 text-center">Verified</th>
                <th className="py-3.5 px-4 text-center">Pending</th>
                <th className="py-3.5 px-4 text-center">Acquired</th>
                <th className="py-3.5 px-4 min-w-[150px]">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={`${item.state}-${item.projectId}`} className="hover:bg-indigo-50/40 transition">
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {item.state}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {item.district}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                        {item.projectId}
                      </span>
                      <span className="font-black text-slate-900">{item.projectName}</span>
                    </div>
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

export const CentralAcquisitionPage = () => (
  <ErrorBoundary>
    <CentralAcquisitionContent />
  </ErrorBoundary>
);

export default CentralAcquisitionPage;
