import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const revalidate = 3600;
import { HeroSection } from "@/components/sections/hero-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { fetchProducts } from "@/lib/sanity/fetch";

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AnimateOnScroll>
          <AboutSection />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ProductGrid products={products} />
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
