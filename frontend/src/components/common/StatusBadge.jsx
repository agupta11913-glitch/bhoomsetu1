import React from 'react';
import { STATUS_COLORS, WORKFLOW_STAGES } from '../../utils/constants';

export const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const config = STATUS_COLORS[status] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-400',
  };

  const stageObj = WORKFLOW_STAGES.find(s => s.id === status);
  const label = stageObj ? stageObj.label : status?.replace(/_/g, ' ');

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {label}
    </span>
  );
};
