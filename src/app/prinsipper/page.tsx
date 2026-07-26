import { PageIntro } from "@/app/_components/page-intro";
import {
  mealPattern,
  practicalPriorities,
  principles,
} from "@/content/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prinsipper",
  description: "Prinsippene familien bruker for å sette sammen gode måltider.",
};

export default function PrinciplesPage() {
  return (
    <main className="content-page">
      <PageIntro
        eyebrow="Retningen vår"
        title="Prinsipper"
        description="Et enkelt rammeverk for å velge mat med mer næring, mindre støy og nok fleksibilitet til et vanlig familieliv."
      />

      <section className="numbered-principles" aria-labelledby="grunnprinsipper">
        <div className="section-heading section-heading--split">
          <p className="eyebrow">Grunnmuren</p>
          <h2 id="grunnprinsipper">Slik ønsker vi å spise</h2>
        </div>
        <ol>
          {principles.map((principle, index) => (
            <li key={principle}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{principle}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="editorial-grid" aria-labelledby="bygge-maltid">
        <div className="editorial-panel editorial-panel--dark">
          <p className="eyebrow">Måltidsmønsteret</p>
          <h2 id="bygge-maltid">Bygg måltidet i denne rekkefølgen</h2>
          <ol className="compact-steps">
            {mealPattern.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="editorial-panel editorial-panel--paper">
          <p className="eyebrow">Når alt blir komplisert</p>
          <h2>Prioriter det viktigste først</h2>
          <ol className="priority-list">
            {practicalPriorities.map((priority) => (
              <li key={priority}>{priority}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="note-block" aria-labelledby="karbohydrater">
        <div>
          <p className="eyebrow">Viktig nyanse</p>
          <h2 id="karbohydrater">Raffinert er ikke det samme som alt korn</h2>
        </div>
        <div>
          <p>
            Vi bytter ofte ut boller, pasta, wraps og andre raffinerte
            kornprodukter med salat, blomkålris, squashnudler eller søtpotet.
            Det betyr ikke at alt korn er forbudt.
          </p>
          <p>
            Regelen er å redusere raffinerte karbohydrater, velge langsommere
            karbohydrater fra hele råvarer og tilpasse mengden til aktivitet og
            mål.
          </p>
        </div>
      </section>
    </main>
  );
}
