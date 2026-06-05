import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGridSkeleton } from "@/components/sections/product-grid-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="h-4 w-32 bg-slate-700 rounded mb-4 animate-pulse" />
            <div className="h-9 w-48 bg-slate-700 rounded mb-2 animate-pulse" />
            <div className="h-4 w-40 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <ProductGridSkeleton count={4} />
      </main>
      <Footer />
    </div>
  );
}
