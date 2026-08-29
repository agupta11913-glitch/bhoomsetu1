import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStateMapApi } from '../../services/api/stateApi';
import { UniversalGISMap } from '../../components/gis/UniversalGISMap';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { MapPin, Building2, Layers } from 'lucide-react';

const StateMapContent = () => {
  const { currentUser } = useAuth();
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    fetchStateMapApi(stateName).then((data) => {
      if (data) setMapData(data);
      setLoading(false);
    });
  }, [stateName]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              Statewide GIS Cadastre
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-600" />
            <span>Statewide Infrastructure & Cadastral GIS Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized vector GIS map covering all authorized project corridors and verified cadastre parcels across Uttar Pradesh.
          </p>
        </div>
      </div>

      <UniversalGISMap
        scope="state"
        userState={stateName}
        userDistrict="Agra"
        mapData={mapData}
      />
    </div>
  );
};

export const StateMapPage = () => (
  <ErrorBoundary>
    <StateMapContent />
  </ErrorBoundary>
);

export default StateMapPage;
