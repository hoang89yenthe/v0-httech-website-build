import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
              Đối tác tin cậy trong ngành công nghiệp
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance">
              Giải Pháp <span className="text-primary">Tự Động Hóa</span> & 
              Kỹ Thuật Công Nghiệp Toàn Diện
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
              HTtech cung cấp thiết bị điện công nghiệp chính hãng từ các thương hiệu hàng đầu: 
              Siemens, ABB, Mitsubishi, Schneider. Dịch vụ tư vấn, thiết kế và thi công tủ điện chuyên nghiệp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2" asChild>
                <Link href="#contact">
                  Nhận Báo Giá
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="#products">
                  Xem Sản Phẩm
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-slate-400">Năm kinh nghiệm</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-slate-400">Dự án hoàn thành</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-slate-400">Đối tác thương hiệu</div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=500&fit=crop"
                alt="Tự động hóa công nghiệp"
                className="w-full h-auto"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-xl shadow-xl z-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Hotline 24/7</div>
                  <div className="font-bold text-lg">1900 6868</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
