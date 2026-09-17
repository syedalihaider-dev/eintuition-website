"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi, formatDate } from "@/lib/admin-api";

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async (nextStatus = status) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.queries({
        status: nextStatus || undefined,
        limit: 100,
      });
      setQueries(data.queries || []);
    } catch (err) {
      setError(err.message || "Failed to load queries");
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
      await adminApi.updateQueryStatus(id, nextStatus);
      await load(status);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminShell title="Contact Queries" subtitle="Messages from the Contact Us form">
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
        {loading ? <div className="admin-empty">Loading queries...</div> : null}
        {!loading && !queries.length ? <div className="admin-empty">No queries found.</div> : null}

        {!loading && queries.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query.id}>
                    <td>{formatDate(query.createdAt)}</td>
                    <td>{query.name}</td>
                    <td>{query.email}</td>
                    <td>{query.subject || "—"}</td>
                    <td>
                      <span className="admin-badge admin-badge--info">{query.status}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link href={`/admin/queries/${query.id}`} className="admin-btn admin-btn--secondary">
                          View
                        </Link>
                        {query.status !== "READ" ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            disabled={busyId === query.id}
                            onClick={() => updateStatus(query.id, "READ")}
                          >
                            Mark read
                          </button>
                        ) : null}
                        {query.status !== "CLOSED" ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger"
                            disabled={busyId === query.id}
                            onClick={() => updateStatus(query.id, "CLOSED")}
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
