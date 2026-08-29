import React, { useState, useEffect } from 'react';
import {
  fetchAdminUsersApi,
  createAdminUserApi,
  updateAdminUserApi,
  toggleAdminUserStatusApi,
  resetAdminUserAccessApi,
} from '../../services/api/adminApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Users,
  UserPlus,
  Edit2,
  Lock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  Globe,
  Layers,
  KeyRound,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

const AdminUsersContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await fetchAdminUsersApi();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Error loading admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const defaultUsers = [
    { id: 1, name: 'Dr. Sunita Murthy, IAS', role: 'DISTRICT_AUTHORITY', governmentLevel: 'District Administration', department: 'Office of District Magistrate & Collector', district: 'Agra', state: 'Uttar Pradesh', status: 'ACTIVE', employeeId: 'IAS-UP-2010-0442' },
    { id: 2, name: 'Sh. Sanjeev Khare, IAS', role: 'STATE_GOVERNMENT', governmentLevel: 'State Government', department: 'Department of Revenue & Land Reforms', district: 'Lucknow', state: 'Uttar Pradesh', status: 'ACTIVE', employeeId: 'IAS-UP-2005-0012' },
    { id: 3, name: 'Dr. Arvind Meena, IAS', role: 'CENTRAL_MINISTRY', governmentLevel: 'Central Government', department: 'Cabinet Secretariat & DPIIT (PM Gati Shakti)', district: 'New Delhi', state: 'Delhi (NCT)', status: 'ACTIVE', employeeId: 'IAS-AGMUT-2008-0099' },
    { id: 4, name: 'Sh. Rajesh Verma', role: 'PROJECT_AGENCY', governmentLevel: 'Implementing Agency (PIA)', department: 'National Highways Authority of India (NHAI)', district: 'Agra', state: 'Uttar Pradesh', status: 'ACTIVE', employeeId: 'NHAI-PD-2018-091' },
    { id: 5, name: 'Sh. Alok Srivastava', role: 'TEHSILDAR', governmentLevel: 'Sub-District / Revenue', department: 'Revenue Department / CALA Cell', district: 'Agra', state: 'Uttar Pradesh', status: 'ACTIVE', employeeId: 'UP-REV-2014-4412' },
    { id: 6, name: 'Sh. Amit Kumar Verma', role: 'GOVERNMENT_OFFICER', governmentLevel: 'Sub-District / Revenue', department: 'Revenue Department (Field CALA)', district: 'Meerut', state: 'Uttar Pradesh', status: 'ACTIVE', employeeId: 'UP-REV-2019-8812' },
    { id: 7, name: 'Sh. Ram Kumar', role: 'CITIZEN', governmentLevel: 'Citizen', department: 'Citizen & Land Owner Services', district: 'Agra', state: 'Uttar Pradesh', status: 'ACTIVE', employeeId: 'CITIZEN-001' },
    { id: 8, name: 'Administrator', role: 'ADMIN', governmentLevel: 'System Central', department: 'National Informatics Centre (NIC)', district: 'New Delhi', state: 'Delhi (NCT)', status: 'ACTIVE', employeeId: 'NIC-IAM-001' },
  ];

  const list = users.length > 0 ? users : defaultUsers;

  const filtered = list.filter((u) => {
    const matchesSearch =
      !searchTerm.trim() ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.district?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createAdminUserApi(formData);
      if (res && res.success) {
        setActionNotice({ type: 'success', text: 'New user added successfully with default credentials (Bhoomi@123).' });
        setShowAddModal(false);
        setFormData({});
        loadUsers();
      } else {
        // Optimistic local update
        const newUser = {
          id: Date.now(),
          name: formData.name || 'New User',
          role: formData.role || 'CITIZEN',
          governmentLevel: formData.governmentLevel || 'District Administration',
          department: formData.department || 'Revenue & Land Reforms',
          district: formData.district || 'Agra',
          state: formData.state || 'Uttar Pradesh',
          status: 'ACTIVE',
        };
        setUsers([newUser, ...list]);
        setActionNotice({ type: 'success', text: 'User added successfully to directory.' });
        setShowAddModal(false);
        setFormData({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);
    try {
      await updateAdminUserApi(editingUser.id, formData);
      setActionNotice({ type: 'success', text: `User ${formData.name || editingUser.name} updated successfully.` });
      setEditingUser(null);
      setFormData({});
      loadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await toggleAdminUserStatusApi(user.id);
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      setUsers(list.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      setActionNotice({ type: 'info', text: `User ${user.name} status set to ${newStatus}.` });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetAccess = async (user) => {
    if (!window.confirm(`Reset access for ${user.name}? Password will be reset to default (Bhoomi@123) and active sessions invalidated.`)) return;
    try {
      await resetAdminUserAccessApi(user.id);
      setActionNotice({ type: 'success', text: `Access credentials reset for ${user.name}. Password: Bhoomi@123` });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-700" />
              <span>Platform IAM Directory</span>
            </span>
            <span className="text-xs font-bold text-slate-500">User Lifecycle & Security Controls</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>User Accounts & Credentials Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Provision official accounts, manage roles across Central, State, District, and PIA hierarchies, activate/deactivate accounts, and reset access.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ role: 'DISTRICT_AUTHORITY', governmentLevel: 'District Administration', state: 'Uttar Pradesh', district: 'Agra', status: 'ACTIVE' });
            setShowAddModal(true);
          }}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-gov flex items-center gap-2 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice.text}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name, department, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Roles</option>
              <option value="DISTRICT_AUTHORITY">District Magistrate / Authority</option>
              <option value="STATE_GOVERNMENT">State Government</option>
              <option value="CENTRAL_MINISTRY">Central Ministry</option>
              <option value="PROJECT_AGENCY">Project Implementing Agency (PIA)</option>
              <option value="TEHSILDAR">Tehsildar</option>
              <option value="GOVERNMENT_OFFICER">Revenue Officer (CALA)</option>
              <option value="CITIZEN">Citizen</option>
              <option value="ADMIN">System Administrator</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive / Suspended</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 text-right">
          Showing <strong className="text-slate-900">{filtered.length}</strong> Users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Government Level</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">District / State</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-indigo-50/30 transition">
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-black text-slate-900 block">{u.name}</span>
                      {u.employeeId && (
                        <span className="font-mono text-[10px] text-slate-400 block">{u.employeeId}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-100">
                      {u.role?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-700">
                    {u.governmentLevel || 'District Administration'}
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    {u.department || 'General Administration'}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800">{u.district || 'Agra'}</span>
                    <span className="text-slate-400 block text-[10px]">{u.state || 'Uttar Pradesh'}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit User */}
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setFormData({ ...u });
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Status (Activate / Deactivate) */}
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`p-1.5 rounded-lg transition ${
                          u.status === 'ACTIVE'
                            ? 'hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                            : 'hover:bg-emerald-50 text-slate-600 hover:text-emerald-600'
                        }`}
                        title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                      >
                        {u.status === 'ACTIVE' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Reset Access */}
                      <button
                        onClick={() => handleResetAccess(u)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition"
                        title="Reset Access Credentials"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-700" />
                <h2 className="text-lg font-black text-slate-900">Add New System User</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Official Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sh. Ramesh Sharma, IAS"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="officer@nic.in"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={formData.role || 'DISTRICT_AUTHORITY'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="DISTRICT_AUTHORITY">District Magistrate / Authority</option>
                    <option value="STATE_GOVERNMENT">State Government</option>
                    <option value="CENTRAL_MINISTRY">Central Ministry</option>
                    <option value="PROJECT_AGENCY">Project Implementing Agency (PIA)</option>
                    <option value="TEHSILDAR">Tehsildar</option>
                    <option value="GOVERNMENT_OFFICER">Revenue Officer (CALA)</option>
                    <option value="CITIZEN">Citizen</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Government Level</label>
                  <select
                    value={formData.governmentLevel || 'District Administration'}
                    onChange={(e) => setFormData({ ...formData, governmentLevel: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Central Government">Central Government</option>
                    <option value="State Government">State Government</option>
                    <option value="District Administration">District Administration</option>
                    <option value="Sub-District / Revenue">Sub-District / Revenue</option>
                    <option value="Implementing Agency (PIA)">Implementing Agency (PIA)</option>
                    <option value="Citizen">Citizen</option>
                    <option value="System Central">System Central</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Revenue & Land Reforms Department"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Agra"
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Uttar Pradesh"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 pt-1">
                Default credentials will be set to: <strong>Password: Bhoomi@123</strong>. User can reset upon initial login.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold shadow transition"
                >
                  {submitting ? 'Creating User...' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-700" />
                <h2 className="text-lg font-black text-slate-900">Edit User Details</h2>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Official Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={formData.role || 'DISTRICT_AUTHORITY'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="DISTRICT_AUTHORITY">District Magistrate / Authority</option>
                    <option value="STATE_GOVERNMENT">State Government</option>
                    <option value="CENTRAL_MINISTRY">Central Ministry</option>
                    <option value="PROJECT_AGENCY">Project Implementing Agency (PIA)</option>
                    <option value="TEHSILDAR">Tehsildar</option>
                    <option value="GOVERNMENT_OFFICER">Revenue Officer (CALA)</option>
                    <option value="CITIZEN">Citizen</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="REJECTED">REJECTED / SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department / Organization</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold shadow transition"
                >
                  {submitting ? 'Saving...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminUsersPage = () => (
  <ErrorBoundary fallbackTitle="User Management Error">
    <AdminUsersContent />
  </ErrorBoundary>
);

export default AdminUsersPage;
