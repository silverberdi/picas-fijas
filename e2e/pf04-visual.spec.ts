import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const evidenceRoot = path.resolve('evidence/visual');

async function chooseRace(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Carrera máquina/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
}

test('genera evidencia PNG comparativa de los estados PF-04', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /Duelo máquina/ }).click();
  await page.getByRole('button', { name: 'Comenzar partida' }).click();
  await expect(page.getByRole('heading', { name: 'Duelo contra La máquina' })).toBeVisible();
  await page.screenshot({ path: path.join(evidenceRoot, 'pf04-duel-active-mobile-light.png'), fullPage: false });

  await page.getByRole('button', { name: 'Abandonar partida' }).click();
  await page.locator('.result-panel').getByRole('button', { name: 'Ir al inicio' }).click();
  await chooseRace(page);
  await expect(page.getByRole('heading', { name: 'Carrera contra La máquina' })).toBeVisible();
  await page.screenshot({ path: path.join(evidenceRoot, 'pf04-race-active-mobile-light.png'), fullPage: false });

  await page.getByRole('button', { name: 'Abandonar partida' }).click();
  await expect(page.getByRole('heading', { name: 'Empate' })).toBeVisible();
  await page.screenshot({ path: path.join(evidenceRoot, 'pf04-race-result-mobile-light.png'), fullPage: false });
});
