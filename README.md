# Matkompass

En norsk Next.js-side for familiens matprinsipper, råvarer, oppskrifter og ukeplaner.

## Utvikling

```bash
pnpm install
pnpm dev
```

Produksjonsbygget verifiseres med:

```bash
pnpm run check:plans
pnpm run check:recipes
pnpm run check:groceries
pnpm run check:units
pnpm run build
```

## Innhold

- `src/content/oppskrifter/`: oppskrifter i Markdown
- `src/content/site-content.ts`: prinsipper og råvarelister
- `src/content/meal-plan.ts`: måltider, middagsrotasjon og gramvekter
- `src/content/grocery-catalog.ts`: dagligvareidentiteter og kjøpsenheter
- `src/content/retailers.ts`: butikkene som kan velges i handlelisten
- `CONTEXT.md`: avklarte domenebegreper og planregler

Markdown-oppskriftene er eneste sannhetskilde for oppskriftstitler, ingredienser og fremgangsmåter. Ingrediensene lagres strukturert i filens frontmatter, slik at mengdene kan skaleres til voksne og barn. Planlagte oppskrifter har også stabile dagligvareidentiteter i frontmatter. Ukeplanene refererer til oppskriftene med kategori og slug, lagrer planjusterte mengder og kan uttrykkelig utelate en oppskriftsråvare når planen erstatter den.

## Matvaretabellen

Planene bruker et versjonert uttrekk fra Mattilsynets Matvaretabell. Oppdater uttrekket med:

```bash
pnpm run update:foods
```

Etter oppdatering må `pnpm run check:plans` kjøres og eventuelle endringer i makroberegningene vurderes før publisering.
