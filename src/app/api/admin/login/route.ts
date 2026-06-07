import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  expectedToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const token = expectedToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Panel nie jest skonfigurowany (brak ADMIN_PASSWORD)." },
      { status: 500 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Błędne dane." }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, message: "Nieprawidłowe hasło." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
  return res;
}
