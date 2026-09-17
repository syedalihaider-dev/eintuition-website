"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi, formatMoney } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .dashboard()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Earnings and inquiry overview"
      actions={
        <Link href="/admin/packages" className="admin-btn admin-btn--primary">
          Manage Packages
        </Link>
      }
    >
      {loading ? <div className="admin-card">Loading dashboard...</div> : null}
      {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}

      {data ? (
        <>
          <div className="admin-stats">
            <div className="admin-card admin-stat">
              <h3>{data.earnings?.totalFormatted || formatMoney(data.earnings?.totalCents || 0)}</h3>
              <p>Total earnings</p>
            </div>
            <div className="admin-card admin-stat">
              <h3>{data.earnings?.successfulPayments || 0}</h3>
              <p>Successful payments</p>
            </div>
            <div className="admin-card admin-stat">
              <h3>{data.queries?.new || 0}</h3>
              <p>New contact queries</p>
            </div>
            <div className="admin-card admin-stat">
              <h3>{data.quotes?.new || 0}</h3>
              <p>New quote requests</p>
            </div>
          </div>

          <div className="admin-detail-grid">
            <div className="admin-card">
              <h3 style={{ marginTop: 0 }}>Quick links</h3>
              <div className="admin-actions" style={{ marginTop: 16 }}>
                <Link href="/admin/payments" className="admin-btn admin-btn--secondary">
                  Payment logs
                </Link>
                <Link href="/admin/queries" className="admin-btn admin-btn--secondary">
                  Contact queries
                </Link>
                <Link href="/admin/quotes" className="admin-btn admin-btn--secondary">
                  Quote requests
                </Link>
              </div>
            </div>
            <div className="admin-card">
              <h3 style={{ marginTop: 0 }}>Totals</h3>
              <p style={{ marginBottom: 8 }}>Payments recorded: <strong>{data.payments?.total || 0}</strong></p>
              <p style={{ marginBottom: 8 }}>Contact queries: <strong>{data.queries?.total || 0}</strong></p>
              <p style={{ marginBottom: 0 }}>Quote requests: <strong>{data.quotes?.total || 0}</strong></p>
            </div>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
