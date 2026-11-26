import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../dist/server.js';
test('health endpoint is in-memory and public', async () => { const app = createServer(); const response = await app.inject({ method: 'GET', url: '/health' }); assert.equal(response.statusCode, 200); assert.deepEqual(response.json(), { ok: true, service: 'picas-fijas-api' }); await app.close(); });
