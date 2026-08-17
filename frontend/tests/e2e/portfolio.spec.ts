import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

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
  // Janus leads the seeded order: it is the back-end project the site is positioned around.
  await expect(page).toHaveURL(/\/en\/janus$/);

  // On mobile both controls live in the same menu, and switching language navigates away, so the
  // theme is toggled first while the menu is still open.
  if ((page.viewportSize()?.width ?? 1200) < 900)
    await page.getByLabel("Open the menu").click();
  await page.getByRole("button", { name: "Switch to the dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "FR" }).click();
  await expect(page).toHaveURL(/\/fr\/janus$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  // The footer is outside the collapsible menu, so it proves the translation on every viewport.
  await expect(
    page.getByRole("link", { name: "Mentions légales" }),
  ).toBeVisible();
});

test("administrator editorial cycle", async ({ page, context }) => {
  const timestamp = Date.now();
  const slug = `e2e-${test.info().project.name}-${timestamp}`;
  const title = `E2E project ${test.info().project.name} ${timestamp}`;
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Email address").fill("e2e@example.test");
  await page.getByLabel("Password").fill("test-only-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: /New project/ }).click();
  await page.getByLabel("Title", { exact: true }).fill(title);
  await page.getByLabel("Slug").fill(slug);
  await page
    .getByLabel("Short description")
    .fill("A short description that is complete enough for the end-to-end test.");
  await page
    .getByLabel("Full description")
    .fill(
      "A full description long enough to validate the end-to-end creation flow.",
    );
  await page
    .getByLabel("Jonathan's role")
    .fill("Design and development of the test project.");
  await page
    .getByLabel("Concrete problem")
    .fill("A concrete problem described precisely enough for the test.");
  await page
    .getByLabel("Solution", { exact: true })
    .fill("A solution described precisely enough for the test.");
  await page.getByRole("button", { name: /Save/ }).click();
  await expect(page).toHaveURL(/\/admin\/projects\/.+\/edit/);
  const previewPromise = context.waitForEvent("page");
  await page.getByRole("link", { name: /Preview/ }).click();
  const preview = await previewPromise;
  await expect(preview.getByText(/Private preview/)).toBeVisible();
  await preview.close();
  await page.goto("/admin/projects");
  const row = page.locator(".data-row").filter({ hasText: slug });
  // Publishing adds visibility, so it applies without a confirmation step.
  await row.getByTitle("Publish").click();
  await expect(row).toContainText("Published");
  await page.goto("/en/projects");
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await page.goto("/admin/projects");
  const publishedRow = page.locator(".data-row").filter({ hasText: slug });
  await publishedRow.getByTitle("Unpublish").click();
  // Taking a case study off the public site is confirmed in an in-page dialog.
  const confirmation = page.locator("dialog[open]");
  await expect(confirmation).toBeVisible();
  await confirmation
    .getByRole("button", { name: "Unpublish the project" })
    .click();
  await expect(publishedRow).toContainText("Draft");
  await page.goto("/en/projects");
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
  await page.goto("/admin");
  if ((page.viewportSize()?.width ?? 1200) < 900)
    await page.getByLabel("Open the administration menu").click();
  await page.getByRole("button", { name: /Sign out/ }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
