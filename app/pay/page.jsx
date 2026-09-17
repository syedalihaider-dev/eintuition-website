"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SEO from "@/components/data/seo";
import HeaderOne from "@/components/layout/headers/header/header-one";
import FooterOne from "@/components/layout/footers/footer-one";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import { createCustomCheckout, formatPrice } from "@/lib/api-client";
import {
  dispatchOpaqueData,
  isAcceptJsConfigured,
  waitForAccept,
} from "@/lib/accept-js";
import { withBasePath } from "@/lib/base-path";

function CustomPayContent() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [zip, setZip] = useState("");
  const [acceptReady, setAcceptReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    waitForAccept()
      .then(() => {
        if (!cancelled) setAcceptReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const keysReady = isAcceptJsConfigured();
  const amountNumber = Number(amount);
  const amountValid = !Number.isNaN(amountNumber) && amountNumber >= 0.5;

  const pay = useCallback(async () => {
    setPaying(true);
    setError("");
    try {
      if (!amountValid) {
        throw new Error("Enter a valid amount (minimum $0.50).");
      }

      const opaqueData = await dispatchOpaqueData({
        cardNumber,
        month,
        year,
        cardCode,
        zip,
      });

      const result = await createCustomCheckout({
        amount: amountNumber,
        note: note.trim() || undefined,
        customerEmail: email.trim() || undefined,
        customerName: name.trim() || undefined,
        opaqueData,
      });

      if (!result?.paymentId) {
        throw new Error("Payment did not return a payment id");
      }

      router.push(`/checkout/success?payment_id=${result.paymentId}`);
    } catch (err) {
      setError(err.message || "Unable to process payment");
      setPaying(false);
    }
  }, [
    amountValid,
    amountNumber,
    cardNumber,
    month,
    year,
    cardCode,
    zip,
    note,
    email,
    name,
    router,
  ]);

  return (
    <>
      <SEO pageTitle="Payment" />
      <HeaderOne />
      <BreadCrumb title="Payment" innerTitle="Payment" />

      <div className="section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8">
              <div className="custom-pay-panel">
                <span className="checkout-summary-card__eyebrow">Custom payment</span>
                <h3 className="checkout-summary-card__title" style={{ fontSize: 24 }}>
                  Enter amount &amp; card details
                </h3>
                <p className="checkout-summary-card__description">
                  For phone / off-platform billing. No package selection required.
                </p>

                <div className="custom-pay-field">
                  <label htmlFor="custom-amount">Amount (USD)</label>
                  <input
                    id="custom-amount"
                    type="number"
                    min="0.50"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {amountValid ? (
                    <p className="mt-2 mb-0" style={{ color: "#64748b" }}>
                      Charge: <strong>{formatPrice(Math.round(amountNumber * 100))}</strong>
                    </p>
                  ) : null}
                </div>

                <div className="custom-pay-field">
                  <label htmlFor="custom-note">Note (optional)</label>
                  <input
                    id="custom-note"
                    type="text"
                    placeholder="Invoice / call reference"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={255}
                  />
                </div>

                <div className="custom-pay-field">
                  <label htmlFor="custom-name">Name on card</label>
                  <input
                    id="custom-name"
                    type="text"
                    placeholder="Customer name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="cc-name"
                  />
                </div>

                <div className="custom-pay-field">
                  <label htmlFor="custom-email">Email (optional)</label>
                  <input
                    id="custom-email"
                    type="email"
                    placeholder="customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="custom-pay-field">
                  <label htmlFor="custom-card">Card number</label>
                  <input
                    id="custom-card"
                    type="text"
                    inputMode="numeric"
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    autoComplete="cc-number"
                  />
                </div>

                <div className="row gx-3">
                  <div className="col-4">
                    <div className="custom-pay-field">
                      <label htmlFor="custom-month">Month</label>
                      <input
                        id="custom-month"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM"
                        maxLength={2}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        autoComplete="cc-exp-month"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="custom-pay-field">
                      <label htmlFor="custom-year">Year</label>
                      <input
                        id="custom-year"
                        type="text"
                        inputMode="numeric"
                        placeholder="YY"
                        maxLength={4}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        autoComplete="cc-exp-year"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="custom-pay-field">
                      <label htmlFor="custom-cvc">CVC</label>
                      <input
                        id="custom-cvc"
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength={4}
                        value={cardCode}
                        onChange={(e) => setCardCode(e.target.value)}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </div>

                <div className="custom-pay-field">
                  <label htmlFor="custom-zip">ZIP (optional)</label>
                  <input
                    id="custom-zip"
                    type="text"
                    placeholder="10001"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    autoComplete="postal-code"
                  />
                </div>

                {!keysReady ? (
                  <p className="text-danger">
                    Authorize.net Accept.js keys are missing in environment variables.
                  </p>
                ) : null}

                {keysReady && !acceptReady ? (
                  <p className="mb-3">Loading secure payment library...</p>
                ) : null}

                {error ? <p className="text-danger">{error}</p> : null}

                <button
                  type="button"
                  className="btn-two"
                  onClick={pay}
                  disabled={paying || !keysReady || !acceptReady || !amountValid}
                >
                  {paying ? "Processing..." : "Pay now"}
                </button>

                <div className="mt-4">
                  <Link href="/" className="btn-one">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default function CustomPayPage() {
  return (
    <Suspense fallback={<div className="section-padding text-center">Loading...</div>}>
      <CustomPayContent />
    </Suspense>
  );
}
