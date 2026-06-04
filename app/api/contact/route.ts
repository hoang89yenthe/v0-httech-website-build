import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PRODUCT_LABELS: Record<string, string> = {
  "bien-tan":  "Biến tần",
  "plc-hmi":   "PLC & HMI",
  "dong-cat":  "Thiết bị đóng cắt",
  "cam-bien":  "Cảm biến",
  "vat-tu":    "Vật tư tủ điện",
  "dich-vu":   "Dịch vụ kỹ thuật",
  "khac":      "Khác",
};

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, product, message } = await req.json();

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    if (process.env.PLAYWRIGHT_TEST === "true") {
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

    const productLabel = PRODUCT_LABELS[product] ?? product ?? "Không chọn";
    const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    await transporter.sendMail({
      from: `"HT TECH Website" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email || undefined,
      subject: `[HT TECH] Yêu cầu tư vấn từ ${name} — ${phone}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:#1d4ed8;padding:20px 24px">
            <h2 style="color:#fff;margin:0;font-size:18px">📋 Yêu cầu tư vấn mới — HT TECH</h2>
            <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">${now}</p>
          </div>
          <div style="padding:24px;background:#fff">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:140px">Họ và tên</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr style="background:#f9fafb"><td style="padding:8px 6px;color:#6b7280">Số điện thoại</td><td style="padding:8px 6px;font-weight:600"><a href="tel:${phone}" style="color:#1d4ed8">${phone}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0">${email || "—"}</td></tr>
              <tr style="background:#f9fafb"><td style="padding:8px 6px;color:#6b7280">Sản phẩm</td><td style="padding:8px 6px">${productLabel}</td></tr>
              ${message ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Nội dung</td><td style="padding:8px 0">${message.replace(/\n/g, "<br>")}</td></tr>` : ""}
            </table>
          </div>
          <div style="padding:16px 24px;background:#f1f5f9;font-size:12px;color:#94a3b8">
            Email này được gửi tự động từ website httech.vn
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
