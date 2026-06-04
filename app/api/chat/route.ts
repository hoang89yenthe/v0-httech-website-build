import { NextRequest, NextResponse } from "next/server";
import { fetchProducts } from "@/lib/sanity/fetch";

const BASE_SYSTEM_INSTRUCTION = `Bạn là "Trợ lý ảo HTtech" - Chuyên viên tư vấn kỹ thuật tự động hóa chuyên nghiệp của công ty HT TECH (Kỹ Thuật Công Nghiệp).
Nhiệm vụ của bạn là tư vấn tận tình, chuyên nghiệp cho khách hàng về các sản phẩm và dịch vụ của HT TECH dựa trên thông tin chính xác dưới đây:

THÔNG TIN VỀ CÔNG TY HT TECH:
- Địa chỉ: CL13-16 KĐT Him Lam Green Park, Phường Võ Cường, Tỉnh Bắc Ninh, Việt Nam.
- Hotline hỗ trợ 24/7: 0972 916 382 | Zalo: 0972 916 382.
- Email liên hệ: Httechbn@gmail.com.
- Đặc điểm: Là đối tác tin cậy của hơn 500+ doanh nghiệp, đã hoàn thành 1000+ dự án với đội ngũ 50+ kỹ sư chuyên nghiệp. Hỗ trợ kỹ thuật 24/7 và bảo hành dài hạn lên đến 24 tháng.

DANH MỤC SẢN PHẨM CHÍNH HÃNG ĐANG CÓ TRÊN WEBSITE:
{CATALOG_TEXT}

DỊCH VỤ KỸ THUẬT CHUYÊN NGHIỆP:
1. Thiết kế & Thi công tủ điện: Lắp ráp tủ điện điều khiển PLC, tủ phân phối MDB/DB, tủ điện ATS/AMF theo tiêu chuẩn IEC quốc tế.
2. Nâng cấp hệ thống nhà máy: Cải tạo nâng cấp SCADA, tích hợp giải pháp IoT công nghiệp, nâng cấp dây chuyền sản xuất.
3. Bảo trì định kỳ: Bảo dưỡng thiết bị tự động hóa theo định kỳ hợp đồng.
4. Đào tạo kỹ thuật: Đào tạo vận hành và lập trình PLC, HMI cho kỹ sư của đối tác.

HƯỚNG DẪN ỨNG XỬ CHO TRỢ LÝ:
- Luôn chào khách hàng lịch sự bằng tiếng Việt, xưng hô thân thiện, chuyên nghiệp.
- Khi khách hàng hỏi về giá cả, hãy trả lời giá của các thiết bị và dịch vụ là "Liên hệ" (hoặc báo giá tùy thuộc quy mô) và hướng dẫn khách hàng để lại thông tin hoặc gọi điện trực tiếp tới Hotline 0972 916 382 / Zalo 0972 916 382 để các kỹ sư của HT TECH báo giá chính xác kèm các chương trình ưu đãi tốt nhất.
- Trình bày câu trả lời gọn gàng, sử dụng định dạng Markdown (như in đậm **, gạch đầu dòng -, hoặc xuống dòng) để khách hàng dễ đọc trên màn hình điện thoại hoặc máy tính.
- Tuyệt đối không bịa đặt các thông tin ngoài phạm vi tự động hóa và các sản phẩm dịch vụ của HT TECH. Nếu câu hỏi không liên quan, hãy hướng dẫn khách liên hệ hotline để được hỗ trợ tốt nhất.`;

// In-memory cache for dynamic products list to prevent overloading Sanity API
let cachedCatalogText = "";
let lastCacheTime = 0;
const CACHE_TTL = 300000; // 5 minutes

async function getDynamicCatalogText(): Promise<string> {
  const now = Date.now();
  if (cachedCatalogText && (now - lastCacheTime < CACHE_TTL)) {
    return cachedCatalogText;
  }

  try {
    const products = await fetchProducts();
    if (!products || products.length === 0) {
      return "Hiện tại danh mục sản phẩm đang được cập nhật. Vui lòng liên hệ Hotline 0972 916 382.";
    }

    // Group products by category
    const categories: { [key: string]: any[] } = {};
    products.forEach((p) => {
      const cat = p.category || "khác";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });

    // Format readable catalog text
    cachedCatalogText = Object.entries(categories)
      .map(([catName, items]) => {
        const displayCat = catName === "bien-tan" ? "1. Biến tần (Inverters)" :
                           catName === "plc-hmi" ? "2. PLC & HMI" :
                           catName === "dong-cat" ? "3. Thiết bị đóng cắt" :
                           catName === "cam-bien" ? "4. Cảm biến (Sensors)" :
                           catName === "vat-tu" ? "5. Vật tư tủ điện" : catName;
        
        const itemsText = items
          .map((item) => {
            const specList = item.specs ? item.specs.map((s: any) => `${s.label}: ${s.value}`).join(", ") : "";
            const priceText = item.price ? `${item.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ";
            const originalPriceText = item.originalPrice ? ` (Giá gốc: ${item.originalPrice.toLocaleString("vi-VN")} VNĐ)` : "";
            return `   - ${item.title} (Hãng: ${item.brand || "Chưa rõ"}, Giá bán: ${priceText}${originalPriceText}${specList ? `, Thông số: ${specList}` : ""}${item.description ? `, Mô tả: ${item.description}` : ""})`;
          })
          .join("\n");

        return `${displayCat}:\n${itemsText}`;
      })
      .join("\n\n");

    lastCacheTime = now;
    return cachedCatalogText;
  } catch (err) {
    console.error("Lỗi khi fetch sản phẩm cho chatbot system instruction:", err);
    return cachedCatalogText || "Đang tải danh mục sản phẩm...";
  }
}

interface Message {
  role: "user" | "model" | "system";
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Tin nhắn rỗng" }, { status: 400 });
    }

    // 1. Kiểm tra xem có đang chạy E2E test tự động không
    if (process.env.PLAYWRIGHT_TEST === "true") {
      console.log("[chat] Chế độ E2E Test: Trả về phản hồi mock thành công");
      return NextResponse.json({
        text: "Đây là phản hồi giả lập từ Trợ lý ảo HTtech trong môi trường kiểm thử Playwright. Hệ thống hoạt động tốt!",
      });
    }

    // 2. Lấy API Key từ biến môi trường của Server
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "mock" || apiKey.includes("your") || apiKey.includes("placeholder") || apiKey.includes("fake")) {
      console.warn("[chat] GEMINI_API_KEY chưa cấu hình hoặc sử dụng key giả lập. Trả về mock cảnh báo.");
      return NextResponse.json({
        text: "⚠️ Chào bạn, hiện tại quản trị viên chưa cấu hình `GEMINI_API_KEY` cho máy chủ. Vui lòng liên hệ Hotline 0972 916 382 để nhận tư vấn trực tiếp từ kỹ sư HT TECH.",
      });
    }

    // Lấy dữ liệu sản phẩm động từ Sanity hoặc cache
    const catalogText = await getDynamicCatalogText();
    const systemInstruction = BASE_SYSTEM_INSTRUCTION.replace("{CATALOG_TEXT}", catalogText);

    // 3. Chuẩn bị dữ liệu gửi lên Gemini API
    const contents = history
      .filter((m: Message, idx: number) => m.role !== "system" && !(idx === 0 && m.role === "model"))
      .map((m: Message) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const tryModel = async (modelName: string) => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 3000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || "";
        return { ok: false, status: response.status, message: errMsg };
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return { ok: true, text: responseText };
    };

    // Thử model chính gemini-flash-latest (cực kỳ ổn định và nhanh trên gói Free)
    let result = await tryModel("gemini-flash-latest");

    // Kiểm tra lỗi thanh toán/hết số dư từ Google AI Studio
    const isBillingError = !result.ok && (
      result.message?.toLowerCase().includes("prepayment") ||
      result.message?.toLowerCase().includes("credit") ||
      result.message?.toLowerCase().includes("deplete") ||
      result.message?.toLowerCase().includes("billing")
    );

    if (isBillingError) {
      console.error("[chat] Lỗi thanh toán Google AI Studio:", result.message);
      return NextResponse.json({
        text: "⚠️ Tài khoản Google AI Studio (Gemini) của bạn đang bị hết số dư trả trước (prepayment credits are depleted). Vui lòng truy cập https://aistudio.google.com/ để nạp thêm tiền hoặc chuyển dự án sang gói Miễn phí (Free Tier) để tiếp tục sử dụng.",
      });
    }

    // Nếu quá tải, tự động chuyển hướng sang gemini-3.5-flash
    if (
      !result.ok &&
      (result.status === 503 ||
        result.status === 429 ||
        result.message?.includes("high demand") ||
        result.message?.includes("overloaded"))
    ) {
      console.warn("Gemini-flash-latest bị quá tải, đang chuyển sang Gemini 3.5 Flash...");
      result = await tryModel("gemini-3.5-flash");
    }

    if (!result.ok) {
      throw new Error(result.message || "Lỗi kết nối Gemini API");
    }

    return NextResponse.json({ text: result.text });
  } catch (err: any) {
    console.error("[chat] Lỗi khi xử lý chat:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
