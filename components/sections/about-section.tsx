import { Award, Users, Building, Clock } from "lucide-react";

const stats = [
  { icon: Clock, value: "10+", label: "Năm kinh nghiệm" },
  { icon: Users, value: "1000+", label: "Khách hàng tin tưởng" },
  { icon: Building, value: "500+", label: "Dự án hoàn thành" },
  { icon: Award, value: "50+", label: "Đối tác thương hiệu" },
];

const brands = [
  "Siemens",
  "ABB",
  "Mitsubishi",
  "Schneider",
  "Omron",
  "Delta",
  "LS Electric",
  "Phoenix Contact",
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Về <span className="text-primary">HTtech</span>
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              <strong className="text-foreground">HTtech</strong> là đơn vị chuyên cung cấp thiết bị điện công nghiệp 
              và giải pháp tự động hóa hàng đầu tại Việt Nam. Với hơn 10 năm kinh nghiệm trong ngành, 
              chúng tôi tự hào là đối tác tin cậy của hàng ngàn doanh nghiệp sản xuất.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Chúng tôi cung cấp đầy đủ các dòng sản phẩm từ biến tần, PLC, HMI, thiết bị đóng cắt 
              đến vật tư tủ điện từ các thương hiệu hàng đầu thế giới. Đội ngũ kỹ sư giàu kinh nghiệm 
              của HTtech sẵn sàng tư vấn và triển khai giải pháp tự động hóa toàn diện cho doanh nghiệp.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-muted rounded-xl"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Brands */}
            <div>
              <p className="text-sm font-medium mb-3">Đối tác thương hiệu:</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <span
                    key={brand}
                    className="px-3 py-1 bg-background border rounded-full text-sm"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=400&fit=crop"
                alt="Kho hàng HTtech"
                className="rounded-xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=400&fit=crop"
                alt="Đội ngũ kỹ thuật HTtech"
                className="rounded-xl shadow-lg mt-8"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">ISO 9001:2015</div>
                <div className="text-sm opacity-90">Chứng nhận chất lượng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
