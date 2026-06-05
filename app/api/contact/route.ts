import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

const PRODUCT_LABELS: Record<string, string> = {
  "bien-tan":  "Biến tần",
  "plc-hmi":   "PLC & HMI",
  "dong-cat":  "Thiết bị đóng cắt",
  "cam-bien":  "Cảm biến",
  "vat-tu":    "Vật tư tủ điện",
  "dich-vu":   "Dịch vụ kỹ thuật",
  "khac":      "Khác",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Dùng cho email headers (subject, replyTo) — ngăn header injection
function sanitizeHeader(str: string): string {
  return str.replace(/[\r\n]/g, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, retryAfterSec } = rateLimit(`contact:${ip}`, 10, 60 * 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
      );
    }

    const { name, phone, email, product, message } = await req.json();

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    if (
      name.length > 100 ||
      phone.length > 20 ||
      (email && email.length > 200) ||
      (product && product.length > 50) ||
      (message && message.length > 2000)
    ) {
      return NextResponse.json({ error: "Dữ liệu vượt quá giới hạn cho phép" }, { status: 400 });
    }

    // Validate phone: chỉ chứa chữ số, dấu +, -, (), khoảng trắng; 7-15 chữ số thực
    const phoneDigits = phone.replace(/[\s\-().+]/g, "");
    if (!/^\d{7,15}$/.test(phoneDigits)) {
      return NextResponse.json({ error: "Số điện thoại không hợp lệ" }, { status: 400 });
    }

    // Validate email format nếu có
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }

    // Validate product nằm trong danh sách cho phép
    const ALLOWED_PRODUCTS = Object.keys(PRODUCT_LABELS);
    if (product && !ALLOWED_PRODUCTS.includes(product)) {
      return NextResponse.json({ error: "Sản phẩm không hợp lệ" }, { status: 400 });
    }

    if (process.env.PLAYWRIGHT_TEST === "true" && process.env.NODE_ENV !== "production") {
      console.log("[contact] Chế độ E2E Test: Tự động Mock gửi email thành công");
      return NextResponse.json({ ok: true });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass || gmailUser.includes("your-email@gmail.com") || gmailPass.includes("xxxx-xxxx-xxxx-xxxx")) {
      console.warn("[contact] GMAIL_USER hoặc GMAIL_APP_PASSWORD chưa được cấu hình chính xác. Trả về thành công giả lập.");
      return NextResponse.json({ ok: true });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const productLabel = PRODUCT_LABELS[product] ?? "Không chọn";
    const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    // Headers: strip newlines để ngăn email header injection
    const headerName = sanitizeHeader(name);
    const headerPhone = sanitizeHeader(phone);
    const headerEmail = email ? sanitizeHeader(email) : "";

    // HTML body: escape để ngăn XSS / HTML injection
    const safeName = escapeHtml(headerName);
    const safePhone = escapeHtml(headerPhone);
    const safeEmail = escapeHtml(headerEmail);
    const safeMessage = message ? escapeHtml(message.trim()).replace(/\n/g, "<br>") : "";

    await transporter.sendMail({
      from: `"HT TECH Website" <${gmailUser}>`,
      to: gmailUser,
      replyTo: headerEmail || undefined,
      subject: `[HT TECH] Yêu cầu tư vấn từ ${headerName} — ${headerPhone}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:#1d4ed8;padding:20px 24px">
            <h2 style="color:#fff;margin:0;font-size:18px">📋 Yêu cầu tư vấn mới — HT TECH</h2>
            <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">${now}</p>
          </div>
          <div style="padding:24px;background:#fff">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:140px">Họ và tên</td><td style="padding:8px 0;font-weight:600">${safeName}</td></tr>
              <tr style="background:#f9fafb"><td style="padding:8px 6px;color:#6b7280">Số điện thoại</td><td style="padding:8px 6px;font-weight:600"><a href="tel:${safePhone}" style="color:#1d4ed8">${safePhone}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0">${safeEmail || "—"}</td></tr>
              <tr style="background:#f9fafb"><td style="padding:8px 6px;color:#6b7280">Sản phẩm</td><td style="padding:8px 6px">${productLabel}</td></tr>
              ${safeMessage ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Nội dung</td><td style="padding:8px 0">${safeMessage}</td></tr>` : ""}
            </table>
          </div>
          <div style="padding:16px 24px;background:#f1f5f9;font-size:12px;color:#94a3b8">
            Email này được gửi tự động từ website httechvietnam.vn
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Lỗi gửi email thực tế:", err);
    return NextResponse.json({ error: "Không thể gửi email" }, { status: 500 });
  }
}
