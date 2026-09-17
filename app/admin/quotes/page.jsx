"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi, formatDate } from "@/lib/admin-api";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async (nextStatus = status) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.quotes({
        status: nextStatus || undefined,
        limit: 100,
      });
      setQuotes(data.quotes || []);
    } catch (err) {
      setError(err.message || "Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);

  const updateStatus = async (id, nextStatus) => {
    setBusyId(id);
    try {
      await adminApi.updateQuoteStatus(id, nextStatus);
      await load(status);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminShell title="Quote Requests" subtitle="Submissions from Request Quote">
      <div className="admin-card">
        <div className="admin-toolbar">
          <select
            className="admin-select"
            style={{ width: 180 }}
            value={status}
            onChange={(e) => {
              const value = e.target.value;
              setStatus(value);
              load(value);
            }}
          >
            <option value="">All</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
        {loading ? <div className="admin-empty">Loading quotes...</div> : null}
        {!loading && !quotes.length ? <div className="admin-empty">No quotes found.</div> : null}

        {!loading && quotes.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td>{formatDate(quote.createdAt)}</td>
                    <td>
                      {quote.firstName} {quote.lastName}
                    </td>
                    <td>{quote.company}</td>
                    <td>{quote.email}</td>
                    <td>{(quote.services || []).join(", ") || "—"}</td>
                    <td>
                      <span className="admin-badge admin-badge--info">{quote.status}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link href={`/admin/quotes/${quote.id}`} className="admin-btn admin-btn--secondary">
                          View
                        </Link>
                        {quote.status !== "READ" ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            disabled={busyId === quote.id}
                            onClick={() => updateStatus(quote.id, "READ")}
                          >
                            Mark read
                          </button>
                        ) : null}
                        {quote.status !== "CLOSED" ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger"
                            disabled={busyId === quote.id}
                            onClick={() => updateStatus(quote.id, "CLOSED")}
                          >
                            Close
                          </button>
                        ) : null}
                      </div>
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
