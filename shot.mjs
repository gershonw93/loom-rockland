import { chromium } from 'playwright';
let browser;
try { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
catch { browser = await chromium.launch(); }
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil:'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);
const footer = await page.$('.site-footer');
await footer.screenshot({ path: 'footer.png' });
const hasEmail = await page.locator('text=loomrockland@gmail.com').count();
console.log('email occurrences on page:', hasEmail);
await browser.close();
