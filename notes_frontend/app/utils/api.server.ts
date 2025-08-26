import { getEnv } from "./env.server";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  body?: Record<string, unknown> | JsonValue;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

async function request<T>(
  path: string,
  { method = "GET", token, body, headers = {}, signal }: FetchOptions = {}
): Promise<T> {
  const { NOTES_API_BASE_URL } = getEnv();
  const url = `${NOTES_API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal,
  });
  if (!res.ok) {
    let errMsg = `Request failed: ${res.status}`;
    try {
      const data = (await res.json()) as { message?: string };
      errMsg = data?.message || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }
  if (res.status === 204) return {} as T;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

// PUBLIC_INTERFACE
export const api = {
  // auth
  async login(email: string, password: string) {
    return request<{ token: string; user: { id: string; email: string } }>(
      `/auth/login`,
      { method: "POST", body: { email, password } }
    );
  },
  async register(email: string, password: string) {
    return request<{ token: string; user: { id: string; email: string } }>(
      `/auth/register`,
      { method: "POST", body: { email, password } }
    );
  },
  async me(token: string) {
    return request<{ id: string; email: string }>(`/auth/me`, { token });
  },

  // notes
  async listNotes(token: string, query?: string) {
    const qs = query ? `?q=${encodeURIComponent(query)}` : "";
    return request<Array<{ id: string; title: string; updatedAt: string }>>(
      `/notes${qs}`,
      { token }
    );
  },
  async getNote(token: string, id: string) {
    return request<{ id: string; title: string; content: string; updatedAt: string }>(
      `/notes/${id}`,
      { token }
    );
  },
  async createNote(token: string, data: { title: string; content: string }) {
    return request<{ id: string }>(`/notes`, { method: "POST", token, body: data });
  },
  async updateNote(
    token: string,
    id: string,
    data: { title: string; content: string }
  ) {
    return request<{ success: true }>(`/notes/${id}`, {
      method: "PUT",
      token,
      body: data,
    });
  },
  async deleteNote(token: string, id: string) {
    return request<{ success: true }>(`/notes/${id}`, { method: "DELETE", token });
  },
};
