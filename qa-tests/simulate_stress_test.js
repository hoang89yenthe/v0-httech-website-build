const puppeteer = require('puppeteer');
const path = require('path');

// Defined Stress-Test Scenario Questions
const SCENARIOS = {
  customerA: {
    name: "Khách A (Chủ DN - Chê Đắt)",
    questions: [
      "Tôi thấy thiết bị và tủ điện bên httech giá đắt quá! Sao tôi không tự mua linh kiện trên mạng về cho thợ tự đấu nối hoặc dùng mấy cái sơ đồ miễn phí trên mạng? Httech có cái gì xứng đáng để tôi trả số tiền lớn như vậy?",
      "Tự làm cùng lắm chỉ lỗi vặt thì sửa thôi, chứ mua biến tần Siemens với ABB bên bạn đắt gấp mấy lần hàng bãi Nhật. Bạn cam kết tiết kiệm 30% điện nhưng làm sao tôi tin được con số đó là thật hay chỉ là quảng cáo?",
      "Nếu tôi ký hợp đồng làm tủ điện và mua biến tần chỗ bạn mà sau này chạy không đạt chỉ tiêu tiết kiệm điện hoặc bị lỗi cháy hỏng động cơ thì httech có đền bù toàn bộ thiệt hại dây chuyền của tôi không? Nói cho rõ ràng xem nào!"
    ]
  },
  customerB: {
    name: "Khách B (Bác Năm - Mù Công Nghệ)",
    questions: [
      "Chào cháu, bác được giới thiệu qua đây. Mà bác đọc trên trang web thấy cái gì mà PLC rồi HMI với Modbus nghe nhức đầu quá. Bác muốn lắp cái máy bơm nước ở quê tự động tưới tiêu cho vườn cam mà không cần ra tận nơi bật tắt, cháu giải thích cho bác hiểu mấy cái từ đó là cái gì bằng tiếng Việt bình dân được không?",
      "À ra thế. Vậy còn cái 'biến tần' gì đó có cần thiết không cháu? Cái máy bơm nhà bác là loại mô-tơ cũ từ xưa rồi, giờ lắp thêm cái hộp biến tần đó vào có bị cháy máy hay nổ điện không bác sợ lắm?",
      "Cảm ơn cháu giải thích dễ hiểu quá. Bác muốn đặt một bộ tủ điện có cái biến tần đó để tưới cam tự động luôn. Nhưng bác ở tận Miền Tây, lỡ nó bị hư hay không biết xài thì các cháu có chạy xuống sửa cho ông già này không hay bác phải tự mang lên thành phố?"
    ]
  }
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const fileUrl = 'http://localhost:3000';
  console.log(`🌐 [Stress Test] Đang kết nối đến: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle2' });

  // Get API key from environment, or use a realistic simulation flag
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyFakeStressTestKey_HTtech12345";
  
  console.log(`⚙️ [Stress Test] Đang tự động cấu hình Mock API Key vào Chatbot UI...`);
  // Open config drawer and save key
  await page.click('#aiChatBtn');
  await page.waitForSelector('#aiChatConfigBtn', { visible: true });
  await page.click('#aiChatConfigBtn');
  await page.waitForSelector('#aiApiKeyInput', { visible: true });
  
  // Clear and type key
  await page.evaluate(() => document.getElementById('aiApiKeyInput').value = '');
  await page.type('#aiApiKeyInput', apiKey);
  await page.click('#saveApiKeyBtn');
  
  console.log(`✅ [Stress Test] Cấu hình hoàn tất! Bắt đầu mô phỏng kịch bản...`);

  // Helper function to send question and wait for response
  async function simulateChat(customerName, questions) {
    console.log(`\n======================================================`);
    console.log(`👥 MÔ PHỎNG: ${customerName}`);
    console.log(`======================================================`);
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(`💬 [Khách] Question ${i+1}: "${q}"`);
      
      // Type in the input
      await page.type('#aiChatInput', q);
      // Click send
      await page.click('#aiSendBtn');
      
      console.log(`⏳ Đang chờ Chatbot phản hồi...`);
      
      // Wait for typing indicator to disappear or new bubble to emerge
      await new Promise(r => setTimeout(r, 4500)); // Simulating network/API timing delay
      
      // Extract the last message from the chat container
      const response = await page.evaluate(() => {
        const bubbles = document.querySelectorAll('#aiChatArea > div');
        if (bubbles.length === 0) return "No response found.";
        // Find the last AI response (usually has dynamic background, let's find the last child text)
        const lastBubble = bubbles[bubbles.length - 1];
        return lastBubble ? lastBubble.innerText : "Error retrieving response text.";
      });
      
      console.log(`🤖 [Chatbot HTtech]:\n${response}\n`);
    }
  }

  // Run simulation for both customers
  try {
    await simulateChat(SCENARIOS.customerA.name, SCENARIOS.customerA.questions);
    await simulateChat(SCENARIOS.customerB.name, SCENARIOS.customerB.questions);
  } catch (error) {
    console.error("⚠️ Lỗi trong quá trình mô phỏng:", error.message);
  }

  await browser.close();
  console.log(`\n🏆 [Stress Test] Kịch bản hoàn thành xuất sắc!`);
})();
