import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const recipesDirectory = path.join(process.cwd(), "src/content/oppskrifter");
const outputPath = path.join(process.cwd(), "src/content/recipes.generated.json");
const categories = (await readdir(recipesDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .toSorted();
const recipes = [];

for (const category of categories) {
  const categoryDirectory = path.join(recipesDirectory, category);
  const fileNames = (await readdir(categoryDirectory))
    .filter((fileName) => fileName.endsWith(".md"))
    .toSorted();

  for (const fileName of fileNames) {
    recipes.push({
      category,
      slug: fileName.replace(/\.md$/, ""),
      markdown: await readFile(path.join(categoryDirectory, fileName), "utf8"),
    });
  }
}

await writeFile(outputPath, `${JSON.stringify(recipes, null, 2)}\n`);
console.log(`Genererte ${recipes.length} oppskrifter i ${path.relative(process.cwd(), outputPath)}.`);
