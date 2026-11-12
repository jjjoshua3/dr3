/** Shared SEO copy and Schema.org graph for the homepage. */
export const SITE_URL = "https://www.daanroosenbrand.nl/";

export const SITE_TITLE =
  "Daan Roosenbrand | Professioneel Saxofonist, Klarinettist, Docent & Dirigent (Rotterdam)";

export const SITE_DESCRIPTION =
  "Op zoek naar een energieke saxofonist (solo of met DJ), klarinettist, bigband-dirigent of saxofoondocent in regio Rotterdam, Papendrecht, Delft en Roosendaal? Ontdek het portfolio van Codarts-alumnus Daan Roosenbrand.";

const OG_IMAGE = "https://img.youtube.com/vi/kKDFos-CEd8/maxresdefault.jpg";

const AREA = [
  { "@type": "City", name: "Rotterdam" },
  { "@type": "City", name: "Papendrecht" },
  { "@type": "City", name: "Oud Gastel" },
  { "@type": "City", name: "Roosendaal" },
  { "@type": "City", name: "Delft" },
  { "@type": "AdministrativeArea", name: "Zuid-Holland" },
  { "@type": "AdministrativeArea", name: "Noord-Brabant" },
];

const ORGS = {
  excelsior: {
    "@type": "MusicGroup",
    name: "Muziekvereniging Excelsior Papendrecht",
  },
  gastels: { "@type": "MusicGroup", name: "Gastels Fanfare" },
  swing: { "@type": "MusicGroup", name: "Let's Swing Delft" },
  jds: { "@type": "MusicGroup", name: "JD's Big Band" },
  impakt: { "@type": "MusicGroup", name: "Coverband IMPAKT" },
  jukebox: {
    "@type": "MusicGroup",
    name: "Night at the Jukebox",
    url: "https://www.nightatthejukebox.nl/",
  },
};

function video(id: string, name: string, description: string): Record<string, unknown> {
  return {
    "@type": "VideoObject",
    "@id": `${SITE_URL}#video-${id}`,
    name,
    description,
    thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    url: `https://www.youtube.com/watch?v=${id}`,
    about: { "@id": `${SITE_URL}#daan` },
  };
}

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#daan`,
      name: "Daan Roosenbrand",
      url: SITE_URL,
      image: OG_IMAGE,
      jobTitle: ["Saxofonist", "Klarinettist", "Muziekdocent", "Dirigent"],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Codarts Rotterdam",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rotterdam",
        addressCountry: "NL",
      },
      areaServed: AREA,
      memberOf: Object.values(ORGS),
      worksFor: [ORGS.excelsior, ORGS.gastels, ORGS.swing, ORGS.jds],
    },
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}#act`,
      name: "Daan Roosenbrand",
      url: SITE_URL,
      genre: "Lichte muziek",
      image: OG_IMAGE,
      areaServed: AREA,
      member: { "@id": `${SITE_URL}#daan` },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#praktijk`,
      name: "Daan Roosenbrand",
      url: SITE_URL,
      image: OG_IMAGE,
      description: SITE_DESCRIPTION,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rotterdam",
        addressCountry: "NL",
      },
      areaServed: AREA,
    },
    video(
      "kKDFos-CEd8",
      "Baker Street — Daan Roosenbrand live met Excelsior Papendrecht",
      "Saxofoonsolo van Daan Roosenbrand op Baker Street, live met Muziekvereniging Excelsior Papendrecht.",
    ),
    video(
      "WLPDBI1BV6g",
      "Against All Odds — Daan Roosenbrand live",
      "Daan Roosenbrand speelt Against All Odds live op saxofoon.",
    ),
    video(
      "22HLcpeJl3k",
      "Crooner's Serenade — uit het archief, 2015",
      "Archiefopname uit 2015: Daan Roosenbrand speelt Crooner's Serenade.",
    ),
    video(
      "WjrbjayKkLQ",
      "It's A Man's World — Ranking The Talent",
      "Daan Roosenbrand bij Ranking The Talent met Nick Nicolai, It's A Man's World.",
    ),
    video(
      "Mf3JzKaa7D8",
      "Live in Rotterdam Ahoy — Eurekaweek 2019",
      "Daan Roosenbrand live in Rotterdam Ahoy met Bracchus tijdens de Eurekaweek 2019.",
    ),
    video(
      "JUqgIJMsIZc",
      "Night at the Jukebox",
      "Short van Night at the Jukebox met Daan Roosenbrand.",
    ),
    video(
      "rpkXoRAOxDU",
      "Licht en Donker — Froukje, Codarts Pop Orchestra",
      "Codarts Pop Orchestra speelt Licht en Donker van Froukje, met Daan Roosenbrand.",
    ),
    video(
      "gVm_NMxlTmU",
      "Hold Back — Margi Sinniah",
      "Hold Back van Margi Sinniah, met Daan Roosenbrand.",
    ),
    video(
      "bGFwhE3EVrA",
      "Have Yourself A Merry Little Christmas",
      "Intieme uitvoering van Have Yourself A Merry Little Christmas door Daan Roosenbrand.",
    ),
  ],
};
