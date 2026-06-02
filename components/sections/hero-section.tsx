import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-32 lg:py-0 min-h-screen lg:min-h-0 lg:h-screen">

          {/* Text */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-8">
              Thiết Bị Điện<br />
              <span className="text-primary">Công Nghiệp<br />Chính Hãng.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/55 mb-12 max-w-md leading-relaxed font-light">
              Biến tần, PLC, HMI, cảm biến từ Siemens, ABB, Mitsubishi,
              Schneider. Tư vấn miễn phí — giao hàng toàn quốc.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold" asChild>
                <Link href="/san-pham">
                  Khám phá sản phẩm
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Link
                href="/#contact"
                className="text-white/60 hover:text-white transition-colors duration-200 text-base font-medium border-b border-white/25 hover:border-white pb-0.5"
              >
                Nhận báo giá
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:flex items-center justify-end">
            <div className="rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] w-full max-w-[560px]">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&h=580&fit=crop&q=90"
                alt="Tự động hóa công nghiệp HT TECH"
                loading="eager"
                className="w-full h-auto block"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
