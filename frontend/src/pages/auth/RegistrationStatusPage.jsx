import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GovEmblem } from '../../components/common/GovEmblem';
import { REGISTRATION_STATUS, PROTOTYPE_DISCLAIMER } from '../../utils/constants';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building2,
  User,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';

export const RegistrationStatusPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registrations, getRegistrationStatus } = useAuth();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('id') || 'APP-OFF-2026-0042');
  const [searchedRecord, setSearchedRecord] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const found = getRegistrationStatus(searchQuery.trim());
      setSearchedRecord(found || null);
      setHasSearched(true);
    }
  }, [searchQuery, registrations]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getRegistrationStatus(searchQuery.trim());
    setSearchedRecord(found || null);
    setHasSearched(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case REGISTRATION_STATUS.ACTIVE:
      case REGISTRATION_STATUS.APPROVED:
        return { label: 'Active / Approved', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2, dot: 'bg-emerald-600' };
      case REGISTRATION_STATUS.UNDER_REVIEW:
        return { label: 'Under Review / Vigilance', bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: Clock, dot: 'bg-blue-600' };
      case REGISTRATION_STATUS.REJECTED:
        return { label: 'Application Rejected', bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: XCircle, dot: 'bg-rose-600' };
      case REGISTRATION_STATUS.PENDING_VERIFICATION:
      case REGISTRATION_STATUS.PENDING:
      default:
        return { label: 'Pending Admin Verification', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock, dot: 'bg-amber-600' };
    }
  };

  // Determine timeline step progression
  const getTimelineSteps = (record) => {
    const isCitizen = record.role === 'CITIZEN';
    const isApproved = record.status === REGISTRATION_STATUS.ACTIVE || record.status === REGISTRATION_STATUS.APPROVED;
    const isRejected = record.status === REGISTRATION_STATUS.REJECTED;
    const isUnderReview = record.status === REGISTRATION_STATUS.UNDER_REVIEW;

    if (isCitizen) {
      return [
        { label: 'Application Submitted', desc: 'Citizen profile details registered', completed: true, active: false },
        { label: 'Mobile / Aadhaar OTP Verified', desc: 'NICNET Two-Factor Auth confirmed', completed: true, active: false },
        { label: 'Citizen Account Active', desc: 'Instant portal access enabled', completed: true, active: true },
      ];
    }

    return [
      {
        label: '1. Registration Submitted',
        desc: `Submitted on ${record.createdAt || 'Recent'}`,
        completed: true,
        active: false,
      },
      {
        label: '2. Credentials & Employee ID Verified',
        desc: isApproved || isUnderReview ? 'Service credentials validated' : 'Automated validation checks passed',
        completed: isApproved || isUnderReview,
        active: record.status === REGISTRATION_STATUS.PENDING_VERIFICATION,
      },
      {
        label: '3. Department / Vigilance Verification',
        desc: isApproved ? 'Vigilance clearance completed' : isUnderReview ? 'Active department review in progress' : 'Awaiting administrative verification',
        completed: isApproved,
        active: isUnderReview,
      },
      {
        label: '4. Admin Approval & Access Sanction',
        desc: isApproved ? `Approved on ${record.verifiedAt || 'Recent'}` : isRejected ? 'Rejected by administrator' : 'Pending final administrative sign-off',
        completed: isApproved,
        active: isRejected,
        isError: isRejected,
      },
      {
        label: '5. Account Active (Dashboard Unlocked)',
        desc: isApproved ? 'Full role-based dashboard access unlocked' : 'Pending approval to unlock',
        completed: isApproved,
        active: isApproved,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Gov Bar */}
      <div className="bg-gov-blue-950 text-slate-300 px-3 sm:px-6 py-2 text-[10px] sm:text-xs flex items-center justify-between border-b border-gov-blue-900">
        <div className="flex items-center gap-1.5 sm:gap-2 font-semibold truncate">
          <span className="text-gov-saffron-500 truncate">भारत सरकार | Government of India</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden md:inline">Registration Status Tracking & Verification System</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gov-saffron-600/30 text-gov-saffron-500 font-bold px-2 py-0.5 rounded text-[9px] sm:text-[10px] border border-gov-saffron-500/40">
            SIH 2026 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Header & Back Action */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-gov-blue-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login</span>
          </button>

          <button
            onClick={() => navigate('/register')}
            className="text-xs font-extrabold text-gov-blue-900 hover:underline"
          >
            + Register New Account
          </button>
        </div>

        {/* Search Application Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-gov space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Track BhoomiSetu Registration Status
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Enter your Application Reference ID (e.g. <span className="font-mono font-bold">APP-OFF-2026-0042</span>) or Registered Email.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Application ID or Email..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-gov-blue-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow transition shrink-0"
            >
              Track Status
            </button>
          </form>

          {/* Quick Demo Selector Chips */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Demo Applications:</span>
            {registrations.slice(0, 4).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSearchQuery(r.applicationId)}
                className="bg-slate-100 hover:bg-gov-blue-50 text-slate-700 hover:text-gov-blue-900 px-2.5 py-1 rounded-lg font-mono font-bold border border-slate-200 transition"
              >
                {r.applicationId} ({r.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        {hasSearched && (
          searchedRecord ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-gov space-y-6 animate-fadeIn">
              {/* Top Details Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-gov-blue-900 bg-gov-blue-50 px-2.5 py-0.5 rounded-lg border border-gov-blue-200">
                      {searchedRecord.applicationId}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-600">Role: {searchedRecord.role?.replace(/_/g, ' ')}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {searchedRecord.name}
                    {searchedRecord.organizationName && <span className="text-xs font-semibold text-slate-500 block">{searchedRecord.organizationName}</span>}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {searchedRecord.department} • {searchedRecord.district}, {searchedRecord.state}
                  </p>
                </div>

                {/* Status Badge */}
                {(() => {
                  const statusInfo = getStatusBadge(searchedRecord.status);
                  const Icon = statusInfo.icon;
                  return (
                    <div className={`p-3 rounded-2xl border ${statusInfo.bg} flex items-center gap-2 shrink-0`}>
                      <Icon className="w-5 h-5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Application Status</span>
                        <span className="font-black text-xs">{statusInfo.label}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Rejection Alert Box (if rejected) */}
              {searchedRecord.status === REGISTRATION_STATUS.REJECTED && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                  <div className="flex items-center gap-2 font-extrabold text-rose-950">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>Application Rejection Remarks:</span>
                  </div>
                  <p className="text-rose-800 leading-relaxed pl-6">
                    {searchedRecord.rejectionReason || 'Discrepancy identified during official verification.'}
                  </p>
                </div>
              )}

              {/* Step-by-Step Visual Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Verification Lifecycle Progression
                </h4>

                <div className="space-y-3 pl-2">
                  {getTimelineSteps(searchedRecord).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : step.isError
                          ? 'bg-rose-600 text-white'
                          : step.active
                          ? 'bg-gov-blue-900 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : step.isError ? '✕' : idx + 1}
                      </div>

                      <div className="space-y-0.5 text-xs flex-1">
                        <span className={`font-extrabold ${step.completed ? 'text-slate-900' : step.isError ? 'text-rose-700' : 'text-slate-600'}`}>
                          {step.label}
                        </span>
                        <p className="text-[11px] text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Last updated: <span className="font-semibold text-slate-600">{searchedRecord.verifiedAt || searchedRecord.createdAt}</span>
                </span>

                {searchedRecord.status === REGISTRATION_STATUS.ACTIVE || searchedRecord.status === REGISTRATION_STATUS.APPROVED ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold px-6 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <span>Proceed to Portal Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Back to Login
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">No Application Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No matching registration found for "<strong>{searchQuery}</strong>". Please verify the Application ID or registered email.
              </p>
            </div>
          )
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="bg-slate-900 text-slate-400 text-center py-2.5 px-3 text-[9px] sm:text-[10px] border-t border-slate-800">
        {PROTOTYPE_DISCLAIMER}
      </div>
    </div>
  );
};
