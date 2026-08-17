import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "~/components/admin-login-form";
import { ThemeToggle } from "~/components/theme-toggle";
import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";
import { adminSession } from "~/lib/admin-session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign in | Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // The administration area is single-language: it is used by the site owner only.
  const t = getDictionary(defaultLocale);
  const session = await adminSession();
  if (session?.authenticated) redirect("/admin");
  return (
    <main id="main-content" className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-head">
          <span className="wordmark">
            <span className="wordmark-mark" aria-hidden />
            Administration
          </span>
          <ThemeToggle t={t} />
        </div>
        <h1 id="login-title">Sign in</h1>
        <p>Restricted to Jonathan. There is no public sign-up.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
