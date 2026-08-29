import React from 'react';
import { PROTOTYPE_DISCLAIMER } from '../../utils/constants';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-slate-950/80 px-4 sm:px-8 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <Info className="w-4 h-4 text-gov-saffron-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-300">
            <strong className="text-gov-saffron-500">Prototype Notice: </strong>
            {PROTOTYPE_DISCLAIMER}
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-gov-green-500" />
          <div>
            <p className="font-bold text-white text-sm">BHOOMISETU • National Land Acquisition System</p>
            <p className="text-[11px] text-slate-400">Developed for Smart India Hackathon (SIH) • Architecture: React + Spring Boot API + MySQL</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <span className="hover:text-white transition cursor-pointer">Security Policy</span>
          <span>•</span>
          <span className="hover:text-white transition cursor-pointer">Simulated API Hub</span>
          <span>•</span>
          <span className="hover:text-white transition cursor-pointer">RFCTLARR Act 2013 Guidelines</span>
          <span>•</span>
          <span className="text-gov-saffron-500 font-semibold">SIH-2026 Team Prototype</span>
        </div>
      </div>
    </footer>
  );
};
