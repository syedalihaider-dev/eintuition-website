"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { adminApi } from "@/lib/admin-api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("eintuitionadmin@yopmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.login({ email: email.trim(), password });
      router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={onSubmit}>
        <h1>Admin Login</h1>
        <p>Sign in to manage packages, payments, and inquiries.</p>

        {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}

        <div className="admin-field" style={{ marginBottom: 14 }}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            className="admin-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="admin-field" style={{ marginBottom: 18 }}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            className="admin-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="admin-btn admin-btn--primary" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-login">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
