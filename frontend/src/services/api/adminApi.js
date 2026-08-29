// System Administrator REST API Client
import { getToken } from '../auth/authApi';
import { buildApiUrl } from '../../config/apiConfig';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchAdminDashboardApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/admin/dashboard'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAdminDashboardApi error:', err);
    return null;
  }
};

export const fetchAdminUsersApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/admin/users'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAdminUsersApi error:', err);
    return [];
  }
};

export const createAdminUserApi = async (payload) => {
  try {
    const res = await fetch(buildApiUrl('/admin/users'), {
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

export const updateAdminUserApi = async (id, payload) => {
  try {
    const res = await fetch(buildApiUrl(`/admin/users/${id}`), {
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

export const toggleAdminUserStatusApi = async (id) => {
  try {
    const res = await fetch(buildApiUrl(`/admin/users/${id}/toggle-status`), {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const resetAdminUserAccessApi = async (id) => {
  try {
    const res = await fetch(buildApiUrl(`/admin/users/${id}/reset-access`), {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const fetchAdminRolesPermissionsApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/admin/roles-permissions'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAdminRolesPermissionsApi error:', err);
    return null;
  }
};

export const updateAdminRolesPermissionsApi = async (payload) => {
  try {
    const res = await fetch(buildApiUrl('/admin/roles-permissions'), {
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

export const fetchAdminProjectsDepartmentsApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/admin/projects-departments'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAdminProjectsDepartmentsApi error:', err);
    return [];
  }
};

export const createAdminProjectApi = async (payload) => {
  try {
    const res = await fetch(buildApiUrl('/admin/projects'), {
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

export const updateAdminProjectApi = async (id, payload) => {
  try {
    const res = await fetch(buildApiUrl(`/admin/projects/${id}`), {
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

export const fetchAdminSystemMonitoringApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/admin/monitoring'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAdminSystemMonitoringApi error:', err);
    return null;
  }
};

export const fetchAdminNotificationsApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/admin/notifications'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAdminNotificationsApi error:', err);
    return [];
  }
};

export const createAdminNotificationApi = async (payload) => {
  try {
    const res = await fetch(buildApiUrl('/admin/notifications'), {
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

export const fetchAdminSystemSettingsApi = async () => {
  try {
    const res = await fetch(buildApiUrl('/admin/settings'), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchAdminSystemSettingsApi error:', err);
    return null;
  }
};

export const updateAdminSystemSettingsApi = async (payload) => {
  try {
    const res = await fetch(buildApiUrl('/admin/settings'), {
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
