const brands = [
  "Siemens", "ABB", "Mitsubishi", "Schneider",
  "Omron", "Delta", "LS Electric", "Phoenix Contact",
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
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

        <div className="text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Đối tác thương hiệu chính hãng
          </p>
          <ul
            className="flex flex-wrap gap-2.5 justify-center"
            role="list"
            aria-label="Thương hiệu đối tác"
          >
            {brands.map((brand) => (
              <li key={brand}>
                <span className="inline-block px-5 py-2 bg-background border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default">
                  {brand}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-4 py-2 rounded-full">
              ISO 9001:2015 — Chứng nhận hệ thống quản lý chất lượng
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
