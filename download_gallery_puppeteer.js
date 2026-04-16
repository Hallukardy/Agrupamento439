/**
 * Downloads gallery images from the Agrupamento 439 Google Sites
 * Uses Puppeteer with browser context to bypass referer restrictions
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'gallery');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created: ${outputDir}`);
}

const pagesToScrape = [
  'https://sites.google.com/escutismo.pt/agrupamento0439/gallery',
  'https://sites.google.com/escutismo.pt/agrupamento0439/agrupamento',
  'https://sites.google.com/escutismo.pt/agrupamento0439/cronologia/ano-202324',
  'https://sites.google.com/escutismo.pt/agrupamento0439/cronologia/ano-2022-23',
  'https://sites.google.com/escutismo.pt/agrupamento0439/cronologia/ano-2021-22',
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 600;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}

async function extractImageUrls(page) {
  return page.evaluate(() => {
    const urls = new Set();
    document.querySelectorAll('img').forEach(img => {
      [img.src, img.getAttribute('data-src'), img.getAttribute('data-lazy-src')]
        .filter(Boolean)
        .forEach(src => {
          if (src.includes('googleusercontent') || src.includes('lh3.google')) {
            // Strip size params, force w1280
            const clean = src.replace(/=(?:w|s)\d+.*$/, '=w1280');
            if (clean.includes('sitesv') || clean.includes('photos')) urls.add(clean);
          }
        });
    });
    return Array.from(urls);
  });
}

async function downloadImageWithBrowser(page, url, filepath) {
  const bytes = await page.evaluate(async (imgUrl) => {
    const res = await fetch(imgUrl, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    return Array.from(new Uint8Array(buf));
  }, url);
  fs.writeFileSync(filepath, Buffer.from(bytes));
  return bytes.length;
}

async function run() {
  console.log('\n🚀 Launching Puppeteer browser...\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const allUrls = new Set();

  for (const url of pagesToScrape) {
    try {
      console.log(`🌐 Visiting: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
      await new Promise(r => setTimeout(r, 2000));

      // Scroll to trigger lazy loading
      await autoScroll(page);
      await new Promise(r => setTimeout(r, 2000));

      // Click any "expand" buttons/accordion items to reveal more images
      const expandBtns = await page.$$('[aria-expanded="false"], .toggle, details summary');
      for (const btn of expandBtns.slice(0, 20)) {
        try { await btn.click(); await new Promise(r => setTimeout(r, 300)); } catch {}
      }
      await new Promise(r => setTimeout(r, 1000));
      await autoScroll(page);

      const found = await extractImageUrls(page);
      console.log(`   Found ${found.length} image URLs`);
      found.forEach(u => allUrls.add(u));
    } catch (err) {
      console.error(`   ❌ Error on ${url}: ${err.message}`);
    }
  }

  console.log(`\n📊 Total unique gallery images: ${allUrls.size}`);

  if (allUrls.size === 0) {
    console.log('⚠️  No images found. Saving debug screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'assets', 'debug_screenshot.png') });
    await browser.close();
    return;
  }

  // Save URL list for reference
  fs.writeFileSync(
    path.join(__dirname, 'assets', 'gallery_urls.txt'),
    Array.from(allUrls).join('\n')
  );
  console.log('📋 Saved gallery_urls.txt');

  // Download each image
  let index = 1;
  let success = 0;
  let failed = 0;

  for (const imgUrl of allUrls) {
    const filename = `gallery-${String(index).padStart(2, '0')}.jpg`;
    const filepath = path.join(outputDir, filename);

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 10000) {
      console.log(`⏭️  Skip (exists): ${filename}`);
      index++; success++; continue;
    }

    try {
      process.stdout.write(`⬇️  ${filename} ... `);
      const size = await downloadImageWithBrowser(page, imgUrl, filepath);
      if (size < 5000) {
        fs.unlinkSync(filepath);
        console.log(`⚠️  Too small (${size}B), removed`);
        failed++;
      } else {
        console.log(`✅ ${Math.round(size / 1024)}KB`);
        success++;
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
    index++;
    await new Promise(r => setTimeout(r, 200));
  }

  await browser.close();

  const files = fs.readdirSync(outputDir).filter(f => /\.(jpg|png|webp)$/i.test(f));
  console.log(`\n✅ Done! ${success} success, ${failed} failed.`);
  console.log(`📁 Gallery: ${files.length} images in ${outputDir}`);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
