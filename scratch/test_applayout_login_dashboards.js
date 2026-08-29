/**
 * BhoomiSetu: AppLayout & All 9 Login Dashboards Verification Test
 */

const http = require('http');

function postRequest(urlPath, postData) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(postData);
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(dataStr);
    req.end();
  });
}

function getFrontendRoute(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, content: body });
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

function getBackendApi(urlPath, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: urlPath,
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

async function verifyAllRoles() {
  console.log('================================================================');
  console.log('🚀 BHOOMISETU: APPLAYOUT & ALL 9 ROLES DASHBOARDS VERIFICATION');
  console.log('================================================================\n');

  const testCases = [
    {
      roleName: 'Citizen',
      roleKey: 'CITIZEN',
      email: 'citizen@demo.com',
      dashboardRoute: '/citizen/dashboard',
      apiEndpoint: '/api/auth/me',
    },
    {
      roleName: 'Revenue Officer',
      roleKey: 'GOVERNMENT_OFFICER',
      email: 'officer@demo.gov.in',
      dashboardRoute: '/revenue-officer/dashboard',
      apiEndpoint: '/api/revenue-officer/dashboard/stats',
    },
    {
      roleName: 'Tehsildar',
      roleKey: 'TEHSILDAR',
      email: 'tehsildar@demo.gov.in',
      dashboardRoute: '/tehsildar/dashboard',
      apiEndpoint: '/api/tehsildar/dashboard/stats',
    },
    {
      roleName: 'Executive Officer',
      roleKey: 'EXECUTIVE_OFFICER',
      email: 'executive@demo.gov.in',
      dashboardRoute: '/project-agency/dashboard',
      apiEndpoint: '/api/agency/dashboard',
    },
    {
      roleName: 'Project Implementing Agency',
      roleKey: 'PROJECT_AGENCY',
      email: 'agency@demo.gov.in',
      dashboardRoute: '/project-agency/dashboard',
      apiEndpoint: '/api/agency/dashboard',
    },
    {
      roleName: 'District',
      roleKey: 'DISTRICT_AUTHORITY',
      email: 'district.officer@bhoomisetu.gov.in',
      dashboardRoute: '/district/dashboard',
      apiEndpoint: '/api/district/dashboard?district=Agra',
    },
    {
      roleName: 'State',
      roleKey: 'STATE_GOVERNMENT',
      email: 'state.officer@bhoomisetu.gov.in',
      dashboardRoute: '/state/dashboard',
      apiEndpoint: '/api/state/dashboard?state=Uttar%20Pradesh',
    },
    {
      roleName: 'Central',
      roleKey: 'CENTRAL_MINISTRY',
      email: 'central.officer@bhoomisetu.gov.in',
      dashboardRoute: '/central/dashboard',
      apiEndpoint: '/api/central/dashboard',
    },
    {
      roleName: 'System Administrator',
      roleKey: 'ADMIN',
      email: 'admin@bhoomisetu.gov.in',
      dashboardRoute: '/admin/dashboard',
      apiEndpoint: '/api/admin/dashboard',
    },
  ];

  let passed = 0;
  let total = 0;

  function assert(cond, name, details = '') {
    total++;
    if (cond) {
      console.log(`✅ [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
    }
  }

  const resultsSummary = {};

  for (const tc of testCases) {
    console.log(`\n--- Testing ${tc.roleName} (${tc.roleKey}) ---`);
    let rolePassed = true;

    // 1. Authenticate via Backend
    const loginRes = await postRequest('/api/auth/login', { email: tc.email, password: 'Bhoomi@123' });
    const token = loginRes.data?.token;
    const loginOk = loginRes.status === 200 && !!token;
    assert(loginOk, `${tc.roleName} Login (POST /api/auth/login)`);
    if (!loginOk) rolePassed = false;

    // 2. Validate Identity from Backend
    const meRes = await getBackendApi('/api/auth/me', token);
    const meOk = meRes.status === 200 && meRes.data?.role === tc.roleKey;
    assert(meOk, `${tc.roleName} Identity Verification (GET /api/auth/me)`);
    if (!meOk) rolePassed = false;

    // 3. Validate Dedicated Dashboard API
    const apiRes = await getBackendApi(tc.apiEndpoint, token);
    const apiOk = apiRes.status === 200;
    assert(apiOk, `${tc.roleName} Dashboard Backend API (${tc.apiEndpoint})`);
    if (!apiOk) rolePassed = false;

    // 4. Validate Frontend Route Accessibility
    const feRes = await getFrontendRoute(tc.dashboardRoute);
    const feOk = feRes.status === 200 && feRes.content.includes('<div id="root">');
    assert(feOk, `${tc.roleName} Frontend Dashboard Route (${tc.dashboardRoute})`);
    if (!feOk) rolePassed = false;

    // 5. Validate Root Landing Route
    const rootRes = await getFrontendRoute('/');
    const rootOk = rootRes.status === 200;
    assert(rootOk, `${tc.roleName} AppLayout Root Landing (/)`);
    if (!rootOk) rolePassed = false;

    resultsSummary[tc.roleName] = rolePassed ? 'PASS' : 'FAIL';
  }

  console.log('\n================================================================');
  console.log(`🏁 APPLAYOUT & DASHBOARD VERIFICATION: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');

  console.log('SUMMARY OF ALL 9 ROLES:');
  for (const [role, status] of Object.entries(resultsSummary)) {
    console.log(`${role.padEnd(30)}: ${status}`);
  }
}

verifyAllRoles().catch(console.error);
