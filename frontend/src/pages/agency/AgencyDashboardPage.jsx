import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAgencyDashboardApi } from '../../services/api/agencyApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Layers,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  Banknote,
  MapPin,
  FileText,
  ArrowRight,
  ChevronRight,
  Building2,
  CheckCircle2,
  Activity,
} from 'lucide-react';

const AgencyDashboardContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyDashboardApi()
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      })
      .catch((e) => {
        console.warn('Dashboard fetch error fallback:', e);
        setLoading(false);
      });
  }, []);

  const defaultData = {
    officerName: 'Sh. Rajesh Verma',
    designation: 'Chief Project Director & Head of Implementation',
    agency: 'National Highways Authority of India (NHAI)',
    totalAssignedProjects: 4,
    activeProjects: 4,
    overallProgress: 68.4,
    landAcquisitionProgress: 71.2,
    compensationRnRProgress: 77.8,
    pendingIssues: 3,
    delayedActivities: 1,
    assignedProjects: [
      { projectId: 'PRJ-001', name: 'Delhi–Meerut Expressway Expansion (NH-348)', district: 'Agra', progress: 65.2, status: 'ACTIVE', affectedParcels: 124 },
      { projectId: 'PRJ-002', name: 'Agra Western Ring Road Phase-2', district: 'Agra', progress: 76.5, status: 'ACTIVE', affectedParcels: 48 },
      { projectId: 'PRJ-005', name: 'National Highway-19 6-Lane Expansion', district: 'Kanpur Nagar', progress: 69.3, status: 'ACTIVE', affectedParcels: 96 },
      { projectId: 'PRJ-011', name: 'Lucknow Ring Road Phase-3 Infrastructure Belt', district: 'Lucknow', progress: 62.7, status: 'ACTIVE', affectedParcels: 82 },
    ],
  };

  const d = data || defaultData;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-gov border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>{d.agency || 'Project Implementing Agency (PIA)'}</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Assigned Infrastructure Execution</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {d.officerName || 'Sh. Rajesh Verma'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              {d.designation || 'Chief Project Director'} • Execution, milestone tracking, land acquisition handover, and bottleneck resolution for authorized infrastructure packages.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md self-start lg:self-auto">
            <div className="px-3 border-r border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Assigned Projects</div>
              <div className="text-2xl font-black text-white">{d.totalAssignedProjects || 4}</div>
            </div>
            <div className="px-3 border-r border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Overall Velocity</div>
              <div className="text-2xl font-black text-cyan-400">{d.overallProgress || 68.4}%</div>
            </div>
            <div className="px-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Open Issues</div>
              <div className="text-2xl font-black text-amber-400">{d.pendingIssues || 3}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: Exact 7 Required Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Assigned Projects */}
        <div
          onClick={() => navigate('/project-agency/projects')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-cyan-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Assigned Projects</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.totalAssignedProjects || 4}</span>
            <span className="text-xs font-bold text-slate-500">Corridors</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Authorized Packages</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 2. Active Projects */}
        <div
          onClick={() => navigate('/project-agency/projects')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-emerald-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{d.activeProjects || 4}</span>
            <span className="text-xs font-bold text-emerald-600">In Execution</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Civil Construction Active</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 3. Overall Progress */}
        <div
          onClick={() => navigate('/project-agency/progress')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-blue-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.overallProgress || 68.4}%</span>
            <span className="text-xs font-bold text-blue-600">Cumulative</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Milestones & Construction</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 4. Land Acquisition Progress */}
        <div
          onClick={() => navigate('/project-agency/acquisition')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-indigo-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Land Acquisition Progress</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-700">{d.landAcquisitionProgress || 71.2}%</span>
            <span className="text-xs font-bold text-slate-500">Possessed</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>CALA / Revenue Handover</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 5. Compensation / R&R Progress */}
        <div
          onClick={() => navigate('/project-agency/compensation-rnr')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-purple-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compensation / R&R</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{d.compensationRnRProgress || 77.8}%</span>
            <span className="text-xs font-bold text-purple-600">Disbursed</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>PFMS DBT & PAF Support</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 6. Pending Issues */}
        <div
          onClick={() => navigate('/project-agency/issues')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-amber-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Issues</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800">{d.pendingIssues || 3}</span>
            <span className="text-xs font-bold text-amber-600">Active</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Utility & Boundary Roadblocks</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 7. Delayed Activities */}
        <div
          onClick={() => navigate('/project-agency/progress')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-rose-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delayed Activities</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">{d.delayedActivities || 1}</span>
            <span className="text-xs font-bold text-rose-600">Milestone</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Overdue Target Timeline</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* GIS Map Card */}
        <div
          onClick={() => navigate('/project-agency/map')}
          className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-gov hover:bg-slate-800 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Assigned GIS Cadastre</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center group-hover:scale-110 transition">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">GIS Map</span>
            <span className="text-xs font-bold text-cyan-300">4 Corridors</span>
          </div>
          <div className="text-xs text-cyan-200 flex items-center justify-between pt-1">
            <span>Vector Alignment & ROW</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Mid Section: Assigned Projects List & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Projects Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-600" />
                <span>Assigned Infrastructure Projects</span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct execution oversight of corridors assigned to {d.agency || 'NHAI'}.
              </p>
            </div>

            <button
              onClick={() => navigate('/project-agency/projects')}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition"
            >
              <span>Manage Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {(d.assignedProjects || []).map((p) => (
              <div
                key={p.projectId}
                onClick={() => navigate('/project-agency/projects')}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 hover:bg-cyan-50/40 hover:border-cyan-200 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-100">
                      {p.projectId}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-cyan-700 transition">
                      {p.name}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>District: <strong className="text-slate-700">{p.district}</strong></span>
                    <span>•</span>
                    <span>Affected Parcels: <strong className="text-slate-700">{p.affectedParcels}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right min-w-[100px]">
                    <div className="text-xs font-black text-slate-900">{p.progress}%</div>
                    <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
                      <div
                        className="bg-cyan-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(p.progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick PIA Shortcuts & Reports */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>PIA Implementation Actions</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => navigate('/project-agency/progress')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-200 transition font-bold text-slate-800 flex items-center justify-between"
              >
                <span>Update Project Milestones</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/project-agency/issues')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition font-bold text-slate-800 flex items-center justify-between"
              >
                <span>Report Site Issue / Roadblock</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/project-agency/documents')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition font-bold text-slate-800 flex items-center justify-between"
              >
                <span>Upload Project Drawings / DPR</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div
            onClick={() => navigate('/project-agency/reports')}
            className="bg-cyan-900 text-white rounded-2xl p-5 border border-cyan-800 shadow-gov hover:bg-cyan-800 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-cyan-300 font-bold text-xs uppercase tracking-wider">
              <span>Agency Reports</span>
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-base font-black text-white">Generate Implementation Reports</h4>
            <p className="text-xs text-cyan-200/80">
              Export Progress, Acquisition, Compensation & Issues summary to CSV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgencyDashboardPage = () => (
  <ErrorBoundary>
    <AgencyDashboardContent />
  </ErrorBoundary>
);

export default AgencyDashboardPage;
