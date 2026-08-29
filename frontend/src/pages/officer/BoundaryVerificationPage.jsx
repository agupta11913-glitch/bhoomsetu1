import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { LeafletGISMap } from '../../components/map/LeafletGISMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Code,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

export const BoundaryVerificationPage = () => {
  const navigate = useNavigate();
  const { khasras, activeKhasraId, setActiveKhasraId, verifyGISBoundary, showToast } = useLandData();

  const [selectedNum, setSelectedNum] = useState(activeKhasraId || '101');
  const currentParcel = khasras.find((k) => k.khasraNumber === selectedNum) || khasras[0];

  const handleApprove = () => {
    verifyGISBoundary(currentParcel.id, 'GeoJSON 4-vertex boundary polygon georeferenced with 0 overlap against ROW buffer.');
  };

  const handleFlagConflict = () => {
    showToast('Boundary Flagged', `Khasra ${currentParcel.khasraNumber} marked for physical drone/ETS survey.`, 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-50 text-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-200">
              GeoJSON Vector Geometry Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Survey of India WFS Feed</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Cadastral Boundary Georeferencing & Validation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validate polygon vertex coordinates, detect ROW corridor overlap, and confirm boundary clearances.
          </p>
        </div>

        {/* Parcel selector + Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            {['101', '102', '103', '104', '105', '117', '134'].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setSelectedNum(num);
                  setActiveKhasraId(num);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  selectedNum === num
                    ? 'bg-cyan-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                #{num}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Map + Right Geometry Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map: 7 Cols */}
        <div className="lg:col-span-7">
          <LeafletGISMap height="h-[600px]" onSelectParcel={(p) => setSelectedNum(p.khasraNumber)} />
        </div>

        {/* Right Inspection & GeoJSON Coordinate Panel: 5 Cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-gov p-5 space-y-4 flex flex-col justify-between overflow-y-auto max-h-[600px]">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800">
                  Spatial Vertex Inspector
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Khasra {currentParcel.khasraNumber} ({currentParcel.ownerName})
                </h3>
                <p className="text-xs text-slate-500">{currentParcel.areaAcre} Acre • {currentParcel.village}</p>
              </div>
              <StatusBadge status={currentParcel.status} />
            </div>

            {/* GIS Status Indicator */}
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
              currentParcel.gisVerified
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : currentParcel.status === 'BOUNDARY_ISSUE'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {currentParcel.gisVerified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-extrabold text-sm">
                  {currentParcel.gisVerified
                    ? 'GIS BOUNDARY APPROVED ✓'
                    : currentParcel.status === 'BOUNDARY_ISSUE'
                    ? 'CANAL BUFFER OVERLAP FLAGGED ⚠'
                    : 'BOUNDARY VERIFICATION PENDING'}
                </h4>
                <p className="text-[11px] mt-0.5 leading-relaxed">
                  {currentParcel.gisVerified
                    ? 'Polygon coordinates verified with zero corridor buffer infringement.'
                    : currentParcel.status === 'BOUNDARY_ISSUE'
                    ? 'Physical boundary intersects 0.15 Acre into PWD drainage right-of-way.'
                    : 'Awaiting GIS Officer digital authorization.'}
                </p>
              </div>
            </div>

            {/* GeoJSON Polygon Coordinates Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-700" />
                  WGS84 GeoJSON Coordinates (ETS Survey)
                </span>
                <span className="text-[10px] font-mono text-slate-400">4 Corner Vertices</span>
              </div>
              <div className="bg-slate-900 text-cyan-400 font-mono text-[11px] p-3 rounded-xl overflow-x-auto space-y-1">
                {currentParcel.coordinates.map((coord, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-400">Vertex #{i + 1}:</span>
                    <span>[{coord[0].toFixed(6)}, {coord[1].toFixed(6)}]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!currentParcel.gisVerified ? (
              <button
                onClick={handleApprove}
                className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>APPROVE GEOJSON BOUNDARY</span>
              </button>
            ) : (
              <div className="p-2 bg-emerald-100 text-emerald-800 text-xs font-bold text-center rounded-xl flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Boundary Coordinates Approved
              </div>
            )}

            <button
              onClick={handleFlagConflict}
              className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flag Cadastral Conflict / Request Physical ETS Survey</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
