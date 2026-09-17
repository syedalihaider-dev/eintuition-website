const STORAGE_KEY = "eintuition_active_subscription";

export function getStoredSubscription() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredSubscription(subscription) {
  if (typeof window === "undefined" || !subscription?.packageId) return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      packageId: subscription.packageId,
      packageName: subscription.packageName || null,
      billingPeriod: subscription.billingPeriod || null,
      email: subscription.email || null,
      paymentId: subscription.paymentId || null,
      savedAt: new Date().toISOString(),
    })
  );
  window.dispatchEvent(new Event("eintuition-subscription-updated"));
}

export function clearStoredSubscription() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("eintuition-subscription-updated"));
}
