import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const viewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];
const evidenceRoot = path.resolve('evidence/visual/pf08');

async function seedLocalResult(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('picas-fijas-local', 2);
    request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains('game-results')) db.createObjectStore('game-results', { keyPath: 'resultId' }); if (!db.objectStoreNames.contains('preferences')) db.createObjectStore('preferences', { keyPath: 'id' }); };
    request.onerror = () => reject(request.error); request.onsuccess = () => { const db = request.result; const transaction = db.transaction('game-results', 'readwrite'); transaction.objectStore('game-results').put({ resultId: 'e2e-win', schemaVersion: 2, mode: 'classic', rules: '3-unique-10', difficulty: 'classic', intelligence: 'human', assistance: 'none', outcome: 'victory', durationMs: 12_000, attempts: 1, minAttempts: 1, occurredAt: 1_000 }); transaction.oncomplete = () => { db.close(); resolve(); }; transaction.onerror = () => reject(transaction.error); };
  }));
}

test.describe('PF-08 memoria local', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('picas-fijas-local', 2);
      request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains('game-results')) db.createObjectStore('game-results', { keyPath: 'resultId' }); if (!db.objectStoreNames.contains('preferences')) db.createObjectStore('preferences', { keyPath: 'id' }); };
      request.onerror = () => reject(request.error); request.onsuccess = () => { const db = request.result; const transaction = db.transaction(['game-results', 'preferences'], 'readwrite'); transaction.objectStore('game-results').clear(); transaction.objectStore('preferences').clear(); transaction.oncomplete = () => { db.close(); resolve(); }; transaction.onerror = () => reject(transaction.error); };
    }));
  });

  test('muestra estado vacío, resultado filtrado, medalla y preferencias offline', async ({ page, context }) => {
    await page.getByRole('button', { name: 'Estadísticas' }).click();
    await expect(page.getByRole('heading', { name: 'Estadísticas' })).toBeVisible();
    await expect(page.getByText('Aún no hay resultados elegibles.')).toBeVisible();
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    await seedLocalResult(page);
    await page.reload();
    await page.getByRole('button', { name: 'Estadísticas' }).click();
    await expect(page.getByText('Primer triunfo')).toBeVisible();
    await expect(page.getByText('100%')).toBeVisible();
    await page.getByRole('button', { name: 'Individual clásico' }).last().click();
    await expect(page.getByText('Partidas')).toBeVisible();

    await page.getByRole('button', { name: 'Ajustes' }).click();
    await page.locator('#settings-theme').selectOption('dark');
    await page.getByLabel('Silenciar sonido').check();
    await page.getByRole('button', { name: 'Restablecer preferencias' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.locator('#settings-theme')).toHaveValue('dark');
    await page.getByRole('button', { name: 'Restablecer preferencias' }).click();
    await page.getByRole('button', { name: 'Confirmar restablecimiento' }).click();
    await expect(page.locator('#settings-theme')).toHaveValue('light');
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('button', { name: 'Estadísticas' }).click();
    await expect(page.getByText('Primer triunfo')).toBeVisible();
  });

  for (const viewport of viewports) {
    test(`genera captura anotada de estadísticas y ajustes en ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await seedLocalResult(page);
      await page.reload();
      await page.getByRole('button', { name: 'Estadísticas' }).click();
      await expect(page.getByRole('heading', { name: 'Estadísticas' })).toBeVisible();
      await page.screenshot({ path: path.join(evidenceRoot, `pf08-stats-light-${viewport.width}x${viewport.height}.png`), fullPage: true });
      await page.getByRole('button', { name: 'Ajustes' }).click();
      await page.getByRole('button', { name: 'Activar tema oscuro' }).click();
      await page.screenshot({ path: path.join(evidenceRoot, `pf08-settings-dark-${viewport.width}x${viewport.height}.png`), fullPage: true });
      testInfo.attach('state', { body: `stats-light/settings-dark ${viewport.width}x${viewport.height}`, contentType: 'text/plain' });
    });
  }
});
