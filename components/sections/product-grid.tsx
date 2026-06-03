"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, tagLabels, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { Button } from "@/components/ui/button";

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
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const formatPrice = (price?: number) =>
    price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "Liên hệ";

  return (
    <section
      id="products"
      aria-labelledby={!isPage ? "products-heading" : undefined}
      className={`bg-muted/30 ${isPage ? "py-10 md:py-14" : "pt-14 md:pt-20 pb-16 md:pb-24"}`}
    >
      <div className="container mx-auto px-4">

        {/* Section heading — chỉ trên homepage */}
        {!isPage && (
          <header className="text-center mb-14">
            <h2
              id="products-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight"
            >
              Sản Phẩm<br />
              <span className="text-primary">Chính Hãng.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Nhập khẩu chính ngạch từ Siemens, ABB, Mitsubishi, Schneider,
              Omron, Delta — đầy đủ chứng từ, bảo hành nhà sản xuất.
            </p>
          </header>
        )}

        {/* Category filter tabs */}
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
                onClick={() => { setActiveCategory(cat.value); setVisibleCount(12); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-background hover:bg-muted border border-border"
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
            <p className="text-4xl mb-3" aria-hidden="true">🔍</p>
            <p className="font-medium">Không tìm thấy sản phẩm nào.</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-3 text-primary hover:underline text-sm"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}

        {/* Products grid */}
        <ul
          role="list"
          aria-label="Danh sách sản phẩm"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {displayedProducts.map((product) => (
            <li key={product._id} className="reveal-on-scroll">
              <Link
                href={`/san-pham/${product.slug.current}`}
                aria-label={`${product.title} — ${formatPrice(product.price)}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:ring-2 hover:ring-primary/25 transition-all duration-200 h-full"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={getProductImageUrl(product)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                  />
                  {/* Spotlight overlay on hover */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 65%)",
                    }}
                  />
                  {product.tag && (
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-0.5 rounded-full ${getTagClass(product.tag)}`}
                    >
                      {tagLabels[product.tag]}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="absolute top-3 right-3 bg-slate-700/80 text-white text-xs px-2.5 py-0.5 rounded-full">
                      Hết hàng
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {product.brand && (
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-1">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-3">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > (product.price || 0) && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Load more */}
        {isPage && hasMore && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCount((prev) => prev + 8)}
            >
              Xem thêm sản phẩm
            </Button>
          </div>
        )}

        {/* View all */}
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
