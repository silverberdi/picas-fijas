import Fastify from 'fastify';
import cors from '@fastify/cors';
export function createServer() { const app = Fastify({ logger: false }); app.register(cors, { origin: true }); app.get('/health', async () => ({ ok: true, service: 'picas-fijas-api' })); app.get('/config', async () => ({ apiVersion: 'v1', onlineFeatures: false })); return app; }
const port = Number(process.env.PORT ?? 3000); if (process.argv[1]?.endsWith('server.js')) createServer().listen({ port, host: '0.0.0.0' });
