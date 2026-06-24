import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin Turbopack's root to this project so it doesn't try to crawl
  // sibling directories under "Desktop/websites folder" looking for a
  // workspace lockfile (huge perf hit on a laptop with limited RAM).
  turbopack: {
    root: projectRoot,
  },

  // Limit how aggressively next/image generates resized variants.
  // The defaults produce 8 device sizes + 7 image sizes per source image,
  // which means Sharp can decode/encode the same JPEG ~15x on first paint.
  // For this site we only need a handful of breakpoints.
  images: {
    formats: ["image/webp"],
    qualities: [75],
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vbgqdbtpbvthzvjvzboj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Zdjęcia z EstiCRM. Hosty zewnętrzne spoza tej listy i tak działają
      // (renderowane przez next/image z `unoptimized` — patrz lib/image-source),
      // ale dla domen Esti włączamy optymalizację next/image.
      {
        protocol: "https",
        hostname: "**.esticrm.pl",
      },
    ],
  },

  experimental: {
    // Don't preload every route's JS into memory at dev startup.
    preloadEntriesOnStart: false,
  },
};

export default nextConfig;
