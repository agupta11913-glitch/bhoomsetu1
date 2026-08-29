const https = require('https');

function checkRenderEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'bhoomsetu1.onrender.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'BhoomiSetu-Client',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, data: body.slice(0, 300) });
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout connecting to Render'));
    });
    req.end();
  });
}

async function run() {
  console.log('Testing Render deployed backend connectivity...');
  try {
    const res = await checkRenderEndpoint('/api/auth/me');
    console.log('Response status from Render /api/auth/me:', res.status);
    console.log('Response body:', res.data);
  } catch (e) {
    console.log('Note on Render connection:', e.message);
  }
}

run();
