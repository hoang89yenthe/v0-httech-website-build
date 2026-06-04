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

    if (message.length > 2000) {
      return NextResponse.json({ error: "Tin nhắn quá dài (tối đa 2000 ký tự)" }, { status: 400 });
    }

    if (!Array.isArray(history) || history.length > 100) {
      return NextResponse.json({ error: "Dữ liệu lịch sử không hợp lệ" }, { status: 400 });
    }

    // 1. Kiểm tra xem có đang chạy E2E test tự động không
    if (process.env.PLAYWRIGHT_TEST === "true") {
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

    let response = await startStream("gemini-flash-latest");

    // Tự động chuyển đổi nếu model chính gặp lỗi quá tải (HTTP 503 / 429) và không phải lỗi hết tiền
    if (!response.ok && (response.status === 503 || response.status === 429)) {
      const errorData = await response.clone().json().catch(() => ({}));
      const errMsg = errorData.error?.message || "";
      const isBillingError = errMsg.toLowerCase().includes("prepayment") ||
                             errMsg.toLowerCase().includes("credit") ||
                             errMsg.toLowerCase().includes("deplete") ||
                             errMsg.toLowerCase().includes("billing");

      if (!isBillingError) {
        console.warn("Gemini-flash-latest bị quá tải hoặc lỗi tạm thời, chuyển sang Gemini 3.5 Flash...");
        response = await startStream("gemini-3.5-flash");
      }
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData.error?.message || "";
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
