const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 [Production Test] Bắt đầu chạy kiểm thử tự động trên https://httechvietnam.vn ...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const results = [];

  // Helper to push results
  const logResult = (name, status, details) => {
    results.push({ name, status, details });
    console.log(`   -> [${status}] ${name}: ${details}`);
  };

  try {
    // 1. Kiểm tra tải trang chủ & Tiêu đề
    const response = await page.goto('https://httechvietnam.vn', { waitUntil: 'networkidle2' });
    const status = response.status();
    const title = await page.title();
    
    if (status === 200) {
      logResult('Tải trang chủ (HTTP 200)', 'PASS', `Tiêu đề: "${title}"`);
    } else {
      logResult('Tải trang chủ (HTTP 200)', 'FAIL', `Mã phản hồi: ${status}`);
    }

    // 2. Kiểm tra Canonical URL
    const canonical = await page.evaluate(() => {
      const link = document.querySelector('link[rel="canonical"]');
      return link ? link.getAttribute('href') : null;
    });
    if (canonical === 'https://httechvietnam.vn/') {
      logResult('Thẻ Canonical URL', 'PASS', `Canonical trỏ đúng về: ${canonical}`);
    } else {
      logResult('Thẻ Canonical URL', 'FAIL', `Canonical sai hoặc thiếu: ${canonical}`);
    }

    // 3. Kiểm tra số lượng thẻ h1
    const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
    const h1Text = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText.trim() : 'N/A';
    });
    if (h1Count === 1) {
      logResult('Số lượng thẻ H1', 'PASS', `Có duy nhất 1 thẻ H1: "${h1Text}"`);
    } else {
      logResult('Số lượng thẻ H1', 'FAIL', `Số lượng thẻ H1 sai chuẩn: ${h1Count} thẻ`);
    }

    // 4. Kiểm duyệt thuộc tính alt của ảnh (A11y & SEO)
    const imageAudit = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const missing = images.filter(img => !img.getAttribute('alt') || img.getAttribute('alt').trim() === '');
      return {
        total: images.length,
        missingCount: missing.length,
        missingSrcs: missing.map(img => img.getAttribute('src') || 'no-src')
      };
    });
    if (imageAudit.missingCount === 0) {
      logResult('Mô tả hình ảnh (Alt tags)', 'PASS', `100% ảnh (${imageAudit.total}/${imageAudit.total}) có mô tả alt.`);
    } else {
      logResult('Mô tả hình ảnh (Alt tags)', 'WARNING', `Có ${imageAudit.missingCount}/${imageAudit.total} ảnh thiếu mô tả alt.`);
    }

    // 5. Kiểm tra sự tồn tại của Chatbot Widget
    const chatbotBtn = await page.$('#aiChatBtn');
    if (chatbotBtn) {
      logResult('Chatbot Widget Button', 'PASS', 'Nút mở Chatbot (#aiChatBtn) tồn tại trên giao diện.');
    } else {
      logResult('Chatbot Widget Button', 'FAIL', 'Không tìm thấy nút mở Chatbot (#aiChatBtn).');
    }

    // 6. Chụp ảnh màn hình Live Production
    const screenshotPath = path.join(__dirname, 'production_homepage.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Sao chép sang thư mục artifacts của Gemini để hiển thị
    const artifactsDir = '/Users/hoangdangreactpls/.gemini/antigravity-ide/brain/cc2a44bc-7d23-4ccd-aa29-95dcc73359a0';
    if (fs.existsSync(artifactsDir)) {
      fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'production_homepage.png'));
    }
    logResult('Chụp ảnh màn hình Production', 'PASS', `Đã lưu ảnh và đồng bộ sang artifacts.`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình kiểm thử trang chủ:', error);
    logResult('Lỗi thực thi kiểm thử', 'FAIL', error.message);
  }

  // 7. Kiểm tra Robots.txt và Sitemap.xml
  try {
    const robotsResponse = await page.goto('https://httechvietnam.vn/robots.txt');
    const robotsText = await robotsResponse.text();
    if (robotsResponse.status() === 200 && robotsText.includes('Sitemap:')) {
      logResult('Kiểm tra Robots.txt', 'PASS', 'Robots.txt hoạt động và chứa đường dẫn Sitemap.');
    } else {
      logResult('Kiểm tra Robots.txt', 'FAIL', `Robots.txt không hợp lệ (Status: ${robotsResponse.status()})`);
    }

    const sitemapResponse = await page.goto('https://httechvietnam.vn/sitemap.xml');
    const sitemapText = await sitemapResponse.text();
    if (sitemapResponse.status() === 200 && sitemapText.includes('https://httechvietnam.vn')) {
      logResult('Kiểm tra Sitemap.xml', 'PASS', 'Sitemap.xml hợp lệ và chứa danh sách URL domain chính.');
    } else {
      logResult('Kiểm tra Sitemap.xml', 'FAIL', `Sitemap.xml không hợp lệ (Status: ${sitemapResponse.status()})`);
    }
  } catch (error) {
    console.error('❌ Lỗi trong quá trình kiểm thử Robots/Sitemap:', error);
    logResult('Lỗi kiểm thử SEO file', 'FAIL', error.message);
  }

  await browser.close();
  console.log('\n🏆 [Production Test] Hoàn thành toàn bộ kịch bản kiểm thử!');
  
  // Viết kết quả ra file markdown kết quả để Antigravity đọc và hiển thị
  const reportPath = path.join(__dirname, 'production_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📂 Báo cáo lưu tại: ${reportPath}`);
})();
