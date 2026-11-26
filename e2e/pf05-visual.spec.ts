import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const evidenceRoot = path.resolve('evidence/visual/pf05');
const screens = ['create-room.html', 'join-room.html', 'waiting.html', 'duel-online-mobile.html', 'race-online-mobile.html', 'duel-desktop.html', 'race-desktop.html', 'results.html'];
const viewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];

async function enterOnline(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Duelo humano 1v1/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.locator('[data-screen-catalog] button')).toHaveCount(8);
}

test('genera matriz visual PF-05 por pantalla, estado, tema y viewport', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await enterOnline(page);
    for (const theme of ['light', 'dark'] as const) {
      if (theme === 'dark') await page.getByRole('button', { name: 'Activar tema oscuro' }).click();
      for (const screen of screens) {
        await page.locator(`[data-screen="${screen}"]`).click();
        await expect(page.locator(`[data-screen="${screen}"]`)).toHaveClass(/selected/);
        const stem = screen.replace('.html', '').replaceAll('-', '_');
        await page.screenshot({ path: path.join(evidenceRoot, `pf05-${stem}-${viewport.width}x${viewport.height}-${theme}.png`), fullPage: false });
      }
      if (theme === 'dark') await page.getByRole('button', { name: 'Activar tema claro' }).click();
    }
  }
});
