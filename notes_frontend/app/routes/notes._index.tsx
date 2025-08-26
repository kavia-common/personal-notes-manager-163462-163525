import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { api } from "~/utils/api.server";
import { Header } from "~/components/Header";
import { Sidebar } from "~/components/Sidebar";
import { requireUser } from "~/utils/session.server";

// PUBLIC_INTERFACE
export async function loader({ request }: LoaderFunctionArgs) {
  const { token, user } = await requireUser(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const notes = await api.listNotes(token, q);
  return json({ notes, user });
}

export default function NotesLayout() {
  const { notes, user } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-screen flex-col">
      <Header userEmail={user.email} />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <Sidebar notes={notes} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
