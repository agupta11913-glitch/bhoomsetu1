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
        resolve({ status: res.statusCode, data: body });
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

async function testLogin() {
  console.log('Testing login against Render backend...');
  try {
    const res = await postRender('/api/auth/login', {
      email: 'citizen@demo.com',
      password: 'Bhoomi@123'
    });
    console.log('Login status code:', res.status);
    console.log('Login response:', res.data.slice(0, 300));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testLogin();
