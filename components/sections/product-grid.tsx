"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, categoryLabels, tagLabels, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Phone, Eye, Check } from "lucide-react";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <Card
              key={product._id}
              className="group overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={getProductImageUrl(product)}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.tag && (
                  <Badge
                    className={`absolute top-3 left-3 ${getTagClass(product.tag)}`}
                  >
                    {tagLabels[product.tag] || product.tag}
                  </Badge>
                )}
                {product.inStock && (
                  <div className="absolute top-3 right-3 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Còn hàng
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link
                    href={`/san-pham/${product.slug.current}`}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/#contact"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    title="Liên hệ báo giá"
                  >
                    <Phone className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              <CardContent className="p-4">
                {product.brand && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {product.brand}
                  </p>
                )}
                <Link href={`/san-pham/${product.slug.current}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {categoryLabels[product.category] || product.category}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
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
