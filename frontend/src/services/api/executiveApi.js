// =============================================================================
// BHOOMISETU: Executive Officer REST API Client
// Connected to Spring Boot Backend (/api/executive/**)
// =============================================================================

import { getToken } from '../auth/authApi';

const API_BASE = '/api/executive';

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// 1. Dashboard Statistics & 6-Stage Statutory Lifecycle
export const fetchExecutiveStatsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive stats API error:', err.message);
    return null;
  }
};

// 2. Project Corridors
export const fetchExecutiveProjectsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive projects API error:', err.message);
    return [];
  }
};

export const fetchExecutiveProjectByIdApi = async (projectId) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Executive project ${projectId} API error:`, err.message);
    return null;
  }
};

export const fetchExecutiveProjectParcelsApi = async (projectId) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}/parcels`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Executive project ${projectId} parcels API error:`, err.message);
    return null;
  }
};

// 2.5 Multi-Project Synchronized GIS Map
export const fetchExecutiveMapApi = async ({ projectId, village } = {}) => {
  try {
    const params = new URLSearchParams();
    if (projectId && projectId !== 'ALL') params.append('projectId', projectId);
    if (village && village !== 'ALL') params.append('village', village);

    const res = await fetch(`${API_BASE}/map?${params.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive map API error:', err.message);
    return null;
  }
};

// 3. Acquisition Monitoring
export const fetchExecutiveAcquisitionApi = async ({ projectId, status, village } = {}) => {
  try {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (status) params.append('status', status);
    if (village) params.append('village', village);

    const res = await fetch(`${API_BASE}/acquisition?${params.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive acquisition cases error:', err.message);
    return [];
  }
};

// 4. Compensation Monitoring
export const fetchExecutiveCompensationApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/compensation`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive compensation error:', err.message);
    return null;
  }
};

// 5. R&R Monitoring
export const fetchExecutiveRnRApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/r-and-r`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive R&R error:', err.message);
    return null;
  }
};

// 6. Execution Issues & Escalations
export const fetchExecutiveIssuesApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/escalations`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive issues API error:', err.message);
    return [];
  }
};

export const createExecutiveIssueApi = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive issue create error:', err.message);
    return null;
  }
};

export const updateExecutiveIssueApi = async (issueId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations/${encodeURIComponent(issueId)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Executive issue ${issueId} update error:`, err.message);
    return null;
  }
};

// 7. Department Coordination
export const fetchExecutiveCoordinationApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/coordination`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive coordination error:', err.message);
    return [];
  }
};

// 8. Delayed Cases
export const fetchExecutiveDelayedCasesApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/delayed-cases`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive delayed cases error:', err.message);
    return [];
  }
};

// 9. Officer Performance Monitoring
export const fetchExecutiveOfficersApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/officers`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive officers error:', err.message);
    return [];
  }
};

// 10. Audit Trail
export const fetchExecutiveAuditLogsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/audit`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive audit logs error:', err.message);
    return [];
  }
};

// 11. Notifications
export const fetchExecutiveNotificationsApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Executive notifications error:', err.message);
    return [];
  }
};
