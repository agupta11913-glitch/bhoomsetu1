import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTehsildarNotificationsApi } from '../../services/api/tehsildarApi';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  UserCheck,
  Building2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const TehsildarNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchTehsildarNotificationsApi();
      if (data && Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      } else {
        // Fallback default notifications if none in database
        setNotifications([
          {
            id: 1,
            title: 'Revenue Officer Ground Verification Completed',
            message: 'RO Sh. Alok Srivastava has completed field survey and cadastral demarcation for Khasra 101 (Nagla Village). Ready for Tehsildar review.',
            type: 'CASE_VERIFIED',
            relatedCaseId: 'CASE-2026-DME-0101',
            createdAt: '28 Aug 2026 10:15 AM',
            isRead: false,
          },
          {
            id: 2,
            title: 'New Section 15 Citizen Objection Received',
            message: 'Claimant Sh. Ramesh Chandra filed objection regarding tree valuation on Khasra 102. Scheduled for hearing.',
            type: 'OBJECTION_RECEIVED',
            relatedCaseId: 'CASE-2026-DME-0102',
            createdAt: '28 Aug 2026 09:30 AM',
            isRead: false,
          },
          {
            id: 3,
            title: 'Compensation Award Disbursed via PFMS',
            message: 'Direct Benefit Transfer of ₹2.16 Cr credited for Khasra 101 (Sh. Ram Kumar). UTR: PFMS-2026-99218.',
            type: 'PAYMENT_CLEARED',
            relatedCaseId: 'CASE-2026-DME-0101',
            createdAt: '27 Aug 2026 04:45 PM',
            isRead: true,
          },
          {
            id: 4,
            title: 'Section 11 Gazette Notice Published',
            message: 'Official notification issued under RFCTLARR Act 2013 for Delhi–Meerut Expressway Expansion (NH-348).',
            type: 'GAZETTE_NOTICE',
            relatedCaseId: 'PRJ-001',
            createdAt: '26 Aug 2026 11:00 AM',
            isRead: true,
          },
        ]);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Executive Alerts & Workflow Dispatch
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Tehsil Fatehabad Land Acquisition Desk
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Official Notifications & Actionable Alerts
          </h1>
        </div>

        <button
          onClick={loadNotifications}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Notifications Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov divide-y divide-slate-100 overflow-hidden text-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading notifications feed...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications in your queue.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id || n.title}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition ${
                !n.isRead ? 'bg-gov-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gov-blue-100 text-gov-blue-900 rounded-xl shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{n.title}</h3>
                    {!n.isRead && (
                      <span className="bg-gov-saffron-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs max-w-2xl">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {n.createdAt || 'Today'}
                  </span>
                </div>
              </div>

              {n.relatedCaseId && (
                <button
                  onClick={() => navigate(`/tehsildar/cases?caseId=${n.relatedCaseId}`)}
                  className="bg-slate-100 hover:bg-gov-blue-900 text-slate-700 hover:text-white px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1"
                >
                  <span>Open Case</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
