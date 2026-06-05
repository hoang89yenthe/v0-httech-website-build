import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { t, type Locale, LOCALE_COOKIE } from "@/lib/i18n";

export const revalidate = 3600;
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/sections/product-grid";
import { fetchProducts } from "@/lib/sanity/fetch";
import { ChevronRight } from "lucide-react";

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  "bien-tan":  { title: "Biến Tần Chính Hãng",        description: "Biến tần Siemens, ABB, Mitsubishi, Schneider, Delta chính hãng — bảo hành 24 tháng, giao hàng toàn quốc." },
  "plc-hmi":  { title: "PLC & HMI Chính Hãng",        description: "PLC Siemens S7, Mitsubishi FX5U, Omron CP1E và màn hình HMI chính hãng tại HT TECH Bắc Ninh." },
  "dong-cat": { title: "Thiết Bị Đóng Cắt Chính Hãng", description: "MCCB, ACB, Contactor, Relay nhiệt Schneider, ABB, LS chính hãng — đủ chứng từ xuất xứ." },
  "cam-bien": { title: "Cảm Biến Công Nghiệp",         description: "Cảm biến tiệm cận, quang, nhiệt độ, áp suất từ Omron, Sick, Autonics, Keyence chính hãng." },
  "vat-tu":   { title: "Vật Tư Tủ Điện",              description: "Thanh cái, máng điện, cầu đấu, đầu cos, dây điện Cadivi và phụ kiện tủ điện chính hãng." },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const cat = category && CATEGORY_META[category] ? CATEGORY_META[category] : null;
  const title = cat ? `${cat.title} - HT TECH` : "Sản Phẩm - HT TECH Thiết Bị Điện Công Nghiệp";
  const description = cat ? cat.description : "Khám phá đầy đủ các sản phẩm biến tần, PLC, HMI, thiết bị đóng cắt, cảm biến và vật tư tủ điện chính hãng tại HT TECH.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    alternates: {
      canonical: category ? `/san-pham?category=${category}` : '/san-pham',
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE)?.value ?? "vi") as Locale;
  const tr = t(locale).productPage;
  const products = await fetchProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <Link href="/" className="hover:text-white">{tr.home}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{tr.title}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold">{tr.title}</h1>
            <p className="text-slate-300 mt-2">
              {tr.subtitle.replace("{n}", String(products.length))}
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
