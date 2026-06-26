// Screenshot helper for the visual redesign loop.
// Usage:  SHOOT_LABEL=before node scripts/shoot.mjs
// Captures full-page PNGs at desktop (1440) and mobile (390), plus viewport "slices"
// so fine detail (typography, spacing) is legible when reviewed.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'design-screenshots';
mkdirSync(OUT, { recursive: true });

const URL = process.env.SHOOT_URL || 'http://localhost:3000/';
const LABEL = process.env.SHOOT_LABEL || 'before';
const SLICES = process.env.SHOOT_SLICES !== '0';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

// Scroll the whole page to trigger framer-motion `whileInView` animations, then return to top.
async function settle(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, Math.round(window.innerHeight * 0.75));
        y += window.innerHeight * 0.75;
        if (y < document.body.scrollHeight + window.innerHeight) setTimeout(step, 220);
        else { window.scrollTo(0, 0); setTimeout(resolve, 700); }
      };
      step();
    });
  });
}

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  let loaded = false;
  for (let attempt = 0; attempt < 50 && !loaded; attempt++) {
    try {
      await page.goto(URL, { waitUntil: 'load', timeout: 180000 });
      loaded = true;
    } catch {
      await page.waitForTimeout(2000); // server still starting/compiling
    }
  }
  if (!loaded) throw new Error('could not load ' + URL);
  await page.waitForTimeout(4000); // hydration + fonts + TutorCruncher socket
  await settle(page);
  await page.waitForTimeout(800);

  await page.screenshot({ path: `${OUT}/${LABEL}-${vp.name}-full.png`, fullPage: true });
  console.log('saved', `${LABEL}-${vp.name}-full.png`);

  if (SLICES) {
    const total = await page.evaluate(() => document.body.scrollHeight);
    const vh = vp.height;
    const n = Math.ceil(total / vh);
    for (let i = 0; i < n; i++) {
      await page.evaluate((top) => window.scrollTo(0, top), i * vh);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/${LABEL}-${vp.name}-slice${String(i).padStart(2, '0')}.png` });
    }
    console.log('saved', n, `${vp.name} slices`);
  }
  await ctx.close();
}

await browser.close();
console.log('DONE');
