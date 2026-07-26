import Link from "next/link";
import { getAllRecipes } from "@/lib/recipes";

export default function Index() {
  const recipeCount = getAllRecipes().length;

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">Familiens matbok</p>
          <h1>Et tydeligere valg rundt bordet.</h1>
          <p>
            Prinsippene vi følger, maten vi velger og oppskriftene vi kommer
            tilbake til. Samlet så hverdagen blir enklere.
          </p>
          <Link href="/oppskrifter" className="primary-link">
            Finn en oppskrift <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="home-hero__compass" aria-hidden="true">
          <span className="compass__north">N</span>
          <span className="compass__needle" />
          <span className="compass__label">Spis godt</span>
        </div>
      </section>

      <section className="home-sections" aria-labelledby="utforsk">
        <div className="section-heading">
          <p className="eyebrow">Fra prinsipp til ukeplan</p>
          <h2 id="utforsk">Utforsk Matkompass</h2>
        </div>
        <div className="home-card-grid">
          <Link href="/prinsipper" className="home-card home-card--principles">
            <span>01</span>
            <h3>Prinsipper</h3>
            <p>Reglene som gjør det lettere å velge i hverdagen.</p>
          </Link>
          <Link href="/mat-vi-spiser" className="home-card home-card--food">
            <span>02</span>
            <h3>Mat vi spiser</h3>
            <p>Råvarene vi velger ofte, av og til eller helst unngår.</p>
          </Link>
          <Link href="/oppskrifter" className="home-card home-card--recipes">
            <span>03</span>
            <h3>Oppskrifter</h3>
            <p>{recipeCount} oppskrifter til hele dagen, kontrollert mot prinsippene våre.</p>
          </Link>
          <Link href="/middagsplan" className="home-card home-card--dinners">
            <span>04</span>
            <h3>Middagsplan</h3>
            <p>To kalenderuker med mengder, fordeling og treningsjusteringer.</p>
          </Link>
          <Link href="/fredriks-ukeplan" className="home-card home-card--fredrik">
            <span>05</span>
            <h3>Fredriks ukeplan</h3>
            <p>Faste måltider og porsjoner beregnet mot dagsmålet.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
