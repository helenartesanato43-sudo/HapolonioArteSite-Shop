"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Banner } from "@/types";

interface BannerCarouselProps {
  banners: Banner[];
  intervalSeconds: number;
}

interface Slide {
  src: string;
  caption: string | null;
  overlayOpacity: number;
}

const FALLBACK_DESKTOP = "https://picsum.photos/seed/hapolonio-desktop/1600/700";
const FALLBACK_MOBILE = "https://picsum.photos/seed/hapolonio-mobile/900/1100";

export function BannerCarousel({ banners, intervalSeconds }: BannerCarouselProps) {
  const desktopSlides: Slide[] =
    banners.length > 0
      ? banners.map((b) => ({
          src: b.desktop_image_url,
          caption: b.caption_html,
          overlayOpacity: b.overlay_opacity,
        }))
      : [{ src: FALLBACK_DESKTOP, caption: null, overlayOpacity: 0 }];

  const mobileSlides: Slide[] =
    banners.length > 0
      ? banners.map((b) => ({
          src: b.mobile_image_url,
          caption: b.caption_html,
          overlayOpacity: b.overlay_opacity,
        }))
      : [{ src: FALLBACK_MOBILE, caption: null, overlayOpacity: 0 }];

  return (
    <section className="relative w-full">
      <div className="hidden md:block">
        <TimedCarousel
          slides={desktopSlides}
          intervalSeconds={intervalSeconds}
          ratioClassName="h-[45vh] min-h-[320px] md:h-[60vh]"
        />
      </div>
      <div className="block md:hidden">
        <TimedCarousel
          slides={mobileSlides}
          intervalSeconds={intervalSeconds}
          ratioClassName="h-[55vh] min-h-[380px]"
        />
      </div>
    </section>
  );
}

function TimedCarousel({
  slides,
  intervalSeconds,
  ratioClassName,
}: {
  slides: Slide[];
  intervalSeconds: number;
  ratioClassName: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const ms = Math.max(2, intervalSeconds) * 1000;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, ms);
    return () => clearInterval(timer);
  }, [slides, intervalSeconds]);

  return (
    <div className={`relative w-full overflow-hidden ${ratioClassName}`}>
      {slides.map((slide, i) => (
        <div
          key={slide.src + i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt="Peças de cerâmica artesanal Hapolonio Arte"
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />

          {slide.caption ? (
            <>
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: slide.overlayOpacity }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div
                  className="font-montserrat max-w-2xl text-xl font-bold text-white drop-shadow-md sm:text-2xl md:text-4xl [&_font]:leading-snug"
                  dangerouslySetInnerHTML={{ __html: slide.caption }}
                />
              </div>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
