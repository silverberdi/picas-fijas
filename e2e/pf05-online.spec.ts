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
