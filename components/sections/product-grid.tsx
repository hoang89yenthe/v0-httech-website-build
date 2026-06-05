"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Product, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { t } from "@/lib/i18n";

const CATEGORY_KEYS = ["all", "bien-tan", "plc-hmi", "dong-cat", "cam-bien", "vat-tu"] as const;

interface ProductGridProps {
  products: Product[];
  initialCategory?: string;
  isPage?: boolean;
}

export function ProductGrid({ products, initialCategory, isPage = false }: ProductGridProps) {
  const { locale } = useLanguage();
  const tr = t(locale).products;

  const categories = CATEGORY_KEYS.map((value) => ({
    value,
    label: tr.categories[value as keyof typeof tr.categories],
  }));

  const [activeCategory, setActiveCategory] = useState(
    initialCategory && initialCategory !== "" ? initialCategory : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();
  const pathname  = usePathname();

  const getTitle = (p: Product) => (locale === "en" ? p.title_en || p.title : p.title);

  const filteredProducts = useMemo(() => products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        getTitle(p).toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        (locale === "en" ? p.description_en || p.description : p.description)?.toLowerCase().includes(q)
      );
    }),
  [products, activeCategory, searchQuery, locale]);

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

        {!isPage && (
          <header className="text-center mb-12">
            <h2 id="products-heading" className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              {tr.heading}<br />
              <span className="text-primary">{tr.headingAccent}</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">{tr.body}</p>
          </header>
        )}

        <div
          role="tablist"
          aria-label={tr.filterLabel}
          className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                role="tab"
                aria-selected={isActive}
                aria-controls="product-carousel"
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

        {isPage && (
          <div className="relative mb-8 max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr.searchPlaceholder}
              aria-label={tr.searchLabel}
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} aria-label={tr.clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground" role="status" aria-live="polite">
            <p className="font-medium mb-2">
              {searchQuery ? tr.emptySearch.replace("{q}", searchQuery) : tr.emptyCategory}
            </p>
            <button onClick={() => { setSearchQuery(""); handleCategoryChange("all"); }} className="text-primary text-sm hover:underline">
              {tr.showAll}
            </button>
          </div>
        )}

        {/* ── Carousel ──────────────────────────────────────── */}
        <div className="relative">

          <button
            onClick={() => scrollByCards("left")}
            aria-label={tr.scrollLeft}
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
            id="product-carousel"
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-none pb-6"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
            }}
          >
            {filteredProducts.map((product, idx) => (
              <Link
                key={product._id}
                data-card
                href={`/san-pham/${product.slug.current}`}
                aria-label={`${getTitle(product)} — ${product.price ? formatPrice(product.price) : tr.contact}`}
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
                <div className="px-8 pt-8 pb-0">
                  {product.brand && (
                    <p className="text-xs font-medium text-muted-foreground mb-2">{product.brand}</p>
                  )}
                  <h3 className="text-[21px] font-semibold leading-snug tracking-tight line-clamp-2 min-h-[3.2rem]">
                    {getTitle(product)}
                  </h3>
                </div>

                {/* ── Ảnh — lớn, chiếm phần giữa card ── */}
                <div className="relative flex-1 px-7 pt-5 pb-0">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/60">
                    <Image
                      src={getProductImageUrl(product)}
                      alt={getTitle(product)}
                      fill
                      sizes="(max-width: 640px) 87vw, 320px"
                      priority={isPage && idx === 0}
                      loading={isPage && idx === 0 ? "eager" : "lazy"}
                      draggable={false}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                    />
                  </div>
                  {product.tag && (
                    <span className={`absolute top-7 left-10 text-[10px] font-semibold px-2.5 py-1 rounded-full ${getTagClass(product.tag)}`}>
                      {tr.tags[product.tag as keyof typeof tr.tags] ?? product.tag}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="absolute top-7 right-10 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {tr.outOfStock}
                    </span>
                  )}
                </div>

                {/* ── Footer: giá trái, nút phải (y hệt Apple) ── */}
                <div className="px-8 py-7">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      {product.price ? (
                        <>
                          <p className="text-xs text-muted-foreground mb-1">{tr.from}</p>
                          <p className="text-base font-semibold text-foreground truncate">
                            {formatPrice(product.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-base font-semibold">{tr.contact}</p>
                      )}
                      {product.price && product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-muted-foreground line-through mt-0.5">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-medium group-hover:opacity-85 transition-opacity duration-200">
                      {tr.buy}
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
            aria-label={tr.scrollRight}
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

        {!isPage && (
          <p className="text-center mt-8">
            <Link href="/san-pham" className="text-primary hover:underline font-medium text-sm">
              {tr.viewAll.replace("{n}", String(products.length))}
            </Link>
          </p>
        )}

      </div>
    </section>
  );
}
