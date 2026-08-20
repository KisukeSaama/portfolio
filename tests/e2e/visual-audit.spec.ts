import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/en", "/fr", "/en/journey", "/en/episort"] as const;

for (const path of pages) {
  test(`visual audit without overflow: ${path}`, async ({
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
    // Theme tokens transition over 180 ms; sampling mid-transition pairs dark text with the light
    // background and reports false contrast failures, so the swap is made instant first.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
    });
    // Let the browser commit the theme tokens before Axe samples computed colors. Without this,
    // mobile Chromium can catch the background and text on opposite sides of the same transition.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
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
