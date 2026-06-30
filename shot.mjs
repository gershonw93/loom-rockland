import { chromium } from 'playwright';
let browser;
try { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
catch { browser = await chromium.launch(); }
const page = await browser.newPage({ viewport: { width: 1200, height: 760 } });
await page.goto('http://localhost:3000/', { waitUntil:'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: 'hero.png' });
await browser.close();
