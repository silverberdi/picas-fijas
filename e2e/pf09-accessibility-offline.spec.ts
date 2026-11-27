import { test, expect } from '@playwright/test';
import path from 'node:path';

test.describe('PF-09 accesibilidad, preferencias y offline', () => {
  test('expone nombres, foco visible, preferencias audiovisuales y worker local', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
    await page.getByRole('button', { name: 'Ajustes' }).click();
    await page.getByLabel('Silenciar sonido').check();
    await page.getByLabel('Reducir movimiento').check();
    await expect(page.locator('main.motion-reduced')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus-visible')).toHaveCount(1);
    const worker = await page.evaluate(async () => { await navigator.serviceWorker.ready; return navigator.serviceWorker.getRegistration('./').then((registration) => Boolean(registration?.active?.scriptURL.endsWith('/pf-sw.js'))); });
    expect(worker).toBeTruthy();
  });

  test('mantiene tutorial y partida local tras corte de red', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Cómo jugar' }).click();
    await expect(page.getByRole('heading', { name: 'Cómo jugar' })).toBeVisible();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Cómo jugar' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Tu próxima gran/ })).toBeVisible();
    for (const mode of ['Individual clásico', 'Duelo máquina', 'Carrera máquina']) {
      await page.getByRole('button', { name: new RegExp(mode) }).click();
      await page.getByRole('button', { name: 'Comenzar partida' }).click();
      await expect(page.getByText('Disponible sin conexión')).toBeVisible();
      await page.getByRole('button', { name: 'Abandonar partida' }).click();
      await page.getByRole('button', { name: 'Ir al inicio', exact: true }).last().click();
    }
  });

  for (const viewport of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }]) {
    test(`captura estado de ajustes y juego en ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.getByRole('button', { name: 'Ajustes' }).click();
      await page.screenshot({ path: path.resolve('evidence/visual/pf09', `settings-${viewport.width}x${viewport.height}.png`), fullPage: true });
      await page.getByRole('button', { name: 'Inicio', exact: true }).click();
      await page.getByRole('button', { name: 'Comenzar partida' }).click();
      await page.screenshot({ path: testInfo.outputPath(`classic-${viewport.width}x${viewport.height}.png`), fullPage: false });
      testInfo.attach('state', { body: `settings/classic ${viewport.width}x${viewport.height}`, contentType: 'text/plain' });
    });
  }
});
