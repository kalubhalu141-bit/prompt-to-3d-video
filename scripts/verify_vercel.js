const fs = require('fs');
const path = 'D:\\video-generator-orig\\video-generator\\vercel.json';
if (!fs.existsSync(path)) {
  console.error('FAIL: vercel.json not found at', path);
  process.exit(1);
}
let cfg;
try {
  cfg = JSON.parse(fs.readFileSync(path, 'utf8'));
} catch (e) {
  console.error('FAIL: invalid JSON in vercel.json');
  process.exit(1);
}
const required = ['version', 'buildCommand', 'outputDirectory'];
const missing = required.filter(k => !(k in cfg));
if (missing.length) {
  console.error('FAIL: missing required fields in vercel.json:', missing.join(', '));
  process.exit(1);
}
if (cfg.version !== 2) {
  console.error('FAIL: vercel.json version must be 2');
  process.exit(1);
}
if (cfg.buildCommand !== 'npm install') {
  console.error('FAIL: vercel.json buildCommand must be npm install');
  process.exit(1);
}
if (cfg.outputDirectory !== '.') {
  console.error('FAIL: vercel.json outputDirectory must be "."');
  process.exit(1);
}
console.log('OK: vercel.json passes ad‑hoc validation');
process.exit(0);