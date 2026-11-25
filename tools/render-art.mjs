import {mkdir, readdir} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Optional first argument points to an existing Playwright module installation.
const {chromium} = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({headless:true, channel:'chrome'});
const page = await browser.newPage({deviceScaleFactor:1});
await mkdir(`${root}.preview`, {recursive:true});
for (const file of (await readdir(`${root}assets`)).filter(file=>file.endsWith('.svg'))) {
 await page.goto(pathToFileURL(`${root}assets/${file}`).href);
 const size = await page.locator('svg').evaluate(svg=>({width:svg.width.baseVal.value,height:svg.height.baseVal.value}));
 await page.setViewportSize(size);
 await page.screenshot({path:`${root}assets/${file.replace('.svg','.png')}`,omitBackground:true});
 console.log(`${file}: ${size.width} × ${size.height}`);
}
await browser.close();
