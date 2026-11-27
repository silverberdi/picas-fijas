import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const output = (name: string) => path.resolve("evidence/visual/pf10", name);
const viewports = [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 720 }];

async function annotate(page: import("@playwright/test").Page, label: string) {
  await page.evaluate((text) => {
    const banner = document.createElement("div");
    banner.textContent = `PF-10 · ${text}`;
    Object.assign(banner.style, { position: "fixed", zIndex: "2147483647", top: "0", left: "0", right: "0", padding: "7px 12px", background: "#30234d", color: "#fff6e8", font: "700 12px system-ui" });
    document.body.append(banner);
  }, label);
}

async function saveScreenshot(page: import("@playwright/test").Page, filepath: string) {
  if (!fs.existsSync(filepath)) {
    await page.screenshot({ path: filepath, fullPage: false });
  }
}

test.describe("PF-10 evidencia visual anotada", () => {
  for (const theme of ["light", "dark"]) {
    for (const viewport of viewports) {
      test(`partida clásica ${theme} ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        if (theme === "dark") await page.getByRole("button", { name: "Activar tema oscuro" }).click();
        await page.getByRole("button", { name: "Comenzar partida" }).click();
        await expect(page.getByRole("button", { name: "Confirmar" })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true);
        await annotate(page, `classic-game · ${theme} · ${viewport.width}x${viewport.height}`);
        await saveScreenshot(page, output(`classic-${theme}-${viewport.width}x${viewport.height}-annotated.png`));
      });

      test(`resultado por interrupción ${theme} ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        if (theme === "dark") await page.getByRole("button", { name: "Activar tema oscuro" }).click();
        await page.getByRole("button", { name: "Comenzar partida" }).click();
        await page.getByRole("button", { name: "Abandonar partida" }).click();
        await expect(page.getByRole("heading", { name: "Partida abandonada" })).toBeVisible();
        await annotate(page, `results-interruption · ${theme} · ${viewport.width}x${viewport.height}`);
        await saveScreenshot(page, output(`results-${theme}-${viewport.width}x${viewport.height}-annotated.png`));
      });
    }
  }

  for (const viewport of viewports) {
    test(`offline y configuración ${viewport.width}x${viewport.height}`, async ({ page, context }) => {
      await page.setViewportSize(viewport);
      await page.goto("/offline.html");
      await annotate(page, `offline-fallback · light · ${viewport.width}x${viewport.height}`);
      await saveScreenshot(page, output(`offline-${viewport.width}x${viewport.height}-annotated.png`));
      await context.setOffline(false);
      await page.goto("/");
      await page.getByRole("button", { name: "Ajustes" }).click();
      await expect(page.getByRole("heading", { name: "Ajustes" })).toBeVisible();
      await annotate(page, `settings · light · ${viewport.width}x${viewport.height}`);
      await saveScreenshot(page, output(`settings-${viewport.width}x${viewport.height}-annotated.png`));
    });
  }
});
