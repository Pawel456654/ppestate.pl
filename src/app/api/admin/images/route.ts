import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)(\?.*)?$/i;

async function looksLikeImage(url: string): Promise<boolean> {
  if (IMAGE_EXT.test(url)) return true;
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(8000) });
    const type = res.headers.get("content-type") ?? "";
    return type.startsWith("image/");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { offerId?: unknown; url?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Błędne dane." }, { status: 400 });
  }

  const offerId = typeof body.offerId === "string" ? body.offerId.trim() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";

  if (!offerId) {
    return NextResponse.json(
      { ok: false, message: "Brak identyfikatora oferty." },
      { status: 400 }
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ ok: false, message: "Nieprawidłowy URL." }, { status: 400 });
  }
  if (parsed.protocol !== "https:") {
    return NextResponse.json(
      { ok: false, message: "Dozwolone są tylko adresy https." },
      { status: 400 }
    );
  }
  if (!(await looksLikeImage(url))) {
    return NextResponse.json(
      { ok: false, message: "Podany URL nie wskazuje na obraz." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("oferty_zdjecia")
    .select("id", { count: "exact", head: true })
    .eq("oferta_id", offerId);

  const isFirst = (count ?? 0) === 0;

  const { data: row, error } = await supabase
    .from("oferty_zdjecia")
    .insert({
      oferta_id: offerId,
      url,
      sciezka: null,
      kolejnosc: count ?? 0,
      czy_glowne: isFirst,
      zrodlo: "url",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, zdjecie: row }, { status: 201 });
}
