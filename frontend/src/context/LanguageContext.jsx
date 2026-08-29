import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, updateUserPreferencesApi } from '../services/auth/authApi';

const LanguageContext = createContext();

export const LANGUAGES = {
  ENGLISH: 'ENGLISH',
  HINDI: 'HINDI',
};

export const translations = {
  ENGLISH: {
    appTitle: 'BHOOMISETU',
    appSubtitle: 'National Land Acquisition & Management System',
    sihTag: 'Smart India Hackathon Prototype',
    govOfIndia: 'Government of India',
    dashboard: 'Dashboard',
    projects: 'Projects',
    landParcels: 'Land Parcels',
    notifications: 'Notifications',
    objections: 'Objections',
    compensation: 'Compensation',
    possession: 'Possession',
    reports: 'Reports',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    search: 'Search',
    searchPlaceholder: 'Search Khasra (e.g. 101), Owner, Case ID...',
    language: 'Language',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    submit: 'Submit',
    approve: 'Approve',
    reject: 'Reject',
    close: 'Close',
    save: 'Save',
    status: 'Status',
    action: 'Action',
    verify: 'Verify',
    verified: 'Verified',
    pending: 'Pending',
    active: 'Active',
    approved: 'Approved',
    rejected: 'Rejected',
    acquired: 'Acquired',
    citizenDashboard: 'Citizen Dashboard',
    myLandRecord: 'My Land Record',
    caseWorkflow: 'Case Workflow',
    officialNotices: 'Official Notices',
    fileObjection: 'File Objection & Proof',
    dbtBankCredit: 'DBT Bank Credit',
    rrBenefits: 'R&R Benefits & Entitlements',
    aiLandAssistant: 'AI Land Assistant',
    profileSettings: 'Profile & Settings',
    fieldCalaDesk: 'Field CALA Desk',
    allCasesLifecycle: 'All Cases Lifecycle',
    cadastralGisMap: 'Cadastral GIS Map',
    bhulekhRorSearch: 'Bhulekh RoR Search',
    groundVerification: 'Ground Verification',
    boundaryDemarcation: 'Boundary Demarcation',
    mismatchHub: 'Mismatch Hub',
    districtMagistrateDesk: 'District Magistrate Desk',
    sec19Sanctions: 'Sec 19 Sanctions',
    objectionHearings: 'Objection Hearings',
    compensationAward: 'Compensation Award',
    stateOversightDesk: 'State Oversight Desk',
    nationalDashboard: 'National Dashboard',
    aiRiskRadar: 'AI Risk Radar',
    adminDashboard: 'Admin Dashboard',
    userDirectory: 'User Directory',
    rolesPermissions: 'Roles & RBAC',
    forensicAuditLogs: 'Forensic Audit Logs',
    switchPersona: 'Switch Active Persona',
    liveGateway: 'Live SIH 2026 Gateway',
    rrEligibilityStatus: 'R&R Eligibility Status',
    housingAssistance: 'Housing Assistance (Rural / Urban)',
    resettlementGrant: 'Resettlement Grant',
    subsistenceAllowance: 'Subsistence Allowance',
    landForLand: 'Land-for-Land Allocation',
    livelihoodSupport: 'Livelihood / Skill Development Support',
    relocationAssistance: 'Relocation & Transport Assistance',
    cattleShedGrant: 'Cattle Shed / Working Shed Grant',
    disbursed: 'Disbursed',
    underVerification: 'Under Verification',
    requestClarification: 'Request Clarification',
  },
  HINDI: {
    appTitle: 'भूमिसेतु',
    appSubtitle: 'राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन प्रणाली',
    sihTag: 'स्मार्ट इंडिया हैकथॉन प्रोटोटाइप',
    govOfIndia: 'भारत सरकार',
    dashboard: 'डैशबोर्ड',
    projects: 'परियोजनाएं',
    landParcels: 'भूमि पार्सल (खसरा)',
    notifications: 'अधिसूचनाएं',
    objections: 'आपत्तियां',
    compensation: 'मुआवजा (प्रतिकर)',
    possession: 'भूमि कब्जा',
    reports: 'रिपोर्ट एवं आंकड़े',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स एवं नीतियां',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    search: 'खोजें',
    searchPlaceholder: 'खसरा (उदा. 101), भूस्वामी, केस आईडी खोजें...',
    language: 'भाषा',
    appearance: 'थीम / दृश्य',
    light: 'लाइट',
    dark: 'डार्क',
    submit: 'जमा करें',
    approve: 'स्वीकृत करें',
    reject: 'अस्वीकृत करें',
    close: 'बंद करें',
    save: 'सहेजें',
    status: 'स्थिति',
    action: 'कार्रवाई',
    verify: 'सत्यापित करें',
    verified: 'सत्यापित',
    pending: 'लंबित',
    active: 'सक्रिय',
    approved: 'स्वीकृत',
    rejected: 'खारिज',
    acquired: 'अधिग्रहित',
    citizenDashboard: 'नागरिक डैशबोर्ड',
    myLandRecord: 'मेरी भूमि का विवरण',
    caseWorkflow: 'केस कार्यप्रवाह',
    officialNotices: 'आधिकारिक नोटिस',
    fileObjection: 'आपत्ति एवं साक्ष्य दर्ज करें',
    dbtBankCredit: 'डीबीटी बैंक भुगतान',
    rrBenefits: 'पुनर्वास एवं पुनर्स्थापन (R&R) लाभ',
    aiLandAssistant: 'एआई भूमि सहायक',
    profileSettings: 'प्रोफ़ाइल एवं सेटिंग्स',
    fieldCalaDesk: 'क्षेत्रीय काला (CALA) पटल',
    allCasesLifecycle: 'समस्त भूमि अधिग्रहण केस',
    cadastralGisMap: 'कडस्ट्रल जीआईएस मानचित्र',
    bhulekhRorSearch: 'भूलेख खतौनी खोज',
    groundVerification: 'धरातलीय सत्यापन',
    boundaryDemarcation: 'सीमा सीमांकन',
    mismatchHub: 'विसंगति निवारण केंद्र',
    districtMagistrateDesk: 'जिला मजिस्ट्रेट पटल',
    sec19Sanctions: 'धारा 19 स्वीकृति',
    objectionHearings: 'आपत्ति सुनवाई',
    compensationAward: 'मुआवजा निर्णय',
    stateOversightDesk: 'राज्य निगरानी पटल',
    nationalDashboard: 'राष्ट्रीय डैशबोर्ड',
    aiRiskRadar: 'एआई जोखिम रडार',
    adminDashboard: 'प्रशासनिक डैशबोर्ड',
    userDirectory: 'उपयोगकर्ता डायरेक्टरी',
    rolesPermissions: 'भूमिका एवं अधिकार (RBAC)',
    forensicAuditLogs: 'फोरेंसिक ऑडिट लॉग्स',
    switchPersona: 'सक्रिय भूमिका बदलें',
    liveGateway: 'लाइव भारत सरकार गेटवे',
    rrEligibilityStatus: 'आर एंड आर पात्रता स्थिति',
    housingAssistance: 'ग्रामीण/शहरी आवास सहायता',
    resettlementGrant: 'पुनर्स्थापन अनुदान',
    subsistenceAllowance: 'निर्वाह भत्ता',
    landForLand: 'भूमि के बदले भूमि आवंटन',
    livelihoodSupport: 'आजीविका एवं कौशल विकास प्रशिक्षण',
    relocationAssistance: 'परिवहन एवं विस्थापन सहायता',
    cattleShedGrant: 'पशु शेड / कार्यशाला अनुदान',
    disbursed: 'भुगतान पूर्ण',
    underVerification: 'सत्यापनाधीन',
    requestClarification: 'स्पष्टीकरण अनुरोध दर्ज करें',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('bhoomisetu_lang');
      return (saved === 'HINDI' || saved === 'hindi') ? 'HINDI' : 'ENGLISH';
    } catch {
      return 'ENGLISH';
    }
  });

  const setLang = useCallback((newLang, persistToBackend = true) => {
    const normalized = (newLang === 'HINDI' || newLang === 'hindi') ? 'HINDI' : 'ENGLISH';
    setLangState(normalized);
    try {
      localStorage.setItem('bhoomisetu_lang', normalized);
    } catch (e) {
      console.warn('Failed to save language in localStorage', e);
    }

    if (persistToBackend && getToken()) {
      updateUserPreferencesApi({ languagePreference: normalized }).catch((err) => {
        console.warn('Backend language sync notice:', err.message);
      });
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLang = lang === 'ENGLISH' ? 'HINDI' : 'ENGLISH';
    setLang(nextLang);
  }, [lang, setLang]);

  const t = useCallback((key) => {
    const dict = translations[lang] || translations.ENGLISH;
    return dict[key] || translations.ENGLISH[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{
      lang,
      language: lang,
      setLang,
      toggleLanguage,
      t,
      isHindi: lang === 'HINDI'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  return ctx || {
    lang: 'ENGLISH',
    language: 'ENGLISH',
    setLang: () => {},
    toggleLanguage: () => {},
    t: (k) => k,
    isHindi: false
  };
};
