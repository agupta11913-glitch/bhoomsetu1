/**
 * Verification of 10 Distinct Contextual AI Answers (No repetitive/generic responses)
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

async function loginUser(email, password = 'Password@123') {
  const res = await postRequest('/api/auth/login', null, { email, password });
  return res.data?.token || null;
}

async function runDifferentiatedTests() {
  console.log('================================================================');
  console.log('🎯 VERIFYING 10 DISTINCT QUESTIONS & NON-GENERIC AI RESPONSES');
  console.log('================================================================\n');

  const districtToken = await loginUser('district.officer@bhoomisetu.gov.in', 'Bhoomi@123');
  const citizenToken = await loginUser('citizen@demo.com', 'Bhoomi@123');

  const questions = [
    {
      num: 1,
      q: 'Mere district me kitne projects hain?',
      token: districtToken,
      ctx: { currentPage: 'district-dashboard', currentDistrict: 'Agra' },
      expectedScope: 'PROJECT_COUNT',
      expectedKeywords: ['projects', 'Agra', 'Delhi–Meerut'],
    },
    {
      num: 2,
      q: 'Kaunse projects delayed hain?',
      token: districtToken,
      ctx: { currentPage: 'district-dashboard', currentDistrict: 'Agra' },
      expectedScope: 'DELAYED_PROJECTS',
      expectedKeywords: ['delayed', 'Forest', 'PRJ-002'],
    },
    {
      num: 3,
      q: 'Project P123 ka progress kya hai?',
      token: districtToken,
      ctx: { currentPage: 'project-details', projectId: 'PRJ-001' },
      expectedScope: 'PROJECT_PROGRESS',
      expectedKeywords: ['progress', 'Acre', 'Section 19'],
    },
    {
      num: 4,
      q: 'Is project me kitne parcels hain?',
      token: districtToken,
      ctx: { currentPage: 'project-details', projectId: 'PRJ-001' },
      expectedScope: 'PROJECT_PARCELS',
      expectedKeywords: ['parcels', 'Verified'],
    },
    {
      num: 5,
      q: 'Compensation ka status kya hai?',
      token: districtToken,
      ctx: { currentPage: 'district-compensation', currentDistrict: 'Agra' },
      expectedScope: 'COMPENSATION_STATUS',
      expectedKeywords: ['Compensation', 'Disbursed', 'Beneficiaries'],
    },
    {
      num: 6,
      q: 'R&R ka status kya hai?',
      token: citizenToken,
      ctx: { currentPage: 'citizen-dashboard' },
      expectedScope: 'RR_STATUS',
      expectedKeywords: ['R&R', 'Resettlement', '5,00,000'],
    },
    {
      num: 7,
      q: 'Pending disputes kitne hain?',
      token: districtToken,
      ctx: { currentPage: 'tehsildar-dashboard', currentDistrict: 'Agra' },
      expectedScope: 'DISPUTES',
      expectedKeywords: ['disputes', 'Sunita Devi', 'Hearing'],
    },
    {
      num: 8,
      q: 'Iska map kholo.',
      token: districtToken,
      ctx: { currentPage: 'project-details', projectId: 'PRJ-001' },
      expectedScope: 'MAP_ACTION',
      expectedKeywords: ['map', 'PRJ-001'],
    },
    {
      num: 9,
      q: 'Ye parcel kis stage par hai?',
      token: citizenToken,
      ctx: { currentPage: 'parcel-details', parcelId: '101' },
      expectedScope: 'PARCEL_STATUS',
      expectedKeywords: ['Khasra 101', 'Stage', 'Nagla'],
    },
    {
      num: 10,
      q: 'Hello, tum kya kar sakte ho?',
      token: citizenToken,
      ctx: { currentPage: 'home' },
      expectedScope: 'HELP_GREETING',
      expectedKeywords: ['BhoomiSetu AI', 'Projects', 'Compensation'],
    },
  ];

  const answers = new Set();
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

  for (const item of questions) {
    console.log(`\n--- Test ${item.num}: "${item.q}" ---`);
    const res = await postRequest('/api/ai/chat', item.token, {
      message: item.q,
      ...item.ctx,
    });

    assert(res.status === 200, `Question ${item.num} HTTP 200`);
    const msg = res.data?.message || res.data?.answer || '';
    assert(msg.length > 20, `Question ${item.num} Answer Non-Empty`);
    
    // Check Scope
    assert(res.data?.scope === item.expectedScope, `Question ${item.num} Scope is ${item.expectedScope}`, `Got: ${res.data?.scope}`);

    // Check Keywords
    const hasKeyword = item.expectedKeywords.some(kw => msg.toLowerCase().includes(kw.toLowerCase()));
    assert(hasKeyword, `Question ${item.num} Contains Relevant Keywords`);

    // Check Uniqueness: No two questions should produce the exact same answer
    assert(!answers.has(msg), `Question ${item.num} produces a unique, distinct answer`);
    answers.add(msg);

    console.log(`Sample Answer Snippet: "${msg.split('\n')[0]}"`);
  }

  console.log('\n================================================================');
  console.log(`🏁 ALL 10 QUESTIONS UNIQUE & DIFFERENTIATED: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');
}

runDifferentiatedTests().catch(console.error);
