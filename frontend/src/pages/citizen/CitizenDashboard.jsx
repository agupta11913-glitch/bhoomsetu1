import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkflowStepper } from '../../components/common/WorkflowStepper';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  Home,
  MapPin,
  FileText,
  MessageSquareWarning,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Eye,
  HelpCircle,
} from 'lucide-react';

import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const CitizenDashboardContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const landData = useLandData() || {};
  const khasras = landData.khasras || [];
  const notices = landData.notices || [];
  const objections = landData.objections || [];
  const { lang } = useLanguage();

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  // Dynamic Citizen Parcel Resolution
  const citizenEmail = currentUser?.email || 'citizen@demo.com';
  const citizenName = currentUser?.name;

  const myParcel = khasras.find(
    (k) =>
      (k.email && k.email.toLowerCase() === citizenEmail.toLowerCase()) ||
      (citizenName && k.ownerName && k.ownerName.toLowerCase().includes(citizenName.toLowerCase())) ||
      k.khasraNumber === '101'
  ) || khasras[0] || {
    khasraNumber: '101',
    khataNumber: 'KH-842',
    areaAcre: 2.50,
    landType: 'Agricultural (Irrigated)',
    status: 'PROPOSED',
    projectName: 'Delhi–Meerut Expressway Expansion (NH-348)',
    totalCompensation: 21600000,
    paymentStatus: 'IN_PROCESS',
  };

  const myNotice = notices.find((n) => n.khasraNumber === myParcel.khasraNumber) || {
    noticeDate: '2026-02-10',
    objectionDeadline: '2026-04-15',
  };

  const myObjection = objections.find((o) => o.khasraNumber === myParcel.khasraNumber);

  return (
    <div className="space-y-6">
      {/* Warm Citizen Portal Header */}
      <div className="bg-gradient-to-r from-gov-blue-950 via-gov-blue-900 to-gov-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-gov-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-gov-saffron-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {lang === 'hi' ? 'नागरिक / भूस्वामी पोर्टल' : 'Citizen & Land Owner Portal'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-300">
              {lang === 'hi' ? 'स्वागत है' : 'Welcome'}, <strong>{currentUser?.name || 'Sh. Ram Kumar'}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === 'hi' ? 'मेरी भूमि अधिग्रहण स्थिति एवं मुआवजा' : 'My Land Acquisition & Compensation Status'}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {lang === 'hi'
              ? 'ग्राम नगला (फतेहाबाद, आगरा) में आपकी खसरा 101 भूमि के अधिग्रहण की पारदर्शी जानकारी एवं डीबीटी मुआवजा स्थिति।'
              : 'Track transparent statutory progression, download official gazette notices, file claims, and verify direct DBT bank compensation for Khasra 101 (Nagla, Agra).'}
          </p>
        </div>

        {/* Quick Contact Helpline */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-xs shrink-0 text-center sm:text-left space-y-1">
          <span className="text-[10px] text-gov-saffron-400 uppercase font-bold block">
            {lang === 'hi' ? 'किसान सहायता हेल्पलाइन' : 'SLAO Helpdesk & Grievance'}
          </span>
          <p className="font-extrabold text-white text-sm">1800-180-2026 (Toll-Free)</p>
          <p className="text-[11px] text-slate-300">Tehsil Office, Fatehabad, Agra</p>
        </div>
      </div>

      {/* 4 Citizen Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: My Land */}
        <div
          onClick={() => navigate('/citizen/my-land')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov hover:shadow-gov-md hover:border-gov-blue-800 transition cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {lang === 'hi' ? 'मेरी पंजीकृत भूमि' : 'My Land Parcel'}
            </span>
            <div className="p-2 rounded-lg bg-gov-blue-50 text-gov-blue-900">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">Khasra {myParcel.khasraNumber}</h3>
          <p className="text-xs text-slate-500">
            {myParcel.areaAcre} Acre ({myParcel.landType})
          </p>
        </div>

        {/* Card 2: Acquisition Status */}
        <div
          onClick={() => navigate('/citizen/acquisition-status')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov hover:shadow-gov-md hover:border-gov-blue-800 transition cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {lang === 'hi' ? 'अधिग्रहण स्थिति' : 'Acquisition Stage'}
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <StatusBadge status={myParcel.status} size="sm" />
          <p className="text-xs text-slate-500">
            {myParcel.projectName}
          </p>
        </div>

        {/* Card 3: Compensation Award */}
        <div
          onClick={() => navigate('/citizen/cash-workflow')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov hover:shadow-gov-md hover:border-gov-blue-800 transition cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {lang === 'hi' ? 'स्वीकृत मुआवजा (Cash Workflow)' : 'Cash Workflow & Compensation'}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-gov-green-700">
            {formatCurrency(myParcel.totalCompensation)}
          </h3>
          <p className="text-xs text-slate-500">
            Status: <strong>{myParcel.paymentStatus}</strong>
          </p>
        </div>

        {/* Card 4: Action Required */}
        <div
          onClick={() => navigate('/citizen/submit-objection')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov hover:shadow-gov-md hover:border-gov-blue-800 transition cursor-pointer space-y-2"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {lang === 'hi' ? 'आपत्तियां एवं दावे' : 'Claims & Objections'}
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {myObjection ? '1 Claim Under Review' : '0 Active Objections'}
          </h3>
          <p className="text-xs text-slate-500">
            {myObjection ? 'Hearing Scheduled' : 'File measurement claim'}
          </p>
        </div>
      </div>

      {/* 10-Step Workflow Progression Stepper for Ram Kumar's Plot */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              {lang === 'hi' ? 'खसरा 101 अधिग्रहण यात्रा एवं प्रगति' : 'Khasra 101 Acquisition Lifecycle Tracker'}
            </h4>
            <p className="text-xs text-slate-500">
              Live tracking under Right to Fair Compensation & Transparency in Land Acquisition (RFCTLARR)
            </p>
          </div>
          <StatusBadge status={myParcel.status} size="md" />
        </div>

        <WorkflowStepper currentStatus={myParcel.status} />
      </div>

      {/* Quick Citizen Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: View Notice */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gov-blue-900 font-extrabold text-sm">
              <FileText className="w-4 h-4 text-gov-saffron-600" />
              <span>Section 11 Gazette Notice</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official statutory preliminary notification published in Government Gazette for Agra-Lucknow Corridor.
            </p>
          </div>
          <button
            onClick={() => setShowNoticeModal(true)}
            className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Download / View Notice</span>
          </button>
        </div>

        {/* Action 2: File Objection */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <MessageSquareWarning className="w-4 h-4 text-orange-600" />
              <span>Submit Land Claim / Objection</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit boundary measurement discrepancies, commercial valuation proofs, or joint-family partition certificates.
            </p>
          </div>
          <button
            onClick={() => navigate('/citizen/submit-objection')}
            className="w-full bg-gov-saffron-600 hover:bg-gov-saffron-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>{myObjection ? 'View My Objection (OBJ-001)' : 'File New Objection'}</span>
          </button>
        </div>

        {/* Action 3: Compensation DBT */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gov-green-900 font-extrabold text-sm">
              <Banknote className="w-4 h-4 text-gov-green-700" />
              <span>Direct Benefit Transfer (DBT)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify your registered bank account (SBI A/C ********8832) and track PFMS compensation mandate.
            </p>
          </div>
          <button
            onClick={() => navigate('/citizen/cash-workflow')}
            className="w-full bg-gov-green-700 hover:bg-gov-green-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'मुआवजा रोकड़ कार्यप्रवाह देखें' : 'Track Cash Workflow / DBT'}</span>
          </button>
        </div>
      </div>

      {/* Gazette Notice Modal */}
      <GazetteNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        khasra={myParcel}
      />

      {/* Compensation Award Modal */}
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={myParcel}
      />
    </div>
  );
};

export const CitizenDashboard = () => (
  <ErrorBoundary fallbackTitle="Citizen Dashboard Error">
    <CitizenDashboardContent />
  </ErrorBoundary>
);

export default CitizenDashboard;
