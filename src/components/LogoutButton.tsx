"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";

export default function LogoutButton({
  locale = "bn",
  redirectTo = "/login",
}: {
  locale?: Locale;
  /** Same-origin path to land on after signing out. */
  redirectTo?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      // Clear the session without letting next-auth build the redirect from NEXTAUTH_URL,
      // which breaks sign-out whenever that setting doesn't match the address in use.
      await signOut({ redirect: false });
    } finally {
      // Full navigation so every server component re-renders signed-out.
      window.location.assign(redirectTo);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-outline btn-sm logout-btn"
      onClick={logout}
      disabled={busy}
      title={t(locale, "logout")}
    >
      <Icon name="logout" size={16} />
      <span>{busy ? t(locale, "processing") : t(locale, "logout")}</span>
    </button>
  );
}
