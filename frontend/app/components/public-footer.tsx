import { Link } from "react-router";
export function PublicFooter(){return <footer className="site-footer"><div className="shell footer-inner"><span>© {new Date().getFullYear()} Jonathan Blanchard</span><span>Des problèmes, des choix et des applications.</span><Link to="/legal">Mentions légales</Link></div></footer>}
