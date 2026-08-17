"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="error-page">
      <div>
        <p className="error-code">500</p>
        <h1>La page n’a pas pu être chargée.</h1>
        <p>
          Le service est peut-être momentanément indisponible. Vous pouvez
          réessayer sans perdre votre navigation.
        </p>
        <button className="button button-primary" type="button" onClick={reset}>
          Réessayer
        </button>
      </div>
    </main>
  );
}
