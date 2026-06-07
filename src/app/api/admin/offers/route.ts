import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeOfferInput } from "@/lib/offer-input";
import { applyGoogleMapsLink } from "@/lib/google-maps";
import { applyGeneratedSeo } from "@/lib/offer-seo";
import { buildOfferSlug } from "@/lib/offers";
import type { Database } from "@/types/database";

type OfertaInsert = Database["public"]["Tables"]["oferty"]["Insert"];

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("oferty")
    .select("*, oferty_zdjecia(*)")
    .order("data_utworzenia", { ascending: false })
    .order("kolejnosc", { referencedTable: "oferty_zdjecia", ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, oferty: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Błędne dane." }, { status: 400 });
  }

  const payload = applyGeneratedSeo(
    applyGoogleMapsLink(sanitizeOfferInput(body) as Record<string, unknown>)
  );

  if (!payload.tytul || typeof payload.tytul !== "string") {
    return NextResponse.json(
      { ok: false, message: "Tytuł jest wymagany." },
      { status: 400 }
    );
  }
  if (!payload.typ_nieruchomosci) {
    return NextResponse.json(
      { ok: false, message: "Typ nieruchomości jest wymagany." },
      { status: 400 }
    );
  }

  if (!payload.slug) {
    payload.slug = buildOfferSlug({
      tytul: payload.tytul,
      typ_nieruchomosci: String(payload.typ_nieruchomosci),
      powierzchnia:
        typeof payload.powierzchnia === "number" ? payload.powierzchnia : null,
      miasto: typeof payload.miasto === "string" ? payload.miasto : null,
      ulica: typeof payload.ulica === "string" ? payload.ulica : null,
      esti_id: typeof payload.esti_id === "string" ? payload.esti_id : null,
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("oferty")
    .insert(payload as OfertaInsert)
    .select("*, oferty_zdjecia(*)")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, oferta: data }, { status: 201 });
}
