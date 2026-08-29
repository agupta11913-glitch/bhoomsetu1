import React from 'react';
import { WORKFLOW_STAGES } from '../../utils/constants';
import { Check } from 'lucide-react';

export const WorkflowStepper = ({ currentStatus, onStepClick, interactive = false }) => {
  const currentStageIndex = WORKFLOW_STAGES.findIndex(s => s.id === currentStatus);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  return (
    <div className="w-full py-2 sm:py-4 overflow-x-auto touch-pan-x">
      <div className="min-w-[680px] sm:min-w-[720px] flex items-center justify-between relative px-2 sm:px-4">
        {/* Connecting Line */}
        <div className="absolute top-4 sm:top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-4 sm:top-5 left-6 h-0.5 bg-gov-blue-800 transition-all duration-500 -z-0"
          style={{ width: `${(activeIndex / (WORKFLOW_STAGES.length - 1)) * 92}%` }}
        />

        {WORKFLOW_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex || currentStatus === 'ACQUIRED';
          const isCurrent = idx === activeIndex && currentStatus !== 'ACQUIRED';
          const isFuture = idx > activeIndex && currentStatus !== 'ACQUIRED';

          return (
            <div
              key={stage.id}
              onClick={() => interactive && onStepClick && onStepClick(stage.id)}
              className={`flex flex-col items-center group relative z-10 ${interactive ? 'cursor-pointer' : ''}`}
            >
              {/* Circle Indicator */}
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? 'bg-gov-green-600 text-white border-2 border-white'
                    : isCurrent
                    ? 'bg-gov-blue-800 text-white ring-2 sm:ring-4 ring-gov-blue-100 border-2 border-white animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300 group-hover:border-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : idx + 1}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] sm:text-[11px] font-semibold text-center mt-1.5 sm:mt-2 max-w-[60px] sm:max-w-[70px] leading-tight transition-colors ${
                  isCurrent
                    ? 'text-gov-blue-900 font-bold'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
