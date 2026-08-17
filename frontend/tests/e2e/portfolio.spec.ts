import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("navigation publique et thème", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Développeur full-stack");
  await page.getByRole("link", { name: /Lire l’étude de cas/ }).first().click();
  await expect(page).toHaveURL(/\/projects\/episort/);
  if ((page.viewportSize()?.width ?? 1200) < 900) await page.getByLabel("Ouvrir le menu").click();
  await page.getByRole("button", { name: "Activer le thème sombre" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("cycle éditorial administrateur", async ({ page, context }) => {
  const slug = `e2e-${test.info().project.name}-${Date.now()}`;
  const title = `Projet E2E ${test.info().project.name}`;
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Adresse e-mail").fill("e2e@example.test");
  await page.getByLabel("Mot de passe").fill("test-only-password");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.getByRole("link", { name: /Nouveau projet/ }).click();
  await page.getByLabel("Titre", { exact: true }).fill(title);
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Description courte").fill("Une description courte complète pour le test end-to-end.");
  await page.getByLabel("Description complète").fill("Une description complète et suffisamment longue pour valider le parcours de création end-to-end.");
  await page.getByLabel("Rôle de Jonathan").fill("Conception et développement du projet de test.");
  await page.getByLabel("Problème concret").fill("Un problème concret décrit de façon suffisamment précise pour le test.");
  await page.getByLabel("Solution imaginée").fill("Une solution imaginée et décrite de façon suffisamment précise.");
  await page.getByRole("button", { name: /Enregistrer/ }).click();
  await expect(page).toHaveURL(/\/admin\/projects\/.+\/edit/);
  const previewPromise = context.waitForEvent("page");
  await page.getByRole("link", { name: /Prévisualiser/ }).click();
  const preview = await previewPromise;
  await expect(preview.getByText(/Prévisualisation privée/)).toBeVisible();
  await preview.close();
  await page.goto("/admin/projects");
  const row = page.locator(".data-row").filter({ hasText: slug });
  await row.getByTitle("Publier").click();
  await expect(row).toContainText("PUBLISHED");
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await page.goto("/admin/projects");
  page.once("dialog", dialog => dialog.accept());
  const publishedRow = page.locator(".data-row").filter({ hasText: slug });
  await publishedRow.getByTitle("Dépublier").click();
  await expect(publishedRow).toContainText("DRAFT");
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
  await page.goto("/admin");
  if ((page.viewportSize()?.width ?? 1200) < 900) await page.getByLabel("Ouvrir le menu d’administration").click();
  await page.getByRole("button", { name: /Déconnexion/ }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
