import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../common/ErrorBoundary';
import {
  MapPin,
  Layers,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  FileCheck,
  Search,
  X,
  Building2,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

// Center & Bounds Controller for Leaflet Map
const MapController = ({ center, zoom, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      try {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, duration: 1.2 });
        return;
      } catch (e) {
        console.warn('Map fitBounds error:', e);
      }
    }

    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 12, { duration: 1.2 });
    }
  }, [center, zoom, bounds, map]);

  return null;
};

export const UniversalGISMap = ({
  scope = 'district',
  userState = 'Uttar Pradesh',
  userDistrict = 'Agra',
  mapData = null,
  onProjectSelect = null,
  onParcelSelect = null,
}) => {
  const { currentUser, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProjectId = searchParams.get('projectId');
  const urlParcelId = searchParams.get('parcelId');

  const [loading, setLoading] = useState(false);
  const [authorizedProjects, setAuthorizedProjects] = useState([]);
  const [allParcels, setAllParcels] = useState([]);
  const [surroundingParcels, setSurroundingParcels] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState(urlProjectId || 'ALL');
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'ACQUIRED' | 'DISPUTED'
  const [searchTerm, setSearchTerm] = useState('');
  const [mapBounds, setMapBounds] = useState(null);

  // Fetch Authorized GIS Data from Backend
  const loadAuthorizedGISData = async (projId) => {
    setLoading(true);
    try {
      const activeProjParam = (projId && projId !== 'ALL') ? `?projectId=${projId}` : '';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`/api/gis/authorized-map-data${activeProjParam}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.projects) {
          setAuthorizedProjects(data.projects);
          setAllParcels(data.affectedParcels || []);
          setSurroundingParcels(data.surroundingParcels || []);

          if (projId && projId !== 'ALL') {
            const found = data.projects.find((p) => p.projectId === projId);
            setSelectedProjectDetails(found || null);
          }
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend GIS fetch failed, falling back to local props:', e);
    }

    // Fallback if prop mapData passed
    if (mapData && mapData.projects) {
      setAuthorizedProjects(mapData.projects);
      setAllParcels(mapData.parcels || mapData.affectedParcels || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAuthorizedGISData(selectedProjectId);
  }, [token, currentUser]);

  // Handle URL Param changes
  useEffect(() => {
    if (urlProjectId && urlProjectId !== selectedProjectId) {
      setSelectedProjectId(urlProjectId);
      loadAuthorizedGISData(urlProjectId);
    }
  }, [urlProjectId]);

  // Handle Project Selection & Synchronization
  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedParcel(null);

    if (projectId === 'ALL') {
      setSelectedProjectDetails(null);
      loadAuthorizedGISData('ALL');
      if (onProjectSelect) onProjectSelect(null);
    } else {
      const project = authorizedProjects.find((p) => p.projectId === projectId);
      setSelectedProjectDetails(project || null);
      loadAuthorizedGISData(projectId);
      if (onProjectSelect) onProjectSelect(project);
    }
  };

  // Handle Parcel Selection
  const handleParcelClick = (parcel) => {
    setSelectedParcel(parcel);
    if (onParcelSelect) onParcelSelect(parcel);
  };

  // Compute Map Center & Zoom
  const currentProject = authorizedProjects.find((p) => p.projectId === selectedProjectId);
  const mapCenter = selectedParcel
    ? selectedParcel.coords[0]
    : currentProject?.center
    ? currentProject.center
    : authorizedProjects.length > 0 && authorizedProjects[0].center
    ? authorizedProjects[0].center
    : [27.1650, 78.0650];

  const mapZoom = selectedParcel
    ? 16
    : currentProject?.zoom
    ? currentProject.zoom
    : selectedProjectId === 'ALL' && authorizedProjects.length > 1
    ? 6
    : 13;

  // Filter Projects by Search
  const filteredProjects = authorizedProjects.filter((p) => {
    if (statusFilter === 'ACTIVE' && p.status && !p.status.toLowerCase().includes('active')) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name?.toLowerCase().includes(q) ||
        p.projectId?.toLowerCase().includes(q) ||
        p.districts?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filter Parcels by Project Selection, Status Layer & Search
  const combinedParcels = [...allParcels, ...surroundingParcels];
  const filteredParcels = combinedParcels.filter((p) => {
    if (selectedProjectId !== 'ALL' && p.projectId && p.projectId !== selectedProjectId && !p.isContextual) {
      return false;
    }
    if (statusFilter === 'ACQUIRED' && p.status !== 'ACQUIRED') return false;
    if (statusFilter === 'DISPUTED' && p.status !== 'DISPUTED') return false;
    if (statusFilter === 'AFFECTED' && p.status !== 'PROPOSED' && p.status !== 'IN_PROGRESS') return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        p.khasraNumber?.toLowerCase().includes(q) ||
        p.ownerName?.toLowerCase().includes(q) ||
        p.caseId?.toLowerCase().includes(q) ||
        p.village?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getParcelStyle = (parcel) => {
    const isSelected = selectedParcel?.id === parcel.id || (selectedParcel?.khasraNumber === parcel.khasraNumber);
    if (parcel.isContextual) {
      return {
        color: '#64748b',
        fillColor: '#94a3b8',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4',
      };
    }
    if (parcel.status === 'ACQUIRED') {
      return {
        color: isSelected ? '#eab308' : '#15803d',
        fillColor: '#16a34a',
        fillOpacity: isSelected ? 0.75 : 0.5,
        weight: isSelected ? 3.5 : 2,
      };
    }
    if (parcel.status === 'DISPUTED') {
      return {
        color: isSelected ? '#eab308' : '#b91c1c',
        fillColor: '#dc2626',
        fillOpacity: isSelected ? 0.75 : 0.5,
        weight: isSelected ? 3.5 : 2,
      };
    }
    return {
      color: isSelected ? '#eab308' : '#1d4ed8',
      fillColor: '#2563eb',
      fillOpacity: isSelected ? 0.75 : 0.45,
      weight: isSelected ? 3.5 : 2,
    };
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* 1. Top Filter, Project Selection & Authorization Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Scope / Authorization Badge */}
          <span className="bg-purple-50 text-purple-900 text-xs font-black px-3 py-1.5 rounded-xl border border-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Authorized GIS ({authorizedProjects.length} Corridors)</span>
          </span>

          {/* Project Corridor Selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => handleSelectProject(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 max-w-[280px] sm:max-w-[340px] truncate"
          >
            <option value="ALL">🌐 All Authorized Projects ({authorizedProjects.length})</option>
            {authorizedProjects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.projectId} — {p.name}
              </option>
            ))}
          </select>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Project / Khasra / Owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500 w-44 sm:w-64"
            />
          </div>
        </div>

        {/* Status / Layer Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition ${
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('ACQUIRED')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
              statusFilter === 'ACQUIRED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
            <span>Acquired</span>
          </button>
          <button
            onClick={() => setStatusFilter('AFFECTED')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
              statusFilter === 'AFFECTED' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            <span>Affected</span>
          </button>
          <button
            onClick={() => setStatusFilter('DISPUTED')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
              statusFilter === 'DISPUTED' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-300"></span>
            <span>Disputed</span>
          </button>
        </div>
      </div>

      {/* 2. Empty State Notice if No Authorized Projects */}
      {authorizedProjects.length === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-6 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="text-base font-black">No Authorized Projects Found</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            Your current login role and jurisdiction do not have active infrastructure project corridors assigned.
          </p>
        </div>
      )}

      {/* 3. Main Leaflet Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-gov bg-slate-100 h-[420px] sm:h-[540px] lg:h-[650px]">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={mapCenter} zoom={mapZoom} bounds={mapBounds} />

          {/* Render ALL Authorized Project Boundaries & Centerline Alignments */}
          {filteredProjects.map((p) => {
            const isProjectSelected = selectedProjectId === p.projectId;
            return (
              <React.Fragment key={p.projectId}>
                {/* Centerline Alignment */}
                {p.coords && p.coords.length > 0 && (
                  <Polyline
                    positions={p.coords}
                    pathOptions={{
                      color: p.color || '#8b5cf6',
                      weight: isProjectSelected ? 7 : 4,
                      opacity: isProjectSelected ? 1.0 : 0.75,
                    }}
                    eventHandlers={{
                      click: () => handleSelectProject(p.projectId),
                    }}
                  >
                    <Tooltip sticky direction="center" className="bg-purple-950 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-lg">
                      <strong>{p.projectId}</strong> — {p.name}<br />
                      Districts: {p.districts} • Status: {p.status}
                    </Tooltip>
                  </Polyline>
                )}

                {/* Bounding Area Polygon */}
                {p.boundary && p.boundary.length > 0 && (
                  <Polygon
                    positions={p.boundary}
                    pathOptions={{
                      color: p.color || '#8b5cf6',
                      fillColor: p.color || '#8b5cf6',
                      fillOpacity: isProjectSelected ? 0.16 : 0.06,
                      weight: isProjectSelected ? 2.5 : 1.5,
                      dashArray: isProjectSelected ? undefined : '6, 6',
                    }}
                    eventHandlers={{
                      click: () => handleSelectProject(p.projectId),
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Render Associated Project Cadastral Parcels */}
          {filteredParcels.map((parcel) => (
            <Polygon
              key={parcel.id || parcel.khasraNumber}
              positions={parcel.coords}
              pathOptions={getParcelStyle(parcel)}
              eventHandlers={{
                click: () => handleParcelClick(parcel),
              }}
            >
              <Tooltip sticky direction="top" className="bg-slate-900 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg">
                <strong>Khasra #{parcel.khasraNumber}</strong> {parcel.isContextual ? '(Buffer Context)' : `(${parcel.ownerName})`}<br />
                Area: {parcel.areaAcre} Acre • Status: {parcel.status}
              </Tooltip>
            </Polygon>
          ))}
        </MapContainer>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-slate-200 shadow-xl space-y-1.5 text-xs hidden sm:block">
          <strong className="block text-[10px] uppercase tracking-wider text-slate-500 font-black">
            Cadastral GIS Legend
          </strong>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-bold text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-700"></span>
              <span className="text-slate-700">Acquired</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-600 border border-blue-700"></span>
              <span className="text-slate-700">Affected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-600 border border-rose-700"></span>
              <span className="text-slate-700">Disputed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-300 border border-slate-400 border-dashed"></span>
              <span className="text-slate-500">Buffer</span>
            </div>
          </div>
        </div>

        {/* Selected Project Details Drawer (When Project is Clicked) */}
        {selectedProjectDetails && !selectedParcel && (
          <div className="absolute inset-x-2 bottom-2 sm:bottom-auto sm:inset-x-auto sm:top-4 sm:right-4 z-[400] w-auto sm:w-96 max-h-[75%] sm:max-h-[610px] overflow-y-auto bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-5 space-y-3 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                  {selectedProjectDetails.projectId}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 leading-tight">
                  {selectedProjectDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProjectDetails(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Jurisdiction</span>
                  <span className="font-semibold text-slate-800">{selectedProjectDetails.districts}, {selectedProjectDetails.state}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Requiring Agency</span>
                  <span className="font-semibold text-slate-800">{selectedProjectDetails.requiringAgency || 'NHAI'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Current Stage</span>
                  <span className="font-bold text-purple-700">{selectedProjectDetails.currentStage || 'Section 19 Award'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Acquired Land</span>
                  <strong className="text-xs sm:text-sm font-black text-emerald-700">
                    {formatAcre(selectedProjectDetails.landAcquired || 945.5)}
                  </strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Total Required</span>
                  <strong className="text-xs sm:text-sm font-black text-slate-800">
                    {formatAcre(selectedProjectDetails.totalLandRequired || 1450.0)}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-purple-700 block">Possession Progress</span>
                  <strong className="text-xs sm:text-sm font-black text-purple-900">
                    {selectedProjectDetails.possessionPercentage || 65.2}%
                  </strong>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                  {selectedProjectDetails.status || 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Parcel Details Drawer (When Parcel is Clicked) */}
        {selectedParcel && (
          <div className="absolute inset-x-2 bottom-2 sm:bottom-auto sm:inset-x-auto sm:top-4 sm:right-4 z-[400] w-auto sm:w-96 max-h-[75%] sm:max-h-[610px] overflow-y-auto bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-5 space-y-3 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                  {selectedParcel.projectId || selectedProjectId}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                  Khasra #{selectedParcel.khasraNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Case ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedParcel.caseId || 'CASE-2026-DME-0101'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Khata No</span>
                  <span className="font-mono font-bold text-slate-800">{selectedParcel.khataNumber || 'KH-842'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Recorded Owner</span>
                  <span className="font-bold text-slate-900">{selectedParcel.ownerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-700">
                    {selectedParcel.village}, {selectedParcel.tehsil}, {selectedParcel.district}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Total Area</span>
                  <strong className="text-xs sm:text-sm font-black text-slate-800">
                    {formatAcre(selectedParcel.areaAcre)}
                  </strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Affected Area</span>
                  <strong className="text-xs sm:text-sm font-black text-purple-700">
                    {formatAcre(selectedParcel.affectedAreaAcre)}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                    Assessed Compensation
                  </span>
                  <strong className="text-xs sm:text-sm font-black text-emerald-900">
                    {formatCurrency(selectedParcel.totalCompensation || 45000000.0)}
                  </strong>
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    selectedParcel.status === 'ACQUIRED'
                      ? 'bg-emerald-200 text-emerald-900'
                      : selectedParcel.status === 'DISPUTED'
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-blue-200 text-blue-900'
                  }`}
                >
                  {selectedParcel.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalGISMap;
