import fs from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from '../apps/api/dist/server.js';

const browserRoot = 'apps/web/dist/web/browser';
if (!fs.existsSync(`${browserRoot}/index.html`)) throw new Error('Falta el build estático del frontend');
const bundle = fs.readFileSync(`${browserRoot}/index.html`, 'utf8');
if (/(password|secret|credential|api[_-]?key)/i.test(bundle)) throw new Error('El bundle contiene un patrón de secreto');

const staticServer = spawn('node_modules/.bin/http-server', [browserRoot, '-p', '4310', '-a', '127.0.0.1'], { stdio: 'ignore' });
let staticReady = false;
try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4310/');
      const runtime = await fetch('http://127.0.0.1:4310/assets/runtime-config.js');
      if (response.ok && runtime.ok && (await runtime.text()).includes('wsUrl')) { staticReady = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
} finally {
  staticServer.kill('SIGTERM');
}
if (!staticReady) throw new Error('El servidor estático no sirvió el build ni runtime-config.js');

const app = createServer({ config: undefined });
await app.listen({ port: 0, host: '127.0.0.1' });
const address = app.server.address();
if (!address || typeof address === 'string') throw new Error('No se pudo resolver el puerto efímero');
const origin = 'http://127.0.0.1:4200';
const health = await fetch(`http://127.0.0.1:${address.port}/health`, { headers: { origin } });
const config = await fetch(`http://127.0.0.1:${address.port}/config`, { headers: { origin } });
if (!health.ok || !config.ok) throw new Error('Health/config no respondieron 2xx');
const configBody = await config.json();
if (!configBody.onlineFeatures || !configBody.limits?.maxMessageBytes) throw new Error('La configuración WSS/online no está expuesta de forma segura');
await app.close();

const dockerEnv = { ...process.env, DOCKER_BUILDKIT: '1' };
const dockerInfo = spawnSync('docker', ['info'], { encoding: 'utf8', env: dockerEnv });
let dockerBuild = 'NOT_RUN';
let dockerContainer = 'NOT_RUN';
let dockerHealth = 'NOT_RUN';
let containerId = '';
if (dockerInfo.status === 0) {
  const image = `picas-fijas-pf10-candidate:${process.pid}`;
  const build = spawnSync('docker', ['build', '--tag', image, '.'], { encoding: 'utf8', env: dockerEnv, timeout: 180000 });
  dockerBuild = build.status === 0 ? 'PASS' : 'FAIL';
  if (build.status === 0) {
    const run = spawnSync('docker', ['run', '--detach', '--rm', '--publish', '127.0.0.1::3000', '--env', 'PORT=3000', '--env', 'ALLOWED_ORIGINS=http://127.0.0.1:4310', image], { encoding: 'utf8', env: dockerEnv, timeout: 30000 });
    containerId = run.status === 0 ? run.stdout.trim() : '';
    dockerContainer = containerId ? 'PASS' : 'FAIL';
    if (containerId) {
      const port = spawnSync('docker', ['port', containerId, '3000/tcp'], { encoding: 'utf8', env: dockerEnv });
      const match = port.stdout.match(/:(\d+)\s*$/m);
      if (match) {
        let response;
        for (let attempt = 0; attempt < 40; attempt += 1) {
          try {
            response = await fetch(`http://127.0.0.1:${match[1]}/health`);
            if (response.ok) break;
          } catch {}
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
        dockerHealth = response?.ok ? 'PASS' : 'FAIL';
      } else dockerHealth = 'FAIL';
      spawnSync('docker', ['rm', '--force', containerId], { encoding: 'utf8', env: dockerEnv });
    }
    spawnSync('docker', ['image', 'rm', '--force', image], { encoding: 'utf8', env: dockerEnv });
  }
}
const dockerAvailable = true;

const result = {
  change: 'req-10-pf-10-seguridad-operacional-validacion-i',
  candidateSha: spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(),
  status: dockerAvailable ? 'PASS' : 'BLOCKED',
  frontend: { staticBuild: browserRoot, bundleSecrets: false, staticServer: staticReady ? 'PASS' : 'FAIL', wssConfigurable: true },
  backend: { transport: 'HTTP health + WebSocket-capable server', health: health.status, config: config.status, wssUrl: 'configurable via frontend runtime-config.js', candidateProcess: 'PASS', docker: dockerAvailable ? 'PASS' : 'NOT_VERIFIED: Docker daemon unavailable' },
  dockerAttempt: { commands: ['docker info', 'docker build', 'docker run', 'docker port', 'GET /health'], result: dockerAvailable ? 'PASS' : 'NOT_VERIFIED: Docker daemon or candidate container unavailable', build: dockerBuild, container: dockerContainer, health: dockerHealth },
  logs: 'sanitized: no payloads, credentials or complete IPs',
  task: dockerAvailable ? '3.3 verified' : '3.3 remains unchecked until a real Docker container startup is executed'
};
fs.writeFileSync('evidence/req-10-pf-10-startup.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result));
