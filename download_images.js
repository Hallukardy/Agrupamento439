const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = fs.readFileSync('d:\\GitHub\\Escuteiros\\urls_all.txt', 'utf8').split('\n').filter(l => l.startsWith('https://lh3.googleusercontent.com'));

const destDir = 'd:\\GitHub\\Escuteiros\\assets\\old_site';
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let downloaded = 0;

function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Referer': 'https://sites.google.com/', 'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' } }, (res) => {
      if (res.statusCode !== 200) {
        console.log(`Failed to download ${url} - Status ${res.statusCode}`);
        resolve(false);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      console.log(`Error: ${err}`);
      resolve(false);
    });
  });
}

async function run() {
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i].trim().replace(/\);?$/, '').replace(/["']/g, '');
    if (!url) continue;
    url = url.replace(/=w\d+/, '=w800');
    const ext = '.jpg';
    const filename = `photo_${i + 1}${ext}`;
    console.log(`Downloading ${filename}...`);
    await download(url, path.join(destDir, filename));
    downloaded++;
    if (downloaded >= 20) break; // limit to 20 for gallery
  }
  console.log(`Downloaded ${downloaded} photos.`);
}

run();
