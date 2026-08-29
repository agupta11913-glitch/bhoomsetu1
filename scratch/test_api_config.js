// Test URL generator logic for both Dev and Production

function testConfig(envApiUrl, isProd) {
  const API_ORIGIN = (envApiUrl || (isProd ? 'https://bhoomsetu1.onrender.com' : '')).replace(/\/+$/, '');
  const API_BASE_URL = `${API_ORIGIN}/api`;

  const buildApiUrl = (endpoint = '') => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (cleanEndpoint.startsWith('/api/')) {
      return `${API_ORIGIN}${cleanEndpoint}`;
    }
    return `${API_BASE_URL}${cleanEndpoint}`;
  };

  return { API_ORIGIN, API_BASE_URL, buildApiUrl };
}

console.log('--- TEST 1: Development Mode (VITE_API_URL empty, isProd=false) ---');
const dev = testConfig('', false);
console.log('API_BASE_URL:', dev.API_BASE_URL);
console.log('buildApiUrl("/auth/login"):', dev.buildApiUrl('/auth/login'));
console.log('buildApiUrl("/district") + "/dashboard":', dev.buildApiUrl('/district') + '/dashboard');
console.log('buildApiUrl("/lands"):', dev.buildApiUrl('/lands'));
console.log('buildApiUrl("/api/gis/authorized-map-data"):', dev.buildApiUrl('/api/gis/authorized-map-data'));

console.log('\n--- TEST 2: Production Mode (VITE_API_URL="https://bhoomsetu1.onrender.com", isProd=true) ---');
const prod = testConfig('https://bhoomsetu1.onrender.com', true);
console.log('API_BASE_URL:', prod.API_BASE_URL);
console.log('buildApiUrl("/auth/login"):', prod.buildApiUrl('/auth/login'));
console.log('buildApiUrl("/district") + "/dashboard":', prod.buildApiUrl('/district') + '/dashboard');
console.log('buildApiUrl("/lands"):', prod.buildApiUrl('/lands'));
console.log('buildApiUrl("/api/gis/authorized-map-data"):', prod.buildApiUrl('/api/gis/authorized-map-data'));

console.log('\n--- TEST 3: Production Fallback (VITE_API_URL empty, isProd=true) ---');
const prodFallback = testConfig('', true);
console.log('API_BASE_URL:', prodFallback.API_BASE_URL);
console.log('buildApiUrl("/auth/login"):', prodFallback.buildApiUrl('/auth/login'));
console.log('buildApiUrl("/district") + "/dashboard":', prodFallback.buildApiUrl('/district') + '/dashboard');
console.log('buildApiUrl("/lands"):', prodFallback.buildApiUrl('/lands'));
console.log('buildApiUrl("/api/gis/authorized-map-data"):', prodFallback.buildApiUrl('/api/gis/authorized-map-data'));
