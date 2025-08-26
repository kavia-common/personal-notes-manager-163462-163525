import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import "./tailwind.css";
import "./styles/theme.css";
import { getPublicEnv } from "./utils/env.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Root loader to expose ENV to the client
export async function loader() {
  return json({ ENV: getPublicEnv() });
}

declare global {
  interface Window {
    ENV?: Record<string, unknown>;
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const envFromWindow: Record<string, unknown> | undefined =
    typeof window === "undefined" ? undefined : window.ENV;

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50 text-gray-900">
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(envFromWindow ?? {})}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Ensure root loader executes
  useRouteLoaderData("root");
  return <Outlet />;
}
