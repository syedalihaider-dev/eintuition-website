"use client";

const apiLoginId = process.env.NEXT_PUBLIC_AUTHORIZE_API_LOGIN_ID || "";
const clientKey = process.env.NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY || "";

export function isAcceptJsConfigured() {
  return Boolean(apiLoginId && clientKey);
}

export function waitForAccept(timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      if (typeof window !== "undefined" && window.Accept?.dispatchData) {
        resolve(window.Accept);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Accept.js failed to load. Refresh the page and try again."));
        return;
      }
      setTimeout(check, 50);
    };

    check();
  });
}

export function dispatchOpaqueData(card) {
  return new Promise((resolve, reject) => {
    if (!apiLoginId || !clientKey) {
      reject(
        new Error(
          "Missing NEXT_PUBLIC_AUTHORIZE_API_LOGIN_ID or NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY"
        )
      );
      return;
    }

    waitForAccept()
      .then((Accept) => {
        Accept.dispatchData(
          {
            authData: {
              clientKey,
              apiLoginID: apiLoginId,
            },
            cardData: {
              cardNumber: String(card.cardNumber || "").replace(/\s+/g, ""),
              month: String(card.month || "").padStart(2, "0"),
              year:
                String(card.year || "").length === 2
                  ? String(card.year)
                  : String(card.year || "").slice(-2),
              cardCode: card.cardCode,
              ...(card.zip ? { zip: card.zip } : {}),
            },
          },
          (response) => {
            if (response.messages.resultCode === "Error") {
              const messages = response.messages.message || [];
              const text = messages.map((m) => m.text).filter(Boolean).join("; ");
              reject(new Error(text || "Card validation failed"));
              return;
            }
            resolve(response.opaqueData);
          }
        );
      })
      .catch(reject);
  });
}
