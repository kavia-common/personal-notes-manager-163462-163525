import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { api } from "~/utils/api.server";
import { requireUser } from "~/utils/session.server";

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  const { token } = await requireUser(request);
  const { id } = await api.createNote(token, { title: "Untitled", content: "" });
  return redirect(`/notes/${id}`);
}

export default function NewNoteRedirect() {
  return null;
}
