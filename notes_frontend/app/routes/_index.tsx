import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes" },
    { name: "description", content: "Personal notes manager" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // redirect landing to /notes
  const url = new URL(request.url);
  if (url.pathname === "/") {
    throw redirect("/notes");
  }
  return null;
}

export default function Index() {
  return null;
}
