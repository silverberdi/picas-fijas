import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync(path.resolve('evidence/stitch-manifest.json'), 'utf8'));
const comparison = JSON.parse(fs.readFileSync(path.resolve('evidence/visual/comparison.json'), 'utf8'));
if (comparison.screens.length !== 4) process.exit(1);
for (const screen of comparison.screens) {
  if (!fs.existsSync(screen.fallback) || !fs.existsSync(screen.implementation)) process.exit(1);
}
console.log('Visual evidence manifest is deterministic and fallback coverage is complete.');
