import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:3001/test-clerk', { waitUntil: 'domcontentloaded' });
  
  // Wait a little bit for rendering just in case
  await new Promise(r => setTimeout(r, 1000));
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT:", text);
  
  await browser.close();
})();
