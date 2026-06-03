import { Settings, Factory, Wrench, Headphones } from "lucide-react";

const services = [
  {
    icon: Settings,
    title: "Thiết kế tủ điện",
    description: "Tủ PLC, MDB, ATS, điều khiển động cơ — theo tiêu chuẩn IEC quốc tế.",
    delay: "0ms",
  },
  {
    icon: Factory,
    title: "Nâng cấp nhà máy",
    description: "SCADA, IoT công nghiệp, tự động hóa dây chuyền sản xuất hiện đại.",
    delay: "80ms",
  },
  {
    icon: Wrench,
    title: "Bảo trì định kỳ",
    description: "Lịch bảo dưỡng chủ động — thiết bị vận hành liên tục, không gián đoạn.",
    delay: "160ms",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Kỹ thuật viên sẵn sàng từ xa và tại chỗ — xử lý sự cố trong vài giờ.",
    delay: "240ms",
  },
];

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-heading" className="py-24 md:py-32">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <header className="text-center mb-14 md:mb-18">
          <h2 id="services-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
            Dịch Vụ Kỹ Thuật<br />
            <span className="text-primary">Toàn Diện.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Từ thiết kế, thi công đến bảo trì và đào tạo —
            HT TECH đồng hành cùng doanh nghiệp của bạn.
          </p>
        </header>

        {/* Bento glow grid */}
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          role="list"
          aria-label="Dịch vụ của HT TECH"
        >
          {services.map((service) => (
            <li key={service.title}>
              {/* glow-card từ globals.css — conic-gradient border on hover */}
              <article
                className="glow-card group rounded-2xl bg-card border border-border h-full p-7 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: service.delay }}
              >
                {/* Icon — float animation on hover */}
                <div
                  className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:animate-float"
                  aria-hidden="true"
                >
                  <service.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-base font-semibold mb-2.5 tracking-tight group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </article>
            </li>
          ))}
        </ul>

        {/* CTA Banner */}
        <aside
          aria-label="Liên hệ tư vấn kỹ thuật"
          className="mt-16 rounded-3xl bg-slate-950 p-10 md:p-14 text-center text-white overflow-hidden relative"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative z-10 max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Cần tư vấn giải pháp tự động hóa?
            </h3>
            <p className="text-white/55 mb-8 text-base">
              Đội ngũ kỹ sư HT TECH hỗ trợ miễn phí — phản hồi trong 30 phút.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:0972916382"
                className="inline-flex items-center justify-center px-7 py-3 bg-white text-slate-950 font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
              >
                Gọi ngay: 0972 916 382
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-7 py-3 border border-white/25 text-white font-semibold rounded-full hover:bg-white/8 transition-colors text-sm"
              >
                Gửi yêu cầu báo giá
              </a>
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
