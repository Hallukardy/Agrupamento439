/**
 * Downloads event posters for Magusto and Luz da Paz
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'events');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const posters = [
  {
    name: 'magusto-2025.jpg',
    url: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQF9rRVMgm4YJZ8ajFSe_6WYrIFuHp-Fp53H85drNOg0EG-gOgMIRs-sWayJkLxps0K_g1ETmIYXSopAjZBstCXvdt2KZu7EI2SRhToOcJizjFbDdNFlsh9KhoHpGXhPy79MvQV3c0dYnhCMAXjv3dbWo4ldOh6k1fzf3Lpn5jfXi4OOmc_xzstTmo=w1280'
  },
  {
    name: 'luz-paz-2025.jpg',
    url: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQ00WET7QrR4cXDedXzSodmI7JffhNuhqhI-ztMTjH3f6N_qGBY5rRgbSvZ4NGlVsEUGxI2tiMpcN3jg8cSzaaNPF9UUZJdtdygWS4IxE3cpyFgwyl4P_1mhuVTj_Y_ECmdxpW4tByAXV4BUF-kUKtxN0F0W1RThNsoWvmgSczBHCAEwjGOOHW_=w1280'
  }
];

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'Referer': 'https://sites.google.com/'
  });
  
  for (const poster of posters) {
    console.log(`⬇️  Downloading ${poster.name}...`);
    try {
      const response = await page.goto(poster.url);
      const buffer = await response.buffer();
      fs.writeFileSync(path.join(outputDir, poster.name), buffer);
      console.log(`✅ Success: ${poster.name}`);
    } catch (err) {
      console.log(`❌ Failed ${poster.name}: ${err.message}`);
    }
  }
  await browser.close();
}

run();
