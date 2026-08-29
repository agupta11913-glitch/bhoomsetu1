import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictOfficersApi } from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  Search,
  Building2,
} from 'lucide-react';

const DistrictOfficersContent = () => {
  const { currentUser } = useAuth();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistrictOfficersApi(currentUser?.district || 'Agra').then((data) => {
      if (Array.isArray(data)) setOfficers(data);
      setLoading(false);
    });
  }, [currentUser]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Workforce & SLA Monitoring
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>District Field Officers & Tehsildar Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Workload distribution, case disposal rates, and average inquiry turnaround times for CALA teams.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Active Officers</span>
          <strong className="text-xl font-black text-purple-700">{officers.length} Officers</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {officers.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-gov space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-700">{o.id}</span>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                {o.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900">{o.name}</h3>
              <p className="text-xs text-purple-700 font-bold">{o.designation}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{o.department}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Assigned</span>
                <strong className="text-slate-800">{o.assignedCases}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Completed</span>
                <strong className="text-emerald-700">{o.completedCases}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Pending</span>
                <strong className="text-amber-700">{o.pendingCases}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Avg Turnaround:</span>
              <strong className="text-purple-700">{o.avgTurnaroundDays} Days / Case</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DistrictOfficersPage = () => (
  <ErrorBoundary>
    <DistrictOfficersContent />
  </ErrorBoundary>
);

export default DistrictOfficersPage;
