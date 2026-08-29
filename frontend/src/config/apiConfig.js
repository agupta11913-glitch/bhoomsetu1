/**
 * BhoomiSetu Central API Base URL Configuration
 * 
 * Development: Uses Vite dev proxy (/api -> http://localhost:8080) or local VITE_API_URL
 * Production: Uses VITE_API_URL (defaults to https://bhoomsetu1.onrender.com)
 */

// Base API origin from Vite environment variables or production fallback
const envApiUrl = import.meta.env.VITE_API_URL;

export const API_ORIGIN = (
  envApiUrl || (import.meta.env.PROD ? 'https://bhoomsetu1.onrender.com' : '')
).replace(/\/+$/, '');

// Base URL prefix for all REST endpoints (/api)
export const API_BASE_URL = `${API_ORIGIN}/api`;

/**
 * Builds a fully qualified or proxy-compatible API URL for any endpoint.
 * @param {string} endpoint - e.g. '/auth/login', '/district/dashboard', '/api/projects'
 * @returns {string} Processed API URL
 */
export const buildApiUrl = (endpoint = '') => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('/api/')) {
    return `${API_ORIGIN}${cleanEndpoint}`;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default {
  API_ORIGIN,
  API_BASE_URL,
  buildApiUrl,
};
