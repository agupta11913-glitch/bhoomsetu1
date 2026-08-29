import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Banknote,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Printer,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
  CreditCard,
  Layers,
  FileText,
  MapPin,
  ChevronRight,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  FileCheck,
} from 'lucide-react';

export const CitizenCashWorkflowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { khasras, cases, rrPackages } = useLandData();
  const { lang, isHindi } = useLanguage();
  const { isDark } = useTheme();

  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('BREAKDOWN');

  // Strict citizen-specific land parcel resolution
  const citizenEmail = currentUser?.email || 'citizen@demo.com';
  const citizenName = currentUser?.name || 'Ram Kumar';

  const myParcel = useMemo(() => {
    if (id) {
      const found = khasras.find(
        (k) =>
          k.khasraNumber === id ||
          k.id === id ||
          (k.surveyNumber && String(k.surveyNumber) === String(id))
      );
      if (found) return found;
    }

    const matched = khasras.find(
      (k) =>
        (k.email && k.email.toLowerCase() === citizenEmail.toLowerCase()) ||
        (citizenName && k.ownerName && k.ownerName.toLowerCase().includes(citizenName.toLowerCase())) ||
        k.khasraNumber === '101'
    );

    return (
      matched ||
      khasras[0] || {
        khasraNumber: '101',
        khataNumber: 'KHT-0042',
        areaAcre: 2.50,
        landType: 'Agricultural (Irrigated)',
        status: 'PROPOSED',
        projectName: 'Delhi–Meerut Expressway Expansion (NH-348)',
        totalCompensation: 20000000,
        circleRatePerAcre: 2000000,
        authorityApproved: true,
        paymentStatus: 'DBT Credit Successful',
        paymentDate: '2026-06-20',
        paymentUtr: 'PFMS-2026-99218',
      }
    );
  }, [khasras, id, citizenEmail, citizenName]);

  // Associated case record
  const myCase = useMemo(() => {
    const found = cases.find(
      (c) =>
        c.surveyNumber === myParcel.khasraNumber ||
        c.khasraNumber === myParcel.khasraNumber ||
        c.id === 'CASE-2026-DME-0101'
    );
    return found || cases[0] || null;
  }, [cases, myParcel]);

  // Associated R&R package record
  const myRR = useMemo(() => {
    const found = rrPackages?.find(
      (r) => r.khasraNumber === myParcel.khasraNumber || r.id === 'RR-2026-001'
    );
    return found || null;
  }, [rrPackages, myParcel]);

  // Financial values calculation under RFCTLARR Act 2013
  const areaAcre = myParcel.areaAcre || myCase?.areaAcre || 2.5;
  const circleRate = myParcel.circleRatePerAcre || myCase?.circleRatePerAcre || 2000000;
  const baseLandValue = myCase?.baseCompensation || areaAcre * circleRate * 2.0; // 2.0x Rural factor
  const solatiumValue = myCase?.solatium || baseLandValue; // 100% Solatium
  const interestValue = myCase?.additionalInterest || Math.round(baseLandValue * 0.12); // 12% p.a.
  const rrEntitlementValue = myRR?.totalRRValue || 1211000;
  const totalAward = myParcel.totalCompensation || myCase?.totalCompensation || baseLandValue + solatiumValue;

  // 5-Stage Compensation Cash Workflow Progression
  const workflowStages = [
    {
      id: 'STAGE_1',
      step: 1,
      title: isHindi ? 'भूमि एवं पार्सल सत्यापन' : 'Land & Parcel Verification',
      subtitle: isHindi ? 'राजस्व एवं ईटीएस सीमांकन पूर्ण' : 'RoR & ETS Cadastral Survey Demarcated',
      date: myCase?.approvalHistory?.[1]?.date || '05-Dec-2025',
      completed: true,
      status: 'VERIFIED',
      officer: myCase?.assignedOfficer || 'Sh. Alok Srivastava (Tehsildar)',
    },
    {
      id: 'STAGE_2',
      step: 2,
      title: isHindi ? 'मुआवजा मूल्यांकन (RFCTLARR)' : 'Compensation Assessment',
      subtitle: isHindi ? 'सर्किल दर + 2.0x गुणक + 100% सोलेशियम' : 'Circle Rate × 2.0x Rural Multiplier + 100% Solatium',
      date: '10-Feb-2026',
      completed: true,
      status: 'CALCULATED',
      officer: 'SLAO / CALA Valuation Wing',
    },
    {
      id: 'STAGE_3',
      step: 3,
      title: isHindi ? 'सक्षम प्राधिकारी अवार्ड स्वीकृति' : 'Statutory Award Sanction',
      subtitle: isHindi ? 'धारा 19/23 के तहत जिला मजिस्ट्रेट द्वारा स्वीकृत' : 'Section 19 Sanction by District Magistrate',
      date: myParcel.authorityApproved ? '15-Jun-2026' : 'In Review',
      completed: !!myParcel.authorityApproved,
      status: myParcel.authorityApproved ? 'APPROVED' : 'PENDING_SANCTION',
      officer: 'District Collector & Magistrate, Agra',
    },
    {
      id: 'STAGE_4',
      step: 4,
      title: isHindi ? 'पीएफएमएस इलेक्ट्रॉनिक मैंडेट अनुमोदन' : 'PFMS Payment Mandate Approval',
      subtitle: isHindi ? 'सार्वजनिक वित्तीय प्रबंधन प्रणाली डिजिटल हस्ताक्षर' : 'Public Financial Management System DSC Signed',
      date: myParcel.authorityApproved ? '18-Jun-2026' : 'Pending',
      completed: !!myParcel.authorityApproved,
      status: myParcel.authorityApproved ? 'MANDATE_READY' : 'PENDING',
      officer: 'Chief Accounts Officer & PFMS Nodal',
    },
    {
      id: 'STAGE_5',
      step: 5,
      title: isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT बैंक जमा)' : 'DBT Bank Credit Released',
      subtitle: isHindi ? 'आधार लिंक्ड बैंक खाते में तत्काल अंतरण' : 'Electronic Disbursal via Aadhaar Payment Bridge (APB)',
      date: myParcel.paymentDate ? formatDate(myParcel.paymentDate) : 'Processing',
      completed: myParcel.paymentStatus === 'DBT Credit Successful' || myParcel.paymentStatus === 'PAID',
      status: myParcel.paymentStatus || 'IN_PROCESS',
      officer: 'PFMS RBI Gateway',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Navigation Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
              {isHindi ? 'डीबीटी मुआवजा कार्यप्रवाह' : 'Cash Workflow & PFMS DBT'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {myParcel.projectName || 'Delhi–Meerut Expressway Expansion (NH-348)'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'मुआवजा राशि एवं भुगतान कार्यप्रवाह' : 'Cash Workflow & Direct Compensation Tracker'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {isHindi
              ? 'आपकी अधिग्रहित भूमि (खसरा संख्या ' + myParcel.khasraNumber + ') के लिए 5-चरणीय वैधानिक मुआवजा एवं बैंक हस्तांतरण स्थिति।'
              : 'End-to-end statutory compensation progression, valuation formula audit, and real-time electronic DBT bank settlement tracker for Khasra ' + myParcel.khasraNumber + '.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAwardModal(true)}
            className="bg-gov-green-700 hover:bg-gov-green-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>{isHindi ? 'अवार्ड प्रमाण-पत्र' : 'Award Statement'}</span>
          </button>

          <button
            onClick={() => navigate('/cases/' + (myCase?.id || 'CASE-2026-DME-0101'))}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition"
            title="View Complete 12-Stage Case Lifecycle"
          >
            <FileCheck className="w-4 h-4 text-gov-saffron-400" />
            <span>{isHindi ? 'केस कार्यप्रवाह' : 'Case Workflow'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 text-slate-600 dark:text-slate-200 hover:text-rose-600 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{isHindi ? 'बंद करें' : 'Close'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Banner Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-gov-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/60 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs px-3 py-1 rounded-lg border border-emerald-500/30">
                KHASRA: {myParcel.khasraNumber}
              </span>
              <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-semibold">
                Khata: {myParcel.khataNumber || 'KHT-0042'}
              </span>
              <span className="bg-gov-saffron-500/20 text-gov-saffron-400 text-xs px-2.5 py-1 rounded-lg font-bold border border-gov-saffron-500/30">
                {myParcel.landType || 'Agricultural (Irrigated)'}
              </span>
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 block pt-1">
              {isHindi ? 'कुल स्वीकृत प्रतिकर राशि (RFCTLARR 2013)' : 'Total Net Sanctioned Statutory Award'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatCurrency(totalAward)}
            </h1>
            <p className="text-xs text-slate-300">
              {isHindi ? 'पंजीकृत भूस्वामी:' : 'Awardee / Landowner:'} <strong>{myParcel.ownerName || citizenName}</strong> • {isHindi ? 'प्रभावित क्षेत्र:' : 'Notified Area:'} <strong>{areaAcre} Acre</strong> ({myCase?.areaHectare || '1.01'} Ha)
            </p>
          </div>

          {/* Bank Mandate & PFMS Strip */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 text-xs space-y-2.5 shrink-0 max-w-sm w-full">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <span className="text-[10px] font-extrabold uppercase text-emerald-300">
                {isHindi ? 'डीबीटी बैंक अधिदेश' : 'PFMS Direct Mandate'}
              </span>
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> APB Verified
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">{isHindi ? 'बैंक खाता (आधार लिंक):' : 'Registered Bank A/C:'}</span>
              <p className="font-mono font-extrabold text-white text-sm">
                {myCase?.bankAccount || myParcel.bankAccount || 'SBI - A/C ********8832'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block">{isHindi ? 'भुगतान स्थिति:' : 'Disbursement:'}</span>
                <strong className="text-emerald-400">{myParcel.paymentStatus || 'DBT Credit Successful'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">PFMS UTR:</span>
                <strong className="font-mono text-slate-200">{myParcel.paymentUtr || 'PFMS-2026-99218'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 5-Stage Compensation Cash Workflow Progression Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>{isHindi ? '5-चरणीय मुआवजा एवं रोकड़ संवितरण प्रगति' : '5-Stage Statutory Cash Workflow Progression'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi
                ? 'भूमि अधिग्रहण, पुनर्वास एवं पुनर्व्यवस्थापन में उचित प्रतिकर अधिकार कानून (RFCTLARR 2013)'
                : 'Direct digital tracking under Right to Fair Compensation & Transparency in Land Acquisition (RFCTLARR) Act 2013'}
            </p>
          </div>

          <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 px-3 py-1 rounded-full">
            {myParcel.paymentStatus || 'Active Progression'}
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {workflowStages.map((stage) => (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition ${
                stage.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  Step 0{stage.step}
                </span>
                {stage.completed ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {stage.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] space-y-0.5">
                <span className="font-mono text-slate-500 dark:text-slate-400 block">Date: {stage.date}</span>
                <span className="text-slate-400 dark:text-slate-400 truncate block">Nodal: {stage.officer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        {[
          { id: 'BREAKDOWN', label: isHindi ? 'मुआवजा गणना विश्लेषण' : 'Statutory Valuation Formula' },
          { id: 'BANKING', label: isHindi ? 'बैंक एवं पीएफएमएस विवरण' : 'Banking & PFMS Disbursement' },
          { id: 'RR_BENEFITS', label: isHindi ? 'पुनर्वास एवं पुनर्व्यवस्थापन पैकेज' : 'R&R Entitlements Package' },
          { id: 'PARCEL_LINK', label: isHindi ? 'संबंधित भू-अभिलेख' : 'Linked Land Record (RoR)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition shrink-0 ${
              selectedTab === tab.id
                ? 'bg-gov-blue-900 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. Tab Content Sections */}

      {/* Tab 1: Breakdown */}
      {selectedTab === 'BREAKDOWN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Statutory Breakdown (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Banknote className="w-5 h-5 text-gov-green-700" />
                <span>{isHindi ? 'RFCTLARR कानून 2013 के अनुसार मुआवजा निर्धारण' : 'Statutory RFCTLARR Act 2013 Calculation'}</span>
              </h3>
              <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-gov-blue-900 dark:text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                Formula Audited
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'अधिग्रहित कुल रकबा:' : 'Notified Acquisition Area:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{areaAcre} Acre ({myCase?.areaHectare || '1.01'} Hectare)</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'तहसील सर्किल दर (प्रति एकड़):' : 'District Circle Rate / Acre:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(circleRate)} / Acre</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'मूल बाजारू मूल्य (Base Market Value):' : 'Base Assessed Market Value:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(areaAcre * circleRate)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'ग्रामीण क्षेत्र गुणांक (Rural Multiplier):' : 'Rural Factor Multiplier:'}</span>
                <span className="font-bold text-gov-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                  × 2.0 (UP Rural Corridor Factor)
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? 'गुणांक उपरांत आधार प्रतिकर:' : 'Base Land Value (after Multiplier):'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(baseLandValue)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? '100% सोलेशियम सांत्वना राशि (धारा 30):' : '100% Solatium Grant (Section 30):'}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">+{formatCurrency(solatiumValue)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{isHindi ? '12% वार्षिक अतिरिक्त ब्याज (धारा 30(3)):' : '12% p.a. Additional Interest (Sec 30(3)):'}</span>
                <span className="font-bold text-slate-900 dark:text-white">+{formatCurrency(interestValue)}</span>
              </div>

              <div className="flex justify-between py-3.5 bg-emerald-50 dark:bg-emerald-950/40 px-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-sm">
                <span className="font-black text-emerald-950 dark:text-emerald-200">
                  {isHindi ? 'कुल अंतिम वैधानिक अवार्ड राशि:' : 'Total Net Statutory Sanctioned Award:'}
                </span>
                <span className="font-black text-gov-green-700 dark:text-emerald-400 text-base">
                  {formatCurrency(totalAward)}
                </span>
              </div>
            </div>
          </div>

          {/* Key Actions & Documents Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-3 transition-colors">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gov-blue-900" />
                <span>{isHindi ? 'सत्यापित डिजिटल दस्तावेज' : 'Statutory Valuation Proofs'}</span>
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setShowAwardModal(true)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-750 transition flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Form-11 Award Statement Certificate</span>
                      <span className="text-[10px] text-slate-400">PDF • RFCTLARR Digital Stamp</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>

                <button
                  onClick={() => navigate('/cases/' + (myCase?.id || 'CASE-2026-DME-0101'))}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-gov-blue-800 hover:bg-gov-blue-50/50 dark:hover:bg-slate-750 transition flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-gov-blue-900 dark:text-blue-400 group-hover:scale-110 transition" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Complete 12-Stage Case File</span>
                      <span className="text-[10px] text-slate-400">Gazette, RoR & Hearing Logs</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-gov-blue-900" />
                </button>
              </div>
            </div>

            {/* SLAO Helpdesk Grievance */}
            <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <span className="text-[10px] font-extrabold text-gov-saffron-600 uppercase block">
                {isHindi ? 'मुआवजा सहायता एवं आपत्ति' : 'Compensation Grievance Helpline'}
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {isHindi
                  ? 'यदि मूल्यांकन या बैंक खाते में कोई विसंगति है, तो तत्काल आपत्ति दर्ज करें।'
                  : 'If there is any discrepancy in area calculation or bank account mandate, submit a Section 15 objection.'}
              </p>
              <button
                onClick={() => navigate('/citizen/submit-objection')}
                className="mt-1 w-full bg-gov-saffron-500 hover:bg-gov-saffron-600 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <span>{isHindi ? 'मुआवजा आपत्ति दर्ज करें' : 'File Compensation Claim / Objection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Banking & PFMS */}
      {selectedTab === 'BANKING' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>{isHindi ? 'पीएफएमएस इलेक्ट्रॉनिक संवितरण रिकॉर्ड' : 'PFMS Direct Benefit Electronic Credit Details'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Account & Aadhaar Bridge</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Name & Branch:</span>
                  <span className="font-bold text-slate-900 dark:text-white">State Bank of India (Fatehabad Branch)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">SB-IN-********8832</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IFSC Code:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">SBIN0001428</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aadhaar Payment Bridge (APB):</span>
                  <span className="font-bold text-emerald-600">Active & Seeded</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">PFMS Mandate & Settlement</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">PFMS Batch Mandate ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">PFMS/2026/DME/0101-B7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-400">{myParcel.paymentStatus || 'DBT Credit Successful'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Electronic UTR No:</span>
                  <span className="font-mono font-extrabold text-gov-blue-900 dark:text-blue-300">{myParcel.paymentUtr || 'PFMS-2026-99218'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Credit Date:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{myParcel.paymentDate ? formatDate(myParcel.paymentDate) : '20-Jun-2026'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: R&R Entitlements */}
      {selectedTab === 'RR_BENEFITS' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gov-blue-900" />
              <span>{isHindi ? 'अनुसूची II पुनर्वास एवं पुनर्व्यवस्थापन पैकेज' : 'Schedule II R&R Entitlements Package'}</span>
            </h3>
            <button
              onClick={() => navigate('/citizen/rr-benefits')}
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition"
            >
              {isHindi ? 'विस्तृत R&R देखें' : 'View Full R&R Hub'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Constructed Rural House</span>
              <p className="font-bold text-slate-900 dark:text-white">
                {myRR?.entitlements?.houseAllotment || 'Constructed Rural Housing Unit (50 sq.m) at Sector-4 Nagla Hub'}
              </p>
              <span className="text-emerald-600 font-extrabold text-[11px] block">Unit: {myRR?.houseUnitNumber || 'Nagla-R&R-Plot-14'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Subsistence Grant</span>
              <p className="font-bold text-slate-900 dark:text-white">
                {myRR?.entitlements?.subsistenceGrant || '₹3,000 / month for 12 months (₹36,000 Total)'}
              </p>
              <span className="text-gov-green-700 font-extrabold text-[11px] block">{myRR?.subsistencePaid || '6 / 12 Months Disbursed'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lumpsum Resettlement & Cattle Shed</span>
              <p className="font-bold text-slate-900 dark:text-white">
                {myRR?.entitlements?.resettlementAllowance || '₹50,000 one-time transport & cattle grant'}
              </p>
              <span className="font-black text-slate-900 dark:text-white block">Total R&R Value: {formatCurrency(rrEntitlementValue)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Linked Land Record */}
      {selectedTab === 'PARCEL_LINK' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gov-saffron-600" />
              <span>{isHindi ? 'स्वामित्व वाली पंजीकृत भूमि विवरण' : 'Authorized Cadastral Parcel Details'}</span>
            </h3>
            <button
              onClick={() => navigate('/citizen/my-land')}
              className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition"
            >
              {isHindi ? 'भू-अभिलेख पृष्ठ खोलें' : 'Open My Land Page'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Khasra / Survey Number:</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">{myParcel.khasraNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Khatauni Khata Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{myParcel.khataNumber || 'KHT-0042'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Village & Tehsil:</span>
                <span className="font-bold text-slate-900 dark:text-white">Nagla, Fatehabad (Agra)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Total Holding Area:</span>
                <span className="font-bold text-slate-900 dark:text-white">{areaAcre} Acre</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">GIS Demarcation Status:</span>
                <span className="font-bold text-emerald-600">Verified Cadastral Boundary</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Acquisition Stage:</span>
                <StatusBadge status={myParcel.status || 'PROPOSED'} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Award Statement Modal */}
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={myParcel}
      />
    </div>
  );
};

export default CitizenCashWorkflowPage;
