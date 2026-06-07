import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("oferty")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          connected: true,
          message:
            error.code === "PGRST205"
              ? "Połączenie działa, ale tabele nie zostały jeszcze utworzone. Uruchom migrację SQL."
              : error.message,
        },
        { status: error.code === "PGRST205" ? 200 : 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      connected: true,
      ofertyCount: count ?? 0,
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
