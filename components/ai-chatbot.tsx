"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Settings, X, Send, Eye, EyeOff, Trash2 } from "lucide-react";
import { PHONE, ZALO, formatPhoneDisplay } from "@/lib/constants";

// System Instruction context compiled from website brand info (Bắc Ninh branch)
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

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [configStatus, setConfigStatus] = useState({ text: "", type: "" }); // type: "success" | "error"
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Xin chào! Em là **Trợ lý ảo HTtech**. Em có thể giúp gì cho anh/chị về sản phẩm thiết bị điện công nghiệp (biến tần, PLC, HMI, cảm biến, thiết bị đóng cắt) hoặc thiết kế thi công tủ điện tự động hóa ạ?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load API Key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("GEMINI_API_KEY") || "";
    setApiKey(savedKey);
    setHasApiKey(!!savedKey);
  }, []);

  // Toggle class on body to allow hiding other floating CTAs when chat widget is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("ai-chat-open");
    } else {
      document.body.classList.remove("ai-chat-open");
    }
    return () => document.body.classList.remove("ai-chat-open");
  }, [isOpen]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleToggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleSaveApiKey = () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setConfigStatus({ text: "Vui lòng nhập API Key", type: "error" });
      return;
    }
    localStorage.setItem("GEMINI_API_KEY", trimmedKey);
    setHasApiKey(true);
    setConfigStatus({ text: "Đã lưu API Key thành công!", type: "success" });
    setTimeout(() => {
      setShowConfig(false);
      setConfigStatus({ text: "", type: "" });
    }, 3000);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("GEMINI_API_KEY");
    setApiKey("");
    setHasApiKey(false);
    setConfigStatus({ text: "Đã xóa API Key thành công!", type: "success" });
    setTimeout(() => {
      setConfigStatus({ text: "", type: "" });
    }, 1000);
  };

  // Convert custom simplified Markdown to HTML safely (fully robust)
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    try {
      let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      // Bold text **...**
      html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      // Bullet points
      const lines = html.split("\n");
      let inList = false;
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith("- ") || line.startsWith("* ")) {
          if (!inList) {
            lines[i] = '<ul class="list-disc pl-5 my-1.5 space-y-1">' + lines[i];
            inList = true;
          }
          lines[i] = lines[i].replace(/^[-*]\s+/, "<li>") + "</li>";
        } else {
          if (inList) {
            lines[i-1] += "</ul>";
            inList = false;
          }
        }
      }
      if (inList) {
        lines[lines.length-1] += "</ul>";
      }

      return lines.join("<br>");
    } catch (e) {
      console.error("Markdown parse error:", e);
      return text;
    }
  };

  const fetchGeminiResponse = async (userMsg: string, history: Message[]) => {
    const key = localStorage.getItem("GEMINI_API_KEY");
    if (!key) {
      throw new Error("KEY_MISSING");
    }

    // Filter out system instructions AND the very first welcome message of model (Gemini requires first message in contents to be user!)
    const contents = history
      .filter((m, idx) => m.role !== "system" && !(idx === 0 && m.role === "model"))
      .map((m) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

    contents.push({
      role: "user",
      parts: [{ text: userMsg }],
    });

    const tryModel = async (modelName: string) => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`,
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

    // First attempt: try gemini-2.5-flash
    let result = await tryModel("gemini-2.5-flash");

    // Fallback: if failed due to overloaded/rate limits, try gemini-1.5-flash
    if (
      !result.ok &&
      (result.status === 503 ||
        result.status === 429 ||
        result.message?.includes("high demand") ||
        result.message?.includes("overloaded"))
    ) {
      console.warn("Gemini 2.5 Flash is overloaded. Falling back to Gemini 1.5 Flash...");
      result = await tryModel("gemini-1.5-flash");
    }

    if (!result.ok) {
      throw new Error(result.message || "Có lỗi xảy ra khi gọi Gemini API.");
    }

    return result.text;
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    if (!hasApiKey) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: messageText },
      ]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "⚠️ Cảnh báo: Bạn chưa cấu hình `GEMINI_API_KEY`. \n\nVui lòng bấm vào biểu tượng bánh răng (⚙️) ở góc phải trên cùng của khung chat để điền API Key trước khi trò chuyện.",
          },
        ]);
      }, 600);
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: messageText }]);
    setIsTyping(true);

    try {
      const responseText = await fetchGeminiResponse(messageText, messages);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: responseText },
      ]);
    } catch (err: any) {
      setIsTyping(false);
      console.error(err);
      if (err.message === "KEY_MISSING") {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "⚠️ **Lỗi:** API Key chưa được cài đặt. Vui lòng nhập key bằng cách nhấn vào nút cài đặt (⚙️).",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: `❌ **Lỗi kết nối:** ${err.message}` },
        ]);
      }
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      {/* Backdrop mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chatbot Floating Button — ẩn trên mobile khi chat đang mở */}
      <button
        id="aiChatBtn"
        onClick={handleToggleChat}
        className={`fixed top-1/2 translate-y-[40px] right-6 w-14 h-14 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95 z-50 group ${isOpen ? "hidden" : "flex"}`}
        aria-label="Trợ lý ảo HTtech"
      >
        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
          <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
        </span>
        <MessageSquare className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
      </button>

      {/* AI Chat Widget */}
      <div
        id="aiChatWidget"
        className={`fixed z-50 bg-white shadow-2xl flex flex-col transition-all duration-300
          bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl rounded-b-none
          sm:bottom-24 sm:left-auto sm:right-6 sm:w-[380px] sm:h-[550px] sm:rounded-2xl sm:origin-bottom-right
          ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto sm:scale-100" : "translate-y-full opacity-0 pointer-events-none sm:translate-y-0 sm:scale-0"}
        `}
      >
        {/* Widget Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-3.5 rounded-t-2xl flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
              <span className="text-white font-bold text-sm">AI</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight text-white">Trợ lý ảo HTtech</h3>
              <p className="text-[10px] text-white/80 leading-none mt-0.5">Đang trực tuyến</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="aiChatConfigBtn"
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              title="Cấu hình API Key"
            >
              <Settings className="w-4 h-4 text-white" />
              <span
                id="aiChatKeyAlert"
                className={`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white ${
                  hasApiKey ? "hidden" : "block"
                }`}
              ></span>
            </button>
            <button
              id="aiChatCloseBtn"
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Đóng khung chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* API Config Drawer */}
        <div
          id="aiChatConfigDrawer"
          className={`absolute top-[68px] left-0 right-0 bg-slate-50 border-b border-slate-200 px-4 py-4 z-20 shadow-inner flex flex-col gap-3 transition-all duration-300 overflow-hidden ${
            showConfig ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>GEMINI API KEY</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-[10px] flex items-center gap-0.5 font-medium"
              >
                Lấy Key tại đây
              </a>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="aiApiKeyInput"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-9 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-800"
                />
                <button
                  type="button"
                  id="toggleShowKeyBtn"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                id="saveApiKeyBtn"
                onClick={handleSaveApiKey}
                className="bg-primary hover:bg-primary-light text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                Lưu
              </button>
              <button
                id="clearApiKeyBtn"
                onClick={handleClearApiKey}
                className="border border-red-200 hover:bg-red-50 text-red-600 p-2 rounded-lg transition-colors"
                title="Xóa Key"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div
            id="aiConfigStatus"
            className={`text-xs font-semibold text-center ${
              configStatus.text ? "block" : "hidden"
            } ${configStatus.type === "success" ? "text-green-600" : "text-red-600"}`}
          >
            {configStatus.text}
          </div>
        </div>

        {/* Chat Area */}
        <div
          id="aiChatArea"
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 scrollbar-thin scrollbar-thumb-slate-200"
        >
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-2.5 items-start animate-fade-in">
              {msg.role === "user" ? (
                <div className="flex gap-2.5 items-start justify-end w-full">
                  <div className="bg-primary text-white px-3.5 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-[80%] leading-relaxed break-words font-medium">
                    <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                    HT
                  </div>
                  <div className="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 max-w-[80%] leading-relaxed break-words">
                    <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
                  </div>
                </>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-start animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                HT
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div
          id="aiChatSuggestions"
          className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none"
        >
          <button
            onClick={() => handleSuggestionClick("HTtech cung cấp sản phẩm gì?")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium"
          >
            HTtech cung cấp sản phẩm gì?
          </button>
          <button
            onClick={() => handleSuggestionClick("Tư vấn dịch vụ tủ điện")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium"
          >
            Tư vấn dịch vụ tủ điện
          </button>
          <button
            onClick={() => handleSuggestionClick("Hotline liên hệ HTtech")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium"
          >
            Hotline liên hệ HTtech
          </button>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center rounded-b-2xl">
          <textarea
            id="aiChatInput"
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary resize-none max-h-24 scrollbar-none text-slate-800"
            placeholder="Nhập tin nhắn..."
          ></textarea>
          <button
            id="aiSendBtn"
            onClick={() => handleSendMessage()}
            className="w-9 h-9 bg-primary hover:bg-primary-light text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-primary/20 flex-shrink-0 hover:scale-105 active:scale-95"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4 transform rotate-90" />
          </button>
        </div>
      </div>
    </>
  );
}
