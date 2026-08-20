import { expect, test } from "@playwright/test";

test("uses the OS theme on first visit and persists a manual choice", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("jonathan-theme")))
    .toBeNull();

  if ((page.viewportSize()?.width ?? 1200) < 900)
    await page.getByLabel("Open the menu").click();
  await page
    .getByRole("button", { name: "Switch to the light theme" })
    .click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("jonathan-theme")))
    .toBe("light");

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("public navigation, language switch and theme", async ({ page }) => {
  await page.goto("/");
  // An unprefixed visit is redirected to a locale; the test client asks for English.
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Full-stack developer",
  );
  await page
    .getByRole("link", { name: "Read the Episort case study" })
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

/**
 * The three ways the collapsed menu used to trap a visitor: it only closed from its own button, and
 * the language and theme entries only answered a press on their icon rather than on the row.
 */
test("the mobile menu dismisses itself and its rows are the controls", async ({
  page,
}) => {
  const viewport = page.viewportSize();
  test.skip(
    (viewport?.width ?? 1200) >= 900,
    "The collapsed menu only exists below 900 px.",
  );
  await page.goto("/en");
  const menu = page.locator(".mobile-nav");

  await page.getByLabel("Open the menu").click();
  await expect(menu).toHaveAttribute("open");

  // Four pixels from the left edge of the theme row: as far from the icon as the row goes.
  const themeRow = page.getByRole("button", { name: /Switch to the dark theme/ });
  const theme = (await themeRow.boundingBox())!;
  await page.mouse.click(theme.x + 4, theme.y + theme.height / 2);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const languageRow = page.getByRole("button", { name: /Change language/ });
  const language = (await languageRow.boundingBox())!;
  await page.mouse.click(language.x + 4, language.y + language.height / 2);
  await expect(page.getByRole("dialog")).toBeVisible();
  // Escape belongs to the dialog while one is open, and to the menu once it is not.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(menu).toHaveAttribute("open");
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open");

  await page.getByLabel("Open the menu").click();
  await expect(menu).toHaveAttribute("open");
  await page.mouse.click(20, (viewport?.height ?? 800) - 20);
  await expect(menu).not.toHaveAttribute("open");
});
