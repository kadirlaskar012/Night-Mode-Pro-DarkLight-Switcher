import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import http from 'http';

const ICONS_DIR = path.resolve('src/public/icons');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const activeSvg = fs.readFileSync(path.join(ICONS_DIR, 'icon.svg'), 'utf8');
const offSvg = fs.readFileSync(path.join(ICONS_DIR, 'icon-off.svg'), 'utf8');

const htmlContent = `
<!DOCTYPE html>
<html>
<body>
<canvas id="c"></canvas>
<script>
window.renderIcon = function(svgStr, size) {
  return new Promise((resolve) => {
    const canvas = document.getElementById('c');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  });
};
</script>
</body>
</html>
`;

// Start transient local server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(9876, async () => {
  console.log('Icon generator server running on port 9876');

  // Let's use chrome headless with dump-dom or CDP or a script to export PNGs
  const sizes = [16, 32, 48, 128];
  
  // Alternative direct node approach: let's test if chrome can screenshot
  for (const size of sizes) {
    const activeHtml = `<!DOCTYPE html><html style="margin:0;padding:0;overflow:hidden;"><body style="margin:0;padding:0;overflow:hidden;"><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(activeSvg)}" width="${size}" height="${size}" style="display:block;margin:0;" /></body></html>`;
    const offHtml = `<!DOCTYPE html><html style="margin:0;padding:0;overflow:hidden;"><body style="margin:0;padding:0;overflow:hidden;"><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(offSvg)}" width="${size}" height="${size}" style="display:block;margin:0;" /></body></html>`;

    const tmpActive = path.join(ICONS_DIR, `temp-${size}.html`);
    const tmpOff = path.join(ICONS_DIR, `temp-off-${size}.html`);
    fs.writeFileSync(tmpActive, activeHtml);
    fs.writeFileSync(tmpOff, offHtml);

    const outActive = path.join(ICONS_DIR, `icon-${size}.png`);
    const outOff = path.join(ICONS_DIR, `icon-${size}-off.png`);

    try {
      execFileSync(CHROME_PATH, [
        '--headless',
        '--disable-gpu',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        `--window-size=${size},${size}`,
        `--screenshot=${outActive}`,
        `file://${tmpActive.replace(/\\/g, '/')}`,
      ]);
      console.log(`Rendered icon-${size}.png`);

      execFileSync(CHROME_PATH, [
        '--headless',
        '--disable-gpu',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        `--window-size=${size},${size}`,
        `--screenshot=${outOff}`,
        `file://${tmpOff.replace(/\\/g, '/')}`,
      ]);
      console.log(`Rendered icon-${size}-off.png`);
    } catch (e) {
      console.error(`Error rendering ${size}:`, e.message);
    } finally {
      if (fs.existsSync(tmpActive)) fs.unlinkSync(tmpActive);
      if (fs.existsSync(tmpOff)) fs.unlinkSync(tmpOff);
    }
  }

  server.close();
  console.log('All icons rendered successfully!');
  process.exit(0);
});
