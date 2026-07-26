import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  recipeCategories,
  type RecipeCategory,
} from "./recipe-categories";

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
  ingredients: string[];
  instructions: string[];
}

export type RecipeSummary = Pick<
  Recipe,
  "slug" | "title" | "category" | "yield" | "tags"
>;

const recipesDirectory = path.join(process.cwd(), "src/content/oppskrifter");

export function getAllRecipes(): Recipe[] {
  return recipeCategories
    .flatMap(({ slug }) => getRecipesByCategory(slug))
    .toSorted((a, b) => a.title.localeCompare(b.title, "nb"));
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  const categoryDirectory = path.join(recipesDirectory, category);

  return fs
    .readdirSync(categoryDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => readRecipe(category, fileName.replace(/\.md$/, "")))
    .toSorted((a, b) => a.title.localeCompare(b.title, "nb"));
}

export function getRecipe(category: RecipeCategory, slug: string): Recipe | null {
  const filePath = path.join(recipesDirectory, category, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return readRecipe(category, slug);
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

  const ingredients = readMarkdownSection(recipe.content, "Ingredienser");
  const instructions = readMarkdownSection(recipe.content, "Fremgangsmåte");

  if (ingredients.length === 0 || instructions.length === 0) {
    throw new Error(
      `Oppskriften ${reference.category}/${reference.slug} mangler ingredienser eller fremgangsmåte`,
    );
  }

  return {
    title: recipe.title,
    href: `/oppskrifter/${reference.category}/${reference.slug}`,
    ingredients,
    instructions,
  };
}

function readRecipe(category: RecipeCategory, slug: string): Recipe {
  const filePath = path.join(recipesDirectory, category, `${slug}.md`);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  if (
    typeof data.title !== "string" ||
    data.category !== category ||
    typeof data.source !== "string" ||
    typeof data.yield !== "string" ||
    (data.adapted !== undefined && typeof data.adapted !== "boolean") ||
    (data.adapted === true && typeof data.adaptationNote !== "string") ||
    (data.adaptationNote !== undefined && typeof data.adaptationNote !== "string") ||
    !Array.isArray(data.tags) ||
    !data.tags.every((tag) => typeof tag === "string")
  ) {
    throw new Error(`Ugyldig oppskriftsdata i ${filePath}`);
  }

  return {
    slug,
    title: data.title,
    category,
    source: data.source,
    yield: data.yield,
    tags: data.tags,
    adapted: data.adapted === true,
    adaptationNote: data.adaptationNote ?? "",
    content,
  };
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
