import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { User, ShieldCheck, Building2, MapPin, Mail, Phone, Lock, Globe, Layers } from 'lucide-react';

const CentralProfileContent = () => {
  const { currentUser } = useAuth();

  const p = {
    name: currentUser?.name || 'Dr. Arvind Meena, IAS',
    email: currentUser?.email || 'central.officer@bhoomisetu.gov.in',
    mobile: currentUser?.mobile || '+91 11 2309 4512',
    role: 'CENTRAL_MINISTRY',
    designation: 'Joint Secretary, PM Gati Shakti National Master Plan',
    department: 'Cabinet Secretariat & Ministry of Road Transport and Highways (MoRTH)',
    state: 'Delhi (NCT)',
    employeeId: 'IAS-AGMUT-2008-0099',
    jurisdiction: 'Pan-India National Infrastructure Corridors (All 28 States & 8 UTs)',
    monitoredProjects: 100,
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200 uppercase tracking-wider">
              PM Gati Shakti Central IAM Dossier
            </span>
            <span className="text-xs font-bold text-slate-500">Official Profile</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <User className="w-6 h-6 text-gov-blue-800" />
            <span>PM Gati Shakti Central Leadership Credentials</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified NICNET Cabinet Secretariat credentials, national jurisdiction, and infrastructure mandate.
          </p>
        </div>

        <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cabinet Secretariat Verified</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-gov-blue-950 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
              AM
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">{p.name}</h2>
              <p className="text-xs text-gov-blue-800 font-bold mt-0.5">{p.designation}</p>
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
                <span>Transport Bhawan, 1 Parliament Street, New Delhi</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gov-blue-50 rounded-xl border border-gov-blue-200 text-xs text-gov-blue-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-gov-blue-800 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block">Pan-India Leadership Mandate</strong>
              <span className="text-[11px] text-gov-blue-700">
                Authorized for macro alignment approvals and inter-ministerial coordination across all Central Line Ministries.
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gov-blue-800" />
              <span>National Gati Shakti Strategic Mandates</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold">1. Multi-Modal Linear Infrastructure Integration</strong>
                <p className="text-slate-600 leading-relaxed">
                  Unified GIS tracking of NHAI Expressways, Dedicated Freight Rail Corridors (DFCCIL), and Gas Pipelines.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold">2. National PFMS DBT Gateway Monitoring</strong>
                <p className="text-slate-600 leading-relaxed">
                  Ensuring direct credit of compensation and solatium awards without intermediary leakages.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold">3. Empowered Group of Secretaries (EGoS) Resolution</strong>
                <p className="text-slate-600 leading-relaxed">
                  Cabinet-level fast-tracking of inter-state bottlenecks and environmental clearances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CentralProfilePage = () => (
  <ErrorBoundary>
    <CentralProfileContent />
  </ErrorBoundary>
);

export default CentralProfilePage;
