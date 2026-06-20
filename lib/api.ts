"use client";

// Typed fetch wrapper for all API calls from the frontend
const base = "/api";

async function request<T>(
  path: string, method = "GET", body?: unknown, token?: string | null
): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Request failed");
  return json.data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    register: (data: unknown)              => request("/auth/register", "POST", data),
    login:    (email: string, password: string) => request<{ user: unknown; token: string }>("/auth/login", "POST", { email, password }),
    me:       (token: string)              => request("/auth/me", "GET", undefined, token),
    subscribe:(plan: string, token: string)=> request("/auth/subscribe", "POST", { plan }, token),
  },
  verify: {
    byCode:   (code: string, token?: string | null)  => request(`/verify?code=${encodeURIComponent(code)}`, "GET", undefined, token),
    byBatch:  (nafdacNumber: string, batchNumber: string, token?: string | null) =>
      request("/verify/batch", "POST", { nafdacNumber, batchNumber }, token),
    history:  (token: string, page = 1)  => request(`/verify/history?page=${page}`, "GET", undefined, token),
  },
  reports: {
    create:   (data: unknown, token: string) => request("/reports", "POST", data, token),
    mine:     (token: string)                => request("/reports/mine", "GET", undefined, token),
    all:      (token: string, page = 1)      => request(`/reports/all?page=${page}`, "GET", undefined, token),
  },
  pharmacies: {
    list:     (params?: { q?: string; state?: string; verified?: boolean }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return request(`/pharmacies${qs ? "?" + qs : ""}`);
    },
    get: (id: string) => request(`/pharmacies/${id}`),
  },
};
