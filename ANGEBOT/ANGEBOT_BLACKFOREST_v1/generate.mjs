// generate.mjs — Angebot AN-2026-5021 als PDF im H&Z-Stil
// Aufruf: node generate.mjs

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Logo als Base64 einbetten (Puppeteer/Playwright header-templates haben keinen file://-Zugriff)
const logoBase64 = readFileSync(resolve(__dirname, 'logo.png')).toString('base64');
const logoDataURL = `data:image/png;base64,${logoBase64}`;

const headerTemplate = `
<style>
  .pdf-header {
    width: 100%;
    padding: 2mm 12mm 0 18mm;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
  }
  .pdf-header img {
    width: 60mm;
    height: auto;
    display: block;
  }
</style>
<div class="pdf-header">
  <img src="${logoDataURL}" alt="Huber & Zipse" />
</div>
`;

const footerTemplate = `
<style>
  .pdf-footer {
    width: 100%;
    padding: 3.5mm 14mm 5mm 14mm;
    box-sizing: border-box;
    font-family: -apple-system, "Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif;
    font-size: 7pt;
    color: #777;
    line-height: 1.45;
    border-top: 0.4pt solid #d0d0d0;
  }
  .pdf-footer .row {
    display: flex;
    justify-content: space-between;
    gap: 5mm;
  }
  .pdf-footer .col-addr { flex: 0.95; }
  .pdf-footer .col-contact { flex: 1.1; }
  .pdf-footer .col-tax { flex: 0.85; }
  .pdf-footer .col-bank {
    flex: 1.3;
    text-align: right;
    white-space: nowrap;
  }
  .pdf-footer .pageinfo {
    text-align: right;
    margin-top: 1mm;
    font-size: 6.5pt;
    color: #999;
  }
</style>
<div class="pdf-footer">
  <div class="row">
    <div class="col-addr">
      Huber &amp; Zipse GmbH<br/>
      Eichenweg 6<br/>
      75239 Eisingen
    </div>
    <div class="col-contact">
      Tel: +49 1625310453<br/>
      rechnungen@huber-zipse.de<br/>
      www.huber-zipse.de
    </div>
    <div class="col-tax">
      St.-Nr.: 41409/35113<br/>
      USt-IdNr.: DE461305983
    </div>
    <div class="col-bank">
      Sparkasse Pforzheim Calw<br/>
      IBAN: DE88 6665 0085 0005 9112 49<br/>
      BIC: PZHSDE66XXX
    </div>
  </div>
  <div class="pageinfo">
    <span class="pageNumber"></span>/<span class="totalPages"></span>
  </div>
</div>
`;

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const htmlPath = resolve(__dirname, 'angebot.html');
  const htmlUrl = `file://${htmlPath}`;

  await page.goto(htmlUrl, { waitUntil: 'networkidle' });

  // Playwright: emulate print media
  await page.emulateMedia({ media: 'print' });

  const outPath = resolve(__dirname, 'Angebot-Black-Forest-Retreats_AN-2026-5022.pdf');

  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate,
    footerTemplate,
    margin: {
      top: '44mm',
      bottom: '28mm',
      left: '18mm',
      right: '18mm',
    },
    preferCSSPageSize: false,
  });

  await browser.close();
  console.log(`PDF generiert: ${outPath}`);
}

main().catch((err) => {
  console.error('Fehler beim PDF-Generieren:', err);
  process.exit(1);
});
