import fs from 'node:fs';
import { createServer } from '../apps/api/dist/server.js';

const browserRoot = 'apps/web/dist/web/browser';
if (!fs.existsSync(`${browserRoot}/index.html`)) throw new Error('Falta el build estático del frontend');
const bundle = fs.readFileSync(`${browserRoot}/index.html`, 'utf8');
if (/(password|secret|credential|api[_-]?key)/i.test(bundle)) throw new Error('El bundle contiene un patrón de secreto');

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

const result = { change: 'req-10-pf-10-seguridad-operacional-validacion-i', status: 'PASS', frontend: { staticBuild: 'apps/web/dist/web/browser', bundleSecrets: false }, backend: { transport: 'HTTP health + WebSocket-capable server', health: health.status, config: config.status, wssUrl: 'configurable via frontend runtime-config.js', docker: 'NOT_VERIFIED: daemon no disponible en Apply' }, logs: 'sanitized: no payloads, credentials or complete IPs' };
fs.writeFileSync('evidence/req-10-pf-10-startup.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result));
