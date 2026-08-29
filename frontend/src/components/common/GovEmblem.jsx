import React from 'react';

export const GovEmblem = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size] || sizeMap.md} ${className}`}>
      {/* Outer Chakra Ring */}
      <svg className="w-full h-full animate-spin-slow drop-shadow-sm" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="46" stroke="#003366" strokeWidth="4" />
        <circle cx="50" cy="50" r="38" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="4 2" />
        {/* Spokes */}
        {[...Array(24)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 38 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={50 + 38 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="#003366"
            strokeWidth="1.2"
            opacity="0.7"
          />
        ))}
        <circle cx="50" cy="50" r="14" fill="#003366" />
        <circle cx="50" cy="50" r="6" fill="#138808" />
      </svg>
    </div>
  );
};
