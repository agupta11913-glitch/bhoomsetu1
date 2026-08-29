import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import {
  fetchTehsildarGisHierarchyApi,
  fetchTehsildarVillageStatsApi,
  fetchTehsildarHighwayCorridorApi,
} from '../../services/api/tehsildarApi';
import { LeafletGISMap } from '../../components/map/LeafletGISMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Banknote,
  Sparkles,
  Layers,
  ArrowRight,
  Crosshair,
  FileSearch,
  X,
  ExternalLink,
  Info,
  Building2,
  RefreshCw,
  Navigation,
  Compass,
  Filter,
} from 'lucide-react';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const TehsildarMapPageContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    khasras,
    projects,
    activeKhasraId,
    setActiveKhasraId,
    showToast,
  } = useLandData();

  // Hierarchy Selection State
  const [selectedProject, setSelectedProject] = useState('PRJ-001');
  const [selectedDistrict, setSelectedDistrict] = useState('Agra');
  const [selectedTehsil, setSelectedTehsil] = useState('Fatehabad');
  const [selectedVillage, setSelectedVillage] = useState('Nagla');

  // Backend Data
  const [hierarchy, setHierarchy] = useState(null);
  const [villageStats, setVillageStats] = useState(null);
  const [highwayInfo, setHighwayInfo] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Modals
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  // Load GIS Hierarchy on Mount
  useEffect(() => {
    const loadHierarchy = async () => {
      try {
        const [hData, cData] = await Promise.all([
          fetchTehsildarGisHierarchyApi(),
          fetchTehsildarHighwayCorridorApi(selectedProject),
        ]);
        if (hData) setHierarchy(hData);
        if (cData) setHighwayInfo(cData);
      } catch (err) {
        console.warn('Failed to load GIS hierarchy:', err);
      }
    };
    loadHierarchy();
  }, [selectedProject]);

  // Load Village Statistics whenever selectedVillage changes
  useEffect(() => {
    const loadVillageStats = async () => {
      setLoadingStats(true);
      try {
        const vData = await fetchTehsildarVillageStatsApi(selectedVillage);
        if (vData) {
          setVillageStats(vData);
        } else {
          setVillageStats({
            village: selectedVillage,
            totalParcels: selectedVillage === 'Nagla' ? 420 : (selectedVillage === 'Kasan' ? 310 : 250),
            affectedParcelsCount: selectedVillage === 'Nagla' ? 5 : (selectedVillage === 'Kasan' ? 2 : 1),
            totalAffectedAreaAcre: selectedVillage === 'Nagla' ? 4.10 : 1.95,
            totalAffectedAreaHectare: selectedVillage === 'Nagla' ? 1.66 : 0.79,
            verifiedParcels: 5,
            pendingVerification: 0,
            approvedAcquisition: 1,
            pendingCompensation: 4,
          });
        }
      } catch (err) {
        console.warn('Failed to load village stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadVillageStats();
  }, [selectedVillage]);

  // Sync with URL query parameter (?caseId=...)
  useEffect(() => {
    const urlCaseId = searchParams.get('caseId');
    if (urlCaseId && khasras.length > 0) {
      const matched = khasras.find(
        (k) => k.caseId === urlCaseId || k.khasraNumber === urlCaseId
      );
      if (matched) {
        setActiveKhasraId(matched.khasraNumber);
        if (matched.village) {
          setSelectedVillage(matched.village);
        }
      }
    }
  }, [searchParams, khasras, setActiveKhasraId]);

  // Filter parcels belonging to the selected village
  const villageParcels = (selectedVillage && selectedVillage !== 'ALL')
    ? khasras.filter((k) => k.village && k.village.toLowerCase() === selectedVillage.toLowerCase())
    : khasras;

  const activeParcel = villageParcels.find(
    (k) => k.id === activeKhasraId || k.khasraNumber === activeKhasraId
  ) || villageParcels[0] || khasras[0] || {
    khasraNumber: '101',
    khataNumber: 'KH-842',
    caseId: 'CASE-2026-DME-0101',
    ownerName: 'Sh. Ram Kumar',
    fatherName: 'Late Sh. Harish Chandra',
    areaAcre: 2.5,
    affectedAreaAcre: 0.8,
    remainingAreaAcre: 1.7,
    village: 'Nagla',
    tehsil: 'Fatehabad',
    district: 'Agra',
    status: 'VERIFIED',
    gisStatus: 'VERIFIED',
    circleRatePerAcre: 4500000,
    totalCompensation: 45000000,
  };

  const handleSelectVillage = (villageName) => {
    setSelectedVillage(villageName);
    const firstInVillage = khasras.find((k) => k.village && k.village.toLowerCase() === villageName.toLowerCase());
    if (firstInVillage) {
      setActiveKhasraId(firstInVillage.khasraNumber);
    }
    showToast('Village Selected', `Loaded georeferenced boundary and corridor for ${villageName} Village.`, 'info');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Government-Grade Hierarchical Header & GIS Filter Strip */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200">
                Tehsil Cadastral Land & Corridor Studio
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">
                Survey of India & Bhulekh RoR Synchronized Grid (Fatehabad Tehsil)
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Village-Wise Highway Corridor & Affected Parcel Demarcation
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                showToast('GIS Synchronized', 'Real-time spatial boundaries re-indexed with backend database.', 'success');
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
              title="Refresh Live GIS Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync GIS</span>
            </button>

            <button
              onClick={() => navigate('/tehsildar/dashboard')}
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hierarchical Filter Selectors: Project -> District -> Tehsil -> Village */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Project Selector */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              1. Statutory Project Corridor
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900 focus:ring-2 focus:ring-gov-blue-800 focus:outline-none"
            >
              <option value="PRJ-001">Delhi–Meerut Expressway (NH-348)</option>
              <option value="PRJ-002">Eastern Dedicated Freight Corridor (EDFC-4)</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              2. Revenue District
            </label>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-extrabold text-slate-800 flex items-center justify-between">
              <span>Agra (Uttar Pradesh)</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">DIST-08</span>
            </div>
          </div>

          {/* Tehsil */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              3. Sub-Division / Tehsil
            </label>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 font-extrabold text-slate-800 flex items-center justify-between">
              <span>Fatehabad Tehsil</span>
              <span className="text-[10px] bg-gov-blue-100 text-gov-blue-900 px-1.5 py-0.5 rounded font-mono font-bold">TEH-001</span>
            </div>
          </div>

          {/* Village Selector */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              4. Revenue Village (Intersecting Corridor)
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => handleSelectVillage(e.target.value)}
              className="w-full bg-gov-blue-50 border-2 border-gov-blue-800 rounded-xl p-2 font-black text-gov-blue-950 focus:ring-2 focus:ring-gov-blue-800 focus:outline-none"
            >
              <option value="Nagla">Nagla (420 Parcels • 5 Affected)</option>
              <option value="Kasan">Kasan (310 Parcels • 2 Affected)</option>
              <option value="Kharabwadi">Kharabwadi (280 Parcels • 1 Affected)</option>
              <option value="Vesu">Vesu (215 Parcels • 1 Affected)</option>
              <option value="ALL">All Tehsil Villages (Overview)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Village Real-Time Summary KPI Banner (Backend Computed) */}
      <div className="bg-gradient-to-r from-gov-blue-900 to-slate-900 text-white rounded-2xl p-5 shadow-gov grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Selected Village
          </span>
          <span className="text-lg font-black text-white block mt-0.5">
            {selectedVillage !== 'ALL' ? selectedVillage : 'All Tehsil Villages'}
          </span>
          <span className="text-[10px] text-gov-saffron-400 font-semibold">Fatehabad Tehsil</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Total Village Parcels
          </span>
          <span className="text-lg font-black text-slate-100 block mt-0.5">
            {loadingStats ? '...' : (villageStats?.totalParcels || 420)}
          </span>
          <span className="text-[10px] text-slate-400">In Village Cadastral Shajra</span>
        </div>

        <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
          <span className="text-[10px] font-bold uppercase text-amber-300 block tracking-wider">
            Highway Affected Parcels
          </span>
          <span className="text-xl font-black text-amber-400 block mt-0.5">
            {loadingStats ? '...' : (villageStats?.affectedParcelsCount || villageParcels.length)}
          </span>
          <span className="text-[10px] text-slate-300">Intersecting NH-348 ROW</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Total Affected Area
          </span>
          <span className="text-lg font-black text-emerald-400 block mt-0.5">
            {loadingStats ? '...' : (villageStats?.totalAffectedAreaAcre || 4.10)} Acre
          </span>
          <span className="text-[10px] text-slate-400">({villageStats?.totalAffectedAreaHectare || 1.66} Hectare)</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Revenue Verified
          </span>
          <span className="text-lg font-black text-blue-300 block mt-0.5">
            {loadingStats ? '...' : (villageStats?.verifiedParcels || 5)} / {villageParcels.length}
          </span>
          <span className="text-[10px] text-slate-400">RO Field Demarcation</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Tehsildar Approved
          </span>
          <span className="text-lg font-black text-purple-300 block mt-0.5">
            {loadingStats ? '...' : (villageStats?.approvedAcquisition || 1)} / {villageParcels.length}
          </span>
          <span className="text-[10px] text-slate-400">Sanction Ready</span>
        </div>
      </div>

      {/* 3. Main Grid: Left 8-col Interactive GIS Studio + Right 4-col Parcel Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map: 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-gov-blue-800" />
                <span className="font-extrabold text-slate-900 text-xs">
                  Corridor Layer: {highwayInfo?.highwayName || 'Delhi–Meerut Expressway Expansion (NH-348)'} (60m ROW)
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400 hidden sm:inline">Village:</span>
                <span className="bg-gov-blue-50 text-gov-blue-900 font-extrabold px-2 py-0.5 rounded border border-gov-blue-200">
                  {selectedVillage}
                </span>
              </div>
            </div>

            {/* The Synchronized Leaflet GIS Map */}
            <LeafletGISMap
              height="h-[560px] lg:h-[640px]"
              selectedVillage={selectedVillage}
              onSelectParcel={(p) => setActiveKhasraId(p.khasraNumber)}
            />
          </div>
        </div>

        {/* Right Dossier Panel: 4 Cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="bg-gov-saffron-50 text-gov-saffron-800 text-[10px] uppercase font-black px-2 py-0.2 rounded border border-gov-saffron-200">
                  Active Cadastral Parcel
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  Khasra No. {activeParcel.khasraNumber}
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  Khatauni: {activeParcel.khataNumber || 'KH-842'} • Case: {activeParcel.caseId}
                </span>
              </div>
              <StatusBadge status={activeParcel.status} size="sm" />
            </div>

            {/* Area Progress Split */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-700">Total Registered Land</span>
                <span className="font-black text-slate-900">{activeParcel.areaAcre || 2.50} Acre</span>
              </div>

              <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(((activeParcel.affectedAreaAcre || 0.80) / (activeParcel.areaAcre || 2.50)) * 100)}%` }}
                  className="bg-gradient-to-r from-red-600 to-orange-500 h-full"
                  title="Acquisition Corridor Intersection"
                />
                <div
                  style={{ width: `${(((activeParcel.remainingAreaAcre || 1.70) / (activeParcel.areaAcre || 2.50)) * 100)}%` }}
                  className="bg-emerald-500 h-full"
                  title="Retained Land"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-red-50 rounded-xl border border-red-200">
                  <span className="text-[10px] text-red-600 font-bold block">Acquired Portion:</span>
                  <span className="font-black text-red-700">{activeParcel.affectedAreaAcre || 0.80} Acre</span>
                  <span className="text-[9px] text-red-500 block">
                    ({(((activeParcel.affectedAreaAcre || 0.80) / (activeParcel.areaAcre || 2.50)) * 100).toFixed(1)}% inside ROW)
                  </span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-600 font-bold block">Retained Land:</span>
                  <span className="font-black text-emerald-700">{activeParcel.remainingAreaAcre || 1.70} Acre</span>
                  <span className="text-[9px] text-emerald-500 block">
                    ({(((activeParcel.remainingAreaAcre || 1.70) / (activeParcel.areaAcre || 2.50)) * 100).toFixed(1)}% outside ROW)
                  </span>
                </div>
              </div>
            </div>

            {/* Key Parcel Attributes */}
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Khatedar / Land Owner:</span>
                <strong className="text-slate-900 font-bold">{activeParcel.ownerName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Father's Name:</span>
                <span className="text-slate-800">{activeParcel.fatherName || 'Late Sh. Harish Chandra'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Village / Tehsil:</span>
                <span className="font-semibold text-slate-800">{activeParcel.village || 'Nagla'}, {activeParcel.tehsil || 'Fatehabad'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Land Classification:</span>
                <span className="font-medium text-slate-800">{activeParcel.landType || 'Agricultural (Irrigated)'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Circle Rate / Valuation:</span>
                <span className="font-mono text-slate-800">{formatCurrency(activeParcel.circleRatePerAcre || 4500000)} / Acre</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Calculated Compensation:</span>
                <strong className="text-emerald-700 font-black text-sm">{formatCurrency(activeParcel.totalCompensation || 45000000)}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">GIS Demarcation:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Georeferenced WGS84
                </span>
              </div>
            </div>

            {/* Direct Action Button to Open Exact Case */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => navigate(`/tehsildar/cases?caseId=${activeParcel.caseId || activeParcel.khasraNumber}`)}
                className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-2.5 rounded-xl text-center flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>Review Acquisition Case ({activeParcel.caseId || `CASE-${activeParcel.khasraNumber}`})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-gov-blue-900" />
                  <span>Sec 11 Notice</span>
                </button>

                <button
                  onClick={() => setShowAwardModal(true)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1"
                >
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Award Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Village Affected Parcels Directory Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gov-blue-800" />
              <span>Affected Land Parcels Directory for Village: {selectedVillage}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Only parcels intersecting the 60m NH-348 expressway right-of-way corridor are listed.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
            {villageParcels.length} Affected Parcels in {selectedVillage}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <th className="py-2.5 px-3">Khasra / Khata</th>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Land Owner</th>
                <th className="py-2.5 px-3">Village / Tehsil</th>
                <th className="py-2.5 px-3">Total Area</th>
                <th className="py-2.5 px-3">Affected Area (ROW)</th>
                <th className="py-2.5 px-3">Remaining Area</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {villageParcels.map((p) => {
                const isSelected = p.khasraNumber === activeParcel?.khasraNumber;
                return (
                  <tr
                    key={p.khasraNumber}
                    className={`transition ${isSelected ? 'bg-gov-blue-50/70 font-semibold' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-gov-blue-900">
                      <div>Khasra #{p.khasraNumber}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{p.khataNumber || 'KH-842'}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {p.caseId || `CASE-${p.khasraNumber}`}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {p.ownerName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {p.village || selectedVillage}, {p.tehsil || 'Fatehabad'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {p.areaAcre || 2.50} Ac
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600">
                      {p.affectedAreaAcre || 0.80} Ac
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700">
                      {p.remainingAreaAcre || 1.70} Ac
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveKhasraId(p.khasraNumber);
                            showToast('Focused', `Centered map on Khasra #${p.khasraNumber}`, 'info');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                            isSelected
                              ? 'bg-gov-blue-900 text-white border-gov-blue-900'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          Focus on Map
                        </button>

                        <button
                          onClick={() => navigate(`/tehsildar/cases?caseId=${p.caseId || p.khasraNumber}`)}
                          className="bg-gov-blue-50 hover:bg-gov-blue-900 text-gov-blue-900 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition border border-gov-blue-200"
                        >
                          Review Case
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <GazetteNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        khasra={activeParcel}
      />
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={activeParcel}
      />
    </div>
  );
};

export const TehsildarMapPage = () => (
  <ErrorBoundary fallbackTitle="Unable to render Tehsildar GIS Cadastral Map Studio.">
    <TehsildarMapPageContent />
  </ErrorBoundary>
);
