function missingEnv(name: string, aliases: string[] = []): never {
  const options = [name, ...aliases].join(" lub ");
  throw new Error(`Brak zmiennej środowiskowej: ${options}`);
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) missingEnv("NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    missingEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", [
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ]);
  }
  return key;
}

export function getSupabaseServiceRoleKey(): string {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    missingEnv("SUPABASE_SERVICE_ROLE_KEY", ["SUPABASE_SECRET_KEY"]);
  }
  return key;
}

/** Klucz publiczny (publishable) nie omija RLS — panel admina wymaga secret/service_role. */
export function looksLikePublicSupabaseKey(key: string): boolean {
  return key.startsWith("sb_publishable_");
}
