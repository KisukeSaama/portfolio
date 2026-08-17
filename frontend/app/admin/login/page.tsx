import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "~/components/admin-login-form";
import { ThemeToggle } from "~/components/theme-toggle";
import { serverApi } from "~/lib/server-api";
import type { Session } from "~/types/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Connexion — Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await serverApi<Session>("/auth/session", {
    authenticated: true,
  });
  if (session.authenticated) redirect("/admin");
  return (
    <main id="main-content" className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="flex items-center justify-between">
          <span className="wordmark">
            <span className="wordmark-mark" aria-hidden />
            Administration
          </span>
          <ThemeToggle />
        </div>
        <h1 id="login-title">Connexion</h1>
        <p>
          Accès réservé à Jonathan. Aucune inscription publique n’est proposée.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
