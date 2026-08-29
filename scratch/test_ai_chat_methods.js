/**
 * Test script to verify POST /api/ai/chat endpoint and CORS method validation
 */

const http = require('http');

function makeRequest(method, urlPath, token, postData) {
  return new Promise((resolve, reject) => {
    const dataStr = postData ? JSON.stringify(postData) : '';
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: urlPath,
      method: method,
      headers: {
        ...(dataStr ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(dataStr) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (dataStr) req.write(dataStr);
    req.end();
  });
}

async function testAIChatMethods() {
  console.log('================================================================');
  console.log('🔍 VERIFYING POST /api/ai/chat vs GET BEHAVIOR & CORS');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, name, detail = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name} ${detail ? '(' + detail + ')' : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${detail ? '(' + detail + ')' : ''}`);
    }
  }

  // 1. Test POST /api/ai/chat with expected payload
  console.log('--- 1. Testing POST /api/ai/chat with JSON Payload ---');
  const postRes = await makeRequest('POST', '/api/ai/chat', null, {
    message: 'mere district me kitne project hain?',
    currentPage: 'district-dashboard',
    projectId: null,
    parcelId: null
  });

  assert(postRes.status === 200, 'POST /api/ai/chat returns HTTP 200', `Status: ${postRes.status}`);
  assert(postRes.data?.message?.length > 0 || postRes.data?.answer?.length > 0, 'POST /api/ai/chat returns non-empty AI answer');
  assert(Array.isArray(postRes.data?.actions), 'POST /api/ai/chat returns actions array');

  // 2. Test GET /api/ai/chat (Should return 405 Method Not Allowed as per REST standards)
  console.log('\n--- 2. Testing GET /api/ai/chat (Method Rejection) ---');
  const getRes = await makeRequest('GET', '/api/ai/chat', null, null);
  assert(getRes.status === 405, 'GET /api/ai/chat properly returns 405 Method Not Allowed (not 500)', `Status: ${getRes.status}`);

  // 3. Test OPTIONS /api/ai/chat (CORS Preflight)
  console.log('\n--- 3. Testing OPTIONS /api/ai/chat (CORS Preflight) ---');
  const optionsRes = await makeRequest('OPTIONS', '/api/ai/chat', null, null);
  assert(optionsRes.status === 200 || optionsRes.status === 204, 'OPTIONS /api/ai/chat CORS Preflight passes', `Status: ${optionsRes.status}`);

  // 4. Test GET /api/ai/status (Health check endpoint)
  console.log('\n--- 4. Testing GET /api/ai/status ---');
  const statusRes = await makeRequest('GET', '/api/ai/status', null, null);
  assert(statusRes.status === 200 && statusRes.data?.status === 'ONLINE', 'GET /api/ai/status returns ONLINE');

  console.log('\n================================================================');
  console.log(`🏁 METHOD VALIDATION RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');
}

testAIChatMethods().catch(console.error);
