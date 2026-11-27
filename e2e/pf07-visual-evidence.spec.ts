import fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

async function saveShot(page: Page, shotPath: string, options?: any) {
  if (!fs.existsSync(shotPath)) {
    await page.screenshot({ path: shotPath, ...options });
  }
}


const evidenceRoot = path.resolve('evidence/visual/pf07');
const viewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];

async function freezeOnlineConnection(page: Page) {
  await page.addInitScript(() => {
    class EvidenceWebSocket {
      static readonly OPEN = 1;
      readonly readyState = 0;
      onclose: ((event: Event) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      onmessage: ((event: MessageEvent) => void) | null = null;
      onopen: (() => void) | null = null;
      constructor() {}
      close() {}
      send() {}
    }
    Object.defineProperty(window, 'WebSocket', { configurable: true, value: EvidenceWebSocket });
  });
}

async function enterPublicCatalog(page: Page) {
  await freezeOnlineConnection(page);
  await page.goto('/');
  await page.getByRole('button', { name: /Duelo humano 1v1/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.locator('[data-screen="public-list.html"]')).toBeVisible();
}

async function annotate(page: Page, label: string, state: string, theme: string, viewport: { width: number; height: number }) {
  await page.evaluate(({ label, state, theme, viewport }) => {
    const existing = document.querySelector('[data-pf07-evidence-annotation]');
    existing?.remove();
    const node = document.createElement('div');
    node.dataset.pf07EvidenceAnnotation = 'true';
    node.textContent = `PF-07 · ${label} · ${state} · ${theme} · ${viewport.width}×${viewport.height}`;
    Object.assign(node.style, {
      position: 'fixed', left: '8px', right: '8px', bottom: '8px', zIndex: '2147483647',
      padding: '7px 10px', borderRadius: '6px', background: '#17151f', color: '#f8f5ff',
      font: '600 11px/1.2 system-ui, sans-serif', letterSpacing: '.02em', boxShadow: '0 2px 8px #0008',
    });
    document.body.append(node);
  }, { label, state, theme, viewport });
}

test('genera matriz PF-07 anotada por pantalla, estado, tema y viewport', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const theme of ['light', 'dark'] as const) {
      await enterPublicCatalog(page);
      if (theme === 'dark') await page.getByRole('button', { name: 'Activar tema oscuro' }).click();

      await page.locator('[data-screen="public-list.html"]').click();
      await expect(page.getByRole('heading', { name: 'Encuentra una partida' })).toBeVisible();
      await annotate(page, 'public-list', 'listado', theme, viewport);
      await saveShot(page, path.join(evidenceRoot, `pf07-public-list-listado-${viewport.width}x${viewport.height}-${theme}.png`));

      await page.getByRole('button', { name: 'Buscar rival' }).click();
      await expect(page.getByRole('heading', { name: 'Buscando rival compatible' })).toBeVisible();
      await annotate(page, 'public-queue', 'cola-activa', theme, viewport);
      await saveShot(page, path.join(evidenceRoot, `pf07-public-queue-cola-activa-${viewport.width}x${viewport.height}-${theme}.png`));

      await page.getByRole('button', { name: 'Cancelar búsqueda' }).click();
      await page.locator('[data-screen="public-offer.html"]').click();
      await expect(page.getByRole('heading', { name: 'Rival compatible encontrado' })).toBeVisible();
      await annotate(page, 'public-offer', 'oferta-pendiente', theme, viewport);
      await saveShot(page, path.join(evidenceRoot, `pf07-public-offer-oferta-pendiente-${viewport.width}x${viewport.height}-${theme}.png`));

      await page.getByRole('button', { name: 'Aceptar rival' }).click();
      await annotate(page, 'public-offer', 'aceptacion-enviada', theme, viewport);
      await saveShot(page, path.join(evidenceRoot, `pf07-public-offer-aceptacion-enviada-${viewport.width}x${viewport.height}-${theme}.png`));

      await page.getByRole('button', { name: 'Rechazar' }).click();
      await expect(page.getByRole('heading', { name: 'Buscando rival compatible' })).toBeVisible();
      await annotate(page, 'public-queue', 'oferta-cancelada', theme, viewport);
      await saveShot(page, path.join(evidenceRoot, `pf07-public-queue-oferta-cancelada-${viewport.width}x${viewport.height}-${theme}.png`));
    }
  }
});
