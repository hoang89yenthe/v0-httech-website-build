"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 10,    suffix: "+", label: "Năm kinh nghiệm" },
  { value: 1000,  suffix: "+", label: "Dự án hoàn thành" },
  { value: 500,   suffix: "+", label: "Khách hàng tin dùng" },
  { value: 50,    suffix: "+", label: "Thương hiệu đối tác" },
];

const brands = [
  "Siemens", "ABB", "Mitsubishi", "Schneider",
  "Omron", "Delta", "LS Electric", "Phoenix Contact",
];

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime: number;
          const duration = 1800;
          const step = (ts: number) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return (
    <strong ref={ref} className="text-4xl md:text-5xl font-bold text-primary tracking-tight tabular-nums">
      {count}{suffix}
    </strong>
  );
}

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="pt-24 md:pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <header className="text-center mb-16 md:mb-20">
          <h2 id="about-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
            Được tin dùng bởi<br />
            <span className="text-primary">hàng nghìn doanh nghiệp.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            HT TECH phân phối thiết bị điện công nghiệp chính hãng và cung cấp
            giải pháp tự động hóa cho doanh nghiệp sản xuất tại Việt Nam.
          </p>
        </header>

        {/* Stats — dùng dl/dt/dd cho semantic đúng chuẩn */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 mb-20 md:mb-24">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-muted/50 hover:bg-primary/5 transition-colors"
            >
              <dd className="mb-1.5">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>

        {/* Image + Brands */}
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Images */}
          <figure aria-label="Hình ảnh nhà xưởng và tủ điện HT TECH" className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=320&h=420&fit=crop&q=85"
                alt="Xưởng lắp ráp tủ điện công nghiệp HT TECH"
                width={320}
                height={420}
                loading="lazy"
                className="rounded-2xl shadow-lg w-full h-60 md:h-80 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=320&h=420&fit=crop&q=85"
                alt="Kỹ thuật viên lắp đặt tủ điện HT TECH"
                width={320}
                height={420}
                loading="lazy"
                className="rounded-2xl shadow-lg w-full h-60 md:h-80 object-cover mt-8"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl shadow-lg text-sm font-semibold">
              ISO 9001:2015 — Chứng nhận chất lượng
            </div>
          </figure>

          {/* Brands */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-snug">
              Đối tác thương hiệu<br />hàng đầu thế giới.
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
              Phân phối chính hãng và chính ngạch — mỗi thiết bị đều có
              đầy đủ chứng từ nguồn gốc xuất xứ và tem bảo hành nhà sản xuất.
            </p>
            <ul
              className="flex flex-wrap gap-2.5"
              role="list"
              aria-label="Thương hiệu đối tác"
            >
              {brands.map((brand) => (
                <li key={brand}>
                  <span className="inline-block px-4 py-1.5 bg-background border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default">
                    {brand}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
