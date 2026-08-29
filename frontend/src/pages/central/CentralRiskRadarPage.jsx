import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCentralRiskRadarApi } from '../../services/api/centralApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Sparkles, AlertTriangle, ShieldAlert, Globe, MapPin } from 'lucide-react';

const CentralRiskRadarContent = () => {
  const navigate = useNavigate();
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    fetchCentralRiskRadarApi().then((data) => {
      if (Array.isArray(data)) setRisks(data);
    });
  }, []);

  const defaultRisks = [
    {
      projectId: 'PRJ-007',
      projectName: 'Ken-Betwa River Interlinking',
      agency: 'NWDA / Jal Shakti',
      state: 'Madhya Pradesh',
      riskScore: 0.78,
      riskLevel: 'HIGH',
      primaryBottleneck: 'Environmental & Forest Clearance Pending Stage-II Advisory',
    },
    {
      projectId: 'PRJ-012',
      projectName: 'Ganga Expressway Feeder Node',
      agency: 'UPEIDA',
      state: 'Uttar Pradesh',
      riskScore: 0.65,
      riskLevel: 'MEDIUM',
      primaryBottleneck: 'Section 15 Citizen Objections Cluster (14.5 Acre)',
    },
    {
      projectId: 'PRJ-003',
      projectName: 'DMIC Hub Node',
      agency: 'NICDC',
      state: 'Maharashtra',
      riskScore: 0.42,
      riskLevel: 'MEDIUM',
      primaryBottleneck: 'High-Tension Transmission Tower Utility Shifting Delayed',
    },
  ];

  const list = risks.length > 0 ? risks : defaultRisks;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Predictive Risk Engine</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            <span>PM Gati Shakti AI Delay Risk Radar & Anomaly Forecast</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Machine learning forecast analyzing historical acquisition SLA velocity, court stays, and inter-departmental utility delays.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {list.map((r) => (
          <div
            key={r.projectId}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                  {r.projectId}
                </span>
                <h3 className="text-base font-black text-slate-900">{r.projectName}</h3>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1 self-start sm:self-auto ${
                  r.riskLevel === 'HIGH'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>AI Risk Score: {Math.round(r.riskScore * 100)}% ({r.riskLevel})</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <strong>Agency:</strong> {r.agency} • <strong>State:</strong> {r.state}
              </div>
              <div className="text-slate-800 font-medium">
                <strong>Primary Bottleneck:</strong> {r.primaryBottleneck}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => navigate(`/central/map?projectId=${r.projectId}`)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Inspect on Map</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CentralRiskRadarPage = () => (
  <ErrorBoundary>
    <CentralRiskRadarContent />
  </ErrorBoundary>
);

export default CentralRiskRadarPage;
