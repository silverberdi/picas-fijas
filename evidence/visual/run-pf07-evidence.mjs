import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('evidence/visual/pf07');
const manifestPath = path.resolve('evidence/pf07-visual-evidence.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.change !== 'req-7-pf-07-salas-publicas-y-busqueda-humana-e' || manifest.status !== 'fallback_applied' || manifest.blocking !== false) throw new Error('PF-07 manifest state is invalid');
if (manifest.viewports.join(',') !== '360x640,390x844,1280x720') throw new Error('PF-07 viewport matrix is incomplete');
const digest = crypto.createHash('sha256');
let checked = 0;
for (const item of manifest.evidence) {
  const target = path.resolve(item.path);
  if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target)) throw new Error(`Missing PF-07 evidence: ${item.path}`);
  const png = fs.readFileSync(target);
  if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || png.length < 1000) throw new Error(`Invalid PNG: ${item.path}`);
  const width = png.readUInt32BE(16); const height = png.readUInt32BE(20);
  if (`${width}x${height}` !== item.viewport) throw new Error(`Unexpected viewport in ${item.path}`);
  const sha256 = crypto.createHash('sha256').update(png).digest('hex');
  if (sha256 !== item.sha256) throw new Error(`Digest mismatch in ${item.path}`);
  digest.update(item.path).update(png); checked += 1;
}
if (checked !== 30 || new Set(manifest.evidence.map((item) => item.state)).size !== 5) throw new Error(`Expected 30 PNGs and 5 states, got ${checked}`);
console.log(`PF-07 visual evidence deterministic: ${checked} annotated PNGs, digest ${digest.digest('hex')}`);
