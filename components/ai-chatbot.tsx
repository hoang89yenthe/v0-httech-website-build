"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
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

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const userMessage: Message = { role: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          history: messages,
        }),
      });

      setIsTyping(false);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Lỗi kết nối đến tổng đài AI.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Không thể khởi tạo bộ đọc dữ liệu stream.");
      }

      // Thêm một tin nhắn trống làm placeholder cho bot
      setMessages((prev) => [...prev, { role: "model", text: "" }]);

      const decoder = new TextDecoder();
      let done = false;
      let botResponseText = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          // Kiểm tra xem chunk có phải là lỗi JSON gửi từ API không
          if (chunk.startsWith('{"error":')) {
            try {
              const parsed = JSON.parse(chunk);
              throw new Error(parsed.error);
            } catch (e: any) {
              throw new Error(e.message || "Lỗi xử lý luồng dữ liệu.");
            }
          }

          botResponseText += chunk;
          
          // Cập nhật nội dung tin nhắn cuối cùng (model placeholder) theo thời gian thực
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                role: "model",
                text: botResponseText,
              };
            }
            return updated;
          });
        }
      }
    } catch (err: any) {
      setIsTyping(false);
      console.error(err);
      
      // Cập nhật placeholder trống thành lỗi hoặc thêm tin nhắn lỗi mới
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === "model" && lastMsg.text === "") {
          updated[updated.length - 1] = {
            role: "model",
            text: `❌ **Lỗi:** ${err.message}`,
          };
          return updated;
        }
        return [...prev, { role: "model", text: `❌ **Lỗi:** ${err.message}` }];
      });
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
              id="aiChatCloseBtn"
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Đóng khung chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
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
            onClick={() => handleSuggestionClick("HTtech cung cấp những sản phẩm gì?")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium cursor-pointer"
          >
            Sản phẩm chính hãng
          </button>
          <button
            onClick={() => handleSuggestionClick("Tư vấn dịch vụ thiết kế và thi công tủ điện")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium cursor-pointer"
          >
            Thiết kế & Thi công tủ điện
          </button>
          <button
            onClick={() => handleSuggestionClick("Thông tin và thông số của Biến tần Siemens V20")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium cursor-pointer"
          >
            Biến tần Siemens V20
          </button>
          <button
            onClick={() => handleSuggestionClick("Tìm hiểu về PLC Siemens S7-1200 CPU 1214C")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium cursor-pointer"
          >
            PLC Siemens S7-1200
          </button>
          <button
            onClick={() => handleSuggestionClick("Tư vấn giải pháp nâng cấp hệ thống SCADA nhà máy")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium cursor-pointer"
          >
            Nâng cấp SCADA & IoT
          </button>
          <button
            onClick={() => handleSuggestionClick("Chính sách bảo hành thiết bị của HTtech")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium cursor-pointer"
          >
            Chính sách bảo hành
          </button>
          <button
            onClick={() => handleSuggestionClick("Thông tin Hotline liên hệ trực tiếp HTtech")}
            className="ai-suggestion-chip bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm flex-shrink-0 font-medium cursor-pointer"
          >
            Hotline liên hệ
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
