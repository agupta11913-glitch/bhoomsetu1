import React, { useState, useEffect } from 'react';
import {
  fetchAdminSystemSettingsApi,
  updateAdminSystemSettingsApi,
} from '../../services/api/adminApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Settings,
  Save,
  CheckCircle2,
  Lock,
  Shield,
  Bell,
  Cpu,
  RotateCcw,
  Sliders,
  X,
  AlertTriangle,
} from 'lucide-react';

const AdminSystemSettingsContent = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const defaultSettings = {
    // System Configuration
    sessionTimeoutMinutes: 60,
    maxFileUploadSizeMb: 25,
    maintenanceMode: false,
    apiRateLimitPerMinute: 500,
    platformName: 'BhoomiSetu National Platform',

    // Role Configuration
    defaultNewUserRole: 'CITIZEN',
    allowSelfRegistration: true,
    enforceTwoFactorAuth: true,
    passwordExpiryDays: 90,

    // Notification Configuration
    enableEmailAlerts: true,
    enableSmsBroadcast: true,
    inAppBannerEnabled: true,
    notificationRetentionDays: 30,
  };

  useEffect(() => {
    fetchAdminSystemSettingsApi()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        } else {
          setSettings(defaultSettings);
        }
        setLoading(false);
      })
      .catch(() => {
        setSettings(defaultSettings);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAdminSystemSettingsApi(settings);
      setNotice({ type: 'success', text: 'System configuration parameters saved and applied successfully.' });
    } catch (err) {
      console.error(err);
      setNotice({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('Reset application settings to defaults?')) return;
    setSettings(defaultSettings);
    setNotice({ type: 'info', text: 'Settings reset to default configuration. Click Save to persist.' });
  };

  const s = { ...defaultSettings, ...settings };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-700" />
              <span>Application Configuration</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Core Runtime Parameters</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>System Settings & Operational Parameters</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system runtime environments, authentication policies, role assignment rules, and notification gateways.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Notice Alert */}
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

      {/* 3 Main Settings Sections Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. System Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-black text-slate-900">System Configuration</h2>
              <p className="text-xs text-slate-500">Global server parameters, timeout limits, and rate control.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Platform Display Name</label>
              <input
                type="text"
                value={s.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">User Session Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                value={s.sessionTimeoutMinutes}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) || 30 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Evidence & Deed File Upload Size (MB)</label>
              <input
                type="number"
                value={s.maxFileUploadSizeMb}
                onChange={(e) => setSettings({ ...settings, maxFileUploadSizeMb: parseInt(e.target.value) || 10 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">REST API Rate Limit (Requests per Minute per IP)</label>
              <input
                type="number"
                value={s.apiRateLimitPerMinute}
                onChange={(e) => setSettings({ ...settings, apiRateLimitPerMinute: parseInt(e.target.value) || 200 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span className="font-bold text-slate-800">
                  Enable Scheduled Maintenance Banner (Displays notification bar to all logged in officers)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Role Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <div>
              <h2 className="text-base font-black text-slate-900">Role Configuration</h2>
              <p className="text-xs text-slate-500">User onboarding defaults, credential lifetimes, and multi-factor enforcement.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Role for Self-Registered Users</label>
              <select
                value={s.defaultNewUserRole}
                onChange={(e) => setSettings({ ...settings, defaultNewUserRole: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="CITIZEN">Citizen / Landowner (Default)</option>
                <option value="PROJECT_AGENCY">Project Agency (PIA)</option>
                <option value="GOVERNMENT_OFFICER">Revenue Officer</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Officer Password Expiry Cycle (Days)</label>
              <input
                type="number"
                value={s.passwordExpiryDays}
                onChange={(e) => setSettings({ ...settings, passwordExpiryDays: parseInt(e.target.value) || 90 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2 space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.allowSelfRegistration}
                  onChange={(e) => setSettings({ ...settings, allowSelfRegistration: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500"
                />
                <span className="font-bold text-slate-800">
                  Allow Public Citizen Portal Self-Registration (Subject to Bhulekh Aadhaar e-KYC Verification)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.enforceTwoFactorAuth}
                  onChange={(e) => setSettings({ ...settings, enforceTwoFactorAuth: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500"
                />
                <span className="font-bold text-slate-800">
                  Enforce Multi-Factor Authentication (MFA / Aadhaar OTP) for District Magistrate & CALA Award Approvals
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Notification Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-black text-slate-900">Notification Configuration</h2>
              <p className="text-xs text-slate-500">Dispatch channels, SMS gateway integration, and in-app retention rules.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">In-App Notification Retention Period (Days)</label>
              <input
                type="number"
                value={s.notificationRetentionDays}
                onChange={(e) => setSettings({ ...settings, notificationRetentionDays: parseInt(e.target.value) || 30 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.enableEmailAlerts}
                  onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="font-bold text-slate-800">
                  Enable SMTP Email Gateway (Dispatches Section 11/19 gazette alerts)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.enableSmsBroadcast}
                  onChange={(e) => setSettings({ ...settings, enableSmsBroadcast: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="font-bold text-slate-800">
                  Enable CDAC SMS Gateway for Landowner DBT Disbursement Acknowledgements
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.inAppBannerEnabled}
                  onChange={(e) => setSettings({ ...settings, inAppBannerEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="font-bold text-slate-800">
                  Enable Real-Time In-App Alert Banners across Official Dashboards
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Scope disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Settings apply only to application parameters. Statutory land valuation schedules and RFCTLARR formulas remain immutable.</span>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2 rounded-xl shadow transition"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const AdminSystemSettingsPage = () => (
  <ErrorBoundary fallbackTitle="System Settings Error">
    <AdminSystemSettingsContent />
  </ErrorBoundary>
);

export default AdminSystemSettingsPage;
