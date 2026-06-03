import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PHONE, ZALO, formatPhoneDisplay } from "@/lib/constants";

const companyLinks = [
  { label: "Giới thiệu", href: "/#about" },
  { label: "Dịch vụ",   href: "/#services" },
  { label: "Liên hệ",   href: "/#contact" },
];

const productLinks = [
  { label: "Biến tần",            href: "/san-pham?category=bien-tan" },
  { label: "PLC & HMI",           href: "/san-pham?category=plc-hmi" },
  { label: "Thiết bị đóng cắt",   href: "/san-pham?category=dong-cat" },
  { label: "Cảm biến",            href: "/san-pham?category=cam-bien" },
  { label: "Vật tư tủ điện",      href: "/san-pham?category=vat-tu" },
];

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-slate-950 text-slate-400 border-t-2 border-primary/40">
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

            <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">
              Công ty TNHH Kỹ Thuật Công Nghiệp HT TECH
            </p>

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
                <span>T2–T6: 8:00–17:30 &nbsp;|&nbsp; T7: 8:00–12:00</span>
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
          <nav aria-label="Điều hướng công ty">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Công ty</h3>
            <ul className="space-y-2.5" role="list">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="text-xs text-slate-600 pt-2">MST: 2301405035</li>
            </ul>
          </nav>

          {/* Products nav */}
          <nav aria-label="Điều hướng sản phẩm">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Sản phẩm</h3>
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
          <p>&copy; {new Date().getFullYear()} HT TECH. Tất cả quyền được bảo lưu.</p>
          <p>Thiết kế bởi <span className="text-slate-500">HTtech.vn</span></p>
        </div>
      </div>
    </footer>
  );
}
