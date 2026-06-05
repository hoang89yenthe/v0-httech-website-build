import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const revalidate = 3600;
import { HeroSection } from "@/components/sections/hero-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { ProductGridSkeleton } from "@/components/sections/product-grid-skeleton";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { fetchProducts } from "@/lib/sanity/fetch";

async function HomeProductGrid() {
  const products = await fetchProducts();
  return <ProductGrid products={products} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AnimateOnScroll>
          <AboutSection />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Suspense fallback={<ProductGridSkeleton />}>
            <HomeProductGrid />
          </Suspense>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ServicesSection />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ContactSection />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
