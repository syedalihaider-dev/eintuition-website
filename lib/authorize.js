import { getAppUrl } from "@/lib/app-url";

export { getAppUrl };

export function isAuthorizeConfigured() {
  return Boolean(
    process.env.AUTHORIZE_API_LOGIN_ID &&
      process.env.AUTHORIZE_TRANSACTION_KEY &&
      !process.env.AUTHORIZE_API_LOGIN_ID.includes("replace_me")
  );
}

export function isAuthorizeSandbox() {
  const env = (process.env.AUTHORIZE_ENVIRONMENT || "sandbox").toLowerCase();
  return env !== "production" && env !== "live";
}

export function getAuthorizeApiUrl() {
  return isAuthorizeSandbox()
    ? "https://apitest.authorize.net/xml/v1/request.api"
    : "https://api.authorize.net/xml/v1/request.api";
}

export function getAuthorizeHostedPaymentUrl() {
  return isAuthorizeSandbox()
    ? "https://test.authorize.net/payment/payment"
    : "https://accept.authorize.net/payment/payment";
}

function merchantAuthentication() {
  return {
    name: process.env.AUTHORIZE_API_LOGIN_ID,
    transactionKey: process.env.AUTHORIZE_TRANSACTION_KEY,
  };
}

/** Invoice numbers are max 20 chars on Authorize.net */
export function toInvoiceNumber(paymentId) {
  return String(paymentId).replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
}

export async function authorizeRequest(payload) {
  const response = await fetch(getAuthorizeApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  // Authorize.net may prepend a BOM
  const cleaned = text.replace(/^\uFEFF/, "");
  let data;
  try {
    data = JSON.parse(cleaned);
  } catch {
    throw new Error("Authorize.net returned an invalid response");
  }

  return data;
}

function getMessages(result) {
  const messages = result?.messages?.message;
  if (!messages) return [];
  return Array.isArray(messages) ? messages : [messages];
}

export function getAuthorizeErrorMessage(result, fallback = "Authorize.net request failed") {
  const messages = getMessages(result);
  if (messages.length) {
    return messages.map((m) => m.text).filter(Boolean).join("; ") || fallback;
  }
  return fallback;
}

export function isAuthorizeOk(result) {
  return result?.messages?.resultCode === "Ok";
}

/**
 * Charge a card tokenized by Accept.js (opaqueData).
 */
export async function createAuthCaptureTransaction({
  amountCents,
  invoiceNumber,
  description,
  customerEmail,
  customerName,
  opaqueData,
  billTo = {},
}) {
  const amount = (Number(amountCents) / 100).toFixed(2);
  const [firstName, ...rest] = String(customerName || "Customer").trim().split(/\s+/);
  const lastName = rest.join(" ") || "Customer";

  const result = await authorizeRequest({
    createTransactionRequest: {
      merchantAuthentication: merchantAuthentication(),
      refId: invoiceNumber,
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount,
        payment: {
          opaqueData: {
            dataDescriptor: opaqueData.dataDescriptor,
            dataValue: opaqueData.dataValue,
          },
        },
        order: {
          invoiceNumber,
          description: String(description || "").slice(0, 255),
        },
        customer: customerEmail
          ? { email: customerEmail }
          : undefined,
        billTo: {
          firstName: firstName.slice(0, 50),
          lastName: lastName.slice(0, 50),
          ...billTo,
        },
      },
    },
  });

  const tx = result?.transactionResponse;
  const responseCode = String(tx?.responseCode || "");
  const approved = isAuthorizeOk(result) && responseCode === "1";

  if (!approved) {
    const txErrors = tx?.errors?.error;
    const errList = txErrors ? (Array.isArray(txErrors) ? txErrors : [txErrors]) : [];
    const txMessage = errList.map((e) => e.errorText).filter(Boolean).join("; ");
    throw new Error(txMessage || getAuthorizeErrorMessage(result, "Payment was declined"));
  }

  return {
    transId: tx.transId || null,
    authCode: tx.authCode || null,
    raw: result,
  };
}

/**
 * Hosted payment page token (Accept Hosted) — no public client key required.
 */
export async function getHostedPaymentPageToken({
  amountCents,
  invoiceNumber,
  description,
  returnUrl,
  cancelUrl,
  customerEmail,
}) {
  const amount = (Number(amountCents) / 100).toFixed(2);

  const result = await authorizeRequest({
    getHostedPaymentPageRequest: {
      merchantAuthentication: merchantAuthentication(),
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount,
        order: {
          invoiceNumber,
          description: String(description || "").slice(0, 255),
        },
        customer: customerEmail ? { email: customerEmail } : undefined,
      },
      hostedPaymentSettings: {
        setting: [
          {
            settingName: "hostedPaymentReturnOptions",
            settingValue: JSON.stringify({
              showReceipt: false,
              url: returnUrl,
              urlText: "Continue",
              cancelUrl,
              cancelUrlText: "Cancel",
            }),
          },
          {
            settingName: "hostedPaymentButtonOptions",
            settingValue: JSON.stringify({ text: "Pay now" }),
          },
          {
            settingName: "hostedPaymentOrderOptions",
            settingValue: JSON.stringify({
              show: true,
              merchantName: "eIntuition",
            }),
          },
          {
            settingName: "hostedPaymentPaymentOptions",
            settingValue: JSON.stringify({
              cardCodeRequired: true,
              showCreditCard: true,
              showBankAccount: false,
            }),
          },
          {
            settingName: "hostedPaymentBillingAddressOptions",
            settingValue: JSON.stringify({ show: true, required: false }),
          },
          {
            settingName: "hostedPaymentShippingAddressOptions",
            settingValue: JSON.stringify({ show: false, required: false }),
          },
          {
            settingName: "hostedPaymentCustomerOptions",
            settingValue: JSON.stringify({
              showEmail: true,
              requiredEmail: Boolean(customerEmail),
              addPaymentProfile: false,
            }),
          },
        ],
      },
    },
  });

  if (!isAuthorizeOk(result) || !result.token) {
    throw new Error(getAuthorizeErrorMessage(result, "Unable to start Authorize.net checkout"));
  }

  return {
    token: result.token,
    formAction: getAuthorizeHostedPaymentUrl(),
  };
}

export async function findUnsettledTransactionByInvoice(invoiceNumber) {
  const result = await authorizeRequest({
    getUnsettledTransactionListRequest: {
      merchantAuthentication: merchantAuthentication(),
      sorting: {
        orderBy: "submitTimeUTC",
        orderDescending: true,
      },
      paging: {
        limit: 100,
        offset: 1,
      },
    },
  });

  if (!isAuthorizeOk(result) && result?.messages?.resultCode === "Error") {
    // Empty list can still be Ok; only throw on hard errors
    const code = getMessages(result)[0]?.code;
    if (code && code !== "I00004") {
      throw new Error(getAuthorizeErrorMessage(result));
    }
  }

  const list = result?.transactions || [];
  const transactions = Array.isArray(list) ? list : [list];
  return (
    transactions.find(
      (tx) =>
        tx &&
        String(tx.invoiceNumber || "") === String(invoiceNumber) &&
        String(tx.transactionStatus || "").toLowerCase() !== "declined"
    ) || null
  );
}
