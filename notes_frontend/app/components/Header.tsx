import { Form, Link } from "@remix-run/react";

export function Header({ userEmail }: { userEmail?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/notes" className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded bg-[var(--color-primary)]"
              aria-hidden
            />
            <span className="text-lg font-semibold text-gray-900">Notes</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            to="/notes"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            My Notes
          </Link>
          <a
            href="https://remix.run/docs"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Docs
          </a>
          {userEmail ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Form method="post" action="/logout">
                <button className="btn btn-secondary px-3 py-1 text-xs">Logout</button>
              </Form>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary px-3 py-1 text-xs">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
