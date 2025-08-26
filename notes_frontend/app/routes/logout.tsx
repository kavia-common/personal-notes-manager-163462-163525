import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/utils/session.server";

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export default function Logout() {
  return null;
}
