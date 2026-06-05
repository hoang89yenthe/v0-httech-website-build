import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

export const revalidate = 3600;

import Image from "next/image";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { fetchProductBySlug, fetchProducts, fetchRelatedProducts } from "@/lib/sanity/fetch";
import { getTagClass, tagLabels } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/utils";
import { PHONE, ZALO } from "@/lib/constants";
import { t, type Locale, LOCALE_COOKIE } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, Phone, Check,
  Truck, Shield, RotateCcw, MessageCircle,
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://httechvietnam.vn";

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
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE)?.value ?? "vi") as Locale;
  const tr = t(locale).productDetail;
  const catTr = t(locale).products.categories;

  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const title = locale === "en" ? (product.title_en || product.title) : product.title;
  const description = locale === "en" ? (product.description_en || product.description) : product.description;
  const specs = locale === "en" ? (product.specs_en || product.specs) : product.specs;

  const relatedProducts = await fetchRelatedProducts(product.category, product._id, 4);

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

            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-primary transition-colors">{tr.breadcrumbHome}</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <Link href="/san-pham" className="hover:text-primary transition-colors">{tr.breadcrumbProducts}</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <Link href={`/san-pham?category=${product.category}`} className="hover:text-primary transition-colors">
                {catTr[product.category as keyof typeof catTr] ?? product.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="text-foreground font-medium line-clamp-1">{title}</span>
            </nav>

            {/* Product detail — dùng article cho semantic đúng chuẩn */}
            <article
              aria-label={product.title}
              className="grid lg:grid-cols-2 gap-8 lg:gap-14 mb-16"
            >
              {/* Image */}
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={getProductImageUrl(product, 800)}
                    alt={`${product.title} — ảnh sản phẩm`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
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
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.06em] mb-2">
                    {product.brand}
                  </p>
                )}

                <h1 className="text-2xl md:text-3xl font-semibold mb-4">{title}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-2xl font-semibold text-primary">
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

                <p className="flex items-center gap-2 text-sm mb-5">
                  {product.inStock ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      {tr.inStock}
                    </span>
                  ) : (
                    <span className="text-amber-600">{tr.preOrder}</span>
                  )}
                </p>

                {description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>
                )}

                {specs && specs.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground mb-2.5">
                      {tr.specs}
                    </h2>
                    <table className="w-full text-sm border border-border/60 rounded-xl overflow-hidden">
                      <tbody>
                        {specs.map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                            <td className="py-2.5 px-4 text-muted-foreground w-2/5 text-xs font-medium">{spec.label}</td>
                            <td className="py-2.5 px-4 text-sm">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <Button size="lg" className="gap-2 flex-1 rounded-full" asChild>
                    <a href={`tel:${PHONE}`}>
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      {tr.orderNow}
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2 flex-1 rounded-full border-border/60" asChild>
                    <a href={`https://zalo.me/${ZALO}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      {tr.chatZalo}
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
                    { icon: Truck,     label: tr.nationwide },
                    { icon: Shield,    label: tr.warranty },
                    { icon: RotateCcw, label: tr.returns },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label} className="text-center p-3 bg-muted/60 rounded-xl">
                      <Icon className="w-5 h-5 mx-auto mb-1.5 text-primary" aria-hidden="true" />
                      <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {relatedProducts.length > 0 && (
              <section aria-labelledby="related-heading">
                <h2 id="related-heading" className="text-xl font-bold mb-5">{tr.related}</h2>
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="list" aria-label={tr.relatedLabel}>
                  {relatedProducts.map((rel) => (
                    <li key={rel._id}>
                      <Link
                        href={`/san-pham/${rel.slug.current}`}
                        className="group block bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-primary/20 hover:shadow-md transition-all duration-200 h-full"
                        aria-label={`${locale === "en" ? rel.title_en || rel.title : rel.title} — ${formatPrice(rel.price)}`}
                      >
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          <Image
                            src={getProductImageUrl(rel)}
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="(max-width: 640px) 50vw, 200px"
                            loading="lazy"
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          />
                        </div>
                        <div className="p-3">
                          {rel.brand && (
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.06em] mb-1">
                              {rel.brand}
                            </p>
                          )}
                          <h3 className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">
                            {locale === "en" ? rel.title_en || rel.title : rel.title}
                          </h3>
                          <div className="flex items-baseline gap-1.5 mt-2 flex-wrap">
                            <span className="text-sm font-semibold text-primary">{formatPrice(rel.price)}</span>
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
