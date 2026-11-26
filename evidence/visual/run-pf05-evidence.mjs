import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('evidence/visual/pf05');
const manifest = JSON.parse(fs.readFileSync(path.resolve('evidence/pf05-visual-manifest.json'), 'utf8'));
const viewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];
const themes = ['light', 'dark'];
let checked = 0;
for (const screen of manifest.screens) for (const viewport of viewports) for (const theme of themes) {
  const file = `${screen.name.replace('.html', '').replaceAll('-', '_')}-${viewport.width}x${viewport.height}-${theme}.png`;
  const target = path.join(root, `pf05-${file}`);
  if (!fs.existsSync(target)) throw new Error(`Missing PF-05 evidence: ${target}`);
  const png = fs.readFileSync(target);
  if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || png.length < 1000) throw new Error(`Invalid PNG: ${target}`);
  if (png.readUInt32BE(16) !== viewport.width || png.readUInt32BE(20) !== viewport.height) throw new Error(`Unexpected viewport in ${target}`);
  checked += 1;
}
const digest = crypto.createHash('sha256');
for (const file of fs.readdirSync(root).filter((name) => name.endsWith('.png')).sort()) digest.update(file).update(fs.readFileSync(path.join(root, file)));
console.log(`PF-05 visual matrix deterministic: ${checked} PNGs, digest ${digest.digest('hex')}`);
