import { withBasePath } from "@/lib/base-path";

export async function adminRequest(path, options = {}) {
  const response = await fetch(withBasePath(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    const message =
      payload?.error ||
      payload?.message ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.details = payload?.details;
    throw error;
  }

  return payload?.data ?? payload;
}

export function formatMoney(cents, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format((Number(cents) || 0) / 100);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const adminApi = {
  login: (body) =>
    adminRequest("/api/admin/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => adminRequest("/api/admin/auth/logout", { method: "POST" }),
  me: () => adminRequest("/api/admin/auth/me"),
  changePassword: (body) =>
    adminRequest("/api/admin/auth/change-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateEmail: (body) =>
    adminRequest("/api/admin/auth/update-email", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  dashboard: () => adminRequest("/api/admin/dashboard"),
  packages: (billingPeriod) => {
    const q = billingPeriod ? `?billingPeriod=${billingPeriod}` : "";
    return adminRequest(`/api/admin/packages${q}`);
  },
  packageById: (id) => adminRequest(`/api/admin/packages/${id}`),
  createPackage: (body) =>
    adminRequest("/api/admin/packages", { method: "POST", body: JSON.stringify(body) }),
  updatePackage: (id, body) =>
    adminRequest(`/api/admin/packages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deactivatePackage: (id) =>
    adminRequest(`/api/admin/packages/${id}`, { method: "DELETE" }),
  payments: (params = {}) => {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.limit) search.set("limit", String(params.limit));
    if (params.offset) search.set("offset", String(params.offset));
    const q = search.toString();
    return adminRequest(`/api/admin/payments${q ? `?${q}` : ""}`);
  },
  queries: (params = {}) => {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.limit) search.set("limit", String(params.limit));
    if (params.offset) search.set("offset", String(params.offset));
    const q = search.toString();
    return adminRequest(`/api/admin/queries${q ? `?${q}` : ""}`);
  },
  queryById: (id) => adminRequest(`/api/admin/queries/${id}`),
  updateQueryStatus: (id, status) =>
    adminRequest(`/api/admin/queries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  quotes: (params = {}) => {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.limit) search.set("limit", String(params.limit));
    if (params.offset) search.set("offset", String(params.offset));
    const q = search.toString();
    return adminRequest(`/api/admin/quotes${q ? `?${q}` : ""}`);
  },
  quoteById: (id) => adminRequest(`/api/admin/quotes/${id}`),
  updateQuoteStatus: (id, status) =>
    adminRequest(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
