async function testStreamApi() {
  console.log("🚀 [QA] Bắt đầu kiểm thử tích hợp Streaming API...");
  
  const payload = {
    message: "Hãy viết 1 danh sách 3 sản phẩm chính của HTtech và thông số của chúng.",
    history: []
  };

  try {
    const start = Date.now();
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log(`📡 [QA] HTTP Status nhận được: ${response.status}`);
    console.log(`Header Content-Type: ${response.headers.get("content-type")}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [QA] Phản hồi lỗi API:`, errorText);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let fullText = "";
    let chunkCount = 0;
    let firstChunkTime = null;

    console.log("--- BẮT ĐẦU NHẬN LUỒNG DỮ LIỆU (STREAM) ---");
    
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        if (chunkCount === 0) {
          firstChunkTime = Date.now() - start;
          console.log(`⏱️ Thời gian nhận chunk đầu tiên (TTFB): ${(firstChunkTime / 1000).toFixed(2)} giây`);
        }
        
        const chunk = decoder.decode(value, { stream: true });
        process.stdout.write(chunk);
        fullText += chunk;
        chunkCount++;
      }
    }
    
    console.log("\n--- KẾT THÚC NHẬN LUỒNG DỮ LIỆU ---");
    const totalDuration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`⏱️ Tổng thời gian hoàn thành: ${totalDuration} giây`);
    console.log(`📦 Tổng số chunks nhận được: ${chunkCount}`);
    console.log(`📝 Tổng độ dài phản hồi: ${fullText.length} ký tự. Số từ: ${fullText.split(/\s+/).length}`);
    
    if (fullText.length > 50 && !fullText.includes("error")) {
      console.log("✅ [QA] Kiểm thử Streaming API thành công hoàn toàn!");
    } else {
      console.error("❌ [QA] Kiểm thử thất bại: Phản hồi quá ngắn hoặc chứa lỗi.");
    }
  } catch (error) {
    console.error("❌ [QA] Lỗi kết nối đến máy chủ local:", error.message);
  }
}

testStreamApi();
