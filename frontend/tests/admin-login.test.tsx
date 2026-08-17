import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminLoginForm } from "~/components/admin-login-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

describe("administration", () => {
  it("affiche une connexion sans inscription", () => {
    render(<AdminLoginForm />);
    expect(
      screen.getByRole("button", { name: "Se connecter" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/créer un compte/i)).not.toBeInTheDocument();
  });
});
