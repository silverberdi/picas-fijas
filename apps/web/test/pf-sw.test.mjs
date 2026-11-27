import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../src/pf-sw.js', import.meta.url), 'utf8');

function workerHarness({ failOn } = {}) {
  const stores = new Map();
  const listeners = {};
  const cache = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const entries = stores.get(name);
    return {
      async addAll(resources) {
        for (const resource of resources) {
          if (resource === failOn) throw new Error(`missing ${resource}`);
          entries.set(resource, { resource });
        }
      },
      async put(request, response) { entries.set(typeof request === 'string' ? request : request.url, response); },
      async match(request) { return entries.get(typeof request === 'string' ? request : request.url); },
      async keys() { return [...entries.keys()].map((url) => ({ url })); },
    };
  };
  const context = {
    caches: {
      open: async (name) => cache(name),
      delete: async (name) => stores.delete(name),
      keys: async () => [...stores.keys()],
      match: async () => undefined,
    },
    fetch: async () => ({ ok: true, clone() { return this; }, async text() { return '<script src="main-abc.js"></script>'; } }),
    self: { addEventListener(type, handler) { listeners[type] = handler; }, skipWaiting() {}, clients: { claim() {} } },
    URL,
  };
  vm.runInNewContext(source, context);
  return { stores, listeners };
}

test('precache rejects and removes staging when a required resource is unavailable', async () => {
  const { stores, listeners } = workerHarness({ failOn: './offline.html' });
  const event = { waitUntil(promise) { this.promise = promise; } };
  listeners.install(event);
  await assert.rejects(event.promise);
  assert.equal(stores.has('pf09-shell-v3-staging'), false);
  assert.equal(stores.has('pf09-shell-v3'), false);
});

test('activation copies only a complete staging cache before retiring the previous version', async () => {
  const { stores, listeners } = workerHarness();
  stores.set('pf09-shell-v2', new Map([['./index.html', { old: true }]]));
  stores.set('pf09-shell-v3-staging', new Map([['./index.html', { new: true }]]));
  const event = { waitUntil(promise) { this.promise = promise; } };
  listeners.activate(event);
  await event.promise;
  assert.deepEqual(stores.get('pf09-shell-v3').get('./index.html'), { new: true });
  assert.equal(stores.has('pf09-shell-v2'), false);
  assert.equal(stores.has('pf09-shell-v3-staging'), false);
});
