"use client";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Về đầu trang"
      className="fixed bottom-6 left-4 z-50 w-10 h-10 bg-slate-800/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-700 transition-colors"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
