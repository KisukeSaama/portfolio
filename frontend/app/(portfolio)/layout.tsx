import type { ReactNode } from "react";
import { PublicFooter } from "~/components/public-footer";
import { PublicHeader } from "~/components/public-header";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main id="main-content">{children}</main>
      <PublicFooter />
    </>
  );
}
