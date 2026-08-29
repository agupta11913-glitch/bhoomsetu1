import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAgencyAcquisitionApi } from '../../services/api/agencyApi';
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

const AgencyAcquisitionContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyAcquisitionApi().then((acq) => {
      if (Array.isArray(acq)) setData(acq);
      setLoading(false);
    });
  }, []);

  const defaultAcquisitions = [
    { projectId: 'PRJ-001', projectName: 'Delhi–Meerut Expressway Expansion', district: 'Agra', totalParcels: 124, verified: 98, pending: 12, acquired: 84, disputed: 14, progress: 67.7 },
    { projectId: 'PRJ-002', projectName: 'Agra Western Ring Road Phase-2', district: 'Agra', totalParcels: 48, verified: 42, pending: 6, acquired: 36, disputed: 4, progress: 75.0 },
    { projectId: 'PRJ-005', projectName: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', totalParcels: 96, verified: 74, pending: 22, acquired: 65, disputed: 9, progress: 67.7 },
    { projectId: 'PRJ-011', projectName: 'Lucknow Ring Road Phase-3', district: 'Lucknow', totalParcels: 82, verified: 60, pending: 22, acquired: 51, disputed: 9, progress: 62.2 },
  ];

  const list = data.length > 0 ? data : defaultAcquisitions;

  const filtered = list.filter((item) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.projectName?.toLowerCase().includes(q) ||
        item.projectId?.toLowerCase().includes(q) ||
        item.district?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalParcels = list.reduce((acc, curr) => acc + (curr.totalParcels || 0), 0);
  const totalAcquired = list.reduce((acc, curr) => acc + (curr.acquired || 0), 0);
  const totalVerified = list.reduce((acc, curr) => acc + (curr.verified || 0), 0);
  const totalPending = list.reduce((acc, curr) => acc + (curr.pending || 0), 0);
  const totalDisputed = list.reduce((acc, curr) => acc + (curr.disputed || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-50 text-cyan-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase tracking-wider flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-cyan-700" />
              <span>Right of Way Possession Tracker</span>
            </span>
            <span className="text-xs font-bold text-slate-500">CALA Handover Monitoring</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-cyan-600" />
            <span>Assigned Land Acquisition Status</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor physical possession handovers, verified parcels, and statutory Section 19 mutated parcels for assigned corridors.
          </p>
        </div>

        <button
          onClick={() => navigate('/agency/map')}
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>View on Map</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Parcels</span>
          <strong className="text-2xl font-black text-slate-900">{totalParcels}</strong>
          <span className="text-[10px] text-slate-400 block">Across 4 packages</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-emerald-700 block">Acquired & Handed Over</span>
          <strong className="text-2xl font-black text-emerald-700">{totalAcquired}</strong>
          <span className="text-[10px] text-emerald-600 block">Physical possession granted</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-cyan-700 block">Verified Surveyed</span>
          <strong className="text-2xl font-black text-cyan-700">{totalVerified}</strong>
          <span className="text-[10px] text-cyan-600 block">JMV peg demarcation done</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-amber-700 block">Pending Verification</span>
          <strong className="text-2xl font-black text-amber-700">{totalPending}</strong>
          <span className="text-[10px] text-amber-600 block">Under CALA review</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-rose-700 block">Disputed Parcels</span>
          <strong className="text-2xl font-black text-rose-700">{totalDisputed}</strong>
          <span className="text-[10px] text-rose-600 block">Under Section 15 inquiry</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name, code, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
          />
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filtered.length} of {list.length} Acquisition Packages
        </div>
      </div>

      {/* Acquisition Table Matching Exact Schema */}
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
                <th className="py-3.5 px-4 text-center">Disputed</th>
                <th className="py-3.5 px-4 min-w-[150px]">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={item.projectId} className="hover:bg-cyan-50/40 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-100">
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

                  <td className="py-4 px-4 text-center font-bold text-cyan-700">
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

                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      {item.disputed}
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
                            ? 'bg-cyan-600'
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

export const AgencyAcquisitionPage = () => (
  <ErrorBoundary>
    <AgencyAcquisitionContent />
  </ErrorBoundary>
);

export default AgencyAcquisitionPage;
