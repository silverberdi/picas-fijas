import Fastify from 'fastify';
import cors from '@fastify/cors';
import { readOnlineConfig } from './online/config.js';
import { RoomRegistry } from './online/rooms.js';
import { attachWebSocket } from './online/websocket.js';
import { PublicMatchRegistry } from './online/public-matching.js';
import { OperationalMetrics } from './online/metrics.js';
export function createServer(options: { config?: ReturnType<typeof readOnlineConfig> } = {}) { const config = options.config ?? readOnlineConfig(); const app = Fastify({ logger: false }); const registry = new RoomRegistry(config); const publicMatches = new PublicMatchRegistry(config.reservationTtlMs); const metrics = new OperationalMetrics(config.metricsTtlMs); app.register(cors, { origin: (origin, callback) => callback(null, !origin || config.allowedOrigins.includes(origin)) }); app.get('/health', async () => ({ ok: true, service: 'picas-fijas-api' })); app.get('/config', async () => ({ apiVersion: 'v1', onlineFeatures: true, protocolVersion: 'v1', maxParticipants: 2, ttlMs: config.roomTtlMs, limits: { maxMessageBytes: config.maxMessageBytes, messagesPerSecond: config.messagesPerSecond, maxConnectionsPerWindow: config.maxConnectionsPerWindow, maxReconnectsPerWindow: config.maxReconnectsPerWindow } })); app.get('/metrics', async () => metrics.snapshot()); app.get('/public-rooms', async () => ({ rooms: publicMatches.list() })); app.get('/public-matching/metrics', async () => publicMatches.metrics()); attachWebSocket(app.server, registry, config, publicMatches, metrics); return app; }
const config = readOnlineConfig(); if (process.argv[1]?.endsWith('server.js')) createServer({ config }).listen({ port: config.port, host: '0.0.0.0' });
