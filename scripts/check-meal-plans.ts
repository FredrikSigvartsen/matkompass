import {
  getCurrentPlanWeeks,
  getFredrikPlanDay,
  roundNutrition,
} from "../src/lib/meal-plan";

const weeks = getCurrentPlanWeeks(new Date("2026-07-20T12:00:00Z"));
const tolerances = { calories: 100, protein: 5, fat: 5, carbs: 5 };
let failed = false;

for (const week of weeks) {
  console.log(`\nUke ${week.weekNumber} (${week.type})`);

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
