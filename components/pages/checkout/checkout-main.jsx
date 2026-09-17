"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SEO from "@/components/data/seo";
import HeaderOne from "@/components/layout/headers/header/header-one";
import FooterOne from "@/components/layout/footers/footer-one";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import {
  createCheckoutSession,
  fetchPackage,
  formatPrice,
} from "@/lib/api-client";
import {
  dispatchOpaqueData,
  isAcceptJsConfigured,
  waitForAccept,
} from "@/lib/accept-js";
import { withBasePath } from "@/lib/base-path";

function PackageSummary({ pkg }) {
  const periodLabel = pkg.billingPeriod === "YEARLY" ? "Yearly" : "Monthly";

  return (
    <div className="checkout-summary-card">
      <span className="checkout-summary-card__eyebrow">Order summary</span>
      <h3 className="checkout-summary-card__title">{pkg.name}</h3>
      <div className="checkout-summary-card__price">
        {formatPrice(pkg.priceCents, pkg.currency)}
        <span>/{periodLabel.toLowerCase()}</span>
      </div>
      <p className="checkout-summary-card__description">{pkg.description}</p>
      <ul className="checkout-summary-card__features">
        {(pkg.features || []).map((feature) => (
          <li key={feature}>
            <i className="fas fa-angle-double-right"></i>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="checkout-summary-card__meta">
        <strong>Billing:</strong> {periodLabel} subscription
      </div>
    </div>
  );
}

const CheckoutMain = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const canceled = searchParams.get("canceled");

  const [pkg, setPkg] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [zip, setZip] = useState("");
  const [loadingPackage, setLoadingPackage] = useState(true);
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!packageId) {
        setError("No package selected.");
        setLoadingPackage(false);
        return;
      }

      setLoadingPackage(true);
      setError("");
      try {
        const data = await fetchPackage(packageId);
        if (!cancelled) setPkg(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load package");
      } finally {
        if (!cancelled) setLoadingPackage(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [packageId]);

  const pay = useCallback(async () => {
    if (!pkg) return;
    setPaying(true);
    setError("");
    try {
      const opaqueData = await dispatchOpaqueData({
        cardNumber,
        month,
        year,
        cardCode,
        zip,
      });

      const result = await createCheckoutSession({
        packageId: pkg.id,
        customerEmail: email.trim() || undefined,
        customerName: name.trim() || undefined,
        opaqueData,
      });

      if (!result?.paymentId) {
        throw new Error("Payment did not return a payment id");
      }

      router.push(withBasePath(`/checkout/success?payment_id=${result.paymentId}`));
    } catch (err) {
      setError(err.message || "Unable to process payment");
      setPaying(false);
    }
  }, [pkg, cardNumber, month, year, cardCode, zip, email, name, router]);

  const keysReady = isAcceptJsConfigured();

  return (
    <>
      <SEO pageTitle="Checkout" />
      <HeaderOne />
      <BreadCrumb title="Checkout" innerTitle="Checkout" />

      <div className="section-padding">
        <div className="container">
          {canceled ? (
            <div className="alert alert-warning mb-4">
              Checkout was canceled. You can try again below.
            </div>
          ) : null}

          {loadingPackage ? (
            <p className="text-center">Loading package details...</p>
          ) : null}

          {!loadingPackage && error && !pkg ? (
            <div className="text-center">
              <p className="text-danger">{error}</p>
              <Link href="/pricing-plan" className="btn-one">
                Back to Pricing
              </Link>
            </div>
          ) : null}

          {pkg ? (
            <div className="row gy-4">
              <div className="col-xl-4 col-lg-5">
                <PackageSummary pkg={pkg} />
                <Link href="/pricing-plan" className="btn-one mt-4 d-inline-block">
                  Change package
                </Link>
              </div>

              <div className="col-xl-8 col-lg-7">
                <h4 className="mb-3">Payment</h4>
                <div className="request-quote__area-input-field mb-3">
                  <label htmlFor="checkout-name">Name on card</label>
                  <input
                    id="checkout-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="cc-name"
                  />

                  <label htmlFor="checkout-email" className="mt-3 d-block">
                    Email (optional)
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />

                  <label htmlFor="checkout-card" className="mt-3 d-block">
                    Card number
                  </label>
                  <input
                    id="checkout-card"
                    type="text"
                    inputMode="numeric"
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    autoComplete="cc-number"
                  />

                  <div className="row gx-3">
                    <div className="col-4">
                      <label htmlFor="checkout-month" className="mt-3 d-block">
                        Month
                      </label>
                      <input
                        id="checkout-month"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM"
                        maxLength={2}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        autoComplete="cc-exp-month"
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="checkout-year" className="mt-3 d-block">
                        Year
                      </label>
                      <input
                        id="checkout-year"
                        type="text"
                        inputMode="numeric"
                        placeholder="YY"
                        maxLength={4}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        autoComplete="cc-exp-year"
                      />
                    </div>
                    <div className="col-4">
                      <label htmlFor="checkout-cvc" className="mt-3 d-block">
                        CVC
                      </label>
                      <input
                        id="checkout-cvc"
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

                  <label htmlFor="checkout-zip" className="mt-3 d-block">
                    ZIP (optional)
                  </label>
                  <input
                    id="checkout-zip"
                    type="text"
                    placeholder="10001"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    autoComplete="postal-code"
                  />

                  <p className="mt-3 mb-3">
                    Pay securely with Authorize.net for the <strong>{pkg.name}</strong> plan.
                  </p>

                  {!keysReady ? (
                    <p className="text-danger">
                      Add <code>NEXT_PUBLIC_AUTHORIZE_API_LOGIN_ID</code> and{" "}
                      <code>NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY</code> to <code>.env</code>, then
                      restart the app.
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
                    disabled={paying || !keysReady || !acceptReady}
                  >
                    {paying ? "Processing..." : "Pay now"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <FooterOne />
      <ScrollToTop />
    </>
  );
};

export default CheckoutMain;
