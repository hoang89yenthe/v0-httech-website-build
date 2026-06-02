import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  company: [
    { label: "Giới thiệu", href: "/#about" },
    { label: "Dịch vụ", href: "/#services" },
    { label: "Dự án", href: "#" },
    { label: "Tuyển dụng", href: "#" },
  ],
  products: [
    { label: "Biến tần", href: "/san-pham?category=bien-tan" },
    { label: "PLC & HMI", href: "/san-pham?category=plc-hmi" },
    { label: "Thiết bị đóng cắt", href: "/san-pham?category=dong-cat" },
    { label: "Cảm biến", href: "/san-pham?category=cam-bien" },
    { label: "Vật tư tủ điện", href: "/san-pham?category=vat-tu" },
  ],
  support: [
    { label: "Hướng dẫn mua hàng", href: "#" },
    { label: "Chính sách bảo hành", href: "#" },
    { label: "Chính sách đổi trả", href: "#" },
    { label: "Câu hỏi thường gặp", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <p className="text-sm mb-4 font-semibold text-white">
              CÔNG TY TNHH KỸ THUẬT CÔNG NGHIỆP HT TECH
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span>CL13-16 KĐT Him Lam Green Park, Phường Võ Cường, Tỉnh Bắc Ninh, Việt Nam</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary font-bold text-xs border border-primary px-1 rounded">MST</span>
                <span>2301405035</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary font-bold text-xs border border-primary px-1 rounded">Đại diện</span>
                <span>Nguyễn Văn Hoàn</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>1900 6868</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@httech.vn</span>
              </p>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Kết nối với chúng tôi</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} HT TECH. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
