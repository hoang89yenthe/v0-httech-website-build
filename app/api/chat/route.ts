import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `Bạn là "Trợ lý ảo HTtech" - Chuyên viên tư vấn kỹ thuật tự động hóa chuyên nghiệp của công ty HT TECH (Kỹ Thuật Công Nghiệp).
Nhiệm vụ của bạn là tư vấn tận tình, chuyên nghiệp cho khách hàng về các sản phẩm và dịch vụ của HT TECH dựa trên thông tin chính xác dưới đây:

THÔNG TIN VỀ CÔNG TY HT TECH:
- Địa chỉ: CL13-16 KĐT Him Lam Green Park, Phường Võ Cường, Tỉnh Bắc Ninh, Việt Nam.
- Hotline hỗ trợ 24/7: 0972 916 382 | Zalo: 0972 916 382.
- Email liên hệ: Httechbn@gmail.com.
- Đặc điểm: Là đối tác tin cậy của hơn 500+ doanh nghiệp, đã hoàn thành 1000+ dự án với đội ngũ 50+ kỹ sư chuyên nghiệp. Hỗ trợ kỹ thuật 24/7 và bảo hành dài hạn lên đến 24 tháng.

DANH MỤC SẢN PHẨM CHÍNH HÃNG (Siemens, ABB, Mitsubishi, Schneider, Delta, Omron, Autonics, Weintek, Sick, Keyence, Cadivi):
1. Biến tần (Inverters):
   - Siemens SINAMICS V20 (1.5kW, 3 pha 380V, điều khiển chính xác, tiết kiệm điện 30%).
   - Biến tần ABB ACS580 (2.2kW, 3 pha 380V, tích hợp bộ lọc EMC, Modbus).
   - Biến tần Mitsubishi FR-E840 (2.2kW, 3 pha 400V, compact).
   - Biến tần Delta VFD-E (2.2kW, 3 pha 380V, tích hợp PLC).
   - Biến tần Schneider ATV320 (2.2kW, bơm quạt chuyên dụng).
   - Biến tần Siemens G120C (5.5kW, EMC Class A, Safety STO).
   - Biến tần ABB ACS880 (3.7kW, Industrial drive, tích hợp PLC).
   - Servo Mitsubishi MR-J4 (2kW, encoder 22-bit, SSCNET III/H).
2. PLC & HMI:
   - PLC Siemens S7-1200 CPU 1214C DC/DC/DC (14DI/10DO/2AI, 100KB, Profinet).
   - PLC Mitsubishi FX5U (32 I/O, 16DI/16DO, 64K steps, motion built-in).
   - HMI Siemens KTP700 Basic (7 inch TFT, 65K màu, 800x480).
   - HMI Weintek MT8071iE (7 inch TFT, Ethernet, COM, 128MB).
   - PLC Omron CP1E (40 I/O, 24DI/16DO, 8K steps).
   - PLC Siemens S7-1500 CPU 1515-2PN (hiệu năng cao cho ứng dụng phức tạp).
3. Thiết bị đóng cắt:
   - MCCB Schneider NSX100F (100A, 3P, 36kA).
   - ACB ABB Emax2 E1.2 (800A, 3P, 66kA, Ekip Touch).
   - Contactor Schneider LC1D25 (25A, coil 220VAC, 3P).
   - MCCB LS SUSOL TS400N (400A, 3P, 65kA).
   - Relay nhiệt Schneider LRD32 (dải chỉnh 23-32A).
4. Cảm biến (Sensors):
   - Cảm biến tiệm cận Omron E2E (Inductive M18, 5mm, NPN NO).
   - Cảm biến quang Sick WL12L (Phản xạ gương, 0-8m).
   - Cảm biến nhiệt độ PT100 (đầu dò 100mm, ren M8, -50~400°C).
   - Cảm biến áp suất Autonics (0-1MPa, ngõ ra 4-20mA).
   - Encoder Autonics E40H (1000 xung, Totem Pole, 12-24VDC).
   - Cảm biến Laser Keyence LR-Z (Laser Class 2, 35-250mm).
5. Vật tư tủ điện:
   - Thanh cái đồng 40x5mm, máng điện nhựa Omega 40x40, cầu đấu Phoenix UK5N (4mm², 32A), đầu cos đồng DT-50, dây điện CADIVI CV 2.5.

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

    // 3. Chuẩn bị dữ liệu gửi lên Gemini API
    // Loại bỏ tin nhắn system và tin nhắn chào mừng đầu tiên (Gemini yêu cầu tin nhắn đầu trong contents phải của user)
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
              parts: [{ text: SYSTEM_INSTRUCTION }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
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

    // Thử model chính gemini-2.5-flash
    let result = await tryModel("gemini-2.5-flash");

    // Nếu quá tải, tự động chuyển hướng sang gemini-1.5-flash
    if (
      !result.ok &&
      (result.status === 503 ||
        result.status === 429 ||
        result.message?.includes("high demand") ||
        result.message?.includes("overloaded"))
    ) {
      console.warn("Gemini 2.5 Flash bị quá tải, đang chuyển sang Gemini 1.5 Flash...");
      result = await tryModel("gemini-1.5-flash");
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
