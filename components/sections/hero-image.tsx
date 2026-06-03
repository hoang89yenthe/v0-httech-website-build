"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = [
  {
    key:   "main",
    thumb: "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=1200&h=900&fit=crop&q=92",
    alt:   "Cánh tay robot tự động trong nhà máy công nghiệp",
  },
  {
    key:   "b",
    thumb: "https://images.unsplash.com/photo-1752614671052-92e18f534db1?w=1000&h=800&fit=crop&q=90",
    alt:   "Robot arm trong nhà máy",
  },
  {
    key:   "c",
    thumb: "https://images.unsplash.com/photo-1780034766312-73825064806c?w=1000&h=800&fit=crop&q=90",
    alt:   "Tủ điện công nghiệp",
  },
] as const;

/* ── 3D Card Deck ──────────────────────────────────────────── */
function cardStyle(pos: number, isDragging: boolean, dragDelta: number): React.CSSProperties {
  const drag   = isDragging ? dragDelta * 0.3 : 0;
  const absPos = Math.abs(pos);

  if (pos === 0) {
    return {
      zIndex:    20,
      transform: `
        perspective(900px)
        translateX(${drag}px)
        translateZ(60px)
        rotateY(${drag * 0.04}deg)
        scale(1)
      `,
      opacity:   1,
      filter:    "brightness(1)",
      transition: isDragging ? "none" : "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
    };
  }

  const xOffset = pos * 260;
  const rotY    = pos * 38;
  const scale   = 0.72;
  const bright  = 0.65;

  return {
    zIndex:    10 - absPos,
    transform: `
      perspective(900px)
      translateX(${xOffset + drag * 0.15}px)
      translateZ(-30px)
      rotateY(${rotY + drag * 0.02}deg)
      scale(${scale})
    `,
    opacity:   0.9,
    filter:    `brightness(${bright})`,
    transition: isDragging ? "none" : "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
  };
}

export function HeroImage() {
  const [activeIdx, setActiveIdx] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta,  setDragDelta]  = useState(0);
  const dragStart   = useRef(0);
  const dragCurrent = useRef(0);

  const rotate = useCallback((dir: 1 | -1) => {
    setActiveIdx(i => (i + dir + IMAGES.length) % IMAGES.length);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current   = e.clientX;
    dragCurrent.current = e.clientX;
    setIsDragging(true);
    setDragDelta(0);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      dragCurrent.current = e.clientX;
      setDragDelta(e.clientX - dragStart.current);
    };
    const onUp = () => {
      const delta = dragCurrent.current - dragStart.current;
      if (Math.abs(delta) > 40) rotate(delta < 0 ? 1 : -1);
      setIsDragging(false);
      setDragDelta(0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [isDragging, rotate]);

  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current   = e.touches[0].clientX;
    dragCurrent.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: TouchEvent) => {
      dragCurrent.current = e.touches[0].clientX;
      setDragDelta(e.touches[0].clientX - dragStart.current);
    };
    const onEnd = () => {
      const delta = dragCurrent.current - dragStart.current;
      if (Math.abs(delta) > 35) rotate(delta < 0 ? 1 : -1);
      setIsDragging(false);
      setDragDelta(0);
    };
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onEnd);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onEnd);
    };
  }, [isDragging, rotate]);

  function getPos(imgIdx: number): number {
    const total = IMAGES.length;
    let d = (imgIdx - activeIdx + total) % total;
    if (d > total / 2) d -= total;
    return d;
  }

  return (
    <figure
      aria-label="Hình ảnh nhà xưởng HT TECH"
      className="flex items-center justify-center lg:justify-end"
      style={{ animation: "hero-img-in 0.5s cubic-bezier(0,0,0.2,1) 100ms both" }}
    >
      {/* ── Mobile: 1 ảnh ── */}
      <div className="lg:hidden w-full max-w-[420px] mt-6 mb-2">
        <div className="relative w-full">
          <div className="absolute inset-6 rounded-xl bg-amber-400/20 blur-2xl" style={{ animation: "glow-pulse 4s ease-in-out infinite" }} />
          <div className="relative overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
            <img src={IMAGES[activeIdx].thumb} alt={IMAGES[activeIdx].alt} className="w-full h-auto object-cover" draggable={false} />
          </div>
        </div>
      </div>

      {/* ── Desktop: 3D card deck ── */}
      <div className="hidden lg:block relative" style={{ width: "720px", height: "540px" }}>

        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-amber-400/20 blur-3xl pointer-events-none"
          style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
        />

        {/* Drag surface */}
        <div
          className="absolute inset-0 z-[30] cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          aria-label="Kéo để xoay ảnh"
        />

        {/* Cards */}
        {IMAGES.map((img, imgIdx) => {
          const pos      = getPos(imgIdx);
          const isCenter = pos === 0;
          const style    = cardStyle(pos, isDragging, dragDelta);

          return (
            <div
              key={img.key}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: "460px", height: "360px", ...style }}
            >
              <div
                className="relative w-full h-full overflow-hidden rounded-2xl"
                style={{
                  boxShadow: isCenter
                    ? "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset"
                    : "0 12px 32px rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src={img.thumb}
                  alt={img.alt}
                  draggable={false}
                  className="w-full h-full object-cover select-none"
                />
                {isCenter && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.06) 50%, transparent)"
                  }} />
                )}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
              </div>
            </div>
          );
        })}

        {/* Navigation arrows */}
        <button
          onClick={() => rotate(-1)}
          aria-label="Ảnh trước"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-[50] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => rotate(1)}
          aria-label="Ảnh tiếp"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-[50] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Dot indicators */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {IMAGES.map((img, i) => (
            <button
              key={img.key}
              onClick={() => setActiveIdx(i)}
              aria-label={`Chọn ảnh ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === activeIdx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Drag hint */}
        <p className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-white/30 text-[10px] whitespace-nowrap select-none">
          Kéo để xoay ảnh
        </p>

        {/* Badge */}
        <div
          className="absolute z-[45] pointer-events-none"
          style={{
            bottom: "calc(50% - 180px - 16px)",
            left:   "calc(50% - 230px - 16px)",
            animation: "badge-in 0.4s cubic-bezier(0.34,1.56,0.64,1) 500ms both",
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm text-slate-900 rounded-2xl px-4 py-2.5 shadow-md text-xs font-medium border border-white/50 select-none">
            <span className="text-primary font-semibold text-sm">30+</span>
            {" "}sản phẩm chính hãng
          </div>
        </div>
      </div>
    </figure>
  );
}
