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

test("the Episort media dock exposes all videos and their qualities", async ({
  page,
}) => {
  await page.goto("/en/episort");

  const selectors = page.getByRole("button", { name: /^Show:/ });
  await expect(selectors).toHaveCount(3);
  const stagePreview = page.locator(".video-showcase-preview video");
  await expect(stagePreview).toHaveAttribute(
    "src",
    (page.viewportSize()?.width ?? 1200) < 520
      ? "/videos/episort/episort_360p.mp4"
      : "/videos/episort/episort_480p.mp4",
  );
  await expect
    .poll(() => stagePreview.evaluate((video: HTMLVideoElement) => video.muted))
    .toBe(true);

  if ((page.viewportSize()?.width ?? 1200) < 680) {
    const track = page.locator(".media-selector-track");
    await page.getByRole("button", { name: "Next media" }).click();
    await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  }

  await page.getByRole("button", { name: "Show: Matching" }).click();
  const openStage = page.getByRole("button", {
    name: "Open video: Reviewing TMDB matches in Episort",
  });
  await expect(openStage).toBeVisible();
  await stagePreview.evaluate((video: HTMLVideoElement) => {
    video.currentTime = 4;
  });
  await openStage.click();
  const player = page.getByRole("dialog", {
    name: "Video player: Reviewing TMDB matches in Episort",
  });
  await expect(player).toBeVisible();
  const panelBounds = await player.locator(".video-dialog-panel").boundingBox();
  const viewportWidth = page.viewportSize()?.width ?? 1200;
  expect(panelBounds!.width / viewportWidth).toBeGreaterThanOrEqual(0.9);
  expect(panelBounds!.width / viewportWidth).toBeLessThanOrEqual(0.95);
  await expect(
    player.getByRole("button", { name: /fullscreen/i }),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      player
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.currentTime),
    )
    .toBeGreaterThanOrEqual(3.5);
  await player.getByRole("button", { name: "Video settings" }).click();
  const qualities = player.getByRole("menuitemradio");
  await expect(qualities).toHaveCount(4);
  await expect(qualities).toHaveText(["1080p", "720p", "480p", "360p"]);
  await player.getByRole("menuitemradio", { name: "720p" }).click();
  await expect(player.locator("video")).toHaveAttribute(
    "src",
    "/videos/episort/episort_correspondance_720p.mp4",
  );
  await player.getByRole("button", { name: "Close video" }).click();
  await expect(player).toBeHidden();
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
