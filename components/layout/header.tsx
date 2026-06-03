"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { PHONE, formatPhoneDisplay } from "@/lib/constants";

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
              href={`tel:${PHONE}`}
              className="hidden sm:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
              aria-label={`Gọi ngay ${formatPhoneDisplay(PHONE)}`}
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              {formatPhoneDisplay(PHONE)}
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
              href={`tel:${PHONE}`}
              className="mt-3 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-3 rounded-xl font-semibold text-sm"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Gọi ngay: {formatPhoneDisplay(PHONE)}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
