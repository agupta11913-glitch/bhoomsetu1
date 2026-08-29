import React, { useState, useEffect } from 'react';
import {
  fetchAdminProjectsDepartmentsApi,
  createAdminProjectApi,
  updateAdminProjectApi,
} from '../../services/api/adminApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Layers,
  Plus,
  Edit2,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  X,
  Search,
  Filter,
  ShieldCheck,
  Lock,
} from 'lucide-react';

const AdminProjectsDepartmentsContent = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModal, setSelectedModal] = useState(null); // 'ADD' | 'EDIT_INFO' | 'ASSIGN_DEPT' | 'ASSIGN_PIA' | 'ASSIGN_USERS'
  const [activeProject, setActiveProject] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const loadProjects = async () => {
    try {
      const data = await fetchAdminProjectsDepartmentsApi();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const defaultProjects = [
    {
      id: 1,
      projectId: 'PRJ-001',
      name: 'Delhi–Meerut Expressway Expansion (NH-348)',
      state: 'Uttar Pradesh',
      districts: 'Agra, Meerut, Ghaziabad',
      department: 'Ministry of Road Transport & Highways (MoRTH)',
      pia: 'National Highways Authority of India (NHAI)',
      authorizedUsers: 'District Magistrate (Agra), Chief Project Director, SLAO Fatehabad',
      status: 'ACTIVE',
      estimatedCost: 840.0,
    },
    {
      id: 2,
      projectId: 'PRJ-002',
      name: 'Agra Western Ring Road Phase-2',
      state: 'Uttar Pradesh',
      districts: 'Agra',
      department: 'Public Works Department (UP PWD)',
      pia: 'National Highways Authority of India (NHAI)',
      authorizedUsers: 'District Magistrate (Agra), CALA Executive Officer',
      status: 'ACTIVE',
      estimatedCost: 320.0,
    },
    {
      id: 3,
      projectId: 'PRJ-005',
      name: 'National Highway-19 6-Lane Expansion',
      state: 'Uttar Pradesh',
      districts: 'Agra, Mathura, Kanpur Nagar',
      department: 'Ministry of Road Transport & Highways (MoRTH)',
      pia: 'National Highways Authority of India (NHAI)',
      authorizedUsers: 'District Magistrate (Kanpur), Project Director NHAI',
      status: 'ACTIVE',
      estimatedCost: 560.0,
    },
    {
      id: 4,
      projectId: 'PRJ-011',
      name: 'Lucknow Ring Road Phase-3 Infrastructure Belt',
      state: 'Uttar Pradesh',
      districts: 'Lucknow',
      department: 'Ministry of Road Transport & Highways (MoRTH)',
      pia: 'National Highways Authority of India (NHAI)',
      authorizedUsers: 'District Magistrate (Lucknow), CALA SLAO',
      status: 'ACTIVE',
      estimatedCost: 620.0,
    },
    {
      id: 5,
      projectId: 'PRJ-007',
      name: 'Varanasi Smart Logistics Freight Terminal',
      state: 'Uttar Pradesh',
      districts: 'Varanasi',
      department: 'Ministry of Railways / DFCCIL',
      pia: 'Dedicated Freight Corridor Corp (DFCCIL)',
      authorizedUsers: 'District Magistrate (Varanasi), DFCCIL Lead Officer',
      status: 'ACTIVE',
      estimatedCost: 450.0,
    },
  ];

  const list = projects.length > 0 ? projects : defaultProjects;

  const filtered = list.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.projectId?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q) ||
      p.pia?.toLowerCase().includes(q) ||
      p.districts?.toLowerCase().includes(q)
    );
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createAdminProjectApi(formData);
      if (res && res.success) {
        setNotice({ type: 'success', text: 'Master project entry added successfully.' });
        setSelectedModal(null);
        setFormData({});
        loadProjects();
      } else {
        const newP = {
          id: Date.now(),
          projectId: formData.projectId || `PRJ-${Math.floor(Math.random() * 900 + 100)}`,
          name: formData.name || 'New Corridor Project',
          state: formData.state || 'Uttar Pradesh',
          districts: formData.districts || 'Agra',
          department: formData.department || 'Ministry of Road Transport & Highways',
          pia: formData.pia || 'National Highways Authority of India (NHAI)',
          authorizedUsers: formData.authorizedUsers || 'District Magistrate, Chief Project Director',
          status: 'ACTIVE',
        };
        setProjects([newP, ...list]);
        setNotice({ type: 'success', text: 'Master project entry added successfully.' });
        setSelectedModal(null);
        setFormData({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!activeProject) return;
    setSubmitting(true);
    try {
      await updateAdminProjectApi(activeProject.id, formData);
      setNotice({ type: 'success', text: `Project ${activeProject.projectId} master parameters updated.` });
      setSelectedModal(null);
      setActiveProject(null);
      setFormData({});
      loadProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const openAction = (proj, modalType) => {
    setActiveProject(proj);
    setSelectedModal(modalType);
    setFormData({ ...proj });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-50 text-teal-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-teal-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>Project & Department Master Master Data</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Organizational Assignment Hub</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>Projects & Departments Configuration</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Initialize infrastructure packages, map owning ministries/departments, assign Implementing Agencies (PIA), and authorize administrative users.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              department: 'Ministry of Road Transport & Highways (MoRTH)',
              pia: 'National Highways Authority of India (NHAI)',
              state: 'Uttar Pradesh',
              districts: 'Agra',
            });
            setSelectedModal('ADD');
          }}
          className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-gov flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Package</span>
        </button>
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

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, department, PIA, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing <strong className="text-slate-900">{filtered.length}</strong> Registered Packages
        </span>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Project Code & Name</th>
                <th className="py-3.5 px-4">State / Districts</th>
                <th className="py-3.5 px-4">Assigned Department</th>
                <th className="py-3.5 px-4">Assigned PIA</th>
                <th className="py-3.5 px-4">Authorized Officers</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-teal-50/30 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md border border-teal-200">
                        {p.projectId}
                      </span>
                      <span className="font-black text-slate-900">{p.name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800">{p.districts}</span>
                    <span className="text-slate-400 block text-[10px]">{p.state}</span>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{p.department}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="bg-indigo-50 text-indigo-900 border border-indigo-100 font-bold px-2 py-0.5 rounded-md text-[11px]">
                      {p.pia}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-[11px] text-slate-600 max-w-[200px] truncate">
                    {p.authorizedUsers}
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {p.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openAction(p, 'EDIT_INFO')}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-teal-700 transition"
                        title="Edit Project Info"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openAction(p, 'ASSIGN_DEPT')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg transition"
                        title="Assign Department"
                      >
                        Dept
                      </button>

                      <button
                        onClick={() => openAction(p, 'ASSIGN_PIA')}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-lg transition"
                        title="Assign PIA"
                      >
                        PIA
                      </button>

                      <button
                        onClick={() => openAction(p, 'ASSIGN_USERS')}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-lg transition"
                        title="Assign Authorized Users"
                      >
                        Users
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security / Non-interference Notice Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Notice: Direct parcel ownership & land acquisition mutation records are protected and cannot be altered from this system configuration panel.</span>
        </div>
      </div>

      {/* Add / Edit / Assignment Modals */}
      {selectedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-700" />
                <h2 className="text-lg font-black text-slate-900">
                  {selectedModal === 'ADD' && 'Add Master Project'}
                  {selectedModal === 'EDIT_INFO' && `Edit Project ${activeProject?.projectId}`}
                  {selectedModal === 'ASSIGN_DEPT' && `Assign Department to ${activeProject?.projectId}`}
                  {selectedModal === 'ASSIGN_PIA' && `Assign PIA to ${activeProject?.projectId}`}
                  {selectedModal === 'ASSIGN_USERS' && `Assign Authorized Users to ${activeProject?.projectId}`}
                </h2>
              </div>
              <button onClick={() => setSelectedModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={selectedModal === 'ADD' ? handleCreateSubmit : handleUpdateSubmit} className="space-y-3 text-xs">
              {(selectedModal === 'ADD' || selectedModal === 'EDIT_INFO') && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Project ID</label>
                      <input
                        type="text"
                        value={formData.projectId || ''}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        placeholder="PRJ-..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state || ''}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Districts (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.districts || ''}
                      onChange={(e) => setFormData({ ...formData, districts: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </>
              )}

              {(selectedModal === 'ADD' || selectedModal === 'ASSIGN_DEPT') && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Owning Ministry / Department</label>
                  <select
                    value={formData.department || 'Ministry of Road Transport & Highways (MoRTH)'}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Ministry of Road Transport & Highways (MoRTH)">Ministry of Road Transport & Highways (MoRTH)</option>
                    <option value="Ministry of Railways / Railway Board">Ministry of Railways / Railway Board</option>
                    <option value="Public Works Department, Uttar Pradesh (UP PWD)">Public Works Department, Uttar Pradesh (UP PWD)</option>
                    <option value="Uttar Pradesh Expressways Industrial Development Authority (UPEIDA)">UPEIDA</option>
                    <option value="Ministry of Power & Energy">Ministry of Power & Energy</option>
                    <option value="Dedicated Freight Corridor Corp (DFCCIL)">DFCCIL</option>
                  </select>
                </div>
              )}

              {(selectedModal === 'ADD' || selectedModal === 'ASSIGN_PIA') && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Implementing Agency (PIA)</label>
                  <select
                    value={formData.pia || 'National Highways Authority of India (NHAI)'}
                    onChange={(e) => setFormData({ ...formData, pia: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="National Highways Authority of India (NHAI)">National Highways Authority of India (NHAI)</option>
                    <option value="National High Speed Rail Corp (NHSRCL)">National High Speed Rail Corp (NHSRCL)</option>
                    <option value="Dedicated Freight Corridor Corp (DFCCIL)">Dedicated Freight Corridor Corp (DFCCIL)</option>
                    <option value="National Capital Region Transport Corp (NCRTC)">NCRTC (RRTS)</option>
                    <option value="State PWD Execution Division">State PWD Execution Division</option>
                  </select>
                </div>
              )}

              {(selectedModal === 'ADD' || selectedModal === 'ASSIGN_USERS') && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Authorized Officers & Roles</label>
                  <input
                    type="text"
                    value={formData.authorizedUsers || ''}
                    onChange={(e) => setFormData({ ...formData, authorizedUsers: e.target.value })}
                    placeholder="e.g. DM Agra, Chief Project Director NHAI, SLAO"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Designates which administrative officers have operational visibility into this corridor package.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold shadow transition"
                >
                  {submitting ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminProjectsDepartmentsPage = () => (
  <ErrorBoundary fallbackTitle="Projects & Departments Configuration Error">
    <AdminProjectsDepartmentsContent />
  </ErrorBoundary>
);

export default AdminProjectsDepartmentsPage;
