import {
  getGroceryCatalogItem,
  groceryCategoryOrder,
  type GroceryCategory,
  type GroceryItemId,
  type GrocerySection,
  type PurchaseUnit,
} from "../content/grocery-catalog";
import { retailers, type RetailerId } from "../content/retailers";
import type {
  FoodId,
  IngredientAmount,
  PlannedMeal,
} from "../content/meal-plan";
import {
  formatDateRange,
  getCurrentPlanWeeks,
  getFredrikDaytimePlan,
  type DatedPlanDay,
  type DatedPlanWeek,
} from "./meal-plan";
import {
  familyPreset,
  getFamilyScale,
  type FamilySize,
  type RecipeIngredient,
} from "./recipe-ingredients";
import { getRecipe, type RecipeReference } from "./recipes";

export type GroceryWeekSelection = "current" | "next";

export interface GroceryRetailerOffer {
  id: string;
  retailerId: RetailerId;
  retailerLabel: string;
  url: string;
  linkKind: "search";
  purchaseLabel: string;
}

export interface GroceryListLine {
  id: GroceryItemId;
  label: string;
  category: GroceryCategory;
  categoryOrder: number;
  section: GrocerySection;
  requiredLabel: string;
  purchaseLabel: string;
  sources: string[];
  offers: GroceryRetailerOffer[];
  defaultOfferId: string;
}

export interface WeeklyGroceryList {
  week: {
    type: "A" | "B";
    weekNumber: number;
    startDate: string;
    dateRange: string;
  };
  lines: GroceryListLine[];
}

interface GroceryContribution {
  id: GroceryItemId;
  amount: number | null;
  unit: PurchaseUnit;
  optional: boolean;
  source: string;
}

interface GroceryAccumulator {
  amount: number;
  hasAmount: boolean;
  hasUnquantified: boolean;
  sources: Set<string>;
}

const planFoodMappings: Partial<Record<FoodId, GroceryItemId>> = {
  "01.028": "cottage-cheese",
  "02.001": "egg",
  "03.004": "turkey",
  "03.066": "sirloin",
  "03.126": "ground-beef",
  "03.205": "chicken-breast",
  "03.332": "chicken-thigh",
  "04.015": "salmon",
  "04.018": "smoked-salmon",
  "04.107": "tuna",
  "04.387": "shrimp",
  "05.030": "sesame",
  "05.340": "wild-rice",
  "05.420": "almond-flour",
  "06.010": "cucumber",
  "06.016": "cauliflower",
  "06.018": "broccoli",
  "06.035": "kale",
  "06.036": "carrot",
  "06.042": "onion",
  "06.048": "red-pepper",
  "06.062": "mushroom",
  "06.064": "spinach",
  "06.085": "squash",
  "06.093": "red-cabbage",
  "06.136": "sweet-potato",
  "06.138": "romaine",
  "06.207": "heart-lettuce",
  "06.262": "potato",
  "06.524": "avocado",
  "06.525": "banana",
  "06.560": "walnuts",
  "06.616": "quinoa",
  "06.701": "coconut-milk",
  "06.752": "cherry-tomato",
  "08.112": "olive",
  "08.249": "coconut-oil",
  "08.252": "ghee",
  "09.003": "honey",
};

const planPurchaseFactors: Partial<Record<FoodId, number>> = {
  "05.340": 0.34,
  "06.262": 1.1,
  "06.616": 0.34,
};

const recipeReplacementExceptions: Partial<Record<string, GroceryItemId[]>> = {
  morgeneggerore: ["ground-beef"],
  hormonbalansebolle: ["salmon"],
  "tacobowl-med-sotpotet-og-cottage-cheese": ["ghee"],
};

export function getWeeklyGroceryList(
  selection: GroceryWeekSelection,
  now = new Date(),
): WeeklyGroceryList {
  const weeks = getCurrentPlanWeeks(now);
  const week = weeks[selection === "current" ? 0 : 1];
  const contributions = week.days.flatMap((day) => getDayContributions(day));
  const lines = aggregateContributions(contributions);

  return {
    week: {
      type: week.type,
      weekNumber: week.weekNumber,
      startDate: week.start.toISOString().slice(0, 10),
      dateRange: formatDateRange(week.start, week.end),
    },
    lines,
  };
}

export function validateGroceryConfiguration(now = new Date("2026-07-20T12:00:00Z")) {
  const weeks = getCurrentPlanWeeks(now);

  for (const week of weeks) {
    for (const day of week.days) {
      getDayContributions(day);
    }
  }
}

function getDayContributions(day: DatedPlanDay): GroceryContribution[] {
  const daytime = getFredrikDaytimePlan(day).flatMap((meal, index) =>
    getMealContributions(
      meal,
      { adults: 1, children: 0 },
      `${day.profile.name} · ${index === 0 ? "kl. 10–11" : "kl. 14"}`,
    ),
  );
  const dinner = getDinnerContributions(day.dinner, `${day.profile.name} · middag`);

  return [...daytime, ...dinner];
}

function getMealContributions(
  meal: PlannedMeal,
  family: FamilySize,
  source: string,
): GroceryContribution[] {
  const planned = meal.ingredients.map((ingredient) =>
    getPlanContribution(ingredient, source),
  );

  if (!meal.recipe) {
    return planned;
  }

  return mergeRecipeWithPlan(meal.recipe, family, planned, source);
}

function getDinnerContributions(
  dinner: DatedPlanWeek["days"][number]["dinner"],
  source: string,
): GroceryContribution[] {
  const planned = dinner.plannedIngredients.map((ingredient) =>
    getPlanContribution(ingredient, source),
  );

  return mergeRecipeWithPlan(dinner.recipe, familyPreset, planned, source);
}

function mergeRecipeWithPlan(
  reference: RecipeReference,
  family: FamilySize,
  planned: GroceryContribution[],
  source: string,
): GroceryContribution[] {
  const recipe = getRecipe(reference.category, reference.slug);

  if (!recipe?.baseAdultPortions) {
    throw new Error(`Mangler grunnporsjoner for ${reference.category}/${reference.slug}`);
  }

  const scale = getFamilyScale(recipe.baseAdultPortions, family);
  const plannedIds = new Set(planned.map((contribution) => contribution.id));
  const replacements = new Set(recipeReplacementExceptions[reference.slug] ?? []);
  const recipeContributions = recipe.ingredients.flatMap((group) =>
    group.items.flatMap((ingredient) => {
      const contribution = getRecipeContribution(ingredient, scale, source);

      if (
        contribution === null ||
        plannedIds.has(contribution.id) ||
        replacements.has(contribution.id)
      ) {
        return [];
      }

      return [contribution];
    }),
  );

  return [...planned, ...recipeContributions];
}

function getPlanContribution(
  ingredient: IngredientAmount,
  source: string,
): GroceryContribution {
  const id = getPlanGroceryId(ingredient);
  const catalogItem = getGroceryCatalogItem(id);
  const purchaseGrams = ingredient.grams * (planPurchaseFactors[ingredient.foodId] ?? 1);
  const amount = convertQuantity(id, "g", purchaseGrams);

  if (amount === null) {
    throw new Error(`Kan ikke konvertere planmengde for ${id}`);
  }

  return {
    id,
    amount,
    unit: catalogItem.purchaseUnit,
    optional: false,
    source,
  };
}

function getPlanGroceryId(ingredient: IngredientAmount): GroceryItemId {
  if (ingredient.label === "rødløk") {
    return "red-onion";
  }

  if (ingredient.label === "avokadoolje") {
    return "olive";
  }

  const id = planFoodMappings[ingredient.foodId];

  if (!id) {
    throw new Error(`Mangler dagligvaremapping for ${ingredient.foodId}`);
  }

  return id;
}

function getRecipeContribution(
  ingredient: RecipeIngredient,
  scale: number,
  source: string,
): GroceryContribution | null {
  if (ingredient.text.trim().toLocaleLowerCase("nb") === "vann") {
    return null;
  }

  const id = getRecipeGroceryId(ingredient.text);
  const catalogItem = getGroceryCatalogItem(id);
  const sourceQuantity = getRecipeSourceQuantity(ingredient, scale);
  const amount = sourceQuantity
    ? convertQuantity(id, sourceQuantity.unit, sourceQuantity.amount)
    : null;
  const lowerText = ingredient.text.toLocaleLowerCase("nb");
  const optional =
    ingredient.optional === true ||
    lowerText.startsWith("valgfritt") ||
    lowerText.includes("(valgfritt)") ||
    lowerText.startsWith("chiliflak") ||
    lowerText.startsWith("hot honey");

  return {
    id,
    amount,
    unit: catalogItem.purchaseUnit,
    optional,
    source,
  };
}

function getRecipeGroceryId(text: string): GroceryItemId {
  const value = text.toLocaleLowerCase("nb");
  const rules: Array<[RegExp, GroceryItemId]> = [
    [/perfectaminos|kollagen/, "protein-powder"],
    [/cottage cheese/, "cottage-cheese"],
    [/tunfisk/, "tuna"],
    [/røkt laks/, "smoked-salmon"],
    [/laks/, "salmon"],
    [/reker/, "shrimp"],
    [/kalkun/, "turkey"],
    [/kjøttdeig|storfekjøtt/, "ground-beef"],
    [/biffbiter|fileter av gressfôret storfe/, "steak"],
    [/kyllingbryst/, "chicken-breast"],
    [/kyllinglår/, "chicken-thigh"],
    [/egg fra/, "egg"],
    [/mandelmel/, "almond-flour"],
    [/moden banan/, "banana"],
    [/søtpotet/, "sweet-potato"],
    [/kokosmelk/, "coconut-milk"],
    [/kokosolje/, "coconut-oil"],
    [/avokadoolje eller ghee|ghee eller avokadoolje|smeltet ghee|olivenolje eller ghee/, "ghee"],
    [/olivenolje|extra virgin/, "olive"],
    [/smør/, "ghee"],
    [/avokado/, "avocado"],
    [/blomkål/, "cauliflower"],
    [/brokkoli/, "broccoli"],
    [/grønnkål|ruccola/, "kale"],
    [/spinat/, "spinach"],
    [/sopp/, "mushroom"],
    [/squash/, "squash"],
    [/hjertesalat/, "heart-lettuce"],
    [/romanosalat|bladkål/, "romaine"],
    [/rødkål/, "red-cabbage"],
    [/rød paprika,|rød paprika$/, "red-pepper"],
    [/cherrytomat/, "cherry-tomato"],
    [/rødløk/, "red-onion"],
    [/løk,/, "onion"],
    [/agurk/, "cucumber"],
    [/gulrot/, "carrot"],
    [/quinoa/, "quinoa"],
    [/sesamfrø/, "sesame"],
    [/valnøtt/, "walnuts"],
    [/lime/, "lime"],
    [/sitron|sitronsaft/, "lemon"],
    [/hvitløkspulver/, "garlic-powder"],
    [/hvitløk/, "garlic"],
    [/kokosaminos/, "coconut-aminos"],
    [/ingefær/, "ginger"],
    [/gurkemeie/, "turmeric"],
    [/ceylonkanel/, "cinnamon"],
    [/røkt paprika/, "smoked-paprika"],
    [/paprikapulver/, "paprika"],
    [/spisskummen/, "cumin"],
    [/oregano/, "oregano"],
    [/rosmarin/, "rosemary"],
    [/timian/, "thyme"],
    [/dill/, "dill"],
    [/koriander/, "coriander"],
    [/mikrogrønt|hampfrø/, "microgreens"],
    [/sennep/, "mustard"],
    [/ost av rå/, "cheese"],
    [/beinbuljong/, "bone-broth"],
    [/næringsgjær/, "nutritional-yeast"],
    [/hot honey/, "hot-honey"],
    [/chiliflak/, "chili"],
    [/havsalt|salt|sort pepper|svart pepper|grovkvernet pepper/, "salt-pepper"],
  ];
  const match = rules.find(([pattern]) => pattern.test(value));

  if (!match) {
    throw new Error(`Mangler dagligvaremapping for oppskriftsingrediensen «${text}»`);
  }

  return match[1];
}

function getRecipeSourceQuantity(
  ingredient: RecipeIngredient,
  scale: number,
): { amount: number; unit: "g" | "ml" | "stk" } | null {
  if (ingredient.amount === undefined) {
    return null;
  }

  const amount = (ingredient.maxAmount ?? ingredient.amount) * scale;

  switch (ingredient.unit) {
    case "g":
      return { amount, unit: "g" };
    case "kg":
      return { amount: amount * 1000, unit: "g" };
    case "ml":
      return { amount, unit: "ml" };
    case "dl":
      return { amount: amount * 100, unit: "ml" };
    case "l":
      return { amount: amount * 1000, unit: "ml" };
    case "ss":
      return { amount: amount * 15, unit: "ml" };
    case "ts":
      return { amount: amount * 5, unit: "ml" };
    case undefined:
    case "måleskje":
      return { amount, unit: "stk" };
    default:
      throw new Error(`Ukjent oppskriftsenhet: ${ingredient.unit}`);
  }
}

function convertQuantity(
  id: GroceryItemId,
  sourceUnit: PurchaseUnit,
  amount: number,
): number | null {
  const item = getGroceryCatalogItem(id);

  if (sourceUnit === item.purchaseUnit) {
    return amount;
  }

  if (sourceUnit === "g" && item.purchaseUnit === "stk" && item.gramsPerEach) {
    return amount / item.gramsPerEach;
  }

  if (sourceUnit === "g" && item.purchaseUnit === "ml" && item.gramsPerMl) {
    return amount / item.gramsPerMl;
  }

  if (sourceUnit === "stk" && item.purchaseUnit === "g" && item.gramsPerEach) {
    return amount * item.gramsPerEach;
  }

  if (sourceUnit === "stk" && item.purchaseUnit === "ml" && item.mlPerEach) {
    return amount * item.mlPerEach;
  }

  if (sourceUnit === "ml" && item.purchaseUnit === "g" && item.gramsPerMl) {
    return amount * item.gramsPerMl;
  }

  if (sourceUnit === "ml" && item.purchaseUnit === "stk" && item.mlPerEach) {
    return amount / item.mlPerEach;
  }

  return null;
}

function aggregateContributions(contributions: GroceryContribution[]): GroceryListLine[] {
  const required = new Map<GroceryItemId, GroceryAccumulator>();
  const optional = new Map<GroceryItemId, GroceryAccumulator>();

  for (const contribution of contributions) {
    addContribution(contribution.optional ? optional : required, contribution);
  }

  const ids = new Set([...required.keys(), ...optional.keys()]);
  return [...ids]
    .map((id) => {
      const catalogItem = getGroceryCatalogItem(id);
      const requiredEntry = required.get(id);
      const entry = requiredEntry ?? optional.get(id);

      if (!entry) {
        throw new Error(`Mangler aggregert dagligvare ${id}`);
      }

      const section: GrocerySection = requiredEntry
        ? catalogItem.section
        : "optional";
      const requiredLabel = formatRequiredAmount(entry, catalogItem.purchaseUnit);
      const purchaseLabel = formatPurchaseAmount(entry, id);
      const offers = retailers.map((retailer) => ({
        id: `${id}:${retailer.id}`,
        retailerId: retailer.id,
        retailerLabel: retailer.label,
        url: `${retailer.searchUrl}${encodeURIComponent(catalogItem.searchTerm ?? catalogItem.label)}`,
        linkKind: "search" as const,
        purchaseLabel,
      }));

      return {
        id,
        label: catalogItem.label,
        category: catalogItem.category,
        categoryOrder: groceryCategoryOrder.indexOf(catalogItem.category),
        section,
        requiredLabel,
        purchaseLabel,
        sources: [...entry.sources].toSorted((a, b) => a.localeCompare(b, "nb")),
        offers,
        defaultOfferId: `${id}:oda`,
      };
    })
    .toSorted(compareGroceryLines);
}

function addContribution(
  entries: Map<GroceryItemId, GroceryAccumulator>,
  contribution: GroceryContribution,
) {
  const current = entries.get(contribution.id) ?? {
    amount: 0,
    hasAmount: false,
    hasUnquantified: false,
    sources: new Set<string>(),
  };

  if (contribution.amount === null) {
    current.hasUnquantified = true;
  } else {
    current.amount += contribution.amount;
    current.hasAmount = true;
  }

  current.sources.add(contribution.source);
  entries.set(contribution.id, current);
}

function formatRequiredAmount(entry: GroceryAccumulator, unit: PurchaseUnit): string {
  if (!entry.hasAmount) {
    return "Etter behov";
  }

  const amount = formatAmount(entry.amount, unit);
  return entry.hasUnquantified ? `${amount} + etter behov` : amount;
}

function formatPurchaseAmount(entry: GroceryAccumulator, id: GroceryItemId): string {
  if (!entry.hasAmount) {
    return "Sjekk behovet";
  }

  const item = getGroceryCatalogItem(id);
  const rounded = Math.ceil(entry.amount / item.roundTo) * item.roundTo;
  return formatAmount(rounded, item.purchaseUnit);
}

function formatAmount(amount: number, unit: PurchaseUnit): string {
  if (unit === "g" && amount >= 1000) {
    return `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 2 }).format(amount / 1000)} kg`;
  }

  if (unit === "ml" && amount >= 1000) {
    return `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 2 }).format(amount / 1000)} l`;
  }

  return `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: unit === "stk" ? 1 : 0 }).format(amount)} ${unit}`;
}

function compareGroceryLines(a: GroceryListLine, b: GroceryListLine): number {
  const categoryDifference =
    groceryCategoryOrder.indexOf(a.category) - groceryCategoryOrder.indexOf(b.category);
  return categoryDifference || a.label.localeCompare(b.label, "nb");
}
