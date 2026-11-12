export type Film = {
  id: string;
  title: string;
  meta: string;
  alt: string;
  vertical?: boolean;
  href?: string;
  hrefLabel?: string;
};

export type NoteCard = {
  title: string;
  meta: string;
  body: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

export type Spotlight = {
  index: string;
  kicker: string;
  title: string;
  dek: string;
  films: Film[];
  notes?: NoteCard[];
};

export const keys = [
  {
    n: "01",
    title: "Sax & Klarinet",
    body: "Saxofoon en klarinet, lichte muziek. Van een intieme solo tot een volle bezetting.",
    hz: "233.1",
  },
  {
    n: "02",
    title: "IMPAKT & Night at the Jukebox",
    body: "Coverband IMPAKT in Roosendaal, en de avonden van Night at the Jukebox.",
    hz: "293.7",
  },
  {
    n: "03",
    title: "Sax & DJ Live",
    body: "Energieke sets waarin saxofoon en DJ elkaar opjagen op de vloer.",
    hz: "349.2",
  },
  {
    n: "04",
    title: "Dirigent Bigbands",
    body: "Muzikaal leider van Let's Swing Delft en JD's Big Band.",
    hz: "415.3",
  },
  {
    n: "05",
    title: "Docent & Educatie",
    body: "Vereniging, privé en basisschool. Spelplezier staat voorop.",
    hz: "523.3",
  },
] as const;

export const spotlights: Spotlight[] = [
  {
    index: "01",
    kicker: "Solo",
    title: "De grote solo's met Excelsior",
    dek: "De zaal even stil. Drie opnames waarin de solo de avond draagt.",
    films: [
      {
        id: "kKDFos-CEd8",
        title: "Baker Street",
        meta: "Live",
        alt: "Daan Roosenbrand speelt saxofoonsolo in Baker Street live met Excelsior Papendrecht",
      },
      {
        id: "WLPDBI1BV6g",
        title: "Against All Odds",
        meta: "Live",
        alt: "Daan Roosenbrand speelt Against All Odds live op saxofoon",
      },
      {
        id: "22HLcpeJl3k",
        title: "Crooner's Serenade",
        meta: "Uit het Archief • 2015",
        alt: "Daan Roosenbrand speelt Crooner's Serenade, uit het archief van 2015",
      },
    ],
  },
  {
    index: "02",
    kicker: "Podium",
    title: "TV & grote podia",
    dek: "Van de talentenshow tot de vloer van Rotterdam Ahoy.",
    films: [
      {
        id: "WjrbjayKkLQ",
        title: "It's A Man's World",
        meta: "Nick Nicolai · Ranking The Talent",
        alt: "Daan Roosenbrand speelt It's A Man's World bij Ranking The Talent met Nick Nicolai",
      },
      {
        id: "Mf3JzKaa7D8",
        title: "Live in Rotterdam Ahoy",
        meta: "Bracchus · Eurekaweek 2019",
        alt: "Daan Roosenbrand live in Rotterdam Ahoy tijdens Eurekaweek 2019 met Bracchus",
      },
    ],
  },
  {
    index: "03",
    kicker: "Nacht",
    title: "Bands, DJ's & Jukebox",
    dek: "Coverband, dansvloer en de bands waar Daan lang deel van was.",
    films: [
      {
        id: "JUqgIJMsIZc",
        title: "Night at the Jukebox",
        meta: "Short",
        alt: "Night at the Jukebox, short met saxofonist Daan Roosenbrand",
        vertical: true,
        href: "https://www.nightatthejukebox.nl/",
        hrefLabel: "nightatthejukebox.nl",
      },
    ],
    notes: [
      {
        title: "IMPAKT",
        meta: "Roosendaal · nu",
        body: "Zijn huidige coverband. Energiek, breed repertoire, sax vooraan.",
        image: "/photos/guitar.jpg",
        alt: "Daan Roosenbrand met coverband IMPAKT in Roosendaal",
        width: 1356,
        height: 1370,
      },
      {
        title: "Sax & DJ",
        meta: "Live sets",
        body: "Samenwerkingen waarin de sax dwars door de beat snijdt.",
        image: "/photos/close.jpg",
        alt: "Close-up van Daan Roosenbrand tijdens een Sax & DJ-set",
        width: 1110,
        height: 1110,
      },
      {
        title: "Dave Warmerdam Band",
        meta: "Gewaardeerd lid",
        body: "Jarenlang deel van de band. Strak, warm, op het podium thuis.",
        image: "/photos/stage.jpg",
        alt: "Daan Roosenbrand op het podium met saxofoon bij de Dave Warmerdam Band",
        width: 1066,
        height: 1066,
      },
    ],
  },
  {
    index: "04",
    kicker: "Codarts",
    title: "Pop Orchestra & intiem",
    dek: "Codarts Pop Orchestra, en de stillere kant van het vak.",
    films: [
      {
        id: "rpkXoRAOxDU",
        title: "Licht en Donker",
        meta: "Froukje",
        alt: "Codarts Pop Orchestra speelt Licht en Donker van Froukje met Daan Roosenbrand",
      },
      {
        id: "gVm_NMxlTmU",
        title: "Hold Back",
        meta: "Margi Sinniah",
        alt: "Hold Back van Margi Sinniah met saxofonist Daan Roosenbrand",
      },
      {
        id: "bGFwhE3EVrA",
        title: "Have Yourself A Merry Little Christmas",
        meta: "Intiem",
        alt: "Daan Roosenbrand speelt Have Yourself A Merry Little Christmas, intieme saxofoon",
      },
    ],
  },
];

export const subjects = [
  {
    id: "solo",
    n: "01",
    label: "Boeking als solist / sessiemuzikant",
    detail: "Saxofoon & klarinet",
    placeholder: "Datum, zaal, bezetting — sax, klarinet, of allebei.",
  },
  {
    id: "band",
    n: "02",
    label: "Boeking Sax & DJ / IMPAKT / Jukebox",
    detail: "Coverband & live sets",
    placeholder: "Welke formatie, welke avond, welke stad.",
  },
  {
    id: "directie",
    n: "03",
    label: "Directie / inval-dirigent",
    detail: "Let's Swing Delft & JD's Big Band",
    placeholder: "Welke band, repetitie of concert. Inval of langer.",
  },
  {
    id: "les",
    n: "04",
    label: "Saxofoonles, vereniging of basisschool",
    detail: "Spelplezier voorop",
    placeholder: "Leeftijd, vereniging of privé, niveau, plaats.",
  },
  {
    id: "algemeen",
    n: "05",
    label: "Algemeen bericht voor Daan",
    detail: "Iets anders",
    placeholder: "Waar wil je Daan over spreken.",
  },
] as const;

export type SubjectId = (typeof subjects)[number]["id"];
