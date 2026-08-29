import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GovEmblem } from '../../components/common/GovEmblem';
import { PROTOTYPE_DISCLAIMER } from '../../utils/constants';
import {
  User,
  ShieldCheck,
  Building2,
  Landmark,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const RegisterRoleSelectionPage = () => {
  const navigate = useNavigate();

  const roleOptions = [
    {
      id: 'citizen',
      title: 'Citizen / Land Owner',
      desc: 'Track land acquisition, view official gazette notifications, submit claims & objections, and monitor DBT compensation payments.',
      path: '/register/citizen',
      icon: User,
      color: 'from-amber-500 to-gov-saffron-600',
      badge: 'Instant Activation (via OTP)',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      features: ['View RoR land survey details', 'Upload photo evidence with claims', 'Direct PFMS bank credit tracker'],
    },
    {
      id: 'officer',
      title: 'Government Officer',
      desc: 'Manage field verification, ground inspections, revenue checks, cadastral approvals, and statutory acquisition workflow queues.',
      path: '/register/officer',
      icon: ShieldCheck,
      color: 'from-gov-blue-800 to-gov-blue-950',
      badge: 'Requires Admin / Dept Approval',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      features: ['Tehsildar / CALA field desk', 'ETS drone survey verification', 'Statutory Section 11/15/19 processing'],
    },
    {
      id: 'agency',
      title: 'Project Implementing Agency',
      desc: 'Submit and manage infrastructure project corridor alignments, requisition land parcels, and monitor contractor possession handover.',
      path: '/register/agency',
      icon: Building2,
      color: 'from-cyan-700 to-blue-900',
      badge: 'Requires Admin Verification',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      features: ['NHAI / Railways corridor proposals', '60m ROW alignment georeferencing', 'R&R entitlement monitoring'],
    },
    {
      id: 'authority',
      title: 'Government Authority',
      desc: 'For District Authorities (DM / Collector), State Governments (Revenue Dept), and Central Ministries (PM Gati Shakti / MoRTH).',
      path: '/register/authority',
      icon: Landmark,
      color: 'from-purple-800 to-indigo-950',
      badge: 'Quasi-Judicial & Ministry Tier',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
      features: ['Section 19 statutory declarations', 'Quasi-judicial hearing orders', 'Cabinet / National monitoring'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Gov Bar */}
      <div className="bg-gov-blue-950 text-slate-300 px-3 sm:px-6 py-2 text-[10px] sm:text-xs flex items-center justify-between border-b border-gov-blue-900">
        <div className="flex items-center gap-1.5 sm:gap-2 font-semibold truncate">
          <span className="text-gov-saffron-500 truncate">भारत सरकार | Government of India</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden md:inline">BhoomiSetu National Registration Portal</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gov-saffron-600/30 text-gov-saffron-500 font-bold px-2 py-0.5 rounded text-[9px] sm:text-[10px] border border-gov-saffron-500/40">
            SIH 2026 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Portal Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <GovEmblem size="md" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              BHOOMI<span className="text-gov-saffron-600">SETU</span>
            </h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Create BhoomiSetu Account
          </h2>
          <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto">
            Select your role to continue registration on the National Land Acquisition & Management Portal
          </p>

          {/* Stepper Indicator */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-gov-blue-900 text-white font-extrabold flex items-center justify-center ring-4 ring-gov-blue-100 shadow">
                  1
                </span>
                <span className="font-extrabold text-gov-blue-900 mt-1.5 text-[11px]">Select Role</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-300 mx-2 -mt-4" />
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center">
                  2
                </span>
                <span className="font-semibold text-slate-400 mt-1.5 text-[11px]">Details Form</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-300 mx-2 -mt-4" />
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center">
                  3
                </span>
                <span className="font-semibold text-slate-400 mt-1.5 text-[11px]">Verification</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-300 mx-2 -mt-4" />
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center">
                  4
                </span>
                <span className="font-semibold text-slate-400 mt-1.5 text-[11px]">Activation</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Role Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-gov hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-5 group hover:border-gov-blue-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${role.badgeClass}`}>
                      {role.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-gov-blue-900 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                      {role.desc}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {role.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate(role.path)}
                  className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition transform active:scale-98 group-hover:bg-gov-saffron-600"
                >
                  <span>Continue as {role.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Search className="w-4 h-4 text-gov-blue-900" />
            <span>Already submitted an application?</span>
            <button
              onClick={() => navigate('/registration-status')}
              className="text-gov-blue-900 font-extrabold hover:underline"
            >
              Track Registration Status
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <span>Already have an active account?</span>
            <button
              onClick={() => navigate('/login')}
              className="bg-slate-100 hover:bg-slate-200 text-gov-blue-900 font-extrabold px-4 py-2 rounded-xl border border-slate-200 transition"
            >
              Sign In to Portal
            </button>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="bg-slate-900 text-slate-400 text-center py-2.5 px-3 text-[9px] sm:text-[10px] border-t border-slate-800">
        {PROTOTYPE_DISCLAIMER}
      </div>
    </div>
  );
};
