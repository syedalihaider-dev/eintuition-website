"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi, formatDate } from "@/lib/admin-api";

export default function AdminQueryDetailPage() {
  const params = useParams();
  const [query, setQuery] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.queryById(params.id);
      setQuery(data);
    } catch (err) {
      setError(err.message || "Failed to load query");
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
      const updated = await adminApi.updateQueryStatus(params.id, status);
      setQuery(updated);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell
      title="Query details"
      subtitle="Contact Us submission"
      actions={
        <Link href="/admin/queries" className="admin-btn admin-btn--ghost">
          Back
        </Link>
      }
    >
      {loading ? <div className="admin-card">Loading...</div> : null}
      {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
      {query ? (
        <div className="admin-detail-grid">
          <div className="admin-card">
            <h3 style={{ marginTop: 0 }}>{query.subject || "No subject"}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{query.message}</p>
          </div>
          <div className="admin-card">
            <p><strong>Name:</strong> {query.name}</p>
            <p><strong>Email:</strong> {query.email}</p>
            <p><strong>Status:</strong> {query.status}</p>
            <p><strong>Received:</strong> {formatDate(query.createdAt)}</p>
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
