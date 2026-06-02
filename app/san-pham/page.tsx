import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/sections/product-grid";
import { fetchProducts } from "@/lib/sanity/fetch";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sản Phẩm - HT TECH Thiết Bị Điện Công Nghiệp",
  description: "Khám phá đầy đủ các sản phẩm biến tần, PLC, HMI, thiết bị đóng cắt, cảm biến và vật tư tủ điện chính hãng tại HT TECH.",
  openGraph: {
    title: "Sản Phẩm - HT TECH Thiết Bị Điện Công Nghiệp",
    description: "Khám phá đầy đủ các sản phẩm biến tần, PLC, HMI, thiết bị đóng cắt, cảm biến và vật tư tủ điện chính hãng tại HT TECH.",
    type: "website",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await fetchProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <Link href="/" className="hover:text-white">
                Trang chủ
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Sản phẩm</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold">Sản Phẩm</h1>
            <p className="text-slate-300 mt-2">
              {products.length} sản phẩm thiết bị điện công nghiệp chính hãng
            </p>
          </div>
        </div>

        {/* Products */}
        <ProductGrid products={products} initialCategory={category} isPage />
      </main>
      <Footer />
    </div>
  );
}
