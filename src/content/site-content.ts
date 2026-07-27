export const principles = [
  "Spis hele, næringstette råvarer.",
  "Bygg måltidene rundt protein, grønnsaker, fiber og sunt fett.",
  "Fordel protein gjennom dagen, vanligvis hver fjerde til femte time.",
  "Hent mesteparten av proteinet fra vanlig mat.",
  "Spis fiberrike planter først, og velg grønnsaker og frukt i flere farger hver dag.",
  "Unngå frøoljer, tilsatt sukker, sukkerholdig drikke og ultraprosessert mat.",
  "Bruk avokadoolje, kokosolje, ghee, talg, smør eller olivenolje etter hvilken varme maten tilberedes på.",
  "Velg gressfôret kjøtt, villfanget fisk, egg fra frittgående høner og økologisk fjærkre når det er praktisk mulig.",
  "Bruk langsomme karbohydrater som søtpotet, frukt, bønner, linser, quinoa eller ris etter aktivitet og mål.",
  "Begrens alkohol, og drikk heller tidlig enn sent på kvelden.",
];

export const mealPattern = [
  "Velg en proteinkilde fra vanlig mat.",
  "Legg til minst én grønnsak uten mye stivelse, gjerne flere farger og en tydelig fiberkilde.",
  "Velg et godkjent fett som passer til temperaturen maten tilberedes på.",
  "Legg til langsomme karbohydrater når aktivitet, restitusjon, energibehov eller mål tilsier det.",
  "Smak til med urter, krydder, sitrus, eddik eller et enkelt tilbehør.",
  "Utelat frøoljer, tilsatt eller raffinert sukker, raffinerte kornprodukter og ultraprosesserte fyllstoffer som standard.",
  "Se på pulver, kollagen, aminosyrer, adaptogener og merkevarer som valgfrie tillegg, aldri som grunnlaget for et måltid.",
];

export const practicalPriorities = [
  "Bytt ut frøoljer.",
  "Spis protein, planter, fiber og sunt fett.",
  "Reduser sukker og prosessert mat.",
  "Forbedre kjøkkenutstyr og råvarekvalitet når budsjettet tillater det.",
  "Vær konsekvent, ikke perfekt.",
];

export interface FoodSection {
  title: string;
  description?: string;
  items: string[];
}

export const foodSections: FoodSection[] = [
  {
    title: "Kjøtt og fjærkre",
    description: "Velg helst gressfôret, beiteoppdrettet eller økologisk når det er praktisk mulig.",
    items: [
      "Storfekjøtt: biff, entrecôte, mørbrad, biffbiter, grytekjøtt, short ribs, kjøttdeig og oksebein",
      "Kylling: bryst, lår, lår med bein og skinn, grillet kylling og kyllingbein",
      "Kalkun og kalkunkjøttdeig, helst nylaget",
      "Lam",
    ],
  },
  {
    title: "Fisk, sjømat og egg",
    items: [
      "Villfanget laks",
      "Norsk røkt laks med kun laks og salt i ingredienslisten",
      "Sardiner",
      "Torsk",
      "Villfangede reker",
      "Tunfisk i olivenolje, helst villfanget og i BPA-fri boks; spis med omtanke på grunn av kvikksølv",
      "Egg fra frittgående høner, bløtkokt, hardkokt, eggerøre, bakt eller som bindemiddel",
    ],
  },
  {
    title: "Kraft og kollagenrik mat",
    items: [
      "Hjemmelaget beinkraft",
      "Økologisk kyllingkraft uten unødvendige tilsetninger",
      "Økologisk oksekraft",
      "Økologisk grønnsakskraft",
      "Kollagenrike kjøttstykker og bein",
    ],
  },
  {
    title: "Planteprotein og belgvekster",
    description: "Tilpass mengden etter fordøyelse, toleranse og mål.",
    items: [
      "Økologisk tofu",
      "Tempeh",
      "Edamame",
      "Linser, inkludert røde linser",
      "Svarte bønner og andre bønner",
      "Kikerter",
      "Hummus uten frøoljer",
      "Quinoa",
      "Kombinasjoner som linser med quinoa eller svarte bønner med ris",
    ],
  },
  {
    title: "Bladgrønnsaker",
    items: [
      "Ruccola",
      "Spinat",
      "Grønnkål",
      "Mangold",
      "Løvetannblader",
      "Rødbetblader",
      "Bladkål",
      "Blandede salatblader",
      "Hjertesalat",
      "Romanosalat",
      "Mikrogrønt",
    ],
  },
  {
    title: "Korsblomstrede grønnsaker",
    items: [
      "Brokkoli",
      "Brokkolispirer",
      "Blomkål og blomkålris",
      "Rosenkål",
      "Hodekål og rødkål",
      "Pak choi",
    ],
  },
  {
    title: "Andre grønnsaker",
    items: [
      "Squash og squashnudler",
      "Butternutgresskar",
      "Agurk",
      "Selleri",
      "Fennikel",
      "Gulrøtter",
      "Pastinakk",
      "Neper",
      "Asparges",
      "Grønne bønner",
      "Sukkererter",
      "Paprika og rød paprika",
      "Tomater og cherrytomater",
      "Sopp",
      "Gul løk, rødløk, vårløk og purreløk",
      "Hvitløk",
      "Sjøgrønnsaker og ristet tang laget med oliven- eller avokadoolje",
    ],
  },
  {
    title: "Frukt og bær",
    items: [
      "Blåbær, ville blåbær, bringebær, bjørnebær og jordbær",
      "Epler, særlig grønne epler",
      "Pærer",
      "Sitron, lime og appelsin",
      "Druer",
      "Vannmelon",
      "Bananer",
      "Avokado",
      "Kokos og usøtede kokosprodukter",
      "Frossen hel frukt uten tilsatt sukker",
      "Dadler, usøtet surkirsebærjuice, frysetørkede bær og gojibær som valgfrie oppskriftsingredienser",
    ],
  },
  {
    title: "Langsomme karbohydrater",
    description: "Ikke nødvendig til hvert måltid. Tilpass mengden til aktivitet, restitusjon og mål.",
    items: [
      "Søtpotet, inkludert japansk søtpotet",
      "Vanlig potet",
      "Butternutgresskar og andre rotgrønnsaker",
      "Quinoa",
      "Brun ris, villris og annen ris sammen med hele råvarer",
      "Bønner, linser og kikerter",
      "Frukt",
      "Økologisk, ikke-genmodifisert masa harina og hjemmelagde maistortillaer",
      "Arrowrotpulver i små mengder som jevning",
    ],
  },
  {
    title: "Fett",
    items: [
      "Avokado og oliven",
      "Fett som naturlig finnes i egg og villfisk",
      "Nøtter, frø, nøttesmør og frøsmør",
      "Usøtet kokos, kokossmør, kokosyoghurt, kokosmelk og kokoskrem uten unødvendige tilsetninger",
      "Avokadoolje, kokosolje, ghee, smør og oksetalg",
      "Extra virgin olivenolje, først og fremst til dressing, avslutning og lavere varme",
      "MCT-olje som et valgfritt, konsentrert fett",
    ],
  },
  {
    title: "Nøtter, frø og smør",
    items: [
      "Mandler, mandelsmør og mandelmel",
      "Valnøtter, cashewnøtter, macadamianøtter, pekannøtter, paranøtter og pinjekjerner",
      "Gresskarfrø, solsikkefrø, sesamfrø, hampfrø, chiafrø og malt linfrø",
      "Tahini",
      "Peanøttsmør",
      "Solsikkefrøsmør",
    ],
  },
  {
    title: "Meieri og fermentert mat",
    description: "Valgfritt og avhengig av toleranse; ikke universelt godkjent eller forbudt.",
    items: [
      "Naturell gresk yoghurt, cottage cheese, kefir og naturell usøtet yoghurt",
      "Geitost og rå ost av geite- eller sauemelk som valgfri topping",
      "Smør og ghee fra gressfôrede dyr",
      "Usøtet kokosyoghurt",
      "Surkål, kimchi og fermenterte grønnsaker",
      "Tempeh",
      "Små porsjoner kombucha eller kokosvannkefir",
    ],
  },
  {
    title: "Urter, krydder og smak",
    items: [
      "Gurkemeie, sort pepper, ceylonkanel eller vanlig kanel og ingefær",
      "Persille, koriander, dill, oregano, rosmarin, timian, basilikum, mynte, salvie og gressløk",
      "Laurbærblad, hvitløkspulver, løkpulver, paprika, røkt paprika, spisskummen, kajenne og chiliflak",
      "Vaniljeekstrakt eller vaniljepulver",
      "Havsalt eller mineralsalt",
      "Sitron- og limejuice, eplecidereddik, riseddik og enkel eddik",
      "Kokosaminos, fiskesaus og sennep uten tilsatt sukker",
      "Pesto og hummus uten frøolje",
      "Rå, usøtet kakao, kakaonibs og mørk sjokolade med minst 70 prosent kakao",
    ],
  },
  {
    title: "Drikke",
    items: [
      "Filtrert vann og kildevann",
      "Usøtet te og urtete",
      "Mineral- eller elektrolyttvann uten sukker ved behov",
      "Svart eller økologisk kaffe som et valgfritt innslag",
      "Små porsjoner kombucha uten mye sukker",
      "Kokosvannkefir",
    ],
  },
  {
    title: "Søtning til enkelte oppskrifter",
    description: "Brukes av og til i oppskrifter, ikke som fri hverdagsmat.",
    items: [
      "Rå honning",
      "Munkefruktsøtning eller -ekstrakt",
      "Økologisk keto-lønnesirup",
      "Dadler",
      "Kokossukker",
      "Mørk sjokolade med høyt kakaoinnhold",
      "Bær og frossen frukt",
    ],
  },
];

export const avoidSections: FoodSection[] = [
  {
    title: "Oljer og fett vi unngår",
    items: [
      "Rapsolje",
      "Soyaolje",
      "Maisolje",
      "Generisk vegetabilsk olje og uidentifiserte blandinger",
      "Dressinger, sauser, restaurantmat og snacks med mye frøolje",
    ],
  },
  {
    title: "Sukker og drikke vi reduserer",
    items: [
      "Tilsatt eller raffinert sukker som fast ingrediens",
      "Brus, sukkerholdig drikke og søt te",
      "Sports- og energidrikker med mye sukker",
      "Søtede kaffedrikker",
      "Frosne cocktails og sukkerholdige miksere",
      "Hyppig godteri, kjeks, iskrem og prosesserte desserter",
    ],
  },
  {
    title: "Ultraprosessert og raffinert mat vi unngår",
    items: [
      "Ultraprosesserte måltider og snacks",
      "Chips, vanlige kjeks og saltkringler",
      "Prosesserte snackbarer med lange ingredienslister",
      "Raffinert hvitt mel",
      "Vanlig raffinert brød, boller, wraps og pasta",
      "Sukkerholdige frokostblandinger og sterkt prosesserte kornprodukter",
      "Prosesserte pølser, kjøttpålegg og konvensjonelt prosessert kjøtt",
      "Marinader og sauser med mye sukker",
      "Produkter med unødvendige fargestoffer, konserveringsmidler, emulgatorer og fyllstoffer",
      "Hyppige måltider sent på kvelden",
      "For mye alkohol",
    ],
  },
];

export const temporaryRestrictions = [
  "Mugg-, metall-, tarm- og matfølsomhetsprotokoller har egne midlertidige begrensninger. De skal ikke bli permanente familieregler.",
  "Etter faste introduseres mat trinnvis. Dette er ikke en vanlig ukemeny.",
  "Midlertidig unngåelse før enkelte tester er laget for å unngå påvirkning av prøvesvar, ikke som et varig matforbud.",
];
