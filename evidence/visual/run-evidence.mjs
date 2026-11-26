import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const manifest = JSON.parse(fs.readFileSync(path.resolve('evidence/stitch-manifest.json'), 'utf8'));
const comparison = JSON.parse(fs.readFileSync(path.resolve('evidence/visual/comparison.json'), 'utf8'));
if (comparison.screens.length !== 9) process.exit(1);
for (const screen of comparison.screens) {
  if (!fs.existsSync(screen.fallback) || !fs.existsSync(screen.implementation)) process.exit(1);
}
if (manifest.pf04.status !== 'fallback_applied' || manifest.pf04.blocking !== false || manifest.pf04.screens.length !== 5) process.exit(1);
for (const screen of manifest.pf04.screens) {
  const digest = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(screen.fallback))).digest('hex');
  if (digest !== screen.fallbackSha256) process.exit(1);
}
if (JSON.stringify(manifest).match(/stitch|cdn/i) && !JSON.stringify(manifest).includes('fallback_applied')) process.exit(1);
console.log('Visual evidence manifest is deterministic and fallback coverage is complete.');
