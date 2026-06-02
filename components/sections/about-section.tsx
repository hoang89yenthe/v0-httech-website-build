const stats = [
  { value: "10+", label: "Năm kinh nghiệm" },
  { value: "1.000+", label: "Dự án hoàn thành" },
  { value: "500+", label: "Khách hàng tin dùng" },
  { value: "50+", label: "Thương hiệu đối tác" },
];

const brands = [
  "Siemens", "ABB", "Mitsubishi", "Schneider",
  "Omron", "Delta", "LS Electric", "Phoenix Contact",
];

export function AboutSection() {
  return (
    <section id="about" className="pt-24 md:pt-32 pb-20 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Được tin dùng bởi<br />
            <span className="text-primary">hàng nghìn doanh nghiệp.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            HT TECH phân phối thiết bị điện công nghiệp chính hãng và cung cấp
            giải pháp tự động hóa cho doanh nghiệp sản xuất tại Việt Nam.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-24 md:mb-28">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-muted/50">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Image + Brands */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=320&h=420&fit=crop&q=85"
                alt="Xưởng sản xuất HT TECH"
                className="rounded-2xl shadow-lg w-full h-60 md:h-80 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=320&h=420&fit=crop&q=85"
                alt="Tủ điện công nghiệp HT TECH"
                className="rounded-2xl shadow-lg w-full h-60 md:h-80 object-cover mt-8"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="text-lg font-bold">ISO 9001:2015</div>
                <div className="text-xs opacity-80">Chứng nhận chất lượng</div>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Đối tác thương hiệu<br />hàng đầu thế giới.
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Phân phối chính hãng và chính ngạch — mỗi thiết bị đều có
              đầy đủ chứng từ nguồn gốc xuất xứ và tem bảo hành nhà sản xuất.
            </p>
            <div className="flex flex-wrap gap-3">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="px-4 py-2 bg-background border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors duration-200 cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
