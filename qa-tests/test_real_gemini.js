const fs = require('fs');

async function testRealGemini() {
  console.log("🚀 [QA] Bắt đầu kiểm thử tích hợp thực tế với Gemini API qua Local Server...");
  
  const payload = {
    message: "HTtech có cung cấp biến tần Siemens V20 không?",
    history: []
  };

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log(`📡 [QA] HTTP Status nhận được: ${response.status}`);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ [QA] Kiểm thử thành công! Phản hồi từ Trợ lý ảo HTtech:");
      console.log("--------------------------------------------------------------------------------");
      console.log(data.text);
      console.log("--------------------------------------------------------------------------------");
    } else {
      console.error("❌ [QA] Kiểm thử thất bại!");
      console.error(data);
    }
  } catch (error) {
    console.error("❌ [QA] Lỗi kết nối đến máy chủ local:", error.message);
  }
}

testRealGemini();
