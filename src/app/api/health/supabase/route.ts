import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getSupabaseServiceRoleKey,
  looksLikePublicSupabaseKey,
} from "@/lib/supabase/env";

export async function GET() {
  try {
    const serviceKey = getSupabaseServiceRoleKey();
    if (looksLikePublicSupabaseKey(serviceKey)) {
      return NextResponse.json(
        {
          ok: false,
          connected: true,
          adminAccess: false,
          message:
            "SUPABASE_SERVICE_ROLE_KEY wygląda na klucz publiczny. Ustaw Secret key z Supabase.",
        },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();
    const [ofertyResult, syncStateResult] = await Promise.all([
      supabase.from("oferty").select("*", { count: "exact", head: true }),
      supabase.from("esti_sync_state").select("id").maybeSingle(),
    ]);

    const error = ofertyResult.error ?? syncStateResult.error;
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          connected: true,
          adminAccess: false,
          message:
            error.code === "PGRST205"
              ? "Połączenie działa, ale tabele nie zostały jeszcze utworzone. Uruchom migrację SQL."
              : error.message,
        },
        { status: error.code === "PGRST205" ? 200 : 500 }
      );
    }

    if (!syncStateResult.data) {
      return NextResponse.json(
        {
          ok: false,
          connected: true,
          adminAccess: false,
          message:
            "Klucz serwerowy nie ma dostępu administracyjnego. Sprawdź SUPABASE_SERVICE_ROLE_KEY na Vercel.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      connected: true,
      adminAccess: true,
      ofertyCount: ofertyResult.count ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        connected: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
