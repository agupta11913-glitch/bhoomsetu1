import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { PROTOTYPE_DISCLAIMER } from '../../utils/constants';
import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isHindi, t } = useLanguage();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [saveBanner, setSaveBanner] = useState(false);

  const triggerSaveBanner = () => {
    setSaveBanner(true);
    setTimeout(() => {
      setSaveBanner(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 dark:bg-gov-blue-900/60 text-gov-blue-800 dark:text-gov-saffron-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200 dark:border-gov-blue-700">
              System Preferences
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Security & Identity Profile
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHindi ? 'अधिकारी / नागरिक प्रोफ़ाइल एवं सिस्टम सेटिंग्स' : 'User Profile & System Settings'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isHindi
              ? 'अपनी प्रमाणित उपयोगकर्ता पहचान, भाषा प्राथमिकता, थीम, एवं सांविधिक अधिसूचना नीतियां प्रबंधित करें।'
              : 'Manage your authenticated user identity, language preferences, theme, and statutory notification policies.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 text-slate-600 dark:text-slate-200 hover:text-rose-600 border border-slate-200 dark:border-slate-600 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Close & Return to Dashboard"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{t('close')}</span>
          </button>
        </div>
      </div>

      {/* Auto-Save Notification Banner */}
      {saveBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2 font-bold animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{isHindi ? 'प्राथमिकताएं सफलतापूर्वक सुरक्षित की गईं।' : 'Preferences saved & synchronized successfully.'}</span>
        </div>
      )}



      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <User className="w-4 h-4 text-gov-blue-800 dark:text-gov-saffron-500" />
          <span>{isHindi ? 'सक्रिय उपयोगकर्ता प्रोफ़ाइल' : 'Active Authenticated Profile'}</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl border-2 border-gov-saffron-500 object-cover shadow"
          />
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{currentUser?.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="bg-gov-blue-50 dark:bg-gov-blue-900/60 text-gov-blue-900 dark:text-gov-saffron-300 text-xs font-bold px-2.5 py-0.5 rounded-lg border border-gov-blue-200 dark:border-gov-blue-700">
                {currentUser?.badge || currentUser?.role}
              </span>
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2 py-0.5 rounded-lg font-medium">
                {isHindi ? 'स्थान:' : 'Location:'} {currentUser?.district || 'Agra'}, {currentUser?.state || 'Uttar Pradesh'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 text-xs transition-colors">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? 'सुरक्षा एवं राष्ट्रीय गेटवे नीतियां' : 'Security & National Gateway Policies'}</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">NICNET Two-Factor Authentication (2FA)</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Enforce Aadhaar OTP or Hardware Token for statutory submissions</span>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => {
                setTwoFactor(e.target.checked);
                triggerSaveBanner();
              }}
              className="w-4 h-4 rounded text-gov-blue-800"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">SMS & Digilocker Gateway Notifications</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Send automated Section 11 & R&R grant alerts to registered mobile numbers</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => {
                setSmsAlerts(e.target.checked);
                triggerSaveBanner();
              }}
              className="w-4 h-4 rounded text-gov-blue-800"
            />
          </div>
        </div>
      </div>

      {/* Prototype Legal Disclaimer */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gov-saffron-500 font-extrabold text-sm">
          <Info className="w-4 h-4" />
          <span>Government Prototype Disclaimer</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          {PROTOTYPE_DISCLAIMER}
        </p>
      </div>
    </div>
  );
};
