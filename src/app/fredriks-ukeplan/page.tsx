import { NutritionSummary } from "@/app/_components/nutrition-summary";
import {
  foodDataSource,
  formatDate,
  formatDateRange,
  getCurrentPlanWeeks,
  getFredrikPlanDay,
} from "@/lib/meal-plan";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Fredriks ukeplan",
  description:
    "Fredriks måltider, porsjoner og makromål for inneværende kalenderuke.",
};

export default async function FredrikWeekPlanPage() {
  await connection();
  const [week] = getCurrentPlanWeeks();
  const days = week.days.map(getFredrikPlanDay);

  return (
    <main className="content-page plan-page fredrik-plan">
      <header className="page-intro plan-intro">
        <p className="eyebrow">Uke {week.weekNumber} · Plan {week.type}</p>
        <h1>Fredriks ukeplan</h1>
        <p className="page-intro__description">
          Tre faste måltider, med et enkelt mellommåltid før treningsøkten på
          aktive dager. Mengdene er regnet mot dagsmålet, ikke bare per oppskrift.
        </p>
        <p className="plan-intro__dates">{formatDateRange(week.start, week.end)}</p>
      </header>

      <nav className="week-jump-nav" aria-label="Hopp til ukedag">
        {days.map((day) => (
          <a key={day.profile.name} href={`#${day.profile.name.toLowerCase()}`}>
            {day.profile.shortName}
          </a>
        ))}
      </nav>

      <section className="macro-key" aria-labelledby="dagsmaal">
        <div>
          <p className="eyebrow">Dagsmål</p>
          <h2 id="dagsmaal">Aktiv, hvile og langkjøring</h2>
        </div>
        <p>
          Godkjent avvik er ±100 kcal og ±5 g protein, fett og karbohydrat.
          Alle dagene nedenfor ligger innenfor dette intervallet.
        </p>
      </section>

      <div className="fredrik-days">
        {days.map((day) => (
          <article className="fredrik-day" id={day.profile.name.toLowerCase()} key={day.date.toISOString()}>
            <header className="fredrik-day__header">
              <div>
                <p className="eyebrow">
                  {day.profile.kind === "long"
                    ? "Langkjøring"
                    : day.profile.kind === "active"
                      ? "Aktiv dag"
                      : "Hviledag"}
                  {day.profile.officeDay ? " · Kontor" : ""}
                </p>
                <h2>{day.profile.name}</h2>
                <time dateTime={day.date.toISOString().slice(0, 10)}>{formatDate(day.date)}</time>
              </div>
              <NutritionSummary
                label="Planlagt / mål"
                nutrition={day.nutrition}
                target={day.target}
              />
            </header>

            <div className="meal-timeline">
              {day.meals.map((meal) => (
                <section className="meal-card" key={`${meal.time}-${meal.title}`}>
                  <p className="meal-card__time">{meal.time}</p>
                  <h3>
                    {meal.href ? <Link href={meal.href}>{meal.title}</Link> : meal.title}
                  </h3>
                  <ul className="amount-list">
                    {meal.ingredients.map((ingredient) => (
                      <li key={`${ingredient.foodId}-${ingredient.label}`}>
                        <span>{ingredient.label}</span>
                        <strong>{formatGrams(ingredient.grams)}</strong>
                      </li>
                    ))}
                  </ul>
                  {meal.details?.map((detail) => <p className="meal-card__detail" key={detail}>{detail}</p>)}
                  <NutritionSummary label="Måltidet" nutrition={meal.nutrition} />
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>

      <aside className="plan-source" aria-labelledby="fredrik-beregning">
        <p className="eyebrow">Datagrunnlag</p>
        <h2 id="fredrik-beregning">Beregnet fra mat, ikke fra generiske måltider.</h2>
        <p>
          Hver råvare er veid i gram og beregnet med {foodDataSource.name}, hentet
          {` ${foodDataSource.retrievedAt}`}. Verdiene er representative estimater;
          produkt, råvare og tilberedning vil gi noe naturlig variasjon.
        </p>
        <Link href="/middagsplan">Se familiens middagsplan</Link>
      </aside>
    </main>
  );
}

function formatGrams(grams: number): string {
  const rounded = grams >= 100 ? Math.round(grams / 5) * 5 : Math.round(grams);
  return `${rounded} g`;
}
