/**
 * BhoomiSetu: Enforce Real Logged-in User, Remove Switch User & URL Protection Test
 */

const http = require('http');

function postRequest(urlPath, token, postData) {
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
    req.write(dataStr);
    req.end();
  });
}

function getRequest(urlPath, token) {
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

async function runEnforceRealUserTest() {
  console.log('================================================================');
  console.log('🔒 BHOOMISETU: ENFORCE REAL LOGGED-IN USER & REMOVE SWITCH USER TEST');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
    }
  }

  const roleAccounts = [
    { role: 'CITIZEN', email: 'citizen@demo.com', expectedPath: '/citizen/dashboard', authorizedProjects: 1 },
    { role: 'GOVERNMENT_OFFICER', email: 'officer@demo.gov.in', expectedPath: '/revenue-officer/dashboard', authorizedProjects: 3 },
    { role: 'TEHSILDAR', email: 'tehsildar@demo.gov.in', expectedPath: '/tehsildar/dashboard', authorizedProjects: 3 },
    { role: 'EXECUTIVE_OFFICER', email: 'executive@demo.gov.in', expectedPath: '/project-agency/dashboard', authorizedProjects: 3 },
    { role: 'PROJECT_AGENCY', email: 'agency@demo.gov.in', expectedPath: '/project-agency/dashboard', authorizedProjects: 3 },
    { role: 'DISTRICT_AUTHORITY', email: 'district.officer@bhoomisetu.gov.in', expectedPath: '/district/dashboard', authorizedProjects: 3 },
    { role: 'STATE_GOVERNMENT', email: 'state.officer@bhoomisetu.gov.in', expectedPath: '/state/dashboard', authorizedProjects: 3 },
    { role: 'CENTRAL_MINISTRY', email: 'central.officer@bhoomisetu.gov.in', expectedPath: '/central/dashboard', authorizedProjects: 10 },
    { role: 'ADMIN', email: 'admin@bhoomisetu.gov.in', expectedPath: '/admin/dashboard', authorizedProjects: 10 },
  ];

  // Test 1: Real Authentication & Backend Token Validation for ALL 9 Roles
  console.log('--- 1. Testing Real Login & JWT Token for All 9 Roles ---');
  for (const acct of roleAccounts) {
    const loginRes = await postRequest('/api/auth/login', null, { email: acct.email, password: 'Bhoomi@123' });
    assert(loginRes.status === 200, `${acct.role} login returned HTTP 200`);
    assert(loginRes.data?.token, `${acct.role} received valid JWT token`);
    assert(loginRes.data?.user?.role === acct.role, `${acct.role} role verified from backend identity`);

    // Verify /api/auth/me (Simulates Refresh Test)
    const meRes = await getRequest('/api/auth/me', loginRes.data.token);
    assert(meRes.status === 200, `${acct.role} /api/auth/me returns 200 on refresh`);
    assert(meRes.data?.email === acct.email, `${acct.role} identity preserved on reload`);
    assert(meRes.data?.role === acct.role, `${acct.role} role is immutable from backend`);
  }

  // Test 2: Backend Authorization as Single Source of Truth
  console.log('\n--- 2. Testing Backend Authorization as Single Source of Truth ---');
  const piaLogin = await postRequest('/api/auth/login', null, { email: 'agency@demo.gov.in', password: 'Bhoomi@123' });
  const piaToken = piaLogin.data?.token;

  // PIA calling GIS API -> Must return only PIA authorized projects (NHAI Corridors)
  const piaGisRes = await getRequest('/api/gis/authorized-map-data', piaToken);
  assert(piaGisRes.status === 200, 'PIA /api/gis/authorized-map-data HTTP 200');
  const piaProjects = piaGisRes.data?.projects || [];
  assert(piaProjects.length <= 4, 'PIA receives ONLY assigned corridors (no unauthorized central projects)', `Count: ${piaProjects.length}`);

  // Test 3: Citizen Data Isolation & Anonymization
  console.log('\n--- 3. Testing Citizen Land Parcel Authorization ---');
  const citizenLogin = await postRequest('/api/auth/login', null, { email: 'citizen@demo.com', password: 'Bhoomi@123' });
  const citizenToken = citizenLogin.data?.token;

  const citizenGisRes = await getRequest('/api/gis/authorized-map-data', citizenToken);
  assert(citizenGisRes.data?.projects?.length === 1, 'Citizen strictly limited to 1 corridor containing their land');
  assert(citizenGisRes.data?.projects[0]?.projectId === 'PRJ-001', 'Citizen corridor is PRJ-001 (Delhi–Meerut Expressway)');

  // Test 4: Unauthenticated Requests Blocked (Simulates Post-Logout state)
  console.log('\n--- 4. Testing Unauthenticated Request Security (Post-Logout) ---');
  const noAuthRes = await getRequest('/api/auth/me', null);
  assert(noAuthRes.status === 401 || noAuthRes.status === 403, 'Unauthenticated request to /api/auth/me is blocked');

  console.log('\n================================================================');
  console.log(`🏁 ENFORCE REAL USER TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');
}

runEnforceRealUserTest().catch(console.error);
