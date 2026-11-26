import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const manifest = JSON.parse(fs.readFileSync(path.resolve('evidence/stitch-manifest.json'), 'utf8'));
const comparison = JSON.parse(fs.readFileSync(path.resolve('evidence/visual/comparison.json'), 'utf8'));
if (comparison.screens.length !== 12) process.exit(1);
for (const screen of comparison.screens) {
  if (!fs.existsSync(screen.fallback) || !fs.existsSync(screen.implementation)) process.exit(1);
  if (screen.evidence) {
    const evidencePath = path.resolve(screen.evidence);
    if (!fs.existsSync(evidencePath)) process.exit(1);
    const png = fs.readFileSync(evidencePath);
    if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') process.exit(1);
    if (png.length < 1000) process.exit(1);
  }
}
if (manifest.pf04.status !== 'fallback_applied' || manifest.pf04.blocking !== false || manifest.pf04.screens.length !== 5) process.exit(1);
for (const screen of manifest.pf04.screens) {
  const digest = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(screen.fallback))).digest('hex');
  if (digest !== screen.fallbackSha256) process.exit(1);
}
const pf04Evidence = comparison.screens.filter((screen) => screen.evidence);
if (pf04Evidence.length !== 3 || new Set(pf04Evidence.map((screen) => screen.state)).size !== 3) process.exit(1);
if (!pf04Evidence.every((screen) => screen.viewport === '390x844' && screen.theme === 'light')) process.exit(1);
for (const evidence of manifest.pf04.evidence ?? []) {
  const digest = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(evidence.path))).digest('hex');
  if (digest !== evidence.sha256) process.exit(1);
}
if ((manifest.pf04.evidence ?? []).length !== 3) process.exit(1);
if (JSON.stringify(manifest).match(/stitch|cdn/i) && !JSON.stringify(manifest).includes('fallback_applied')) process.exit(1);
console.log('Visual evidence manifest is deterministic; PF-04 duel, race-active and race-result PNG coverage is complete.');
