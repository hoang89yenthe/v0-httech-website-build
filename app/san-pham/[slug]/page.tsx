import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getRelatedProducts, getMockProducts } from "@/lib/sanity/mock-data";
import { fetchProductBySlug } from "@/lib/sanity/fetch";
import { categoryLabels, tagLabels, getTagClass } from "@/lib/sanity/schema";
import { getProductImageUrl } from "@/lib/sanity/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  Phone,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle
} from "lucide-react";

const ZALO_NUMBER = process.env.NEXT_PUBLIC_ZALO_NUMBER ?? "0909123456";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  
  if (!product) {
    return {
      title: "Sản phẩm không tồn tại - HTtech",
    };
  }

  return {
    title: `${product.title} - HTtech`,
    description: product.description || `Mua ${product.title} chính hãng tại HTtech với giá tốt nhất.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  const formatPrice = (price?: number) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/san-pham" className="hover:text-primary">
              Sản phẩm
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              href={`/san-pham?category=${product.category}`} 
              className="hover:text-primary"
            >
              {categoryLabels[product.category] || product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.title}</span>
          </nav>

          {/* Product detail */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Product image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={getProductImageUrl(product, 800)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.tag && (
                <Badge
                  className={`absolute top-4 left-4 ${getTagClass(product.tag)} text-sm px-3 py-1`}
                >
                  {tagLabels[product.tag] || product.tag}
                </Badge>
              )}
            </div>

            {/* Product info */}
            <div>
              {product.brand && (
                <p className="text-sm text-muted-foreground mb-2">
                  Thương hiệu: <span className="font-medium text-primary">{product.brand}</span>
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>
              
              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge variant="destructive">
                      -{Math.round((1 - (product.price || 0) / product.originalPrice) * 100)}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    Còn hàng - Giao hàng trong 24h
                  </span>
                ) : (
                  <span className="text-amber-600">Đặt hàng trước - Giao trong 3-5 ngày</span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Thông số kỹ thuật:</h3>
                  <div className="bg-muted rounded-lg p-4">
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specs.map((spec, index) => (
                          <tr key={index} className="border-b border-border last:border-0">
                            <td className="py-2 text-muted-foreground w-1/3">{spec.label}</td>
                            <td className="py-2 font-medium">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="gap-2 flex-1">
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href="tel:19006868">
                    <Phone className="w-5 h-5" />
                    Gọi đặt hàng
                  </a>
                </Button>
              </div>

              {/* Zalo contact */}
              <a
                href={`https://zalo.me/${ZALO_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mb-6"
              >
                <MessageCircle className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-medium text-blue-700">Chat Zalo để được tư vấn</div>
                  <div className="text-sm text-blue-600">Phản hồi trong 5 phút</div>
                </div>
              </a>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs">Giao hàng toàn quốc</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs">Bảo hành chính hãng</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs">Đổi trả 7 ngày</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct._id} className="group overflow-hidden">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <img
                        src={getProductImageUrl(relatedProduct)}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      {relatedProduct.brand && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {relatedProduct.brand}
                        </p>
                      )}
                      <Link href={`/san-pham/${relatedProduct.slug.current}`}>
                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                          {relatedProduct.title}
                        </h3>
                      </Link>
                      <p className="text-primary font-bold mt-2">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for build time
export async function generateStaticParams() {
  const products = getMockProducts();
  return products.map((product) => ({
    slug: product.slug.current,
  }));
}
