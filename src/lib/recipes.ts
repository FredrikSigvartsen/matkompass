import matter from "gray-matter";
import recipeSources from "../content/recipes.generated.json";
import {
  recipeCategories,
  type RecipeCategory,
} from "./recipe-categories";
import type {
  RecipeIngredient,
  RecipeIngredientGroup,
} from "./recipe-ingredients";

export {
  getCategoryLabel,
  isRecipeCategory,
  recipeCategories,
  type RecipeCategory,
} from "./recipe-categories";

export interface Recipe {
  slug: string;
  title: string;
  category: RecipeCategory;
  source: string;
  yield: string;
  baseAdultPortions?: number;
  ingredients: RecipeIngredientGroup[];
  tags: string[];
  adapted: boolean;
  adaptationNote: string;
  content: string;
}

export interface RecipeReference {
  category: RecipeCategory;
  slug: string;
}

export interface ResolvedRecipeReference {
  title: string;
  href: string;
  instructions: string[];
}

export type RecipeSummary = Pick<
  Recipe,
  "slug" | "title" | "category" | "yield" | "tags"
>;

const recipes = recipeSources.map((source) => {
  const category = recipeCategories.find(
    (candidate) => candidate.slug === source.category,
  )?.slug;

  if (!category) {
    throw new Error(`Ugyldig oppskriftskategori: ${source.category}`);
  }

  return readRecipe(category, source.slug, source.markdown);
});

export function getAllRecipes(): Recipe[] {
  return recipes.toSorted((a, b) => a.title.localeCompare(b.title, "nb"));
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return recipes
    .filter((recipe) => recipe.category === category)
    .toSorted((a, b) => a.title.localeCompare(b.title, "nb"));
}

export function getRecipe(category: RecipeCategory, slug: string): Recipe | null {
  return recipes.find(
    (recipe) => recipe.category === category && recipe.slug === slug,
  ) ?? null;
}

export function resolveRecipeReference(
  reference: RecipeReference,
): ResolvedRecipeReference {
  const recipe = getRecipe(reference.category, reference.slug);

  if (!recipe) {
    throw new Error(
      `Fant ikke oppskriften ${reference.category}/${reference.slug}`,
    );
  }

  const instructions = readMarkdownSection(recipe.content, "Fremgangsmåte");

  if (instructions.length === 0) {
    throw new Error(
      `Oppskriften ${reference.category}/${reference.slug} mangler fremgangsmåte`,
    );
  }

  return {
    title: recipe.title,
    href: `/oppskrifter/${reference.category}/${reference.slug}`,
    instructions,
  };
}

function readRecipe(
  category: RecipeCategory,
  slug: string,
  markdown: string,
): Recipe {
  const { data, content } = matter(markdown);

  if (
    typeof data.title !== "string" ||
    data.category !== category ||
    typeof data.source !== "string" ||
    typeof data.yield !== "string" ||
    (data.baseAdultPortions !== undefined &&
      (!Number.isFinite(data.baseAdultPortions) || data.baseAdultPortions <= 0)) ||
    !isIngredientGroups(data.ingredients) ||
    typeof data.adapted !== "boolean" ||
    typeof data.adaptationNote !== "string" ||
    !Array.isArray(data.tags) ||
    !data.tags.every((tag) => typeof tag === "string")
  ) {
    throw new Error(`Ugyldig oppskriftsdata i ${category}/${slug}.md`);
  }

  return {
    slug,
    title: data.title,
    category,
    source: data.source,
    yield: data.yield,
    baseAdultPortions: data.baseAdultPortions,
    ingredients: data.ingredients,
    tags: data.tags,
    adapted: data.adapted,
    adaptationNote: data.adaptationNote,
    content,
  };
}

function isIngredientGroups(value: unknown): value is RecipeIngredientGroup[] {
  const groupKeys = new Set(["title", "items"]);

  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (group) =>
        isRecord(group) &&
        Object.keys(group).every((key) => groupKeys.has(key)) &&
        (group.title === undefined || typeof group.title === "string") &&
        Array.isArray(group.items) &&
        group.items.length > 0 &&
        group.items.every(isIngredient),
    )
  );
}

function isIngredient(value: unknown): value is RecipeIngredient {
  const ingredientKeys = new Set([
    "amount",
    "maxAmount",
    "unit",
    "text",
    "approximate",
    "optional",
    "scalable",
  ]);

  if (!isRecord(value) || typeof value.text !== "string" || !value.text.trim()) {
    return false;
  }

  if (!Object.keys(value).every((key) => ingredientKeys.has(key))) {
    return false;
  }

  if (
    value.amount !== undefined &&
    (!Number.isFinite(value.amount) || (value.amount as number) <= 0)
  ) {
    return false;
  }

  if (
    value.maxAmount !== undefined &&
    (value.amount === undefined ||
      !Number.isFinite(value.maxAmount) ||
      (value.maxAmount as number) < (value.amount as number))
  ) {
    return false;
  }

  if (
    value.amount === undefined &&
    (value.maxAmount !== undefined ||
      value.unit !== undefined ||
      value.approximate !== undefined)
  ) {
    return false;
  }

  if (value.scalable === false && value.amount !== undefined) {
    return false;
  }

  return (
    (value.unit === undefined || typeof value.unit === "string") &&
    (value.approximate === undefined || typeof value.approximate === "boolean") &&
    (value.optional === undefined || typeof value.optional === "boolean") &&
    (value.scalable === undefined || value.scalable === false)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readMarkdownSection(content: string, heading: string): string[] {
  const lines = content.split("\n");
  const start = lines.findIndex(
    (line) => line.trim().toLocaleLowerCase("nb") === `## ${heading}`.toLocaleLowerCase("nb"),
  );

  if (start === -1) {
    return [];
  }

  const items: string[] = [];

  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      break;
    }

    if (!trimmed || trimmed.startsWith("### ")) {
      continue;
    }

    items.push(
      trimmed
        .replace(/^[-*]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .replace(/^\*\*(.+)\*\*$/, "$1"),
    );
  }

  return items;
}
