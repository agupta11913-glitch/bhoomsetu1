import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLandData } from '../../context/LandDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { GovEmblem } from '../common/GovEmblem';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  Menu,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';

import { ErrorBoundary } from '../common/ErrorBoundary';

const NavbarContent = ({ onOpenAI, onToggleMobileMenu, mobileMenuOpen }) => {
  const navigate = useNavigate();
  const { currentUser, currentRole, logout } = useAuth();
  const landData = useLandData() || {};
  const notifications = landData.notifications || [];
  const khasras = landData.khasras || [];
  const setActiveKhasraId = landData.setActiveKhasraId || (() => {});
  const setMapCenterKhasra = landData.setMapCenterKhasra || (() => {});
  const showToast = landData.showToast || (() => {});
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const cleanQuery = searchQuery.trim().toLowerCase();
    const matched = khasras.find(
      (k) =>
        k.khasraNumber.toLowerCase().includes(cleanQuery) ||
        k.ownerName.toLowerCase().includes(cleanQuery) ||
        (k.caseId && k.caseId.toLowerCase().includes(cleanQuery.toLowerCase()))
    );

    if (matched) {
      setActiveKhasraId(matched.khasraNumber);
      setMapCenterKhasra(matched.khasraNumber);
      showToast('Parcel Located', `Found Khasra ${matched.khasraNumber} (${matched.ownerName}) on GIS Map`, 'success');
      navigate('/gis-map');
    } else {
      showToast('Search Query', `No exact match for "${searchQuery}". Showing GIS Map.`, 'info');
      navigate('/gis-map');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-[1000] bg-gov-blue-900 dark:bg-slate-950 text-white shadow-gov-md border-b-2 border-gov-saffron-500 w-full transition-colors">
      {/* Top micro-bar showing Real Logged In Officer Identity */}
      <div className="bg-gov-blue-950 dark:bg-black px-2 sm:px-4 py-1 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 border-b border-gov-blue-800/60 dark:border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="font-bold text-gov-saffron-500 truncate">{t('govOfIndia')}</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          {/* Active Logged In User Identity */}
          <span className="inline-flex items-center gap-1 bg-gov-blue-900/80 dark:bg-slate-900 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-gov-blue-700/60 dark:border-slate-700 truncate">
            <User className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Logged in:</span>
            <strong className="text-white">{currentUser?.name || 'Authorized User'}</strong>
            <span className="text-gov-saffron-400">({currentUser?.badge || currentRole?.replace(/_/g, ' ')})</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 bg-gov-saffron-600/30 text-gov-saffron-500 px-2 py-0.5 rounded font-mono text-[9px] sm:text-[10px] font-bold border border-gov-saffron-500/40">
            SIH 2026 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="px-2 sm:px-4 py-2 flex items-center justify-between gap-2 md:gap-4 max-w-[1920px] mx-auto">
        {/* Left: Mobile Toggle + Emblem + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-gov-blue-800 md:hidden focus:outline-none"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group"
          >
            <GovEmblem className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight text-white font-serif group-hover:text-gov-saffron-400 transition-colors">
                  {t('appTitle')}
                </span>
                <span className="hidden lg:inline bg-gov-saffron-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                  {t('sihTag')}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium hidden sm:block leading-tight truncate max-w-[280px] lg:max-w-md">
                {t('appSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-gov-blue-950/80 dark:bg-slate-900 text-white text-xs pl-8 pr-16 py-2 rounded-xl border border-gov-blue-700/70 focus:border-gov-saffron-500 focus:bg-gov-blue-950 focus:ring-1 focus:ring-gov-saffron-500 outline-none transition placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gov-saffron-500 hover:bg-gov-saffron-600 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition"
            >
              {t('search')}
            </button>
          </form>
        </div>

        {/* Right: Real User Controls & AI Assistant */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* AI Assist Modal Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600/50 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition"
            title="Ask AI Statutory Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">AI Assist</span>
          </button>

          {/* Notifications Center */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-xl bg-gov-blue-800/80 dark:bg-slate-800 hover:bg-gov-blue-700 text-slate-200 hover:text-white transition relative"
              title="Official Gazette & Workflow Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gov-saffron-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-gov-blue-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-gov-lg border border-slate-200 py-2 z-[1100] animate-fadeIn">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-gov-blue-900" />
                    Official Gazette Notifications
                  </span>
                  <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded-full text-slate-600">
                    {notifications.length} total
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 hover:bg-slate-50 transition cursor-pointer text-xs space-y-1"
                      onClick={() => {
                        setShowNotifMenu(false);
                        navigate('/citizen/notices');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-[11px] truncate">
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-400">{n.date || 'Today'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-gov-blue-800/80 transition"
              title="User Profile & Settings"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-xl border border-gov-saffron-500 object-cover"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-gov-lg border border-slate-200 py-2 z-[1100] animate-fadeIn text-xs">
                <div className="px-4 py-3 border-b border-slate-100 space-y-0.5">
                  <p className="font-black text-slate-900 text-sm truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{currentUser?.email}</p>
                  <span className="inline-block bg-gov-blue-50 text-gov-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gov-blue-200 mt-1 uppercase">
                    {currentUser?.badge || currentRole?.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('settings')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2.5 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export const Navbar = (props) => (
  <ErrorBoundary fallbackTitle="Navbar Header Loading">
    <NavbarContent {...props} />
  </ErrorBoundary>
);

export default Navbar;
