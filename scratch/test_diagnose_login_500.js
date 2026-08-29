const https = require('https');

function postRender(path, data) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(data);
    const options = {
      hostname: 'bhoomsetu1.onrender.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr),
        'User-Agent': 'BhoomiSetu-Client',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, json });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(dataStr);
    req.end();
  });
}

async function testAllAccounts() {
  const emails = [
    'citizen@demo.com',
    'tehsildar@demo.gov.in',
    'executive@demo.gov.in',
    'officer@demo.gov.in',
    'district.officer@bhoomisetu.gov.in',
    'state.officer@bhoomisetu.gov.in',
    'central.officer@bhoomisetu.gov.in',
    'agency@demo.gov.in',
    'admin@bhoomisetu.gov.in',
    'unknown_user@demo.com',
    '',
  ];

  for (const email of emails) {
    try {
      const res = await postRender('/api/auth/login', {
        email: email,
        password: email ? 'Bhoomi@123' : 'bad_pwd',
      });
      console.log(`Email: ${email.padEnd(35)} -> HTTP ${res.status} | Success: ${res.json?.success} | Message: ${res.json?.message || res.raw || ''}`);
    } catch (e) {
      console.log(`Email: ${email.padEnd(35)} -> ERROR: ${e.message}`);
    }
  }
}

testAllAccounts();
