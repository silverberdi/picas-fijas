import { test, expect } from '@playwright/test';

test('las modalidades humanas abren una sala privada recuperable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /Duelo humano 1v1/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.getByRole('heading', { name: 'Juega con otra persona' })).toBeVisible();
  await expect(page.getByLabel('Código de sala')).toBeVisible();
  await expect(page.getByText('tu credencial privada no se comparte')).toBeVisible();
  await expect(page.locator('main')).toHaveClass(/app-shell/);
});

test('carrera humana conserva el estado de sala y el tema oscuro', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Carrera humana 1v1/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await page.getByRole('button', { name: 'Activar tema oscuro' }).click();
  await expect(page.getByText(/SALA PRIVADA · CARRERA/)).toBeVisible();
  await expect(page.locator('.app-shell')).toHaveClass(/dark-theme/);
});

test('PF-06 muestra la gracia pausada y el resultado neutral accesibles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /Duelo humano 1v1/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await page.locator('[data-screen="reconnect.html"]').click();
  await expect(page.getByRole('heading', { name: 'Conexión pausada' })).toBeVisible();
  await expect(page.getByText(/Cuenta atrás/)).toBeVisible();
  await page.locator('[data-screen="results.html"]').click();
  await expect(page.getByRole('heading', { name: 'Resultado online' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Solicitar revancha' })).toBeVisible();
});

test('catálogo online navega las nueve pantallas y conserva estados accesibles en dos contextos', async ({ browser }) => {
  const first = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const second = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const firstPage = await first.newPage(); const secondPage = await second.newPage();
  for (const page of [firstPage, secondPage]) {
    await page.goto('/');
    await page.getByRole('button', { name: /Duelo humano 1v1/ }).click();
    await page.getByRole('button', { name: 'Comenzar partida' }).click();
    await expect(page.locator('[data-screen-catalog] button')).toHaveCount(9);
    await page.locator('[data-screen="join-room.html"]').click();
    await expect(page.getByText(/CATÁLOGO ONLINE · join-room.html/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Activar tema oscuro' })).toBeVisible();
  }
  await first.close(); await second.close();
});
