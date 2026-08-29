// State Government REST API Client
import { getToken } from '../auth/authApi';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchStateDashboardApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/dashboard?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateDashboardApi error:', err);
    return null;
  }
};

export const fetchStateDistrictsApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/districts?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateDistrictsApi error:', err);
    return [];
  }
};

export const fetchStateProjectsApi = async (state = 'Uttar Pradesh', district = '') => {
  try {
    const url = district && district !== 'ALL'
      ? `/api/state/projects?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`
      : `/api/state/projects?state=${encodeURIComponent(state)}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateProjectsApi error:', err);
    return [];
  }
};

export const fetchStateMapApi = async (state = 'Uttar Pradesh', district = '') => {
  try {
    const url = district && district !== 'ALL'
      ? `/api/state/map?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`
      : `/api/state/map?state=${encodeURIComponent(state)}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateMapApi error:', err);
    return null;
  }
};

export const fetchStateAcquisitionApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/acquisition?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateAcquisitionApi error:', err);
    return null;
  }
};

export const fetchStateCompensationApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/compensation?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateCompensationApi error:', err);
    return null;
  }
};

export const fetchStateRnRApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/r-and-r?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateRnRApi error:', err);
    return null;
  }
};

export const fetchStateCompensationRnRApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/compensation-rnr?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateCompensationRnRApi error:', err);
    return [];
  }
};

export const fetchStateDisputesApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/disputes?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateDisputesApi error:', err);
    return [];
  }
};

export const fetchStateEscalationsApi = async (state = 'Uttar Pradesh', status = 'ALL') => {
  try {
    const query = status && status !== 'ALL' ? `&status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`/api/state/escalations?state=${encodeURIComponent(state)}${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateEscalationsApi error:', err);
    return [];
  }
};

export const addStateEscalationRemarkApi = async (escId, payload) => {
  try {
    const res = await fetch(`/api/state/escalations/${encodeURIComponent(escId)}/remark`, {
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

export const forwardStateEscalationApi = async (escId, payload) => {
  try {
    const res = await fetch(`/api/state/escalations/${encodeURIComponent(escId)}/forward`, {
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

export const escalateStateToChiefSecretaryApi = async (escId, payload) => {
  try {
    const res = await fetch(`/api/state/escalations/${encodeURIComponent(escId)}/escalate`, {
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

export const updateStateEscalationStatusApi = async (escId, payload) => {
  try {
    const res = await fetch(`/api/state/escalations/${encodeURIComponent(escId)}/status`, {
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

export const fetchStateReportsApi = async (state = 'Uttar Pradesh') => {
  try {
    const res = await fetch(`/api/state/reports?state=${encodeURIComponent(state)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchStateReportsApi error:', err);
    return null;
  }
};
