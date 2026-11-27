import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('apps/web/src');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/RESOURCE-MANIFEST.json'), 'utf8'));
const rows = manifest.resources.map((resource) => {
  const file = path.join(root, resource.path);
  if (!fs.existsSync(file)) throw new Error(`Recurso faltante: ${resource.path}`);
  return { ...resource, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') };
});
const source = fs.readFileSync(path.join(root, 'pf-sw.js'), 'utf8') + fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const remote = source.match(/https?:\/\//g) ?? [];
if (remote.length) throw new Error(`Dependencias remotas obligatorias: ${remote.length}`);
const report = { change: 'req-9-pf-09-calidad-audiovisual-accesibilidad', generatedAt: 'deterministic-apply', remoteRequestsInShell: 0, resources: rows };
fs.mkdirSync('evidence/visual/pf09', { recursive: true });
fs.writeFileSync('evidence/visual/pf09/offline-network-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ resources: rows.length, remoteRequestsInShell: 0, report: 'evidence/visual/pf09/offline-network-audit.json' }));
