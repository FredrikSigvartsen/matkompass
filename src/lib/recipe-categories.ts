export const recipeCategories = [
  { slug: "frokost", label: "Frokost" },
  { slug: "lunsj", label: "Lunsj" },
  { slug: "middag", label: "Middag" },
  { slug: "dessert", label: "Dessert" },
  { slug: "snacks", label: "Snacks" },
] as const;

export type RecipeCategory = (typeof recipeCategories)[number]["slug"];

export function isRecipeCategory(value: string): value is RecipeCategory {
  return recipeCategories.some((category) => category.slug === value);
}

export function getCategoryLabel(categorySlug: RecipeCategory): string {
  return recipeCategories.find((category) => category.slug === categorySlug)!.label;
}
