import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Clock, AlertTriangle, ArrowRight, Building2, MapPin } from 'lucide-react';

const StateDelayedProjectsContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const stateName = currentUser?.state || 'Uttar Pradesh';

  const delayedCorridors = [
    {
      id: 'PRJ-012',
      name: 'Ganga Expressway Feeder Node & Logistics Spur',
      districts: 'Prayagraj, Rae Bareli',
      agency: 'UPEIDA',
      delayedDays: 78,
      bottleneck: 'High Court stay on 14.5 Acre multi-crop parcel cluster; revised alignment proposal pending Cabinet nod.',
      slaStatus: 'CRITICAL_DELAY',
    },
    {
      id: 'PRJ-011',
      name: 'Lucknow Ring Road Phase-3 Infrastructure Belt',
      districts: 'Lucknow, Unnao',
      agency: 'NHAI & UP PWD',
      delayedDays: 44,
      bottleneck: 'Utility shifting estimate pending deposit with DVVNL power corporation.',
      slaStatus: 'MODERATE_DELAY',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-red-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-red-200 uppercase tracking-wider">
              SLA Bottleneck Radar
            </span>
            <span className="text-xs font-bold text-slate-500">{stateName}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Clock className="w-6 h-6 text-red-600" />
            <span>State Delayed Corridors & Bottleneck Interventions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Projects with acquisition timeline breach exceeding statutory 60-day threshold requiring Principal Secretary directive.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Delayed Corridors</span>
          <strong className="text-2xl font-black text-red-700">{delayedCorridors.length} Projects</strong>
        </div>
      </div>

      <div className="space-y-4">
        {delayedCorridors.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-6 border border-red-100 shadow-gov hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-red-200">
                  {p.id}
                </span>
                <h3 className="text-base font-black text-slate-900">{p.name}</h3>
              </div>
              <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-xl border border-red-200 flex items-center gap-1 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                <span>Delayed by {p.delayedDays} Days</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <strong>Districts:</strong> {p.districts} • <strong>Agency:</strong> {p.agency}
              </div>
              <div className="text-red-800 font-medium">
                <strong>Primary Bottleneck:</strong> {p.bottleneck}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => navigate(`/state/map?projectId=${p.id}`)}
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

export const StateDelayedProjectsPage = () => (
  <ErrorBoundary>
    <StateDelayedProjectsContent />
  </ErrorBoundary>
);

export default StateDelayedProjectsPage;
