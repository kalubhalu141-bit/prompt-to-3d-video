const http = require('http');
const { spawn } = require('child_process');

function httpGet(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', err => reject(err));
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const serverProc = spawn('node', ['server.js'], { 
      cwd: process.cwd(),
      env: { ...process.env, PORT: 3000 }
    });

    let output = '';
    serverProc.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('running at http://localhost:3000')) {
        resolve(serverProc);
      }
    });

    serverProc.stderr.on('data', (data) => {
      output += data.toString();
      console.error('SERVER STDERR:', data.toString());
    });

    serverProc.on('error', (err) => {
      reject(err);
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      if (!serverProc.killed) {
        reject(new Error('Server did not start in time'));
      }
    }, 15000);
  });
}

(async () => {
  let serverProc = null;
  try {
    console.log('Starting server...');
    serverProc = await startServer();
    console.log('Server started, testing endpoint...');

    // Test /api/infinite-features
    const res = await httpGet('/api/infinite-features');
    console.log('GET /api/infinite-features ->', res.status, res.body);

    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }

    if (!res.body || !res.body.features || !Array.isArray(res.body.features)) {
      throw new Error('Invalid response body');
    }

    console.log('SUCCESS: /api/infinite-features is working');
    console.log('Features:', res.body.features);
  } catch (e) {
    console.error('VERIFICATION FAILED:', e.message);
    process.exit(1);
  } finally {
    if (serverProc) {
      serverProc.kill();
      console.log('Server stopped');
    }
  }
})();
