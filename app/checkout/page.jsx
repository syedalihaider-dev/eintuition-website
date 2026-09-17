"use client";

import { Suspense } from "react";
import CheckoutMain from "@/components/pages/checkout/checkout-main";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="section-padding text-center">Loading checkout...</div>}>
      <CheckoutMain />
    </Suspense>
  );
}
