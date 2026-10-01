import { createHash } from "node:crypto";

// Prefer NEXTAUTH_SECRET; if it is missing or empty, derive a stable secret from
// DATABASE_URL (itself a server-only secret) so auth still works in production.
export const authSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.DATABASE_URL
    ? createHash("sha256").update(`ideaportal-nextauth:${process.env.DATABASE_URL}`).digest("base64")
    : undefined);
