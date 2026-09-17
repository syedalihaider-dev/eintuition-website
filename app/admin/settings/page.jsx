"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { adminApi } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    adminApi
      .me()
      .then((data) => setEmail(data.admin?.email || ""))
      .catch((err) => setMessage({ type: "error", text: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const updateEmail = async (event) => {
    event.preventDefault();
    setSavingEmail(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await adminApi.updateEmail({ email: email.trim() });
      setEmail(data.admin.email);
      setMessage({ type: "success", text: "Email updated" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update email" });
    } finally {
      setSavingEmail(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setMessage({ type: "", text: "" });
    try {
      await adminApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage({ type: "success", text: "Password updated" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update password" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminShell title="Settings" subtitle="Admin account email and password">
      {message.text ? (
        <div className={`admin-alert ${message.type === "success" ? "admin-alert--success" : "admin-alert--error"}`}>
          {message.text}
        </div>
      ) : null}

      {loading ? (
        <div className="admin-card">Loading...</div>
      ) : (
        <div className="admin-detail-grid">
          <form className="admin-card" onSubmit={updateEmail}>
            <h3 style={{ marginTop: 0 }}>Update email</h3>
            <div className="admin-field">
              <label htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                className="admin-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="admin-btn admin-btn--primary" type="submit" disabled={savingEmail} style={{ marginTop: 14 }}>
              {savingEmail ? "Saving..." : "Save email"}
            </button>
          </form>

          <form className="admin-card" onSubmit={updatePassword}>
            <h3 style={{ marginTop: 0 }}>Change password</h3>
            <div className="admin-field" style={{ marginBottom: 12 }}>
              <label htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                className="admin-input"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                className="admin-input"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button className="admin-btn admin-btn--primary" type="submit" disabled={savingPassword} style={{ marginTop: 14 }}>
              {savingPassword ? "Saving..." : "Save password"}
            </button>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
