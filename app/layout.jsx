import Script from "next/script";
import ClientBoot from "./client-boot";
import "./globals.css";

const acceptSrc =
  (process.env.NEXT_PUBLIC_AUTHORIZE_ENVIRONMENT || "sandbox").toLowerCase() ===
  "production"
    ? "https://js.authorize.net/v1/Accept.js"
    : "https://jstest.authorize.net/v1/Accept.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.ico" />
      </head>
      <body>
        {/* Must be beforeInteractive — dynamic script injection breaks Accept.js */}
        <Script src={acceptSrc} strategy="beforeInteractive" />
        <ClientBoot>{children}</ClientBoot>
      </body>
    </html>
  );
}
