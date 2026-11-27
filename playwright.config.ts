import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './e2e', workers: 1, outputDir: 'test-results', reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]], use: { baseURL: 'http://127.0.0.1:4200', browserName: 'chromium', trace: 'on-first-retry', video: 'on' }, webServer: [
  { command: 'npm run build --workspace=@picas-fijas/web && npx http-server apps/web/dist/web/browser -p 4200', port: 4200, reuseExistingServer: true },
  { command: 'npm run build --workspace=@picas-fijas/api && PORT=3000 ALLOWED_ORIGINS=http://127.0.0.1:4200 node apps/api/dist/server.js', port: 3000, reuseExistingServer: true },
] });
