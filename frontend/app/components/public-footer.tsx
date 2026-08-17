import Link from "next/link";
export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span>© {new Date().getFullYear()} Jonathan Blanchard</span>
        <span>Des problèmes, des choix et des applications.</span>
        <Link href="/legal">Mentions légales</Link>
      </div>
    </footer>
  );
}
