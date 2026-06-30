import type { PostgrestError } from "@supabase/supabase-js";

export function formatAdminSupabaseError(error: PostgrestError): string {
  if (
    error.code === "42501" ||
    error.message.toLowerCase().includes("row-level security")
  ) {
    return (
      "Brak uprawnień do zapisu w bazie (RLS). Na Vercel ustaw SUPABASE_SERVICE_ROLE_KEY " +
      "na Secret key z Supabase (nie publishable/anon key)."
    );
  }

  return error.message;
}
