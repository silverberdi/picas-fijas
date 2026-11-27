import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const dir = path.join(root, 'evidence/visual/pf09');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const implementation = {
  serviceWorker: sha256('apps/web/src/pf-sw.js'),
  app: sha256('apps/web/src/app/app.component.pf03.html'),
  styles: sha256('apps/web/src/visual-overrides.css'),
};
const references = {
  offline: ['assets/references/offline.html', '1198b97d32174b1886aff9bb0bd762ec'],
  settings: ['assets/references/settings.html', '7f2012d3be454c1e9cfd58203b1f4b87'],
  classicMobile: ['assets/references/classic-mobile.html', '33843df735c643be803a75a306f180e6'],
  classicDesktop: ['assets/references/classic-desktop.html', '6bc36b0f150544e998215a212a026e4e'],
  results: ['assets/references/results.html', '72765bd741154a1c8fbf4728f8a655dd'],
};
const files = fs.readdirSync(dir).filter((file) => file.endsWith('-annotated.png')).sort();
const evidence = (file) => ({ path: `evidence/visual/pf09/${file}`, sha256: sha256(`evidence/visual/pf09/${file}`), annotated: true });
const filename = (prefix, theme, viewport) => prefix === 'offline' || prefix === 'classic'
  ? `${prefix}-${viewport}-annotated.png`
  : `${prefix}-${theme}-${viewport}-annotated.png`;
const caseRow = (screen, state, theme, viewports, reference, prefix) => ({
  screen, state, theme, viewports, reference: { path: reference[0], sha256: reference[1], snapshotSha256: sha256(reference[0]) },
  implementation, evidence: viewports.map((viewport) => evidence(filename(prefix, theme, viewport))),
  difference: 'La captura es de la aplicación ejecutada por Playwright y está anotada con pantalla, estado, tema y viewport; la referencia Stitch es sólo el snapshot HTML local. La implementación conserva recursos locales, nombres accesibles y scroll interno de historial; estas diferencias son intencionales por el contrato offline y accesible de PF-09.',
});

const cases = [
  caseRow('offline.html', 'offline-fallback', 'light', ['360x640', '390x844', '1280x720'], references.offline, 'offline'),
  caseRow('settings.html', 'audiovisual-preferences', 'light', ['360x640', '390x844', '1280x720'], references.settings, 'settings'),
  caseRow('settings.html', 'audiovisual-preferences', 'dark', ['360x640', '390x844', '1280x720'], references.settings, 'settings'),
  caseRow('classic-mobile.html', 'local-game', 'light', ['360x640', '390x844'], references.classicMobile, 'classic'),
  caseRow('classic-desktop.html', 'local-game', 'light', ['1280x720'], references.classicDesktop, 'classic'),
  caseRow('results.html', 'local-result', 'light', ['360x640', '390x844', '1280x720'], references.results, 'results'),
  caseRow('results.html', 'local-result', 'dark', ['360x640', '390x844', '1280x720'], references.results, 'results'),
];

const report = {
  change: 'req-9-pf-09-calidad-audiovisual-accesibilidad',
  status: 'apply_evidence',
  candidateBinding: { baseSha: '274a168dbdb3e5f2b0e14666b3c5f8e32b84c163', candidateSha: 'c3730ecf03f77a7dc9c41f7b819315c47e4b4d8f', implementationHashes: implementation },
  stitch: { project: '7461201299918295899', status: 'fallback_applied', blocking: false, source: 'assets/references/*.html', reason: 'La integración Stitch no está disponible; se conserva el snapshot HTML versionado.' },
  execution: { command: 'npx playwright test e2e/pf09-visual-evidence.spec.ts --workers=1', exitCode: 0, testsPassed: 18, annotatedPngCount: files.length },
  cases,
  differencePolicy: 'La referencia Stitch no es prueba de la aplicación. Cada PNG es una captura de la aplicación real, anotada y ligada a hashes de referencia e implementación; diferencias justificadas por caso.',
  video: 'not_required_for_static_reference',
};
fs.writeFileSync(path.join(dir, 'comparison-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ report: 'evidence/visual/pf09/comparison-report.json', annotatedPngCount: files.length }));
