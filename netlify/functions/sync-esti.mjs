// Netlify Scheduled Function — cykliczna synchronizacja ofert EstiCRM.
// Uruchamia się wg harmonogramu (poniżej) i wywołuje endpoint Next.js
// /api/cron/sync-esti z sekretem CRON_SECRET.
//
// Wymaga ustawienia w Netlify zmiennych: CRON_SECRET (oraz pozostałych
// zmiennych Esti / Supabase wykorzystywanych przez endpoint).

export default async () => {
  const base = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
  const secret = process.env.CRON_SECRET || "";

  if (!base || !secret) {
    console.error("sync-esti: brak URL lub CRON_SECRET w środowisku Netlify.");
    return new Response("Brak konfiguracji.", { status: 500 });
  }

  const res = await fetch(`${base}/api/cron/sync-esti?mode=incremental`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });

  const body = await res.text();
  console.log(`sync-esti: HTTP ${res.status} ${body}`);
  return new Response(body, { status: res.status });
};

// Harmonogram w formacie cron (UTC) — co godzinę.
export const config = {
  schedule: "0 * * * *",
};
