import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictNotificationsApi } from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Building2,
} from 'lucide-react';

const DistrictNotificationsContent = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistrictNotificationsApi(currentUser?.district || 'Agra').then((data) => {
      if (Array.isArray(data)) setNotifications(data);
      setLoading(false);
    });
  }, [currentUser]);

  const defaultNotifs = [
    {
      id: 1,
      title: 'Section 19 Final Acquisition Declaration Sanctioned',
      message: 'Declaration for Khasra 101-105 (Nagla Village) has been signed and transmitted to Government Gazette.',
      createdAt: '2026-02-28 10:30:00',
      type: 'SUCCESS',
    },
    {
      id: 2,
      title: 'New Section 15 Objection Claim Filed',
      message: 'Farmer Ram Kumar filed representation regarding alignment peg boundary demarcation in Khasra 101.',
      createdAt: '2026-02-27 15:45:00',
      type: 'WARNING',
    },
    {
      id: 3,
      title: 'Stage-II Forest Clearance Notice Dispatched',
      message: 'Inter-departmental notice sent to DFO Agra for 4.2 Ha reserve forest corridor ROW.',
      createdAt: '2026-02-26 11:20:00',
      type: 'INFO',
    },
  ];

  const list = notifications.length > 0 ? notifications : defaultNotifs;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Real-Time Broadcasts
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-600" />
            <span>District Administrative Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time statutory updates, objection filings, inter-departmental notices, and disbursement logs.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Alerts</span>
          <strong className="text-xl font-black text-purple-700">{list.length} Alerts</strong>
        </div>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:shadow-md transition flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">{n.title}</h3>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{n.createdAt}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DistrictNotificationsPage = () => (
  <ErrorBoundary>
    <DistrictNotificationsContent />
  </ErrorBoundary>
);

export default DistrictNotificationsPage;
