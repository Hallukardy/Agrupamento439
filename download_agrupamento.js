/**
 * Downloads carousel/swimlane images from the Agrupamento page
 * Clicks through each carousel dot to reveal all photos
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'gallery');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function downloadWithBrowser(page, url, filepath) {
  const bytes = await page.evaluate(async (imgUrl) => {
    const res = await fetch(imgUrl, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    return Array.from(new Uint8Array(buf));
  }, url);
  const buffer = Buffer.from(bytes);
  if (buffer.length < 20000) throw new Error(`Too small: ${buffer.length}B`);
  fs.writeFileSync(filepath, buffer);
  return buffer.length;
}

function normalizeUrl(src) {
  return src.replace(/=(?:w|s)\d+[^"'\s)]*$/, '=w1280');
}

async function extractVisibleImages(page, knownUrls) {
  const found = await page.evaluate(() => {
    const urls = [];
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.getAttribute('data-src') || '';
      if ((src.includes('googleusercontent') || src.includes('lh3.google')) && img.offsetWidth > 0) {
        urls.push(src);
      }
    });
    return urls;
  });
  let added = 0;
  for (const src of found) {
    const normalized = normalizeUrl(src);
    if (!knownUrls.has(normalized)) {
      knownUrls.add(normalized);
      added++;
    }
  }
  return added;
}

async function run() {
  console.log('\n🚀 Launching Puppeteer...\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const allUrls = new Set();

  // Load existing gallery files to figure out next index
  const existingFiles = fs.readdirSync(outputDir).filter(f => /gallery-\d+\.jpg/.test(f));
  const usedIndices = existingFiles.map(f => parseInt(f.match(/\d+/)[0]));
  let nextIndex = usedIndices.length > 0 ? Math.max(...usedIndices) + 1 : 1;

  console.log(`📂 Existing gallery images: ${existingFiles.length} (next index: ${nextIndex})`);

  const targetUrl = 'https://sites.google.com/escutismo.pt/agrupamento0439/agrupamento';
  console.log(`\n🌐 Navigating to: ${targetUrl}`);

  await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // Scroll slowly to load lazy images and find carousels
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let pos = 0;
      const timer = setInterval(() => {
        pos += 400;
        window.scrollTo(0, pos);
        if (pos >= document.body.scrollHeight) { clearInterval(timer); resolve(); }
      }, 400);
    });
  });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));

  // Extract images from slide 1 of all carousels
  await extractVisibleImages(page, allUrls);
  console.log(`  After initial load: ${allUrls.size} images`);

  // Find all carousel dot containers and click each dot
  const carouselDots = await page.$$('div[role="listbox"] div[role="option"], .ZRnS4b, [data-index], .carousel-dot, li[aria-label]');
  console.log(`  Found ${carouselDots.length} carousel dots`);

  // Strategy: find all clickable dot elements (Google Sites uses specific classes)
  // Try multiple selectors for the dot indicators
  const dotSelectors = [
    'div[jsname="rVPFtd"]',   // Google Sites new carousel dots
    'div[role="tab"]',
    'li[role="tab"]',
    '.VfPpkd-rymPhb-ibnC6b',
    'div.lq1yyf',
    'g-tray-icon',
  ];

  for (const sel of dotSelectors) {
    const dots = await page.$$(sel);
    if (dots.length > 0) {
      console.log(`  📍 Found ${dots.length} dots with selector: ${sel}`);
      for (let i = 0; i < dots.length; i++) {
        try {
          await dots[i].click();
          await new Promise(r => setTimeout(r, 800));
          const added = await extractVisibleImages(page, allUrls);
          if (added > 0) console.log(`    Dot ${i + 1}: +${added} new images (total: ${allUrls.size})`);
        } catch {}
      }
    }
  }

  // Also scroll through the page section by section and grab images at each position
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= pageHeight; y += 300) {
    await page.evaluate(pos => window.scrollTo(0, pos), y);
    await new Promise(r => setTimeout(r, 200));
    await extractVisibleImages(page, allUrls);
  }

  console.log(`\n📊 Total unique images found: ${allUrls.size}`);

  if (allUrls.size === 0) {
    console.log('⚠️  No images found! Check the page manually.');
    await page.screenshot({ path: path.join(__dirname, 'assets', 'debug_agrupamento.png'), fullPage: true });
    console.log('📸 Debug screenshot saved: assets/debug_agrupamento.png');
    await browser.close();
    return;
  }

  // Save URL list
  fs.writeFileSync(path.join(__dirname, 'assets', 'agrupamento_urls.txt'), Array.from(allUrls).join('\n'));

  // Download each new image
  let success = 0;
  let failed = 0;

  for (const imgUrl of allUrls) {
    const filename = `gallery-${String(nextIndex).padStart(2, '0')}.jpg`;
    const filepath = path.join(outputDir, filename);

    if (fs.existsSync(filepath)) {
      console.log(`⏭️  ${filename} exists, skipping`);
      nextIndex++;
      continue;
    }

    try {
      process.stdout.write(`⬇️  ${filename} ... `);
      const size = await downloadWithBrowser(page, imgUrl, filepath);
      console.log(`✅ ${Math.round(size / 1024)}KB`);
      success++;
      nextIndex++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  await browser.close();

  const allFiles = fs.readdirSync(outputDir).filter(f => /\.(jpg|png|webp)$/i.test(f));
  console.log(`\n✅ Done! +${success} downloaded, ${failed} failed.`);
  console.log(`📁 Total gallery: ${allFiles.length} images`);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
