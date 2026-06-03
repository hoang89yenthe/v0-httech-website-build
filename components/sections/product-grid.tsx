"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Product, tagLabels, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/utils";
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
  const [visibleCount, setVisibleCount] = useState(9);
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryChange = (value: string) => {
    if (value === activeCategory) return;
    setActiveCategory(value);
    setVisibleCount(9);
    if (isPage) {
      const url = value === "all" ? pathname : `${pathname}?category=${value}`;
      router.replace(url, { scroll: false });
    }
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <section
      id="products"
      aria-labelledby={!isPage ? "products-heading" : undefined}
      className={isPage ? "py-10 md:py-14" : "pt-14 md:pt-20 pb-16 md:pb-24"}
    >
      <div className="container mx-auto px-4">

        {/* Section heading — chỉ trên homepage */}
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
            <button
              onClick={() => setActiveCategory("all")}
              className="text-primary text-sm hover:underline"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}

        {/* Products grid — Apple style: 3 cột, card dọc */}
        <ul
          role="list"
          aria-label="Danh sách sản phẩm"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {displayedProducts.map((product, index) => (
            <li
              key={product._id}
              className="reveal-on-scroll"
              style={{ animationDelay: `${(index % 3) * 80}ms` }}
            >
              <Link
                href={`/san-pham/${product.slug.current}`}
                aria-label={`${product.title} — ${formatPrice(product.price)}`}
                className="group flex flex-col bg-muted/50 rounded-3xl overflow-hidden h-full transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
              >
                {/* Header — brand + tên sản phẩm (Apple: tên ở trên) */}
                <div className="px-5 pt-5 pb-0">
                  {product.brand && (
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.06em] mb-1.5">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="text-base font-semibold leading-snug tracking-tight line-clamp-2 min-h-[2.6rem]">
                    {product.title}
                  </h3>
                </div>

                {/* Ảnh — chiếm phần giữa card, square + rounded */}
                <div className="relative flex-1 mx-5 my-4 min-h-[180px]">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-background/70">
                    <img
                      src={getProductImageUrl(product)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
                    />
                    {/* Gradient overlay dưới ảnh */}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    {/* Tag badge */}
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

                {/* Footer — giá + CTA (Apple: giá trái, nút phải) */}
                <div className="px-5 pb-5">
                  <div className="flex items-end justify-between gap-3">
                    {/* Giá */}
                    <div className="min-w-0">
                      {product.price ? (
                        <>
                          <p className="text-[10px] text-muted-foreground mb-0.5">Từ</p>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {formatPrice(product.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-foreground">Liên hệ</p>
                      )}
                      {product.price && product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-[10px] text-muted-foreground line-through mt-0.5">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>

                    {/* CTA pill — giống nút "Mua" của Apple */}
                    <span className="shrink-0 inline-flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-medium group-hover:opacity-85 transition-opacity duration-200">
                      Xem ngay
                      <ArrowRight className="w-3 h-3" />
                    </span>
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
              className="rounded-full px-8"
              onClick={() => setVisibleCount((prev) => prev + 9)}
            >
              Xem thêm sản phẩm
            </Button>
          </div>
        )}

        {/* View all — homepage */}
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
