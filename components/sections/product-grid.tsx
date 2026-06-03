"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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

  /* ── Scroll logic ──────────────────────────────────────────── */
  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll chính xác 1 card mỗi lần (như Apple)
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 20 : 380;
    el.scrollBy({ left: dir === "right" ? cardW : -cardW, behavior: "smooth" });
  };

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
      className={`bg-muted/40 ${isPage ? "py-10 md:py-14" : "pt-14 md:pt-20 pb-16 md:pb-24"}`}
    >
      <div className="container mx-auto px-4">

        {/* Section heading */}
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

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Lọc theo danh mục"
          className="flex gap-2 mb-10 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 hover:bg-muted text-foreground/70 hover:text-foreground"
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

          {/* Left arrow — Apple style: tròn, nổi trên card */}
          <button
            onClick={() => scrollByCards("left")}
            aria-label="Cuộn trái"
            className={`
              absolute -left-4 top-1/2 -translate-y-8 z-20
              w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm
              border border-border/50 shadow-lg
              flex items-center justify-center
              hover:shadow-xl hover:scale-105 active:scale-95
              transition-all duration-200
              ${canLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Gradient trái */}
          <div
            aria-hidden="true"
            className={`absolute left-0 top-0 bottom-4 w-16 z-10 pointer-events-none
              bg-gradient-to-r from-background to-transparent
              transition-opacity duration-200 ${canLeft ? "opacity-100" : "opacity-0"}`}
          />

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-none pb-6"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
            }}
          >
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                data-card
                href={`/san-pham/${product.slug.current}`}
                aria-label={product.title}
                draggable={false}
                className="
                  group shrink-0 flex flex-col
                  w-[87vw] sm:w-[320px] md:w-[320px] lg:w-[320px]
                  bg-card shadow-[0_2px_8px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden
                  transition-all duration-200 ease-out
                  hover:-translate-y-2
                  hover:shadow-[0_24px_64px_rgba(0,0,0,0.13)]
                  select-none
                "
                style={{ scrollSnapAlign: "start" }}
              >
                {/* ── Header: brand + tên (Apple: tên to, nằm trên) ── */}
                <div className="px-8 pt-8 pb-0">
                  {product.brand && (
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="text-[21px] font-semibold leading-snug tracking-tight line-clamp-2 min-h-[3.2rem]">
                    {product.title}
                  </h3>
                </div>

                {/* ── Ảnh — lớn, chiếm phần giữa card ── */}
                <div className="relative flex-1 px-7 pt-5 pb-0">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/60">
                    <Image
                      src={getProductImageUrl(product)}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 640px) 87vw, 320px"
                      loading="lazy"
                      draggable={false}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                    />
                  </div>
                  {/* Tag badge */}
                  {product.tag && (
                    <span className={`absolute top-7 left-10 text-[10px] font-semibold px-2.5 py-1 rounded-full ${getTagClass(product.tag)}`}>
                      {tagLabels[product.tag]}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="absolute top-7 right-10 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm">
                      Hết hàng
                    </span>
                  )}
                </div>

                {/* ── Footer: giá trái, nút phải (y hệt Apple) ── */}
                <div className="px-8 py-7">
                  <div className="flex items-end justify-between gap-3">
                    {/* Giá */}
                    <div className="min-w-0">
                      {product.price ? (
                        <>
                          <p className="text-xs text-muted-foreground mb-1">Từ</p>
                          <p className="text-base font-semibold text-foreground truncate">
                            {formatPrice(product.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-base font-semibold">Liên hệ</p>
                      )}
                      {product.price && product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-muted-foreground line-through mt-0.5">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>

                    {/* Nút CTA — pill xanh như Apple */}
                    <span className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-medium group-hover:opacity-85 transition-opacity duration-200">
                      Mua
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Gradient phải */}
          <div
            aria-hidden="true"
            className={`absolute right-0 top-0 bottom-4 w-20 z-10 pointer-events-none
              bg-gradient-to-l from-background to-transparent
              transition-opacity duration-200 ${canRight ? "opacity-100" : "opacity-0"}`}
          />

          {/* Right arrow */}
          <button
            onClick={() => scrollByCards("right")}
            aria-label="Cuộn phải"
            className={`
              absolute -right-4 top-1/2 -translate-y-8 z-20
              w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm
              border border-border/50 shadow-lg
              flex items-center justify-center
              hover:shadow-xl hover:scale-105 active:scale-95
              transition-all duration-200
              ${canRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* View all */}
        {!isPage && (
          <p className="text-center mt-8">
            <Link
              href="/san-pham"
              className="text-primary hover:underline font-medium text-sm"
            >
              Xem tất cả {products.length} sản phẩm &rarr;
            </Link>
          </p>
        )}

      </div>
    </section>
  );
}
