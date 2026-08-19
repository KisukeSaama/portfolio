import { expect, test } from "@playwright/test";

test("public navigation, language switch and theme", async ({ page }) => {
  await page.goto("/");
  // An unprefixed visit is redirected to a locale; the test client asks for English.
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Full-stack developer",
  );
  await page
    .getByRole("link", { name: /Read the case study/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/en\/episort$/);

  // On mobile both controls live in the same menu, and switching language navigates away, so the
  // theme is toggled first while the menu is still open.
  if ((page.viewportSize()?.width ?? 1200) < 900)
    await page.getByLabel("Open the menu").click();
  await page.getByRole("button", { name: "Switch to the dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: /Change language/ }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Français/ })
    .click();
  await expect(page).toHaveURL(/\/fr\/episort$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  // The footer is outside the collapsible menu, so it proves the translation on every viewport.
  await expect(
    page.getByRole("link", { name: "Mentions légales" }),
  ).toBeVisible();
});
