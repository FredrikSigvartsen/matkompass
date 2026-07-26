import { PageIntro } from "@/app/_components/page-intro";
import {
  avoidSections,
  foodSections,
  temporaryRestrictions,
} from "@/content/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mat vi spiser",
  description: "Råvarene familien velger, tilpasser og helst unngår.",
};

export default function FoodPage() {
  return (
    <main className="content-page">
      <PageIntro
        eyebrow="Råvarekartet"
        title="Mat vi spiser"
        description="En samlet oversikt over råvarer vi bruker som standard, mat vi tilpasser etter behov, og det vi helst styrer unna."
      />

      <aside className="status-key" aria-label="Slik leser du matoversikten">
        <p><strong>Ofte:</strong> en naturlig del av vanlige måltider.</p>
        <p><strong>Etter behov:</strong> tilpasses aktivitet, mål, allergier og toleranse.</p>
        <p><strong>Midlertidig:</strong> gjelder bare under en bestemt protokoll.</p>
      </aside>

      <section className="food-section" aria-labelledby="velger">
        <div className="section-heading section-heading--split">
          <p className="eyebrow">Ofte og etter behov</p>
          <h2 id="velger">Råvarer vi velger</h2>
        </div>
        <div className="food-grid">
          {foodSections.map((section) => (
            <article key={section.title} className="food-card">
              <h3>{section.title}</h3>
              {section.description ? <p>{section.description}</p> : null}
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="avoid-section" aria-labelledby="unngar">
        <div className="section-heading section-heading--split">
          <p className="eyebrow">Som standard</p>
          <h2 id="unngar">Dette unngår eller reduserer vi</h2>
        </div>
        <div className="avoid-grid">
          {avoidSections.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="temporary-note" aria-labelledby="midlertidig">
        <div>
          <p className="eyebrow">Ikke permanente forbud</p>
          <h2 id="midlertidig">Midlertidige begrensninger</h2>
        </div>
        <ul>
          {temporaryRestrictions.map((restriction) => (
            <li key={restriction}>{restriction}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
