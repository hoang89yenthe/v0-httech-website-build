const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 [Screenshot Agent] Khởi động trình duyệt Headless...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();

  // Set a wide viewport to match a typical desktop monitor
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  const fileUrl = 'file://' + path.resolve(__dirname, '../v0-httech-website-build/public/index.html');
  console.log(`🌐 [Screenshot Agent] Đang mở: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Wait for fonts and images to settle
  await new Promise(r => setTimeout(r, 1500));

  // Smooth scroll simulation from top to bottom so lazy-loaded images render
  console.log('📜 [Screenshot Agent] Đang cuộn trang từ đầu đến cuối...');
  await page.evaluate(async () => {
    await new Promise(resolve => {
      const totalHeight = document.body.scrollHeight;
      const step = 300;
      let scrolled = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        scrolled += step;
        if (scrolled >= totalHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // scroll back to top for clean screenshot
          resolve();
        }
      }, 60);
    });
  });

  // Wait after scroll to let any scroll-triggered animations settle
  await new Promise(r => setTimeout(r, 1000));

  // Output paths
  const outputDir = path.resolve(__dirname, '../v0-httech-website-build/public');
  const outputPath = path.join(outputDir, 'full_landing_page.png');
  const artifactsPath = '/Users/hoangdangreactpls/.gemini/antigravity/brain/a60f2245-9c05-42b5-a837-f3553cb65977/full_landing_page.png';

  console.log('📸 [Screenshot Agent] Đang chụp ảnh toàn trang (full-page)...');
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png'
  });

  // Sync to artifacts directory for Antigravity display
  fs.copyFileSync(outputPath, artifactsPath);

  const stats = fs.statSync(outputPath);
  console.log(`✅ [Screenshot Agent] Đã lưu ảnh thành công!`);
  console.log(`   📁 Đường dẫn: ${outputPath}`);
  console.log(`   📐 Kích thước file: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`   📂 Artifacts: ${artifactsPath}`);

  await browser.close();
  console.log('🏆 [Screenshot Agent] Hoàn tất!');
})();
