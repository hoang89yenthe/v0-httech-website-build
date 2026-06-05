"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PHONE, ZALO, formatPhoneDisplay } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";
import { t } from "@/lib/i18n";

export function Footer() {
  const { locale } = useLanguage();
  const tr = t(locale);
  const nav = tr.nav;
  const cats = tr.products.categories;

  const companyLinks = [
    { label: nav.about,    href: "/#about" },
    { label: nav.services, href: "/#services" },
    { label: nav.contact,  href: "/#contact" },
  ];

  const productLinks = [
    { label: cats["bien-tan"], href: "/san-pham?category=bien-tan" },
    { label: cats["plc-hmi"],  href: "/san-pham?category=plc-hmi" },
    { label: cats["dong-cat"], href: "/san-pham?category=dong-cat" },
    { label: cats["cam-bien"], href: "/san-pham?category=cam-bien" },
    { label: cats["vat-tu"],   href: "/san-pham?category=vat-tu" },
  ];

  const f = tr.footer;
  return (
    <footer role="contentinfo" className="bg-slate-950 text-slate-400 border-t border-primary/20">
      <div className="container mx-auto px-4 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Company info */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4" aria-label="HT TECH — Trang chủ">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm select-none">HT</span>
              </div>
              <div>
                <span className="text-base font-bold text-white">HT TECH</span>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">Kỹ Thuật Công Nghiệp</p>
              </div>
            </Link>

            <p className="text-xs text-slate-500 mb-4">{f.companyFull}</p>

            <address className="not-italic space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>CL13-16 KĐT Him Lam Green Park, Phường Võ Cường, Tỉnh Bắc Ninh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <a href={`tel:${PHONE}`} className="hover:text-white transition-colors">
                  {formatPhoneDisplay(PHONE)}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <a href="mailto:Httechbn@gmail.com" className="hover:text-white transition-colors">
                  Httechbn@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>{f.hours}</span>
              </p>
            </address>

            {/* Quick contact icons */}
            <div className="flex gap-2.5 mt-5">
              <a
                href={`https://zalo.me/${ZALO}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat Zalo HT TECH"
                className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-[#0068FF] transition-colors text-[11px] font-bold text-white"
              >
                Za
              </a>
              <a
                href={`tel:${PHONE}`}
                aria-label="Gọi điện HT TECH"
                className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Company nav */}
          <nav aria-label={f.company}>
            <h3 className="text-white font-semibold mb-4 text-sm">{f.company}</h3>
            <ul className="space-y-2.5" role="list">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="text-xs text-slate-600 pt-2">{f.taxId}</li>
            </ul>
          </nav>

          {/* Products nav */}
          <nav aria-label={f.products}>
            <h3 className="text-white font-semibold mb-4 text-sm">{f.products}</h3>
            <ul className="space-y-2.5" role="list">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
          <p>{f.copyright.replace("{year}", String(new Date().getFullYear()))}</p>
          <p>{f.madeBy} <span className="text-slate-500">httechvietnam.vn</span></p>
        </div>
      </div>
    </footer>
  );
}
