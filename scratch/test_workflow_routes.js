const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING NETLIFY SPA REDIRECTS ===');

const redirectsPath = path.join(__dirname, '..', 'frontend', 'public', '_redirects');
const netlifyTomlPath = path.join(__dirname, '..', 'frontend', 'netlify.toml');

if (fs.existsSync(redirectsPath)) {
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8').trim();
  console.log('✅ [PASS] frontend/public/_redirects exists:', redirectsContent);
} else {
  console.error('❌ [FAIL] frontend/public/_redirects does not exist');
}

if (fs.existsSync(netlifyTomlPath)) {
  console.log('✅ [PASS] frontend/netlify.toml exists');
} else {
  console.error('❌ [FAIL] frontend/netlify.toml does not exist');
}

console.log('\n=== VERIFYING REACT ROUTER ROUTES IN App.jsx ===');
const appJsxPath = path.join(__dirname, '..', 'frontend', 'src', 'App.jsx');
const appJsx = fs.readFileSync(appJsxPath, 'utf-8');

const routesToCheck = [
  '/cases',
  '/cases/:id',
  '/cases/:id/:tab',
  '/citizen/cases',
  '/citizen/cases/:id',
  '/citizen/workflow',
  '/citizen/workflow/:id',
  '/citizen/case-workflow',
  '/citizen/cash-workflow',
  '/citizen/cash-workflow/:id',
  '/gis-map',
  '/map',
  '/gis'
];

for (const route of routesToCheck) {
  const regex = new RegExp(`path=["']${route.replace(/:[a-zA-Z]+/g, ':[a-zA-Z]+')}["']`);
  if (regex.test(appJsx)) {
    console.log(`✅ [PASS] Route registered: ${route}`);
  } else {
    console.error(`❌ [FAIL] Missing route: ${route}`);
  }
}
