"use client";

import { RecipeGrid } from "@/app/_components/recipe-grid";
import { getCategoryLabel } from "@/lib/recipe-categories";
import type { RecipeSummary } from "@/lib/recipes";
import { useDeferredValue, useState } from "react";

interface RecipeSearchProps {
  recipes: RecipeSummary[];
}

export function RecipeSearch({ recipes }: RecipeSearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("nb"));
  const filteredRecipes = deferredQuery
    ? recipes.filter((recipe) => {
        const searchableText = [
          recipe.title,
          getCategoryLabel(recipe.category),
          recipe.yield,
          ...recipe.tags,
        ]
          .join(" ")
          .toLocaleLowerCase("nb");

        return searchableText.includes(deferredQuery);
      })
    : recipes;

  return (
    <section className="recipe-search" aria-labelledby="oppskriftssok-tittel">
      <div className="recipe-search__field">
        <label id="oppskriftssok-tittel" htmlFor="oppskriftssok" className="eyebrow">
          Søk i oppskriftene
        </label>
        <div className="recipe-search__input-wrap">
          <input
            id="oppskriftssok"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="For eksempel laks, frokost eller protein"
          />
          <span aria-hidden="true">⌕</span>
        </div>
      </div>
      <p className="recipe-search__count" aria-live="polite">
        {filteredRecipes.length === 1
          ? "1 oppskrift"
          : `${filteredRecipes.length} oppskrifter`}
      </p>
      {filteredRecipes.length > 0 ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <div className="recipe-search__empty">
          <h2>Ingen oppskrifter funnet</h2>
          <p>Prøv et annet søkeord eller velg en kategori over.</p>
        </div>
      )}
    </section>
  );
}
