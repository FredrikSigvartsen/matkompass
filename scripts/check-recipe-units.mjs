import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const recipesDirectory = path.join(process.cwd(), "src/content/oppskrifter");
const americanUnits = /(?:°\s*F|fahrenheit|\b(?:unse|unser|pund|pint|kopp|kopper|cups?|ounces?|pounds?|quarts?|gallons?|fl\.?\s*oz|lbs?|oz|inches?|feet|foot|miles?)\b)/i;
const violations = [];

for (const category of await readdir(recipesDirectory, { withFileTypes: true })) {
  if (!category.isDirectory()) continue;

  const categoryPath = path.join(recipesDirectory, category.name);

  for (const fileName of await readdir(categoryPath)) {
    if (!fileName.endsWith(".md")) continue;

    const filePath = path.join(categoryPath, fileName);
    const lines = (await readFile(filePath, "utf8")).split("\n");

    lines.forEach((line, index) => {
      if (americanUnits.test(line)) {
        violations.push(`${path.relative(process.cwd(), filePath)}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}

if (violations.length > 0) {
  console.error("Fant amerikanske måleenheter:\n" + violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Alle oppskrifter bruker norske/metriske måleenheter.");
}
