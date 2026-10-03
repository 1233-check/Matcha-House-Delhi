const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  
  // Scroll down by 800px
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(500); // Wait for scroll
  
  await page.screenshot({ path: 'scroll1.png' });
  
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scroll2.png' });

  await browser.close();
})();
