import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';

export const getRoleHomePath = (role) => {
  switch (role) {
    case ROLES.CITIZEN:
    case 'CITIZEN':
      return '/citizen/dashboard';
    case ROLES.TEHSILDAR:
    case 'TEHSILDAR':
      return '/tehsildar/dashboard';
    case ROLES.EXECUTIVE_OFFICER:
    case 'EXECUTIVE_OFFICER':
    case ROLES.PROJECT_AGENCY:
    case 'PROJECT_AGENCY':
      return '/project-agency/dashboard';
    case ROLES.GOVERNMENT_OFFICER:
    case ROLES.REVENUE_OFFICER:
    case 'FIELD_OFFICER':
    case 'REVENUE_OFFICER':
    case 'GOVERNMENT_OFFICER':
      return '/revenue-officer/dashboard';
    case ROLES.DISTRICT_AUTHORITY:
    case ROLES.DISTRICT_MAGISTRATE:
    case 'DISTRICT_AUTHORITY':
    case 'DISTRICT_MAGISTRATE':
    case 'DISTRICT_OFFICER':
      return '/district/dashboard';
    case ROLES.STATE_GOVERNMENT:
    case 'STATE_GOVERNMENT':
    case 'STATE_OFFICER':
      return '/state/dashboard';
    case ROLES.CENTRAL_MINISTRY:
    case 'CENTRAL_MINISTRY':
    case 'CENTRAL_OFFICER':
      return '/central/dashboard';
    case ROLES.ADMIN:
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

export const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { currentUser, currentRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = currentRole || currentUser?.role;

  // Always allow ADMIN to preview all role views
  if (userRole === ROLES.ADMIN || userRole === 'ADMIN') {
    return children;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some((r) => {
      if (r === userRole) return true;

      // Citizen aliases
      const citRoles = ['CITIZEN', ROLES.CITIZEN];
      if (citRoles.includes(userRole) && citRoles.includes(r)) return true;

      // Tehsildar aliases
      const tehRoles = ['TEHSILDAR', ROLES.TEHSILDAR];
      if (tehRoles.includes(userRole) && tehRoles.includes(r)) return true;

      // PIA / Executive aliases
      const piaRoles = ['PROJECT_AGENCY', 'EXECUTIVE_OFFICER', 'ACQUISITION_OFFICER', ROLES.PROJECT_AGENCY, ROLES.EXECUTIVE_OFFICER];
      if (piaRoles.includes(userRole) && piaRoles.includes(r)) return true;

      // Revenue Officer aliases
      const revRoles = ['GOVERNMENT_OFFICER', 'REVENUE_OFFICER', 'FIELD_OFFICER', ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER];
      if (revRoles.includes(userRole) && revRoles.includes(r)) return true;

      // District Magistrate aliases
      const dmRoles = ['DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE];
      if (dmRoles.includes(userRole) && dmRoles.includes(r)) return true;

      // State Officer aliases
      const stateRoles = ['STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.STATE_GOVERNMENT];
      if (stateRoles.includes(userRole) && stateRoles.includes(r)) return true;

      // Central Officer aliases
      const centralRoles = ['CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.CENTRAL_MINISTRY];
      if (centralRoles.includes(userRole) && centralRoles.includes(r)) return true;

      return false;
    });

    if (!isAllowed) {
      const fallbackPath = getRoleHomePath(userRole);
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-8 select-none">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-gov text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Access Denied • HTTP 403
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                Unauthorized Dashboard Section
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                You are not authorized to access this page under your current <strong>{userRole}</strong> credentials ({currentUser?.email}).
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate(fallbackPath)}
                className="w-full sm:w-auto bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go to Authorized Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default RoleProtectedRoute;
