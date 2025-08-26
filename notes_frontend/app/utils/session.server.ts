import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET || "dev-secret-change-me";

export type AuthSessionData = {
  token: string;
  user: { id: string; email: string };
};

const storage = createCookieSessionStorage({
  cookie: {
    name: "__notes_session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

// PUBLIC_INTERFACE
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return storage.getSession(cookie);
}

// PUBLIC_INTERFACE
export async function commitSession(session: Awaited<ReturnType<typeof getSession>>) {
  return storage.commitSession(session);
}

// PUBLIC_INTERFACE
export async function destroySession(session: Awaited<ReturnType<typeof getSession>>) {
  return storage.destroySession(session);
}

// PUBLIC_INTERFACE
export async function requireUser(request: Request) {
  const session = await getSession(request);
  const token = session.get("token") as string | undefined;
  const user = session.get("user") as AuthSessionData["user"] | undefined;

  if (!token || !user) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return { token, user, session };
}
