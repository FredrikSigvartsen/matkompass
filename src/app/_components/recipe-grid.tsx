import { getCategoryLabel } from "@/lib/recipe-categories";
import type { RecipeSummary } from "@/lib/recipes";
import Link from "next/link";

interface RecipeGridProps {
  recipes: RecipeSummary[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <ul className="recipe-grid">
      {recipes.map((recipe, index) => (
        <li key={`${recipe.category}-${recipe.slug}`}>
          <Link
            href={`/oppskrifter/${recipe.category}/${recipe.slug}`}
            className={`recipe-card recipe-card--${recipe.category}`}
          >
            <span className="recipe-card__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="recipe-card__category">
              {getCategoryLabel(recipe.category)}
            </span>
            <h2>{recipe.title}</h2>
            {recipe.yield ? <span className="recipe-card__yield">{recipe.yield}</span> : null}
            <span className="recipe-card__action">Se oppskrift →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
