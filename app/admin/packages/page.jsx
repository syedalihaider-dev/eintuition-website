"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi, formatMoney } from "@/lib/admin-api";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async (billingPeriod = filter) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.packages(billingPeriod || undefined);
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);

  const deactivate = async (id) => {
    setBusyId(id);
    try {
      await adminApi.deactivatePackage(id);
      await load(filter);
    } catch (err) {
      setError(err.message || "Failed to deactivate package");
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminShell
      title="Packages"
      subtitle="Create and manage monthly/yearly packages"
      actions={
        <Link href="/admin/packages/new" className="admin-btn admin-btn--primary">
          Add package
        </Link>
      }
    >
      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-filters">
            <select
              className="admin-select"
              style={{ width: 180 }}
              value={filter}
              onChange={(e) => {
                const value = e.target.value;
                setFilter(value);
                load(value);
              }}
            >
              <option value="">All periods</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>

        {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
        {loading ? <div className="admin-empty">Loading packages...</div> : null}

        {!loading && !packages.length ? (
          <div className="admin-empty">No packages found.</div>
        ) : null}

        {!loading && packages.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Period</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Flags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      <strong>{pkg.name}</strong>
                      <div style={{ color: "#64748b", fontSize: 12 }}>{pkg.slug}</div>
                    </td>
                    <td>{pkg.billingPeriod}</td>
                    <td>{formatMoney(pkg.priceCents, pkg.currency)}</td>
                    <td>
                      <span className={`admin-badge ${pkg.isActive ? "admin-badge--success" : "admin-badge--muted"}`}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{pkg.isFeatured ? "Featured" : "—"}</td>
                    <td>
                      <div className="admin-actions">
                        <Link href={`/admin/packages/${pkg.id}/edit`} className="admin-btn admin-btn--secondary">
                          Edit
                        </Link>
                        {pkg.isActive ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger"
                            disabled={busyId === pkg.id}
                            onClick={() => deactivate(pkg.id)}
                          >
                            {busyId === pkg.id ? "..." : "Deactivate"}
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
