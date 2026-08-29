import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, hasPermission } from '../../utils/constants';
import { ErrorBoundary } from '../common/ErrorBoundary';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Users,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Layers,
  Banknote,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Settings,
  Database,
  Radio,
  FileSearch,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Home,
  MessageSquareWarning,
  Building2,
  Globe,
  Brain,
  UserCheck,
  X,
  Bell,
  Clock,
  TrendingUp,
} from 'lucide-react';

const SidebarContent = ({ mobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const { currentRole, currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Normalize role string for robust matching
  const rawRole = (currentRole || currentUser?.role || 'CITIZEN').toString().toUpperCase().replace(/^ROLE_/, '');

  // Role Specific Nav Links Configuration
  const getNavItems = () => {
    switch (rawRole) {
      case 'CITIZEN':
      case 'LAND_OWNER':
      case ROLES.CITIZEN:
        return [
          { label: 'Citizen Dashboard', path: '/', icon: Home },
          { label: 'My Land Record', path: '/citizen/my-land', icon: MapPin },
          { label: 'Case Workflow', path: '/cases/CASE-2026-DME-0101', icon: FileCheck, badge: 'Demo' },
          { label: 'Official Notices', path: '/citizen/notices', icon: FileText },
          { label: 'File Objection & Proof', path: '/citizen/submit-objection', icon: MessageSquareWarning },
          { label: 'Compensation', path: '/citizen/payments', icon: Banknote },
          { label: 'R&R Benefits', path: '/citizen/rr-benefits', icon: Building2 },
          { label: 'Profile & Settings', path: '/settings', icon: Settings },
        ];

      case 'TEHSILDAR':
      case ROLES.TEHSILDAR:
        return [
          { label: 'Dashboard', path: '/tehsildar/dashboard', icon: LayoutDashboard },
          { label: 'Acquisition Cases', path: '/tehsildar/cases', icon: FileCheck, badge: 'Cases' },
          { label: 'Land & Parcel Map', path: '/tehsildar/map', icon: MapPin, highlight: true },
          { label: 'Verification Review', path: '/tehsildar/verification', icon: FileSearch, badge: 'Audit' },
          { label: 'Citizen Objections', path: '/tehsildar/objections', icon: MessageSquareWarning },
          { label: 'Compensation Review', path: '/tehsildar/compensation', icon: Banknote },
          { label: 'R&R Review', path: '/tehsildar/r-and-r', icon: Building2 },
          { label: 'Documents', path: '/tehsildar/documents', icon: FileText },
          { label: 'Reports', path: '/tehsildar/reports', icon: BarChart3 },
          { label: 'Notifications', path: '/tehsildar/notifications', icon: Bell },
          { label: 'Profile', path: '/tehsildar/profile', icon: Settings },
        ];

      case 'EXECUTIVE_OFFICER':
      case 'PROJECT_AGENCY':
      case 'PROJECT_IMPLEMENTING_AGENCY':
      case 'ACQUISITION_OFFICER':
      case 'AGENCY':
      case ROLES.EXECUTIVE_OFFICER:
      case ROLES.PROJECT_AGENCY:
        return [
          { label: 'Dashboard', path: '/project-agency/dashboard', icon: LayoutDashboard },
          { label: 'My Projects', path: '/project-agency/projects', icon: Layers },
          { label: 'Project Progress', path: '/project-agency/progress', icon: TrendingUp },
          { label: 'GIS Map', path: '/project-agency/map', icon: MapPin, highlight: true },
          { label: 'Land Acquisition', path: '/project-agency/acquisition', icon: FileCheck },
          { label: 'Compensation & R&R', path: '/project-agency/compensation-rnr', icon: Banknote },
          { label: 'Issues / Disputes', path: '/project-agency/issues', icon: MessageSquareWarning, badge: 'Issues' },
          { label: 'Documents', path: '/project-agency/documents', icon: FileText },
          { label: 'Reports', path: '/project-agency/reports', icon: BarChart3 },
        ];

      case 'GOVERNMENT_OFFICER':
      case 'REVENUE_OFFICER':
      case 'FIELD_OFFICER':
      case 'CALA':
      case ROLES.GOVERNMENT_OFFICER:
      case ROLES.REVENUE_OFFICER:
        return [
          { label: 'Dashboard', path: '/revenue-officer/dashboard', icon: LayoutDashboard },
          { label: 'Assigned Cases', path: '/revenue-officer/cases', icon: FileCheck, badge: 'Cases' },
          { label: 'Land Verification', path: '/revenue-officer/verification', icon: FileSearch, badge: 'RoR' },
          { label: 'Field Verification', path: '/revenue-officer/field-verification', icon: MapPin },
          { label: 'Land & Parcel Map', path: '/revenue-officer/map', icon: MapPin, highlight: true },
          { label: 'Documents', path: '/revenue-officer/documents', icon: FileText },
          { label: 'Citizen Objections', path: '/revenue-officer/objections', icon: MessageSquareWarning },
          { label: 'Verification Reports', path: '/revenue-officer/reports', icon: BarChart3 },
          { label: 'Notifications', path: '/revenue-officer/notifications', icon: Bell },
          { label: 'Profile', path: '/revenue-officer/profile', icon: Settings },
        ];

      case 'DISTRICT_AUTHORITY':
      case 'DISTRICT_MAGISTRATE':
      case 'DISTRICT_OFFICER':
      case 'DISTRICT':
      case ROLES.DISTRICT_AUTHORITY:
      case ROLES.DISTRICT_MAGISTRATE: {
        const districtItems = [
          { permission: 'VIEW_DASHBOARD', label: 'Dashboard', path: '/district/dashboard', icon: LayoutDashboard },
          { permission: 'VIEW_PROJECTS', label: 'Projects', path: '/district/projects', icon: Layers },
          { permission: 'VIEW_ACQUISITION', label: 'Acquisition Monitoring', path: '/district/acquisition', icon: FileCheck },
          { permission: 'VIEW_GIS', label: 'GIS Map', path: '/district/map', icon: MapPin, highlight: true },
          { permission: 'VIEW_LAND', label: 'Land & Parcel Overview', path: '/district/land', icon: FileSearch },
          { permission: 'VIEW_DISPUTES', label: 'Disputes & Objections', path: '/district/disputes', icon: MessageSquareWarning, badge: 'Issues' },
          { permission: 'VIEW_COMPENSATION', label: 'Compensation', path: '/district/compensation', icon: Banknote },
          { permission: 'VIEW_R_AND_R', label: 'R&R Monitoring', path: '/district/r-and-r', icon: Building2 },
          { permission: 'VIEW_OFFICERS', label: 'Officer Monitoring', path: '/district/officers', icon: Users },
          { permission: 'VIEW_COORDINATION', label: 'Department Coordination', path: '/district/coordination', icon: ShieldCheck },
          { permission: 'VIEW_ESCALATIONS', label: 'Escalations', path: '/district/escalations', icon: AlertTriangle, badge: 'Escalate' },
          { permission: 'VIEW_DELAYED_CASES', label: 'Delayed Cases', path: '/district/delayed-cases', icon: Clock, badge: 'Delay' },
          { permission: 'VIEW_REPORTS', label: 'Reports & Analytics', path: '/district/reports', icon: BarChart3 },
          { permission: 'VIEW_DOCUMENTS', label: 'Documents', path: '/district/documents', icon: FileText },
          { permission: 'VIEW_NOTIFICATIONS', label: 'Notifications', path: '/district/notifications', icon: Bell },
          { permission: null, label: 'Profile', path: '/district/profile', icon: Settings },
        ];
        return districtItems.filter((item) => {
          if (!item.permission) return true;
          try {
            return hasPermission(item.permission, currentUser);
          } catch {
            return true;
          }
        });
      }

      case 'STATE_GOVERNMENT':
      case 'STATE_OFFICER':
      case 'STATE':
      case ROLES.STATE_GOVERNMENT:
        return [
          { label: 'Dashboard', path: '/state/dashboard', icon: LayoutDashboard },
          { label: 'Projects', path: '/state/projects', icon: Layers },
          { label: 'District Monitoring', path: '/state/districts', icon: Building2 },
          { label: 'GIS Map', path: '/state/map', icon: MapPin, highlight: true },
          { label: 'Acquisition', path: '/state/acquisition', icon: FileCheck },
          { label: 'Compensation & R&R', path: '/state/compensation-rnr', icon: Banknote },
          { label: 'Disputes', path: '/state/disputes', icon: MessageSquareWarning, badge: 'Issues' },
          { label: 'Escalations', path: '/state/escalations', icon: AlertTriangle, badge: 'Escalate' },
          { label: 'Reports', path: '/state/reports', icon: BarChart3 },
        ];

      case 'CENTRAL_MINISTRY':
      case 'CENTRAL_OFFICER':
      case 'CENTRAL':
      case ROLES.CENTRAL_MINISTRY:
        return [
          { label: 'Dashboard', path: '/central/dashboard', icon: LayoutDashboard },
          { label: 'Projects', path: '/central/projects', icon: Layers },
          { label: 'State Monitoring', path: '/central/states', icon: Building2 },
          { label: 'GIS Map', path: '/central/map', icon: MapPin, highlight: true },
          { label: 'Acquisition', path: '/central/acquisition', icon: FileCheck },
          { label: 'Compensation & R&R', path: '/central/compensation-rnr', icon: Banknote },
          { label: 'Disputes', path: '/central/disputes', icon: MessageSquareWarning, badge: 'Issues' },
          { label: 'Escalations', path: '/central/escalations', icon: AlertTriangle, badge: 'Escalate' },
          { label: 'Reports', path: '/central/reports', icon: BarChart3 },
        ];

      case 'ADMIN':
      case 'SYSTEM_ADMIN':
      case 'SYSTEM_ADMINISTRATOR':
      case ROLES.ADMIN:
      default:
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Users', path: '/admin/users', icon: Users },
          { label: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
          { label: 'Projects & Departments', path: '/admin/projects-departments', icon: Layers },
          { label: 'System Monitoring', path: '/admin/monitoring', icon: Radio },
          { label: 'Notifications', path: '/admin/notifications', icon: Bell },
          { label: 'System Settings', path: '/admin/settings', icon: Settings },
        ];
    }
  };

  const navItems = Array.isArray(getNavItems()) ? getNavItems() : [];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const userName = currentUser?.name || 'Authorized User';
  const userBadge = currentUser?.badge || rawRole.replace(/_/g, ' ');

  return (
    <>
      {/* 1. Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-[1050] bg-slate-900/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* 2. Mobile Drawer Navigation Container */}
      <div
        className={`fixed inset-y-0 left-0 z-[1100] w-72 bg-white shadow-2xl border-r border-slate-200 transform transition-transform duration-300 md:hidden flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col py-4 px-3 overflow-y-auto">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 px-2">
            <div className="flex items-center gap-2">
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full border border-gov-saffron-500 object-cover"
              />
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 block truncate">
                  {userName}
                </span>
                <p className="text-[10px] text-gov-blue-900 font-bold uppercase truncate">
                  {userBadge}
                </p>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav items for Mobile */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (!item) return null;
              const Icon = item.icon || LayoutDashboard;
              return (
                <NavLink
                  key={item.path || item.label}
                  to={item.path || '/'}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gov-blue-900 text-white shadow-sm font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-gov-blue-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-gov-saffron-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Desktop Permanent Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-white border-r border-slate-200 shadow-sm transition-all duration-300 z-30 shrink-0 select-none ${
          collapsed ? 'w-16' : 'w-60 lg:w-64'
        }`}
      >
        <div className="flex flex-col py-3 overflow-y-auto">
          {/* Collapse Toggle */}
          <div className="px-3 pb-2 flex items-center justify-between border-b border-slate-100 mb-2">
            {!collapsed && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navigation Menu
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition mx-auto"
              title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              if (!item) return null;
              const Icon = item.icon || LayoutDashboard;
              return (
                <NavLink
                  key={item.path || item.label}
                  to={item.path || '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-gov-blue-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-gov-blue-900'
                    } ${item.highlight ? 'ring-1 ring-gov-saffron-500/50' : ''}`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="bg-gov-saffron-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Officer Identity Card Footer */}
        {!collapsed && (
          <div className="p-3 m-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <img
                src={userAvatar}
                alt={userName}
                className="w-7 h-7 rounded-full border border-gov-saffron-500 object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">{userName}</p>
                <p className="text-[10px] text-gov-blue-900 font-bold truncate">
                  {userBadge}
                </p>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full w-full justify-center">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping" />
              Live SIH 2026 Gateway
            </div>
          </div>
        )}
      </aside>

      {/* 4. Mobile Quick Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[900] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-gov-lg px-2 py-1.5 flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg transition ${
              isActive ? 'text-gov-blue-900' : 'text-slate-500'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/cases"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg transition ${
              isActive ? 'text-gov-blue-900' : 'text-slate-500'
            }`
          }
        >
          <FileCheck className="w-4 h-4" />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/gis-map"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg transition ${
              isActive ? 'text-gov-blue-900' : 'text-slate-500'
            }`
          }
        >
          <MapPin className="w-4 h-4" />
          <span>Land Parcels</span>
        </NavLink>

        <NavLink
          to="/ai-insights"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 rounded-lg transition ${
              isActive ? 'text-purple-700' : 'text-slate-500'
            }`
          }
        >
          <Brain className="w-4 h-4 text-purple-600" />
          <span>Reports</span>
        </NavLink>
      </div>
    </>
  );
};

export const Sidebar = (props) => (
  <ErrorBoundary fallbackTitle="Sidebar Navigation Loading">
    <SidebarContent {...props} />
  </ErrorBoundary>
);
export default Sidebar;
