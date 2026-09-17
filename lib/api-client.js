import { withBasePath } from "@/lib/base-path";

export async function apiRequest(path, options = {}) {
  const response = await fetch(withBasePath(path), {
    ...options,
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

export function formatPrice(cents, currency = "usd") {
  const amount = (Number(cents) || 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

export async function fetchPackages(billingPeriod) {
  const query = billingPeriod ? `?billingPeriod=${billingPeriod}` : "";
  return apiRequest(`/api/packages${query}`, { method: "GET" });
}

export async function fetchPackage(idOrSlug) {
  return apiRequest(`/api/packages/${idOrSlug}`, { method: "GET" });
}

export async function createCheckoutSession(data) {
  return apiRequest("/api/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createCustomCheckout(data) {
  return apiRequest("/api/checkout/custom", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyCheckoutSuccess(paymentId) {
  return apiRequest(`/api/checkout/success?payment_id=${encodeURIComponent(paymentId)}`, {
    method: "GET",
  });
}

export async function fetchActiveSubscription(email) {
  return apiRequest(`/api/subscriptions/active?email=${encodeURIComponent(email)}`, {
    method: "GET",
  });
}

export async function submitContact(data) {
  return apiRequest("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitQuote(data) {
  return apiRequest("/api/quotes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
