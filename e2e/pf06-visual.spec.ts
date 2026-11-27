import fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const evidenceRoot = path.resolve('evidence/visual/pf06');
const viewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];
const states = [
  { id: 'reconnection', screen: 'reconnect.html' },
  { id: 'abandonment', screen: 'results.html' },
  { id: 'interruption', screen: 'results.html' },
  { id: 'rematch', screen: 'waiting.html' },
  { id: 'results', screen: 'results.html' },
] as const;

async function enterOnline(page: Page) {
  await page.addInitScript(() => {
    (globalThis as typeof globalThis & { __PICAS_FIJAS_CONFIG__?: { wsUrl: string } }).__PICAS_FIJAS_CONFIG__ = { wsUrl: 'ws://127.0.0.1:3000' };
  });
  await page.goto('/');
  await page.getByRole('button', { name: /Duelo humano 1v1/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.locator('[data-screen-catalog] button')).toHaveCount(9);
}

test('genera evidencia PF-06 por estado, tema y viewport', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await enterOnline(page);
    for (const theme of ['light', 'dark'] as const) {
      if (theme === 'dark') await page.getByRole('button', { name: 'Activar tema oscuro' }).click();
      for (const state of states) {
        await page.locator(`[data-screen="${state.screen}"]`).click();
        await expect(page.locator(`[data-route-screen="${state.screen}"]`)).toBeVisible();
        const shotPath = path.join(evidenceRoot, `pf06-${state.id}-${viewport.width}x${viewport.height}-${theme}.png`);

        if (!fs.existsSync(shotPath)) {

          await page.screenshot({ path: shotPath, fullPage: false });

        }
      }
      if (theme === 'dark') await page.getByRole('button', { name: 'Activar tema claro' }).click();
    }
  }
});

async function createRoom(page: Page) {
  await enterOnline(page);
  await page.getByRole('button', { name: 'Conectar para crear' }).click();
  await expect(page.locator('.online-state')).toHaveText('Conectado');
  await page.locator('[data-route-screen="create-room.html"]').getByRole('button', { name: 'Crear sala' }).click();
  const roomCode = page.locator('[data-route-screen="waiting.html"] .room-code');
  await expect(roomCode).not.toHaveText('Código pendiente');
  return (await roomCode.innerText()).replace('Sala ', '').trim();
}

async function joinRoom(page: Page, code: string) {
  await enterOnline(page);
  await page.getByRole('button', { name: 'Conectar', exact: true }).click();
  await expect(page.locator('.online-state')).toHaveText('Conectado');
  await page.locator('[data-screen="join-room.html"]').click();
  await page.locator('[data-route-screen="join-room.html"] #room-code-route').fill(code);
  await page.locator('[data-route-screen="join-room.html"]').getByRole('button', { name: 'Unirse', exact: true }).click();
}

async function ready(page: Page) {
  const button = page.locator('[data-route-screen="waiting.html"]').getByRole('button', { name: 'Estoy listo' });
  await expect(button).toBeEnabled();
  await button.click();
}

test('recorre abandono, interrupción y revancha con dos navegadores reales', async ({ browser }) => {
  const first = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const second = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const code = await createRoom(first);
  await joinRoom(second, code);
  await expect(first.getByText('Sala llena: ambos participantes deben estar listos.')).toBeVisible();
  await ready(first); await ready(second);
  await expect(first.locator('[data-route-screen="duel-online-mobile.html"]')).toBeVisible();

  await first.locator('[data-screen="reconnect.html"]').click();
  await first.getByRole('button', { name: 'Informar interrupción' }).click();
  await expect(first.locator('[data-route-screen="results.html"]')).toBeVisible();
  await expect(first.getByText('Interrupción neutral')).toBeVisible();

  await second.locator('[data-screen="results.html"]').click();
  await second.getByRole('button', { name: 'Solicitar revancha' }).click();
  await first.getByRole('button', { name: 'Solicitar revancha' }).click();
  await expect(first.locator('[data-route-screen="duel-online-mobile.html"]')).toBeVisible();

  await first.locator('[data-screen="reconnect.html"]').click();
  await first.getByRole('button', { name: 'Renunciar' }).click();
  await expect(first.locator('[data-route-screen="results.html"]')).toBeVisible();
  await expect(first.locator('[data-route-screen="results.html"] [role="status"]')).toContainText(/Victoria|Empate|Abandono/);
  await first.close(); await second.close();
});
