import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "pp_admin_session";
const MAX_AGE = 60 * 60 * 12; // 12 godzin

/**
 * Token sesji = HMAC(hasło) z sekretem. Hasło nigdy nie trafia do ciasteczka,
 * a zmiana ADMIN_PASSWORD automatycznie unieważnia istniejące sesje.
 */
export function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const secret = process.env.ADMIN_SESSION_SECRET ?? "pp-estate-fallback-secret";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function verifyPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const store = await cookies();
  const current = store.get(ADMIN_COOKIE)?.value;
  if (!current) return false;
  const a = Buffer.from(current);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
