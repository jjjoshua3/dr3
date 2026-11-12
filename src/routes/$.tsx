import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Pagina niet gevonden | Daan Roosenbrand" },
      {
        name: "description",
        content: "Deze pagina staat niet op de setlist van Daan Roosenbrand.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: () => {
    throw notFound();
  },
});
