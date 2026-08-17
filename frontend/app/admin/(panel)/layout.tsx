import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminMobile, AdminSidebar } from "~/components/admin-nav";
import { requireAdmin } from "~/lib/require-admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <AdminMobile />
      <main className="admin-main" id="main-content">
        {children}
      </main>
    </div>
  );
}
