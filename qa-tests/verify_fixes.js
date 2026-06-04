const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const navHrefs = await page.$$eval('header nav a', links => links.map(a => a.getAttribute('href')));
  console.log('Nav hrefs:', navHrefs);

  const brandName = await page.$eval('header .text-lg.font-bold', el => el.textContent);
  console.log('Brand in header:', brandName);

  await page.goto('http://localhost:3000/san-pham', { waitUntil: 'networkidle2' });
  const sanPhamNavHrefs = await page.$$eval('header nav a', links => links.map(a => a.getAttribute('href')));
  console.log('Nav on /san-pham:', sanPhamNavHrefs);

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.type('input[name="name"]', 'Test');
  await page.type('input[name="phone"]', '0909000000');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  const successText = await page.$eval('section#contact', el => el.innerText).catch(() => '');
  console.log('Contact section innerText:', successText);
  console.log('Contact section after submit contains "thành công":', successText.toLowerCase().includes('thành công'));

  await page.screenshot({ path: path.join(__dirname, 'after_fixes.png'), fullPage: true });
  await browser.close();
})().catch(e => console.error(e));
