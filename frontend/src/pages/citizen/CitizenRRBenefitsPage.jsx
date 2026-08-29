import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Building2,
  Home,
  CheckCircle2,
  AlertCircle,
  Clock,
  Banknote,
  FileText,
  HelpCircle,
  Send,
  Download,
  Eye,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Info,
  X,
  Sparkles,
  Filter,
  Check,
  ChevronRight,
  Truck,
  GraduationCap,
  Hammer,
} from 'lucide-react';

export const CitizenRRBenefitsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { khasras, showToast } = useLandData();
  const { lang, t, isHindi } = useLanguage();
  const { isDark } = useTheme();

  // Active PAF Case Details
  const myParcel = khasras.find((k) => k.khasraNumber === '101') || khasras[0] || {};
  const caseId = 'CASE-2026-DME-0101';
  const projectName = myParcel.projectName || 'Delhi–Meerut Expressway Expansion (NH-348)';
  const pafName = myParcel.ownerName ? `${myParcel.ownerName} Family` : 'Sh. Ram Kumar Family';

  // Clarification Modal State
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationSubject, setClarificationSubject] = useState('');
  const [clarificationCategory, setClarificationCategory] = useState('Housing Assistance');
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [clarificationDoc, setClarificationDoc] = useState(null);
  const [submittedRequests, setSubmittedRequests] = useState([
    {
      id: 'REQ-RR-001',
      subject: 'Family Partition & Housing Grant Verification',
      category: 'Housing Assistance',
      date: '12 Feb 2026',
      status: 'UNDER_REVIEW',
      response: 'CALA Field Officer assigned for village site survey on 28 Feb 2026.',
    }
  ]);

  // Document Viewer Modal State
  const [activeDoc, setActiveDoc] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  // 9 Second Schedule R&R Benefits
  const rrBenefitsList = [
    {
      id: 1,
      name: isHindi ? 'ग्रामीण आवास सहायता' : 'Housing Assistance (Rural)',
      type: 'HOUSING',
      icon: Home,
      eligibility: 'ELIGIBLE',
      amountDisplay: isHindi ? 'निर्मित आवास (PMAY-G) / ₹2,50,000' : 'Constructed House (PMAY-G Norms) / ₹2,50,000',
      numericAmount: 250000,
      duration: isHindi ? 'एकमुश्त' : 'One-time',
      status: 'UNDER_VERIFICATION',
      paymentStatus: 'PENDING',
      paymentDate: null,
      utr: null,
      mode: isHindi ? 'PMAY अनुदान / प्रत्यक्ष बैंक अंतरण' : 'PMAY Grant / Direct Credit',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 1',
      remarks: isHindi
        ? 'ग्राम पंचायत नगला में बीडीओ द्वारा आवासीय सत्यापन सर्वेक्षण पूर्ण।'
        : 'Gramin Awas verification survey conducted by BDO Fatehabad.',
    },
    {
      id: 2,
      name: isHindi ? 'पुनर्स्थापन अनुदान' : 'Resettlement Grant',
      type: 'RESETTLEMENT_GRANT',
      icon: Award,
      eligibility: 'ELIGIBLE',
      amountDisplay: '₹50,000',
      numericAmount: 50000,
      duration: isHindi ? 'एकमुश्त' : 'One-time',
      status: 'APPROVED',
      paymentStatus: 'DISBURSED',
      paymentDate: '15 Feb 2026',
      utr: 'PFMS-RR-2026-839201',
      mode: 'DBT (SBI A/C ********8832)',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 7',
      remarks: isHindi
        ? 'सक्षम प्राधिकारी (CALA आगरा) द्वारा स्वीकृत। PFMS के माध्यम से हस्तांतरित।'
        : 'Sanctioned by CALA Agra. Credited directly via PFMS gateway.',
    },
    {
      id: 3,
      name: isHindi ? 'निर्वाह भत्ता (Subsistence Allowance)' : 'Subsistence Allowance',
      type: 'SUBSISTENCE_ALLOWANCE',
      icon: Banknote,
      eligibility: 'ELIGIBLE',
      amountDisplay: isHindi ? '₹3,000 / माह (कुल ₹36,000)' : '₹3,000 / month (₹36,000 Total)',
      numericAmount: 36000,
      duration: isHindi ? '12 माह' : '12 Months',
      status: 'APPROVED',
      paymentStatus: 'DISBURSED',
      paymentDate: '20 Feb 2026',
      utr: 'PFMS-RR-2026-839202',
      mode: 'DBT (SBI A/C ********8832)',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 5',
      remarks: isHindi
        ? 'विस्थापित परिवार के भरण-पोषण हेतु 12 किस्तों का अग्रिम भुगतान सफल।'
        : '12 monthly instalments of ₹3,000 cleared for displaced family sustenance.',
    },
    {
      id: 4,
      name: isHindi ? 'भूमि के बदले भूमि आवंटन' : 'Land-for-Land Allocation',
      type: 'LAND_FOR_LAND',
      icon: Layers,
      eligibility: 'NOT_APPLICABLE',
      amountDisplay: isHindi ? 'लागू नहीं' : 'Not Applicable',
      numericAmount: 0,
      duration: 'N/A',
      status: 'NOT_APPLICABLE',
      paymentStatus: 'NOT_APPLICABLE',
      paymentDate: null,
      utr: null,
      mode: 'N/A',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 2',
      remarks: isHindi
        ? 'इस प्रोटोटाइप परियोजना केस हेतु कोई वैकल्पिक कृषि भूमि आवंटन दर्ज नहीं।'
        : 'No eligible alternative agricultural land entitlement recorded for this prototype case.',
    },
    {
      id: 5,
      name: isHindi ? 'सामग्री एवं ढांचा स्थानांतरण सहायता' : 'One-time Resettlement & Cattle-Shed Assistance',
      type: 'ONE_TIME_ASSISTANCE',
      icon: Hammer,
      eligibility: 'ELIGIBLE',
      amountDisplay: '₹25,000',
      numericAmount: 25000,
      duration: isHindi ? 'एकमुश्त' : 'One-time',
      status: 'APPROVED',
      paymentStatus: 'DISBURSED',
      paymentDate: '18 Feb 2026',
      utr: 'PFMS-RR-2026-839203',
      mode: 'DBT (SBI A/C ********8832)',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 8',
      remarks: isHindi
        ? 'कृषि उपकरण एवं अस्थायी ढांचा हटाने हेतु एकमुश्त अनुदान।'
        : 'Financial grant for dismantling and shifting agricultural implement/cattle shed.',
    },
    {
      id: 6,
      name: isHindi ? 'आजीविका एवं कौशल विकास प्रशिक्षण' : 'Livelihood / Skill Development Support',
      type: 'LIVELIHOOD_SUPPORT',
      icon: GraduationCap,
      eligibility: 'ELIGIBLE',
      amountDisplay: isHindi ? 'व्यावसायिक प्रशिक्षण (PMKVY / NSDC)' : 'Vocational Training (PMKVY / NSDC)',
      numericAmount: 0,
      duration: isHindi ? '6 माह' : '6 Months',
      status: 'ASSIGNED',
      paymentStatus: 'IN_PROCESS',
      paymentDate: '01 Mar 2026',
      utr: 'SD-UP-2026-0918',
      mode: isHindi ? 'संस्थागत प्रायोजन' : 'Institutional Sponsorship',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 4',
      remarks: isHindi
        ? 'नामित: राजेश कुमार (पुत्र) - सोलर टेक्नीशियन एवं कृषि यंत्रीकरण प्रमाणन।'
        : 'Nominated: Rajesh Kumar (Son) for Solar Tech & Agri-Machinery Certification.',
    },
    {
      id: 7,
      name: isHindi ? 'परिवहन एवं विस्थापन सहायता' : 'Relocation & Transport Assistance',
      type: 'RELOCATION_ASSISTANCE',
      icon: Truck,
      eligibility: 'ELIGIBLE',
      amountDisplay: '₹50,000',
      numericAmount: 50000,
      duration: isHindi ? 'एकमुश्त' : 'One-time',
      status: 'APPROVED',
      paymentStatus: 'PENDING',
      paymentDate: null,
      utr: 'PFMS-QUEUE-839204',
      mode: 'DBT / State Bank of India',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 6',
      remarks: isHindi
        ? 'घरेलू सामग्री को पुनर्वास स्थल पर ले जाने हेतु परिवहन भत्ता कतारबद्ध।'
        : 'Transport allowance for shifting household effects to rehabilitation resettlement colony.',
    },
    {
      id: 8,
      name: isHindi ? 'पशु शेड / कार्यशाला निर्माण अनुदान' : 'Cattle Shed / Working Shed Grant',
      type: 'CATTLE_SHED',
      icon: Building2,
      eligibility: 'ELIGIBLE',
      amountDisplay: '₹25,000',
      numericAmount: 25000,
      duration: isHindi ? 'एकमुश्त' : 'One-time',
      status: 'APPROVED',
      paymentStatus: 'PENDING',
      paymentDate: null,
      utr: 'PFMS-QUEUE-839205',
      mode: 'DBT / State Bank of India',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 9',
      remarks: isHindi
        ? 'नगला पुनर्वास क्षेत्र में डेयरी शेड निर्माण हेतु सहायता राशि स्वीकृत।'
        : 'Assistance for constructing rural dairy shed in Nagla rehabilitation zone.',
    },
    {
      id: 9,
      name: isHindi ? 'कारीगर / छोटे व्यापारियों हेतु एकमुश्त अनुदान' : 'One-Time Grant for Petty Traders / Artisans',
      type: 'OTHER_ASSISTANCE',
      icon: Info,
      eligibility: 'NOT_APPLICABLE',
      amountDisplay: isHindi ? 'लागू नहीं' : 'Not Applicable',
      numericAmount: 0,
      duration: 'N/A',
      status: 'NOT_APPLICABLE',
      paymentStatus: 'NOT_APPLICABLE',
      paymentDate: null,
      utr: null,
      mode: 'N/A',
      legalBasis: 'RFCTLARR Act 2013, Second Schedule, Item 10',
      remarks: isHindi
        ? 'केवल गैर-कृषि ग्रामीण दुकानदारों अथवा पारंपरिक कारीगरों हेतु लागू।'
        : 'Applicable only to affected non-agricultural shop owners or village rural artisans.',
    },
  ];

  // Filter Benefits
  const filteredBenefits = rrBenefitsList.filter((b) => {
    if (filterCategory === 'ELIGIBLE') return b.eligibility === 'ELIGIBLE';
    if (filterCategory === 'DISBURSED') return b.paymentStatus === 'DISBURSED';
    if (filterCategory === 'PENDING') return b.paymentStatus === 'PENDING' || b.paymentStatus === 'IN_PROCESS';
    return true;
  });

  // Official R&R Documents List
  const rrDocuments = [
    {
      id: 'RR-ASSESS-2026-0101',
      title: isHindi ? 'आर एंड आर परिवार पात्रता मूल्यांकन रिपोर्ट' : 'R&R Baseline Family Assessment & PAF Verification',
      type: isHindi ? 'मूल्यांकन रिपोर्ट' : 'Assessment Report',
      date: '10 Jan 2026',
      status: 'VERIFIED',
      format: 'PDF',
      size: '1.8 MB',
    },
    {
      id: 'RR-AWARD-SEC-II-0101',
      title: isHindi ? 'द्वितीय अनुसूची सांविधिक अधिकार निर्धारण आदेश' : 'Second Schedule Statutory Entitlement Determination Award',
      type: isHindi ? 'अवार्ड आदेश' : 'Award Order',
      date: '25 Jan 2026',
      status: 'APPROVED',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      id: 'RR-HOUSING-VER-0101',
      title: isHindi ? 'पीएमएवाई ग्रामीण आवास सर्वेक्षण सत्यापन' : 'PMAY Rural / State Gramin Awas Verification Survey',
      type: isHindi ? 'सत्यापन रिपोर्ट' : 'Verification Report',
      date: '05 Feb 2026',
      status: 'UNDER_REVIEW',
      format: 'PDF',
      size: '1.2 MB',
    },
    {
      id: 'PFMS-RR-SANCTION-839',
      title: isHindi ? 'पुनर्स्थापन अनुदान प्रत्यक्ष बैंक भुगतान स्वीकृति' : 'Resettlement Grant PFMS Direct Bank Mandate Order',
      type: isHindi ? 'स्वीकृति आदेश' : 'Sanction Order',
      date: '15 Feb 2026',
      status: 'DISBURSED',
      format: 'PDF',
      size: '950 KB',
    },
    {
      id: 'DBT-ACK-839201',
      title: isHindi ? 'पीएफएमएस डीबीटी भुगतान पावती एवं बैंक रसीद' : 'PFMS Direct Benefit Transfer Payment Acknowledgment',
      type: isHindi ? 'बैंक रसीद' : 'Bank Receipt',
      date: '20 Feb 2026',
      status: 'CREDITED',
      format: 'PDF',
      size: '640 KB',
    },
    {
      id: 'RR-COMPLIANCE-INT-0101',
      title: isHindi ? 'अंतरिम पुनर्वास एवं व्यवस्थापन अनुपालन प्रमाणपत्र' : 'Interim Rehabilitation Compliance & Handover Certificate',
      type: isHindi ? 'सांविधिक प्रमाणपत्र' : 'Statutory Certificate',
      date: '22 Feb 2026',
      status: 'ACTIVE',
      format: 'PDF',
      size: '1.5 MB',
    },
  ];

  // 6-Stage Timeline Steps
  const timelineSteps = [
    { id: 1, name: isHindi ? 'आर एंड आर मूल्यांकन' : 'R&R Assessment', status: 'COMPLETED' },
    { id: 2, name: isHindi ? 'पात्रता सत्यापन' : 'Eligibility Verification', status: 'COMPLETED' },
    { id: 3, name: isHindi ? 'अधिकार स्वीकृति' : 'Entitlement Approval', status: 'COMPLETED' },
    { id: 4, name: isHindi ? 'भुगतान एवं सहायता प्रक्रिया' : 'Payment / Assistance Processing', status: 'CURRENT' },
    { id: 5, name: isHindi ? 'पुनर्वास एवं स्थानांतरण' : 'Relocation / Rehabilitation', status: 'UPCOMING' },
    { id: 6, name: isHindi ? 'आर एंड आर पूर्णता' : 'R&R Completed', status: 'UPCOMING' },
  ];

  const handleClarificationSubmit = (e) => {
    e.preventDefault();
    if (!clarificationSubject.trim() || !clarificationMessage.trim()) {
      showToast('Validation Error', 'Please enter subject and query message.', 'warning');
      return;
    }

    const newReq = {
      id: `REQ-RR-00${submittedRequests.length + 1}`,
      subject: clarificationSubject,
      category: clarificationCategory,
      date: 'Just now',
      status: 'SUBMITTED',
      response: 'Your query has been queued for CALA officer review. Token generated.',
    };

    setSubmittedRequests([newReq, ...submittedRequests]);
    showToast('Clarification Submitted', `Query ${newReq.id} recorded successfully.`, 'success');
    setShowClarificationModal(false);
    setClarificationSubject('');
    setClarificationMessage('');
    setClarificationDoc(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-gov-blue-950 via-gov-blue-900 to-gov-blue-800 dark:from-slate-900 dark:via-slate-850 dark:to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-gov-blue-800/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-gov-saffron-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              {isHindi ? 'द्वितीय अनुसूची लाभ' : 'Second Schedule Entitlements'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {isHindi ? 'प्रोटोटाइप / सिम्युलेटेड डेटा' : 'Prototype / Simulated Data'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isHindi ? 'पुनर्वास एवं पुनर्स्थापन (R&R) लाभ एवं अधिकार' : 'R&R Benefits & Entitlements'}
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {isHindi
              ? 'परियोजना प्रभावित परिवार (PAF) हेतु भूमि अधिग्रहण, पुनर्वासन एवं पुनर्व्यवस्थापन में उचित प्रतिकर और पारदर्शिता का अधिकार अधिनियम (RFCTLARR), 2013 की द्वितीय अनुसूची के अंतर्गत स्वीकृत सांविधिक लाभ।'
              : 'Rehabilitation & Resettlement benefits applicable to the Project Affected Family (PAF) under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (Second Schedule).'}
          </p>
          <p className="text-[11px] text-gov-saffron-300 font-medium">
            Legal Basis: RFCTLARR Act, 2013 – Second Schedule (subject to applicable case/state provisions)
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
          <button
            onClick={() => setShowClarificationModal(true)}
            className="bg-gov-saffron-500 hover:bg-gov-saffron-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-[1.02]"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isHindi ? 'स्पष्टीकरण / दावा अनुरोध दर्ज करें' : 'Request Clarification'}</span>
          </button>
          <button
            onClick={() => navigate('/cases/CASE-2026-DME-0101')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-white/20 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isHindi ? 'केस कार्यप्रवाह देखें' : 'View Full Case Workflow'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Card: PAF & Overall Eligibility */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              {isHindi ? 'परियोजना प्रभावित परिवार (PAF) विवरण' : 'Project Affected Family (PAF) Summary'}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {pafName}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold block">
                {isHindi ? 'समग्र आर एंड आर पात्रता' : 'R&R Eligibility'}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'पात्र (Eligible)' : 'Eligible'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* PAF Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold block">Case ID</span>
            <span className="font-mono font-extrabold text-gov-blue-900 dark:text-gov-saffron-300 truncate block">
              {caseId}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold block">{isHindi ? 'खसरा संख्या' : 'Khasra No.'}</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              Khasra {myParcel.khasraNumber || '101'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold block">{isHindi ? 'ग्राम / तहसील' : 'Village / Tehsil'}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
              {myParcel.village || 'Nagla'}, {myParcel.tehsil || 'Fatehabad'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold block">{isHindi ? 'जिला एवं राज्य' : 'District & State'}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
              {myParcel.district || 'Agra'}, {myParcel.state || 'Uttar Pradesh'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold block">{isHindi ? 'कुल प्रत्यक्ष भुगतान' : 'Total Disbursed'}</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">
              ₹1,11,000
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold block">{isHindi ? 'अधिकार स्थिति' : 'Approved Items'}</span>
            <span className="font-extrabold text-gov-blue-800 dark:text-gov-saffron-400">
              6 / 9 Entitlements
            </span>
          </div>
        </div>
      </div>

      {/* 3. 6-Stage Visual Progress Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-gov-blue-900 dark:text-gov-saffron-400" />
              <span>{isHindi ? 'आर एंड आर सांविधिक प्रगति समयरेखा' : 'R&R Statutory Progress Timeline'}</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isHindi ? 'वर्तमान चरण: भुगतान एवं प्रत्यक्ष सहायता प्रक्रिया' : 'Current Active Stage: Payment & Assistance Processing'}
            </p>
          </div>
          <span className="text-[10px] bg-gov-blue-50 dark:bg-gov-blue-950/80 text-gov-blue-900 dark:text-gov-saffron-300 font-bold px-2.5 py-1 rounded-full border border-gov-blue-200 dark:border-gov-blue-800">
            Stage 4 of 6 Active
          </span>
        </div>

        {/* Timeline Horizontal Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
          {timelineSteps.map((step, idx) => {
            const isCompleted = step.status === 'COMPLETED';
            const isCurrent = step.status === 'CURRENT';
            return (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2 transition ${
                  isCompleted
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                    : isCurrent
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200 ring-2 ring-amber-400/30'
                    : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase">
                    Step {step.id}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping shrink-0" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                  )}
                </div>
                <span className="text-xs font-extrabold leading-tight">
                  {step.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {isCompleted ? '✓ Completed' : isCurrent ? '● In Process' : '○ Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. R&R Entitlements: Cards & Table Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-gov-saffron-500" />
              <span>{isHindi ? 'विस्तृत अधिकार एवं सहायता सूची (9 लाभ)' : 'Statutory Entitlement Breakdown (9 Benefits)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'प्रत्येक लाभ की पात्रता, स्वीकृत राशि, भुगतान स्थिति एवं विधिक संदर्भ' : 'Eligibility, sanctioned amount, disbursement status, and legal basis per entitlement'}
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-700 p-1 rounded-2xl text-xs font-bold">
            {['ALL', 'ELIGIBLE', 'DISBURSED', 'PENDING'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl transition ${
                  filterCategory === cat
                    ? 'bg-white dark:bg-slate-800 text-gov-blue-900 dark:text-gov-saffron-300 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? (isHindi ? 'सभी' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 9 Individual Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBenefits.map((benefit) => {
            const IconComp = benefit.icon || Award;
            const isDisbursed = benefit.paymentStatus === 'DISBURSED';
            const isPending = benefit.paymentStatus === 'PENDING' || benefit.paymentStatus === 'IN_PROCESS';
            const isNA = benefit.eligibility === 'NOT_APPLICABLE';

            return (
              <div
                key={benefit.id}
                className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border shadow-gov flex flex-col justify-between space-y-4 transition-all hover:shadow-gov-md ${
                  isNA
                    ? 'border-slate-200 dark:border-slate-700 opacity-75'
                    : isDisbursed
                    ? 'border-emerald-300 dark:border-emerald-800/60 ring-1 ring-emerald-400/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon + Eligibility Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2.5 rounded-2xl ${
                      isNA
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                        : isDisbursed
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gov-blue-50 dark:bg-gov-blue-950 text-gov-blue-900 dark:text-gov-saffron-300'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        benefit.eligibility === 'ELIGIBLE'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                      }`}>
                        {benefit.eligibility}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        benefit.status === 'APPROVED' || benefit.status === 'ASSIGNED'
                          ? 'bg-gov-blue-50 text-gov-blue-800 dark:bg-slate-700 dark:text-slate-200'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {benefit.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Amount */}
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {benefit.name}
                    </h4>
                    <p className="text-lg font-black text-gov-blue-900 dark:text-gov-saffron-400 mt-1">
                      {benefit.amountDisplay}
                    </p>
                    {benefit.duration && benefit.duration !== 'N/A' && (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        Duration: {benefit.duration}
                      </span>
                    )}
                  </div>

                  {/* Remarks & Legal Basis */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-100 dark:border-slate-700 text-[11px] space-y-1.5">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {benefit.remarks}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 block truncate">
                      {benefit.legalBasis}
                    </span>
                  </div>
                </div>

                {/* Bottom Bar: Payment Status & UTR */}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Payment Status</span>
                    <span className={`font-extrabold ${
                      isDisbursed ? 'text-emerald-600 dark:text-emerald-400' : isNA ? 'text-slate-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {benefit.paymentStatus}
                    </span>
                  </div>

                  {benefit.utr && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">UTR / Sanction</span>
                      <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {benefit.utr}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Compact Comparison Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Layers className="w-4 h-4 text-gov-blue-800 dark:text-gov-saffron-400" />
          <span>{isHindi ? 'आर एंड आर अधिकार सारांश सारणी (Summary Table)' : 'R&R Benefits Summary Matrix'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-750">
                <th className="py-3 px-3">Benefit Entitlement</th>
                <th className="py-3 px-3">Eligibility</th>
                <th className="py-3 px-3">Amount / Benefit</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3">UTR / Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {rrBenefitsList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.eligibility === 'ELIGIBLE'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {item.eligibility}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.amountDisplay}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">
                    {item.status}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-extrabold text-[11px] ${
                      item.paymentStatus === 'DISBURSED'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : item.paymentStatus === 'NOT_APPLICABLE'
                        ? 'text-slate-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {item.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    {item.utr || item.mode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Payment & Disbursement Details Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) एवं भुगतान विवरण' : 'Payment & Disbursement Details (PFMS / DBT)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct Benefit Transfer verified via SBI Bank A/C ********8832 (IFSC: SBIN0001829)
            </p>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
            Aadhaar Linked Account
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300 block">Resettlement Grant</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">₹50,000</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">Status: Disbursed on 15 Feb 2026</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate">UTR: PFMS-RR-2026-839201</span>
          </div>

          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300 block">Subsistence Allowance (12 Mo)</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">₹36,000</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">Status: Disbursed on 20 Feb 2026</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate">UTR: PFMS-RR-2026-839202</span>
          </div>

          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300 block">Cattle Shed & Shifting Grant</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">₹25,000</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">Status: Disbursed on 18 Feb 2026</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate">UTR: PFMS-RR-2026-839203</span>
          </div>
        </div>
      </div>

      {/* 7. Official R&R Documents Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-gov-blue-800 dark:text-gov-saffron-400" />
              <span>{isHindi ? 'आर एंड आर आधिकारिक दस्तावेज एवं प्रमाणपत्र' : 'R&R Official Documents & Certificates'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Digitally signed Second Schedule determination awards and PFMS sanction orders
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-2.5 py-1 rounded-full">
            {rrDocuments.length} Documents Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rrDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-750 flex flex-col justify-between space-y-3 hover:border-gov-blue-600 transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-gov-blue-900 dark:text-gov-saffron-300">{doc.id}</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                    {doc.status}
                  </span>
                </div>
                <h5 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                  {doc.title}
                </h5>
                <p className="text-[10px] text-slate-400">
                  {doc.type} • {doc.date} • {doc.size}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                <button
                  onClick={() => setActiveDoc(doc)}
                  className="flex-1 bg-white dark:bg-slate-800 hover:bg-gov-blue-50 text-gov-blue-900 dark:text-gov-saffron-300 border border-slate-200 dark:border-slate-600 font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => showToast('Downloading Document', `Downloading ${doc.id}.pdf`, 'info')}
                  className="flex-1 bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Citizen Clarification Requests History Trail */}
      {submittedRequests.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-gov space-y-4 transition-colors">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <HelpCircle className="w-4 h-4 text-orange-500" />
            <span>{isHindi ? 'मेरे द्वारा दर्ज स्पष्टीकरण / सहायता अनुरोध' : 'My R&R Clarification & Grievance Trail'}</span>
          </h3>

          <div className="space-y-3">
            {submittedRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gov-blue-900 dark:text-gov-saffron-300">{req.id}</span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                    {req.status}
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{req.subject}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Category: {req.category} • Submitted: {req.date}</p>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px]">
                  <span className="font-bold text-gov-blue-900 dark:text-gov-saffron-400 block mb-0.5">SLAO / CALA Officer Note:</span>
                  <span className="text-slate-700 dark:text-slate-300">{req.response}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Prototype Legal Disclaimer */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gov-saffron-500 font-extrabold text-sm">
          <Info className="w-4 h-4" />
          <span>Statutory Prototype Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Amounts and eligibility shown here are simulated for the SIH 2026 prototype and may vary according to applicable law, rules, project and state provisions. Actual entitlements are subject to applicable laws, rules, project-specific provisions and competent authority decisions under RFCTLARR Act, 2013 Second Schedule.
        </p>
      </div>

      {/* Clarification Request Modal */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-[1200] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gov-saffron-500/10 text-gov-saffron-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-base">
                    {isHindi ? 'आर एंड आर स्पष्टीकरण अनुरोध' : 'Request R&R Clarification'}
                  </h4>
                  <p className="text-[10px] text-slate-400">Case ID: {caseId} • PAF: {pafName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowClarificationModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleClarificationSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Benefit Category</label>
                <select
                  value={clarificationCategory}
                  onChange={(e) => setClarificationCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-gov-blue-800"
                >
                  <option value="Housing Assistance">Housing Assistance (Rural / Urban)</option>
                  <option value="Resettlement Grant">Resettlement Grant (₹50,000)</option>
                  <option value="Subsistence Allowance">Subsistence Allowance (12 Months)</option>
                  <option value="Livelihood Support">Livelihood & Skill Training Nomination</option>
                  <option value="Relocation Allowance">Relocation & Transport Allowance</option>
                  <option value="Cattle Shed Grant">Cattle Shed / Working Shed Grant</option>
                  <option value="Bank Account / PFMS">Bank Account / PFMS DBT Mandate</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Subject / Query Title</label>
                <input
                  type="text"
                  value={clarificationSubject}
                  onChange={(e) => setClarificationSubject(e.target.value)}
                  placeholder="e.g. Discrepancy in family member list for housing grant"
                  className="w-full bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-gov-blue-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Detailed Explanation / Clarification Required</label>
                <textarea
                  rows={4}
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                  placeholder="Explain the specific clarification regarding family composition, entitlement amount, or bank account update..."
                  className="w-full bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-gov-blue-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Upload Supporting Proof / Certificate (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setClarificationDoc(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gov-blue-50 file:text-gov-blue-900 hover:file:bg-gov-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowClarificationModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to SLAO Desk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-[1200] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gov-blue-900 dark:text-gov-saffron-400" />
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-base">{activeDoc.title}</h4>
                  <p className="text-[10px] text-slate-400">Document No: {activeDoc.id}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Issuing Authority:</span>
                <span className="font-bold text-slate-900 dark:text-white">Collector & CALA, Agra District</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Beneficiary PAF:</span>
                <span className="font-bold text-slate-900 dark:text-white">{pafName}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Statutory Act:</span>
                <span className="font-bold text-slate-900 dark:text-white">RFCTLARR Act 2013 (Schedule II)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Digital Signature:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">✓ e-Signed by DM & CALA Agra</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveDoc(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Downloaded', `Downloaded ${activeDoc.id}.pdf`, 'success');
                  setActiveDoc(null);
                }}
                className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
