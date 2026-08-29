import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRevenueMapApi, fetchRevenueCasesApi } from '../../services/api/revenueOfficerApi';
import { LeafletGISMap } from '../../components/map/LeafletGISMap';
import { formatAcre, formatCurrency } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  MapPin,
  Search,
  Filter,
  RefreshCw,
  FileCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  Eye,
  Info,
} from 'lucide-react';

const RevenueOfficerMapContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initKhasra = searchParams.get('khasra') || '101';

  const [selectedVillage, setSelectedVillage] = useState('Nagla');
  const [selectedKhasra, setSelectedKhasra] = useState(initKhasra);
  const [mapData, setMapData] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mData, cData] = await Promise.all([
        fetchRevenueMapApi(selectedVillage),
        fetchRevenueCasesApi({ village: selectedVillage }),
      ]);
      if (mData) setMapData(mData);
      if (Array.isArray(cData)) setCases(cData);
    } catch (err) {
      console.error('Revenue Map error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedVillage]);

  const activeCase = cases.find((c) => c.khasraNumber === selectedKhasra) || cases[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Assigned Jurisdiction GIS Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Right-of-Way (ROW) Boundary Demarcation
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Revenue Cadastral & Parcel GIS Inspection Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial alignment verification of 60m highway corridor with revenue shajra boundaries and assigned land parcels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
          >
            <option value="Nagla">Nagla (Fatehabad, Agra)</option>
            <option value="Kasan">Kasan (Bah, Agra)</option>
            <option value="Kharabwadi">Kharabwadi (Etmadpur, Agra)</option>
            <option value="Vesu">Vesu (Kheragarh, Agra)</option>
          </select>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. Main Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 border border-slate-200 shadow-gov">
          <LeafletGISMap
            selectedVillage={selectedVillage}
            onSelectParcel={(p) => setSelectedKhasra(p.khasraNumber)}
            height="h-[580px]"
          />
        </div>

        {/* Selected Parcel Dossier (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Active Selected Parcel
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Khasra No. {selectedKhasra}
              </h3>
              <p className="text-xs text-slate-500">{selectedVillage} Village, Fatehabad Tehsil</p>
            </div>
            {activeCase && <StatusBadge status={activeCase.verificationStatus} size="sm" />}
          </div>

          {activeCase ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Claimant Owner:</span>
                <strong className="text-slate-900 text-sm">{activeCase.ownerName}</strong>
                {activeCase.fatherName && <span className="text-[11px] text-slate-400 block">S/o {activeCase.fatherName}</span>}
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Total Area:</span>
                  <strong className="text-slate-800">{formatAcre(activeCase.totalAreaAcre)}</strong>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-amber-800 block text-[10px]">Acquired:</span>
                  <strong className="text-amber-950 font-bold">{formatAcre(activeCase.affectedAreaAcre)}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Case ID:</span>
                  <span className="font-mono font-bold text-slate-800">{activeCase.caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RoR Verified:</span>
                  <span className="text-emerald-700 font-bold">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GIS Demarcation:</span>
                  <span className="text-emerald-700 font-bold">✓ Verified</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => navigate(`/revenue-officer/cases/${activeCase.caseId}`)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 p-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Open Full Verification Dossier</span>
                </button>
                <button
                  onClick={() => navigate('/revenue-officer/field-verification')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Record Field Visit</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 space-y-2">
              <Info className="w-6 h-6 mx-auto text-slate-300" />
              <p className="text-xs">Click on any parcel on the GIS map to inspect ownership and statutory bounds.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RevenueOfficerMap = () => (
  <ErrorBoundary fallbackTitle="Unable to load Revenue GIS Map">
    <RevenueOfficerMapContent />
  </ErrorBoundary>
);
