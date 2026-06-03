"use client";

import { useRef, useState, useEffect } from "react";

const MAX_TILT = 6; // degrees

export function HeroImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      // Normalize mouse to -1..1 within the container
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;

      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setTilt({
          x: -ny * MAX_TILT, // mouse down  → bottom forward (rotateX negative)
          y:  nx * MAX_TILT, // mouse right → right forward  (rotateY positive)
        });
      });
    };

    const onEnter = () => setActive(true);
    const onLeave = () => {
      setActive(false);
      setTilt({ x: 0, y: 0 });
    };

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

  // Snappy khi hover, smooth khi nhả chuột
  const tiltTransition = active
    ? "transform 0.08s linear"
    : "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)";

  const auxTransition = active
    ? "0.12s linear"
    : "0.6s ease-out";

  return (
    <figure
      aria-hidden="true"
      className="hidden lg:flex items-center justify-end"
      style={{ animation: "hero-img-in 0.5s cubic-bezier(0,0,0.2,1) 100ms both" }}
    >
      {/* Float — tạm dừng khi đang tilt để không xung đột */}
      <div
        className="relative w-full max-w-[520px]"
        style={{
          animation: `hero-float 6s ease-in-out ${active ? "paused" : "running"} infinite`,
        }}
      >
        {/* Perspective container + mouse tracking */}
        <div ref={containerRef} style={{ perspective: "900px" }}>

          {/* Tilt surface */}
          <div
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: tiltTransition,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* Glow — di chuyển ngược chiều tilt = hiệu ứng parallax lớp sau */}
            <div
              className="absolute inset-4 rounded-3xl bg-amber-500/20 blur-3xl pointer-events-none"
              style={{
                transform: `translateX(${-tilt.y * 4}px) translateY(${tilt.x * 4}px)`,
                transition: `transform ${auxTransition}`,
              }}
            />

            {/* Ảnh chính */}
            <img
              src="https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=700&h=580&fit=crop&q=90"
              alt="Cánh tay robot tự động trong nhà máy công nghiệp"
              width={700}
              height={580}
              loading="eager"
              decoding="async"
              draggable={false}
              className="relative rounded-2xl w-full h-auto block select-none"
              style={{
                // Shadow dịch chuyển theo góc tilt — tạo cảm giác ánh sáng thật
                boxShadow: `
                  ${tilt.y * 2}px ${-tilt.x * 2 + 22}px 48px rgba(0,0,0,${active ? 0.55 : 0.45}),
                  0 0 0 1px rgba(255,255,255,0.06) inset
                `,
                transition: `box-shadow ${auxTransition}`,
              }}
            />

            {/* Specular highlight — ánh sáng phản chiếu di chuyển với góc tilt */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              style={{
                background: `radial-gradient(
                  ellipse at ${50 + tilt.y * 6}% ${50 - tilt.x * 6}%,
                  rgba(255,255,255,0.10) 0%,
                  transparent 60%
                )`,
                transition: `background ${auxTransition}`,
              }}
            />

            {/* Badge — translateZ tạo chiều sâu 3D tự nhiên qua perspective */}
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
    </figure>
  );
}
