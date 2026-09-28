"use client";

import { useState, type FormEvent } from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n/dict";
import Icon from "@/components/Icon";
import type { Locale } from "@/lib/i18n/locale";

export default function LoginForm({ locale, adminOnly = false }: { locale: Locale; adminOnly?: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError(t(locale, "login_error_required"));
      return;
    }
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      username: username.trim(),
      password,
      redirect: false,
    });
    setLoading(false);

    if (!res || res.error) {
      setError(t(locale, "login_error_invalid"));
      return;
    }
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";
    if (adminOnly && !isAdmin) {
      // The admin entrance only admits system admins; don't leave an officer signed in here.
      await signOut({ redirect: false });
      setError(t(locale, "admin_login_not_admin"));
      return;
    }
    router.push(isAdmin ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="username">
          {t(locale, "login_label_username")} <span className="req">*</span>
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={adminOnly ? "admin" : t(locale, "login_placeholder_username")}
          autoComplete="username"
        />
      </div>
      <div className="field">
        <label htmlFor="password">
          {t(locale, "login_label_password")} <span className="req">*</span>
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error && <p className="form-msg error">{error}</p>}
      <div className="form-actions" style={{ marginTop: "4px" }}>
        <button className="btn btn-green auth-submit" type="submit" disabled={loading}>
          {loading ? t(locale, "login_submitting") : t(locale, "login_submit")}
          {!loading && <Icon name="arrowRight" size={18} />}
        </button>
      </div>
    </form>
  );
}
