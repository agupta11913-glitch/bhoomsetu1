import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, onClick, className = '' }) => {
  const colorMap = {
    blue: {
      border: 'border-blue-200',
      bgIcon: 'bg-blue-50 text-blue-600',
      highlight: 'text-blue-900',
      bar: 'bg-blue-600',
    },
    green: {
      border: 'border-emerald-200',
      bgIcon: 'bg-emerald-50 text-emerald-600',
      highlight: 'text-emerald-900',
      bar: 'bg-emerald-600',
    },
    amber: {
      border: 'border-amber-200',
      bgIcon: 'bg-amber-50 text-amber-600',
      highlight: 'text-amber-900',
      bar: 'bg-amber-500',
    },
    orange: {
      border: 'border-orange-200',
      bgIcon: 'bg-orange-50 text-orange-600',
      highlight: 'text-orange-900',
      bar: 'bg-orange-500',
    },
    purple: {
      border: 'border-purple-200',
      bgIcon: 'bg-purple-50 text-purple-600',
      highlight: 'text-purple-900',
      bar: 'bg-purple-600',
    },
    red: {
      border: 'border-rose-200',
      bgIcon: 'bg-rose-50 text-rose-600',
      highlight: 'text-rose-900',
      bar: 'bg-rose-600',
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl p-5 border ${scheme.border} shadow-gov hover:shadow-gov-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-gov-blue-500' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-2xl font-bold tracking-tight ${scheme.highlight}`}>{value}</h3>
            {trend && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trend.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${scheme.bgIcon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${scheme.bar} w-full`} />
      </div>
    </div>
  );
};
