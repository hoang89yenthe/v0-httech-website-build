import { NextRequest, NextResponse } from "next/server";
import { fetchProducts } from "@/lib/sanity/fetch";
import { rateLimit } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

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

const BASE_SYSTEM_INSTRUCTION_EN = `You are "HTtech Virtual Assistant" - a professional automation technical consultant of HT TECH (Industrial Engineering) company.
Your task is to provide dedicated, professional consulting to customers about HT TECH's products and services based on the accurate information below:

HT TECH COMPANY INFORMATION:
- Address: CL13-16 Him Lam Green Park, Vo Cuong Ward, Bac Ninh Province, Vietnam.
- 24/7 Support Hotline: 0972 916 382 | Zalo: 0972 916 382.
- Contact Email: Httechbn@gmail.com.
- Key figures: Trusted partner of 500+ enterprises, completed 1000+ projects with a team of 50+ professional engineers. 24/7 technical support and long-term warranty up to 24 months.

GENUINE PRODUCT CATALOG AVAILABLE ON WEBSITE:
{CATALOG_TEXT}

PROFESSIONAL TECHNICAL SERVICES:
1. Control Panel Design & Installation: Assembly of PLC control panels, main/sub distribution boards (MDB/DB), ATS/AMF panels according to international IEC standards.
2. Factory System Upgrades: Renovation and upgrading of SCADA systems, integration of industrial IoT solutions, upgrading of production lines.
3. Scheduled Maintenance: Periodic maintenance of automation equipment according to contract.
4. Technical Training: Operation and programming training of PLCs, HMIs for partner engineers.

RESPONSE GUIDELINES FOR THE ASSISTANT:
- Always greet customers politely in English (or the language they query in), using a friendly and professional tone.
- When customers ask about pricing, reply that the price for equipment and services is "Contact" (or quotation depends on scale) and guide them to leave their contact information or call the Hotline 0972 916 382 / Zalo 0972 916 382 to get an accurate quote and best promotions.
- Present answers neatly using Markdown formatting (bold **, bullet points -, line breaks) for readability on mobile and desktop screens.
- Do not make up information outside the scope of automation and HT TECH's products and services. If the question is unrelated, guide the customer to contact the hotline for best support.`;

// In-memory cache for dynamic products list to prevent overloading Sanity API
interface CacheEntry {
  text: string;
  time: number;
}
const catalogCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 300000; // 5 minutes

async function getDynamicCatalogText(locale: string = "vi"): Promise<string> {
  const now = Date.now();
  const cached = catalogCache[locale];
  if (cached && (now - cached.time < CACHE_TTL)) {
    return cached.text;
  }

  try {
    const products = await fetchProducts();
    if (!products || products.length === 0) {
      return locale === "en"
        ? "Currently the product catalog is being updated. Please contact Hotline 0972 916 382."
        : "Hiện tại danh mục sản phẩm đang được cập nhật. Vui lòng liên hệ Hotline 0972 916 382.";
    }

    // Group products by category
    const categories: { [key: string]: any[] } = {};
    products.forEach((p) => {
      const cat = p.category || "khác";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });

    // Format readable catalog text
    const text = Object.entries(categories)
      .map(([catName, items]) => {
        let displayCat = catName;
        if (locale === "en") {
          displayCat = catName === "bien-tan" ? "1. Inverters (VFD)" :
                       catName === "plc-hmi" ? "2. PLC & HMI" :
                       catName === "dong-cat" ? "3. Switchgear" :
                       catName === "cam-bien" ? "4. Sensors" :
                       catName === "vat-tu" ? "5. Panel Components" : catName;
        } else {
          displayCat = catName === "bien-tan" ? "1. Biến tần (Inverters)" :
                       catName === "plc-hmi" ? "2. PLC & HMI" :
                       catName === "dong-cat" ? "3. Thiết bị đóng cắt" :
                       catName === "cam-bien" ? "4. Cảm biến (Sensors)" :
                       catName === "vat-tu" ? "5. Vật tư tủ điện" : catName;
        }
        
        const itemsText = items
          .map((item) => {
            const title = locale === "en" ? (item.title_en || item.title) : item.title;
            const desc = locale === "en" ? (item.description_en || item.description) : item.description;
            const specs = locale === "en" ? (item.specs_en || item.specs) : item.specs;
            const specList = specs ? specs.map((s: any) => `${s.label}: ${s.value}`).join(", ") : "";
            
            const priceText = item.price
              ? (locale === "en" ? `${item.price.toLocaleString("en-US")} VND` : `${item.price.toLocaleString("vi-VN")} VNĐ`)
              : (locale === "en" ? "Contact" : "Liên hệ");
            
            const originalPriceText = item.price && item.originalPrice && item.originalPrice > item.price
              ? (locale === "en" ? ` (Original price: ${item.originalPrice.toLocaleString("en-US")} VND)` : ` (Giá gốc: ${item.originalPrice.toLocaleString("vi-VN")} VNĐ)`)
              : "";
              
            const brandLabel = locale === "en" ? "Brand" : "Hãng";
            const priceLabel = locale === "en" ? "Price" : "Giá bán";
            const specLabel = locale === "en" ? "Specs" : "Thông số";
            const descLabel = locale === "en" ? "Description" : "Mô tả";
            
            return `   - ${title} (${brandLabel}: ${item.brand || "N/A"}, ${priceLabel}: ${priceText}${originalPriceText}${specList ? `, ${specLabel}: ${specList}` : ""}${desc ? `, ${descLabel}: ${desc}` : ""})`;
          })
          .join("\n");

        return `${displayCat}:\n${itemsText}`;
      })
      .join("\n\n");

    catalogCache[locale] = { text, time: now };
    return text;
  } catch (err) {
    console.error("Lỗi khi fetch sản phẩm cho chatbot system instruction:", err);
    return catalogCache[locale]?.text || (locale === "en" ? "Loading product catalog..." : "Đang tải danh mục sản phẩm...");
  }
}

interface Message {
  role: "user" | "model" | "system";
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!validateOrigin(req)) {
      return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, retryAfterSec } = rateLimit(`chat:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
      );
    }

    const { message, history, locale = "vi" } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Tin nhắn rỗng" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: "Tin nhắn quá dài (tối đa 2000 ký tự)" }, { status: 400 });
    }

    if (!Array.isArray(history) || history.length > 100) {
      return NextResponse.json({ error: "Dữ liệu lịch sử không hợp lệ" }, { status: 400 });
    }

    // 1. Kiểm tra xem có đang chạy E2E test tự động không (chỉ cho phép ngoài production)
    if (process.env.PLAYWRIGHT_TEST === "true" && process.env.NODE_ENV !== "production") {
      console.log("[chat] Chế độ E2E Test: Trả về phản hồi mock thành công");
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode("Đây là phản hồi giả lập từ Trợ lý ảo HTtech trong môi trường kiểm thử Playwright. Hệ thống hoạt động tốt!"));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
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
    const catalogText = await getDynamicCatalogText(locale);
    const baseInstruction = locale === "en" ? BASE_SYSTEM_INSTRUCTION_EN : BASE_SYSTEM_INSTRUCTION;
    const systemInstruction = baseInstruction.replace("{CATALOG_TEXT}", catalogText);

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

    const startStream = async (modelName: string) => {
      return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${apiKey}`,
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
              maxOutputTokens: 8192,
              thinkingConfig: {
                thinkingBudget: 0
              }
            },
          }),
        }
      );
    };

    let response = await startStream("gemini-2.5-flash");

    // Tự động chuyển đổi nếu model chính gặp lỗi quá tải (HTTP 503 / 429) và không phải lỗi hết tiền
    if (!response.ok && (response.status === 503 || response.status === 429)) {
      const errorData = await response.clone().json().catch(() => ({}));
      const errObj = Array.isArray(errorData) ? errorData[0]?.error : errorData.error;
      const errMsg = errObj?.message || "";
      const isBillingError = errMsg.toLowerCase().includes("prepayment") ||
                             errMsg.toLowerCase().includes("credit") ||
                             errMsg.toLowerCase().includes("deplete") ||
                             errMsg.toLowerCase().includes("billing");

      if (!isBillingError) {
        console.warn("gemini-2.5-flash bị quá tải hoặc lỗi tạm thời, chuyển sang gemini-2.0-flash...");
        response = await startStream("gemini-2.0-flash");
      }
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errObj = Array.isArray(errorData) ? errorData[0]?.error : errorData.error;
            const errMsg = errObj?.message || "";
            const isBillingError = errMsg.toLowerCase().includes("prepayment") ||
                                   errMsg.toLowerCase().includes("credit") ||
                                   errMsg.toLowerCase().includes("deplete") ||
                                   errMsg.toLowerCase().includes("billing");

            const errorText = isBillingError
              ? "⚠️ Tài khoản Google AI Studio (Gemini) của bạn đang bị hết số dư trả trước (prepayment credits are depleted). Vui lòng nạp tiền tại https://aistudio.google.com/ hoặc đổi sang gói Miễn phí (Free Tier) để tiếp tục."
              : `⚠️ Lỗi máy chủ Gemini: ${errMsg || "Lỗi kết nối"}`;

            controller.enqueue(encoder.encode(JSON.stringify({ error: errorText })));
            controller.close();
            return;
          }

          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const { objects, remaining } = extractJsonObjects(buffer);
            buffer = remaining;

            for (const objStr of objects) {
              try {
                const parsed = JSON.parse(objStr);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (e) {
                console.error("Error parsing object in stream:", e);
              }
            }
          }

          // Xử lý nốt phần buffer còn lại
          buffer += decoder.decode();
          const { objects } = extractJsonObjects(buffer);
          for (const objStr of objects) {
            try {
              const parsed = JSON.parse(objStr);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (e) {
              console.error("Error parsing object in stream flush:", e);
            }
          }

          controller.close();
        } catch (err: any) {
          console.error("Error in streaming API controller:", err);
          controller.enqueue(encoder.encode(JSON.stringify({ error: err.message || "Lỗi máy chủ nội bộ" })));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("[chat] Lỗi khi xử lý chat:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

function extractJsonObjects(buffer: string): { objects: string[]; remaining: string } {
  const objects: string[] = [];
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let startIndex = -1;

  for (let i = 0; i < buffer.length; i++) {
    const char = buffer[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') {
        if (braceCount === 0) {
          startIndex = i;
        }
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0 && startIndex !== -1) {
          objects.push(buffer.slice(startIndex, i + 1));
          startIndex = -1;
        }
      }
    }
  }

  const remaining = startIndex !== -1 ? buffer.slice(startIndex) : "";
  return { objects, remaining };
}
