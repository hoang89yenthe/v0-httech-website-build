import { Settings, Factory, Wrench, GraduationCap, Headphones, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Settings,
    title: "Thiết kế tủ điện",
    description:
      "Thiết kế và thi công tủ điện công nghiệp: Tủ PLC, tủ MDB, tủ ATS, tủ điều khiển động cơ theo tiêu chuẩn IEC.",
  },
  {
    icon: Factory,
    title: "Nâng cấp hệ thống",
    description:
      "Tư vấn và triển khai nâng cấp hệ thống điều khiển, SCADA, giám sát IoT cho dây chuyền sản xuất.",
  },
  {
    icon: Wrench,
    title: "Bảo trì định kỳ",
    description:
      "Dịch vụ bảo trì, bảo dưỡng thiết bị định kỳ, đảm bảo hệ thống vận hành ổn định và hiệu quả.",
  },
  {
    icon: GraduationCap,
    title: "Đào tạo kỹ thuật",
    description:
      "Đào tạo vận hành, lập trình PLC, HMI, SCADA cho đội ngũ kỹ thuật viên của doanh nghiệp.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description:
      "Đội ngũ kỹ thuật viên sẵn sàng hỗ trợ từ xa và tại chỗ, xử lý sự cố nhanh chóng.",
  },
  {
    icon: Zap,
    title: "Giải pháp tiết kiệm năng lượng",
    description:
      "Tư vấn và triển khai giải pháp tiết kiệm điện năng cho nhà máy, xí nghiệp sản xuất.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dịch Vụ <span className="text-primary">Kỹ Thuật</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            HTtech cung cấp giải pháp tự động hóa và dịch vụ kỹ thuật toàn diện, 
            đáp ứng mọi nhu cầu của doanh nghiệp sản xuất.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-primary-foreground">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Bạn cần tư vấn giải pháp tự động hóa?
              </h3>
              <p className="text-primary-foreground/80 mb-6">
                Đội ngũ kỹ sư giàu kinh nghiệm của HTtech sẵn sàng hỗ trợ bạn 24/7. 
                Liên hệ ngay để được tư vấn miễn phí!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:19006868"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                >
                  Gọi ngay: 1900 6868
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Gửi yêu cầu báo giá
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop"
                alt="Dịch vụ kỹ thuật"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
