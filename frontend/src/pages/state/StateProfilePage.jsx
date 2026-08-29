import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { User, ShieldCheck, Building2, MapPin, Mail, Phone, Lock, Layers } from 'lucide-react';

const StateProfileContent = () => {
  const { currentUser } = useAuth();

  const p = {
    name: currentUser?.name || 'Sh. Sanjeev Khare, IAS',
    email: currentUser?.email || 'state.officer@bhoomisetu.gov.in',
    mobile: currentUser?.mobile || '+91 522 223 9012',
    role: 'STATE_GOVERNMENT',
    designation: 'Principal Secretary, Revenue & Infrastructure Oversight',
    department: 'Department of Revenue & Land Reforms, Govt. of Uttar Pradesh',
    state: currentUser?.state || 'Uttar Pradesh',
    employeeId: 'IAS-UP-2005-0012',
    jurisdiction: 'Entire State of Uttar Pradesh (All 75 Districts & 350+ Tehsils)',
    assignedCorridors: 32,
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              State Government IAM Dossier
            </span>
            <span className="text-xs font-bold text-slate-500">Official Profile</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            <span>State Revenue Secretariat Official Credentials</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified NICNET state authority credentials, administrative jurisdiction, and corridor mandates.
          </p>
        </div>

        <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>State Secretariat Verified</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-700 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              SK
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">{p.name}</h2>
              <p className="text-xs text-indigo-700 font-bold mt-0.5">{p.designation}</p>
              <span className="inline-block mt-2 font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {p.employeeId}
              </span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-[11px]">{p.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{p.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{p.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Bapu Bhawan Secretariat, Lucknow, {p.state}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-indigo-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block">Statewide Secretariat Role</strong>
              <span className="text-[11px] text-indigo-700">
                Authorized for macro multi-corridor decision making and PFMS DBT clearance across all 75 districts.
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Delegated State Jurisdiction & Statutory Powers</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold">1. Multi-District Right of Way (ROW) Oversight</strong>
                <p className="text-slate-600 leading-relaxed">
                  Direct supervisory control over 75 District Magistrates / CALA authorities for linear expressway and railway corridors traversing multiple districts.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold">2. State PFMS DBT Fund Clearance</strong>
                <p className="text-slate-600 leading-relaxed">
                  Release of state budgetary matching grants and treasury sanctioning of compensation award escrows.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold">3. Inter-Departmental Coordination Resolution</strong>
                <p className="text-slate-600 leading-relaxed">
                  Resolution of Stage-II forest clearances, high-tension power grid utility shifting, and irrigation canal permissions at the State Cabinet level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StateProfilePage = () => (
  <ErrorBoundary>
    <StateProfileContent />
  </ErrorBoundary>
);

export default StateProfilePage;
