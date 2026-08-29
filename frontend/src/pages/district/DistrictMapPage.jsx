import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictMapApi } from '../../services/api/districtApi';
import { UniversalGISMap } from '../../components/gis/UniversalGISMap';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { MapPin } from 'lucide-react';

const DistrictMapContent = () => {
  const { currentUser } = useAuth();
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  const districtName = currentUser?.district || 'Agra';
  const stateName = currentUser?.state || 'Uttar Pradesh';

  useEffect(() => {
    fetchDistrictMapApi(districtName).then((data) => {
      if (data) setMapData(data);
      setLoading(false);
    });
  }, [districtName]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              District Cadastral GIS
            </span>
            <span className="text-xs font-bold text-slate-500">{districtName} District ({stateName})</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-600" />
            <span>District Collectorate Cadastral & Infrastructure GIS Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized vector GIS map covering all authorized project corridors and verified cadastre parcels in {districtName} District.
          </p>
        </div>
      </div>

      <UniversalGISMap
        scope="district"
        userState={stateName}
        userDistrict={districtName}
        mapData={mapData}
      />
    </div>
  );
};

export const DistrictMapPage = () => (
  <ErrorBoundary>
    <DistrictMapContent />
  </ErrorBoundary>
);

export default DistrictMapPage;
