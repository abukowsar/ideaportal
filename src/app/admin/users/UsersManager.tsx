"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roleLabel, districtLabel, formatNumber } from "@/lib/i18n/vocab";
import { t } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/i18n/locale";
import { createUser, updateUser, deleteUser } from "../actions";
import type { Role } from "@prisma/client";

export type UserRow = {
  id: string;
  username: string;
  name: string;
  role: Role;
  district: string | null;
  upazila: string | null;
  createdAt: string;
  ideaCount: number;
};

const ROLES: Role[] = ["UPAZILA", "DISTRICT", "HQ", "ADMIN"];

type FormState = {
  username: string;
  password: string;
  name: string;
  role: Role;
  district: string;
  upazila: string;
};

const EMPTY: FormState = { username: "", password: "", name: "", role: "UPAZILA", district: "", upazila: "" };

export default function UsersManager({
  users,
  districts,
  currentUserId,
  locale,
}: {
  users: UserRow[];
  districts: string[];
  currentUserId: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<"none" | "create" | string>("none");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [q, setQ] = useState("");
  const [listError, setListError] = useState("");

  function openCreate() {
    setForm(EMPTY);
    setMsg(null);
    setPanel("create");
  }

  function openEdit(u: UserRow) {
    setForm({
      username: u.username,
      password: "",
      name: u.name,
      role: u.role,
      district: u.district ?? "",
      upazila: u.upazila ?? "",
    });
    setMsg(null);
    setPanel(u.id);
  }

  async function handleSubmit() {
    setLoading(true);
    setMsg(null);
    const fd = new FormData();
    fd.set("username", form.username.trim());
    fd.set("password", form.password);
    fd.set("name", form.name.trim());
    fd.set("role", form.role);
    fd.set("district", form.district.trim());
    fd.set("upazila", form.upazila.trim());

    const result = panel === "create" ? await createUser(fd) : await updateUser(panel, fd);
    setLoading(false);

    if (!result.ok) {
      setMsg({ text: result.error, error: true });
      return;
    }
    setPanel("none");
    router.refresh();
  }

  async function handleDelete(u: UserRow) {
    const message = t(locale, "confirm_delete_user").replace("{name}", u.name).replace("{username}", u.username);
    if (!confirm(message)) return;
    setListError("");
    const result = await deleteUser(u.id);
    if (!result.ok) {
      setListError(result.error);
      return;
    }
    router.refresh();
  }

  const filtered = users.filter((u) => {
    if (!q.trim()) return true;
    const s = q.trim().toLowerCase();
    return (
      u.username.toLowerCase().includes(s) ||
      u.name.toLowerCase().includes(s) ||
      (u.district ?? "").toLowerCase().includes(s)
    );
  });

  const editing = panel !== "none" && panel !== "create" ? users.find((u) => u.id === panel) : null;

  return (
    <div>
      <div className="repo-controls">
        <input
          placeholder={t(locale, "users_search_placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-gold btn-sm" onClick={openCreate} type="button">
          {t(locale, "new_user_button")}
        </button>
      </div>

      {listError && (
        <p className="form-msg error" style={{ marginBottom: "14px" }}>
          {listError}
        </p>
      )}

      {panel !== "none" && (
        <div className="admin-panel">
          <h3>{panel === "create" ? t(locale, "create_user_title") : `${t(locale, "edit_user_title")} ${editing?.username}`}</h3>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="u-username">
                {t(locale, "field_username")} <span className="req">*</span>
              </label>
              <input
                id="u-username"
                value={form.username}
                disabled={panel !== "create"}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="u-password">
                {t(locale, "field_password")} {panel === "create" && <span className="req">*</span>}
              </label>
              <input
                id="u-password"
                type="password"
                value={form.password}
                placeholder={panel === "create" ? "" : t(locale, "field_password_keep")}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="u-name">
                {t(locale, "field_name")} <span className="req">*</span>
              </label>
              <input id="u-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="u-role">
                {t(locale, "field_role")} <span className="req">*</span>
              </label>
              <select
                id="u-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {roleLabel(r, locale)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="u-district">{t(locale, "form_district_label")}</label>
              <input
                id="u-district"
                list="admin-districts"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
              <datalist id="admin-districts">
                {districts.map((d) => (
                  <option key={d} value={d} label={districtLabel(d, locale)} />
                ))}
              </datalist>
            </div>
            <div className="field">
              <label htmlFor="u-upazila">{t(locale, "form_upazila_label")}</label>
              <input
                id="u-upazila"
                value={form.upazila}
                onChange={(e) => setForm({ ...form, upazila: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-green btn-sm" disabled={loading} onClick={handleSubmit}>
                {loading ? t(locale, "save_button_loading") : t(locale, "save_button")}
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setPanel("none")}>
                {t(locale, "cancel_button")}
              </button>
              {msg && <span className={`form-msg${msg.error ? " error" : ""}`}>{msg.text}</span>}
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t(locale, "field_username")}</th>
              <th>{t(locale, "th_name")}</th>
              <th>{t(locale, "th_role")}</th>
              <th>{t(locale, "th_district_upazila")}</th>
              <th>{t(locale, "th_proposals")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="mono">{u.username}</td>
                <td>{u.name}</td>
                <td>
                  <span className={`role-pill role-${u.role.toLowerCase()}`}>{roleLabel(u.role, locale)}</span>
                </td>
                <td>
                  {[u.district ? districtLabel(u.district, locale) : null, u.upazila].filter(Boolean).join(" · ") ||
                    "—"}
                </td>
                <td>{formatNumber(u.ideaCount, locale)}</td>
                <td className="admin-row-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)} type="button">
                    {t(locale, "edit_button")}
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-danger"
                    onClick={() => handleDelete(u)}
                    disabled={u.id === currentUserId}
                    type="button"
                  >
                    {t(locale, "delete_label")}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  {t(locale, "no_users_found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
