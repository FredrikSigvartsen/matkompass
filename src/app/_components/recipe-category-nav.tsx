import {
  recipeCategories,
  type RecipeCategory,
} from "@/lib/recipe-categories";
import Link from "next/link";

interface RecipeCategoryNavProps {
  activeCategory?: RecipeCategory;
}

export function RecipeCategoryNav({
  activeCategory,
}: RecipeCategoryNavProps) {
  return (
    <nav className="category-nav" aria-label="Oppskriftskategorier">
      <Link
        href="/oppskrifter"
        className={!activeCategory ? "category-nav__link is-active" : "category-nav__link"}
        aria-current={!activeCategory ? "page" : undefined}
      >
        Alle
      </Link>
      {recipeCategories.map((category) => (
        <Link
          key={category.slug}
          href={`/oppskrifter/${category.slug}`}
          className={
            activeCategory === category.slug
              ? "category-nav__link is-active"
              : "category-nav__link"
          }
          aria-current={activeCategory === category.slug ? "page" : undefined}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
