import { foods } from "./matvaretabellen.generated";
import type { RecipeReference } from "../lib/recipes";

export type FoodId = (typeof foods)[number]["id"];

export interface IngredientAmount {
  foodId: FoodId;
  grams: number;
  label: string;
}

export interface PlannedMeal {
  title?: string;
  recipe?: RecipeReference;
  ingredients: IngredientAmount[];
  details?: string[];
}

export interface DinnerDefinition {
  recipe: RecipeReference;
  plannedIngredients: IngredientAmount[];
  carbFoodId: FoodId;
  carbLabel: string;
}

export type DayKind = "active" | "rest" | "long";

export interface DayProfile {
  name: string;
  shortName: string;
  kind: DayKind;
  fredrikTrains: boolean;
  kamillaTrains: boolean;
  officeDay: boolean;
}

export const dayProfiles: DayProfile[] = [
  {
    name: "Mandag",
    shortName: "Man",
    kind: "active",
    fredrikTrains: true,
    kamillaTrains: false,
    officeDay: true,
  },
  {
    name: "Tirsdag",
    shortName: "Tir",
    kind: "rest",
    fredrikTrains: false,
    kamillaTrains: true,
    officeDay: false,
  },
  {
    name: "Onsdag",
    shortName: "Ons",
    kind: "active",
    fredrikTrains: true,
    kamillaTrains: false,
    officeDay: false,
  },
  {
    name: "Torsdag",
    shortName: "Tor",
    kind: "rest",
    fredrikTrains: false,
    kamillaTrains: true,
    officeDay: true,
  },
  {
    name: "Fredag",
    shortName: "Fre",
    kind: "active",
    fredrikTrains: true,
    kamillaTrains: false,
    officeDay: false,
  },
  {
    name: "Lørdag",
    shortName: "Lør",
    kind: "long",
    fredrikTrains: true,
    kamillaTrains: true,
    officeDay: false,
  },
  {
    name: "Søndag",
    shortName: "Søn",
    kind: "rest",
    fredrikTrains: false,
    kamillaTrains: false,
    officeDay: false,
  },
];

export const nutritionTargets = {
  active: { calories: 2350, protein: 165, fat: 80, carbs: 245 },
  rest: { calories: 1950, protein: 160, fat: 85, carbs: 135 },
  long: { calories: 2550, protein: 165, fat: 80, carbs: 285 },
} as const;

const recipeRef = (
  category: RecipeReference["category"],
  slug: string,
): RecipeReference => ({ category, slug });

const officeBreakfast = (cottageCheese: number, walnuts: number): PlannedMeal => ({
  title: "Cottage cheese med valnøtter og honning",
  ingredients: [
    { foodId: "01.028", grams: cottageCheese, label: "cottage cheese" },
    { foodId: "06.560", grams: walnuts, label: "valnøtter" },
    { foodId: "09.003", grams: 30, label: "rå honning" },
  ],
  details: ["Pakkes kvelden før og oppbevares kaldt."],
});

export const daytimeMeals: PlannedMeal[][] = [
  [
    officeBreakfast(250, 20),
    {
      recipe: recipeRef("lunsj", "avokado-og-tunfisktarn-uten-forberedelser"),
      ingredients: [
        { foodId: "04.107", grams: 200, label: "tunfisk i olje, avrent" },
        { foodId: "06.524", grams: 40, label: "avokado" },
        { foodId: "06.010", grams: 100, label: "agurk" },
        { foodId: "06.136", grams: 330, label: "søtpotet" },
      ],
      details: ["Søtpoteten bakes på forhånd og serveres kald eller lun."],
    },
  ],
  [
    {
      recipe: recipeRef("frokost", "gronnsaks-og-eggemuffins-for-stabilt-blodsukker"),
      ingredients: [
        { foodId: "02.001", grams: 200, label: "egg, ca. 4 stk." },
        { foodId: "03.205", grams: 50, label: "kyllingfilet" },
        { foodId: "06.701", grams: 40, label: "kokosmelk" },
        { foodId: "06.064", grams: 100, label: "spinat" },
        { foodId: "06.048", grams: 100, label: "rød paprika" },
      ],
    },
    {
      recipe: recipeRef("lunsj", "kalkun-og-kraftbolle-for-tarmreparasjon"),
      ingredients: [
        { foodId: "03.004", grams: 222, label: "kalkunkjøtt" },
        { foodId: "05.340", grams: 330, label: "kokt villris" },
        { foodId: "06.064", grams: 100, label: "spinat" },
        { foodId: "06.016", grams: 150, label: "blomkålris" },
        { foodId: "06.524", grams: 65, label: "avokado" },
      ],
      details: ["Tilsett 2 dl hjemmelaget eller ren kyllingkraft."],
    },
  ],
  [
    {
      recipe: recipeRef("frokost", "frokostpanne"),
      ingredients: [
        { foodId: "02.001", grams: 150, label: "egg, ca. 3 stk." },
        { foodId: "06.136", grams: 250, label: "søtpotet" },
        { foodId: "06.085", grams: 100, label: "squash" },
        { foodId: "06.064", grams: 50, label: "spinat" },
        { foodId: "08.252", grams: 5, label: "ghee" },
      ],
    },
    {
      recipe: recipeRef("lunsj", "grillet-kylling-avgiftningstallerken"),
      ingredients: [
        { foodId: "03.205", grams: 270, label: "kyllingfilet" },
        { foodId: "06.018", grams: 150, label: "brokkoli" },
        { foodId: "06.524", grams: 50, label: "avokado" },
        { foodId: "06.136", grams: 210, label: "søtpotet" },
      ],
    },
  ],
  [
    officeBreakfast(350, 15),
    {
      title: "Tunfisk og sardiner med søtpotet",
      ingredients: [
        { foodId: "04.107", grams: 110, label: "tunfisk i olje, avrent" },
        { foodId: "04.322", grams: 120, label: "sardiner i olje, avrent" },
        { foodId: "06.010", grams: 100, label: "agurk" },
        { foodId: "06.136", grams: 320, label: "søtpotet" },
      ],
      details: ["Pakkes som en kald lunsjtallerken til kontoret."],
    },
  ],
  [
    {
      recipe: recipeRef("frokost", "gronnsaks-og-eggemuffins-for-stabilt-blodsukker"),
      ingredients: [
        { foodId: "02.001", grams: 100, label: "egg, ca. 2 stk." },
        { foodId: "03.205", grams: 120, label: "kyllingfilet" },
        { foodId: "06.701", grams: 20, label: "kokosmelk" },
        { foodId: "06.064", grams: 100, label: "spinat" },
        { foodId: "06.048", grams: 100, label: "rød paprika" },
      ],
    },
    {
      recipe: recipeRef("lunsj", "hormonbalansebolle"),
      ingredients: [
        { foodId: "04.015", grams: 200, label: "villaks" },
        { foodId: "06.136", grams: 450, label: "søtpotet" },
        { foodId: "06.035", grams: 100, label: "grønnkål" },
      ],
    },
  ],
  [
    {
      recipe: recipeRef("frokost", "frokostpanne"),
      ingredients: [
        { foodId: "02.001", grams: 150, label: "egg, ca. 3 stk." },
        { foodId: "06.136", grams: 250, label: "søtpotet" },
        { foodId: "06.085", grams: 100, label: "squash" },
        { foodId: "06.064", grams: 50, label: "spinat" },
        { foodId: "08.252", grams: 5, label: "ghee" },
      ],
    },
    {
      recipe: recipeRef("lunsj", "betennelsesdempende-salatwraps"),
      ingredients: [
        { foodId: "03.004", grams: 235, label: "kalkunkjøtt" },
        { foodId: "06.138", grams: 100, label: "romanosalat" },
        { foodId: "06.036", grams: 50, label: "gulrot" },
        { foodId: "06.010", grams: 50, label: "agurk" },
        { foodId: "06.136", grams: 210, label: "søtpotet" },
        { foodId: "08.112", grams: 5, label: "extra virgin olivenolje" },
      ],
    },
  ],
  [
    {
      recipe: recipeRef("frokost", "morgeneggerore"),
      ingredients: [
        { foodId: "02.001", grams: 150, label: "egg, ca. 3 stk." },
        { foodId: "03.126", grams: 200, label: "karbonadedeig" },
        { foodId: "06.064", grams: 100, label: "spinat" },
        { foodId: "06.062", grams: 100, label: "sjampinjong" },
      ],
    },
    {
      recipe: recipeRef("lunsj", "gronnsakssuppe-som-styrker-lymfesystemet"),
      ingredients: [
        { foodId: "03.205", grams: 125, label: "kyllingfilet" },
        { foodId: "06.262", grams: 400, label: "kokt potet" },
        { foodId: "06.016", grams: 100, label: "blomkål" },
        { foodId: "06.036", grams: 100, label: "gulrot" },
        { foodId: "06.042", grams: 50, label: "gul løk" },
        { foodId: "08.112", grams: 26, label: "extra virgin olivenolje" },
      ],
      details: ["Tilsett 3 dl hjemmelaget eller ren kyllingkraft."],
    },
  ],
];

export const trainingSnack: PlannedMeal = {
  title: "Før treningsøkt",
  ingredients: [
    { foodId: "02.001", grams: 100, label: "kokte egg, ca. 2 stk." },
    { foodId: "06.525", grams: 200, label: "banan" },
    { foodId: "09.003", grams: 14, label: "rå honning" },
  ],
};

export const longTrainingSnack: PlannedMeal = {
  title: "Før treningsøkt",
  ingredients: [
    { foodId: "02.001", grams: 100, label: "kokte egg, ca. 2 stk." },
    { foodId: "06.525", grams: 350, label: "banan" },
    { foodId: "09.003", grams: 27, label: "rå honning" },
  ],
  details: ["Større porsjon for langkjøringsdagen."],
};

export const dinnerDefinitions: Record<string, DinnerDefinition> = {
  lemonChicken: {
    recipe: recipeRef("middag", "sitron-og-urtekylling-med-gronnsaker-i-en-panne"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "03.332", grams: 430, label: "kyllinglår uten skinn og bein" },
      { foodId: "05.340", grams: 436, label: "kokt villris" },
      { foodId: "06.018", grams: 250, label: "brokkoli" },
      { foodId: "06.048", grams: 200, label: "rød paprika" },
      { foodId: "06.085", grams: 250, label: "squash" },
      { foodId: "08.112", grams: 36, label: "extra virgin olivenolje" },
    ],
  },
  salmonTacos: {
    recipe: recipeRef("middag", "laksetaco-i-hjertesalat"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "04.015", grams: 420, label: "villaks" },
      { foodId: "05.340", grams: 455, label: "kokt villris" },
      { foodId: "06.524", grams: 75, label: "avokado" },
      { foodId: "06.207", grams: 150, label: "hjertesalat" },
      { foodId: "06.010", grams: 300, label: "agurk" },
      { foodId: "06.752", grams: 150, label: "cherrytomater" },
      { foodId: "06.042", grams: 100, label: "løk" },
    ],
  },
  steakTips: {
    recipe: recipeRef("middag", "biffbiter"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.066", grams: 410, label: "ytrefilet i biter" },
      { foodId: "06.262", grams: 580, label: "kokt potet" },
      { foodId: "06.018", grams: 250, label: "brokkoli" },
      { foodId: "06.048", grams: 200, label: "rød paprika" },
      { foodId: "08.112", grams: 55, label: "extra virgin olivenolje" },
    ],
  },
  castIronSteak: {
    recipe: recipeRef("middag", "stopjernsbiff-med-avgiftende-bladgront"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.066", grams: 405, label: "ytrefilet" },
      { foodId: "06.262", grams: 620, label: "kokt potet" },
      { foodId: "06.035", grams: 300, label: "grønnkål" },
      { foodId: "08.252", grams: 52, label: "ghee" },
    ],
  },
  salmonPoke: {
    recipe: recipeRef("middag", "poke-med-varmebehandlet-laks-og-quinoa"),
    carbFoodId: "06.616",
    carbLabel: "kokt quinoa",
    plannedIngredients: [
      { foodId: "04.015", grams: 285, label: "villaks" },
      { foodId: "06.616", grams: 466, label: "kokt quinoa" },
      { foodId: "06.093", grams: 300, label: "rødkål" },
      { foodId: "06.036", grams: 150, label: "gulrot" },
      { foodId: "06.010", grams: 250, label: "agurk" },
      { foodId: "05.030", grams: 8, label: "sesamfrø" },
    ],
  },
  turkeyMeatballs: {
    recipe: recipeRef("middag", "rene-kalkunkjottboller-med-blomkalmos"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.004", grams: 320, label: "kalkunkjøttdeig" },
      { foodId: "02.001", grams: 100, label: "egg, ca. 2 stk." },
      { foodId: "05.420", grams: 20, label: "mandelmel" },
      { foodId: "06.016", grams: 500, label: "blomkål" },
      { foodId: "06.262", grams: 600, label: "kokt potet" },
      { foodId: "08.252", grams: 25, label: "ghee" },
    ],
  },
  beefBurgers: {
    recipe: recipeRef("middag", "salatinnpakkede-storfeburgere"),
    carbFoodId: "06.136",
    carbLabel: "bakt søtpotet",
    plannedIngredients: [
      { foodId: "03.126", grams: 560, label: "karbonadedeig" },
      { foodId: "06.136", grams: 650, label: "søtpotet" },
      { foodId: "06.524", grams: 180, label: "avokado" },
      { foodId: "06.138", grams: 150, label: "romanosalat" },
      { foodId: "06.042", grams: 100, label: "løk" },
      { foodId: "08.252", grams: 10, label: "ghee" },
    ],
  },
  lemonSalmon: {
    recipe: recipeRef("middag", "villaks-med-sitron-dill-og-ovnsstekte-gronnsaker"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "04.015", grams: 600, label: "villaks" },
      { foodId: "06.262", grams: 620, label: "kokt potet" },
      { foodId: "06.018", grams: 250, label: "brokkoli" },
      { foodId: "06.085", grams: 250, label: "squash" },
    ],
  },
  chickenCurry: {
    recipe: recipeRef("middag", "betennelsesdempende-kyllingcurrybolle"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "03.205", grams: 430, label: "kyllingfilet" },
      { foodId: "06.701", grams: 280, label: "kokosmelk" },
      { foodId: "05.340", grams: 470, label: "kokt villris" },
      { foodId: "06.085", grams: 250, label: "squash" },
      { foodId: "06.016", grams: 350, label: "blomkålris" },
    ],
  },
  tacoBowl: {
    recipe: recipeRef("middag", "tacobowl-med-sotpotet-og-cottage-cheese"),
    carbFoodId: "06.136",
    carbLabel: "bakt søtpotet",
    plannedIngredients: [
      { foodId: "03.126", grams: 400, label: "karbonadedeig" },
      { foodId: "01.028", grams: 300, label: "cottage cheese" },
      { foodId: "06.136", grams: 650, label: "søtpotet" },
      { foodId: "06.524", grams: 150, label: "avokado" },
      { foodId: "06.752", grams: 200, label: "cherrytomater" },
      { foodId: "06.138", grams: 150, label: "romanosalat" },
      { foodId: "08.252", grams: 15, label: "ghee" },
    ],
  },
  garlicShrimp: {
    recipe: recipeRef("middag", "hvitloksreker-med-squashnudler-i-en-panne"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "04.387", grams: 470, label: "villfangede reker" },
      { foodId: "05.340", grams: 500, label: "kokt villris" },
      { foodId: "06.085", grams: 600, label: "squashnudler" },
      { foodId: "08.112", grams: 60, label: "extra virgin olivenolje" },
    ],
  },
  chickenStew: {
    recipe: recipeRef("middag", "kyllinggryte-med-gurkemeie-og-kokos"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.332", grams: 600, label: "kyllinglår uten skinn og bein" },
      { foodId: "06.701", grams: 120, label: "kokosmelk" },
      { foodId: "06.262", grams: 620, label: "kokt potet" },
      { foodId: "06.085", grams: 250, label: "squash" },
      { foodId: "06.042", grams: 150, label: "gul løk" },
      { foodId: "08.249", grams: 7, label: "kokosolje" },
    ],
  },
};

export const dinnerRotation = {
  A: [
    dinnerDefinitions.lemonChicken,
    dinnerDefinitions.steakTips,
    dinnerDefinitions.salmonPoke,
    dinnerDefinitions.beefBurgers,
    dinnerDefinitions.castIronSteak,
    dinnerDefinitions.chickenCurry,
    dinnerDefinitions.garlicShrimp,
  ],
  B: [
    dinnerDefinitions.salmonTacos,
    dinnerDefinitions.castIronSteak,
    dinnerDefinitions.turkeyMeatballs,
    dinnerDefinitions.lemonSalmon,
    dinnerDefinitions.steakTips,
    dinnerDefinitions.tacoBowl,
    dinnerDefinitions.chickenStew,
  ],
} as const;
