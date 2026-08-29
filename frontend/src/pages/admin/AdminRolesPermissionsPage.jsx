import React, { useState, useEffect } from 'react';
import {
  fetchAdminRolesPermissionsApi,
  updateAdminRolesPermissionsApi,
} from '../../services/api/adminApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  KeyRound,
  ShieldCheck,
  Check,
  X,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Building2,
  Globe,
  Layers,
} from 'lucide-react';

const AdminRolesPermissionsContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const permissionsList = ['VIEW', 'ADD', 'EDIT', 'UPDATE', 'UPLOAD', 'FORWARD', 'ESCALATE'];

  const defaultMatrix = {
    DISTRICT: ['VIEW', 'EDIT', 'UPDATE', 'UPLOAD', 'FORWARD', 'ESCALATE'],
    STATE: ['VIEW', 'EDIT', 'UPDATE', 'FORWARD', 'ESCALATE'],
    CENTRAL: ['VIEW', 'UPDATE', 'FORWARD', 'ESCALATE'],
    REVENUE_OFFICER: ['VIEW', 'ADD', 'EDIT', 'UPDATE', 'UPLOAD', 'FORWARD'],
    TEHSILDAR: ['VIEW', 'EDIT', 'UPDATE', 'UPLOAD', 'FORWARD', 'ESCALATE'],
    EXECUTIVE_OFFICER: ['VIEW', 'EDIT', 'UPDATE', 'UPLOAD', 'FORWARD'],
    PROJECT_AGENCY: ['VIEW', 'UPDATE', 'UPLOAD', 'FORWARD'],
  };

  const roleDefinitions = [
    { key: 'DISTRICT', label: 'District Magistrate / CALA Authority', icon: Building2, desc: 'District statutory sanctions, award declarations & judicial dispute orders.' },
    { key: 'STATE', label: 'State Government (Revenue & Infra)', icon: Globe, desc: 'Multi-district corridor monitoring & inter-district bottleneck escalations.' },
    { key: 'CENTRAL', label: 'Central Ministry (PM Gati Shakti)', icon: ShieldCheck, desc: 'National corridor oversight, central budgeting & multi-state coordination.' },
    { key: 'REVENUE_OFFICER', label: 'Revenue Officer (Field CALA)', icon: Building2, desc: 'Ground-truthing of RoR cadastral records & objection investigations.' },
    { key: 'TEHSILDAR', label: 'Tehsildar (Executive Officer)', icon: ShieldCheck, desc: 'Statutory verification oversight & Section 15 objection processing.' },
    { key: 'EXECUTIVE_OFFICER', label: 'Executive Officer (PIA Lead)', icon: Layers, desc: 'Corridor planning, boundary demarcation & contractor handover tracking.' },
    { key: 'PROJECT_AGENCY', label: 'Project Implementing Agency (PIA)', icon: Layers, desc: 'Civil construction execution, milestone progress & field issue reporting.' },
  ];

  const [matrix, setMatrix] = useState(defaultMatrix);

  useEffect(() => {
    fetchAdminRolesPermissionsApi()
      .then((data) => {
        if (data && data.roles) {
          const map = {};
          data.roles.forEach((r) => {
            map[r.roleKey] = r.assignedPermissions || [];
          });
          setMatrix(map);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const togglePermission = (roleKey, perm) => {
    const current = matrix[roleKey] || [];
    let updated;
    if (current.includes(perm)) {
      updated = current.filter((p) => p !== perm);
    } else {
      updated = [...current, perm];
    }
    setMatrix({ ...matrix, [roleKey]: updated });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await updateAdminRolesPermissionsApi({ matrix });
      setNotice({ type: 'success', text: 'Roles & Permissions matrix successfully updated and enforced platform-wide.' });
    } catch (err) {
      console.error(err);
      setNotice({ type: 'error', text: 'Failed to update permissions.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset all roles & permissions to statutory defaults?')) return;
    setMatrix(defaultMatrix);
    setNotice({ type: 'info', text: 'Permissions reset to statutory default configuration. Click Save to persist.' });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-700" />
              <span>Role-Based Access Control (RBAC)</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Granular Permission Matrix</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>Roles & Permissions Governance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign and enforce statutory operational permissions across District, State, Central, Revenue, Tehsildar, Executive, and PIA roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-gov flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Permissions'}</span>
          </button>
        </div>
      </div>

      {/* Notice Alert */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RBAC Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 min-w-[280px]">Statutory Role</th>
                {permissionsList.map((perm) => (
                  <th key={perm} className="py-4 px-4 text-center min-w-[100px]">
                    <span className="font-bold">{perm}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {roleDefinitions.map((role) => {
                const assigned = matrix[role.key] || [];
                const IconComponent = role.icon;
                return (
                  <tr key={role.key} className="hover:bg-purple-50/20 transition">
                    {/* Role Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900">{role.label}</h4>
                          <span className="font-mono text-[10px] text-purple-700 font-bold block">{role.key}</span>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{role.desc}</p>
                        </div>
                      </div>
                    </td>

                    {/* Permissions Toggles */}
                    {permissionsList.map((perm) => {
                      const isChecked = assigned.includes(perm);
                      return (
                        <td key={perm} className="py-4 px-4 text-center">
                          <button
                            onClick={() => togglePermission(role.key, perm)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition border ${
                              isChecked
                                ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border-slate-200'
                            }`}
                            title={`${isChecked ? 'Revoke' : 'Grant'} ${perm} for ${role.label}`}
                          >
                            {isChecked ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>Click any permission cell to grant/revoke. Changes take effect across user sessions upon saving.</span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs px-4 py-1.5 rounded-xl shadow transition self-end sm:self-auto"
          >
            {saving ? 'Saving...' : 'Apply Matrix'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminRolesPermissionsPage = () => (
  <ErrorBoundary fallbackTitle="Roles & Permissions Error">
    <AdminRolesPermissionsContent />
  </ErrorBoundary>
);

export default AdminRolesPermissionsPage;
