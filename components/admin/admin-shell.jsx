"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/queries", label: "Queries" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminShell({ title, subtitle, actions, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .me()
      .then((data) => {
        if (!cancelled) setAdmin(data.admin);
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await adminApi.logout();
    } finally {
      router.replace("/admin/login");
    }
  };

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="admin-body">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            e<span>Intuition</span> Admin
          </div>
          <nav className="admin-sidebar__nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar__link${isActive(item) ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="admin-sidebar__footer">
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 10 }}>
              {admin?.email || "Loading..."}
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)", width: "100%" }}
              onClick={logout}
              disabled={loggingOut}
            >
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <h1>{title}</h1>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
            {actions ? <div className="admin-actions">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
