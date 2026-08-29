/**
 * BhoomiSetu: Role-Based Project Highlight & GIS Synchronization Test Suite
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

async function runGisTestSuite() {
  console.log('================================================================');
  console.log('🗺️ BHOOMISETU: ROLE-BASED PROJECT & GIS SYNCHRONIZATION TEST');
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

  // 1. Citizen Role: Strict Authorization Scope
  console.log('--- 1. Testing Citizen Role Project & GIS Scope ---');
  const citizenLogin = await postRequest('/api/auth/login', null, { email: 'citizen@demo.com', password: 'Bhoomi@123' });
  const citizenToken = citizenLogin.data?.token;
  assert(citizenToken, 'Citizen Logged in successfully');

  const citizenProjectsRes = await getRequest('/api/projects/authorized', citizenToken);
  assert(citizenProjectsRes.status === 200, 'Citizen /api/projects/authorized HTTP 200');
  const citizenProjects = citizenProjectsRes.data || [];
  assert(citizenProjects.length === 1 && citizenProjects[0].projectId === 'PRJ-001', 'Citizen receives ONLY authorized project PRJ-001', `Count: ${citizenProjects.length}`);
  const hasUnauthorizedForCitizen = citizenProjects.some(p => p.projectId === 'PRJ-002' || p.projectId === 'PRJ-003' || p.projectId === 'PRJ-004');
  assert(!hasUnauthorizedForCitizen, 'Citizen unauthorized projects (PRJ-002, PRJ-003, PRJ-004) are strictly blocked');

  const citizenGisRes = await getRequest('/api/gis/authorized-map-data?projectId=PRJ-001', citizenToken);
  assert(citizenGisRes.status === 200, 'Citizen /api/gis/authorized-map-data HTTP 200');
  assert(citizenGisRes.data.projects?.length === 1, 'Citizen GIS map highlights ONLY 1 authorized project');
  assert(citizenGisRes.data.affectedParcels?.length > 0, 'Citizen GIS map includes project affected parcels');

  // Check information masking for Citizen
  const citizenParcels = citizenGisRes.data.affectedParcels || [];
  const otherOwnerParcel = citizenParcels.find(p => p.khasraNumber !== '101' && p.khasraNumber !== '105');
  if (otherOwnerParcel) {
    assert(otherOwnerParcel.ownerName.includes('Authorized Landholder') || otherOwnerParcel.ownerName.includes('Private'), 'Citizen view masks sensitive identity of non-owned parcels');
  }

  // 2. Revenue Officer & Tehsildar: District / Jurisdiction Scope (Agra)
  console.log('\n--- 2. Testing Revenue Officer & Tehsildar Scope ---');
  const roLogin = await postRequest('/api/auth/login', null, { email: 'officer@demo.gov.in', password: 'Bhoomi@123' });
  const roToken = roLogin.data?.token;
  assert(roToken, 'Revenue Officer Logged in successfully');

  const roProjectsRes = await getRequest('/api/projects/authorized', roToken);
  const roProjects = roProjectsRes.data || [];
  assert(roProjects.length >= 2, 'Revenue Officer receives assigned jurisdiction projects in Agra', `Count: ${roProjects.length}`);
  const roProjectIds = roProjects.map(p => p.projectId);
  assert(roProjectIds.includes('PRJ-001') && roProjectIds.includes('PRJ-005'), 'Revenue Officer sees PRJ-001 (DME) and PRJ-005 (NH-19)');

  // 3. District Magistrate: District Scope (Agra)
  console.log('\n--- 3. Testing District Magistrate Scope ---');
  const dmLogin = await postRequest('/api/auth/login', null, { email: 'district.officer@bhoomisetu.gov.in', password: 'Bhoomi@123' });
  const dmToken = dmLogin.data?.token;
  assert(dmToken, 'District Magistrate Logged in successfully');

  const dmGisRes = await getRequest('/api/gis/authorized-map-data', dmToken);
  assert(dmGisRes.status === 200, 'District /api/gis/authorized-map-data HTTP 200');
  const dmProjects = dmGisRes.data.projects || [];
  assert(dmProjects.length >= 2, 'District Magistrate GIS highlights all authorized district projects', `Count: ${dmProjects.length}`);
  assert(dmProjects.every(p => p.boundary && p.boundary.length > 0 && p.coords && p.coords.length > 0), 'Every project contains valid boundary and alignment geometry coordinates');

  // 4. Project ↔ Parcel Synchronization
  console.log('\n--- 4. Testing Project ↔ Parcel Synchronization ---');
  const prj1ParcelsRes = await getRequest('/api/projects/PRJ-001/parcels', dmToken);
  assert(prj1ParcelsRes.status === 200, 'PRJ-001 /parcels HTTP 200');
  const prj1Parcels = prj1ParcelsRes.data || [];
  assert(prj1Parcels.every(p => p.projectId === 'PRJ-001'), 'Project PRJ-001 parcels list contains ONLY PRJ-001 parcels (0 cross-project contamination)');
  assert(prj1Parcels.some(p => p.khasraNumber === '101' && p.coords && p.coords.length > 0), 'Parcel Khasra #101 contains synchronized boundary polygon coordinates');

  // 5. Central Ministry & Admin Scope (All National Corridors)
  console.log('\n--- 5. Testing Central Ministry & Admin Scope ---');
  const centralLogin = await postRequest('/api/auth/login', null, { email: 'central.officer@bhoomisetu.gov.in', password: 'Bhoomi@123' });
  const centralToken = centralLogin.data?.token;
  assert(centralToken, 'Central Officer Logged in successfully');

  const centralGisRes = await getRequest('/api/gis/authorized-map-data', centralToken);
  const centralProjects = centralGisRes.data.projects || [];
  assert(centralProjects.length >= 5, 'Central Ministry GIS highlights all 5 National Infrastructure Corridors', `Count: ${centralProjects.length}`);

  // 6. Surrounding Buffer Parcels Differentiation
  console.log('\n--- 6. Testing Surrounding Buffer Parcels Differentiation ---');
  const surrounding = dmGisRes.data.surroundingParcels || [];
  assert(surrounding.length > 0, 'Surrounding contextual buffer parcels provided');
  assert(surrounding.every(p => p.isContextual === true), 'Surrounding parcels explicitly tagged with isContextual: true');

  console.log('\n================================================================');
  console.log(`🏁 GIS ROLE & SYNCHRONIZATION RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================\n');
}

runGisTestSuite().catch(console.error);
