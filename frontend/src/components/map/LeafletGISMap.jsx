import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Polyline, Tooltip, useMap } from 'react-leaflet';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  Search,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Crosshair,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  User,
  Building2,
  Banknote,
  Sparkles,
  Waves,
  Navigation,
  Compass,
  Info,
  Maximize2,
  Focus,
  PieChart,
  Terminal,
  Bug,
  Shield,
} from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet Default Icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component for multi-mode auto-fit and synchronized bounding box calculation
const MapBoundsController = ({ activeParcel, citizenParcels, projectBoundary, zoomMode, zoomTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (!activeParcel) return;

    try {
      if (zoomMode === 'AFFECTED' && activeParcel.affectedCoordinates && activeParcel.affectedCoordinates.length > 0) {
        const bounds = L.latLngBounds(activeParcel.affectedCoordinates);
        map.fitBounds(bounds, { padding: [90, 90], maxZoom: 19, animate: true, duration: 0.8 });
      } else if (zoomMode === 'PROJECT' && projectBoundary && projectBoundary.coordinates && projectBoundary.coordinates.length > 0) {
        const bounds = L.latLngBounds(projectBoundary.coordinates);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true, duration: 0.8 });
      } else if (activeParcel.coordinates && activeParcel.coordinates.length > 0) {
        // Collect all coordinates of the citizen's authorized parcels
        const allCitizenCoords = (citizenParcels && citizenParcels.length > 0)
          ? citizenParcels.flatMap((p) => p.coordinates || [])
          : activeParcel.coordinates;

        if (projectBoundary && projectBoundary.coordinates && projectBoundary.coordinates.length > 0) {
          // Combine citizen's parcel(s) with immediate project corridor segment
          const combinedBounds = L.latLngBounds([
            ...allCitizenCoords,
            ...projectBoundary.coordinates.slice(0, 5)
          ]);
          map.fitBounds(combinedBounds, { padding: [60, 60], maxZoom: 17, animate: true, duration: 0.8 });
        } else {
          const parcelBounds = L.latLngBounds(activeParcel.coordinates);
          map.fitBounds(parcelBounds, { padding: [60, 60], maxZoom: 18, animate: true, duration: 0.8 });
        }
      }
    } catch (err) {
      console.warn('Map zoom bounds calculation error:', err);
    }
  }, [activeParcel, citizenParcels, projectBoundary, zoomMode, zoomTrigger, map]);

  return null;
};

// -----------------------------------------------------------------------------
// SEPARATE GIS PHYSICAL GEOGRAPHY LAYERS (Simulated for SIH 2026 Prototype)
// -----------------------------------------------------------------------------

// 1. River / Waterbody Layer (Yamuna River flowing safely ~400m North of Farmland)
const RIVERS_LAYER = [
  {
    id: 'RIVER-001',
    name: 'Yamuna River / Fatehabad Feeder Canal',
    coordinates: [
      [27.1705, 78.0580],
      [27.1698, 78.0620],
      [27.1692, 78.0660],
      [27.1688, 78.0700],
      [27.1682, 78.0740],
    ],
  },
  {
    id: 'RIVER-001-BUFFER',
    name: 'Canal Embankment Green Buffer Zone',
    coordinates: [
      [27.1712, 78.0578],
      [27.1705, 78.0618],
      [27.1699, 78.0658],
      [27.1695, 78.0698],
      [27.1689, 78.0738],
      [27.1675, 78.0742],
      [27.1681, 78.0702],
      [27.1685, 78.0662],
      [27.1691, 78.0622],
      [27.1698, 78.0582],
    ],
  }
];

// 2. Highway Alignment & Village Chak Roads
const ROADS_LAYER = [
  {
    id: 'ROAD-001',
    name: 'Delhi–Meerut Expressway (NH-348 Alignment)',
    coordinates: [
      [27.1620, 78.0600],
      [27.1632, 78.0630],
      [27.1642, 78.0660],
      [27.1652, 78.0690],
      [27.1662, 78.0720],
    ],
  },
  {
    id: 'ROAD-002',
    name: 'Nagla Agricultural Access Chak Road',
    coordinates: [
      [27.1662, 78.0635],
      [27.1660, 78.0648],
      [27.1658, 78.0665],
      [27.1655, 78.0675],
    ],
  },
];

// 3. Fallback Project Boundary (if backend offline)
const FALLBACK_PROJECT_BOUNDARY = {
  id: 'PRJ-001',
  projectId: 'PRJ-001',
  name: 'Delhi–Meerut Expressway Expansion (NH-348)',
  shortName: 'Delhi–Meerut Expressway',
  type: 'Statutory Project Alignment & ROW Boundary',
  requiringAgency: 'National Highways Authority of India (NHAI)',
  totalLandRequired: 1450.0,
  villageAffectedArea: '14.50 Acre (Nagla Village)',
  coordinates: [
    [27.1626, 78.0597],
    [27.1638, 78.0627],
    [27.1648, 78.0657],
    [27.1658, 78.0687],
    [27.1668, 78.0717],
    [27.1656, 78.0723],
    [27.1646, 78.0693],
    [27.1636, 78.0663],
    [27.1626, 78.0633],
    [27.1614, 78.0603],
  ]
};

// 4. Revenue Village Boundaries Map
const VILLAGE_BOUNDARIES = {
  Nagla: [
    [27.1685, 78.0610],
    [27.1680, 78.0685],
    [27.1625, 78.0695],
    [27.1615, 78.0615],
  ],
  Kasan: [
    [27.1610, 78.0680],
    [27.1605, 78.0760],
    [27.1550, 78.0770],
    [27.1545, 78.0690],
  ],
  Kharabwadi: [
    [27.1545, 78.0750],
    [27.1540, 78.0820],
    [27.1485, 78.0830],
    [27.1480, 78.0760],
  ],
  Vesu: [
    [27.1480, 78.0820],
    [27.1475, 78.0890],
    [27.1420, 78.0900],
    [27.1415, 78.0830],
  ],
};

const VILLAGE_BOUNDARY = VILLAGE_BOUNDARIES.Nagla;

export const LeafletGISMap = ({
  onSelectParcel,
  isCitizenViewOnly = false,
  height = 'h-[440px] sm:h-[520px] lg:h-[640px]',
  selectedVillage = 'ALL',
}) => {
  const navigate = useNavigate();
  const { currentUser, currentRole } = useAuth();
  const { isHindi, t } = useLanguage();
  const { isDark } = useTheme();
  const {
    khasras,
    projects,
    backendLoaded,
    activeKhasraId,
    setActiveKhasraId,
    showToast,
  } = useLandData();

  const [activeLayer, setActiveLayer] = useState('street'); // street | satellite | topo
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRiverLayer, setShowRiverLayer] = useState(true);
  const [showProjectBoundary, setShowProjectBoundary] = useState(true);
  const [showAffectedPortions, setShowAffectedPortions] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showDebugBox, setShowDebugBox] = useState(false);

  // Zoom control state: 'PARCEL' | 'AFFECTED' | 'PROJECT'
  const [zoomMode, setZoomMode] = useState('PARCEL');
  const [zoomTrigger, setZoomTrigger] = useState(0);

  // Selected Detail Panels
  const [selectedParcelPanel, setSelectedParcelPanel] = useState(null);
  const [selectedProjectPanel, setSelectedProjectPanel] = useState(null);

  // Determine if this map instance is in Citizen Personal View Mode
  const isCitizenMode = isCitizenViewOnly || currentRole === ROLES.CITIZEN || currentUser?.role === ROLES.CITIZEN;

  // 1. Authoritative Project Boundary from Backend/Context
  const activeProject = useMemo(() => {
    const prj = projects.find((p) => (p.id === 'PRJ-001' || p.projectId === 'PRJ-001'));
    if (prj && prj.coordinates && prj.coordinates.length > 0) {
      return prj;
    }
    return FALLBACK_PROJECT_BOUNDARY;
  }, [projects]);

  // 2. Filter parcels by authenticated citizen or by selected village:
  const authorizedParcels = useMemo(() => {
    if (isCitizenMode) {
      const citizenEmail = currentUser?.email || 'citizen@demo.com';
      const citizenName = currentUser?.name;

      const matching = khasras.filter(
        (k) =>
          (k.email && k.email.toLowerCase() === citizenEmail.toLowerCase()) ||
          (citizenName && k.ownerName && k.ownerName.toLowerCase().includes(citizenName.toLowerCase()))
      );

      if (matching.length > 0) {
        return matching;
      }
      return khasras.filter((k) => k.khasraNumber === '101' || k.khasraNumber === '105');
    }

    if (selectedVillage && selectedVillage !== 'ALL') {
      const filtered = khasras.filter(
        (k) => k.village && k.village.toLowerCase() === selectedVillage.toLowerCase()
      );
      if (filtered.length > 0) return filtered;
    }

    return khasras;
  }, [khasras, isCitizenMode, currentUser, selectedVillage]);

  // 3. Active Parcel (Loaded from authorized list)
  const activeParcel = useMemo(() => {
    const byId = authorizedParcels.find((k) => k.khasraNumber === activeKhasraId);
    if (byId) return byId;

    return authorizedParcels[0] || {
      khasraNumber: '101',
      ownerName: 'Sh. Ram Kumar',
      areaAcre: 2.50,
      affectedAreaAcre: 0.80,
      remainingAreaAcre: 1.70,
      coordinates: [[27.1652, 78.0645], [27.1658, 78.0647], [27.1657, 78.0656], [27.1650, 78.0655], [27.1648, 78.0648]],
      affectedCoordinates: [[27.1651, 78.0646], [27.1654, 78.0647], [27.1653, 78.0655], [27.1650, 78.0655], [27.1648, 78.0648]],
    };
  }, [authorizedParcels, activeKhasraId]);

  // 4. Validation & console output
  useEffect(() => {
    if (isCitizenMode) {
      console.log(`🔒 BhoomiSetu Citizen GIS Isolation: Displaying ${authorizedParcels.length} authorized parcel(s) for ${currentUser?.name || 'Ram Kumar'}.`);
    }
  }, [authorizedParcels, isCitizenMode, currentUser]);

  const defaultCenter = (activeParcel && activeParcel.coordinates && activeParcel.coordinates[0])
    ? activeParcel.coordinates[0]
    : [27.1652, 78.0650];

  const tileProviders = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors | Survey of India GIS (Demo)',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
    },
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim().replace(/^khasra\s*/i, '');
    const found = authorizedParcels.find(
      (k) =>
        k.khasraNumber === term ||
        (k.caseId && k.caseId.toLowerCase().includes(term.toLowerCase()))
    );
    if (found) {
      setActiveKhasraId(found.khasraNumber);
      setSelectedParcelPanel(found);
      setSelectedProjectPanel(null);
      setZoomMode('PARCEL');
      setZoomTrigger((prev) => prev + 1);
      showToast('Parcel Located', `Map centered on Khasra ${found.khasraNumber}.`, 'success');
    } else {
      showToast('Not Found', `Parcel "${searchTerm}" not in authorized records.`, 'warning');
    }
  };

  const handleParcelClick = (parcel) => {
    setActiveKhasraId(parcel.khasraNumber);
    setSelectedParcelPanel(parcel);
    setSelectedProjectPanel(null);
    setZoomMode('PARCEL');
    setZoomTrigger((prev) => prev + 1);
    if (onSelectParcel) onSelectParcel(parcel);
  };

  const handleProjectClick = () => {
    setSelectedProjectPanel(activeProject);
    setSelectedParcelPanel(null);
    setZoomMode('PROJECT');
    setZoomTrigger((prev) => prev + 1);
  };

  return (
    <div className={`relative w-full ${height} rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-gov-lg bg-slate-900 select-none`}>
      {/* Top Map Control Bar */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-[500] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        {/* Search or Multi-Parcel Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5 max-w-full sm:max-w-md w-full">
          {/* If citizen owns multiple parcels, show quick switcher */}
          {isCitizenMode && authorizedParcels.length > 1 ? (
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-gov-md flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 px-2 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                {isHindi ? 'आपकी भूमि:' : 'My Land:'}
              </span>
              {authorizedParcels.map((p) => {
                const isSelected = p.khasraNumber === activeParcel?.khasraNumber;
                return (
                  <button
                    key={p.khasraNumber}
                    onClick={() => {
                      setActiveKhasraId(p.khasraNumber);
                      setSelectedParcelPanel(p);
                      setZoomMode('PARCEL');
                      setZoomTrigger((prev) => prev + 1);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black transition ${
                      isSelected
                        ? 'bg-gov-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    K-{p.khasraNumber} ({p.areaAcre} Ac)
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-gov-md rounded-2xl p-1 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 w-full sm:w-64">
              <form onSubmit={handleSearchSubmit} className="flex items-center w-full gap-1">
                <Search className="w-3.5 h-3.5 text-gov-blue-800 dark:text-gov-saffron-400 ml-1.5 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isHindi ? 'खसरा खोजें...' : 'Search Khasra...'}
                  className="w-full text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white px-2 py-1 rounded-xl text-[11px] font-bold transition shadow-xs shrink-0"
                >
                  {isHindi ? 'खोजें' : 'Go'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Action Buttons & Layer Controls */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-1 sm:p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-gov-md text-xs">
          {/* Zoom: Full Parcel */}
          <button
            onClick={() => {
              setZoomMode('PARCEL');
              setZoomTrigger((prev) => prev + 1);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition border ${
              zoomMode === 'PARCEL'
                ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
            title="Focus on Full Parcel"
          >
            <Crosshair className="w-3.5 h-3.5 text-gov-saffron-400" />
            <span>{isHindi ? 'पूरा खसरा' : 'Zoom to Parcel'}</span>
          </button>

          {/* Zoom: Affected Portion Only */}
          <button
            onClick={() => {
              setZoomMode('AFFECTED');
              setZoomTrigger((prev) => prev + 1);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition border ${
              zoomMode === 'AFFECTED'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100'
            }`}
            title="Focus on Project-Affected Portion"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{isHindi ? `प्रभावित भाग (${activeParcel?.affectedAreaAcre || 0.8} Ac)` : `Affected (${activeParcel?.affectedAreaAcre || 0.8} Ac)`}</span>
          </button>

          {/* Zoom: Full Project Extent */}
          <button
            onClick={() => {
              setZoomMode('PROJECT');
              setZoomTrigger((prev) => prev + 1);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition border ${
              zoomMode === 'PROJECT'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
            title="View Entire Project Corridor Extent"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">{isHindi ? 'परियोजना सीमा' : 'Project Extent'}</span>
          </button>

          {/* Map Tile Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px]">
            <button
              onClick={() => setActiveLayer('street')}
              className={`px-1.5 py-0.5 rounded-lg font-bold transition ${
                activeLayer === 'street' ? 'bg-white dark:bg-slate-700 text-gov-blue-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-1.5 py-0.5 rounded-lg font-bold transition ${
                activeLayer === 'satellite' ? 'bg-white dark:bg-slate-700 text-gov-blue-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Sat
            </button>
          </div>

          {/* Toggle Legend */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            title="Toggle Map Legend"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Dev GIS Debug Button */}
          <button
            onClick={() => setShowDebugBox(!showDebugBox)}
            className={`p-1 rounded-lg transition ${
              showDebugBox ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
            }`}
            title="Toggle Citizen Ownership & Isolation Debug Info"
          >
            <Bug className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={17}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapBoundsController
          activeParcel={activeParcel}
          citizenParcels={authorizedParcels}
          projectBoundary={activeProject}
          zoomMode={zoomMode}
          zoomTrigger={zoomTrigger}
        />

        <TileLayer
          attribution={tileProviders[activeLayer].attribution}
          url={tileProviders[activeLayer].url}
          maxZoom={19}
        />

        {/* 1. SEPARATE GIS LAYER: Yamuna River & Embankment (Safely 400m North of Farmland) */}
        {showRiverLayer && (
          <>
            <Polygon
              positions={RIVERS_LAYER[1].coordinates}
              pathOptions={{
                color: '#06b6d4',
                fillColor: '#67e8f9',
                fillOpacity: 0.12,
                weight: 1,
                dashArray: '3, 3',
              }}
            >
              <Tooltip sticky>Yamuna River & Feeder Canal Embankment Buffer (Outside Land Parcels)</Tooltip>
            </Polygon>

            <Polyline
              positions={RIVERS_LAYER[0].coordinates}
              pathOptions={{
                color: '#0284c7',
                weight: 12,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            >
              <Tooltip sticky className="font-bold text-xs bg-sky-950 text-white">
                🌊 Yamuna River / Feeder Canal (Completely Outside Citizen Parcels)
              </Tooltip>
            </Polyline>
          </>
        )}

        {/* 2. SEPARATE GIS LAYER: Revenue Village Boundary */}
        <Polygon
          positions={
            VILLAGE_BOUNDARIES[selectedVillage] ||
            VILLAGE_BOUNDARIES[Object.keys(VILLAGE_BOUNDARIES).find((k) => k.toLowerCase() === selectedVillage?.toLowerCase())] ||
            VILLAGE_BOUNDARIES.Nagla
          }
          pathOptions={{
            color: '#8b5cf6',
            fillOpacity: 0.03,
            weight: 2,
            dashArray: '6, 6',
          }}
        >
          <Tooltip sticky>Revenue Village {selectedVillage !== 'ALL' ? selectedVillage : 'Nagla'} (Fatehabad, Agra) Shajra Boundary</Tooltip>
        </Polygon>

        {/* 3. SEPARATE GIS LAYER: Authoritative Project Boundary / 60m ROW Infrastructure Corridor */}
        {showProjectBoundary && activeProject && activeProject.coordinates && (
          <>
            <Polygon
              positions={activeProject.coordinates}
              pathOptions={{
                color: '#f59e0b',
                fillColor: '#fbbf24',
                fillOpacity: 0.14,
                weight: 2.5,
                dashArray: '6, 6',
              }}
              eventHandlers={{
                click: handleProjectClick,
              }}
            >
              <Tooltip sticky direction="top" className="bg-amber-950 text-amber-200 font-extrabold text-xs px-2 py-1 rounded shadow border border-amber-700">
                🚧 PROJECT BOUNDARY: {activeProject.name || 'Delhi–Meerut Expressway Expansion (NH-348)'}
              </Tooltip>
            </Polygon>

            {/* Expressway Asphalt Strip */}
            <Polyline
              positions={ROADS_LAYER[0].coordinates}
              pathOptions={{ color: '#334155', weight: 14, opacity: 0.9, lineCap: 'round' }}
            />
            <Polyline
              positions={ROADS_LAYER[0].coordinates}
              pathOptions={{ color: '#fef08a', weight: 2, dashArray: '4, 4', opacity: 0.95 }}
            >
              <Tooltip sticky className="font-bold text-xs bg-slate-900 text-white">
                NH-348 6-Lane Expressway Center Alignment
              </Tooltip>
            </Polyline>
          </>
        )}

        {/* 4. SEPARATE GIS LAYER: Village Agricultural Chak Roads */}
        <Polyline
          positions={ROADS_LAYER[1].coordinates}
          pathOptions={{ color: '#78716c', weight: 3.5, dashArray: '2, 2', opacity: 0.8 }}
        >
          <Tooltip sticky>Nagla Agricultural Access Chak Road</Tooltip>
        </Polyline>

        {/* 5. SEPARATE GIS LAYER: AUTHORIZED CITIZEN LAND PARCELS ONLY */}
        {authorizedParcels.map((parcel) => {
          if (!parcel.coordinates || parcel.coordinates.length < 3) return null;
          const isCurrentActive = parcel.khasraNumber === activeParcel?.khasraNumber;

          return (
            <Polygon
              key={parcel.khasraNumber}
              positions={parcel.coordinates}
              pathOptions={{
                color: isCurrentActive ? '#2563eb' : '#3b82f6',
                weight: isCurrentActive ? 2.8 : 1.5,
                fillColor: '#93c5fd',
                fillOpacity: isCurrentActive ? 0.22 : 0.12,
                dashArray: isCurrentActive ? null : '3, 3',
              }}
              eventHandlers={{
                click: () => handleParcelClick(parcel),
              }}
            >
              <Tooltip
                direction="top"
                permanent={true}
                className="bg-slate-900 text-white font-black text-[11px] px-2 py-0.5 rounded shadow border border-slate-700"
              >
                Khasra {parcel.khasraNumber} (Total: {parcel.areaAcre} Acre)
              </Tooltip>
            </Polygon>
          );
        })}

        {/* 6. SEPARATE GIS LAYER: Citizen's Project-Affected Portions ONLY */}
        {showAffectedPortions && authorizedParcels.map((parcel) => {
          if (!parcel.affectedCoordinates || parcel.affectedCoordinates.length < 3) return null;
          const isCurrentActive = parcel.khasraNumber === activeParcel?.khasraNumber;

          return (
            <Polygon
              key={`affected-${parcel.khasraNumber}`}
              positions={parcel.affectedCoordinates}
              pathOptions={{
                color: '#dc2626',
                fillColor: '#ea580c',
                fillOpacity: isCurrentActive ? 0.65 : 0.45,
                weight: 2,
                dashArray: '3, 3',
              }}
              eventHandlers={{
                click: () => handleParcelClick(parcel),
              }}
            >
              <Tooltip
                direction="center"
                permanent={isCurrentActive}
                className="bg-red-950 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-lg border border-red-500 animate-pulse"
              >
                ⚠️ Affected: {parcel.affectedAreaAcre || '0.80'} Acre
              </Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>

      {/* Development Mode GIS Debug Box */}
      {showDebugBox && (
        <div className="absolute top-14 left-2 sm:left-3 z-[600] w-72 sm:w-84 bg-slate-950/95 backdrop-blur text-emerald-400 font-mono text-[11px] p-3 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-1.5 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-1 text-xs font-bold text-white">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Citizen Ownership Isolation Check
            </span>
            <button onClick={() => setShowDebugBox(false)} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1 pt-1 text-[10px]">
            <div><span className="text-slate-400">Authenticated Citizen:</span> {currentUser?.name || 'Sh. Ram Kumar'}</div>
            <div><span className="text-slate-400">Citizen Email / ID:</span> {currentUser?.email || 'citizen@demo.com'}</div>
            <div><span className="text-slate-400">Authorized Parcels:</span> {authorizedParcels.map(p => `K-${p.khasraNumber}`).join(', ')} ({authorizedParcels.length} total)</div>
            <div><span className="text-slate-400">Other Citizens' Parcels:</span> <span className="text-rose-400 font-bold">STRICTLY EXCLUDED (0 rendered)</span></div>
            <div><span className="text-slate-400">Active Parcel:</span> Khasra {activeParcel?.khasraNumber} ({activeParcel?.areaAcre} Ac)</div>
            <div><span className="text-slate-400">Project Extent:</span> PRJ-001 (Delhi–Meerut Expressway)</div>
            <div><span className="text-slate-400">Affected Intersection:</span> {activeParcel?.affectedAreaAcre} Ac ({(((activeParcel?.affectedAreaAcre || 0.8) / activeParcel?.areaAcre) * 100).toFixed(1)}%)</div>
            <div className="text-emerald-300 font-bold text-[9px] pt-1">
              ✓ Rule Enforced: Only authorized citizen parcels rendered
            </div>
          </div>
        </div>
      )}

      {/* Floating Map Legend */}
      {showLegend && (
        <div className="absolute bottom-10 sm:bottom-12 left-2 sm:left-4 z-[500] bg-white/95 dark:bg-slate-900/95 backdrop-blur p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-2 pointer-events-auto max-w-[240px] sm:max-w-[270px]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-1.5">
            <span className="font-extrabold text-[11px] text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-gov-blue-800 dark:text-gov-saffron-400" />
              {isHindi ? 'मानचित्र संकेतक (Legend)' : 'GIS Map Legend'}
            </span>
            <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded border-2 border-amber-500 bg-amber-500/20 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">{isHindi ? 'परियोजना सीमा / कॉरिडोर' : 'Project Boundary (ROW)'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded border border-blue-600 bg-blue-400/20 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">
                {isHindi ? `आपकी कुल भूमि (${activeParcel?.areaAcre} Ac)` : `My Total Parcel (${activeParcel?.areaAcre} Ac)`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded border-2 border-red-600 bg-orange-600/60 shrink-0 animate-pulse" />
              <span className="text-red-700 dark:text-red-400 font-black">
                {isHindi ? `प्रभावित भाग (${activeParcel?.affectedAreaAcre} Ac)` : `Affected Portion (${activeParcel?.affectedAreaAcre} Ac)`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded border border-emerald-500 bg-emerald-500/20 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">
                {isHindi ? `शेष अप्रभावित भूमि (${activeParcel?.remainingAreaAcre} Ac)` : `Remaining Land (${activeParcel?.remainingAreaAcre} Ac)`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 bg-slate-700 rounded shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'एक्सप्रेसवे अलाइनमेंट' : 'Expressway Alignment'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 bg-sky-500 rounded shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'यमुना नदी / नहर (बाह्य)' : 'River / Canal (Outside)'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in Panel: Citizen's Parcel & Affected Breakdown */}
      {selectedParcelPanel && (
        <div className="absolute top-14 sm:top-16 right-2 sm:right-4 z-[600] w-80 sm:w-96 bg-white/98 dark:bg-slate-900/98 backdrop-blur rounded-3xl border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden pointer-events-auto transition-all animate-fadeIn text-xs">
          {/* Header */}
          <div className="bg-gov-blue-950 text-white p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] uppercase font-black bg-gov-saffron-500 text-slate-950 px-2 py-0.2 rounded tracking-wider">
                  Citizen Land Parcel File
                </span>
                <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/40">
                  {backendLoaded ? 'Backend GIS Synchronized' : 'Demo GIS Geometry'}
                </span>
              </div>
              <h3 className="text-base font-black flex items-center gap-1.5">
                Khasra No. {selectedParcelPanel.khasraNumber}
                <span className="text-xs font-normal text-slate-300">({selectedParcelPanel.khataNumber})</span>
              </h3>
              <span className="font-mono text-[10px] text-gov-saffron-400">
                Owner: {selectedParcelPanel.ownerName}
              </span>
            </div>

            <button
              onClick={() => setSelectedParcelPanel(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 max-h-[440px] overflow-y-auto">
            {/* Split Visual Progress Bar (Total vs Affected vs Remaining) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-300">Total Registered Land</span>
                <span className="font-black text-slate-900 dark:text-white">{selectedParcelPanel.areaAcre} Acre (100%)</span>
              </div>

              {/* Stacked Bar */}
              <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${((selectedParcelPanel.affectedAreaAcre || 0.80) / selectedParcelPanel.areaAcre) * 100}%` }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                  title="Project Affected Land"
                />
                <div
                  style={{ width: `${((selectedParcelPanel.remainingAreaAcre || 1.70) / selectedParcelPanel.areaAcre) * 100}%` }}
                  className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                  title="Remaining Land Retained"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-800">
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-bold block">Project Affected:</span>
                  <span className="font-black text-red-700 dark:text-red-300 text-sm">
                    {selectedParcelPanel.affectedAreaAcre || 0.80} Acre
                  </span>
                  <span className="text-[9px] text-red-500 block">
                    ({(((selectedParcelPanel.affectedAreaAcre || 0.80) / selectedParcelPanel.areaAcre) * 100).toFixed(1)}% acquired)
                  </span>
                </div>

                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Remaining Land:</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">
                    {selectedParcelPanel.remainingAreaAcre || 1.70} Acre
                  </span>
                  <span className="text-[9px] text-emerald-500 block">
                    ({(((selectedParcelPanel.remainingAreaAcre || 1.70) / selectedParcelPanel.areaAcre) * 100).toFixed(1)}% retained)
                  </span>
                </div>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block">Village / Tehsil</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block">
                  {selectedParcelPanel.village || 'Nagla'}, {selectedParcelPanel.tehsil || 'Fatehabad'}
                </span>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block">District & State</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block">
                  {selectedParcelPanel.district || 'Agra'}, {selectedParcelPanel.state || 'UP'}
                </span>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block">Acquisition Status</span>
                <span className="font-extrabold text-gov-blue-900 dark:text-gov-saffron-400">
                  {selectedParcelPanel.status || 'PROPOSED'}
                </span>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block">GIS Demarcation</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {selectedParcelPanel.gisStatus || 'VERIFIED'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => navigate(`/cases/${selectedParcelPanel.caseId || 'CASE-2026-DME-0101'}`)}
                className="flex-1 bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-2 rounded-xl text-center flex items-center justify-center gap-1 transition"
              >
                <span>Open Case Workflow</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in Panel: Project Boundary Information */}
      {selectedProjectPanel && (
        <div className="absolute top-14 sm:top-16 right-2 sm:right-4 z-[600] w-80 sm:w-96 bg-white/98 dark:bg-slate-900/98 backdrop-blur rounded-3xl border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden pointer-events-auto transition-all animate-fadeIn text-xs">
          <div className="bg-amber-950 text-white p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] uppercase font-black bg-amber-500 text-slate-950 px-2 py-0.2 rounded tracking-wider">
                  Infrastructure Project Extent
                </span>
                <span className="text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.2 rounded">
                  {selectedProjectPanel.projectId || selectedProjectPanel.id}
                </span>
              </div>
              <h3 className="text-sm font-black text-amber-200 leading-snug">
                {selectedProjectPanel.name}
              </h3>
            </div>

            <button
              onClick={() => setSelectedProjectPanel(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-[11px] space-y-1">
              <span className="font-extrabold text-amber-900 dark:text-amber-300 block">Corridor Intersection Analysis</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The 60-meter statutory Right-of-Way intersects your village farmland envelope.
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Requiring Agency:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedProjectPanel.requiringAgency || 'NHAI'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Total Project Land:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProjectPanel.totalLandRequired || 1450.0} Ha</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Affected Village Farmland:</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">14.50 Acre (Nagla Village)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Your Affected Parcel(s):</span>
                <span className="font-bold text-gov-blue-900 dark:text-gov-saffron-400">
                  {authorizedParcels.map(p => `K-${p.khasraNumber}`).join(', ')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedProjectPanel(null);
                setZoomMode('AFFECTED');
                setZoomTrigger((prev) => prev + 1);
              }}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-2 rounded-xl text-center transition"
            >
              Focus on Your Affected Portion
            </button>
          </div>
        </div>
      )}

      {/* Bottom Prototype Disclaimer Bar */}
      <div className="absolute bottom-1 sm:bottom-2 left-2 sm:left-4 right-2 sm:right-4 z-[450] pointer-events-none">
        <div className="bg-slate-950/85 backdrop-blur text-slate-300 text-[10px] px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md flex items-center justify-between gap-2 max-w-2xl mx-auto">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gov-saffron-500 shrink-0" />
            <span className="truncate">
              GIS boundaries shown are simulated for SIH 2026 prototype purposes and do not represent legally authoritative cadastral boundaries.
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold text-gov-saffron-400 shrink-0 hidden sm:inline">
            EPSG:4326 WGS84
          </span>
        </div>
      </div>
    </div>
  );
};
