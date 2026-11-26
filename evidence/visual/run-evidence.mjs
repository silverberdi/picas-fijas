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
if (manifest.pf06?.status !== 'fallback_applied' || manifest.pf06?.blocking !== false || manifest.pf06.screens.length !== 2) process.exit(1);
for (const screen of manifest.pf06.screens) {
  const digest = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(screen.fallback))).digest('hex');
  if (digest !== screen.fallbackSha256) process.exit(1);
}
for (const evidence of manifest.pf06.evidence ?? []) {
  const digest = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(evidence.path))).digest('hex');
  if (digest !== evidence.sha256) process.exit(1);
}
if ((manifest.pf06.evidence ?? []).length !== 3) process.exit(1);
const browserEvidence = manifest.pf06.browserEvidence;
if (browserEvidence?.runner !== 'e2e/pf06-visual.spec.ts' || browserEvidence.count !== 30) process.exit(1);
const expectedStates = ['reconnection', 'abandonment', 'interruption', 'rematch', 'results'];
const expectedViewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];
const expectedThemes = ['light', 'dark'];
if (JSON.stringify(browserEvidence.states) !== JSON.stringify(expectedStates) || JSON.stringify(browserEvidence.viewports) !== JSON.stringify(expectedViewports) || JSON.stringify(browserEvidence.themes) !== JSON.stringify(expectedThemes)) process.exit(1);
for (const state of expectedStates) for (const viewport of expectedViewports) for (const theme of expectedThemes) {
  const evidencePath = path.resolve(`evidence/visual/pf06/pf06-${state}-${viewport.width}x${viewport.height}-${theme}.png`);
  if (!fs.existsSync(evidencePath)) process.exit(1);
  const png = fs.readFileSync(evidencePath);
  if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || png.readUInt32BE(16) !== viewport.width || png.readUInt32BE(20) !== viewport.height) process.exit(1);
}
if (JSON.stringify(manifest).match(/stitch|cdn/i) && !JSON.stringify(manifest).includes('fallback_applied')) process.exit(1);
console.log('Visual evidence manifest is deterministic; PF-04 and PF-06 coverage is complete.');
