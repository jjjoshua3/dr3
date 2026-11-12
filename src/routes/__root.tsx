import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { NotFoundPage } from "@/components/stage/not-found";

import appCss from "../styles.css?url";

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23050608'/%3E%3Cpath d='M21.5 5.5c.8 2.2.6 3.8-.8 5.4-1.6 1.8-1.7 3.2-1.7 6.6 0 4.2.4 6.6-.2 8.6-.7 2.2-2.8 3.8-5.6 4.6' fill='none' stroke='%23FFB703' stroke-width='1.7' stroke-linecap='round'/%3E%3Cpath d='M20.2 5.2c2.2-1.2 4.4-.4 4.8 1.2.4 1.4-.8 2.4-2.6 2' fill='none' stroke='%23FFB703' stroke-width='1.4' stroke-linecap='round'/%3E%3Ccircle cx='18.2' cy='13.2' r='1.05' fill='%23FFB703'/%3E%3Ccircle cx='18.2' cy='16.2' r='1.05' fill='%23FFB703'/%3E%3Ccircle cx='18' cy='19.1' r='1.05' fill='%23FFB703'/%3E%3Cpath d='M10.2 28.2c-2.4.6-3.6 2.2-2.6 3.6 1.2 1.6 4 1.8 5.8.2' fill='none' stroke='%23EAE2B7' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E";

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  head: ({ matches }) => {
    const is404 = matches.some((match) => {
      const id = match.routeId as string;
      return id === "/$" || match.status === "notFound";
    });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#050608" },
        ...(is404
          ? [
              { title: "Pagina niet gevonden | Daan Roosenbrand" },
              {
                name: "description",
                content: "Deze pagina staat niet op de setlist van Daan Roosenbrand.",
              },
              { name: "robots", content: "noindex" },
            ]
          : []),
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: FAVICON },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "preconnect", href: "https://img.youtube.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,700&display=swap",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      ],
    };
  },
  component: () => (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
