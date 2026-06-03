"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";

const navItems = [
  { label: "Trang chủ",  href: "/" },
  { label: "Giới thiệu", href: "/#about" },
  { label: "Sản phẩm",  href: "/san-pham" },
  { label: "Dịch vụ",   href: "/#services" },
  { label: "Liên hệ",   href: "/#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng mobile menu khi đổi route
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl shadow-sm border-b border-border/60"
          : "bg-background shadow-sm"
      }`}
    >
      {/* Top bar — thông tin liên hệ nhanh */}
      <div className="hidden md:block bg-primary text-primary-foreground py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs">
          <a
            href="mailto:Httechbn@gmail.com"
            className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
          >
            <Mail className="w-3 h-3" aria-hidden="true" />
            Httechbn@gmail.com
          </a>
          <a
            href="tel:0972916382"
            className="flex items-center gap-1.5 font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone className="w-3 h-3" aria-hidden="true" />
            Hotline: 0972 916 382
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="HT TECH — Trang chủ">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-base leading-none select-none">HT</span>
            </div>
            <div>
              <span className="text-lg font-bold text-primary tracking-tight">HT TECH</span>
              <p className="text-[10px] text-muted-foreground hidden sm:block leading-none mt-0.5">
                Kỹ Thuật Công Nghiệp
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/san-pham"
                  ? pathname.startsWith("/san-pham")
                  : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA + toggle */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0972916382"
              className="hidden sm:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
              aria-label="Gọi ngay 0972 916 382"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              0972 916 382
            </a>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Đóng menu" : "Mở menu"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav
            id="mobile-menu"
            aria-label="Điều hướng mobile"
            className="md:hidden py-4 border-t border-border/60"
          >
            <ul className="flex flex-col gap-1" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="tel:0972916382"
              className="mt-3 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-3 rounded-xl font-semibold text-sm"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Gọi ngay: 0972 916 382
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
