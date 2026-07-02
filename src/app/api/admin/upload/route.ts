import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "oferty-zdjecia";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function extFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/avif") return "avif";
  return "jpg";
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await request.formData();
  const offerId = form.get("offerId");
  const file = form.get("file");

  if (typeof offerId !== "string" || !offerId) {
    return NextResponse.json(
      { ok: false, message: "Brak identyfikatora oferty." },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Brak pliku." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { ok: false, message: "Dozwolone formaty: JPG, PNG, WEBP, AVIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, message: "Maksymalny rozmiar pliku to 8 MB." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const path = `${offerId}/${randomUUID()}.${extFor(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json(
      { ok: false, message: uploadError.message },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // Pierwsze zdjęcie oferty zostaje zdjęciem głównym
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

  const { data: row, error: insertError } = await supabase
    .from("oferty_zdjecia")
    .insert({
      oferta_id: offerId,
      url: pub.publicUrl,
      sciezka: path,
      kolejnosc: count ?? 0,
      czy_glowne: !hasMainImage,
      zrodlo: "upload",
      typ: "zdjecie",
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json(
      { ok: false, message: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, zdjecie: row }, { status: 201 });
}
