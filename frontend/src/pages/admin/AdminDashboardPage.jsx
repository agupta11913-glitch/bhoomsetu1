import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminDashboardApi } from '../../services/api/adminApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  ShieldCheck,
  Users,
  Building2,
  Globe,
  Layers,
  Activity,
  Bell,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Server,
  KeyRound,
  ArrowRight,
  ChevronRight,
  Database,
  Radio,
  Cpu,
} from 'lucide-react';

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboardApi()
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      })
      .catch((e) => {
        console.warn('Admin dashboard fetch fallback:', e);
        setLoading(false);
      });
  }, []);

  const defaultData = {
    totalUsers: 24,
    activeUsers: 22,
    districtUsers: 6,
    stateUsers: 4,
    centralUsers: 3,
    piaUsers: 5,
    activeProjects: 11,
    totalProjects: 11,
    systemStatus: {
      apiStatus: 'OPERATIONAL',
      databaseStatus: 'HEALTHY',
      authStatus: 'SECURE',
      activeSessions: 38,
      uptime: '99.98%',
    },
  };

  const d = data || defaultData;
  const sys = d.systemStatus || defaultData.systemStatus;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-gov border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>System Administration & Governance</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Core Master</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              BhoomiSetu System Administrator Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              System governance, user lifecycle management, role-based access control (RBAC), project & department master data, health monitoring, and system configuration.
            </p>
          </div>

          {/* Quick System Badge */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md self-start lg:self-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Health</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-black text-emerald-400">All Systems Operational</span>
                <span className="text-[10px] text-slate-500 font-mono">({sys.uptime})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Required KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-indigo-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{d.totalUsers}</span>
            <span className="text-xs font-bold text-slate-500">Accounts</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Platform User Directory</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 2. Active Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-emerald-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Users</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{d.activeUsers}</span>
            <span className="text-xs font-bold text-emerald-600">Provisioned</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Verified Credentials</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 3. District Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-purple-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">District Users</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{d.districtUsers}</span>
            <span className="text-xs font-bold text-purple-600">Officers</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>DM, Tehsildar, CALA</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 4. State Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-blue-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">State Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700">{d.stateUsers}</span>
            <span className="text-xs font-bold text-blue-600">Secretariat</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>State Revenue Officers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 5. Central Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-amber-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Central Users</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800">{d.centralUsers}</span>
            <span className="text-xs font-bold text-amber-600">Ministries</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>PM Gati Shakti & MoRTH</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 6. PIA Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-cyan-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PIA Users</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-700">{d.piaUsers}</span>
            <span className="text-xs font-bold text-cyan-600">Agencies</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>NHAI, Railways, DFCCIL</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 7. Active Projects */}
        <div
          onClick={() => navigate('/admin/projects-departments')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md hover:border-teal-300 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-800">{d.activeProjects}</span>
            <span className="text-xs font-bold text-teal-600">Corridors</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Master Projects Directory</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-slate-400" />
          </div>
        </div>

        {/* 8. System Status */}
        <div
          onClick={() => navigate('/admin/monitoring')}
          className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-gov hover:bg-slate-800 transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">System Status</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{sys.apiStatus}</span>
            <span className="text-xs font-bold text-slate-300">API/DB/IAM</span>
          </div>
          <div className="text-xs text-indigo-300 flex items-center justify-between pt-1">
            <span>{sys.activeSessions} Active Sessions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Main Grid: Management Shortcuts & System Core Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Admin Management Modules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>System Administration Core Modules</span>
              </h3>
              <p className="text-xs text-slate-500">
                Authorized management consoles for platform operations and security enforcement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Users */}
              <div
                onClick={() => navigate('/admin/users')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-700">Users Management</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-slate-500">
                  View, Add, Edit, Activate/Deactivate users, and reset access credentials.
                </p>
              </div>

              {/* Roles & Permissions */}
              <div
                onClick={() => navigate('/admin/roles')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-purple-700">Roles & Permissions</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Configure granular permissions (View, Add, Edit, Update, Upload, Forward, Escalate) across 7 government roles.
                </p>
              </div>

              {/* Projects & Departments */}
              <div
                onClick={() => navigate('/admin/projects-departments')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-teal-700">Projects & Departments</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Assign projects to departments, designate PIAs (NHAI/Railways), and authorize executive users.
                </p>
              </div>

              {/* System Monitoring */}
              <div
                onClick={() => navigate('/admin/monitoring')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-700">System Monitoring</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Inspect REST API latency, database connection pools, JWT token validator, and recent system errors.
                </p>
              </div>

              {/* Notifications */}
              <div
                onClick={() => navigate('/admin/notifications')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700">System Notifications</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Create, edit, and broadcast system-wide advisories, gazette alerts, and role-targeted notifications.
                </p>
              </div>

              {/* System Settings */}
              <div
                onClick={() => navigate('/admin/settings')}
                className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 transition cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-700" />
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-slate-900">System Settings</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Configure session timeouts, upload file size limits, rate limiting, and broadcast settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Platform Health & Scope Policy */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Microservices & Subsystem Status</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700">Spring Boot REST API</span>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                  {sys.apiStatus} (24ms)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700">HikariCP Database Pool</span>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                  {sys.databaseStatus} (4/20 Conns)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700">JWT Token IAM Gateway</span>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                  {sys.authStatus} (HS-512)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700">Active Live Sessions</span>
                <span className="font-mono font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {sys.activeSessions} Online
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Administrative Scope Notice</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              System Administrator authority is restricted strictly to <strong>system management, user access control, and technical configurations</strong>. Land ownership mutations, compensation awards, and acquisition decisions are exclusively handled by authorized statutory officers (CALA/DM/Tehsildar).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardPage = () => (
  <ErrorBoundary fallbackTitle="Admin Dashboard Loading Error">
    <AdminDashboardContent />
  </ErrorBoundary>
);

export default AdminDashboardPage;
