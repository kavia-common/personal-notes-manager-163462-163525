import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { api } from "~/utils/api.server";
import { requireUser } from "~/utils/session.server";

// PUBLIC_INTERFACE
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { token } = await requireUser(request);
  const id = params.id!;
  const note = await api.getNote(token, id);
  return json({ note });
}

// PUBLIC_INTERFACE
export async function action({ request, params }: ActionFunctionArgs) {
  const { token } = await requireUser(request);
  const id = params.id!;
  const form = await request.formData();
  const intent = String(form.get("intent") || "save");

  if (intent === "delete") {
    await api.deleteNote(token, id);
    return redirect("/notes");
  }

  const title = String(form.get("title") || "");
  const content = String(form.get("content") || "");
  await api.updateNote(token, id, { title, content });
  return redirect(`/notes/${id}`);
}

export default function NoteEditor() {
  const { note } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const isSaving = fetcher.state !== "idle";
  const navigation = useNavigation();
  const isDeleting =
    navigation.state !== "idle" &&
    (navigation.formData?.get("intent") === "delete");

  return (
    <div className="mx-auto max-w-3xl">
      <Form method="post" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <input
            name="title"
            defaultValue={note.title}
            placeholder="Title"
            className="input text-xl font-semibold"
          />
          <div className="flex items-center gap-2">
            <button
              name="intent"
              value="save"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              name="intent"
              value="delete"
              className="btn btn-secondary"
              disabled={isDeleting}
              onClick={(e) => {
                if (!confirm("Delete this note?")) {
                  e.preventDefault();
                }
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        <textarea
          name="content"
          defaultValue={note.content}
          placeholder="Start writing..."
          className="textarea"
          rows={20}
        />
      </Form>
      <div className="mt-6 text-sm text-gray-500">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
