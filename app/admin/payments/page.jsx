"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi, formatDate, formatMoney } from "@/lib/admin-api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (nextStatus = status) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.payments({
        status: nextStatus || undefined,
        limit: 100,
      });
      setPayments(data.payments || []);
    } catch (err) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);

  const badgeClass = (value) => {
    if (value === "SUCCEEDED") return "admin-badge--success";
    if (value === "PENDING") return "admin-badge--warning";
    if (value === "FAILED") return "admin-badge--danger";
    if (value === "REFUNDED") return "admin-badge--info";
    return "admin-badge--muted";
  };

  return (
    <AdminShell title="Payments" subtitle="Successful and pending Authorize.net payment logs">
      <div className="admin-card">
        <div className="admin-toolbar">
          <select
            className="admin-select"
            style={{ width: 200 }}
            value={status}
            onChange={(e) => {
              const value = e.target.value;
              setStatus(value);
              load(value);
            }}
          >
            <option value="">All statuses</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
        {loading ? <div className="admin-empty">Loading payments...</div> : null}
        {!loading && !payments.length ? <div className="admin-empty">No payments found.</div> : null}

        {!loading && payments.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Package</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td>{payment.package?.name || payment.note || "Custom payment"}</td>
                    <td>
                      {payment.customerEmail || "—"}
                      {payment.customerName ? (
                        <div style={{ color: "#64748b", fontSize: 12 }}>{payment.customerName}</div>
                      ) : null}
                    </td>
                    <td>{formatMoney(payment.amountCents, payment.currency)}</td>
                    <td>{payment.billingPeriod || "ONE-TIME"}</td>
                    <td>
                      <span className={`admin-badge ${badgeClass(payment.status)}`}>{payment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
