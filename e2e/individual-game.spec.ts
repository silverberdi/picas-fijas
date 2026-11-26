import { test, expect } from '@playwright/test';

test('tutorial local tiene navegación accesible y no depende de red', async ({ page, context }, testInfo) => {
  await page.goto('/');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Cómo jugar' }).click();
  await expect(page.getByRole('heading', { name: 'Cómo jugar' })).toBeVisible();
  await expect(page.getByText('Objetivo y fijas')).toBeVisible();
  await expect(page.getByText('Ayudas responsables')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('tutorial-light-390x844.png'), fullPage: false });
  await page.getByRole('button', { name: 'Volver al inicio' }).click();
  await expect(page.getByRole('heading', { name: '¿Cómo quieres jugar?' })).toBeVisible();
});

test('partida une teclado/tacto, notas y tres ayudas, y distingue abandono', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.getByRole('heading', { name: /Tu tablero está listo/ })).toBeVisible();
  await page.keyboard.type('123');
  await page.getByRole('button', { name: 'Borrar' }).click();
  await page.keyboard.type('1234');
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await page.locator('#digit-notes').fill('7 descartado');
  await page.locator('#position-notes').fill('posición 2');
  for (let i = 0; i < 4; i += 1) await page.getByRole('button', { name: /Pedir ayuda/ }).click();
  await expect(page.locator('.game-meta')).toContainText('3/3');
  await page.getByRole('button', { name: 'Abandonar partida' }).click();
  await expect(page.getByRole('heading', { name: 'Partida abandonada' })).toBeVisible();
  await expect(page.getByText('Código')).toBeVisible();
});

for (const viewport of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }]) {
  test(`partida conserva controles visibles y scroll sólo en historial ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.getByRole('button', { name: 'Comenzar partida' }).click();
    await expect(page.getByRole('button', { name: 'Confirmar' })).toBeVisible();
    await expect(page.locator('.history-scroll')).toHaveCSS('overflow-y', 'auto');
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`classic-light-${viewport.width}x${viewport.height}.png`), fullPage: false });
  });
}
