// Central Ministry / PM Gati Shakti REST API Client
import { getToken } from '../auth/authApi';
import { buildApiUrl } from '../../config/apiConfig';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchCentralDashboardApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/central/dashboard'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralDashboardApi error:', err);
    return null;
  }
};

export const fetchCentralStatesApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/central/states'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralStatesApi error:', err);
    return [];
  }
};

export const fetchCentralProjectsApi = async (state = '', district = '') => {
  try {
    const params = new URLSearchParams();
    if (state && state !== 'ALL') params.append('state', state);
    if (district && district !== 'ALL') params.append('district', district);

    const qs = params.toString();
    const endpoint = qs ? `/central/projects?${qs}` : '/central/projects';
    const res = await fetch(buildApiUrl(endpoint), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralProjectsApi error:', err);
    return [];
  }
};

export const fetchCentralMapApi = async (state = '', district = '') => {
  try {
    const params = new URLSearchParams();
    if (state && state !== 'ALL') params.append('state', state);
    if (district && district !== 'ALL') params.append('district', district);

    const qs = params.toString();
    const endpoint = qs ? `/central/map?${qs}` : '/central/map';
    const res = await fetch(buildApiUrl(endpoint), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralMapApi error:', err);
    return null;
  }
};

export const fetchCentralAcquisitionApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/central/acquisition'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralAcquisitionApi error:', err);
    return [];
  }
};

export const fetchCentralCompensationRnRApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/central/compensation-rnr'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralCompensationRnRApi error:', err);
    return [];
  }
};

export const fetchCentralCompensationApi = async () => {
  return fetchCentralCompensationRnRApi();
};

export const fetchCentralRnRApi = async () => {
  return fetchCentralCompensationRnRApi();
};

export const fetchCentralDisputesApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/central/disputes'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralDisputesApi error:', err);
    return [];
  }
};

export const fetchCentralEscalationsApi = async (status = 'ALL') => {
  try {
    const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(buildApiUrl(`/central/escalations${query}`), {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralEscalationsApi error:', err);
    return [];
  }
};

export const addCentralEscalationRemarkApi = async (escId, payload) => {
  try {
    const res = await fetch(buildApiUrl(`/central/escalations/${encodeURIComponent(escId)}/remark`), {
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

export const forwardCentralEscalationApi = async (escId, payload) => {
  try {
    const res = await fetch(buildApiUrl(`/central/escalations/${encodeURIComponent(escId)}/forward`), {
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

export const updateCentralEscalationStatusApi = async (escId, payload) => {
  try {
    const res = await fetch(buildApiUrl(`/central/escalations/${encodeURIComponent(escId)}/status`), {
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

export const fetchCentralReportsApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/central/reports'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchCentralReportsApi error:', err);
    return null;
  }
};
