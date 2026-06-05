"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  // mounted=false → SSR/crawler thấy content bình thường, không bị opacity-0
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const node = ref.current;
    if (!node) return;
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "60px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const initial =
    direction === "up"
      ? "opacity-0 translate-y-8"
      : direction === "left"
      ? "opacity-0 -translate-x-8"
      : direction === "right"
      ? "opacity-0 translate-x-8"
      : "opacity-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        !mounted || visible ? "opacity-100 translate-x-0 translate-y-0" : initial
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
