import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OfertaZdjecie } from "@/types/database";

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { offerId?: unknown; ids?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Błędne dane." }, { status: 400 });
  }

  const offerId = typeof body.offerId === "string" ? body.offerId.trim() : "";
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];

  if (!offerId) {
    return NextResponse.json(
      { ok: false, message: "Brak identyfikatora oferty." },
      { status: 400 }
    );
  }

  if (ids.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("oferty_zdjecia")
    .select("id, typ")
    .eq("oferta_id", offerId);

  if (fetchError) {
    return NextResponse.json({ ok: false, message: fetchError.message }, { status: 500 });
  }

  const rows = (existing ?? []) as Pick<OfertaZdjecie, "id" | "typ">[];
  const existingIds = new Set(rows.map((row) => row.id));

  if (ids.length !== rows.length || ids.some((id) => !existingIds.has(id))) {
    return NextResponse.json(
      { ok: false, message: "Nieprawidłowa lista mediów do uporządkowania." },
      { status: 400 }
    );
  }

  const typById = new Map(rows.map((row) => [row.id, row.typ]));
  const firstImageId = ids.find((id) => typById.get(id) === "zdjecie") ?? null;

  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    const { error } = await supabase
      .from("oferty_zdjecia")
      .update({
        kolejnosc: index,
        czy_glowne: id === firstImageId,
      })
      .eq("id", id)
      .eq("oferta_id", offerId);

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
