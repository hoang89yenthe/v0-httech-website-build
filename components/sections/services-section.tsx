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
    delay: "60ms",
  },
  {
    icon: Wrench,
    title: "Bảo trì định kỳ",
    description: "Lịch bảo dưỡng chủ động — thiết bị vận hành liên tục, không gián đoạn.",
    delay: "120ms",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Kỹ thuật viên sẵn sàng từ xa và tại chỗ — xử lý sự cố trong vài giờ.",
    delay: "180ms",
  },
];

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-heading" className="py-20 md:py-28">
      <div className="container mx-auto px-4">

        <header className="text-center mb-12 md:mb-16">
          <h2 id="services-heading" className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Dịch Vụ Kỹ Thuật<br />
            <span className="text-primary">Toàn Diện.</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Từ thiết kế, thi công đến bảo trì và đào tạo —
            HT TECH đồng hành cùng doanh nghiệp của bạn.
          </p>
        </header>

        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          role="list"
          aria-label="Dịch vụ của HT TECH"
        >
          {services.map((service) => (
            <li key={service.title}>
              <article
                className="glow-card group rounded-2xl bg-card border border-border/60 h-full p-6 hover:border-primary/25 transition-all duration-200"
                style={{ transitionDelay: service.delay }}
              >
                <div
                  className="w-11 h-11 bg-primary/8 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-200 group-hover:animate-float"
                  aria-hidden="true"
                >
                  <service.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-200" />
                </div>

                <h3 className="text-sm font-semibold mb-2 tracking-tight group-hover:text-primary transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </article>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
