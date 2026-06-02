import { Settings, Factory, Wrench, GraduationCap, Headphones, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Settings,
    title: "Thiết kế tủ điện",
    description: "Tủ PLC, MDB, ATS, điều khiển động cơ — theo tiêu chuẩn IEC quốc tế.",
  },
  {
    icon: Factory,
    title: "Nâng cấp nhà máy",
    description: "SCADA, IoT công nghiệp, tự động hóa dây chuyền sản xuất hiện đại.",
  },
  {
    icon: Wrench,
    title: "Bảo trì định kỳ",
    description: "Lịch bảo dưỡng chủ động — thiết bị vận hành liên tục, không gián đoạn.",
  },
  {
    icon: GraduationCap,
    title: "Đào tạo kỹ thuật",
    description: "Lập trình PLC, HMI, SCADA — nâng cao năng lực đội ngũ vận hành của bạn.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Kỹ thuật viên sẵn sàng từ xa và tại chỗ — xử lý sự cố trong vài giờ.",
  },
  {
    icon: Zap,
    title: "Tiết kiệm năng lượng",
    description: "Kiểm toán và tối ưu hóa điện năng — giảm chi phí, tăng hiệu suất sản xuất.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Chúng tôi lo<br />
            <span className="text-primary">phần còn lại.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
            Từ thiết kế đến vận hành — HT TECH đồng hành
            suốt toàn bộ vòng đời dự án của bạn.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3 tracking-tight">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Banner — Apple-style: minimal, centered, high contrast */}
        <div className="mt-20 rounded-3xl bg-slate-950 p-10 md:p-16 text-center text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Sẵn sàng tự động hóa<br />nhà máy của bạn?
            </h3>
            <p className="text-white/55 mb-8 text-lg">
              Đội ngũ kỹ sư HT TECH tư vấn miễn phí — phản hồi trong 30 phút.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:19006868"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-950 font-semibold rounded-full hover:bg-white/90 transition-colors text-base"
              >
                Gọi ngay: 1900 6868
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-base"
              >
                Gửi yêu cầu báo giá
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
