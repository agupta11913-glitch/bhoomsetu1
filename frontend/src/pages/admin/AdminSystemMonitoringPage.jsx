import React, { useState, useEffect } from 'react';
import { fetchAdminSystemMonitoringApi } from '../../services/api/adminApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Server,
  Activity,
  Database,
  ShieldCheck,
  Users,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  Radio,
  Cpu,
  HardDrive,
  Network,
} from 'lucide-react';

const AdminSystemMonitoringContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastPing, setLastPing] = useState(new Date().toLocaleTimeString());

  const loadMonitoringData = async () => {
    setRefreshing(true);
    try {
      const res = await fetchAdminSystemMonitoringApi();
      if (res) setData(res);
      setLastPing(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Monitoring fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const defaultData = {
    apiStatus: { status: 'OPERATIONAL', latencyMs: 24, endpointsMonitored: 32, requestsPerMinute: 145 },
    databaseStatus: { status: 'HEALTHY', poolSize: 20, activeConnections: 4, queryAvgMs: 6.8 },
    authStatus: { status: 'SECURE', jwtAlgorithm: 'HS512', tokenExpiryMinutes: 1440, activeTokens: 42 },
    activeUsersCount: 38,
    recentErrors: [
      { id: 'ERR-2026-0881', service: 'NIC Bhulekh Sync Gateway', code: 'HTTP_504_GATEWAY_TIMEOUT', message: 'Upstream state Bhulekh server timed out after 5000ms. Auto-retried successfully.', timestamp: '2026-08-28 22:14:05', severity: 'LOW' },
      { id: 'ERR-2026-0882', service: 'PFMS DBT Validation Service', code: 'VALIDATION_WARNING', message: 'Bank account verification flagged for 1 PAF beneficiary due to single name record.', timestamp: '2026-08-28 23:05:12', severity: 'MEDIUM' },
    ],
  };

  const d = data || defaultData;
  const api = d.apiStatus || defaultData.apiStatus;
  const db = d.databaseStatus || defaultData.databaseStatus;
  const auth = d.authStatus || defaultData.authStatus;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-amber-700" />
              <span>Real-Time Health & Diagnostics</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Telemetry & Service Mesh</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>System Monitoring & Telemetry Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor REST microservices latency, HikariCP database connection pool, JWT IAM validator, concurrent active sessions, and recent system error events.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-[11px] text-slate-400 font-mono">Last check: {lastPing}</span>
          <button
            onClick={loadMonitoringData}
            disabled={refreshing}
            className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Ping Services</span>
          </button>
        </div>
      </div>

      {/* 4 Core Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. API Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">REST API Status</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{api.status}</span>
            <span className="text-xs font-bold text-slate-500">{api.latencyMs}ms avg</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>{api.endpointsMonitored} Endpoints Live</span>
            <span className="font-bold text-slate-700">{api.requestsPerMinute} req/min</span>
          </div>
        </div>

        {/* 2. Database Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Status</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700">{db.status}</span>
            <span className="text-xs font-bold text-slate-500">{db.queryAvgMs}ms latency</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Pool Size: {db.poolSize}</span>
            <span className="font-bold text-slate-700">{db.activeConnections} Active Conns</span>
          </div>
        </div>

        {/* 3. Authentication Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authentication IAM</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{auth.status}</span>
            <span className="text-xs font-bold text-slate-500">{auth.jwtAlgorithm}</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>24h Token Validity</span>
            <span className="font-bold text-slate-700">{auth.activeTokens} Valid Tokens</span>
          </div>
        </div>

        {/* 4. Active Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Users</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800">{d.activeUsersCount}</span>
            <span className="text-xs font-bold text-emerald-600">Online Now</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Central/State/Dist/PIA</span>
            <span className="font-bold text-slate-700">0 Security Locks</span>
          </div>
        </div>
      </div>

      {/* Subsystems Breakdown & Recent Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent System Errors (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Recent System & Gateway Diagnostics</span>
              </h3>
              <p className="text-xs text-slate-500">
                Log events from simulated state Bhulekh sync, PFMS DBT verifier, and GIS endpoints.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">{(d.recentErrors || []).length} Logged</span>
          </div>

          <div className="space-y-3">
            {(d.recentErrors || []).map((err) => (
              <div key={err.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {err.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{err.service}</h4>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                      err.severity === 'LOW'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {err.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{err.message}</p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span className="font-mono">{err.code}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {err.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: API Gateways Health Table (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-600" />
              <span>Simulated Government Gateways</span>
            </h3>
            <p className="text-xs text-slate-500">
              National land acquisition microservice mesh.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">NIC Bhulekh RoR Sync</span>
                <span className="text-[10px] text-slate-500 font-mono">/api/lands/verify-ror</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                UP (18ms)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">ISRO Bhuvan GIS Vector Tile</span>
                <span className="text-[10px] text-slate-500 font-mono">/api/gis/tiles</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                UP (32ms)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">PFMS DBT Disbursement</span>
                <span className="text-[10px] text-slate-500 font-mono">/api/pfms/dbt-credit</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                UP (45ms)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">AI Document OCR & Risk Engine</span>
                <span className="text-[10px] text-slate-500 font-mono">/api/ai/analyze</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                UP (85ms)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSystemMonitoringPage = () => (
  <ErrorBoundary fallbackTitle="System Monitoring Telemetry Error">
    <AdminSystemMonitoringContent />
  </ErrorBoundary>
);

export default AdminSystemMonitoringPage;
