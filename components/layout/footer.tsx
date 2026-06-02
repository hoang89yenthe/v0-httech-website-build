import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Youtube } from "lucide-react";

const companyLinks = [
  { label: "Giới thiệu", href: "/#about" },
  { label: "Dịch vụ", href: "/#services" },
  { label: "Liên hệ", href: "/#contact" },
];

const productLinks = [
  { label: "Biến tần", href: "/san-pham?category=bien-tan" },
  { label: "PLC & HMI", href: "/san-pham?category=plc-hmi" },
  { label: "Thiết bị đóng cắt", href: "/san-pham?category=dong-cat" },
  { label: "Cảm biến", href: "/san-pham?category=cam-bien" },
  { label: "Vật tư tủ điện", href: "/san-pham?category=vat-tu" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">HT</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">HT TECH</span>
                <p className="text-xs text-slate-400">Kỹ Thuật Công Nghiệp</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              CÔNG TY TNHH KỸ THUẬT CÔNG NGHIỆP HT TECH
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>CL13-16 KĐT Him Lam Green Park, Phường Võ Cường, Tỉnh Bắc Ninh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>0972 916 382</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>Httechbn@gmail.com</span>
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Facebook" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Youtube" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="text-sm text-slate-500">MST: 2301405035</li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HT TECH. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
