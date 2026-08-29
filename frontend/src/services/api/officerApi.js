// Unified Officer Portal REST API Service for Tehsildar & Executive Officer
import { getToken } from '../auth/authApi';
import { buildApiUrl } from '../../config/apiConfig';

const API_BASE = buildApiUrl('/officer');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchOfficerDashboardApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Officer dashboard API error:', err.message);
    return null;
  }
};

export const fetchOfficerCasesApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/cases?${query}` : `${API_BASE}/cases`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Officer cases API error:', err.message);
    return [];
  }
};

export const fetchOfficerCaseDetailsApi = async (caseId) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Officer case details API error (${caseId}):`, err.message);
    return null;
  }
};

export const approveOfficerCaseApi = async (caseId, remarks) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ remarks }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Approve case API error:', err.message);
    throw err;
  }
};

export const rejectOfficerCaseApi = async (caseId, reason) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Reject case API error:', err.message);
    throw err;
  }
};

export const sendBackOfficerCaseApi = async (caseId, remarks) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/send-back`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ remarks }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Send back case API error:', err.message);
    throw err;
  }
};

export const fetchOfficerProjectsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Officer projects API error:', err.message);
    return [];
  }
};

export const fetchOfficerIssuesApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/issues`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Officer issues API error:', err.message);
    return [];
  }
};

export const createOfficerIssueApi = async (issueData) => {
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(issueData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Create issue API error:', err.message);
    throw err;
  }
};

export const fetchOfficerGisHierarchyApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/gis/hierarchy`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('GIS hierarchy API error:', err.message);
    return null;
  }
};

export const fetchOfficerVillageStatsApi = async (villageName) => {
  try {
    const res = await fetch(`${API_BASE}/gis/village/${encodeURIComponent(villageName)}/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Village stats API error (${villageName}):`, err.message);
    return null;
  }
};
