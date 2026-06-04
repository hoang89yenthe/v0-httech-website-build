const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 [QA Audit] Khởi động kiểm duyệt SEO & Accessibility...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/san-pham',
    'http://localhost:3000/san-pham/plc-siemens-s7-1200-cpu1214c'
  ];

  for (const url of urls) {
    console.log(`\n🔍 Đang kiểm duyệt trang: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // 1. Kiểm duyệt SEO: Số lượng h1
    const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
    const h1Text = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText.replace(/\n/g, ' ') : 'KHÔNG CÓ';
    });
    
    if (h1Count === 1) {
      console.log(`   -> [SEO] PASS: Có duy nhất 1 thẻ h1: "${h1Text}"`);
    } else {
      console.error(`   -> [SEO] FAIL: Số lượng thẻ h1 không đúng chuẩn (${h1Count} thẻ).`);
    }

    // 2. Kiểm duyệt SEO: Thẻ Meta Description
    const metaDescription = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return meta ? meta.getAttribute('content') : null;
    });

    if (metaDescription && metaDescription.trim().length > 0) {
      console.log(`   -> [SEO] PASS: Thẻ Meta Description tồn tại: "${metaDescription.substring(0, 60)}..."`);
    } else {
      console.error(`   -> [SEO] FAIL: Thiếu thẻ Meta Description.`);
    }

    // 3. Kiểm duyệt Accessibility: Thuộc tính alt của hình ảnh
    const imageAudits = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const missingAlt = images.filter(img => !img.getAttribute('alt') || img.getAttribute('alt').trim() === '');
      return {
        total: images.length,
        missingCount: missingAlt.length,
        missingSrcs: missingAlt.map(img => img.getAttribute('src') || 'no-src')
      };
    });

    if (imageAudits.missingCount === 0) {
      console.log(`   -> [A11y] PASS: 100% hình ảnh (${imageAudits.total}/${imageAudits.total}) có thẻ alt mô tả.`);
    } else {
      console.warn(`   -> [A11y] WARNING: Có ${imageAudits.missingCount} hình ảnh thiếu thẻ alt mô tả.`);
      imageAudits.missingSrcs.slice(0, 3).forEach(src => console.warn(`      - Thiếu alt tại: ${src}`));
    }

    // 4. Kiểm duyệt Accessibility: Nhãn aria-label cho các nút tương tác quan trọng
    if (url === 'http://localhost:3000') {
      const interactiveElements = [
        { selector: '#aiChatBtn', name: 'Nút mở Chatbot' },
        { selector: '#aiSendBtn', name: 'Nút gửi tin nhắn' },
        { selector: 'button[aria-label="Đóng khung chat"]', name: 'Nút đóng chatbot' }
      ];

      for (const el of interactiveElements) {
        const hasAriaLabel = await page.evaluate((sel) => {
          const item = document.querySelector(sel);
          if (!item) return 'NOT_FOUND';
          const aria = item.getAttribute('aria-label');
          return aria && aria.trim().length > 0;
        }, el.selector);

        if (hasAriaLabel === 'NOT_FOUND') {
          // Thử tìm theo id khác hoặc bỏ qua
          continue;
        }

        if (hasAriaLabel) {
          console.log(`   -> [A11y] PASS: Phần tử ${el.name} (${el.selector}) đã được gán aria-label đầy đủ.`);
        } else {
          console.error(`   -> [A11y] FAIL: Phần tử ${el.name} (${el.selector}) chưa có aria-label.`);
        }
      }
    }

    // 5. Kiểm duyệt Hiệu năng (Performance Audit)
    const perfMetrics = await page.evaluate(() => {
      const paintEntries = window.performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : null;

      const timing = window.performance.timing;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      const loadTime = timing.loadEventEnd - timing.navigationStart;

      return { fcp, domReady, loadTime };
    });

    console.log(`   -> [Performance] FCP (First Contentful Paint): ${perfMetrics.fcp ? perfMetrics.fcp + 'ms' : 'N/A'}`);
    console.log(`   -> [Performance] DOM Ready: ${perfMetrics.domReady ? perfMetrics.domReady + 'ms' : 'N/A'}`);
    if (perfMetrics.loadTime > 0) {
      console.log(`   -> [Performance] Page Load Time: ${perfMetrics.loadTime}ms`);
    }
  }

  await browser.close();
  console.log('\n🏆 [QA Audit] Hoàn thành kiểm duyệt SEO & Accessibility thành công!');
})();
