import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { GovEmblem } from '../../components/common/GovEmblem';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  Database,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Printer,
  Sparkles,
  ArrowRight,
  Info,
  X,
} from 'lucide-react';

export const BhulekhSearchPage = () => {
  const navigate = useNavigate();
  const { khasras, setActiveKhasraId } = useLandData();

  const [searchKhasra, setSearchKhasra] = useState('101');
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState('Agra');
  const [selectedTehsil, setSelectedTehsil] = useState('Fatehabad');
  const [selectedVillage, setSelectedVillage] = useState('Nagla');
  const [searchedRecord, setSearchedRecord] = useState(khasras.find((k) => k.khasraNumber === '101') || khasras[0]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      const clean = searchKhasra.trim().replace(/^khasra\s*/i, '');
      const found = khasras.find((k) => k.khasraNumber === clean || k.ownerName.toLowerCase().includes(clean.toLowerCase())) || khasras[0];
      setSearchedRecord(found);
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              National Land Records Modernization (DILRMP)
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">UP Bhulekh Digital RoR Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Bhulekh Land Records (Khatauni) Search
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Query simulated Record of Rights (RoR), ownership shares, and mutation status.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gov-saffron-50 text-gov-saffron-700 border border-gov-saffron-300 px-3 py-2 rounded-xl text-xs font-bold hidden sm:inline">
            SIMULATED DATA
          </span>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Bhulekh Multi-field Filter Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              >
                <option>Uttar Pradesh</option>
                <option>Madhya Pradesh</option>
                <option>Haryana</option>
                <option>Rajasthan</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">District (जनपद)</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              >
                <option>Agra</option>
                <option>Lucknow</option>
                <option>Kanpur Nagar</option>
                <option>Jhansi</option>
                <option>Varanasi</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Tehsil (तहसील)</label>
              <select
                value={selectedTehsil}
                onChange={(e) => setSelectedTehsil(e.target.value)}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              >
                <option>Fatehabad</option>
                <option>Sadar Agra</option>
                <option>Etmadpur</option>
                <option>Kheragarh</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Village (ग्राम)</label>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              >
                <option>Nagla</option>
                <option>Chhalesar</option>
                <option>Barhan</option>
                <option>Rahan</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Khasra Number (खसरा संख्या) / Khata No. / Owner Name *
              </label>
              <input
                type="text"
                value={searchKhasra}
                onChange={(e) => setSearchKhasra(e.target.value)}
                placeholder="Enter Khasra (e.g. 101, 102, 103, 104, 117)..."
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="mt-5 bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow flex items-center gap-2 transition transform active:scale-95"
            >
              <Search className="w-4 h-4 text-gov-saffron-500" />
              <span>{isSearching ? 'Querying Bhulekh...' : 'Search Land Record'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Khatauni Record Display Certificate */}
      {searchedRecord && (
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-gov p-6 sm:p-8 space-y-6">
          {/* Top Khatauni Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GovEmblem size="md" />
              <div>
                <h3 className="text-base font-black uppercase text-slate-900 tracking-wider">
                  उ.प्र. भूलेख डिजिटल खतौनी (अधिकार अभिलेख - RoR)
                </h3>
                <p className="text-xs text-slate-500">
                  राजस्व परिषद, उत्तर प्रदेश • Fasli Year: 1431-1436 • Simulated Extract
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono bg-gov-blue-50 text-gov-blue-900 border border-gov-blue-200 px-2.5 py-1 rounded-lg font-bold">
                {searchedRecord.bhulekhRecord?.fascicleNumber || 'FSC-2024-AG-8821'}
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">जनपद / District:</span>
              <span className="font-bold text-slate-800">{searchedRecord.district}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">तहसील / Tehsil:</span>
              <span className="font-bold text-slate-800">{searchedRecord.tehsil}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">ग्राम / Village:</span>
              <span className="font-bold text-slate-800">{searchedRecord.village}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">खाता संख्या / Khata:</span>
              <span className="font-bold text-slate-800">{searchedRecord.khataNumber}</span>
            </div>
          </div>

          {/* Khatauni Main Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="border border-slate-300 p-2.5 text-left">खातेदार का नाम (Khatedar / Owner)</th>
                  <th className="border border-slate-300 p-2.5 text-left">पिता/पति का नाम</th>
                  <th className="border border-slate-300 p-2.5 text-center">खसरा संख्या</th>
                  <th className="border border-slate-300 p-2.5 text-right">क्षेत्रफल (Area)</th>
                  <th className="border border-slate-300 p-2.5 text-left">भूमि प्रकार</th>
                  <th className="border border-slate-300 p-2.5 text-left">टिप्पणी / बन्धक स्थिति</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2.5 font-bold text-slate-900">
                    {searchedRecord.ownerName}
                  </td>
                  <td className="border border-slate-300 p-2.5 text-slate-700">
                    {searchedRecord.fatherName}
                  </td>
                  <td className="border border-slate-300 p-2.5 text-center font-extrabold text-gov-blue-900">
                    {searchedRecord.khasraNumber}
                  </td>
                  <td className="border border-slate-300 p-2.5 text-right font-extrabold text-slate-900">
                    {searchedRecord.areaAcre} Acre ({(searchedRecord.areaAcre * 0.404686).toFixed(2)} Ha)
                  </td>
                  <td className="border border-slate-300 p-2.5 text-slate-700">
                    {searchedRecord.landType}
                  </td>
                  <td className="border border-slate-300 p-2.5 text-slate-600">
                    {searchedRecord.bhulekhRecord?.encumbrance || 'Nil (Clear Title)'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[11px] text-slate-400 font-mono">
              Certified Digitally Signed Copy Generated via BhoomiSetu Gateway
            </span>
            <button
              onClick={() => window.print()}
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Khatauni RoR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
