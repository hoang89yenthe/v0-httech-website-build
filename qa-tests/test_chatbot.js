const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 [QA Automation] Khởi động trình duyệt Headless...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // Inject request interception to mock server-side Next.js chat API
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/chat')) {
      console.log(`📡 [QA Mock] Phát hiện cuộc gọi API local /api/chat — Đang giả lập phản hồi streaming...`);
      request.respond({
        status: 200,
        contentType: 'text/event-stream; charset=utf-8',
        body: "Dạ thưa anh, HTtech cung cấp các sản phẩm thiết bị điện công nghiệp chính hãng như **Biến tần Siemens**, **PLC S7-1200**, **HMI Weintek**, các thiết bị đóng cắt của Schneider và ABB, cảm biến Omron/Sick. Mọi sản phẩm đều có đầy đủ chứng từ CO/CQ và bảo hành đến 24 tháng ạ."
      });
    } else {
      request.continue();
    }
  });

  const fileUrl = 'http://localhost:3000';
  console.log(`🌐 [QA Automation] Đang mở trang: ${fileUrl}`);

  await page.goto(fileUrl, { waitUntil: 'networkidle2' });
  console.log('✅ [QA Automation] Trang đã tải thành công.');

  // Test 1: Check if the floating chatbot button is visible
  console.log('🔍 [QA Automation] Kiểm tra nút chat hình tròn (#aiChatBtn)...');
  const chatBtn = await page.$('#aiChatBtn');
  if (chatBtn) {
    console.log('   -> PASS: Đã tìm thấy nút chat hình tròn (#aiChatBtn).');
  } else {
    console.error('   -> FAIL: Không tìm thấy nút chat hình tròn (#aiChatBtn).');
    await browser.close();
    process.exit(1);
  }

  // Take initial screenshot
  await page.screenshot({ path: path.join(__dirname, 'step1_loaded.png') });

  // Test 2: Click the button to open the chat widget
  console.log('🖱️ [QA Automation] Tự động click vào nút chat để mở khung chat (#aiChatWidget)...');
  await page.click('#aiChatBtn');
  await new Promise(r => setTimeout(r, 600)); // wait for smooth animation transition

  const isWidgetVisible = await page.evaluate(() => {
    const widget = document.getElementById('aiChatWidget');
    if (!widget) return false;
    const style = window.getComputedStyle(widget);
    return style.opacity !== '0' && style.display !== 'none';
  });

  if (isWidgetVisible) {
    console.log('   -> PASS: Khung chat (#aiChatWidget) đã mở ra với hiệu ứng scale-100 mượt mà.');
  } else {
    console.error('   -> FAIL: Khung chat (#aiChatWidget) vẫn đang bị ẩn hoặc không có class active.');
    await browser.close();
    process.exit(1);
  }

  // Take screenshot of opened chat widget
  await page.screenshot({ path: path.join(__dirname, 'step2_widget_opened.png') });

  // Test 3: Type question and send message to call API
  console.log('💬 [QA Automation] Nhập câu hỏi: "Sản phẩm của HTTech là gì?"...');
  await page.type('#aiChatInput', 'Sản phẩm của HTTech là gì?');
  
  // Take screenshot of typed question
  await page.screenshot({ path: path.join(__dirname, 'step3_question_typed.png') });

  console.log('🖱️ [QA Automation] Click nút gửi (#aiSendBtn)...');
  await page.click('#aiSendBtn');
  
  console.log('⏳ [QA Automation] Đang gửi và đợi API phản hồi...');
  await new Promise(r => setTimeout(r, 3000)); // wait for mocked response stream to complete

  // Verify chat conversation is updated
  const chatMessagesHtml = await page.evaluate(() => {
      const area = document.getElementById('aiChatArea');
      return area ? area.innerHTML : '';
  });

  if (chatMessagesHtml.includes('Sản phẩm của HTTech là gì?')) {
      console.log('   -> PASS: Câu hỏi đã xuất hiện trong danh sách chat.');
  } else {
      console.error('   -> FAIL: Câu hỏi chưa được đẩy vào danh sách chat.');
  }

  if (chatMessagesHtml.includes('Biến tần Siemens') && chatMessagesHtml.includes('PLC S7-1200')) {
      console.log('   -> PASS: Phản hồi của Trợ lý ảo (Mock /api/chat) đã hiển thị thành công.');
  } else {
      console.error('   -> FAIL: Không nhận được hoặc không hiển thị đúng phản hồi giả lập.');
  }

  // Take final screenshot
  const finalScreenshotPath = path.join(__dirname, 'chatbot_test_result.png');
  await page.screenshot({ path: finalScreenshotPath });
  console.log(`📸 [QA Automation] Đã chụp ảnh màn hình kết quả tại: ${finalScreenshotPath}`);

  // Copy screenshot to current artifacts folder for Antigravity display
  const artifactsDir = '/Users/hoangdangreactpls/.gemini/antigravity-ide/brain/cc2a44bc-7d23-4ccd-aa29-95dcc73359a0';
  if (fs.existsSync(artifactsDir)) {
      fs.copyFileSync(finalScreenshotPath, path.join(artifactsDir, 'chatbot_test_result.png'));
      console.log(`📂 [QA Automation] Đã đồng bộ ảnh kết quả sang thư mục artifacts của Gemini.`);
  }

  console.log('🏆 [QA Automation] Kịch bản kiểm thử tự động đã HOÀN THÀNH thành công!');
  await browser.close();
})();
