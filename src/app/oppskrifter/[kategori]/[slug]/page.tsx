import { RecipeCategoryNav } from "@/app/_components/recipe-category-nav";
import markdownToHtml from "@/lib/markdownToHtml";
import {
  getAllRecipes,
  getCategoryLabel,
  getRecipe,
  isRecipeCategory,
} from "@/lib/recipes";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RecipePageProps {
  params: Promise<{ kategori: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllRecipes().map((recipe) => ({
    kategori: recipe.category,
    slug: recipe.slug,
  }));
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { kategori, slug } = await params;

  if (!isRecipeCategory(kategori)) {
    return {};
  }

  const recipe = getRecipe(kategori, slug);
  return recipe ? { title: recipe.title } : {};
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { kategori, slug } = await params;

  if (!isRecipeCategory(kategori)) {
    notFound();
  }

  const recipe = getRecipe(kategori, slug);

  if (!recipe) {
    notFound();
  }

  const content = await markdownToHtml(recipe.content);
  const categoryLabel = getCategoryLabel(recipe.category);

  return (
    <main className="recipe-page">
      <RecipeCategoryNav activeCategory={recipe.category} />
      <article>
        <header className={`recipe-header recipe-header--${recipe.category}`}>
          <Link href={`/oppskrifter/${recipe.category}`} className="recipe-back-link">
            ← {categoryLabel}
          </Link>
          <p className="eyebrow">{categoryLabel}</p>
          <h1>{recipe.title}</h1>
          <div className="recipe-meta">
            {recipe.yield ? <span>{recipe.yield}</span> : null}
            {recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </header>
        <div
          className="recipe-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <footer className="recipe-source">
          <p className="eyebrow">Kilde</p>
          <p>
            {recipe.adapted
              ? `Oppskriften er tilpasset før publisering. ${recipe.adaptationNote}`
              : "Oppskriften er hentet fra LLM-wikien, oversatt til norsk og konvertert til metriske måleenheter uten å endre tilsvarende mengder eller fremgangsmåte."}
          </p>
          <a href={recipe.source} rel="noreferrer">
            Se den opprinnelige kilden
          </a>
        </footer>
      </article>
    </main>
  );
}
