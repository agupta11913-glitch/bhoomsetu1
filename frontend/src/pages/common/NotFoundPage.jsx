import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GovEmblem } from '../../components/common/GovEmblem';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <GovEmblem size="lg" />
      <h1 className="text-4xl font-black text-gov-blue-900">404</h1>
      <h2 className="text-lg font-bold text-slate-800">Page or Cadastral Sheet Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        The requested administrative portal route or cadastral dataset does not exist in the active directory.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
