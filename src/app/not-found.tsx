import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="content-page not-found-page">
      <p className="eyebrow">Fant ikke siden</p>
      <h1>Her peker kompasset feil.</h1>
      <p>
        Siden finnes ikke, eller oppskriften har fått en ny adresse.
      </p>
      <Link href="/" className="primary-link">
        Tilbake til forsiden <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
