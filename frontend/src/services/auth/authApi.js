// BhoomiSetu Backend REST API Service
const API_BASE_URL = '/api';

export const getToken = () => {
  return localStorage.getItem('bhoomisetu_token');
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('bhoomisetu_token', token);
  } else {
    localStorage.removeItem('bhoomisetu_token');
  }
};

export const removeToken = () => {
  localStorage.removeItem('bhoomisetu_token');
};

// Generic authenticated fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// 1. Register User (POST /api/auth/register)
export const registerApi = async (userData) => {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// 2. Login User (POST /api/auth/login)
export const loginApi = async (email, password) => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// 3. Get Current User Profile (GET /api/auth/me)
export const getMeApi = async () => {
  return apiFetch('/auth/me', {
    method: 'GET',
  });
};

// 4. Get User Preferences (GET /api/users/preferences)
export const getUserPreferencesApi = async () => {
  return apiFetch('/users/preferences', {
    method: 'GET',
  });
};

// 5. Update User Preferences (PUT /api/users/preferences)
export const updateUserPreferencesApi = async (preferences) => {
  return apiFetch('/users/preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences),
  });
};

// 6. Admin: Get Users List (GET /api/admin/users)
export const getAdminUsersApi = async (status, role) => {
  const params = new URLSearchParams();
  if (status && status !== 'ALL') params.append('status', status);
  if (role && role !== 'ALL') params.append('role', role);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/admin/users${queryStr}`, {
    method: 'GET',
  });
};

// 7. Admin: Approve User (PUT /api/admin/users/{id}/approve)
export const approveUserApi = async (userId) => {
  return apiFetch(`/admin/users/${userId}/approve`, {
    method: 'PUT',
  });
};

// 8. Admin: Reject User (PUT /api/admin/users/{id}/reject)
export const rejectUserApi = async (userId, reason) => {
  return apiFetch(`/admin/users/${userId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
};
