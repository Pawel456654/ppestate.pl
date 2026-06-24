import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { isEstiConfigured } from "@/lib/esti/config";
import { getEstiSyncStatus, runEstiSync } from "@/lib/esti/sync";
import type { EstiSyncMode } from "@/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const status = await getEstiSyncStatus();
  return NextResponse.json({ ok: true, configured: isEstiConfigured(), status });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!isEstiConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Brak konfiguracji EstiCRM (ESTI_COMPANY_ID / ESTI_API_TOKEN)." },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const mode: EstiSyncMode = url.searchParams.get("mode") === "full" ? "full" : "incremental";

  const result = await runEstiSync({ mode });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
