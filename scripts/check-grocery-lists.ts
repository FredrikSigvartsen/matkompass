import { retailers } from "../src/content/retailers";
import {
  getWeeklyGroceryList,
  validateGroceryConfiguration,
} from "../src/lib/grocery-list";

const referenceDate = new Date("2026-07-20T12:00:00Z");

validateGroceryConfiguration(referenceDate);

const lists = [
  getWeeklyGroceryList("current", referenceDate),
  getWeeklyGroceryList("next", referenceDate),
];

assert(lists[0].week.type === "A", "Referanseuken skal være plan A");
assert(lists[1].week.type === "B", "Neste referanseuke skal være plan B");

for (const list of lists) {
  assert(list.lines.length > 30, `Uke ${list.week.weekNumber} har for få dagligvarer`);
  assert(
    new Set(list.lines.map((line) => line.id)).size === list.lines.length,
    `Uke ${list.week.weekNumber} har dupliserte dagligvarer`,
  );

  for (const line of list.lines) {
    assert(
      line.offers.length === retailers.length,
      `${line.label} mangler butikkalternativer`,
    );
    assert(
      line.offers.some((offer) => offer.id === line.defaultOfferId),
      `${line.label} mangler gyldig standardbutikk`,
    );

    for (const offer of line.offers) {
      const retailer = retailers.find((candidate) => candidate.id === offer.retailerId);
      const url = new URL(offer.url);

      assert(retailer !== undefined, `${line.label} viser ukjent butikk`);
      assert(url.protocol === "https:", `${line.label} har en usikker butikklenke`);
      assert(
        url.hostname === retailer.hostname,
        `${line.label} peker ikke til ${retailer.label}`,
      );
    }
  }

  const wildRice = list.lines.find((line) => line.id === "wild-rice");
  const dinnerSources = new Set(
    list.lines.flatMap((line) => line.sources.filter((source) => source.endsWith("middag"))),
  );

  assert(wildRice !== undefined, `Uke ${list.week.weekNumber} mangler villris`);
  assert(dinnerSources.size === 7, `Uke ${list.week.weekNumber} mangler en familiemiddag`);
  console.log(
    `OK Uke ${list.week.weekNumber} (${list.week.type}): ${list.lines.length} dagligvarer, ` +
      `${list.lines.filter((line) => line.section === "buy").length} må kjøpes`,
  );
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
