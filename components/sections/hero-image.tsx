"use client";

import { useRef, useState, useEffect } from "react";

const MAX_TILT = 6;

const MAIN  = "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=700&h=580&fit=crop&q=90";
const IMG_B = "https://images.unsplash.com/photo-1752614671052-92e18f534db1?w=500&h=400&fit=crop&q=85";
const IMG_C = "https://images.unsplash.com/photo-1780034766312-73825064806c?w=400&h=320&fit=crop&q=85";

export function HeroImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]   = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
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

  return (
    <figure
      aria-hidden="true"
      className="hidden lg:flex items-center justify-center"
      style={{ animation: "hero-img-in 0.5s cubic-bezier(0,0,0.2,1) 100ms both" }}
    >
      {/* Stack root — giữ đủ khoảng cho ảnh phụ nhô ra */}
      <div className="relative w-full max-w-[460px] mt-8">

        {/* ── Ambient glow — pulse nhẹ liên tục ── */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full bg-amber-400/20 blur-3xl pointer-events-none"
          style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
        />

        {/* ── Ảnh C — góc dưới trái, nhỏ nhất, lớp dưới cùng ── */}
        <div
          className="absolute z-[5] pointer-events-none"
          style={{
            bottom: "-28px",
            left: "-48px",
            width: "46%",
            transform: "rotate(11deg)",
          }}
        >
          <div style={{ animation: "hero-float-c 9s ease-in-out 1.6s infinite" }}>
            <div className="relative overflow-hidden rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
              <img
                src={IMG_C}
                alt=""
                draggable={false}
                className="w-full h-full object-cover block"
                style={{ aspectRatio: "4/3" }}
              />
              {/* Subtle tint overlay */}
              <div className="absolute inset-0 bg-slate-900/10 rounded-xl" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl" />
            </div>
          </div>
        </div>

        {/* ── Ảnh B — góc trên phải, trung bình, lớp giữa ── */}
        <div
          className="absolute z-[10] pointer-events-none"
          style={{
            top: "-36px",
            right: "-44px",
            width: "54%",
            transform: "rotate(-9deg)",
          }}
        >
          <div style={{ animation: "hero-float-b 7s ease-in-out 0.7s infinite" }}>
            <div className="relative overflow-hidden rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.38)]">
              <img
                src={IMG_B}
                alt=""
                draggable={false}
                className="w-full h-full object-cover block"
                style={{ aspectRatio: "5/4" }}
              />
              <div className="absolute inset-0 bg-slate-900/8 rounded-2xl" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/25 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* ── Ảnh chính — lớp trước, tilt theo chuột ── */}
        <div
          className="relative z-[20]"
          style={{
            animation: `hero-float 6s ease-in-out ${active ? "paused" : "running"} infinite`,
          }}
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
              {/* Glow parallax layer */}
              <div
                className="absolute inset-4 rounded-2xl bg-amber-500/15 blur-3xl pointer-events-none"
                style={{
                  transform:  `translateX(${-tilt.y * 4}px) translateY(${tilt.x * 4}px)`,
                  transition: `transform ${auxEase}`,
                }}
              />

              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={MAIN}
                  alt="Cánh tay robot tự động trong nhà máy công nghiệp"
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

                {/* Specular highlight theo tilt */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at ${50 + tilt.y * 6}% ${50 - tilt.x * 6}%, rgba(255,255,255,0.09) 0%, transparent 58%)`,
                    transition: `background ${auxEase}`,
                  }}
                />

                {/* Scan light — quét ngang định kỳ khi không hover */}
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  aria-hidden="true"
                >
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
              </div>

              {/* Badge — nổi 3D qua preserve-3d */}
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
  );
}
