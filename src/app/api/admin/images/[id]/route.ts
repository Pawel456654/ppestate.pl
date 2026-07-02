import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OfertaZdjecie } from "@/types/database";

const BUCKET = "oferty-zdjecia";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("oferty_zdjecia")
    .select("*")
    .eq("id", id)
    .single();
  const zdjecie = data as OfertaZdjecie | null;

  if (zdjecie?.sciezka) {
    await supabase.storage.from(BUCKET).remove([zdjecie.sciezka]);
  }

  const { error } = await supabase.from("oferty_zdjecia").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  // Jeśli usunięto zdjęcie główne, ustaw nowe główne (pierwsze pozostałe zdjęcie)
  if (zdjecie?.czy_glowne && zdjecie.oferta_id) {
    const { data: nextRows } = await supabase
      .from("oferty_zdjecia")
      .select("id")
      .eq("oferta_id", zdjecie.oferta_id)
      .eq("typ", "zdjecie")
      .order("kolejnosc", { ascending: true })
      .limit(1);
    const nextId = (nextRows?.[0] as Pick<OfertaZdjecie, "id"> | undefined)?.id;
    if (nextId) {
      await supabase
        .from("oferty_zdjecia")
        .update({ czy_glowne: true })
        .eq("id", nextId);
    }
  }

  return NextResponse.json({ ok: true });
}
