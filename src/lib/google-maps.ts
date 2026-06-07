export type ParsedGoogleMaps =
  | { kind: "coords"; lat: number; lng: number; label?: string }
  | { kind: "embed"; embedUrl: string; label?: string }
  | { kind: "query"; query: string };

function parseCoordPair(
  latRaw: string | undefined,
  lngRaw: string | undefined
): { lat: number; lng: number } | null {
  if (!latRaw || !lngRaw) return null;
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

function coordsFromAtNotation(value: string): { lat: number; lng: number } | null {
  const match = value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  return match ? parseCoordPair(match[1], match[2]) : null;
}

function coordsFrom3d4dNotation(value: string): { lat: number; lng: number } | null {
  const match = value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  return match ? parseCoordPair(match[1], match[2]) : null;
}

function decodeQueryParam(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

export function parseGoogleMapsUrl(input: string): ParsedGoogleMaps | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const rawCoords = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (rawCoords) {
    const coords = parseCoordPair(rawCoords[1], rawCoords[2]);
    return coords ? { kind: "coords", ...coords } : null;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { kind: "query", query: trimmed };
  }

  const host = url.hostname.replace(/^www\./, "");
  if (!host.includes("google.") && !host.includes("goo.gl") && !host.includes("maps.app")) {
    return null;
  }

  const full = url.toString();

  if (full.includes("/maps/embed")) {
    return { kind: "embed", embedUrl: full };
  }

  const precise = coordsFrom3d4dNotation(full) ?? coordsFromAtNotation(full);
  if (precise) {
    const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
    const label = placeMatch
      ? decodeQueryParam(placeMatch[1].replace(/\+/g, " "))
      : undefined;
    return { kind: "coords", ...precise, label };
  }

  const q =
    url.searchParams.get("q") ??
    url.searchParams.get("query") ??
    url.searchParams.get("ll");
  if (q) {
    const decoded = decodeQueryParam(q);
    const asCoords = decoded.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (asCoords) {
      const coords = parseCoordPair(asCoords[1], asCoords[2]);
      return coords ? { kind: "coords", ...coords } : null;
    }
    return { kind: "query", query: decoded };
  }

  const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch) {
    return {
      kind: "query",
      query: decodeQueryParam(placeMatch[1].replace(/\+/g, " ")),
    };
  }

  return null;
}

export function buildGoogleMapsEmbedUrl(
  parsed: ParsedGoogleMaps,
  zoom = 17
): string {
  if (parsed.kind === "embed") return parsed.embedUrl;
  if (parsed.kind === "coords") {
    return `https://maps.google.com/maps?q=${parsed.lat},${parsed.lng}&z=${zoom}&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(parsed.query)}&z=${zoom}&output=embed`;
}

export function getMapLabel(
  parsed: ParsedGoogleMaps,
  fallback?: string | null
): string {
  if (parsed.kind === "coords") {
    if (parsed.label) return parsed.label;
    return `${parsed.lat}, ${parsed.lng}`;
  }
  if (parsed.kind === "embed") {
    return parsed.label ?? fallback ?? "Lokalizacja na mapie";
  }
  return parsed.query;
}

export function coordsFromGoogleMapsLink(
  input: string | null | undefined
): { lat: number; lng: number } | null {
  if (!input) return null;
  const parsed = parseGoogleMapsUrl(input);
  return parsed?.kind === "coords" ? { lat: parsed.lat, lng: parsed.lng } : null;
}

export function applyGoogleMapsLink<T extends Record<string, unknown>>(payload: T): T {
  if (!Object.prototype.hasOwnProperty.call(payload, "link_google_maps")) {
    return payload;
  }

  const link =
    typeof payload.link_google_maps === "string" ? payload.link_google_maps : null;

  if (!link) {
    return payload;
  }

  const coords = coordsFromGoogleMapsLink(link);
  if (coords) {
    return {
      ...payload,
      szerokosc_geo: coords.lat,
      dlugosc_geo: coords.lng,
    };
  }

  return payload;
}
