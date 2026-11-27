import fs from 'node:fs';
import { test } from '@playwright/test';
import type { Page } from '@playwright/test';
import path from 'node:path';

const output = (name: string) => path.resolve('evidence/visual/pf09', name);
async function saveScreenshot(page: Page, filepath: string, options?: any) {
  if (!fs.existsSync(filepath)) {
    await page.screenshot({ path: filepath, ...options });
  }
}

const viewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];

async function annotate(page: Page, label: string) {
  await page.evaluate((text: string) => {
    const banner = document.createElement('div');
    banner.textContent = `PF-09 · ${text}`;
    banner.setAttribute('data-pf09-annotation', 'true');
    Object.assign(banner.style, { position: 'fixed', zIndex: '2147483647', top: '0', left: '0', right: '0', padding: '7px 12px', background: '#30234d', color: '#fff6e8', font: '700 12px system-ui', letterSpacing: '.03em' });
    document.body.append(banner);
  }, label);
}

test.describe('PF-09 evidencia visual comparativa anotada', () => {
  for (const viewport of viewports) {
    test(`offline fallback ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/offline.html');
      await annotate(page, `offline-fallback · light · ${viewport.width}x${viewport.height}`);
      await saveScreenshot(page, output(`offline-${viewport.width}x${viewport.height}-annotated.png`), { fullPage: true });
    });
  }

  for (const theme of ['light', 'dark']) {
    for (const viewport of viewports) {
      test(`ajustes ${theme} ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.getByRole('button', { name: 'Ajustes' }).click();
        if (theme === 'dark') await page.getByRole('button', { name: 'Activar tema oscuro' }).click();
        await annotate(page, `settings · ${theme} · ${viewport.width}x${viewport.height}`);
        await saveScreenshot(page, output(`settings-${theme}-${viewport.width}x${viewport.height}-annotated.png`), { fullPage: true });
      });
    }
  }

  for (const viewport of viewports) {
    test(`partida clásica ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.getByRole('button', { name: 'Comenzar partida' }).click();
      await annotate(page, `classic-game · light · ${viewport.width}x${viewport.height}`);
      await saveScreenshot(page, output(`classic-${viewport.width}x${viewport.height}-annotated.png`), { fullPage: false });
    });
  }

  for (const theme of ['light', 'dark']) {
    for (const viewport of viewports) {
      test(`resultado local ${theme} ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        if (theme === 'dark') await page.getByRole('button', { name: 'Activar tema oscuro' }).click();
        await page.getByRole('button', { name: 'Comenzar partida' }).click();
        await page.getByRole('button', { name: 'Abandonar partida' }).click();
        await annotate(page, `results · ${theme} · ${viewport.width}x${viewport.height}`);
        await saveScreenshot(page, output(`results-${theme}-${viewport.width}x${viewport.height}-annotated.png`), { fullPage: true });
      });
    }
  }
});
