import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/episort", "/admin/login"] as const;

for (const path of pages) {
  test(`audit visuel sans débordement : ${path}`, async ({
    page,
  }, testInfo) => {
    await page.goto(path);
    await expect(page.locator("body")).toBeVisible();
    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBe(false);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      accessibility.violations,
      accessibility.violations
        .map((violation) => `${violation.id}: ${violation.help}`)
        .join("\n"),
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`${path.replaceAll("/", "-") || "home"}.png`),
      fullPage: true,
    });
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
    });
    const darkAccessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      darkAccessibility.violations,
      darkAccessibility.violations
        .map((violation) => `${violation.id}: ${violation.help}`)
        .join("\n"),
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(
        `dark-${path.replaceAll("/", "-") || "home"}.png`,
      ),
      fullPage: true,
    });
  });
}

test("audit du parcours administrateur authentifié", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Adresse e-mail").fill("e2e@example.test");
  await page.getByLabel("Mot de passe").fill("test-only-password");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  for (const path of ["/admin", "/admin/projects", "/admin/projects/new"]) {
    await page.goto(path);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      accessibility.violations,
      `${path}\n${accessibility.violations
        .map((violation) => `${violation.id}: ${violation.help}`)
        .join("\n")}`,
    ).toEqual([]);
  }
});
