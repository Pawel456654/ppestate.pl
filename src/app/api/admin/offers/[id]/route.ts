import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeOfferInput } from "@/lib/offer-input";
import { applyGoogleMapsLink } from "@/lib/google-maps";
import { applyGeneratedSeo } from "@/lib/offer-seo";
import type { Oferta, OfertaZdjecie } from "@/types/database";

const BUCKET = "oferty-zdjecia";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Błędne dane." }, { status: 400 });
  }

  const payload = sanitizeOfferInput(body, true);

  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("oferty")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json(
      { ok: false, message: fetchError?.message ?? "Oferta nie istnieje." },
      { status: fetchError?.code === "PGRST116" ? 404 : 500 }
    );
  }

  // Gdy admin zmienia status oferty Esti, automatycznie ustawiamy flagę ochrony
  // przed nadpisaniem przez sync — chyba że admin explicite ją resetuje (false).
  const isEstiOffer = (existing as Oferta).zrodlo === "esti";
  const statusChangedByAdmin = Object.prototype.hasOwnProperty.call(body, "status");
  const explicitReset =
    Object.prototype.hasOwnProperty.call(body, "status_reczny") &&
    (payload as Record<string, unknown>).status_reczny === false;

  if (isEstiOffer && statusChangedByAdmin && !explicitReset) {
    (payload as Record<string, unknown>).status_reczny = true;
  }

  const updatePayload = applyGeneratedSeo(
    applyGoogleMapsLink({
      ...(existing as Oferta),
      ...payload,
    })
  );

  const { data, error } = await supabase
    .from("oferty")
    .update(updatePayload)
    .eq("id", id)
    .select("*, oferty_zdjecia(*)")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, oferta: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const supabase = createAdminClient();

  // Usuń pliki ze storage, zanim skasujemy ofertę (rekordy zdjęć znikną kaskadowo)
  const { data } = await supabase
    .from("oferty_zdjecia")
    .select("*")
    .eq("oferta_id", id);
  const zdjecia = (data ?? []) as OfertaZdjecie[];

  const sciezki = zdjecia
    .map((z) => z.sciezka)
    .filter((s): s is string => Boolean(s));
  if (sciezki.length > 0) {
    await supabase.storage.from(BUCKET).remove(sciezki);
  }

  const { error } = await supabase.from("oferty").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
