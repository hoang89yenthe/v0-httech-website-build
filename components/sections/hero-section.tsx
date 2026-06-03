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
            <div className="inline-flex items-center gap-2 mb-6 self-start">
              <span className="w-6 h-px bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                Nhà phân phối chính hãng
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.04] mb-6">
              Thiết Bị Điện<br />
              Công Nghiệp<br />
              <span className="text-shimmer">Chính Hãng.</span>
            </h1>

            <p className="text-base md:text-lg text-white/65 mb-10 max-w-[420px] leading-relaxed">
              Biến tần, PLC, HMI, cảm biến từ{" "}
              <strong className="text-white/85 font-medium">
                Siemens, ABB, Mitsubishi, Schneider.
              </strong>{" "}
              Tư vấn miễn phí — giao hàng toàn quốc.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all shadow-lg shadow-primary/25"
              >
                Khám phá sản phẩm
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white border-b border-white/25 hover:border-white/60 pb-px text-sm font-medium transition-all"
              >
                Nhận báo giá
              </Link>
            </div>

            {/* Trust badges */}
            <ul className="flex flex-wrap gap-5" role="list" aria-label="Cam kết dịch vụ">
              {trustBadges.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-white/50 text-xs">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Image column */}
          <figure
            aria-hidden="true"
            className="hidden lg:flex items-center justify-end"
          >
            <div className="relative w-full max-w-[540px]">
              {/* Glow halo phía sau ảnh — cam amber match ánh lửa hàn */}
              <div className="absolute inset-4 rounded-2xl bg-amber-500/20 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=700&h=580&fit=crop&q=90"
                alt="Cánh tay robot tự động trong nhà máy công nghiệp"
                width={700}
                height={580}
                loading="eager"
                decoding="async"
                className="relative rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] w-full h-auto block"
              />
              {/* Badge nổi */}
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 rounded-2xl px-4 py-2.5 shadow-xl text-xs font-semibold">
                <span className="text-primary font-bold text-sm">30+</span>
                {" "}sản phẩm chính hãng
              </div>
            </div>
          </figure>

        </div>
      </div>
    </section>
  );
}
