import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isYouTubeUrl, normalizeYouTubeUrl } from "@/lib/youtube";
import type { OfertaZdjecie, OfertaZdjecieTyp } from "@/types/database";

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

  let body: { offerId?: unknown; url?: unknown; typ?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Błędne dane." }, { status: 400 });
  }

  const offerId = typeof body.offerId === "string" ? body.offerId.trim() : "";
  const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
  const typ: OfertaZdjecieTyp = body.typ === "film" ? "film" : "zdjecie";

  if (!offerId) {
    return NextResponse.json(
      { ok: false, message: "Brak identyfikatora oferty." },
      { status: 400 }
    );
  }

  let url = rawUrl;

  if (typ === "film") {
    const normalized = normalizeYouTubeUrl(rawUrl);
    if (!normalized) {
      return NextResponse.json(
        { ok: false, message: "Podaj prawidłowy link do filmu YouTube." },
        { status: 400 }
      );
    }
    url = normalized;
  } else {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return NextResponse.json({ ok: false, message: "Nieprawidłowy URL." }, { status: 400 });
    }
    if (parsed.protocol !== "https:") {
      return NextResponse.json(
        { ok: false, message: "Dozwolone są tylko adresy https." },
        { status: 400 }
      );
    }
    if (isYouTubeUrl(rawUrl)) {
      return NextResponse.json(
        { ok: false, message: "Link YouTube dodaj w polu filmu, nie zdjęcia." },
        { status: 400 }
      );
    }
    if (!(await looksLikeImage(rawUrl))) {
      return NextResponse.json(
        { ok: false, message: "Podany URL nie wskazuje na obraz." },
        { status: 400 }
      );
    }
  }

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("oferty_zdjecia")
    .select("id", { count: "exact", head: true })
    .eq("oferta_id", offerId);

  const { data: existingMain } = await supabase
    .from("oferty_zdjecia")
    .select("id")
    .eq("oferta_id", offerId)
    .eq("czy_glowne", true)
    .eq("typ", "zdjecie")
    .limit(1);

  const hasMainImage = (existingMain ?? []).length > 0;
  const isFirstImage = typ === "zdjecie" && !hasMainImage;

  const { data: row, error } = await supabase
    .from("oferty_zdjecia")
    .insert({
      oferta_id: offerId,
      url,
      sciezka: null,
      kolejnosc: count ?? 0,
      czy_glowne: isFirstImage,
      zrodlo: "url",
      typ,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, zdjecie: row as OfertaZdjecie }, { status: 201 });
}
