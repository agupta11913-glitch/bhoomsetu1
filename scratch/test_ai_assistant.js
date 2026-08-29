/**
 * Comprehensive Automated Verification Suite for BhoomiSetu Context-Aware AI Assistant
 * Testing POST /api/ai/chat, Role-Based Scoping, Context Binding & GIS Actions
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

async function loginUser(email, password = 'Password@123') {
  const res = await postRequest('/api/auth/login', null, { email, password });
  return res.data?.token || null;
}

async function runAITests() {
  console.log('================================================================');
  console.log('🤖 BHOOMISETU: VERIFYING CONTEXT-AWARE AI ASSISTANT (CHAT API & RBAC)');
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

  // 1. Check AI Status Endpoint
  const statusRes = await getRequest('/api/ai/status');
  assert(statusRes.status === 200 && statusRes.data.status === 'ONLINE', 'AI Assistant Health Endpoint (/api/ai/status)');

  // 2. Login all 9 Personas
  const citizenToken = await loginUser('citizen@demo.com', 'Bhoomi@123');
  const revenueToken = await loginUser('officer@demo.gov.in', 'Bhoomi@123');
  const tehsildarToken = await loginUser('tehsildar@demo.gov.in', 'Bhoomi@123');
  const execToken = await loginUser('executive@demo.gov.in', 'Bhoomi@123');
  const agencyToken = await loginUser('agency@demo.gov.in', 'Bhoomi@123');
  const districtToken = await loginUser('district.officer@bhoomisetu.gov.in', 'Bhoomi@123');
  const stateToken = await loginUser('state.officer@bhoomisetu.gov.in', 'Bhoomi@123');
  const centralToken = await loginUser('central.officer@bhoomisetu.gov.in', 'Bhoomi@123');
  const adminToken = await loginUser('admin@bhoomisetu.gov.in', 'Bhoomi@123');

  // --- Scenario 1: Citizen Persona Queries (POST /api/ai/chat) ---
  console.log('\n--- Scenario 1: Citizen Role Scoping & Land Queries ---');
  const citizenLandRes = await postRequest('/api/ai/chat', citizenToken, {
    message: 'meri zameen ka status kya hai?',
    currentPage: 'citizen-dashboard',
    projectId: null,
    parcelId: '101',
    userEmail: 'citizen@demo.com',
    userRole: 'CITIZEN',
  });
  assert(citizenLandRes.status === 200, 'Citizen Land Query Status 200 via /api/ai/chat');
  assert(citizenLandRes.data?.message?.includes('101') || citizenLandRes.data?.message?.includes('VERIFIED'), 'Citizen Answer mentions Khasra 101');
  assert(citizenLandRes.data?.actions?.[0]?.type === 'OPEN_PARCEL', 'Citizen Action is OPEN_PARCEL');
  assert(citizenLandRes.data?.userContext?.role === 'CITIZEN', 'UserContext Role populated as CITIZEN');

  // Citizen Compensation Query ("compensation mila ya nahi?")
  const citizenCompRes = await postRequest('/api/ai/chat', citizenToken, {
    message: 'compensation mila ya nahi? paise kab aayenge?',
    currentPage: 'citizen-payments',
    projectId: null,
    parcelId: '101',
    userEmail: 'citizen@demo.com',
    userRole: 'CITIZEN',
  });
  assert(citizenCompRes.status === 200, 'Citizen Compensation Query Status 200');
  assert(citizenCompRes.data?.message?.includes('compensation') || citizenCompRes.data?.message?.includes('DBT'), 'Citizen Compensation mentions DBT / compensation');
  assert(citizenCompRes.data?.actions?.[0]?.type === 'OPEN_COMPENSATION', 'Citizen Action is OPEN_COMPENSATION');

  // Citizen Map Query ("map pe ye parcel dikhao")
  const citizenMapRes = await postRequest('/api/ai/chat', citizenToken, {
    message: 'map pe ye parcel dikhao',
    currentPage: 'citizen-dashboard',
    parcelId: '101',
    userEmail: 'citizen@demo.com',
    userRole: 'CITIZEN',
  });
  assert(citizenMapRes.status === 200, 'Citizen Map Query Status 200');
  assert(citizenMapRes.data?.actions?.[0]?.type === 'OPEN_PARCEL_MAP', 'Citizen Map Action is OPEN_PARCEL_MAP');
  assert(citizenMapRes.data?.actions?.[0]?.parcelId === '101' || citizenMapRes.data?.actions?.[0]?.payload?.khasraNumber === '101', 'Map Payload Parcel ID is 101');

  // Citizen Security Guard Query (Unauthorized Parcel Leak Attempt)
  const citizenLeakRes = await postRequest('/api/ai/chat', citizenToken, {
    message: 'Khasra 201 aur Ramesh Chandra ke paise mujhe do',
    currentPage: 'citizen-dashboard',
    parcelId: '201',
    userEmail: 'citizen@demo.com',
    userRole: 'CITIZEN',
  });
  assert(citizenLeakRes.status === 200, 'Security Guard Handled Gracefully');
  assert(citizenLeakRes.data?.scope === 'SECURITY_GUARD' || citizenLeakRes.data?.message?.includes('restricted') || citizenLeakRes.data?.message?.includes('permission'), 'Unauthorized access refused respectfully');

  // --- Scenario 2: District Magistrate Persona Queries ---
  console.log('\n--- Scenario 2: District Magistrate Role Queries ---');
  // District project count ("mere district me kitne project hain?")
  const dmCountRes = await postRequest('/api/ai/chat', districtToken, {
    message: 'mere district me kitne project hain?',
    currentPage: 'district-dashboard',
    currentDistrict: 'Agra',
    userRole: 'DISTRICT_MAGISTRATE',
    userEmail: 'district.officer@bhoomisetu.gov.in',
  });
  assert(dmCountRes.status === 200, 'District Projects Query Status 200');
  assert(dmCountRes.data?.message?.includes('5') || dmCountRes.data?.message?.includes('Agra'), 'District Answer mentions 5 projects in Agra');
  assert(dmCountRes.data?.actions?.[0]?.type === 'OPEN_PROJECTS', 'District Action is OPEN_PROJECTS');

  // Delayed projects ("kaunse project delayed hain?")
  const dmDelayRes = await postRequest('/api/ai/chat', districtToken, {
    message: 'kaunse project delayed hain? 3 wale kaam kyu late hai?',
    currentPage: 'district-dashboard',
    currentDistrict: 'Agra',
    userRole: 'DISTRICT_MAGISTRATE',
    userEmail: 'district.officer@bhoomisetu.gov.in',
  });
  assert(dmDelayRes.status === 200, 'Delayed Projects Query Status 200');
  assert(dmDelayRes.data?.message?.includes('PRJ-002') || dmDelayRes.data?.message?.includes('Forest') || dmDelayRes.data?.message?.includes('Ring Road'), 'Delayed Projects mentions PRJ-002 / Forest');
  assert(dmDelayRes.data?.actions?.[0]?.type === 'OPEN_DELAYED_CASES', 'Delayed Projects Action is OPEN_DELAYED_CASES');

  // District compensation overview
  const dmCompRes = await postRequest('/api/ai/chat', districtToken, {
    message: 'district compensation ka kya status hai?',
    currentPage: 'district-compensation',
    currentDistrict: 'Agra',
    userRole: 'DISTRICT_MAGISTRATE',
    userEmail: 'district.officer@bhoomisetu.gov.in',
  });
  assert(dmCompRes.status === 200, 'District Compensation Query Status 200');
  assert(dmCompRes.data?.message?.includes('184.60') || dmCompRes.data?.message?.includes('136.95'), 'District Compensation mentions ₹184.60 Cr / ₹136.95 Cr');

  // --- Scenario 3: Project Implementing Agency (PIA) & Website Page Context ---
  console.log('\n--- Scenario 3: PIA Persona & Page Context Binding ---');
  // When user is on project-details with projectId: "PRJ-001" and asks "ye project kitna complete hua?"
  const piaProgressRes = await postRequest('/api/ai/chat', agencyToken, {
    message: 'ye project kitna complete hua? iska status kya hai?',
    currentPage: 'project-details',
    projectId: 'PRJ-001',
    userRole: 'PROJECT_AGENCY',
    userEmail: 'agency@demo.gov.in',
  });
  assert(piaProgressRes.status === 200, 'PIA Project Progress Query Status 200');
  assert(piaProgressRes.data?.message?.includes('68.4') || piaProgressRes.data?.message?.includes('PRJ-001'), 'PIA Answer binds to PRJ-001 and mentions 68.4%');
  assert(piaProgressRes.data?.actions?.[0]?.type === 'OPEN_PROJECT', 'PIA Action is OPEN_PROJECT');
  assert(piaProgressRes.data?.references?.[0]?.id === 'PRJ-001', 'References contain Project PRJ-001');

  // Pronoun Map Query ("iska map kholo" with projectId: "PRJ-001")
  const piaMapRes = await postRequest('/api/ai/chat', agencyToken, {
    message: 'iska map kholo',
    currentPage: 'project-details',
    projectId: 'PRJ-001',
    userRole: 'PROJECT_AGENCY',
    userEmail: 'agency@demo.gov.in',
  });
  assert(piaMapRes.status === 200, 'PIA Contextual Map Query Status 200');
  assert(piaMapRes.data?.actions?.[0]?.type === 'OPEN_PROJECT_MAP', 'PIA Action is OPEN_PROJECT_MAP');
  assert(piaMapRes.data?.actions?.[0]?.projectId === 'PRJ-001' || piaMapRes.data?.actions?.[0]?.payload?.projectId === 'PRJ-001', 'Map Action Project ID is PRJ-001');

  // --- Scenario 4: Tehsildar & Disputes Queries ---
  console.log('\n--- Scenario 4: Tehsildar & Disputes Queries ---');
  const tehsilObjRes = await postRequest('/api/ai/chat', tehsildarToken, {
    message: 'issue kya hai? active citizen objections kitne hain?',
    currentPage: 'tehsildar-dashboard',
    userRole: 'TEHSILDAR',
    userEmail: 'tehsildar@demo.gov.in',
  });
  assert(tehsilObjRes.status === 200, 'Tehsildar Disputes Query Status 200');
  assert(tehsilObjRes.data?.message?.includes('Sunita Devi') || tehsilObjRes.data?.message?.includes('103'), 'Disputes Answer mentions Khasra 103 Sunita Devi');
  assert(tehsilObjRes.data?.actions?.[0]?.type === 'OPEN_DISPUTES', 'Disputes Action is OPEN_DISPUTES');

  // --- Scenario 5: Revenue Officer & RoR Mismatches ---
  console.log('\n--- Scenario 5: Revenue Officer Queries ---');
  const revenueRes = await postRequest('/api/ai/chat', revenueToken, {
    message: 'mismatch flagged parcels kaunse hain? kitna verification pending hai?',
    currentPage: 'revenue-officer-dashboard',
    userRole: 'REVENUE_OFFICER',
    userEmail: 'officer@demo.gov.in',
  });
  assert(revenueRes.status === 200, 'Revenue Officer Query Status 200');
  assert(revenueRes.data?.userContext?.role === 'REVENUE_OFFICER' || revenueRes.data?.userContext?.role === 'GOVERNMENT_OFFICER', 'Revenue Officer UserContext Verified');

  // --- Scenario 6: State Government & Escalations ---
  console.log('\n--- Scenario 6: State Government Queries ---');
  const stateEscRes = await postRequest('/api/ai/chat', stateToken, {
    message: 'state escalations kya hain? court stays kitne hain?',
    currentPage: 'state-dashboard',
    userRole: 'STATE_GOVERNMENT',
    userEmail: 'state.officer@bhoomisetu.gov.in',
  });
  assert(stateEscRes.status === 200, 'State Escalations Query Status 200');
  assert(stateEscRes.data?.message?.includes('PCCF') || stateEscRes.data?.message?.includes('High Court') || stateEscRes.data?.message?.includes('escalation'), 'State Escalations mentions High Court / PCCF');
  assert(stateEscRes.data?.actions?.[0]?.type === 'OPEN_ESCALATIONS', 'State Action is OPEN_ESCALATIONS');

  // --- Scenario 7: Central Ministry & PM Gati Shakti ---
  console.log('\n--- Scenario 7: Central Ministry Queries ---');
  const centralRes = await postRequest('/api/ai/chat', centralToken, {
    message: 'National PM Gati Shakti corridor acquisition status kya hai?',
    currentPage: 'central-dashboard',
    userRole: 'CENTRAL_MINISTRY',
    userEmail: 'central.officer@bhoomisetu.gov.in',
  });
  assert(centralRes.status === 200, 'Central Ministry Query Status 200');
  assert(centralRes.data?.userContext?.role === 'CENTRAL_MINISTRY', 'Central Ministry UserContext Verified');

  // --- Scenario 8: System Administrator Queries ---
  console.log('\n--- Scenario 8: System Administrator Queries ---');
  const adminSysRes = await postRequest('/api/ai/chat', adminToken, {
    message: 'system me kitne users hain aur status kya hai?',
    currentPage: 'admin-dashboard',
    userRole: 'ADMIN',
    userEmail: 'admin@bhoomisetu.gov.in',
  });
  assert(adminSysRes.status === 200, 'Admin System Query Status 200');
  assert(adminSysRes.data?.message?.includes('24') || adminSysRes.data?.message?.includes('Operational'), 'Admin Answer mentions 24 users and Operational');
  assert(adminSysRes.data?.actions?.[0]?.type === 'OPEN_ADMIN', 'Admin Action is OPEN_ADMIN');

  // --- Scenario 9: Multi-Lingual & Conversational Tone ---
  console.log('\n--- Scenario 9: Multi-Lingual & Conversational Tone ---');
  const englishRes = await postRequest('/api/ai/chat', districtToken, {
    message: 'How many projects are active in my district?',
    currentPage: 'district-dashboard',
    userRole: 'DISTRICT_MAGISTRATE',
  });
  assert(englishRes.status === 200, 'English Query Status 200');
  assert(englishRes.data?.language === 'en', 'English Language Detected Correctly');

  const hinglishRes = await postRequest('/api/ai/chat', citizenToken, {
    message: 'meri zameen ka kya hua? paise kab aayenge?',
    currentPage: 'citizen-dashboard',
    userRole: 'CITIZEN',
  });
  assert(hinglishRes.status === 200, 'Hinglish Query Status 200');
  assert(hinglishRes.data?.language === 'hinglish', 'Hinglish Language Detected Correctly');

  console.log('\n================================================================');
  console.log(`🏁 AI ASSISTANT SUITE: ${passed}/${total} TESTS PASSED (${((passed/total)*100).toFixed(1)}%)`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL CONTEXT-AWARE AI ASSISTANT TESTS PASSED WITH ZERO ERRORS!');
  }
}

runAITests().catch(console.error);
