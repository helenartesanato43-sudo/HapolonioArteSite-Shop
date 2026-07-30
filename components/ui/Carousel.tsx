"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps<T> {
  items: T[];
  mobileCount: number;
  desktopCount: number;
  intervalSeconds: number;
  gapPx?: number;
  renderItem: (item: T, index: number) => ReactNode;
  itemKey: (item: T, index: number) => string;
}

export function Carousel<T>({
  items,
  mobileCount,
  desktopCount,
  intervalSeconds,
  gapPx = 24,
  renderItem,
  itemKey,
}: CarouselProps<T>) {
  if (items.length === 0) return null;

  return (
    <>
      <div className="block md:hidden">
        <CarouselTrack
          items={items}
          itemsPerView={mobileCount}
          intervalSeconds={intervalSeconds}
          gapPx={gapPx}
          renderItem={renderItem}
          itemKey={itemKey}
        />
      </div>
      <div className="hidden md:block">
        <CarouselTrack
          items={items}
          itemsPerView={desktopCount}
          intervalSeconds={intervalSeconds}
          gapPx={gapPx}
          renderItem={renderItem}
          itemKey={itemKey}
        />
      </div>
    </>
  );
}

interface CarouselTrackProps<T> {
  items: T[];
  itemsPerView: number;
  intervalSeconds: number;
  gapPx: number;
  renderItem: (item: T, index: number) => ReactNode;
  itemKey: (item: T, index: number) => string;
}

function CarouselTrack<T>({
  items,
  itemsPerView,
  intervalSeconds,
  gapPx,
  renderItem,
  itemKey,
}: CarouselTrackProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const safeItemsPerView = Math.max(1, itemsPerView);
  const showNav = items.length > safeItemsPerView;

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
  }, [items.length, safeItemsPerView, updateArrows]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !showNav) return;
    const ms = Math.max(2, intervalSeconds) * 1000;
    const timer = setInterval(() => {
      if (isPaused.current) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + el.clientWidth,
        behavior: "smooth",
      });
    }, ms);
    return () => clearInterval(timer);
  }, [showNav, intervalSeconds]);

  function pauseThenResume() {
    isPaused.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      isPaused.current = false;
    }, 5000);
  }

  function scrollByPage(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    pauseThenResume();
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {showNav && canPrev ? (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Anterior"
          className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}

      <div
        ref={trackRef}
        onPointerDown={pauseThenResume}
        onTouchStart={pauseThenResume}
        className="flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth py-1 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: `${gapPx}px` }}
      >
        {items.map((item, i) => (
          <div
            key={itemKey(item, i)}
            className="shrink-0 snap-start"
            style={{
              width: `calc((100% - ${gapPx * (safeItemsPerView - 1)}px) / ${safeItemsPerView})`,
            }}
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {showNav && canNext ? (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Próximo"
          className="absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-navy shadow-card ring-1 ring-clay/15 transition-transform hover:scale-105 sm:flex"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
