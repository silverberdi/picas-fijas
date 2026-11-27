import { DEFAULT_ONLINE_CONFIG } from '../apps/api/dist/online/config.js';
import { OperationalMetrics, SlidingWindow } from '../apps/api/dist/online/metrics.js';
const window = new SlidingWindow(DEFAULT_ONLINE_CONFIG.messagesPerSecond, 1000);
const metrics = new OperationalMetrics(1000);
let accepted = 0; let rejected = 0;
for (let i = 0; i < DEFAULT_ONLINE_CONFIG.messagesPerSecond + 5; i += 1) { if (window.allow(i)) accepted += 1; else rejected += 1; metrics.record(window.allow(i) ? 'sessions' : 'limits', 'accepted'); }
console.log(JSON.stringify({ scenario_id: 'pf10-moderate-load', accepted, rejected, metrics: metrics.snapshot(1000), persistentStore: false, fullIp: false, secrets: false }, null, 2));
