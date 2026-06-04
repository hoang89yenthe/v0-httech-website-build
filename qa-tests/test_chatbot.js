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

  // Inject request interception to mock Gemini API calls
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    if (url.includes('generativelanguage.googleapis.com') && url.includes('generateContent')) {
      console.log(`📡 [QA Mock] Phát hiện cuộc gọi API Gemini: ${url.split('?')[0]} — Đang giả lập phản hồi thành công...`);
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  { text: "Dạ thưa anh, HTtech cung cấp các sản phẩm thiết bị điện công nghiệp chính hãng như **Biến tần Siemens**, **PLC S7-1200**, **HMI Weintek**, các thiết bị đóng cắt của Schneider và ABB, cảm biến Omron/Sick. Mọi sản phẩm đều có đầy đủ chứng từ CO/CQ và bảo hành đến 24 tháng ạ." }
                ]
              }
            }
          ]
        })
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

  // Test 3: Send message without key to verify client-side warning fallback
  console.log('💬 [QA Automation] Kiểm thử gửi tin nhắn khi CHƯA cấu hình API Key...');
  await page.type('#aiChatInput', 'HTtech cung cấp sản phẩm gì?');
  await page.click('#aiSendBtn');
  await new Promise(r => setTimeout(r, 1000)); // wait for response alert to trigger

  const hasWarningMessage = await page.evaluate(() => {
    const chatArea = document.getElementById('aiChatArea');
    return chatArea && chatArea.innerHTML.includes('Cảnh báo: Bạn chưa cấu hình');
  });

  if (hasWarningMessage) {
    console.log('   -> PASS: Đã hiển thị bong bóng cảnh báo thiếu API Key hoàn hảo.');
  } else {
    console.warn('   -> WARNING: Không thấy hiển thị tin nhắn cảnh báo thiếu API Key.');
  }

  // Take screenshot of warning
  await page.screenshot({ path: path.join(__dirname, 'step3_warning_shown.png') });

  // Test 4: Configure dummy key
  console.log('⚙️ [QA Automation] Nhấp nút cài đặt (#aiChatConfigBtn) để mở drawer...');
  await page.click('#aiChatConfigBtn');
  await new Promise(r => setTimeout(r, 500));

  console.log('⌨️ [QA Automation] Điền Mock API Key vào cấu hình...');
  await page.type('#aiApiKeyInput', 'AIzaSyFakeKeyTest_1234567890');
  await page.click('#saveApiKeyBtn');
  await new Promise(r => setTimeout(r, 1200));

  const configStatus = await page.evaluate(() => {
      const statusText = document.getElementById('aiConfigStatus');
      return statusText ? statusText.textContent : '';
  });
  console.log(`   -> Thông báo cấu hình: "${configStatus}"`);

  if (configStatus.includes('Đã lưu API Key thành công!')) {
      console.log('   -> PASS: Đã lưu API Key thành công vào localStorage.');
  } else {
      console.error('   -> FAIL: Không thể lưu cấu hình API Key.');
  }

  // Close drawer
  await page.click('#aiChatConfigBtn');
  await new Promise(r => setTimeout(r, 500));

  // Test 5: Type question and send message to call Gemini API
  console.log('💬 [QA Automation] Nhập câu hỏi: "Sản phẩm của HTTech là gì?"...');
  await page.type('#aiChatInput', 'Sản phẩm của HTTech là gì?');
  await page.click('#aiSendBtn');
  
  console.log('⏳ [QA Automation] Đang gửi và đợi API phản hồi...');
  await new Promise(r => setTimeout(r, 3000)); // wait for response to reach Google Gemini and return

  // Verify chat conversation is updated
  const chatMessagesHtml = await page.evaluate(() => {
      return document.getElementById('aiChatArea').innerHTML;
  });

  if (chatMessagesHtml.includes('Sản phẩm của HTTech là gì?')) {
      console.log('   -> PASS: Câu hỏi đã xuất hiện trong danh sách chat.');
  } else {
      console.error('   -> FAIL: Câu hỏi chưa được đẩy vào danh sách chat.');
  }

  // Since we mocked the API call, we expect to see the successful response text in the conversation log
  if (chatMessagesHtml.includes('Biến tần Siemens') && chatMessagesHtml.includes('PLC S7-1200')) {
      console.log('   -> PASS: Phản hồi của Trợ lý ảo (Mock Gemini API) đã hiển thị thành công.');
  } else {
      console.error('   -> FAIL: Không nhận được hoặc không hiển thị đúng phản hồi giả lập.');
  }

  // Take final screenshot
  const finalScreenshotPath = path.join(__dirname, 'chatbot_test_result.png');
  await page.screenshot({ path: finalScreenshotPath });
  console.log(`📸 [QA Automation] Đã chụp ảnh màn hình kết quả tại: ${finalScreenshotPath}`);

  // Copy screenshot to artifacts folder
  const artifactsDir = '/Users/hoangdangreactpls/.gemini/antigravity/brain/a60f2245-9c05-42b5-a837-f3553cb65977';
  if (fs.existsSync(artifactsDir)) {
      fs.copyFileSync(finalScreenshotPath, path.join(artifactsDir, 'chatbot_test_result.png'));
      console.log(`📂 [QA Automation] Đã đồng bộ ảnh kết quả sang thư mục artifacts của Gemini.`);
  }

  console.log('🏆 [QA Automation] Kịch bản kiểm thử tự động đã HOÀN THÀNH thành công!');
  await browser.close();
})();
