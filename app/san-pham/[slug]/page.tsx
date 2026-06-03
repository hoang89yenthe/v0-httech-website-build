import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getRelatedProducts } from "@/lib/sanity/mock-data";
import { fetchProductBySlug, fetchProducts } from "@/lib/sanity/fetch";
import { categoryLabels, tagLabels, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/utils";
import { PHONE, ZALO } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, Phone, Check,
  Truck, Shield, RotateCcw, MessageCircle,
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://httech.vn";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Sản phẩm không tồn tại - HT TECH" };

  const description =
    product.description ?? `Mua ${product.title} chính hãng tại HT TECH với giá tốt nhất.`;
  const imageUrl = getProductImageUrl(product, 800);

  return {
    title: `${product.title} - HT TECH`,
    description,
    openGraph: {
      title: `${product.title} - HT TECH`,
      description,
      type: "website",
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.title }],
    },
    alternates: { canonical: `${SITE_URL}/san-pham/${slug}` },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product, 4);

  // JSON-LD structured data cho Google Shopping / SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? "",
    image: getProductImageUrl(product, 800),
    brand: { "@type": "Brand", name: product.brand ?? "HT TECH" },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price ?? 0,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "HT TECH" },
    },
  };

  return (
    <>
      <Script
        id={`json-ld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          <div className="container mx-auto px-4 py-8">

            {/* Breadcrumb — BreadcrumbList schema */}
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <Link href="/san-pham" className="hover:text-primary transition-colors">Sản phẩm</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <Link href={`/san-pham?category=${product.category}`} className="hover:text-primary transition-colors">
                {categoryLabels[product.category] ?? product.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
            </nav>

            {/* Product detail — dùng article cho semantic đúng chuẩn */}
            <article
              aria-label={product.title}
              className="grid lg:grid-cols-2 gap-8 lg:gap-14 mb-16"
            >
              {/* Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={getProductImageUrl(product, 800)}
                    alt={`${product.title} — ảnh sản phẩm`}
                    width={800}
                    height={800}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.tag && (
                  <Badge className={`absolute top-4 left-4 ${getTagClass(product.tag)} text-sm px-3 py-1`}>
                    {tagLabels[product.tag] ?? product.tag}
                  </Badge>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                {product.brand && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                    {product.brand}
                  </p>
                )}

                <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.price && product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        −{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    </>
                  )}
                </div>

                {/* Stock */}
                <p className="flex items-center gap-2 text-sm mb-5">
                  {product.inStock ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Còn hàng — Giao hàng trong 24h
                    </span>
                  ) : (
                    <span className="text-amber-600">Đặt hàng trước — Giao trong 3–5 ngày</span>
                  )}
                </p>

                {/* Description */}
                {product.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}

                {/* Specs table */}
                {product.specs && product.specs.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-2.5 uppercase tracking-wider text-muted-foreground">
                      Thông số kỹ thuật
                    </h2>
                    <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                      <tbody>
                        {product.specs.map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : "bg-background"}>
                            <td className="py-2.5 px-4 text-muted-foreground w-2/5 font-medium">{spec.label}</td>
                            <td className="py-2.5 px-4">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <Button size="lg" className="gap-2 flex-1 rounded-xl" asChild>
                    <a href={`tel:${PHONE}`}>
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      Gọi đặt hàng ngay
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2 flex-1 rounded-xl" asChild>
                    <a href={`https://zalo.me/${ZALO}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      Chat Zalo báo giá
                    </a>
                  </Button>
                </div>

                {/* Benefits */}
                <ul
                  className="grid grid-cols-3 gap-3"
                  role="list"
                  aria-label="Cam kết dịch vụ"
                >
                  {[
                    { icon: Truck,      label: "Giao hàng toàn quốc" },
                    { icon: Shield,     label: "Bảo hành chính hãng" },
                    { icon: RotateCcw,  label: "Đổi trả 7 ngày" },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label} className="text-center p-3 bg-muted/60 rounded-xl">
                      <Icon className="w-5 h-5 mx-auto mb-1.5 text-primary" aria-hidden="true" />
                      <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <section aria-labelledby="related-heading">
                <h2 id="related-heading" className="text-xl font-bold mb-5">
                  Sản phẩm liên quan
                </h2>
                <ul
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                  role="list"
                  aria-label="Sản phẩm cùng danh mục"
                >
                  {relatedProducts.map((rel) => (
                    <li key={rel._id}>
                      <Link
                        href={`/san-pham/${rel.slug.current}`}
                        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all h-full"
                        aria-label={`${rel.title} — ${formatPrice(rel.price)}`}
                      >
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          <img
                            src={getProductImageUrl(rel)}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400"
                          />
                        </div>
                        <div className="p-3">
                          {rel.brand && (
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">
                              {rel.brand}
                            </p>
                          )}
                          <h3 className="text-xs font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {rel.title}
                          </h3>
                          <div className="flex items-baseline gap-1.5 mt-2 flex-wrap">
                            <span className="text-sm font-bold text-primary">{formatPrice(rel.price)}</span>
                            {rel.price && rel.originalPrice && rel.originalPrice > rel.price && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatPrice(rel.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({ slug: p.slug.current }));
}
