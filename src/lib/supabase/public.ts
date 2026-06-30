import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createPublicClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
