import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="error-page">
      <div>
        <p className="error-code">404</p>
        <h1>Cette page n’existe pas.</h1>
        <p>Le chemin a peut-être changé ou le projet n’est pas publié.</p>
        <Link className="button button-primary" href="/">
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
