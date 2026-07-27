import { foods } from "./matvaretabellen.generated";
import type { RecipeReference } from "../lib/recipes";

export type FoodId = (typeof foods)[number]["id"];

export interface IngredientAmount {
  foodId: FoodId;
  grams: number;
  label?: string;
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
export type DayName =
  | "Mandag"
  | "Tirsdag"
  | "Onsdag"
  | "Torsdag"
  | "Fredag"
  | "Lørdag"
  | "Søndag";

export interface DayProfile {
  name: DayName;
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
  active: { calories: 1900, protein: 157, fat: 36, carbs: 238 },
  rest: { calories: 1900, protein: 152, fat: 38, carbs: 238 },
  long: { calories: 1900, protein: 157, fat: 36, carbs: 238 },
} as const;

export const mealPlanNutritionMetadata = {
  calculatedAt: "2026-07-27",
  notes: [
    "Fredriks plan er periodisert rundt 1 900 kcal med 152–157 g protein, omtrent 238 g karbohydrat og 36–38 g fett.",
    "Karbohydrat prioriteres for glykogen og treningskvalitet; oljer, avokado, kokosmelk, nøtter, hele egg og fet fisk brukes i målte mengder.",
    "Fettandelen er en midlertidig periodisering innenfor en stram energiramme, ikke et mål om å unngå fett. Revurder ved prestasjonsfall, vedvarende sult, dårlig restitusjon eller økende MTSS-symptomer.",
    "Kalkunkjøttdeig bruker Kalkun, kjøtt med skinn, rå som nærmeste tilgjengelige Matvaretabellen-verdi.",
  ],
} as const;

const recipeRef = (
  category: RecipeReference["category"],
  slug: string,
): RecipeReference => ({ category, slug });

const officeBreakfast = (
  cottageCheese: number,
  eggWhites: number,
  banana: number,
  honey: number,
): PlannedMeal => ({
  title: "Cottage cheese med banan og honning",
  ingredients: [
    { foodId: "01.028", grams: cottageCheese, label: "cottage cheese" },
    { foodId: "02.002", grams: eggWhites, label: "eggehvite" },
    { foodId: "06.525", grams: banana, label: "banan" },
    { foodId: "09.003", grams: honey, label: "rå honning" },
  ],
  details: ["Eggehvitene stekes i batch. Resten pakkes på under to minutter kvelden før."],
});

const officeLunch = (
  tuna: number,
  avocado: number,
  sweetPotato: number,
): PlannedMeal => ({
  recipe: recipeRef("lunsj", "avokado-og-tunfisktarn-uten-forberedelser"),
  ingredients: [
    { foodId: "04.107", grams: tuna, label: "tunfisk i olje, avrent" },
    { foodId: "06.524", grams: avocado, label: "avokado" },
    { foodId: "06.010", grams: 100, label: "agurk" },
    { foodId: "06.136", grams: sweetPotato, label: "søtpotet" },
  ],
  details: ["Søtpoteten bakes i batch; tunfisk og avokado åpnes når måltidet settes sammen."],
});

const morningScramble = (
  protein: "karbonadedeig" | "ytrefilet",
  proteinGrams: number,
  eggWhites: number,
  sweetPotato: number,
  details: string[],
): PlannedMeal => ({
  recipe: recipeRef("frokost", "morgeneggerore"),
  ingredients: [
    { foodId: "02.001", grams: 50, label: "egg, ca. 1 stk." },
    { foodId: "02.002", grams: eggWhites, label: "eggehvite" },
    {
      foodId: protein === "karbonadedeig" ? "03.126" : "03.066",
      grams: proteinGrams,
      label: protein,
    },
    { foodId: "06.064", grams: 100, label: "spinat" },
    { foodId: "06.062", grams: 100, label: "sjampinjong" },
    { foodId: "06.136", grams: sweetPotato, label: "søtpotet" },
  ],
  details,
});

const hormoneHarmonyBowl = (
  protein: "kyllingfilet" | "norsk røkt laks",
  proteinGrams: number,
  sweetPotato: number,
  avocado: number,
  details: string[],
): PlannedMeal => ({
  recipe: recipeRef("lunsj", "hormonbalansebolle"),
  ingredients: [
    {
      foodId: protein === "kyllingfilet" ? "03.205" : "04.018",
      grams: proteinGrams,
      label: protein,
    },
    { foodId: "06.136", grams: sweetPotato, label: "søtpotet" },
    { foodId: "06.035", grams: 100, label: "grønnkål" },
    { foodId: "06.524", grams: avocado, label: "avokado" },
  ],
  details,
});

export const daytimeMeals: Record<DayName, [PlannedMeal, PlannedMeal]> = {
  Mandag: [
    officeBreakfast(90, 250, 200, 20),
    officeLunch(195, 10, 120),
  ],
  Tirsdag: [
    morningScramble("karbonadedeig", 70, 200, 450, [
      "Lag dobbel kjøtt- og grønnsaksbase; halvparten settes kaldt til onsdag.",
    ]),
    hormoneHarmonyBowl("kyllingfilet", 175, 625, 55, [
      "Lag to boller samtidig. Onsdagsporsjonen oppbevares kaldt uten avokado.",
    ]),
  ],
  Onsdag: [
    morningScramble("karbonadedeig", 50, 325, 170, [
      "Varm opp basen fra tirsdag og tilsett dagens egg og eggehvite.",
    ]),
    hormoneHarmonyBowl("kyllingfilet", 163, 236, 0, [
      "Bruk den ferdige kyllingen og søtpoteten fra tirsdag; tilsett grønnkål ved servering.",
    ]),
  ],
  Torsdag: [
    officeBreakfast(190, 340, 400, 20),
    officeLunch(195, 15, 520),
  ],
  Fredag: [
    morningScramble("ytrefilet", 90, 280, 200, [
      "Ytrefileten stekes raskt i strimler og vendes inn i samme eggerørebase som tirsdag og onsdag.",
    ]),
    hormoneHarmonyBowl("norsk røkt laks", 80, 250, 5, [
      "Bruk norsk røkt laks med kun laks og salt i ingredienslisten; ingen varmebehandling er nødvendig.",
    ]),
  ],
  Lørdag: [
    {
      recipe: recipeRef("frokost", "frokostpanne"),
      ingredients: [
        { foodId: "02.001", grams: 50, label: "egg, ca. 1 stk." },
        { foodId: "02.002", grams: 250, label: "eggehvite" },
        { foodId: "06.136", grams: 250, label: "søtpotet" },
        { foodId: "06.085", grams: 100, label: "squash" },
        { foodId: "06.064", grams: 50, label: "spinat" },
      ],
    },
    {
      recipe: recipeRef("lunsj", "betennelsesdempende-salatwraps"),
      ingredients: [
        { foodId: "03.004", grams: 175, label: "kalkunkjøtt" },
        { foodId: "06.138", grams: 100, label: "romanosalat" },
        { foodId: "06.036", grams: 50, label: "gulrot" },
        { foodId: "06.010", grams: 50, label: "agurk" },
        { foodId: "06.136", grams: 160, label: "søtpotet" },
      ],
    },
  ],
  Søndag: [
    {
      recipe: recipeRef("frokost", "morgeneggerore"),
      ingredients: [
        { foodId: "02.001", grams: 50, label: "egg, ca. 1 stk." },
        { foodId: "02.002", grams: 190, label: "eggehvite" },
        { foodId: "03.126", grams: 80, label: "karbonadedeig" },
        { foodId: "06.064", grams: 100, label: "spinat" },
        { foodId: "06.062", grams: 100, label: "sjampinjong" },
        { foodId: "06.136", grams: 574, label: "søtpotet" },
        { foodId: "08.252", grams: 5, label: "ghee" },
      ],
      details: ["Server søtpoteten ved siden av for å dekke hviledagens karbohydratmål."],
    },
    {
      recipe: recipeRef("frokost", "barnevennlige-proteinvafler"),
      ingredients: [
        { foodId: "02.001", grams: 50, label: "egg, ca. 1 stk." },
        { foodId: "02.002", grams: 100, label: "eggehvite" },
        { foodId: "06.525", grams: 120, label: "banan" },
        { foodId: "05.420", grams: 5, label: "mandelmel" },
        { foodId: "08.249", grams: 1, label: "kokosolje til vaffeljernet" },
        { foodId: "01.028", grams: 80, label: "cottage cheese til servering" },
        { foodId: "05.340", grams: 300, label: "kokt villris til servering" },
      ],
      details: [
        "Lag omtrent 2,5 ganger oppskriften til hele familien; mengdene under er Fredriks porsjon.",
        "Planversjonen bruker cottage cheese og ikke valgfritt proteinpulver.",
      ],
    },
  ],
};

export const trainingSnack: PlannedMeal = {
  title: "Før treningsøkt",
  ingredients: [
    { foodId: "02.001", grams: 50, label: "kokt egg, ca. 1 stk." },
    { foodId: "06.525", grams: 200, label: "banan" },
    { foodId: "09.003", grams: 14, label: "rå honning" },
  ],
};

export const longTrainingSnack: PlannedMeal = {
  title: "Før treningsøkt",
  ingredients: [
    { foodId: "02.001", grams: 50, label: "kokt egg, ca. 1 stk." },
    { foodId: "06.525", grams: 250, label: "banan" },
    { foodId: "09.003", grams: 6, label: "rå honning" },
  ],
  details: ["Større porsjon for langkjøringsdagen."],
};

export const dinnerDefinitions: Record<string, DinnerDefinition> = {
  lemonChicken: {
    recipe: recipeRef("middag", "sitron-og-urtekylling-med-gronnsaker-i-en-panne"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "03.332", grams: 430 },
      { foodId: "05.340", grams: 433 },
      { foodId: "06.018", grams: 250 },
      { foodId: "06.048", grams: 200 },
      { foodId: "06.085", grams: 250 },
      { foodId: "08.252", grams: 5 },
    ],
  },
  salmonTacos: {
    recipe: recipeRef("middag", "laksetaco-i-hjertesalat"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "04.015", grams: 420 },
      { foodId: "05.340", grams: 455 },
      { foodId: "06.207", grams: 150 },
      { foodId: "06.010", grams: 300 },
      { foodId: "06.752", grams: 150 },
      { foodId: "06.042", grams: 100, label: "rødløk" },
    ],
  },
  steakTips: {
    recipe: recipeRef("middag", "biffbiter"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.066", grams: 410 },
      { foodId: "06.262", grams: 580 },
      { foodId: "06.018", grams: 250 },
      { foodId: "06.048", grams: 200 },
      { foodId: "08.112", grams: 5 },
    ],
  },
  castIronSteak: {
    recipe: recipeRef("middag", "stopjernsbiff-med-avgiftende-bladgront"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.066", grams: 405 },
      { foodId: "06.262", grams: 620 },
      { foodId: "06.035", grams: 300 },
      { foodId: "08.252", grams: 5 },
    ],
  },
  salmonPoke: {
    recipe: recipeRef("middag", "poke-med-varmebehandlet-laks-og-quinoa"),
    carbFoodId: "06.616",
    carbLabel: "kokt quinoa",
    plannedIngredients: [
      { foodId: "04.015", grams: 140 },
      { foodId: "06.616", grams: 466 },
      { foodId: "06.093", grams: 300 },
      { foodId: "06.036", grams: 150 },
      { foodId: "06.010", grams: 250 },
      { foodId: "08.112", grams: 5 },
    ],
  },
  turkeyMeatballs: {
    recipe: recipeRef("middag", "rene-kalkunkjottboller-med-blomkalmos"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.004", grams: 210, label: "kalkunkjøttdeig" },
      { foodId: "02.001", grams: 100 },
      { foodId: "05.420", grams: 20 },
      { foodId: "06.016", grams: 500 },
      { foodId: "06.262", grams: 600 },
      { foodId: "08.252", grams: 5 },
    ],
  },
  beefBurgers: {
    recipe: recipeRef("middag", "salatinnpakkede-storfeburgere"),
    carbFoodId: "06.136",
    carbLabel: "søtpotet",
    plannedIngredients: [
      { foodId: "03.126", grams: 333 },
      { foodId: "06.136", grams: 650 },
      { foodId: "06.524", grams: 60 },
      { foodId: "06.138", grams: 150 },
      { foodId: "06.042", grams: 100, label: "rødløk" },
      { foodId: "08.252", grams: 5 },
    ],
  },
  lemonSalmon: {
    recipe: recipeRef("middag", "villaks-med-sitron-dill-og-ovnsstekte-gronnsaker"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "04.015", grams: 300 },
      { foodId: "06.262", grams: 620 },
      { foodId: "06.018", grams: 250 },
      { foodId: "06.085", grams: 250 },
      { foodId: "08.252", grams: 5 },
    ],
  },
  chickenCurry: {
    recipe: recipeRef("middag", "betennelsesdempende-kyllingcurrybolle"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "03.205", grams: 430 },
      { foodId: "06.701", grams: 80 },
      { foodId: "05.340", grams: 470 },
      { foodId: "06.085", grams: 250 },
      { foodId: "06.016", grams: 350 },
      { foodId: "08.249", grams: 5 },
    ],
  },
  tacoBowl: {
    recipe: recipeRef("middag", "tacobowl-med-sotpotet-og-cottage-cheese"),
    carbFoodId: "06.136",
    carbLabel: "søtpotet",
    plannedIngredients: [
      { foodId: "03.126", grams: 423 },
      { foodId: "01.028", grams: 300 },
      { foodId: "06.136", grams: 650 },
      { foodId: "06.752", grams: 200 },
      { foodId: "06.138", grams: 150 },
      { foodId: "08.252", grams: 3 },
    ],
  },
  garlicShrimp: {
    recipe: recipeRef("middag", "hvitloksreker-med-squashnudler-i-en-panne"),
    carbFoodId: "05.340",
    carbLabel: "kokt villris",
    plannedIngredients: [
      { foodId: "04.387", grams: 470 },
      { foodId: "05.340", grams: 500 },
      { foodId: "06.085", grams: 600 },
      { foodId: "08.112", grams: 5 },
    ],
  },
  chickenStew: {
    recipe: recipeRef("middag", "kyllinggryte-med-gurkemeie-og-kokos"),
    carbFoodId: "06.262",
    carbLabel: "kokt potet",
    plannedIngredients: [
      { foodId: "03.205", grams: 480 },
      { foodId: "06.701", grams: 20 },
      { foodId: "06.262", grams: 620 },
      { foodId: "06.085", grams: 250 },
      { foodId: "06.042", grams: 150 },
      { foodId: "08.249", grams: 3 },
    ],
  },
};

export const dinnerRotation = {
  A: {
    Mandag: dinnerDefinitions.lemonChicken,
    Tirsdag: dinnerDefinitions.steakTips,
    Onsdag: dinnerDefinitions.salmonPoke,
    Torsdag: dinnerDefinitions.beefBurgers,
    Fredag: dinnerDefinitions.castIronSteak,
    Lørdag: dinnerDefinitions.chickenCurry,
    Søndag: dinnerDefinitions.garlicShrimp,
  },
  B: {
    Mandag: dinnerDefinitions.salmonTacos,
    Tirsdag: dinnerDefinitions.castIronSteak,
    Onsdag: dinnerDefinitions.turkeyMeatballs,
    Torsdag: dinnerDefinitions.lemonSalmon,
    Fredag: dinnerDefinitions.steakTips,
    Lørdag: dinnerDefinitions.tacoBowl,
    Søndag: dinnerDefinitions.chickenStew,
  },
} as const;
