import {
  getCurrentPlanWeeks,
  getFredrikPlanDay,
  getTodayInOslo,
  roundNutrition,
} from "../src/lib/meal-plan";

const weeks = getCurrentPlanWeeks(new Date("2026-07-20T12:00:00Z"));
const tolerances = { calories: 100, protein: 5, fat: 5, carbs: 5 };
const expectedRotation = {
  A: [
    "sitron-og-urtekylling-med-gronnsaker-i-en-panne",
    "biffbiter",
    "poke-med-varmebehandlet-laks-og-quinoa",
    "salatinnpakkede-storfeburgere",
    "stopjernsbiff-med-avgiftende-bladgront",
    "betennelsesdempende-kyllingcurrybolle",
    "hvitloksreker-med-squashnudler-i-en-panne",
  ],
  B: [
    "laksetaco-i-hjertesalat",
    "stopjernsbiff-med-avgiftende-bladgront",
    "rene-kalkunkjottboller-med-blomkalmos",
    "villaks-med-sitron-dill-og-ovnsstekte-gronnsaker",
    "biffbiter",
    "tacobowl-med-sotpotet-og-cottage-cheese",
    "kyllinggryte-med-gurkemeie-og-kokos",
  ],
} as const;
const steakRecipes = new Set([
  "biffbiter",
  "stopjernsbiff-med-avgiftende-bladgront",
]);
let failed = false;

for (const week of weeks) {
  console.log(`\nUke ${week.weekNumber} (${week.type})`);

  const actualRotation = week.days.map((day) => day.dinner.recipe.slug);
  const rotationMatches = actualRotation.every(
    (slug, index) => slug === expectedRotation[week.type][index],
  );
  const steakDays = actualRotation
    .map((slug, index) => (steakRecipes.has(slug) ? index : -1))
    .filter((index) => index >= 0);

  if (!rotationMatches || steakDays.join(",") !== "1,4") {
    console.error(`FEIL Uke ${week.type} samsvarer ikke med fast rotasjon og biffdager`);
    failed = true;
  }

  for (const day of week.days) {
    const plan = getFredrikPlanDay(day);
    const actual = roundNutrition(plan.nutrition);
    const differences = {
      calories: actual.calories - plan.target.calories,
      protein: actual.protein - plan.target.protein,
      fat: actual.fat - plan.target.fat,
      carbs: actual.carbs - plan.target.carbs,
    };
    const valid = Object.entries(differences).every(
      ([key, difference]) =>
        Math.abs(difference) <= tolerances[key as keyof typeof tolerances],
    );

    if (!valid) {
      failed = true;
    }

    console.log(
      `${valid ? "OK" : "FEIL"} ${day.profile.name.padEnd(8)} ` +
        `${actual.calories} kcal, P ${actual.protein}, F ${actual.fat}, K ${actual.carbs} ` +
        `(avvik ${differences.calories >= 0 ? "+" : ""}${differences.calories} kcal, ` +
        `P ${differences.protein >= 0 ? "+" : ""}${differences.protein}, ` +
        `F ${differences.fat >= 0 ? "+" : ""}${differences.fat}, ` +
        `K ${differences.carbs >= 0 ? "+" : ""}${differences.carbs})`,
    );

    if (!valid) {
      for (const meal of plan.meals) {
        const nutrition = roundNutrition(meal.nutrition);
        console.log(
          `  ${meal.time.padEnd(16)} ${nutrition.calories} kcal, P ${nutrition.protein}, F ${nutrition.fat}, K ${nutrition.carbs}`,
        );
      }
    }
  }
}

if (failed) {
  process.exitCode = 1;
}

const [lastWeekOf2026] = getCurrentPlanWeeks(new Date("2026-12-28T12:00:00Z"));
const [firstWeekOf2027] = getCurrentPlanWeeks(new Date("2027-01-04T12:00:00Z"));

if (lastWeekOf2026.type === firstWeekOf2027.type) {
  console.error("FEIL A/B-rotasjonen gjentas over årsskiftet");
  process.exitCode = 1;
} else {
  console.log(
    `\nOK Årsskifte: uke ${lastWeekOf2026.weekNumber} (${lastWeekOf2026.type}) → ` +
      `uke ${firstWeekOf2027.weekNumber} (${firstWeekOf2027.type})`,
  );
}

const osloDateAfterUtcMidnight = getTodayInOslo(
  new Date("2026-07-26T22:30:00Z"),
).toISOString().slice(0, 10);

if (osloDateAfterUtcMidnight !== "2026-07-27") {
  console.error(`FEIL Oslo-dato: forventet 2026-07-27, fikk ${osloDateAfterUtcMidnight}`);
  process.exitCode = 1;
} else {
  console.log("OK Oslo-dato følger lokal kalenderdag");
}
