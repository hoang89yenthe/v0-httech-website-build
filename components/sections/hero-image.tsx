"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const MAX_TILT = 6;

const IMAGES = [
  {
    key:  "main",
    src:  "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=1200&h=900&fit=crop&q=92",
    thumb: "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=700&h=580&fit=crop&q=90",
    alt:  "Cánh tay robot tự động trong nhà máy công nghiệp",
  },
  {
    key:  "b",
    src:  "https://images.unsplash.com/photo-1752614671052-92e18f534db1?w=1000&h=800&fit=crop&q=90",
    thumb: "https://images.unsplash.com/photo-1752614671052-92e18f534db1?w=500&h=400&fit=crop&q=85",
    alt:  "Robot arm trong nhà máy",
  },
  {
    key:  "c",
    src:  "https://images.unsplash.com/photo-1780034766312-73825064806c?w=1000&h=800&fit=crop&q=90",
    thumb: "https://images.unsplash.com/photo-1780034766312-73825064806c?w=400&h=320&fit=crop&q=85",
    alt:  "Tủ điện công nghiệp",
  },
] as const;

type ImgKey = typeof IMAGES[number]["key"];

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({
  current,
  onClose,
  onPrev,
  onNext,
}: {
  current: (typeof IMAGES)[number];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [phase, setPhase] = useState<"in" | "open" | "out">("in");

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     { handleClose(); }
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setPhase("out");
    setTimeout(onClose, 280);
  };

  const animStyle = (phase: "in" | "open" | "out") =>
    phase === "out"
      ? "lightbox-out 0.28s ease-in both"
      : "lightbox-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both";

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        style={{
          animation: phase === "out"
            ? "backdrop-out 0.28s ease-in both"
            : "backdrop-in 0.25s ease-out both",
        }}
        onClick={handleClose}
      />

      {/* Image container — 3D fly-in */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ animation: animStyle(phase) }}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={current.src}
            alt={current.alt}
            className="max-w-[92vw] max-h-[78vh] object-contain rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
            draggable={false}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Đóng"
            className="absolute -top-3 -right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Caption + navigation */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={onPrev}
            aria-label="Ảnh trước"
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <p className="text-white/70 text-xs text-center max-w-[240px] truncate">
            {current.alt}
          </p>

          <button
            onClick={onNext}
            aria-label="Ảnh tiếp"
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-3">
          {IMAGES.map((img) => (
            <span
              key={img.key}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                img.key === current.key ? "bg-white" : "bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Hero Image Stack ─────────────────────────────────────── */
export function HeroImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt,   setTilt]   = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [lightboxKey, setLightboxKey] = useState<ImgKey | null>(null);
  const raf = useRef<number | null>(null);

  /* Mouse tilt */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r  = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width)  * 2 - 1;
      const ny = ((e.clientY - r.top)  / r.height) * 2 - 1;
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() =>
        setTilt({ x: -ny * MAX_TILT, y: nx * MAX_TILT })
      );
    };
    const onEnter = () => setActive(true);
    const onLeave = () => { setActive(false); setTilt({ x: 0, y: 0 }); };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const ease    = active ? "transform 0.08s linear" : "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)";
  const auxEase = active ? "0.12s linear" : "0.6s ease-out";

  /* Lightbox navigation */
  const currentIdx   = IMAGES.findIndex((i) => i.key === lightboxKey);
  const openLightbox = useCallback((key: ImgKey) => setLightboxKey(key), []);
  const closeLightbox = useCallback(() => setLightboxKey(null), []);
  const prevImage = useCallback(() => {
    setLightboxKey(IMAGES[(currentIdx - 1 + IMAGES.length) % IMAGES.length].key);
  }, [currentIdx]);
  const nextImage = useCallback(() => {
    setLightboxKey(IMAGES[(currentIdx + 1) % IMAGES.length].key);
  }, [currentIdx]);

  return (
    <>
      <figure
        aria-label="Hình ảnh nhà xưởng HT TECH"
        className="flex items-center justify-center lg:justify-end"
        style={{ animation: "hero-img-in 0.5s cubic-bezier(0,0,0.2,1) 100ms both" }}
      >
        {/* ── Mobile: 1 ảnh chính, nhỏ gọn ── */}
        <div className="lg:hidden w-full max-w-[340px] mt-6 mb-2">
          <button
            onClick={() => openLightbox("main")}
            className="relative w-full group cursor-zoom-in"
            aria-label="Xem ảnh lớn"
          >
            <div
              className="absolute inset-6 rounded-xl bg-amber-400/20 blur-2xl pointer-events-none"
              style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
            />
            <div className="relative overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <img
                src={IMAGES[0].thumb}
                alt={IMAGES[0].alt}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                draggable={false}
              />
              {/* Zoom hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <p className="text-center text-white/40 text-[10px] mt-2">
              Nhấn để xem lớn
            </p>
          </button>
        </div>

        {/* ── Desktop: 3-ảnh stack ── */}
        <div className="hidden lg:block relative w-full max-w-[460px] mt-8">

          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full bg-amber-400/20 blur-3xl pointer-events-none"
            style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
          />

          {/* Ảnh C — dưới trái */}
          <div
            className="absolute z-[5]"
            style={{ bottom: "-28px", left: "-48px", width: "46%", transform: "rotate(11deg)" }}
          >
            <div style={{ animation: "hero-float-c 9s ease-in-out 1.6s infinite" }}>
              <button
                onClick={() => openLightbox("c")}
                className="relative w-full group cursor-zoom-in focus:outline-none"
                aria-label={`Xem ảnh: ${IMAGES[2].alt}`}
              >
                <div className="relative overflow-hidden rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-[1.04]">
                  <img src={IMAGES[2].thumb} alt="" draggable={false} className="w-full object-cover block" style={{ aspectRatio: "4/3" }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl" />
                </div>
              </button>
            </div>
          </div>

          {/* Ảnh B — trên phải */}
          <div
            className="absolute z-[10]"
            style={{ top: "-36px", right: "-44px", width: "54%", transform: "rotate(-9deg)" }}
          >
            <div style={{ animation: "hero-float-b 7s ease-in-out 0.7s infinite" }}>
              <button
                onClick={() => openLightbox("b")}
                className="relative w-full group cursor-zoom-in focus:outline-none"
                aria-label={`Xem ảnh: ${IMAGES[1].alt}`}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.38)] transition-transform duration-200 group-hover:scale-[1.04]">
                  <img src={IMAGES[1].thumb} alt="" draggable={false} className="w-full object-cover block" style={{ aspectRatio: "5/4" }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/25 rounded-2xl" />
                </div>
              </button>
            </div>
          </div>

          {/* Ảnh chính — front */}
          <div
            className="relative z-[20]"
            style={{ animation: `hero-float 6s ease-in-out ${active ? "paused" : "running"} infinite` }}
          >
            <div ref={containerRef} style={{ perspective: "900px" }}>
              <div
                style={{
                  transform:      `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition:     ease,
                  transformStyle: "preserve-3d",
                  willChange:     "transform",
                }}
              >
                {/* Glow parallax */}
                <div
                  className="absolute inset-4 rounded-2xl bg-amber-500/15 blur-3xl pointer-events-none"
                  style={{
                    transform:  `translateX(${-tilt.y * 4}px) translateY(${tilt.x * 4}px)`,
                    transition: `transform ${auxEase}`,
                  }}
                />

                {/* Main image — clickable */}
                <button
                  onClick={() => openLightbox("main")}
                  className="relative w-full group cursor-zoom-in focus:outline-none"
                  aria-label={`Xem ảnh lớn: ${IMAGES[0].alt}`}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={IMAGES[0].thumb}
                      alt={IMAGES[0].alt}
                      width={700}
                      height={580}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className="w-full h-auto block select-none"
                      style={{
                        boxShadow:  `${tilt.y * 2}px ${-tilt.x * 2 + 24}px 52px rgba(0,0,0,${active ? 0.55 : 0.48})`,
                        transition: `box-shadow ${auxEase}`,
                      }}
                    />

                    {/* Specular highlight */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at ${50 + tilt.y * 6}% ${50 - tilt.x * 6}%, rgba(255,255,255,0.09) 0%, transparent 58%)`,
                        transition: `background ${auxEase}`,
                      }}
                    />

                    {/* Scan light ambient */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                      <div
                        className="absolute inset-y-0 w-[35%]"
                        style={{
                          background:           "linear-gradient(105deg, transparent, rgba(255,255,255,0.07) 50%, transparent)",
                          animationName:        "img-scan",
                          animationDuration:    "5s",
                          animationDelay:       "2s",
                          animationTimingFunction: "ease-in-out",
                          animationIterationCount: "infinite",
                          animationPlayState:   active ? "paused" : "running",
                        }}
                      />
                    </div>

                    {/* Zoom hint on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Badge */}
                <div
                  className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm text-slate-900 rounded-2xl px-4 py-2.5 shadow-md text-xs font-medium border border-white/50 select-none pointer-events-none"
                  style={{
                    animation: "badge-in 0.4s cubic-bezier(0.34,1.56,0.64,1) 400ms both",
                    transform: "translateZ(28px)",
                  }}
                >
                  <span className="text-primary font-semibold text-sm">30+</span>
                  {" "}sản phẩm chính hãng
                </div>
              </div>
            </div>
          </div>

        </div>
      </figure>

      {/* ── Lightbox ── */}
      {lightboxKey && (
        <Lightbox
          current={IMAGES[currentIdx]}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}
