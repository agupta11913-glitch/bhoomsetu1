// Project Implementing Agency (PIA) REST API Client
import { getToken } from '../auth/authApi';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchAgencyDashboardApi = async () => {
  try {
    const res = await fetch('/api/agency/dashboard', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyDashboardApi error:', err);
    return null;
  }
};

export const fetchAgencyProjectsApi = async () => {
  try {
    const res = await fetch('/api/agency/projects', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyProjectsApi error:', err);
    return [];
  }
};

export const updateAgencyProjectProgressApi = async (projectId, payload) => {
  try {
    const res = await fetch(`/api/agency/projects/${encodeURIComponent(projectId)}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const addAgencyProjectRemarkApi = async (projectId, payload) => {
  try {
    const res = await fetch(`/api/agency/projects/${encodeURIComponent(projectId)}/remark`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchAgencyMilestonesApi = async (projectId = 'ALL') => {
  try {
    const query = projectId && projectId !== 'ALL' ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const res = await fetch(`/api/agency/progress${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyMilestonesApi error:', err);
    return [];
  }
};

export const updateAgencyMilestoneApi = async (milestoneId, payload) => {
  try {
    const res = await fetch(`/api/agency/milestones/${encodeURIComponent(milestoneId)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchAgencyMapApi = async (projectId = 'ALL') => {
  try {
    const query = projectId && projectId !== 'ALL' ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const res = await fetch(`/api/agency/map${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyMapApi error:', err);
    return null;
  }
};

export const fetchAgencyAcquisitionApi = async () => {
  try {
    const res = await fetch('/api/agency/acquisition', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyAcquisitionApi error:', err);
    return [];
  }
};

export const fetchAgencyCompensationRnRApi = async () => {
  try {
    const res = await fetch('/api/agency/compensation-rnr', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyCompensationRnRApi error:', err);
    return [];
  }
};

export const fetchAgencyIssuesApi = async (status = 'ALL') => {
  try {
    const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`/api/agency/issues${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyIssuesApi error:', err);
    return [];
  }
};

export const reportAgencyIssueApi = async (payload) => {
  try {
    const res = await fetch('/api/agency/issues', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const addAgencyIssueRemarkApi = async (issueId, payload) => {
  try {
    const res = await fetch(`/api/agency/issues/${encodeURIComponent(issueId)}/remark`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const forwardAgencyIssueApi = async (issueId, payload) => {
  try {
    const res = await fetch(`/api/agency/issues/${encodeURIComponent(issueId)}/forward`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchAgencyDocumentsApi = async (projectId = 'ALL') => {
  try {
    const query = projectId && projectId !== 'ALL' ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const res = await fetch(`/api/agency/documents${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyDocumentsApi error:', err);
    return [];
  }
};

export const uploadAgencyDocumentApi = async (payload) => {
  try {
    const res = await fetch('/api/agency/documents', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchAgencyReportsApi = async () => {
  try {
    const res = await fetch('/api/agency/reports', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAgencyReportsApi error:', err);
    return null;
  }
};
