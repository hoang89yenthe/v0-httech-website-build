"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, categoryLabels, tagLabels, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const categories = [
  { value: "all", label: "Tất cả" },
  { value: "bien-tan", label: "Biến tần" },
  { value: "plc-hmi", label: "PLC & HMI" },
  { value: "dong-cat", label: "Thiết bị đóng cắt" },
  { value: "cam-bien", label: "Cảm biến" },
  { value: "vat-tu", label: "Vật tư tủ điện" },
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

  const formatPrice = (price?: number) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <section id="products" className={`bg-muted/30 ${isPage ? "py-10 md:py-14" : "pt-14 md:pt-20 pb-16 md:pb-24"}`}>
      <div className="container mx-auto px-4">
        {/* Section header — chỉ hiện trên homepage */}
        {!isPage && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Sản Phẩm<br />
              <span className="text-primary">Chính Hãng.</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
              Nhập khẩu chính ngạch từ Siemens, ABB, Mitsubishi, Schneider,
              Omron, Delta — đầy đủ chứng từ, bảo hành nhà sản xuất.
            </p>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                setVisibleCount(12);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedProducts.map((product) => (
            <Link
              key={product._id}
              href={`/san-pham/${product.slug.current}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Image — full bleed, 4:3 ratio */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={getProductImageUrl(product)}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.tag && (
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-0.5 rounded-full ${getTagClass(product.tag)}`}>
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
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                )}
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-3">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
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
          ))}
        </div>

        {/* Load more — chỉ hiện trên trang /san-pham */}
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

        {/* View all link — chỉ hiện trên homepage */}
        {!isPage && (
          <div className="text-center mt-10">
            <Link href="/san-pham" className="text-primary hover:underline font-medium text-base">
              Xem tất cả {products.length} sản phẩm &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
