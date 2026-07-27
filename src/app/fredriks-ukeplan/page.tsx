import { NutritionSummary } from "@/app/_components/nutrition-summary";
import {
  foodDataSource,
  formatDate,
  formatDateRange,
  formatGrams,
  getCurrentPlanWeeks,
  getFredrikPlanDay,
  mealPlanNutritionMetadata,
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
          aktive dager. Protein er låst, karbohydrat prioriteres for glykogen og
          prestasjon, og sunt fett brukes i målte mengder.
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
          Dagsmålet er omtrent 1 900 kcal, 152–157 g protein, 238 g karbohydrat
          og 36–38 g fett. Det tilsvarer omtrent 33 % protein, 50 % karbohydrat
          og 17 % fett. Alle dagene nedenfor ligger innenfor dette intervallet.
        </p>
      </section>

      <section className="prep-guide" aria-labelledby="batchplan">
        <header>
          <p className="eyebrow">Minst mulig matlaging</p>
          <h2 id="batchplan">To batchøkter, to dager med rester.</h2>
          <p>
            Mandag og torsdag pakkes på forhånd. Tirsdagens frokost og lunsj lages
            dobbelt, slik at onsdag bare krever oppvarming og montering.
          </p>
        </header>
        <div className="prep-guide__steps">
          <section>
            <p className="eyebrow">Søndag</p>
            <h3>Gjør kontordagene klare</h3>
            <ul>
              <li>Bak søtpotet til mandag og tirsdag.</li>
              <li>Stek eggehviter til mandagens cottage cheese-frokost.</li>
              <li>Pakk de tørre og kalde delene; åpne avokado og tunfisk ved servering.</li>
            </ul>
          </section>
          <section>
            <p className="eyebrow">Tirsdag</p>
            <h3>Lag dobbelt</h3>
            <ul>
              <li>Stek dobbel eggerørebase med karbonadedeig.</li>
              <li>Lag to hormonbalanseboller med kylling.</li>
              <li>Sett onsdagsporsjonene raskt kaldt uten avokado.</li>
            </ul>
          </section>
          <section>
            <p className="eyebrow">Onsdag kveld</p>
            <h3>Fyll opp til helgen</h3>
            <ul>
              <li>Bak søtpotet til torsdag–søndag.</li>
              <li>Stek eggehvitene og pakk torsdagens to kontormåltider.</li>
              <li>Kok ekstra villris eller quinoa når middagen allerede bruker det, og frys porsjonene.</li>
            </ul>
          </section>
        </div>
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
          {` ${foodDataSource.retrievedAt}`}. Planen ble beregnet
          {` ${mealPlanNutritionMetadata.calculatedAt}`}. Verdiene er representative estimater;
          produkt, råvare og tilberedning vil gi noe naturlig variasjon.
        </p>
        {mealPlanNutritionMetadata.notes.map((note) => <p key={note}>{note}</p>)}
        <Link href="/middagsplan">Se familiens middagsplan</Link>
      </aside>
    </main>
  );
}
