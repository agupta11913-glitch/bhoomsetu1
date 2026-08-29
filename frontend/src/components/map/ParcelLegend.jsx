import React from 'react';
import { GIS_STATUS_COLORS } from '../../utils/constants';

export const ParcelLegend = () => {
  const legendItems = [
    { label: 'Green = Acquired', color: '#15803d', desc: 'Mutated in govt possession' },
    { label: 'Yellow = Under Verification', color: '#ca8a04', desc: 'Joint RoR/ETS survey active' },
    { label: 'Red = Disputed', color: '#dc2626', desc: 'Objection or title issue' },
    { label: 'Blue = Proposed', color: '#2563eb', desc: 'Identified within corridor ROW' },
    { label: 'Orange = Compensation Pending', color: '#ea580c', desc: 'Award set, awaiting PFMS DBT' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur p-3 rounded-xl border border-slate-200 shadow-gov-md text-xs space-y-2 max-w-xs">
      <div className="border-b border-slate-100 pb-1 flex items-center justify-between">
        <h4 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider">
          Cadastral Status Legend
        </h4>
        <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-bold">
          Simulated GIS
        </span>
      </div>
      <div className="space-y-1.5">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm shrink-0 shadow-xs"
              style={{ backgroundColor: item.color }}
            />
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-800 block truncate">{item.label}</span>
              <span className="text-[9px] text-slate-500 block truncate">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
