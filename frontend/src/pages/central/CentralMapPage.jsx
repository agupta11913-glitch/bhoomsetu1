import React, { useState, useEffect } from 'react';
import { fetchCentralMapApi } from '../../services/api/centralApi';
import { UniversalGISMap } from '../../components/gis/UniversalGISMap';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Globe, MapPin } from 'lucide-react';

const CentralMapContent = () => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCentralMapApi().then((data) => {
      if (data) setMapData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gov-blue-700" />
              <span>National PM Gati Shakti Master Plan</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Pan-India Geographic GIS</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gov-blue-800" />
            <span>Pan-India Cadastral GIS & Infrastructure Corridors Map</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized vector GIS map covering all national infrastructure projects and verified cadastre parcels across India.
          </p>
        </div>
      </div>

      <UniversalGISMap
        scope="central"
        userState="ALL"
        userDistrict="ALL"
        mapData={mapData}
      />
    </div>
  );
};

export const CentralMapPage = () => (
  <ErrorBoundary>
    <CentralMapContent />
  </ErrorBoundary>
);

export default CentralMapPage;
