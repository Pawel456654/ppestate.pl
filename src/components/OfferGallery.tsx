"use client";

import { useState } from "react";
import Image from "next/image";
import { isExternalImage } from "@/lib/image-source";

export default function OfferGallery({
  images,
  title,
  fallbackImage,
}: {
  images: { url: string; id: string }[];
  title: string;
  fallbackImage: string;
}) {
  const gallery = images.length > 0 ? images : [{ id: "fallback", url: fallbackImage }];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex] ?? gallery[0];

  return (
    <div>
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
        <Image
          src={active.url}
          alt={title}
          fill
          priority
          unoptimized={isExternalImage(active.url)}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                index === activeIndex ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={image.url}
                alt={`${title} — zdjęcie ${index + 1}`}
                fill
                unoptimized={isExternalImage(image.url)}
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
