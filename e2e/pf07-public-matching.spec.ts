import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }]) {
  test(`salas públicas y oferta bilateral son navegables en ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport); await page.goto('/');
    await page.getByRole('button', { name: /Duelo humano 1v1/ }).click(); await page.getByRole('button', { name: 'Comenzar partida' }).click();
    await page.locator('[data-screen="public-list.html"]').click(); await expect(page.getByRole('heading', { name: 'Encuentra una partida' })).toBeVisible();
    await page.getByRole('button', { name: 'Buscar rival' }).click(); await expect(page.getByRole('heading', { name: 'Buscando rival compatible' })).toBeVisible();
    await expect(page.getByText(/La máquina continúa/)).toBeVisible(); await page.getByRole('button', { name: 'Cancelar búsqueda' }).click();
    await page.locator('[data-screen="public-offer.html"]').click(); await expect(page.getByRole('heading', { name: 'Rival compatible encontrado' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Silenciar sonido' })).toBeVisible(); await page.getByRole('button', { name: 'Silenciar sonido' }).click();
    await expect(page.getByRole('button', { name: 'Activar sonido' })).toBeVisible();
  });
}
