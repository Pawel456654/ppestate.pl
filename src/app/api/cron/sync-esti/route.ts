import { NextResponse } from "next/server";
import { runEstiSync } from "@/lib/esti/sync";
import { revalidatePublicOfferPages } from "@/lib/revalidate-public";
import type { EstiSyncMode } from "@/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  // Fallback dla zewnętrznych cronów: ?secret=... w query.
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

function resolveMode(request: Request): EstiSyncMode {
  const url = new URL(request.url);
  return url.searchParams.get("mode") === "full" ? "full" : "incremental";
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Brak autoryzacji." }, { status: 401 });
  }

  const result = await runEstiSync({ mode: resolveMode(request) });
  if (result.ok) revalidatePublicOfferPages();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
