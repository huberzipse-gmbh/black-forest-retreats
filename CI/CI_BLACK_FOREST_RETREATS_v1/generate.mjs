// generate.mjs — Black Forest Retreats · Markenhandbuch (CI) als PDF
// Aufruf: node generate.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlUrl = `file://${resolve(__dirname, 'index.html')}`;
  await page.goto(htmlUrl, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  // Webfonts sicher geladen
  await page.evaluate(() => document.fonts.ready);

  const outPath = resolve(__dirname, 'Black-Forest-Retreats_Markenhandbuch.pdf');
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`PDF generiert: ${outPath}`);
}

main().catch((err) => {
  console.error('Fehler beim PDF-Generieren:', err);
  process.exit(1);
});
