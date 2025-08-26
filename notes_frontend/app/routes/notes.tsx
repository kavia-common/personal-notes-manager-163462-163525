import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/utils/session.server";
import { Outlet } from "@remix-run/react";

// PUBLIC_INTERFACE
export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  return null;
}

export default function NotesIndexPlaceholder() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-8">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Welcome to your notes</h2>
        <p className="mb-4 text-gray-600">
          Select a note from the sidebar to view or edit it, or create a new one.
        </p>
        <form method="post" action="/notes/new">
          <button className="btn btn-primary">Create a new note</button>
        </form>
      </div>
      <Outlet />
    </div>
  );
}
