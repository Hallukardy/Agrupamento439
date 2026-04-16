/**
 * Final robust script to get ONLY the scout photos from Agrupamento swimlanes
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'gallery');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const knownUrlsFoundByAgent = [
  'https://lh3.googleusercontent.com/sitesv/APaQ0SQz0tg61LLdSM7p_iqLI0rKwTOudZ5L1KrPAHtD6w5T1-0hFlHicPBTHkdYP07UpojKTE1duS0nxbBZ3m7kld1M3L-KL1_gyMX6JlLfDcREJAN3EjfSGrd_Fw5w7_fd7R1PR1yYr4H9jWHZynKowIkPmI7g4BX092EN-hJjdBY7aZca0IZcq0TnBlvaefovHoNcVr67TpDsudLqlmeUQ-e5yMJAZDcw1wrK=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSrRcEsk7N8YbMel59cBLg1UP9OJYOJ79Ujn6mwpmTdv-T1SrI4JQCiIHTyJ_2GYnCS3EpxymcT-APRYrmndGrs8DoLK-oCRSlGIK0Faw9cUohvchYyd0C28B36KDCXULZv0VLZovg4PS9-ih4e7Fqo7w-wpvu00isnGkxw4R5Qw1H5EtAhOHksSDWngMI8rhewyu7xNDSSvN35r8sAJDLdFTF40SYi33eT=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRigbW1tIq7UUe3Nbz5vG2UjsOLZKyq9fAOqHnTvw4G63MVtT3VyQYObRHGbLoy10X79HIa_U5IrvJFGDVOVf_EDwb-nF9KV0XbZHMEiZjPfF8F0Hjqu3fRXaRK2-tEVKnTulnC4H4urBn8HXppmoipAdfOG_YqUqgP3rmYP2HHqGtzDo6kJd8q5ztvHm0xul6LKN4OYvSAp6AWtquI0XiyY64u7hRVVQlntOQ=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SQ7LWfbTbkm6gCrutBZnE-0emDh2gm-Gx6i5CugNx0ETeE3DlnzkzOxGEe7xYEJ32jyVTrLf7JdmeTBCFXQstyhzhJ5Jwmu4O1unXnw9YyGFXOQDTfDU5WjjRFBy0DZnKbDkJJcab8Btv9eqFtcrQhCJF7OEKv6pF_ht7BuMaVw65E3yARowDhw5XBtIz7rW60WA794wdmiMCSSV_tLStgQ78sv4iz1gO3oDU0=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SR-bWWWIYWk4q5_hbYix1uHOrBQy0w_w921FAGl3FCAuOywngeM5ctwcARRLcHkuLIydrNxlGpWa5oEDl77QCKHFdUG5o1zNrYt1MSpkLqg_DavEsjESpVU5f0bvfC69duZOac8IQXy-3H4WkzVmWnlyhvIE98zgkuhGfKLoZo4S8EeWGc3_dX5IsGUq1jtoSUxEnqTUKZoH8Fc5EzrD5GoeRmNnuEWGpZgvgw=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSgKekrLo0uD6_ulXIaxEbvu52SYDE-Uw5QWPLFtBNB-2OdoG_NNPiVW2FbbN0AkQ7vv7LKydh5DXSZwz2LLhu0ZZb3Uy6r6axeeywzcMIDKW9IevswujOIi0cSrwRUAL2IuZ2q00uIB9-wAkTp56tDfBlShpM4lgx_Z4_wh8RsMhXkWdsmZ_l8QTrfJ2Qt1BbpahOflt6xTekfGRO1WANAFn6Lk3OTEn4zCPo=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SQ-1HU3eFebgTXb0EfOf3nCuuGSfEbXhjNqImFtS-0R9pOluFlp_dqSjWQPlb7jkH4pyDVZKQPVc19qQxcENCHcigKP41lZJWioKCaZvaKwPYmW5ZDI3bNs3o2-2g_EGoXkTWh7T3-dKZ0y3-z6EDy2HEYsPKcO_7tWIQiXyY_ddlq33doDl82hS2wZMrrgp70VZFV7XCjBFsZ_XHNLGmi6-gJ61oCRCjHw=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0STB23cH_kU2IJFb0kzFsNgGYipterkAR7Q8-ZPi_AMuLhlBaLMwAew7487j3OpUliFgDw47L3ocNcrSsDKvJGfBfonvvbedlGbZiMCsOqRxZaWZ_rQpQyGYa4fXKrKA9CPec1jj9-fG03tUPf0kMqa0fnOnIYVOPXY0ggMMo3RjyC7Eo8R8_JaytV2YXFcrAMgMqHKVMxLtDKDmZThwJ_Z2eZ8KrjTuuZ0v8WU=w1280'
];

async function downloadWithBrowser(page, url, filepath) {
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
  console.log('🚀 Final Scout Photo Rescue mission started...\n');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  const allUrls = new Set(knownUrlsFoundByAgent);
  
  const targetUrl = 'https://sites.google.com/escutismo.pt/agrupamento0439/agrupamento';
  console.log(`🌐 Navigating to: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  // Find and click all potential dots
  console.log('🔎 Searching for carousels...');
  const dots = await page.$$('div[jsname="rVPFtd"], div[role="option"]');
  console.log(`📍 Found ${dots.length} potential carousel dots.`);

  for (let i = 0; i < dots.length; i++) {
    try {
      await dots[i].click();
      await new Promise(r => setTimeout(r, 1000));
      
      const pageUrls = await page.evaluate(() => {
        const result = [];
        document.querySelectorAll('img').forEach(img => {
          const src = img.src || '';
          if (src.includes('googleusercontent')) {
            result.push(src.replace(/=(?:w|s)\d+.*$/, '=w1280'));
          }
        });
        return result;
      });
      
      pageUrls.forEach(u => allUrls.add(u));
      console.log(`   Clicked dot ${i+1}/${dots.length}. Total unique URLs: ${allUrls.size}`);
    } catch(err) {
      // ignore
    }
  }

  // Also look for images in background styles
  const bgUrls = await page.evaluate(() => {
    const urls = [];
    document.querySelectorAll('[style*="googleusercontent"]').forEach(el => {
      const match = el.getAttribute('style').match(/url\(['"]?(https?:\/\/[^'")\s]+)['"]?\)/);
      if (match) urls.push(match[1].replace(/=(?:w|s)\d+.*$/, '=w1280'));
    });
    return urls;
  });
  bgUrls.forEach(u => allUrls.add(u));

  console.log(`\n📊 Final unique count: ${allUrls.size}`);

  let success = 0;
  let nextIndex = 100; // Start at 100 for scout photos to avoid conflicts

  for (const imgUrl of allUrls) {
    const filename = `scout-${nextIndex}.jpg`;
    const filepath = path.join(outputDir, filename);
    
    try {
      process.stdout.write(`⬇️  Saving ${filename}... `);
      const size = await downloadWithBrowser(page, imgUrl, filepath);
      if (size > 20000) {
        console.log(`✅ ${Math.round(size/1024)}KB`);
        success++;
        nextIndex++;
      } else {
        fs.unlinkSync(filepath);
        console.log('⚠️  Skipping tiny image');
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  await browser.close();
  console.log(`\n🎉 Mission accomplished: ${success} scout photos saved.`);
}

run().catch(err => console.error('Fatal error:', err));
