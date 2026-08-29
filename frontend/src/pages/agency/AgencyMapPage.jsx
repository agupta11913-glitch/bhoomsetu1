import React, { useState, useEffect } from 'react';
import { fetchAgencyMapApi } from '../../services/api/agencyApi';
import { UniversalGISMap } from '../../components/gis/UniversalGISMap';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Layers, MapPin, Building2 } from 'lucide-react';

const AgencyMapContent = () => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyMapApi().then((data) => {
      if (data) setMapData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-50 text-cyan-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-700" />
              <span>Assigned Infrastructure GIS</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Read-Only ROW Cadastre</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-700" />
            <span>Assigned Corridor Alignment & Cadastral GIS Map</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized vector map showing assigned project boundaries, acquired parcels, and surrounding contextual buffer zones.
          </p>
        </div>
      </div>

      <UniversalGISMap
        scope="agency"
        userState="Uttar Pradesh"
        userDistrict="ALL"
        mapData={mapData}
      />
    </div>
  );
};

export const AgencyMapPage = () => (
  <ErrorBoundary>
    <AgencyMapContent />
  </ErrorBoundary>
);

export default AgencyMapPage;
