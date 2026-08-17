import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminLoginForm } from "~/components/admin-login-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

describe("administration", () => {
  it("offers a sign-in with no sign-up", () => {
    render(<AdminLoginForm />);
    expect(
      screen.getByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/create an account/i)).not.toBeInTheDocument();
  });
});
