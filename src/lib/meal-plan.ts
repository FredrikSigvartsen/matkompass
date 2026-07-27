import {
  dayProfiles,
  daytimeMeals,
  dinnerRotation,
  longTrainingSnack,
  mealPlanNutritionMetadata,
  nutritionTargets,
  trainingSnack,
  type DayProfile,
  type DinnerDefinition,
  type IngredientAmount,
  type PlannedMeal,
} from "../content/meal-plan";
import { foodDataSource, foods } from "../content/matvaretabellen.generated";
import {
  resolveRecipeReference,
  type ResolvedRecipeReference,
} from "./recipes";

export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DatedPlanWeek {
  type: "A" | "B";
  weekNumber: number;
  start: Date;
  end: Date;
  days: DatedPlanDay[];
}

export interface DatedPlanDay {
  date: Date;
  profile: DayProfile;
  dinner: ResolvedDinnerDefinition;
}

export interface ResolvedDinnerDefinition
  extends DinnerDefinition,
    ResolvedRecipeReference {}

export interface FamilyCarbExtra {
  person: "Fredrik" | "Kamilla" | "Josefine";
  carbs: number;
  grams: number;
  label: string;
}

export interface ResolvedIngredientAmount extends IngredientAmount {
  label: string;
}

export type FamilyMember = keyof typeof familyShares;

export interface FredrikMeal {
  title: string;
  href?: string;
  ingredients: ResolvedIngredientAmount[];
  details?: string[];
  time: string;
  nutrition: Nutrition;
}

export interface FredrikPlanDay extends DatedPlanDay {
  meals: FredrikMeal[];
  nutrition: Nutrition;
  target: (typeof nutritionTargets)[keyof typeof nutritionTargets];
}

const familyShares = {
  Fredrik: 0.425,
  Kamilla: 0.425,
  Josefine: 0.15,
} as const;

const foodsById = new Map(foods.map((food) => [food.id, food]));
const rotationEpoch = Date.UTC(2026, 6, 20);
const millisecondsPerWeek = 7 * 86_400_000;

export {
  familyShares,
  foodDataSource,
  mealPlanNutritionMetadata,
  nutritionTargets,
};

export function calculateNutrition(ingredients: IngredientAmount[]): Nutrition {
  return ingredients.reduce<Nutrition>(
    (total, ingredient) => {
      const food = foodsById.get(ingredient.foodId);

      if (!food) {
        throw new Error(`Mangler næringsdata for ${ingredient.foodId}`);
      }

      const factor = ingredient.grams / 100;
      total.calories += food.per100g.calories * factor;
      total.protein += food.per100g.protein * factor;
      total.fat += food.per100g.fat * factor;
      total.carbs += food.per100g.carbs * factor;
      return total;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 },
  );
}

export function getFoodLabel(foodId: IngredientAmount["foodId"]): string {
  const food = foodsById.get(foodId);

  if (!food) {
    throw new Error(`Mangler matvare ${foodId}`);
  }

  return food.name;
}

export function getPlannedDinnerIngredients(
  dinner: DinnerDefinition,
): ResolvedIngredientAmount[] {
  return resolveIngredientLabels(dinner.plannedIngredients);
}

export function sumNutrition(items: Nutrition[]): Nutrition {
  return items.reduce<Nutrition>(
    (total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      fat: total.fat + item.fat,
      carbs: total.carbs + item.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 },
  );
}

export function roundNutrition(nutrition: Nutrition): Nutrition {
  return {
    calories: Math.round(nutrition.calories),
    protein: Math.round(nutrition.protein),
    fat: Math.round(nutrition.fat),
    carbs: Math.round(nutrition.carbs),
  };
}

export function getFamilyCarbExtras(
  dinner: DinnerDefinition,
  profile: DayProfile,
): FamilyCarbExtra[] {
  const extras: FamilyCarbExtra[] = [];

  if (profile.fredrikTrains) {
    extras.push(createCarbExtra("Fredrik", 60, dinner));
  }

  if (profile.kamillaTrains) {
    extras.push(createCarbExtra("Kamilla", 60, dinner));
  }

  extras.push(createCarbExtra("Josefine", 20, dinner));
  return extras;
}

export function getFredrikDinnerIngredients(
  dinner: DinnerDefinition,
  profile: DayProfile,
): ResolvedIngredientAmount[] {
  return getDinnerIngredients("Fredrik", dinner, profile);
}

export function getDinnerIngredients(
  person: FamilyMember,
  dinner: DinnerDefinition,
  profile: DayProfile,
): ResolvedIngredientAmount[] {
  const ingredients = resolveIngredientLabels(dinner.plannedIngredients).map((ingredient) => ({
    ...ingredient,
    grams: ingredient.grams * familyShares[person],
  }));

  const extra = getFamilyCarbExtras(dinner, profile).find(
    (carbExtra) => carbExtra.person === person,
  );

  if (extra) {
    ingredients.push({
      foodId: dinner.carbFoodId,
      grams: extra.grams,
      label: `Ekstra ${extra.label.toLocaleLowerCase("nb")}`,
    });
  }

  return ingredients;
}

export function getFredrikPlanDay(day: DatedPlanDay): FredrikPlanDay {
  const mealsForDay = daytimeMeals[day.profile.name];
  const meals: FredrikMeal[] = [
    createFredrikMeal("Kl. 10–11", mealsForDay[0]),
    createFredrikMeal("Kl. 14", mealsForDay[1]),
  ];

  if (day.profile.fredrikTrains) {
    meals.push(
      createFredrikMeal(
        "Før treningsøkt",
        day.profile.kind === "long" ? longTrainingSnack : trainingSnack,
      ),
    );
  }

  const dinnerIngredients = getFredrikDinnerIngredients(day.dinner, day.profile);
  meals.push({
    time: "Kl. 17",
    title: day.dinner.title,
    href: day.dinner.href,
    ingredients: dinnerIngredients,
    details: day.profile.fredrikTrains
      ? [`Inkluderer 60 g ekstra karbohydrat fra ${day.dinner.carbLabel}.`]
      : undefined,
    nutrition: calculateNutrition(dinnerIngredients),
  });

  return {
    ...day,
    meals,
    nutrition: sumNutrition(meals.map((meal) => meal.nutrition)),
    target: nutritionTargets[day.profile.kind],
  };
}

export function getCurrentPlanWeeks(now = new Date()): [DatedPlanWeek, DatedPlanWeek] {
  const today = getOsloDate(now);
  const currentMonday = startOfWeek(today);
  return [createPlanWeek(currentMonday), createPlanWeek(addDays(currentMonday, 7))];
}

export function getTodayInOslo(now = new Date()): Date {
  return getOsloDate(now);
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    ...options,
  }).format(date);
}

export function formatDateRange(start: Date, end: Date): string {
  return `${formatDate(start)}–${formatDate(end, { day: "numeric", month: "short", year: "numeric" })}`;
}

export function formatGrams(grams: number): string {
  const rounded = grams >= 100 ? Math.round(grams / 5) * 5 : Math.round(grams);
  return `${rounded} g`;
}

function createFredrikMeal(time: string, meal: PlannedMeal): FredrikMeal {
  const recipe = meal.recipe ? resolveRecipeReference(meal.recipe) : undefined;
  const title = meal.title ?? recipe?.title;

  if (!title) {
    throw new Error("Et planlagt måltid må ha tittel eller oppskriftsreferanse");
  }

  return {
    title,
    href: recipe?.href,
    ingredients: resolveIngredientLabels(meal.ingredients),
    details: meal.details,
    time,
    nutrition: calculateNutrition(meal.ingredients),
  };
}

function createCarbExtra(
  person: FamilyCarbExtra["person"],
  carbs: number,
  dinner: DinnerDefinition,
): FamilyCarbExtra {
  const food = foodsById.get(dinner.carbFoodId);

  if (!food || food.per100g.carbs <= 0) {
    throw new Error(`Kan ikke beregne karbohydrattillegg for ${dinner.carbFoodId}`);
  }

  return {
    person,
    carbs,
    grams: (carbs / food.per100g.carbs) * 100,
    label: dinner.carbLabel,
  };
}

function resolveIngredientLabels(
  ingredients: IngredientAmount[],
): ResolvedIngredientAmount[] {
  return ingredients.map((ingredient) => ({
    ...ingredient,
    label: ingredient.label ?? getFoodLabel(ingredient.foodId),
  }));
}

function createPlanWeek(monday: Date): DatedPlanWeek {
  const weekNumber = getIsoWeek(monday);
  const weeksSinceEpoch = Math.floor(
    (monday.getTime() - rotationEpoch) / millisecondsPerWeek,
  );
  const type = ((weeksSinceEpoch % 2) + 2) % 2 === 0 ? "A" : "B";
  const days = dayProfiles.map((profile, index) => {
    const dinner = dinnerRotation[type][profile.name];

    return {
      date: addDays(monday, index),
      profile,
      dinner: {
        ...dinner,
        ...resolveRecipeReference(dinner.recipe),
      },
    };
  });

  return {
    type,
    weekNumber,
    start: monday,
    end: addDays(monday, 6),
    days,
  };
}

function getOsloDate(date: Date): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
}

function startOfWeek(date: Date): Date {
  const day = date.getUTCDay() || 7;
  return addDays(date, 1 - day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function getIsoWeek(date: Date): number {
  const thursday = new Date(date);
  const day = thursday.getUTCDay() || 7;
  thursday.setUTCDate(thursday.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  return Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}
