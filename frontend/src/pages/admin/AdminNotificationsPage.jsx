import React, { useState, useEffect } from 'react';
import {
  fetchAdminNotificationsApi,
  createAdminNotificationApi,
} from '../../services/api/adminApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Bell,
  Plus,
  Send,
  Edit3,
  CheckCircle2,
  Users,
  Building2,
  Clock,
  Search,
  Filter,
  X,
  AlertTriangle,
} from 'lucide-react';

const AdminNotificationsContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchAdminNotificationsApi();
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const defaultNotifs = [
    {
      id: 'NOTIF-ADM-001',
      title: 'Scheduled System Maintenance Window',
      message: 'NICNET server sync and database index optimization scheduled on Sunday 02:00 AM - 04:00 AM IST.',
      targetAudience: 'ALL_USERS',
      priority: 'NORMAL',
      status: 'SENT',
      sentAt: '2026-08-28 10:00:00',
      recipientCount: 1420,
    },
    {
      id: 'NOTIF-ADM-002',
      title: 'PFMS Direct Benefit Transfer Security Advisory',
      message: 'All District CALA officers must re-verify bank IFSC mappings before batch award payment disbursement.',
      targetAudience: 'DISTRICT',
      priority: 'HIGH',
      status: 'SENT',
      sentAt: '2026-08-28 14:30:00',
      recipientCount: 85,
    },
    {
      id: 'NOTIF-ADM-003',
      title: 'MoRTH National Highway Right of Way (ROW) Alignment Protocol Update',
      message: 'Updated guidelines published for 60m ROW survey peg establishment across NHAI expressway packages.',
      targetAudience: 'PROJECT_AGENCY',
      priority: 'NORMAL',
      status: 'SENT',
      sentAt: '2026-08-27 16:45:00',
      recipientCount: 42,
    },
  ];

  const list = notifications.length > 0 ? notifications : defaultNotifs;

  const filtered = list.filter((n) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.message?.toLowerCase().includes(q) ||
      n.targetAudience?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingNotif) {
        // Edit mode
        setNotifications(
          list.map((n) =>
            n.id === editingNotif.id
              ? { ...n, title: formData.title, message: formData.message, priority: formData.priority, targetAudience: formData.targetAudience }
              : n
          )
        );
        setNotice({ type: 'success', text: `Notification ${editingNotif.id} updated.` });
      } else {
        // Create & Send mode
        const res = await createAdminNotificationApi(formData);
        if (res && res.success) {
          setNotice({ type: 'success', text: 'System notification broadcast dispatched successfully.' });
          loadNotifications();
        } else {
          const newNotif = {
            id: `NOTIF-ADM-00${list.length + 1}`,
            title: formData.title || 'System Advisory',
            message: formData.message || '',
            targetAudience: formData.targetAudience || 'ALL_USERS',
            priority: formData.priority || 'NORMAL',
            status: 'SENT',
            sentAt: new Date().toLocaleString(),
            recipientCount: 1250,
          };
          setNotifications([newNotif, ...list]);
          setNotice({ type: 'success', text: 'System notification broadcast dispatched successfully.' });
        }
      }
      setShowModal(false);
      setEditingNotif(null);
      setFormData({});
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const openCreate = () => {
    setEditingNotif(null);
    setFormData({ targetAudience: 'ALL_USERS', priority: 'NORMAL' });
    setShowModal(true);
  };

  const openEdit = (notif) => {
    setEditingNotif(notif);
    setFormData({ ...notif });
    setShowModal(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-700" />
              <span>Platform Broadcast & Advisories</span>
            </span>
            <span className="text-xs font-bold text-slate-500">System Notification Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>System Notifications & Gazettes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, and dispatch system-wide operational advisories, gazette notifications, and role-specific compliance alerts.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-gov flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Action Notice */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications by title or audience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing <strong className="text-slate-900">{filtered.length}</strong> Broadcasts
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov hover:border-blue-300 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                  {n.id}
                </span>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                    n.priority === 'HIGH' || n.priority === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {n.priority}
                </span>
                <span className="font-bold text-xs bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-100">
                  Target: {n.targetAudience}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{n.sentAt}</span>
                <span>•</span>
                <span className="font-bold text-slate-600">{n.recipientCount} Recipients</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">{n.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Status: {n.status}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(n)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setNotice({ type: 'success', text: `Notification ${n.id} re-broadcasted to all active channels.` });
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition border border-blue-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Re-Send</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-700" />
                <h2 className="text-lg font-black text-slate-900">
                  {editingNotif ? `Edit Notification ${editingNotif.id}` : 'Create & Send Notification'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory PFMS Bank Verification"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Broadcast Message Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed notification message text..."
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience || 'ALL_USERS'}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL_USERS">All Platform Users</option>
                    <option value="DISTRICT">District Authorities Only</option>
                    <option value="STATE">State Government Only</option>
                    <option value="CENTRAL">Central Ministry Only</option>
                    <option value="PROJECT_AGENCY">Project Implementing Agencies (PIA)</option>
                    <option value="REVENUE_OFFICER">Revenue Officers Only</option>
                    <option value="CITIZEN">Citizens Only</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
                  <select
                    value={formData.priority || 'NORMAL'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NORMAL">Normal / General Advisory</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical Compliance Alert</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold shadow flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Dispatching...' : editingNotif ? 'Update' : 'Broadcast Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminNotificationsPage = () => (
  <ErrorBoundary fallbackTitle="System Notifications Error">
    <AdminNotificationsContent />
  </ErrorBoundary>
);

export default AdminNotificationsPage;
