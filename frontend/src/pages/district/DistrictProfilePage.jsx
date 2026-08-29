import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictProfileApi } from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  User,
  ShieldCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Key,
  Layers,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const DistrictProfileContent = () => {
  const { currentUser, hasPermission } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchDistrictProfileApi().then((data) => {
      if (data) setProfile(data);
    });
  }, [currentUser]);

  const p = profile || {
    name: currentUser?.name || 'Dr. Sunita Murthy, IAS',
    email: currentUser?.email || 'district.officer@bhoomisetu.gov.in',
    mobile: currentUser?.mobile || '+91 562 226 0001',
    role: currentUser?.role || 'DISTRICT_MAGISTRATE',
    designation: currentUser?.designation || 'District Magistrate & Collector / Competent Authority (CALA)',
    department: currentUser?.department || 'Office of the District Magistrate & Collectorate, Agra',
    district: currentUser?.district || 'Agra',
    state: 'Uttar Pradesh',
    employeeId: currentUser?.employeeId || 'IAS-UP-2012-0044',
    jurisdiction: currentUser?.jurisdiction || 'Entire District Agra (5 Tehsils: Sadar, Fatehabad, Bah, Etmadpur, Kheragarh)',
    assignedProjects: ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-004', 'PRJ-005'],
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PROJECTS',
      'VIEW_ACQUISITION',
      'VIEW_GIS',
      'VIEW_LAND',
      'VIEW_DISPUTES',
      'VIEW_COMPENSATION',
      'VIEW_R_AND_R',
      'VIEW_OFFICERS',
      'VIEW_COORDINATION',
      'MANAGE_COORDINATION',
      'VIEW_ESCALATIONS',
      'MANAGE_ESCALATIONS',
      'VIEW_DELAYED_CASES',
      'VIEW_REPORTS',
      'VIEW_DOCUMENTS',
      'VIEW_NOTIFICATIONS',
      'VIEW_AUDIT',
    ],
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              IAM Credentials & RBAC
            </span>
            <span className="text-xs font-bold text-slate-500">Official Profile</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            <span>District Authority Official Dossier</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified NICNET identity, administrative jurisdiction, statutory delegated powers, and project assignments.
          </p>
        </div>

        <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Authority Verified</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Officer ID Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">{p.name}</h2>
              <p className="text-xs text-purple-700 font-bold mt-0.5">{p.designation}</p>
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
                <span>{p.district} District, {p.state}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block">Statutory RBAC Protection</strong>
              <span className="text-[11px] text-purple-700">
                Permissions and jurisdiction are enforced cryptographically via backend JWT.
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Permissions & Assigned Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statutory Permissions Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-600" />
                <span>Delegated RBAC Permissions (Read-Only)</span>
              </h3>
              <span className="text-xs text-slate-400">Granted by NICNET IAM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {p.permissions.map((perm) => (
                <div
                  key={perm}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-mono font-bold text-slate-800 text-[11px] truncate" title={perm}>
                    {perm}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Corridors */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <span>Assigned Infrastructure Corridors within Jurisdiction</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <div>
                  <strong className="text-purple-900 block font-black">Delhi–Meerut Expressway Expansion (NH-348)</strong>
                  <span className="text-[11px] text-purple-700">Project ID: PRJ-001 • CALA: Fatehabad Tehsil</span>
                </div>
                <span className="bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 block font-black">Agra Western Ring Road Phase-2</strong>
                  <span className="text-[11px] text-slate-500">Project ID: PRJ-002 • CALA: Sadar & Fatehabad Tehsils</span>
                </div>
                <span className="bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">In Progress</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 block font-black">Yamuna Expressway Interconnect Spur</strong>
                  <span className="text-[11px] text-slate-500">Project ID: PRJ-003 • CALA: Etmadpur Tehsil</span>
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">Hearings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DistrictProfilePage = () => (
  <ErrorBoundary>
    <DistrictProfileContent />
  </ErrorBoundary>
);

export default DistrictProfilePage;
