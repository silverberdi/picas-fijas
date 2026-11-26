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

test('duelo contra La máquina conserva controles, estado de cálculo y privacidad del rival', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Duelo máquina/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.getByRole('heading', { name: /Duelo contra La máquina/ })).toBeVisible();
  await expect(page.getByText('La máquina', { exact: true })).toBeVisible();
  await expect(page.getByText('Intentos rivales ocultos hasta el resultado.')).toHaveCount(0);
  await page.getByRole('button', { name: 'Abandonar partida' }).click();
  await expect(page.getByRole('heading', { name: 'Empate' })).toBeVisible();
});

test('carrera contra La máquina oculta el historial rival y mantiene scroll interno', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /Carrera máquina/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.getByRole('heading', { name: /Carrera contra La máquina/ })).toBeVisible();
  await expect(page.getByText('Intentos rivales ocultos hasta el resultado.')).toBeVisible();
  await expect(page.locator('.history-scroll')).toHaveCSS('overflow-y', 'auto');
  await expect(page.getByRole('button', { name: 'Confirmar' })).toBeVisible();
  await page.getByRole('button', { name: 'Abandonar partida' }).click();
  await expect(page.getByRole('heading', { name: 'Empate' })).toBeVisible();
});

test('la dificultad difícil mantiene la interfaz responsiva con seis dígitos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Carrera máquina/ }).click();
  await page.getByRole('button', { name: 'Personalizado' }).click();
  await page.locator('#custom-length').fill('6');
  await page.locator('#custom-repeats').check();
  await page.locator('#custom-has-limit').check();
  await page.locator('#custom-attempts').fill('12');
  await page.getByRole('button', { name: 'Aplicar configuración' }).click();
  await page.locator('#machine-difficulty').selectOption('hard');
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.getByRole('heading', { name: 'Carrera contra La máquina' })).toBeVisible();
  await expect(page.getByText('Teclado: escribe 6 dígitos y pulsa Enter.')).toBeVisible();

  await page.keyboard.type('123456');
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByRole('status')).toContainText('La máquina está calculando');
  await expect(page.getByRole('button', { name: 'Confirmar' })).toBeEnabled({ timeout: 2000 });
  await expect(page.getByRole('heading', { name: 'Carrera contra La máquina' })).toBeVisible();
});

test('la carrera contra La máquina publica el resultado final tras cerrar la partida', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Carrera máquina/ }).click();
  await page.getByRole('button', { name: 'Personalizado' }).click();
  await page.locator('#custom-length').fill('3');
  await page.locator('#custom-repeats').check();
  await page.locator('#custom-has-limit').check();
  await page.locator('#custom-attempts').fill('1');
  await page.getByRole('button', { name: 'Aplicar configuración' }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await page.getByRole('button', { name: 'Añadir dígito 9' }).click();
  await page.getByRole('button', { name: 'Añadir dígito 8' }).click();
  await page.getByRole('button', { name: 'Añadir dígito 7' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();

  await expect(page.getByRole('heading', { name: /^(¡Victoria!|Empate|Partida terminada)$/ })).toBeVisible({ timeout: 3000 });
  await expect(page.getByText('La máquina', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Volver a jugar' })).toBeVisible();
});
