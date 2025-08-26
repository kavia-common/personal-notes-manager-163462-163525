import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { api } from "~/utils/api.server";
import { commitSession, getSession } from "~/utils/session.server";

// PUBLIC_INTERFACE
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session.get("token")) {
    throw redirect("/notes");
  }
  return json({});
}

type ActionData = { error?: string };

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const mode = (form.get("mode") as string) || "login";
  const redirectTo = (form.get("redirectTo") as string) || "/notes";

  try {
    const res =
      mode === "register"
        ? await api.register(email, password)
        : await api.login(email, password);

    const session = await getSession(request);
    session.set("token", res.token);
    session.set("user", res.user);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Authentication failed";
    return json<ActionData>({ error: message }, { status: 400 });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/notes";
  const mode = params.get("mode") === "register" ? "register" : "login";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md p-6">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          {mode === "register" ? "Create an account" : "Welcome back"}
        </h1>
        {actionData?.error ? (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {actionData.error}
          </p>
        ) : null}
        <Form method="post" className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input type="hidden" name="mode" value={mode} />
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            {mode === "register" ? "Create account" : "Sign in"}
          </button>
        </Form>
        <div className="mt-4 text-center text-sm">
          {mode === "register" ? (
            <p>
              Already have an account?{" "}
              <Link className="text-blue-700 hover:underline" to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}>
                Sign in
              </Link>
            </p>
          ) : (
            <p>
              New here?{" "}
              <Link
                className="text-blue-700 hover:underline"
                to={`/login?mode=register&redirectTo=${encodeURIComponent(redirectTo)}`}
              >
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
