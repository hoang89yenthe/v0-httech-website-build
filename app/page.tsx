import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { getMockProducts } from "@/lib/sanity/mock-data";
import { getProducts } from "@/lib/sanity/queries";
import { Product } from "@/lib/sanity/schema";

async function fetchProducts(): Promise<Product[]> {
  // Try fetching from Sanity first
  try {
    const sanityProducts = await getProducts();
    if (sanityProducts && sanityProducts.length > 0) {
      return sanityProducts;
    }
  } catch (error) {
    console.log("[v0] Sanity not connected, using mock data");
  }
  
  // Fall back to mock data
  return getMockProducts();
}

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductGrid products={products} />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
