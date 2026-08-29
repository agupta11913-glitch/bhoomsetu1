// =============================================================================
// BHOOMISETU: District Administration Common REST API Client
// Connected to Spring Boot Backend (/api/district/**)
// =============================================================================

import { getToken } from '../auth/authApi';
import { buildApiUrl } from '../../config/apiConfig';

const API_BASE = buildApiUrl('/district');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// 1. Dashboard Statistics
export const fetchDistrictDashboardApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/dashboard${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District dashboard API error:', err.message);
    return null;
  }
};

// 2. Projects
export const fetchDistrictProjectsApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/projects${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District projects API error:', err.message);
    return [];
  }
};

export const fetchDistrictProjectByIdApi = async (projectId, district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`District project ${projectId} API error:`, err.message);
    return null;
  }
};

// 3. Acquisition & Land
export const fetchDistrictAcquisitionApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/acquisition?${query}` : `${API_BASE}/acquisition`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District acquisition API error:', err.message);
    return [];
  }
};

export const fetchDistrictLandOverviewApi = async (district, projectId) => {
  try {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (projectId) params.append('projectId', projectId);
    const query = params.toString();
    const url = query ? `${API_BASE}/land?${query}` : `${API_BASE}/land`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District land API error:', err.message);
    return [];
  }
};

// 4. GIS Map
export const fetchDistrictMapApi = async (district, projectId) => {
  try {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (projectId) params.append('projectId', projectId);
    const query = params.toString();
    const url = query ? `${API_BASE}/map?${query}` : `${API_BASE}/map`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District map API error:', err.message);
    return null;
  }
};

// 5. Disputes & Citizen Objections
export const fetchDistrictDisputesApi = async (district, projectId) => {
  try {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (projectId) params.append('projectId', projectId);
    const query = params.toString();
    const url = query ? `${API_BASE}/disputes?${query}` : `${API_BASE}/disputes`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District disputes API error:', err.message);
    return [];
  }
};

export const escalateDistrictDisputeApi = async (disputeId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/disputes/${encodeURIComponent(disputeId)}/escalate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const resolveDistrictDisputeApi = async (disputeId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/disputes/${encodeURIComponent(disputeId)}/resolve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// 6. Compensation & R&R
export const fetchDistrictCompensationApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/compensation${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District compensation API error:', err.message);
    return null;
  }
};

export const fetchDistrictRnRApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/r-and-r${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District R&R API error:', err.message);
    return null;
  }
};

// 7. Officer Monitoring
export const fetchDistrictOfficersApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/officers${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District officers API error:', err.message);
    return [];
  }
};

// 8. Department Coordination
export const fetchDistrictCoordinationApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/coordination${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District coordination API error:', err.message);
    return [];
  }
};

export const createDistrictCoordinationApi = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/coordination`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// 9. Escalations & Delayed Cases
export const fetchDistrictEscalationsApi = async (district, status) => {
  try {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (status && status !== 'ALL') params.append('status', status);
    const query = params.toString();
    const url = query ? `${API_BASE}/escalations?${query}` : `${API_BASE}/escalations`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District escalations API error:', err.message);
    return [];
  }
};

export const createDistrictEscalationApi = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const actionDistrictEscalationApi = async (escalationId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations/${encodeURIComponent(escalationId)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const addDistrictEscalationRemarkApi = async (escalationId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations/${encodeURIComponent(escalationId)}/remark`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const forwardDistrictEscalationApi = async (escalationId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations/${encodeURIComponent(escalationId)}/forward`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const escalateToStateDistrictEscalationApi = async (escalationId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations/${encodeURIComponent(escalationId)}/escalate-state`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const resolveDistrictEscalationApi = async (escalationId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations/${encodeURIComponent(escalationId)}/resolve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchDistrictDelayedCasesApi = async (district, category) => {
  try {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (category && category !== 'ALL') params.append('category', category);
    const query = params.toString();
    const url = query ? `${API_BASE}/delayed-cases?${query}` : `${API_BASE}/delayed-cases`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District delayed cases API error:', err.message);
    return [];
  }
};

export const addDistrictDelayedRemarkApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/delayed-cases/${encodeURIComponent(caseId)}/remark`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDistrictDelayedStatusApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/delayed-cases/${encodeURIComponent(caseId)}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDistrictDelayedReasonApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/delayed-cases/${encodeURIComponent(caseId)}/delay-reason`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const forwardDistrictDelayedCaseApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/delayed-cases/${encodeURIComponent(caseId)}/forward`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const escalateDistrictDelayedCaseApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/delayed-cases/${encodeURIComponent(caseId)}/escalate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// 10. Reports, Documents, Notifications, Audit, Profile
export const fetchDistrictReportsApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/reports${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District reports API error:', err.message);
    return null;
  }
};

export const fetchDistrictDocumentsApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/documents${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District documents API error:', err.message);
    return [];
  }
};

export const fetchDistrictNotificationsApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/notifications${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District notifications API error:', err.message);
    return [];
  }
};

export const fetchDistrictAuditApi = async (district) => {
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/audit${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District audit API error:', err.message);
    return [];
  }
};

export const updateDistrictProjectProgressApi = async (projectId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}/progress`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const uploadDistrictProjectDocumentApi = async (projectId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDistrictAcquisitionStatusApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/acquisition/${encodeURIComponent(caseId)}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const addDistrictAcquisitionRemarkApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/acquisition/${encodeURIComponent(caseId)}/remarks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const addDistrictLandRemarkApi = async (parcelId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/land/${encodeURIComponent(parcelId)}/remark`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchDistrictLandRemarksApi = async (parcelId) => {
  try {
    const res = await fetch(`${API_BASE}/land/${encodeURIComponent(parcelId)}/remarks`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
};

export const addDistrictDisputeApi = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/disputes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const reviewDistrictDisputeApi = async (disputeId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/disputes/${encodeURIComponent(disputeId)}/review`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDistrictCompensationStatusApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/compensation/${encodeURIComponent(caseId)}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDistrictRnRStatusApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/r-and-r/${encodeURIComponent(caseId)}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDistrictCoordinationStatusApi = async (coordinationId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/coordination/${encodeURIComponent(coordinationId)}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDistrictEscalationStatusApi = async (escalationId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/escalations/${encodeURIComponent(escalationId)}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const actionDistrictDelayedCaseApi = async (caseId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/delayed-cases/${encodeURIComponent(caseId)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const generateDistrictReportApi = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const uploadDistrictDocumentApi = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchDistrictProfileApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('District profile API error:', err.message);
    return null;
  }
};
