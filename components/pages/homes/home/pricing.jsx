"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchActiveSubscription, fetchPackages, formatPrice } from "@/lib/api-client";
import { getStoredSubscription } from "@/lib/subscription-storage";

function PackageCard({ pkg, activePackageId, hasSubscription }) {
  const periodLabel = pkg.billingPeriod === "YEARLY" ? "/yearly" : "/monthly";
  const buttonClass = pkg.isFeatured ? "btn-two" : "btn-one";
  const isActivePlan = Boolean(activePackageId && pkg.id === activePackageId);

  return (
    <div className="col-xl-4 col-lg-4 col-md-6">
      <div className="pricing-plan__one-single-pricing-wrapper">
        <div
          className={`pricing-plan__one-single-pricing-plan${pkg.isFeatured || isActivePlan ? " active" : ""}`}
        >
          <h3 className="pricing-plan__one-single-pricing-plan-title">{pkg.name}</h3>
          <h2 className="pricing-plan__one-single-pricing-plan-price">
            {formatPrice(pkg.priceCents, pkg.currency)}
            <span>{periodLabel}</span>
          </h2>
          <p>{pkg.description}</p>
          <div className="pricing-plan__one-single-pricing-plan-benefits">
            {(pkg.features || []).map((feature) => (
              <span key={feature}>
                <i className="fas fa-angle-double-right"></i>
                {feature}
              </span>
            ))}
          </div>

          {isActivePlan ? (
            <div className="mt-2">
              <span className="checkout-summary-card__eyebrow">Current plan</span>
            </div>
          ) : (
            <Link href={`/checkout?packageId=${pkg.id}`} className={buttonClass}>
              {hasSubscription ? "Change Package" : "Get Started"}
              <i className="fas fa-chevron-right"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function PackageGrid({ packages, emptyText, activePackageId, hasSubscription }) {
  if (!packages.length) {
    return (
      <div className="col-12 text-center">
        <p>{emptyText}</p>
      </div>
    );
  }

  return packages.map((pkg) => (
    <PackageCard
      key={pkg.id}
      pkg={pkg}
      activePackageId={activePackageId}
      hasSubscription={hasSubscription}
    />
  ));
}

const Pricing = () => {
  const [monthlyPackages, setMonthlyPackages] = useState([]);
  const [yearlyPackages, setYearlyPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setLoading(true);
      setError("");
      try {
        const [monthly, yearly] = await Promise.all([
          fetchPackages("MONTHLY"),
          fetchPackages("YEARLY"),
        ]);
        if (cancelled) return;
        setMonthlyPackages(Array.isArray(monthly) ? monthly : []);
        setYearlyPackages(Array.isArray(yearly) ? yearly : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load packages");
          setMonthlyPackages([]);
          setYearlyPackages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPackages();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSubscription() {
      const stored = getStoredSubscription();
      if (!stored) {
        if (!cancelled) setSubscription(null);
        return;
      }

      if (!cancelled) setSubscription(stored);

      if (stored.email) {
        try {
          const data = await fetchActiveSubscription(stored.email);
          if (cancelled) return;
          if (data?.subscription?.packageId) {
            setSubscription({
              packageId: data.subscription.packageId,
              packageName: data.subscription.packageName,
              billingPeriod: data.subscription.billingPeriod,
              email: data.subscription.email,
              paymentId: data.subscription.paymentId,
            });
          } else {
            setSubscription(null);
          }
        } catch {
          // Keep localStorage value if API lookup fails
        }
      }
    }

    loadSubscription();

    const onUpdate = () => loadSubscription();
    window.addEventListener("storage", onUpdate);
    window.addEventListener("eintuition-subscription-updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("eintuition-subscription-updated", onUpdate);
    };
  }, []);

  const activePackageId = subscription?.packageId || null;
  const hasSubscription = Boolean(activePackageId);

  return (
    <div className="pricing-plan__one section-padding">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-xl-6 col-lg-7 col-md-8">
            <div className="pricing-plan__one-title">
              <span className="subtitle-one">Flexible Plans</span>
              <h2 className="mb-40">Pricing Made Simple</h2>
              <ul
                className="nav nav-pills mb-65 justify-content-center"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="monthly-pricing-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#monthly-pricing"
                    type="button"
                    role="tab"
                    aria-controls="monthly-pricing"
                    aria-selected="true"
                  >
                    Monthly
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="yearly-pricing-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#yearly-pricing"
                    type="button"
                    role="tab"
                    aria-controls="yearly-pricing"
                    aria-selected="false"
                  >
                    Yearly
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {error ? (
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <p className="text-danger">{error}</p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <p>Loading packages...</p>
            </div>
          </div>
        ) : (
          <div className="pricing-plans tab-content">
            <div
              className="row justify-content-center gy-4 tab-pane fade show active"
              id="monthly-pricing"
              role="tabpanel"
              aria-labelledby="monthly-pricing-tab"
            >
              <PackageGrid
                packages={monthlyPackages}
                emptyText="No monthly packages available."
                activePackageId={activePackageId}
                hasSubscription={hasSubscription}
              />
            </div>
            <div
              className="row justify-content-center gy-4 tab-pane fade"
              id="yearly-pricing"
              role="tabpanel"
              aria-labelledby="yearly-pricing-tab"
            >
              <PackageGrid
                packages={yearlyPackages}
                emptyText="No yearly packages available."
                activePackageId={activePackageId}
                hasSubscription={hasSubscription}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
