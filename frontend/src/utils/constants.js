// BhoomiSetu - Statutory Roles Definition (SIH 2026 Aligned)
export const ROLES = {
  CITIZEN: 'CITIZEN',                     // Citizen / Land Owner
  TEHSILDAR: 'TEHSILDAR',                 // Tehsildar & Executive Officer
  EXECUTIVE_OFFICER: 'EXECUTIVE_OFFICER', // Executive Officer / Project Agency Lead
  EXECUTIVE: 'EXECUTIVE_OFFICER',         // Alias
  GOVERNMENT_OFFICER: 'GOVERNMENT_OFFICER', // Government Officer / Field CALA
  REVENUE_OFFICER: 'GOVERNMENT_OFFICER',  // Alias
  FIELD_OFFICER: 'GOVERNMENT_OFFICER',   // Legacy alias
  DISTRICT_AUTHORITY: 'DISTRICT_AUTHORITY', // District Authority (DM / Collector)
  DISTRICT_MAGISTRATE: 'DISTRICT_AUTHORITY', // DM alias
  DISTRICT_OFFICER: 'DISTRICT_AUTHORITY', // Legacy alias
  STATE_GOVERNMENT: 'STATE_GOVERNMENT',   // State Government / Revenue Dept
  STATE_OFFICER: 'STATE_GOVERNMENT',     // Legacy alias
  CENTRAL_MINISTRY: 'CENTRAL_MINISTRY',   // Central Ministry / PM Gati Shakti
  CENTRAL_OFFICER: 'CENTRAL_MINISTRY',   // Legacy alias
  PROJECT_AGENCY: 'PROJECT_AGENCY',       // Project Implementing Agency (NHAI/Railways)
  ACQUISITION_OFFICER: 'PROJECT_AGENCY',  // Legacy alias
  ADMIN: 'ADMIN',                         // System Governance Admin
  GIS_OFFICER: 'GOVERNMENT_OFFICER',
  APPROVING_AUTHORITY: 'DISTRICT_AUTHORITY',
};

export const REGISTRATION_STATUS = {
  PENDING: 'PENDING',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
};

export const ROLE_DETAILS = {
  [ROLES.CITIZEN]: {
    name: 'Sh. Ram Kumar',
    roleKey: 'CITIZEN',
    title: 'Citizen / Land Owner',
    badge: 'Land Owner (Nagla, Agra)',
    email: 'owner@example.com',
    department: 'Citizen & Land Owner Services',
    jurisdiction: 'Khasra 101, Nagla Village, Fatehabad Tehsil, Agra',
    description: 'Track land acquisition progress, view published Section 11 notices, file objection claims, inspect compensation award calculations, and monitor DBT bank credits.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'gov-saffron',
  },
  [ROLES.TEHSILDAR]: {
    name: 'Sh. Alok Srivastava',
    roleKey: 'TEHSILDAR',
    title: 'Tehsildar & Executive Officer',
    badge: 'Tehsildar (Fatehabad, Agra)',
    email: 'tehsildar@demo.gov.in',
    department: 'Revenue & Land Records Department, Uttar Pradesh',
    jurisdiction: 'Fatehabad Tehsil, District Agra, UP',
    description: 'Statutory verification oversight, land acquisition review, objection processing under Section 15, compensation & R&R clearance, and cadastral demarcation.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'gov-blue',
  },
  [ROLES.EXECUTIVE_OFFICER]: {
    name: 'Sh. Rajesh Verma',
    roleKey: 'EXECUTIVE_OFFICER',
    title: 'Executive Officer / Project Lead',
    badge: 'Executive Director & Project CALA',
    email: 'executive@demo.gov.in',
    department: 'National Highways Authority of India (NHAI)',
    jurisdiction: 'Delhi-Meerut & Agra Corridor Expansion Unit',
    description: 'Corridor planning, corridor boundary demarcation, acquisition requisitions, and contractor site possession handovers.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'cyan',
  },
  [ROLES.GOVERNMENT_OFFICER]: {
    name: 'Sh. Alok Srivastava',
    roleKey: 'GOVERNMENT_OFFICER',
    title: 'Government Officer / CALA',
    badge: 'Revenue Inspector & Field Verification Officer',
    email: 'field.officer@bhoomisetu.gov.in',
    department: 'Revenue & Land Records Department, Uttar Pradesh',
    jurisdiction: 'Fatehabad Tehsil / Agra Corridor Division',
    description: 'Ground-truthing of RoR cadastral records, physical boundary demarcation, crop/structure valuation verification, and Section 15 objection investigation.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'gov-blue',
  },
  [ROLES.DISTRICT_AUTHORITY]: {
    name: 'Dr. Sunita Murthy, IAS',
    roleKey: 'DISTRICT_AUTHORITY',
    title: 'District Magistrate & Collector (CALA)',
    badge: 'District Magistrate & Competent Authority (CALA)',
    email: 'district.officer@bhoomisetu.gov.in',
    department: 'Office of the District Magistrate & Collector, Agra',
    jurisdiction: 'District Agra, Uttar Pradesh',
    description: 'Statutory Section 19 declaration sanctions, compensation award approval under RFCTLARR Act 2013, objection hearing quasi-judicial orders, and PFMS disbursement authorization.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'purple',
  },
  [ROLES.STATE_GOVERNMENT]: {
    name: 'Sh. Sanjeev Khare, IAS',
    roleKey: 'STATE_GOVERNMENT',
    title: 'State Government (Revenue & Infrastructure)',
    badge: 'Principal Secretary, Revenue & Infrastructure',
    email: 'state.officer@bhoomisetu.gov.in',
    department: 'Department of Revenue & Land Reforms, Govt. of Uttar Pradesh',
    jurisdiction: 'State of Uttar Pradesh (All 75 Districts)',
    description: 'State-level multi-district corridor monitoring, inter-district bottleneck resolution, Bhulekh server sync management, and state acquisition policy oversight.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'indigo',
  },
  [ROLES.CENTRAL_MINISTRY]: {
    name: 'Dr. Arvind Meena, IAS',
    roleKey: 'CENTRAL_MINISTRY',
    title: 'Central Ministry (PM Gati Shakti / MoRTH)',
    badge: 'Joint Secretary, PM Gati Shakti & MoRTH',
    email: 'central.officer@bhoomisetu.gov.in',
    department: 'Cabinet Secretariat & DPIIT, Government of India',
    jurisdiction: 'National Level (All States & Union Territories)',
    description: 'National corridor oversight, inter-state highway & freight corridor tracking, central budget allocation, state performance benchmarking, and AI delay forecasting.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'gov-green',
  },
  [ROLES.PROJECT_AGENCY]: {
    name: 'Sh. Rajesh Verma',
    roleKey: 'PROJECT_AGENCY',
    title: 'Project Implementing Agency (NHAI / NHSRCL)',
    badge: 'Chief Project Director, NHAI Expressways',
    email: 'agency@bhoomisetu.gov.in',
    department: 'National Highways Authority of India (NHAI)',
    jurisdiction: 'Delhi-Meerut & Agra Corridor Expansion Unit',
    description: 'Project proposal initiation, alignment identification, parcel requisitioning, contractor possession handover, and Rehabilitation & Resettlement (R&R) monitoring.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'cyan',
  },
  [ROLES.ADMIN]: {
    name: 'Administrator',
    roleKey: 'ADMIN',
    title: 'System Administrator',
    badge: 'NICNET IAM & Governance Lead',
    email: 'admin@bhoomisetu.gov.in',
    department: 'National Informatics Centre (NIC) & BhoomiSetu Platform Admin',
    jurisdiction: 'Central System Infrastructure',
    description: 'Role-Based Access Control (RBAC), officer account provisioning, registration approvals, immutable forensic event ledger, and simulated government API microservices mesh gateway.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    primaryColor: 'slate',
  },
};

// Department Options for Government Officers
export const OFFICER_DEPARTMENTS = [
  'District Authority / Collectorate',
  'Revenue Department (Bhulekh / Tehsildar)',
  'Land Acquisition Department (CALA / SLAO)',
  'Public Works Department (PWD)',
  'National Highways Authority of India (NHAI)',
  'Indian Railways / DFCCIL',
  'Irrigation & Water Resources Department',
  'Urban Development & Housing Authority',
  'Forest & Environment Department',
  'Other Statutory Department',
];

// Organization Types for Project Implementing Agencies
export const AGENCY_ORG_TYPES = [
  'National Highways Authority of India (NHAI)',
  'Ministry of Railways / DFCCIL / NHSRCL',
  'State Public Works Department (State PWD)',
  'Irrigation & Flood Control Department',
  'State Industrial Development Authority (e.g. UPSIDA/MIDC)',
  'Urban Development & Housing Authority (e.g. DDA/ADA/MMRDA)',
  'Renewable Energy Development Agency (SECI/State REDA)',
  'Port & Inland Waterways Authority (IWAI)',
  'Airport Authority of India (AAI / State Aviation)',
  'Other Authorized Government Agency',
];

// Authority Categories
export const AUTHORITY_TYPES = [
  { id: 'DISTRICT', label: 'District Authority (DM / Collector / CALA)', targetRole: ROLES.DISTRICT_AUTHORITY },
  { id: 'STATE', label: 'State Government (Revenue & Infrastructure Department)', targetRole: ROLES.STATE_GOVERNMENT },
  { id: 'CENTRAL', label: 'Central Ministry (PM Gati Shakti / MoRTH / Railways)', targetRole: ROLES.CENTRAL_MINISTRY },
];

export const INDIAN_STATES = [
  'Uttar Pradesh',
  'Maharashtra',
  'Gujarat',
  'Haryana',
  'Tamil Nadu',
  'Bihar',
  'Karnataka',
  'Madhya Pradesh',
  'Rajasthan',
  'Andhra Pradesh',
  'Punjab',
  'West Bengal',
  'Odisha',
  'Delhi (NCT)',
];

export const DISTRICTS_BY_STATE = {
  'Uttar Pradesh': ['Agra', 'Meerut', 'Lucknow', 'Varanasi', 'Kanpur', 'Prayagraj', 'Ghaziabad', 'Gautam Buddha Nagar', 'Mathura', 'Aligarh'],
  'Maharashtra': ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Haryana': ['Gurugram', 'Faridabad', 'Sonipat', 'Panipat', 'Ambala', 'Rohtak'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  'Karnataka': ['Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi'],
  'Delhi (NCT)': ['New Delhi', 'Central Delhi', 'East Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
};

// 12-Stage Complete Land Acquisition Lifecycle (RFCTLARR Act 2013 Aligned)
export const CASE_WORKFLOW_STAGES = [
  { id: 'PROPOSAL', label: 'Project Proposal', step: 1, color: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500' },
  { id: 'LAND_IDENTIFICATION', label: 'Land Identification', step: 2, color: 'bg-cyan-100 text-cyan-800 border-cyan-300', dot: 'bg-cyan-500' },
  { id: 'PARCEL_SELECTION', label: 'Parcel Selection', step: 3, color: 'bg-indigo-100 text-indigo-800 border-indigo-300', dot: 'bg-indigo-500' },
  { id: 'OWNERSHIP_VERIFICATION', label: 'Ownership Verification', step: 4, color: 'bg-violet-100 text-violet-800 border-violet-300', dot: 'bg-violet-500' },
  { id: 'FIELD_VERIFICATION', label: 'Field Verification', step: 5, color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  { id: 'PUBLIC_NOTIFICATION', label: 'Public Notification (Sec 11)', step: 6, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500' },
  { id: 'OBJECTION_CLAIM', label: 'Objection / Claim (Sec 15)', step: 7, color: 'bg-orange-100 text-orange-800 border-orange-300', dot: 'bg-orange-500' },
  { id: 'COMPENSATION_ASSESSMENT', label: 'Compensation Assessment', step: 8, color: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500' },
  { id: 'AWARD_DECLARATION', label: 'Award Declaration (Sec 19/23)', step: 9, color: 'bg-pink-100 text-pink-800 border-pink-300', dot: 'bg-pink-500' },
  { id: 'COMPENSATION_PAYMENT', label: 'Compensation Payment (DBT)', step: 10, color: 'bg-teal-100 text-teal-800 border-teal-300', dot: 'bg-teal-500' },
  { id: 'POSSESSION', label: 'Possession (Sec 38/40)', step: 11, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
  { id: 'RR_MONITORING', label: 'Rehabilitation & Resettlement', step: 12, color: 'bg-lime-100 text-lime-800 border-lime-300', dot: 'bg-lime-500' },
  { id: 'COMPLETED', label: 'Completed (Vested)', step: 13, color: 'bg-green-700 text-white border-green-800', dot: 'bg-white' },
];

export const WORKFLOW_STAGES = CASE_WORKFLOW_STAGES;

// GIS Land Parcel Status Color Coding (Exact Specification)
export const GIS_STATUS_COLORS = {
  ACQUIRED: {
    label: 'Acquired',
    colorHex: '#15803d', // Green
    fillColor: '#22c55e',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dotClass: 'bg-emerald-600',
    desc: 'Legally mutated & in government possession',
  },
  UNDER_VERIFICATION: {
    label: 'Under Verification',
    colorHex: '#ca8a04', // Yellow / Amber
    fillColor: '#eab308',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    dotClass: 'bg-amber-500',
    desc: 'Joint revenue ground survey & title checking active',
  },
  DISPUTED: {
    label: 'Disputed / Objection',
    colorHex: '#dc2626', // Red
    fillColor: '#ef4444',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    dotClass: 'bg-rose-600',
    desc: 'Citizen objection or title discrepancy flagged',
  },
  PROPOSED: {
    label: 'Proposed / Identified',
    colorHex: '#2563eb', // Blue
    fillColor: '#3b82f6',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    dotClass: 'bg-blue-600',
    desc: 'Identified within proposed corridor Right of Way (ROW)',
  },
  COMPENSATION_PENDING: {
    label: 'Compensation Pending',
    colorHex: '#ea580c', // Orange
    fillColor: '#f97316',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    dotClass: 'bg-orange-500',
    desc: 'Award determined, awaiting PFMS DBT credit to bank',
  },
};

export const STATUS_COLORS = {
  IDENTIFIED: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', dot: 'bg-blue-500', hex: '#3b82f6' },
  REVENUE_VERIFIED: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300', dot: 'bg-indigo-500', hex: '#6366f1' },
  GIS_VERIFIED: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-300', dot: 'bg-cyan-500', hex: '#06b6d4' },
  SELECTED: { bg: 'bg-violet-50', text: 'text-violet-800', border: 'border-violet-300', dot: 'bg-violet-500', hex: '#8b5cf6' },
  NOTICE_ISSUED: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', dot: 'bg-yellow-500', hex: '#eab308' },
  OBJECTION_PERIOD: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300', dot: 'bg-orange-500', hex: '#f97316' },
  APPROVED: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', dot: 'bg-purple-500', hex: '#a855f7' },
  COMPENSATION_CALCULATED: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-300', dot: 'bg-pink-500', hex: '#ec4899' },
  COMPENSATION_PAID: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-300', dot: 'bg-teal-500', hex: '#14b8a6' },
  ACQUIRED: { bg: 'bg-green-700', text: 'text-white', border: 'border-green-800', dot: 'bg-white', hex: '#15803d' },
  BOUNDARY_ISSUE: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', dot: 'bg-red-500', hex: '#ef4444' },
  MISMATCH_FLAGGED: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300', dot: 'bg-rose-500', hex: '#f43f5e' },
};

export const PROTOTYPE_DISCLAIMER = `Prototype Notice: BhoomiSetu is an AI-powered prototype built for the Smart India Hackathon (SIH 2026). Bhulekh land data, GIS parcel geometries, government REST APIs, AI risk predictions, and PFMS payment disbursements shown in this demonstration are simulated for testing and evaluation purposes.`;

// District Administration RBAC Permission Constants
export const DISTRICT_PERMISSIONS = {
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_PROJECTS: 'VIEW_PROJECTS',
  EDIT_PROJECT: 'EDIT_PROJECT',
  VIEW_ACQUISITION: 'VIEW_ACQUISITION',
  UPDATE_ACQUISITION: 'UPDATE_ACQUISITION',
  VIEW_GIS: 'VIEW_GIS',
  VIEW_LAND: 'VIEW_LAND',
  ADD_LAND_REMARK: 'ADD_LAND_REMARK',
  VIEW_DISPUTES: 'VIEW_DISPUTES',
  REVIEW_DISPUTE: 'REVIEW_DISPUTE',
  VIEW_COMPENSATION: 'VIEW_COMPENSATION',
  UPDATE_COMPENSATION: 'UPDATE_COMPENSATION',
  VIEW_R_AND_R: 'VIEW_R_AND_R',
  UPDATE_R_AND_R: 'UPDATE_R_AND_R',
  VIEW_OFFICERS: 'VIEW_OFFICERS',
  VIEW_COORDINATION: 'VIEW_COORDINATION',
  MANAGE_COORDINATION: 'MANAGE_COORDINATION',
  VIEW_ESCALATIONS: 'VIEW_ESCALATIONS',
  MANAGE_ESCALATIONS: 'MANAGE_ESCALATIONS',
  VIEW_DELAYED_CASES: 'VIEW_DELAYED_CASES',
  VIEW_DELAYED: 'VIEW_DELAYED_CASES',
  MANAGE_DELAYED: 'ACTION_DELAYED_CASES',
  ACTION_DELAYED_CASES: 'ACTION_DELAYED_CASES',
  VIEW_REPORTS: 'VIEW_REPORTS',
  GENERATE_REPORTS: 'GENERATE_REPORTS',
  VIEW_DOCUMENTS: 'VIEW_DOCUMENTS',
  UPLOAD_DOCUMENTS: 'UPLOAD_DOCUMENTS',
  VIEW_NOTIFICATIONS: 'VIEW_NOTIFICATIONS',
};

export const ROLE_PERMISSIONS = {
  DISTRICT_MAGISTRATE: [
    'VIEW_DASHBOARD', 'VIEW_PROJECTS', 'EDIT_PROJECT', 'VIEW_ACQUISITION', 'UPDATE_ACQUISITION',
    'VIEW_GIS', 'VIEW_LAND', 'ADD_LAND_REMARK', 'VIEW_DISPUTES', 'REVIEW_DISPUTE',
    'VIEW_COMPENSATION', 'UPDATE_COMPENSATION', 'VIEW_R_AND_R', 'UPDATE_R_AND_R',
    'VIEW_OFFICERS', 'VIEW_COORDINATION', 'MANAGE_COORDINATION', 'VIEW_ESCALATIONS', 'MANAGE_ESCALATIONS',
    'VIEW_DELAYED_CASES', 'VIEW_DELAYED', 'MANAGE_DELAYED', 'ACTION_DELAYED_CASES', 'VIEW_REPORTS', 'GENERATE_REPORTS',
    'VIEW_DOCUMENTS', 'UPLOAD_DOCUMENTS', 'VIEW_NOTIFICATIONS'
  ],
  DISTRICT_AUTHORITY: [
    'VIEW_DASHBOARD', 'VIEW_PROJECTS', 'EDIT_PROJECT', 'VIEW_ACQUISITION', 'UPDATE_ACQUISITION',
    'VIEW_GIS', 'VIEW_LAND', 'ADD_LAND_REMARK', 'VIEW_DISPUTES', 'REVIEW_DISPUTE',
    'VIEW_COMPENSATION', 'UPDATE_COMPENSATION', 'VIEW_R_AND_R', 'UPDATE_R_AND_R',
    'VIEW_OFFICERS', 'VIEW_COORDINATION', 'MANAGE_COORDINATION', 'VIEW_ESCALATIONS', 'MANAGE_ESCALATIONS',
    'VIEW_DELAYED_CASES', 'VIEW_DELAYED', 'MANAGE_DELAYED', 'ACTION_DELAYED_CASES', 'VIEW_REPORTS', 'GENERATE_REPORTS',
    'VIEW_DOCUMENTS', 'UPLOAD_DOCUMENTS', 'VIEW_NOTIFICATIONS'
  ],
  DISTRICT_OFFICER: [
    'VIEW_DASHBOARD', 'VIEW_PROJECTS', 'VIEW_ACQUISITION', 'VIEW_GIS', 'VIEW_LAND',
    'ADD_LAND_REMARK', 'VIEW_DISPUTES', 'VIEW_DELAYED_CASES', 'VIEW_DELAYED', 'VIEW_ESCALATIONS', 'VIEW_REPORTS', 'VIEW_DOCUMENTS', 'VIEW_NOTIFICATIONS'
  ],
  ADMIN: [
    'VIEW_DASHBOARD', 'VIEW_PROJECTS', 'EDIT_PROJECT', 'VIEW_ACQUISITION', 'UPDATE_ACQUISITION',
    'VIEW_GIS', 'VIEW_LAND', 'ADD_LAND_REMARK', 'VIEW_DISPUTES', 'REVIEW_DISPUTE',
    'VIEW_COMPENSATION', 'UPDATE_COMPENSATION', 'VIEW_R_AND_R', 'UPDATE_R_AND_R',
    'VIEW_OFFICERS', 'VIEW_COORDINATION', 'MANAGE_COORDINATION', 'VIEW_ESCALATIONS', 'MANAGE_ESCALATIONS',
    'VIEW_DELAYED_CASES', 'VIEW_DELAYED', 'MANAGE_DELAYED', 'ACTION_DELAYED_CASES', 'VIEW_REPORTS', 'GENERATE_REPORTS',
    'VIEW_DOCUMENTS', 'UPLOAD_DOCUMENTS', 'VIEW_NOTIFICATIONS'
  ]
};

export const hasPermission = (permission, user) => {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  const defaultPerms = ROLE_PERMISSIONS[user.role] || [];
  return defaultPerms.includes(permission);
};

