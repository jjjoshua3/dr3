import { createFileRoute } from "@tanstack/react-router";
import { Site } from "@/components/stage/site";
import { jsonLd, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/components/stage/seo";

const OG_IMAGE = "https://img.youtube.com/vi/kKDFos-CEd8/maxresdefault.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "nl_NL" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: "Daan Roosenbrand speelt saxofoonsolo in Baker Street" },
      { property: "og:image:width", content: "1280" },
      { property: "og:image:height", content: "720" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      {
        name: "twitter:image:alt",
        content: "Daan Roosenbrand speelt saxofoonsolo in Baker Street",
      },
      { "script:ld+json": jsonLd },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: Home,
});

function Home() {
  return <Site />;
}
