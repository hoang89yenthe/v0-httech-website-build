const brands = [
  "Siemens", "ABB", "Mitsubishi", "Schneider",
  "Omron", "Delta", "LS Electric", "Phoenix Contact",
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2
            id="about-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight"
          >
            Được tin dùng bởi<br />
            <span className="text-primary">hàng nghìn doanh nghiệp.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            HT TECH phân phối thiết bị điện công nghiệp chính hãng và cung cấp
            giải pháp tự động hóa cho doanh nghiệp sản xuất tại Việt Nam.
            Mỗi thiết bị đều có đầy đủ chứng từ nguồn gốc xuất xứ và tem bảo hành nhà sản xuất.
          </p>
        </div>
      </div>

      {/* Brand marquee — full-width, tràn ra ngoài container */}
      <div aria-label="Thương hiệu đối tác" className="relative">
        {/* Fade gradient hai bên */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <ul
            className="animate-marquee flex shrink-0 gap-4 pr-4"
            role="list"
            aria-hidden="true"
          >
            {brands.map((brand) => (
              <li key={brand} className="shrink-0">
                <span className="inline-block px-6 py-2.5 bg-background border border-border rounded-full text-sm font-medium whitespace-nowrap">
                  {brand}
                </span>
              </li>
            ))}
          </ul>
          {/* Duplicate for seamless loop */}
          <ul className="animate-marquee flex shrink-0 gap-4 pr-4" role="list" aria-hidden="true">
            {brands.map((brand) => (
              <li key={brand} className="shrink-0">
                <span className="inline-block px-6 py-2.5 bg-background border border-border rounded-full text-sm font-medium whitespace-nowrap">
                  {brand}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <p className="mt-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-4 py-2 rounded-full">
            ISO 9001:2015 — Chứng nhận hệ thống quản lý chất lượng
          </span>
        </p>
      </div>
    </section>
  );
}
