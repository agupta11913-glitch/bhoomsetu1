import React, { useState, useEffect } from 'react';
import { fetchRevenueNotificationsApi } from '../../services/api/revenueOfficerApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Bell,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';

const RevenueOfficerNotificationsContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueNotificationsApi();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error('Notifications load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Statutory Alerts & Gazettes
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Tehsil Workflow Dispatch
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Revenue Officer Official Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time notifications for newly assigned acquisition cases, Tehsildar corrections, citizen objections, and verification milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className="p-4 hover:bg-slate-50/80 transition flex items-start gap-3.5 text-xs">
              <div className="p-2 bg-amber-50 text-amber-800 rounded-xl mt-0.5 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{n.createdAt || 'Recent'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>
                {n.relatedCaseId && (
                  <span className="inline-block font-mono text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                    Related Case: {n.relatedCaseId}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Info className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">No pending statutory notifications for your jurisdiction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const RevenueOfficerNotifications = () => (
  <ErrorBoundary fallbackTitle="Unable to load Notifications">
    <RevenueOfficerNotificationsContent />
  </ErrorBoundary>
);
