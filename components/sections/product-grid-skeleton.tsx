export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="bg-muted/40 pt-14 md:pt-20 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        {/* Heading skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-muted rounded-xl mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-80 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex gap-2 mb-6 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-muted animate-pulse shrink-0"
              style={{ width: `${72 + i * 12}px`, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="flex gap-5 overflow-hidden pb-6">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[87vw] sm:w-[320px] bg-card rounded-3xl overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="px-8 pt-8 pb-0">
                <div className="h-3 w-16 bg-muted rounded mb-3" />
                <div className="h-6 w-full bg-muted rounded mb-2" />
                <div className="h-6 w-3/4 bg-muted rounded" />
              </div>
              <div className="px-7 pt-5 pb-0">
                <div className="aspect-square w-full bg-muted rounded-2xl" />
              </div>
              <div className="px-8 py-7 flex justify-between items-end">
                <div>
                  <div className="h-3 w-10 bg-muted rounded mb-2" />
                  <div className="h-5 w-28 bg-muted rounded" />
                </div>
                <div className="h-9 w-24 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
