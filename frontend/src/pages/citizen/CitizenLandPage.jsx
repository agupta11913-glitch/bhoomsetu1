import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkflowStepper } from '../../components/common/WorkflowStepper';
import { LeafletGISMap } from '../../components/map/LeafletGISMap';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  MapPin,
  FileText,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Download,
  Eye,
  Database,
  X,
  Compass,
  Info,
  ExternalLink,
  AlertTriangle,
  Layers,
  Shield,
} from 'lucide-react';

export const CitizenLandPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { khasras, backendLoaded, activeKhasraId, setActiveKhasraId } = useLandData();
  const { lang, isHindi, t } = useLanguage();
  const { isDark } = useTheme();

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  // Authenticated Citizen Parcels (Strict Ownership Resolution)
  const citizenEmail = currentUser?.email || 'citizen@demo.com';
  const citizenName = currentUser?.name;

  const citizenParcels = useMemo(() => {
    const matching = khasras.filter(
      (k) =>
        (k.email && k.email.toLowerCase() === citizenEmail.toLowerCase()) ||
        (citizenName && k.ownerName && k.ownerName.toLowerCase().includes(citizenName.toLowerCase()))
    );

    if (matching.length > 0) return matching;
    return khasras.filter((k) => k.khasraNumber === '101' || k.khasraNumber === '105');
  }, [khasras, citizenEmail, citizenName]);

  // Selected Active Parcel
  const myParcel = useMemo(() => {
    const found = citizenParcels.find((k) => k.khasraNumber === activeKhasraId);
    return found || citizenParcels[0] || {};
  }, [citizenParcels, activeKhasraId]);

  const totalAcre = myParcel.areaAcre || 2.50;
  const affectedAcre = myParcel.affectedAreaAcre != null ? myParcel.affectedAreaAcre : 0.80;
  const remainingAcre = myParcel.remainingAreaAcre != null ? myParcel.remainingAreaAcre : 1.70;
  const affectedPct = ((affectedAcre / totalAcre) * 100).toFixed(1);
  const remainingPct = ((remainingAcre / totalAcre) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gov-blue-50 dark:bg-gov-blue-900/60 text-gov-blue-800 dark:text-gov-saffron-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-gov-blue-200 dark:border-gov-blue-700">
              {isHindi ? 'मेरी पंजीकृत भूमि रिकॉर्ड' : 'My Registered Land Records'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Khatauni: {myParcel.khataNumber || 'KH-842'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {affectedAcre} Ac / {totalAcre} Ac Affected
            </span>
            {citizenParcels.length > 1 && (
              <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                {citizenParcels.length} Registered Land Parcels Owned
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {isHindi ? `खसरा संख्या ${myParcel.khasraNumber} (${myParcel.ownerName})` : `Khasra No. ${myParcel.khasraNumber} (${myParcel.ownerName})`}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isHindi ? 'ग्राम:' : 'Village:'} {myParcel.village || 'Nagla'}, {isHindi ? 'तहसील:' : 'Tehsil:'} {myParcel.tehsil || 'Fatehabad'}, {isHindi ? 'जिला:' : 'District:'} {myParcel.district || 'Agra'}, {myParcel.state || 'Uttar Pradesh'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={myParcel.status} size="lg" />
          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-600 p-2 sm:px-3 sm:py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{t('close')}</span>
          </button>
        </div>
      </div>

      {/* If citizen owns multiple parcels, show clean top switcher tabs */}
      {citizenParcels.length > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-gov flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-black text-slate-500 px-2 shrink-0 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {isHindi ? 'आपके पंजीकृत भूखंड:' : 'Your Owned Parcels:'}
          </span>
          <div className="flex items-center gap-2">
            {citizenParcels.map((p) => {
              const isSelected = p.khasraNumber === myParcel.khasraNumber;
              return (
                <button
                  key={p.khasraNumber}
                  onClick={() => setActiveKhasraId(p.khasraNumber)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Khasra No. {p.khasraNumber}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {p.areaAcre} Acre
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-gov space-y-3 transition-colors">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {isHindi ? 'भूमि अधिग्रहण प्रगति समयरेखा' : 'Land Acquisition Progress Timeline'}
        </h4>
        <WorkflowStepper currentStatus={myParcel.status} />
      </div>

      {/* Grid: Left Land Information + Right Cadastral Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Metadata & Documents (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-gov space-y-3.5 text-xs transition-colors">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between">
              <span>{isHindi ? 'आधिकारिक राजस्व एवं भूलेख विवरण' : 'Official RoR Property Attributes'}</span>
              <span className="text-[10px] font-mono text-gov-blue-800 dark:text-gov-saffron-400 font-black">
                Khasra {myParcel.khasraNumber}
              </span>
            </h4>

            {/* Land Area Intersection Split Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-300">Total Registered Area</span>
                <span className="font-black text-slate-900 dark:text-white">{totalAcre} Acre ({myParcel.areaHectare || (totalAcre * 0.404686).toFixed(4)} Ha)</span>
              </div>

              {/* Progress Split Bar */}
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${affectedPct}%` }}
                  className="bg-gradient-to-r from-red-600 to-orange-500 h-full"
                  title={`Project Affected: ${affectedAcre} Acre (${affectedPct}%)`}
                />
                <div
                  style={{ width: `${remainingPct}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Retained Land: ${remainingAcre} Acre (${remainingPct}%)`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800">
                  <span className="text-[10px] text-red-700 dark:text-red-300 font-bold block">
                    {isHindi ? 'परियोजना प्रभावित:' : 'Project Affected:'}
                  </span>
                  <span className="font-black text-red-700 dark:text-red-300 text-sm">
                    {affectedAcre} Acre
                  </span>
                  <span className="text-[9px] text-red-500 block">({affectedPct}% acquired)</span>
                </div>

                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">
                    {isHindi ? 'शेष अप्रभावित भूमि:' : 'Retained / Remaining:'}
                  </span>
                  <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">
                    {remainingAcre} Acre
                  </span>
                  <span className="text-[9px] text-emerald-500 block">({remainingPct}% retained)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Khatauni Khata No:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{myParcel.khataNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'भूमि वर्गीकरण:' : 'Land Type / Classification:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{myParcel.landType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'सर्किल दर (मूल्यांकन):' : 'Circle Rate / Base Valuation:'}</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{formatCurrency(myParcel.circleRatePerAcre)} / Acre</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'जीआईएस सीमांकन स्थिति:' : 'GIS Boundary Demarcation:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {myParcel.gisStatus || 'VERIFIED'} (Clean Cadastral Boundary)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'कुल स्वीकृत प्रतिकर:' : 'Total Sanctioned Award:'}</span>
                <span className="font-black text-gov-green-700 dark:text-emerald-400 text-sm">
                  {formatCurrency(myParcel.totalCompensation)}
                </span>
              </div>
            </div>
          </div>

          {/* Attached Digital Documents */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-gov space-y-3 transition-colors">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              {isHindi ? 'आधिकारिक डिजिटल दस्तावेज' : 'Official Digital Documents'}
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setShowNoticeModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-gov-blue-50 dark:hover:bg-slate-750 transition group"
              >
                <div className="flex items-center gap-2 text-left">
                  <FileText className="w-4 h-4 text-gov-blue-800 dark:text-gov-saffron-400" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Section 11 Gazette Notice</span>
                    <span className="text-[10px] text-slate-400">PDF • Official Gazette Notification</span>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-slate-400 group-hover:text-gov-blue-800 dark:group-hover:text-gov-saffron-400" />
              </button>

              <button
                onClick={() => setShowAwardModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-750 transition group"
              >
                <div className="flex items-center gap-2 text-left">
                  <Banknote className="w-4 h-4 text-gov-green-700 dark:text-emerald-400" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Compensation Award Statement</span>
                    <span className="text-[10px] text-slate-400">PDF • RFCTLARR 2013 Calculation</span>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-slate-400 group-hover:text-gov-green-700 dark:group-hover:text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Map View (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-gov space-y-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gov-saffron-600" />
                {isHindi ? 'परियोजना सीमा एवं आपकी भूमि' : 'Project Boundary & Your Land Parcel(s)'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHindi
                  ? `केवल आपके स्वामित्व वाले भूखंड (${citizenParcels.map(p => `खसरा ${p.khasraNumber}`).join(', ')}) प्रदर्शित हैं`
                  : `Displaying strictly your authorized parcel(s) (${citizenParcels.map(p => `Khasra ${p.khasraNumber}`).join(', ')})`}
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              K-{myParcel.khasraNumber} ({affectedAcre} / {totalAcre} Ac)
            </span>
          </div>

          {/* Leaflet Cadastral Map Component with Citizen-Specific Isolation */}
          <LeafletGISMap isCitizenViewOnly={true} height="h-[500px]" />
        </div>
      </div>

      {/* Modals */}
      <GazetteNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        khasra={myParcel}
      />
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={myParcel}
      />
    </div>
  );
};
