import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";

const trustBadges = [
  { icon: ShieldCheck, text: "Chính hãng 100%" },
  { icon: Truck,       text: "Giao toàn quốc" },
  { icon: Headphones,  text: "Hỗ trợ 24/7" },
];

export function HeroSection() {
  return (
    <section
      aria-label="Giới thiệu HT TECH"
      className="relative min-h-[92vh] flex items-center bg-slate-950 text-white overflow-hidden"
    >
      {/* ── Aurora orbs ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Orb chính — xanh lam */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.22 255) 0%, transparent 70%)",
            animation: "orb-1 12s ease-in-out infinite",
          }}
        />
        {/* Orb phụ — tím */}
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.22 290) 0%, transparent 70%)",
            animation: "orb-2 16s ease-in-out infinite",
          }}
        />
        {/* Orb nhấn — cam nhạt */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, oklch(0.70 0.18 200) 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-28 lg:py-0 min-h-[92vh] lg:min-h-0 lg:h-[92vh]">

          {/* Text column */}
          <div className="flex flex-col justify-center">
            {/* Label */}
            <div
              className="inline-flex items-center gap-2 mb-5 self-start"
              style={{ animation: "hero-in 0.3s cubic-bezier(0,0,0.2,1) 0ms both" }}
            >
              <span className="w-5 h-px bg-primary" />
              <span className="text-[11px] font-medium text-primary uppercase tracking-[0.08em]">
                Nhà phân phối chính hãng
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold mb-5"
              style={{ animation: "hero-in 0.4s cubic-bezier(0,0,0.2,1) 80ms both" }}
            >
              Thiết Bị Điện<br />
              Công Nghiệp<br />
              <span className="text-shimmer">Chính Hãng.</span>
            </h1>

            <p
              className="text-base text-white/65 mb-8 max-w-[400px]"
              style={{ animation: "hero-in 0.35s cubic-bezier(0,0,0.2,1) 160ms both" }}
            >
              Biến tần, PLC, HMI, cảm biến từ{" "}
              <strong className="text-white/85 font-medium">
                Siemens, ABB, Mitsubishi, Schneider.
              </strong>{" "}
              Tư vấn miễn phí — giao hàng toàn quốc.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center gap-3 mb-8"
              style={{ animation: "hero-in 0.3s cubic-bezier(0,0,0.2,1) 240ms both" }}
            >
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-85 active:scale-[0.97] transition-all duration-200 shadow-md shadow-primary/20"
              >
                Khám phá sản phẩm
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-medium transition-colors duration-200"
              >
                Nhận báo giá →
              </Link>
            </div>

            {/* Trust badges */}
            <ul
              className="flex flex-wrap gap-4"
              role="list"
              aria-label="Cam kết dịch vụ"
              style={{ animation: "hero-in 0.3s cubic-bezier(0,0,0.2,1) 320ms both" }}
            >
              {trustBadges.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-white/45 text-xs">
                  <Icon className="w-3.5 h-3.5 text-primary/70 shrink-0" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Image column */}
          <figure
            aria-hidden="true"
            className="hidden lg:flex items-center justify-end"
            style={{ animation: "hero-img-in 0.5s cubic-bezier(0,0,0.2,1) 100ms both" }}
          >
            <div className="relative w-full max-w-[520px]">
              <div className="absolute inset-6 rounded-2xl bg-amber-500/15 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=700&h=580&fit=crop&q=90"
                alt="Cánh tay robot tự động trong nhà máy công nghiệp"
                width={700}
                height={580}
                loading="eager"
                decoding="async"
                className="relative rounded-2xl shadow-[0_20px_48px_rgba(0,0,0,0.45)] w-full h-auto block"
              />
              {/* Badge nổi */}
              <div
                className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm text-slate-900 rounded-2xl px-4 py-2.5 shadow-md text-xs font-medium border border-white/50"
                style={{ animation: "badge-in 0.4s cubic-bezier(0.34,1.56,0.64,1) 400ms both" }}
              >
                <span className="text-primary font-semibold text-sm">30+</span>
                {" "}sản phẩm chính hãng
              </div>
            </div>
          </figure>

        </div>
      </div>
    </section>
  );
}
