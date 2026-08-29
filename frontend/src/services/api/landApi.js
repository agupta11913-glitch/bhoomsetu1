// =============================================================================
// BHOOMISETU: Land & Projects REST API Client
// Seamless Spring Boot Backend integration with fallback to rich datasets
// =============================================================================

import { getToken } from '../auth/authApi';

const API_BASE = '/api';

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// 1. Projects APIs
export const fetchProjectsApi = async (state) => {
  try {
    const url = state ? `${API_BASE}/projects?state=${encodeURIComponent(state)}` : `${API_BASE}/projects`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Projects API unavailable, using local store:', err.message);
    return null;
  }
};

export const fetchProjectByIdApi = async (projectId) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Project ${projectId} API unavailable:`, err.message);
    return null;
  }
};

// 2. Land Parcels & Khasras APIs
export const fetchLandsApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/lands?${query}` : `${API_BASE}/lands`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Lands API unavailable, using local store:', err.message);
    return null;
  }
};

export const fetchKhasraByNumberApi = async (khasraNumber) => {
  try {
    const res = await fetch(`${API_BASE}/lands/${khasraNumber}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const verifyRevenueApi = async (khasraNumber, notes) => {
  try {
    const res = await fetch(`${API_BASE}/lands/${khasraNumber}/verify-revenue`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Verify Revenue API fallback:', err.message);
    return null;
  }
};

export const verifyGISApi = async (khasraNumber, notes) => {
  try {
    const res = await fetch(`${API_BASE}/lands/${khasraNumber}/verify-gis`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Verify GIS API fallback:', err.message);
    return null;
  }
};

// 3. Notifications APIs
export const fetchNotificationsApi = async (role, email) => {
  try {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (email) params.append('email', email);
    const query = params.toString();
    const url = query ? `${API_BASE}/notifications?${query}` : `${API_BASE}/notifications`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
};

// 4. Objections APIs
export const submitObjectionApi = async (objectionData) => {
  try {
    const res = await fetch(`${API_BASE}/objections`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(objectionData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Objection submit API fallback:', err.message);
    return null;
  }
};
