import { NutritionSummary } from "@/app/_components/nutrition-summary";
import {
  calculateNutrition,
  familyShares,
  foodDataSource,
  formatDate,
  formatDateRange,
  getCurrentPlanWeeks,
  getDinnerIngredients,
  getFamilyCarbExtras,
} from "@/lib/meal-plan";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Middagsplan",
  description:
    "Familiens faste toukersplan med oppskrifter, mengder og tilpassede porsjoner.",
};

const familyMembers = ["Fredrik", "Kamilla", "Josefine"] as const;

export default async function DinnerPlanPage() {
  await connection();
  const weeks = getCurrentPlanWeeks();

  return (
    <main className="content-page plan-page">
      <header className="page-intro plan-intro">
        <p className="eyebrow">Denne og neste kalenderuke</p>
        <h1>Middagsplan</h1>
        <p className="page-intro__description">
          En fast A/B-rotasjon med to biffdager hver uke. Grunnretten deles
          mellom familien, og den som trener får mer karbohydrat ved siden av.
        </p>
      </header>

      <section className="plan-rules" aria-labelledby="fordeling">
        <div>
          <p className="eyebrow">Grunnfordeling</p>
          <h2 id="fordeling">42,5 · 42,5 · 15</h2>
        </div>
        <dl>
          <div>
            <dt>Fredrik</dt>
            <dd>42,5 %</dd>
          </div>
          <div>
            <dt>Kamilla</dt>
            <dd>42,5 %</dd>
          </div>
          <div>
            <dt>Josefine</dt>
            <dd>15 % + 20 g karbohydrat</dd>
          </div>
          <div>
            <dt>Den som trener</dt>
            <dd>+ 60 g karbohydrat til middag</dd>
          </div>
        </dl>
      </section>

      {weeks.map((week, weekIndex) => (
        <section className="plan-week" key={week.weekNumber} aria-labelledby={`uke-${week.weekNumber}`}>
          <header className="plan-week__header">
            <div>
              <p className="eyebrow">{weekIndex === 0 ? "Denne uken" : "Neste uke"}</p>
              <h2 id={`uke-${week.weekNumber}`}>Uke {week.weekNumber} · Plan {week.type}</h2>
            </div>
            <p>{formatDateRange(week.start, week.end)}</p>
          </header>

          <div className="dinner-plan-list">
            {week.days.map((day, dayIndex) => {
              const extras = getFamilyCarbExtras(day.dinner, day.profile);

              return (
                <details className="dinner-plan-day" key={day.date.toISOString()} open={weekIndex === 0 && dayIndex === 0}>
                  <summary>
                    <span className="dinner-plan-day__date">
                      <strong>{day.profile.shortName}</strong>
                      <time dateTime={day.date.toISOString().slice(0, 10)}>{formatDate(day.date)}</time>
                    </span>
                    <span className="dinner-plan-day__title">{day.dinner.title}</span>
                    <span className="dinner-plan-day__badges">
                      {dayIndex === 1 || dayIndex === 4 ? <span>Biffdag</span> : null}
                      {day.profile.fredrikTrains ? <span>Fredrik trener</span> : null}
                      {day.profile.kamillaTrains ? <span>Kamilla trener</span> : null}
                    </span>
                    <span className="dinner-plan-day__toggle" aria-hidden="true">+</span>
                  </summary>

                  <div className="dinner-plan-day__body">
                    <div className="dinner-plan-day__column">
                      <p className="eyebrow">Planmengder til grunnretten</p>
                      <ul className="amount-list">
                        {day.dinner.plannedIngredients.map((ingredient) => (
                          <li key={`${ingredient.foodId}-${ingredient.label}`}>
                            <span>{ingredient.label}</span>
                            <strong>{formatGrams(ingredient.grams)}</strong>
                          </li>
                        ))}
                      </ul>
                      <p className="seasoning-line">
                        Krydder, smakstilsetninger og originalmengder hentes fra oppskriften.
                      </p>
                    </div>

                    <div className="dinner-plan-day__column">
                      <p className="eyebrow">Karbohydrattillegg</p>
                      <ul className="amount-list amount-list--extras">
                        {extras.map((extra) => (
                          <li key={extra.person}>
                            <span>{extra.person}: {extra.carbs} g karbohydrat</span>
                            <strong>{formatGrams(extra.grams)} {extra.label}</strong>
                          </li>
                        ))}
                      </ul>

                      <p className="eyebrow plan-subheading">Tilberedning</p>
                      <ol className="plan-steps">
                        {day.dinner.instructions.map((step) => <li key={step}>{step}</li>)}
                        <li>Tilpass mengden {day.dinner.carbLabel} til planmengden og tilleggene over.</li>
                      </ol>
                    </div>

                    <div className="dinner-plan-day__portions">
                      {familyMembers.map((person) => (
                        <NutritionSummary
                          key={person}
                          label={`${person} · ${familyShares[person] * 100} %${person === "Josefine" ? " + tillegg" : ""}`}
                          nutrition={calculateNutrition(getDinnerIngredients(person, day.dinner, day.profile))}
                        />
                      ))}
                    </div>

                    <Link href={day.dinner.href} className="primary-link">
                      Åpne hele oppskriften <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      ))}

      <aside className="plan-source" aria-labelledby="beregning">
        <p className="eyebrow">Beregning</p>
        <h2 id="beregning">Representative verdier, praktiske porsjoner.</h2>
        <p>
          Energi og makroer er beregnet fra råvarevekt med data fra {foodDataSource.name},
          hentet {foodDataSource.retrievedAt}. Krydder, sitrus og kraft med ubetydelig
          energibidrag er ikke tatt med i totalsummene.
        </p>
        <a href="https://www.matvaretabellen.no/" rel="noreferrer">Se Matvaretabellen</a>
      </aside>
    </main>
  );
}

function formatGrams(grams: number): string {
  const rounded = grams >= 100 ? Math.round(grams / 5) * 5 : Math.round(grams);
  return `${rounded} g`;
}
