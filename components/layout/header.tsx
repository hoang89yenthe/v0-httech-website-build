"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/#about" },
  { label: "Sản phẩm", href: "/#products" },
  { label: "Dịch vụ", href: "/#services" },
  { label: "Liên hệ", href: "/#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 opacity-90">
            <Mail className="w-3.5 h-3.5" />
            Httechbn@gmail.com
          </span>
          <span className="flex items-center gap-2 font-semibold">
            <Phone className="w-3.5 h-3.5" />
            Hotline: 0972 916 382
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">HT</span>
            </div>
            <div>
              <span className="text-xl font-bold text-primary">HT TECH</span>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Kỹ Thuật Công Nghiệp
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile toggle */}
          <div className="flex items-center gap-4">
            <a
              href="tel:0972916382"
              className="hidden sm:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              0972 916 382
            </a>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="tel:0972916382"
                className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-3 rounded-lg font-semibold justify-center"
              >
                <Phone className="w-4 h-4" />
                Gọi ngay: 0972 916 382
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
