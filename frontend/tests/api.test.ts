import { afterEach, describe, expect, it, vi } from "vitest";
import { apiMutation, resetCsrf } from "~/lib/api";

describe("erreurs API", () => {
  afterEach(() => {
    resetCsrf();
    vi.unstubAllGlobals();
  });

  it("conserve le statut et le message d’une erreur serveur", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ token: "csrf" }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              code: "not_found",
              message: "Projet introuvable",
              correlationId: "test",
            }),
            { status: 404 },
          ),
        ),
    );
    await expect(
      apiMutation("/admin/projects/missing", { method: "DELETE" }),
    ).rejects.toMatchObject({ status: 404, message: "Projet introuvable" });
  });
});
