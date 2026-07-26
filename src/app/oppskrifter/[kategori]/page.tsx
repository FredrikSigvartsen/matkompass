import { PageIntro } from "@/app/_components/page-intro";
import { RecipeCategoryNav } from "@/app/_components/recipe-category-nav";
import { RecipeGrid } from "@/app/_components/recipe-grid";
import {
  getCategoryLabel,
  getRecipesByCategory,
  isRecipeCategory,
  recipeCategories,
} from "@/lib/recipes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ kategori: string }>;
}

export function generateStaticParams() {
  return recipeCategories.map((category) => ({ kategori: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { kategori } = await params;

  if (!isRecipeCategory(kategori)) {
    return {};
  }

  const label = getCategoryLabel(kategori);
  return {
    title: label,
    description: `Oppskrifter til ${label.toLocaleLowerCase("nb")}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { kategori } = await params;

  if (!isRecipeCategory(kategori)) {
    notFound();
  }

  const recipes = getRecipesByCategory(kategori);
  const label = getCategoryLabel(kategori);

  return (
    <main className="content-page recipes-page">
      <PageIntro
        eyebrow={`${recipes.length} oppskrifter`}
        title={label}
        description={`Alle oppskriftene våre til ${label.toLocaleLowerCase("nb")}, samlet på ett sted.`}
      />
      <RecipeCategoryNav activeCategory={kategori} />
      <RecipeGrid recipes={recipes} />
    </main>
  );
}
