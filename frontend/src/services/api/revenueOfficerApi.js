// =============================================================================
// BHOOMISETU: Revenue Officer REST API Client
// Connected to Spring Boot Backend (/api/revenue-officer/**)
// =============================================================================

import { getToken } from '../auth/authApi';
import { buildApiUrl } from '../../config/apiConfig';

const API_BASE = buildApiUrl('/revenue-officer');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// 1. Dashboard Statistics
export const fetchRevenueStatsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Revenue stats API error:', err.message);
    return null;
  }
};

// 2. Assigned Cases
export const fetchRevenueCasesApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/cases?${query}` : `${API_BASE}/cases`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Revenue cases API error:', err.message);
    return [];
  }
};

export const fetchRevenueCaseDetailsApi = async (caseId) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Revenue case details ${caseId} API error:`, err.message);
    return null;
  }
};

// 3. Verification Actions
export const saveRevenueVerificationDraftApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/verification`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Save verification draft error for ${caseId}:`, err.message);
    return { success: false, message: err.message };
  }
};

export const submitRevenueVerificationToTehsildarApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/verification/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Submit verification error for ${caseId}:`, err.message);
    return { success: false, message: err.message };
  }
};

// 4. Field Verification Visit
export const recordFieldVerificationApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/field-verification`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Record field verification error for ${caseId}:`, err.message);
    return { success: false, message: err.message };
  }
};

// 5. Document Management
export const fetchCaseDocumentsApi = async (caseId) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/documents`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Fetch documents error for ${caseId}:`, err.message);
    return [];
  }
};

export const updateDocumentStatusApi = async (caseId, docId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(docId)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Update document status error:`, err.message);
    return { success: false, message: err.message };
  }
};

// 6. Citizen Objections
export const fetchRevenueObjectionsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/objections`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Revenue objections API error:', err.message);
    return [];
  }
};

export const submitObjectionFactReportApi = async (objectionId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/objections/${encodeURIComponent(objectionId)}/report`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Submit objection report error:`, err.message);
    return { success: false, message: err.message };
  }
};

// 7. Assigned GIS Map
export const fetchRevenueMapApi = async (village) => {
  try {
    const params = village ? `?village=${encodeURIComponent(village)}` : '';
    const res = await fetch(`${API_BASE}/map${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Revenue map API error:', err.message);
    return null;
  }
};

// 8. Reports & Notifications & Profile
export const fetchRevenueReportsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/reports`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Revenue reports API error:', err.message);
    return null;
  }
};

export const fetchRevenueNotificationsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Revenue notifications API error:', err.message);
    return [];
  }
};

export const fetchRevenueProfileApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Revenue profile API error:', err.message);
    return null;
  }
};
