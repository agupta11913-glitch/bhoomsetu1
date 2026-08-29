import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { GovEmblem } from '../../components/common/GovEmblem';
import { ROLES, ROLE_DETAILS, PROTOTYPE_DISCLAIMER } from '../../utils/constants';
import {
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('central.officer@bhoomisetu.gov.in');
  const [password, setPassword] = useState('Bhoomi@123');
  const [selectedRole, setSelectedRole] = useState(ROLES.CENTRAL_MINISTRY);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingError, setPendingError] = useState(null);

  const roleInfo = ROLE_DETAILS[selectedRole] || ROLE_DETAILS[ROLES.CENTRAL_MINISTRY];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPendingError(null);

    try {
      const res = await login(email, password, selectedRole);
      console.log('Login response:', res);
      setIsLoading(false);

      if (res && res.success) {
        // Direct role-based redirection to the active dashboard
        const role = res.user?.role || selectedRole;
        switch (role) {
          case ROLES.CITIZEN:
          case 'CITIZEN':
            navigate('/citizen/dashboard');
            break;
          case ROLES.TEHSILDAR:
          case 'TEHSILDAR':
            navigate('/tehsildar/dashboard');
            break;
          case ROLES.EXECUTIVE_OFFICER:
          case 'EXECUTIVE_OFFICER':
          case ROLES.PROJECT_AGENCY:
          case 'PROJECT_AGENCY':
          case 'ACQUISITION_OFFICER':
            navigate('/project-agency/dashboard');
            break;
          case ROLES.GOVERNMENT_OFFICER:
          case 'GOVERNMENT_OFFICER':
          case ROLES.REVENUE_OFFICER:
          case 'REVENUE_OFFICER':
          case 'FIELD_OFFICER':
            navigate('/revenue-officer/dashboard');
            break;
          case ROLES.DISTRICT_AUTHORITY:
          case ROLES.DISTRICT_MAGISTRATE:
          case 'DISTRICT_AUTHORITY':
          case 'DISTRICT_MAGISTRATE':
          case 'DISTRICT_OFFICER':
            navigate('/district/dashboard');
            break;
          case ROLES.STATE_GOVERNMENT:
          case 'STATE_GOVERNMENT':
          case 'STATE_OFFICER':
            navigate('/state/dashboard');
            break;
          case ROLES.CENTRAL_MINISTRY:
          case 'CENTRAL_MINISTRY':
          case 'CENTRAL_OFFICER':
            navigate('/central/dashboard');
            break;
          case ROLES.ADMIN:
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/citizen/dashboard');
            break;
        }
      } else {
        setPendingError(res);
      }
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      setPendingError({
        success: false,
        status: err.status === 401 ? 'UNAUTHORIZED' : (err.data?.status || 'ERROR'),
        message: err.message || 'Invalid email or password.',
        applicationId: err.data?.applicationId,
      });
    }
  };

  const handleQuickRoleFill = (cred) => {
    setSelectedRole(cred.role);
    setEmail(cred.email);
    setPassword(cred.password);
    setPendingError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Gov Bar */}
      <div className="bg-gov-blue-950 text-slate-300 px-3 sm:px-6 py-2 text-[10px] sm:text-xs flex items-center justify-between border-b border-gov-blue-900">
        <div className="flex items-center gap-1.5 sm:gap-2 font-semibold truncate">
          <span className="text-gov-saffron-500 truncate">भारत सरकार | Government of India</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden md:inline">PM Gati Shakti & National Land Acquisition Framework</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gov-saffron-600/30 text-gov-saffron-500 font-bold px-2 py-0.5 rounded text-[9px] sm:text-[10px] border border-gov-saffron-500/40">
            SIH 2026 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* Left Side: Visual Branding */}
          <div className="lg:col-span-5 bg-gradient-to-br from-gov-blue-950 via-gov-blue-900 to-gov-blue-800 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 sm:space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <GovEmblem size="md" className="sm:hidden" />
                <GovEmblem size="lg" className="hidden sm:flex" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    BHOOMI<span className="text-gov-saffron-500">SETU</span>
                  </h1>
                  <span className="text-[9px] sm:text-[10px] text-gov-saffron-500 uppercase tracking-widest font-extrabold block">
                    National Land Acquisition & Management System
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  Unified Land Lifecycle & AI Delay Risk Engine
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Role-based platform connecting Citizens, Field CALA Officers, District Magistrates, State Secretariats, and Central PM Gati Shakti leadership.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-gov-green-500 shrink-0" />
                  <span>12-Stage End-to-End Acquisition Case Workflow</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-gov-green-500 shrink-0" />
                  <span>Interactive Cadastral GIS Parcel Color Mapping</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-gov-green-500 shrink-0" />
                  <span>Role-Based User Registration & Admin Approvals</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-gov-green-500 shrink-0" />
                  <span>Simulated Government REST Microservice Gateway</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 lg:mt-0 border-t border-gov-blue-800/80 relative z-10 hidden sm:block">
              <div className="flex items-center gap-1.5 text-[11px] text-gov-saffron-500 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart India Hackathon (SIH 2026) Prototype</span>
              </div>
            </div>
          </div>

          {/* Right Side: Role Selector & Login Form */}
          <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between bg-white space-y-4">
            <div className="space-y-4">
              {/* Top Login vs Register Nav Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gov-blue-900">
                    Role-Based Authentication
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">Sign In to Dashboard</h3>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    className="bg-white text-gov-blue-900 font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-slate-600 hover:text-gov-blue-900 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Status Alert Banner */}
              {pendingError && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                    pendingError.status === 'PENDING'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : pendingError.status === 'REJECTED'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-start gap-2 font-extrabold">
                    {pendingError.status === 'PENDING' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="block font-bold">
                        {pendingError.status === 'PENDING'
                          ? 'Account Verification Pending'
                          : pendingError.status === 'REJECTED'
                          ? 'Account Verification Rejected'
                          : pendingError.status === 'UNAUTHORIZED'
                          ? 'Authentication Failed'
                          : 'Sign In Notice'}
                      </span>
                      <p className="text-[11px] font-normal mt-0.5">{pendingError.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 1-Click Role Selector Grid (6 SIH Roles + Admin) */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-gov-saffron-600" />
                    Select Official Persona (1-Click Demo)
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Password: Bhoomi@123</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {DEMO_CREDENTIALS.map((cred) => {
                    const isSelected = selectedRole === cred.role;
                    return (
                      <button
                        key={cred.role}
                        type="button"
                        onClick={() => handleQuickRoleFill(cred)}
                        className={`text-left p-2 rounded-xl border text-[10px] sm:text-[11px] transition ${
                          isSelected
                            ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-md ring-2 ring-gov-saffron-500/50'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-bold block truncate">
                          {ROLE_DETAILS[cred.role]?.title || cred.role.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {ROLE_DETAILS[cred.role]?.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@bhoomisetu.gov.in"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-gov-blue-800"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-9 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-gov-blue-800"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-gov-md transition transform active:scale-98"
                >
                  {isLoading ? (
                    <span>Opening {roleInfo.title} Dashboard...</span>
                  ) : (
                    <>
                      <span>Sign In as {roleInfo.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Registration CTA */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-gov-blue-900 hover:text-gov-saffron-600 font-extrabold flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-gov-saffron-500" />
                  <span>Don't have an account? <strong>Register here</strong></span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-gov-green-600" />
                NICNET 256-Bit SSL Encrypted Session
              </span>
              <span>RFCTLARR Act 2013 Aligned</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-400 text-center py-2 px-3 text-[9px] sm:text-[10px] border-t border-slate-800">
        {PROTOTYPE_DISCLAIMER}
      </div>
    </div>
  );
};
