// =============================================================================
// BHOOMISETU: Tehsildar REST API Client
// Connected to Spring Boot Backend (/api/tehsildar/**)
// =============================================================================

import { getToken } from '../auth/authApi';
import { buildApiUrl } from '../../config/apiConfig';

const API_BASE = buildApiUrl('/tehsildar');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// 1. Dashboard Statistics
export const fetchTehsildarStatsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar stats API error:', err.message);
    return null;
  }
};

// 2. Acquisition Cases
export const fetchTehsildarCasesApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/cases?${query}` : `${API_BASE}/cases`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar cases API error:', err.message);
    return null;
  }
};

export const fetchTehsildarCaseByIdApi = async (caseId) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Tehsildar case ${caseId} API error:`, err.message);
    return null;
  }
};

// 3. Verification Workflow Actions
export const approveTehsildarCaseApi = async (caseId, remarks) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ remarks })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Approve case ${caseId} error:`, err.message);
    throw err;
  }
};

export const rejectTehsildarCaseApi = async (caseId, reason) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Reject case ${caseId} error:`, err.message);
    throw err;
  }
};

export const sendBackTehsildarCaseApi = async (caseId, remarks) => {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/send-back`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ remarks })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Send back case ${caseId} error:`, err.message);
    throw err;
  }
};

// 4. Citizen Objections
export const fetchTehsildarObjectionsApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/objections?${query}` : `${API_BASE}/objections`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar objections API error:', err.message);
    return null;
  }
};

export const actOnTehsildarObjectionApi = async (objectionId, action, remarks) => {
  try {
    const res = await fetch(`${API_BASE}/objections/${encodeURIComponent(objectionId)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action, remarks })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Act on objection ${objectionId} error:`, err.message);
    throw err;
  }
};

// 5. Compensation & R&R
export const fetchTehsildarCompensationApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/compensation`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar compensation API error:', err.message);
    return null;
  }
};

export const fetchTehsildarRRBenefitsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/r-and-r`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar R&R API error:', err.message);
    return null;
  }
};

// 6. Documents
export const fetchTehsildarDocumentsApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/documents?${query}` : `${API_BASE}/documents`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar documents API error:', err.message);
    return null;
  }
};

// 7. Reports & Analytics
export const fetchTehsildarReportsApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/reports?${query}` : `${API_BASE}/reports`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar reports API error:', err.message);
    return null;
  }
};

// 8. Notifications
export const fetchTehsildarNotificationsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Tehsildar notifications API error:', err.message);
    return null;
  }
};

// 9. Village-Wise & Highway Corridor GIS Integration
export const fetchTehsildarGisHierarchyApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/gis/hierarchy`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('GIS hierarchy API error:', err.message);
    return null;
  }
};

export const fetchTehsildarVillageStatsApi = async (villageName) => {
  try {
    const res = await fetch(`${API_BASE}/gis/village/${encodeURIComponent(villageName)}/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Village stats API error (${villageName}):`, err.message);
    return null;
  }
};

export const fetchTehsildarVillageParcelsApi = async (villageName) => {
  try {
    const res = await fetch(`${API_BASE}/gis/village/${encodeURIComponent(villageName)}/parcels`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Village parcels API error (${villageName}):`, err.message);
    return null;
  }
};

export const fetchTehsildarHighwayCorridorApi = async (projectId = 'PRJ-001') => {
  try {
    const res = await fetch(`${API_BASE}/gis/highway-corridor?projectId=${encodeURIComponent(projectId)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Highway corridor API error:', err.message);
    return null;
  }
};

