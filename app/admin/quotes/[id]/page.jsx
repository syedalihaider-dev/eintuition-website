"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi, formatDate } from "@/lib/admin-api";

export default function AdminQuoteDetailPage() {
  const params = useParams();
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.quoteById(params.id);
      setQuote(data);
    } catch (err) {
      setError(err.message || "Failed to load quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.id]);

  const updateStatus = async (status) => {
    setBusy(true);
    try {
      const updated = await adminApi.updateQuoteStatus(params.id, status);
      setQuote(updated);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell
      title="Quote details"
      subtitle="Request Quote submission"
      actions={
        <Link href="/admin/quotes" className="admin-btn admin-btn--ghost">
          Back
        </Link>
      }
    >
      {loading ? <div className="admin-card">Loading...</div> : null}
      {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
      {quote ? (
        <div className="admin-detail-grid">
          <div className="admin-card">
            <h3 style={{ marginTop: 0 }}>
              {quote.firstName} {quote.lastName}
            </h3>
            <p><strong>Services:</strong> {(quote.services || []).join(", ")}</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{quote.message}</p>
          </div>
          <div className="admin-card">
            <p><strong>Email:</strong> {quote.email}</p>
            <p><strong>Phone:</strong> {quote.phone}</p>
            <p><strong>Company:</strong> {quote.company}</p>
            <p><strong>Website:</strong> {quote.website}</p>
            <p><strong>Status:</strong> {quote.status}</p>
            <p><strong>Received:</strong> {formatDate(quote.createdAt)}</p>
            <div className="admin-actions" style={{ marginTop: 16 }}>
              <button className="admin-btn admin-btn--secondary" disabled={busy} onClick={() => updateStatus("READ")}>
                Mark read
              </button>
              <button className="admin-btn admin-btn--danger" disabled={busy} onClick={() => updateStatus("CLOSED")}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
