import { Form, NavLink, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useRef } from "react";

type NoteListItem = {
  id: string;
  title: string;
  updatedAt: string;
};

export function Sidebar({
  notes,
  query,
}: {
  notes: NoteListItem[];
  query?: string;
}) {
  const navigation = useNavigation();
  const isSearching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const submit = useSubmit();
  const qRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearching && qRef.current) {
      qRef.current.value = query || "";
    }
  }, [isSearching, query]);

  return (
    <aside className="h-full w-full max-w-xs border-r border-gray-200">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-3">
          <Form className="flex gap-2" role="search">
            <input
              ref={qRef}
              id="q"
              className="input"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={query}
              onChange={(e) => {
                const isFirstSearch = query == null;
                submit(e.currentTarget.form, { replace: !isFirstSearch });
              }}
              aria-label="Search notes"
              aria-busy={isSearching}
            />
          </Form>
        </div>
        <div className="flex items-center justify-between p-3">
          <Form method="post" action="/notes/new">
            <button className="btn btn-primary">New Note</button>
          </Form>
        </div>
        <nav className="flex-1 overflow-auto p-2">
          {notes?.length ? (
            <ul className="space-y-1">
              {notes.map((note) => (
                <li key={note.id}>
                  <NavLink
                    to={`/notes/${note.id}`}
                    prefetch="intent"
                    className={({ isActive }) =>
                      `block rounded px-3 py-2 text-sm ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <div className="truncate font-medium">{note.title || "Untitled"}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(note.updatedAt).toLocaleString()}
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-sm text-gray-500">No notes found</p>
          )}
        </nav>
      </div>
    </aside>
  );
}
