import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  Layers,
  PlusCircle,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Calendar,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';

export const ProjectsListPage = () => {
  const navigate = useNavigate();
  const { projects, createNewProject } = useLandData();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New Project Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'National Highway Expansion (NHAI)',
    state: 'Uttar Pradesh',
    district: 'Agra',
    tehsil: 'Fatehabad',
    village: '',
    requiredLand: 120,
    description: '',
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createNewProject({
      name: formData.name,
      shortName: formData.name.split(' ')[0],
      type: formData.type,
      state: formData.state,
      district: formData.district,
      tehsil: formData.tehsil,
      village: formData.village || 'Corridor Alignment Hub',
      requiredLand: Number(formData.requiredLand),
      description: formData.description || 'National infrastructure corridor corridor acquisition project.',
    });

    setShowCreateModal(false);
    setFormData({
      name: '',
      type: 'National Highway Expansion (NHAI)',
      state: 'Uttar Pradesh',
      district: 'Agra',
      tehsil: 'Fatehabad',
      village: '',
      requiredLand: 120,
      description: '',
    });
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              National Infrastructure Registry
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">PM Gati Shakti Integration</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Infrastructure Corridor Projects
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor corridor acreage requirements, acquisition progression, and statutory clearances.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Project</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter projects by name, Project ID (e.g. PRJ-001), or district..."
          className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const progressPercent = Math.min(
            100,
            Math.round((project.acquiredLand / project.requiredLand) * 100)
          );

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-gov hover:shadow-gov-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold font-mono bg-gov-blue-50 text-gov-blue-800 px-2 py-0.5 rounded border border-gov-blue-200">
                      {project.id}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
                      {project.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    project.aiRiskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800' : project.aiRiskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {project.aiRiskLevel} Risk
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-gov-saffron-600 shrink-0" />
                  <span className="truncate">{project.village}, {project.tehsil}, {project.district} ({project.state})</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Acquisition Progress</span>
                    <span className="text-gov-green-700 font-extrabold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gov-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Acreage Metric Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Required</span>
                    <span className="font-bold text-slate-800">{project.requiredLand} Ac</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Acquired</span>
                    <span className="font-bold text-gov-green-700">{project.acquiredLand} Ac</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Pending</span>
                    <span className="font-bold text-amber-600">{project.pendingLand} Ac</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Target: {formatDate(project.targetDate)}
                </span>
                <button
                  onClick={() => navigate('/gis-map')}
                  className="text-xs font-bold text-gov-blue-900 hover:text-gov-blue-700 flex items-center gap-1 transition"
                >
                  <span>Open GIS Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Initialize New Infrastructure Project Corridor"
        subtitle="Registers project in National Land Acquisition Corridor Master"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Gorakhpur-Siliguri Expressway Package-1"
              className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gov-blue-800 font-semibold"
              >
                <option>National Highway Expansion (NHAI)</option>
                <option>High Speed Railway (NHSRCL)</option>
                <option>Dedicated Freight Corridor (DFCCIL)</option>
                <option>Renewable Energy Solar Park</option>
                <option>Industrial Corridor (NICDC)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Required Land Target (Acre) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.1"
                value={formData.requiredLand}
                onChange={(e) => setFormData({ ...formData, requiredLand: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gov-blue-800 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tehsil</label>
              <input
                type="text"
                value={formData.tehsil}
                onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Village / Sector</label>
              <input
                type="text"
                placeholder="Nagla Hub"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Corridor Scope & Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide strategic alignment details, connecting nodes, and statutory deadlines..."
              className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow transition"
            >
              Initialize Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
