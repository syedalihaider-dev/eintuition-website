"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  featuresText: "",
  billingPeriod: "MONTHLY",
  price: "",
  currency: "usd",
  isFeatured: false,
  isActive: true,
};

export default function PackageForm({ packageId }) {
  const router = useRouter();
  const isEdit = Boolean(packageId);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    adminApi
      .packageById(packageId)
      .then((pkg) => {
        if (cancelled) return;
        setForm({
          name: pkg.name || "",
          slug: pkg.slug || "",
          description: pkg.description || "",
          featuresText: (pkg.features || []).join("\n"),
          billingPeriod: pkg.billingPeriod || "MONTHLY",
          price: ((pkg.priceCents || 0) / 100).toString(),
          currency: pkg.currency || "usd",
          isFeatured: Boolean(pkg.isFeatured),
          isActive: Boolean(pkg.isActive),
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load package");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, packageId]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const features = form.featuresText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const priceNumber = Number(form.price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      setError("Enter a valid price");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim(),
      features,
      billingPeriod: form.billingPeriod,
      priceCents: Math.round(priceNumber * 100),
      currency: form.currency.trim() || "usd",
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };

    try {
      if (isEdit) {
        await adminApi.updatePackage(packageId, payload);
        setSuccess("Package updated");
      } else {
        const created = await adminApi.createPackage(payload);
        setSuccess("Package created");
        router.replace(`/admin/packages/${created.id}/edit`);
      }
    } catch (err) {
      setError(err.message || "Unable to save package");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-card">Loading package...</div>;

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
      {success ? <div className="admin-alert admin-alert--success">{success}</div> : null}

      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" className="admin-input" required value={form.name} onChange={onChange} />
        </div>
        <div className="admin-field">
          <label htmlFor="slug">Slug (optional)</label>
          <input id="slug" name="slug" className="admin-input" value={form.slug} onChange={onChange} placeholder="basic-monthly" />
        </div>
        <div className="admin-field">
          <label htmlFor="billingPeriod">Billing period</label>
          <select
            id="billingPeriod"
            name="billingPeriod"
            className="admin-select"
            value={form.billingPeriod}
            onChange={onChange}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="price">Price (USD)</label>
          <input
            id="price"
            name="price"
            className="admin-input"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={onChange}
          />
        </div>
        <div className="admin-field full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="admin-textarea"
            required
            value={form.description}
            onChange={onChange}
          />
        </div>
        <div className="admin-field full">
          <label htmlFor="featuresText">Features (one per line)</label>
          <textarea
            id="featuresText"
            name="featuresText"
            className="admin-textarea"
            required
            value={form.featuresText}
            onChange={onChange}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="currency">Currency</label>
          <input id="currency" name="currency" className="admin-input" value={form.currency} onChange={onChange} />
        </div>
        <div className="admin-field">
          <label>
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={onChange} /> Featured
          </label>
        </div>
        <div className="admin-field">
          <label>
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} /> Active
          </label>
        </div>
      </div>

      <div className="admin-actions" style={{ marginTop: 20 }}>
        <button className="admin-btn admin-btn--primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update package" : "Create package"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => router.push("/admin/packages")}
        >
          Back to list
        </button>
      </div>
    </form>
  );
}
