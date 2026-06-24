/**
 * Określa, czy dany URL obrazu pochodzi spoza naszego storage Supabase.
 * Zdjęcia z EstiCRM (lub wklejone linki) są hostowane na zewnętrznych
 * domenach, których nie znamy z góry — renderujemy je przez next/image z
 * `unoptimized`, dzięki czemu działają bez dopisywania każdego hosta do
 * `images.remotePatterns`.
 */
export function isExternalImage(src: string): boolean {
  if (!src || !/^https?:\/\//i.test(src)) return false; // ścieżki lokalne

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseHost = "";
  if (supabaseUrl) {
    try {
      supabaseHost = new URL(supabaseUrl).hostname;
    } catch {
      supabaseHost = "";
    }
  }

  try {
    return new URL(src).hostname !== supabaseHost;
  } catch {
    return false;
  }
}
