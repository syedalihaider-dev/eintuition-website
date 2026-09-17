"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SEO from "@/components/data/seo";
import HeaderOne from "@/components/layout/headers/header/header-one";
import FooterOne from "@/components/layout/footers/footer-one";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import { formatPrice, verifyCheckoutSuccess } from "@/lib/api-client";
import { saveStoredSubscription } from "@/lib/subscription-storage";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function verify(retry = true) {
      if (!paymentId) {
        setError("Missing payment reference.");
        setLoading(false);
        return;
      }

      try {
        const data = await verifyCheckoutSuccess(paymentId);
        if (cancelled) return;

        if (!data?.paid && retry && attempts < 6) {
          attempts += 1;
          setTimeout(() => verify(true), 2000);
          return;
        }

        setResult(data);
        if (data?.paid && data?.payment?.packageId) {
          saveStoredSubscription({
            packageId: data.payment.packageId,
            packageName: data.payment.package?.name || null,
            billingPeriod: data.payment.billingPeriod || data.payment.package?.billingPeriod,
            email: data.customerEmail || data.payment.customerEmail || null,
            paymentId: data.payment.id,
          });
        }
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to verify payment");
          setLoading(false);
        }
      }
    }

    verify(true);
    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  const payment = result?.payment;
  const pkg = payment?.package;
  const periodLabel = pkg?.billingPeriod === "YEARLY" ? "yearly" : "monthly";

  return (
    <>
      <SEO pageTitle="Payment Success" />
      <HeaderOne />
      <BreadCrumb title="Payment Success" innerTitle="Payment Success" />

      <div className="section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8">
              {loading ? (
                <div className="checkout-success-panel">
                  <p className="mb-0">Confirming your payment...</p>
                </div>
              ) : null}

              {!loading && error ? (
                <div className="checkout-success-panel">
                  <div className="checkout-success-panel__icon">
                    <i className="fas fa-exclamation"></i>
                  </div>
                  <h3 className="mb-3">Payment verification failed</h3>
                  <p className="text-danger mb-0">{error}</p>
                  <div className="checkout-success-panel__actions">
                    <Link href="/pricing-plan" className="btn-one">
                      Back to Pricing
                    </Link>
                  </div>
                </div>
              ) : null}

              {!loading && !error && result?.paid ? (
                <div className="checkout-success-panel">
                  <div className="checkout-success-panel__icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <h3 className="mb-3">Payment Successful</h3>
                  <p className="mb-0">
                    Thank you{result.customerEmail ? `, ${result.customerEmail}` : ""}. Your
                    payment has been received.
                  </p>

                  {pkg ? (
                    <div className="checkout-success-summary">
                      <div className="checkout-summary-card__eyebrow">Purchased plan</div>
                      <h4 className="checkout-summary-card__title" style={{ fontSize: "22px" }}>
                        {pkg.name}
                      </h4>
                      <p className="checkout-summary-card__description mb-3">{pkg.description}</p>
                      <div className="checkout-success-summary__row">
                        <span>Amount</span>
                        <strong>
                          {formatPrice(payment.amountCents, payment.currency)} / {periodLabel}
                        </strong>
                      </div>
                      <div className="checkout-success-summary__row">
                        <span>Billing</span>
                        <strong>{pkg.billingPeriod === "YEARLY" ? "Yearly" : "Monthly"}</strong>
                      </div>
                      <div className="checkout-success-summary__row">
                        <span>Status</span>
                        <strong>{payment.status}</strong>
                      </div>
                    </div>
                  ) : payment ? (
                    <div className="checkout-success-summary">
                      <div className="checkout-summary-card__eyebrow">Custom payment</div>
                      <h4 className="checkout-summary-card__title" style={{ fontSize: "22px" }}>
                        {payment.note || "One-time payment"}
                      </h4>
                      <div className="checkout-success-summary__row">
                        <span>Amount</span>
                        <strong>{formatPrice(payment.amountCents, payment.currency)}</strong>
                      </div>
                      <div className="checkout-success-summary__row">
                        <span>Status</span>
                        <strong>{payment.status}</strong>
                      </div>
                    </div>
                  ) : null}

                  <div className="checkout-success-panel__actions">
                    <Link href="/" className="btn-two">
                      Go Home
                    </Link>
                    <Link href="/contact" className="btn-one">
                      Contact Us
                    </Link>
                  </div>
                </div>
              ) : null}

              {!loading && !error && result && !result.paid ? (
                <div className="checkout-success-panel">
                  <div className="checkout-success-panel__icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <h3 className="mb-3">Payment pending</h3>
                  <p className="mb-0">
                    Your payment is not marked as paid yet. If you completed payment,
                    please wait a moment or contact support.
                  </p>
                  <div className="checkout-success-panel__actions">
                    <Link href="/pricing-plan" className="btn-one">
                      Back to Pricing
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="section-padding text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
