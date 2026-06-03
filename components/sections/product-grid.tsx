"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, tagLabels, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/utils";

const categories = [
  { value: "all",      label: "Tất cả" },
  { value: "bien-tan", label: "Biến tần" },
  { value: "plc-hmi",  label: "PLC & HMI" },
  { value: "dong-cat", label: "Thiết bị đóng cắt" },
  { value: "cam-bien", label: "Cảm biến" },
  { value: "vat-tu",   label: "Vật tư tủ điện" },
];

const CARD_WIDTH = 300; // px
const GAP = 16;         // px

interface ProductGridProps {
  products: Product[];
  initialCategory?: string;
  isPage?: boolean;
}

export function ProductGrid({ products, initialCategory, isPage = false }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(
    initialCategory && initialCategory !== "" ? initialCategory : "all"
  );
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();
  const pathname  = usePathname();

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  /* ── Scroll helpers ────────────────────────────────────────── */
  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = (CARD_WIDTH + GAP) * 2;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  // Reset scroll + arrows khi đổi category
  const handleCategoryChange = (value: string) => {
    if (value === activeCategory) return;
    setActiveCategory(value);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    setCanLeft(false);
    setCanRight(true);
    if (isPage) {
      const url = value === "all" ? pathname : `${pathname}?category=${value}`;
      router.replace(url, { scroll: false });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateArrows); ro.disconnect(); };
  }, [updateArrows, filteredProducts]);

  return (
    <section
      id="products"
      aria-labelledby={!isPage ? "products-heading" : undefined}
      className={isPage ? "py-10 md:py-14" : "pt-14 md:pt-20 pb-16 md:pb-24"}
    >
      <div className="container mx-auto px-4">

        {/* Section heading — homepage only */}
        {!isPage && (
          <header className="text-center mb-12">
            <h2
              id="products-heading"
              className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
            >
              Sản Phẩm<br />
              <span className="text-primary">Chính Hãng.</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Nhập khẩu chính ngạch từ Siemens, ABB, Mitsubishi, Schneider,
              Omron, Delta — đầy đủ chứng từ, bảo hành nhà sản xuất.
            </p>
          </header>
        )}

        {/* Category filter tabs */}
        <div
          role="tablist"
          aria-label="Lọc theo danh mục"
          className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted/80 border border-border/60 text-foreground/70 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground" role="status" aria-live="polite">
            <p className="font-medium mb-2">Không tìm thấy sản phẩm nào.</p>
            <button onClick={() => handleCategoryChange("all")} className="text-primary text-sm hover:underline">
              Xem tất cả sản phẩm
            </button>
          </div>
        )}

        {/* ── Carousel ──────────────────────────────────────── */}
        <div className="relative">

          {/* Left arrow */}
          <button
            onClick={() => scrollBy("left")}
            aria-label="Cuộn trái"
            className={`
              absolute -left-5 top-1/2 -translate-y-1/2 z-20
              w-11 h-11 rounded-full bg-background border border-border/60
              flex items-center justify-center shadow-md
              hover:shadow-lg hover:scale-105 active:scale-95
              transition-all duration-200
              ${canLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronLeft className="w-5 h-5 text-foreground/80" />
          </button>

          {/* Fade left */}
          <div
            aria-hidden="true"
            className={`absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canLeft ? "opacity-100" : "opacity-0"}`}
          />

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-4 -mb-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                href={`/san-pham/${product.slug.current}`}
                aria-label={`${product.title} — ${formatPrice(product.price)}`}
                className={`
                  group flex-none flex flex-col bg-muted/50 rounded-3xl overflow-hidden
                  w-[78vw] sm:w-[300px] md:w-[300px] lg:w-[${CARD_WIDTH}px]
                  transition-all duration-200 ease-out
                  hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.13)]
                  cursor-pointer
                `}
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Header: brand + name */}
                <div className="px-5 pt-5 pb-0">
                  {product.brand && (
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.06em] mb-1.5">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="text-[15px] font-semibold leading-snug tracking-tight line-clamp-2 min-h-[2.5rem]">
                    {product.title}
                  </h3>
                </div>

                {/* Image */}
                <div className="relative mx-5 my-4">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-background/70">
                    <img
                      src={getProductImageUrl(product)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.07]"
                    />
                    {/* Tag */}
                    {product.tag && (
                      <span className={`absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${getTagClass(product.tag)}`}>
                        {tagLabels[product.tag]}
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="absolute top-2.5 right-2.5 bg-black/55 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Hết hàng
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: giá + CTA */}
                <div className="px-5 pb-5 mt-auto">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      {product.price ? (
                        <>
                          <p className="text-[10px] text-muted-foreground mb-0.5">Từ</p>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {formatPrice(product.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold">Liên hệ</p>
                      )}
                      {product.price && product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-[10px] text-muted-foreground line-through mt-0.5">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-medium group-hover:opacity-85 transition-opacity duration-200">
                      Xem ngay
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Fade right */}
          <div
            aria-hidden="true"
            className={`absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canRight ? "opacity-100" : "opacity-0"}`}
          />

          {/* Right arrow */}
          <button
            onClick={() => scrollBy("right")}
            aria-label="Cuộn phải"
            className={`
              absolute -right-5 top-1/2 -translate-y-1/2 z-20
              w-11 h-11 rounded-full bg-background border border-border/60
              flex items-center justify-center shadow-md
              hover:shadow-lg hover:scale-105 active:scale-95
              transition-all duration-200
              ${canRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronRight className="w-5 h-5 text-foreground/80" />
          </button>
        </div>

        {/* View all link — homepage */}
        {!isPage && (
          <p className="text-center mt-10">
            <Link
              href="/san-pham"
              className="text-primary hover:underline font-medium text-sm"
              aria-label={`Xem tất cả ${products.length} sản phẩm`}
            >
              Xem tất cả {products.length} sản phẩm &rarr;
            </Link>
          </p>
        )}

      </div>
    </section>
  );
}
