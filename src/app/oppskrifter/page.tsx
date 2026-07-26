import { PageIntro } from "@/app/_components/page-intro";
import { RecipeCategoryNav } from "@/app/_components/recipe-category-nav";
import { RecipeSearch } from "@/app/_components/recipe-search";
import { getAllRecipes } from "@/lib/recipes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oppskrifter",
  description: "Familiens oppskrifter til frokost, lunsj, middag, dessert og snacks.",
};

export default function RecipesPage() {
  const recipes = getAllRecipes();
  const recipeSummaries = recipes.map((recipe) => ({
    slug: recipe.slug,
    title: recipe.title,
    category: recipe.category,
    yield: recipe.yield,
    tags: recipe.tags,
  }));

  return (
    <main className="content-page recipes-page">
      <PageIntro
        eyebrow={`${recipes.length} oppskrifter`}
        title="Oppskrifter"
        description="Frokost, lunsj, middag, dessert og snacks. Oppskriftene er kontrollert mot Mat vi spiser og Prinsipper før publisering."
      />
      <RecipeCategoryNav />
      <RecipeSearch recipes={recipeSummaries} />
    </main>
  );
}
