"use client";

import { useState } from "react";
import Image from "next/image";
import { isExternalImage } from "@/lib/image-source";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailFromUrl,
  parseYouTubeVideoId,
} from "@/lib/youtube";
import type { OfertaZdjecieTyp } from "@/types/database";

type GalleryItem = {
  id: string;
  url: string;
  typ: OfertaZdjecieTyp;
};

export default function OfferGallery({
  images,
  title,
  fallbackImage,
}: {
  images: GalleryItem[];
  title: string;
  fallbackImage: string;
}) {
  const gallery =
    images.length > 0
      ? images
      : [{ id: "fallback", url: fallbackImage, typ: "zdjecie" as const }];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex] ?? gallery[0];
  const activeVideoId = active.typ === "film" ? parseYouTubeVideoId(active.url) : null;

  return (
    <div>
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
        {active.typ === "film" && activeVideoId ? (
          <iframe
            src={`${getYouTubeEmbedUrl(activeVideoId)}?rel=0`}
            title={`${title} — film`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : active.typ === "film" ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Film niedostępny
          </div>
        ) : (
          <Image
            src={active.url}
            alt={title}
            fill
            priority
            unoptimized={isExternalImage(active.url)}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((image, index) => {
            const thumbUrl =
              image.typ === "film"
                ? (getYouTubeThumbnailFromUrl(image.url) ?? image.url)
                : image.url;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                  index === activeIndex ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={
                    image.typ === "film"
                      ? `${title} — film ${index + 1}`
                      : `${title} — zdjęcie ${index + 1}`
                  }
                  fill
                  unoptimized={isExternalImage(thumbUrl)}
                  className="object-cover"
                  sizes="112px"
                />
                {image.typ === "film" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-900/35">
                    <svg
                      className="h-8 w-8 text-white drop-shadow"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
