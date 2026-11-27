const VERSION = 'pf09-shell-v3';
const STAGING = `${VERSION}-staging`;
const CORE = ['./', './index.html', './manifest.webmanifest', './offline.html', './assets/icons/favicon.svg', './assets/icons/icon-192.svg', './assets/icons/icon-512.svg'];

async function precache() {
  // A failed addAll rejects the whole install. The staging cache is removed so
  // an incomplete candidate can never be mistaken for the active shell.
  await caches.delete(STAGING);
  const cache = await caches.open(STAGING);
  try {
    await cache.addAll(CORE);
    const response = await fetch('./');
    if (!response.ok) throw new Error(`shell fetch failed: ${response.status}`);
    const html = await response.clone().text();
    await cache.put('./', response);
    const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((asset) => asset.startsWith('./') || asset.startsWith('main-') || asset.startsWith('polyfills-') || asset.startsWith('styles-'));
    await cache.addAll([...new Set(assets)]);
    await Promise.all(CORE.map(async (resource) => {
      if (!(await cache.match(resource))) throw new Error(`missing precache resource: ${resource}`);
    }));
  } catch (error) {
    await caches.delete(STAGING);
    throw error;
  }
}

self.addEventListener('install', (event) => { event.waitUntil(precache().then(() => self.skipWaiting())); });
self.addEventListener('activate', (event) => { event.waitUntil(caches.open(STAGING).then(async (staging) => { const entries = await staging.keys(); if (!entries.length) throw new Error('staging cache is empty'); const active = await caches.open(VERSION); await Promise.all(entries.map(async (request) => { const response = await staging.match(request); if (!response) throw new Error(`staging entry disappeared: ${request.url}`); await active.put(request, response); })); await caches.delete(STAGING); const keys = await caches.keys(); await Promise.all(keys.filter((key) => key.startsWith('pf09-') && key !== VERSION).map((key) => caches.delete(key))); await self.clients.claim(); })); });
self.addEventListener('fetch', (event) => { if (event.request.method !== 'GET') return; event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => { if (new URL(event.request.url).origin === self.location.origin) { const copy = response.clone(); void caches.open(VERSION).then((cache) => cache.put(event.request, copy)); } return response; }).catch(() => caches.match('./offline.html')))); });
