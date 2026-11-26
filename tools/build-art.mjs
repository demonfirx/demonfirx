import {readFile, mkdir} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Layout only. Joker is the unchanged, official ATLUS character artwork.
// Usage: node tools/build-art.mjs [path-to-playwright/index.mjs] [--sections-only]
const args = process.argv.slice(2);
const playwrightPath = args.find(arg => arg !== '--sections-only');
const {chromium} = await import(playwrightPath ? pathToFileURL(playwrightPath).href : 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(`${root}.preview`, {recursive:true});
await mkdir(`${root}assets/profile`, {recursive:true});
const portrait = `data:image/png;base64,${(await readFile(`${root}assets/official/joker-original.png`)).toString('base64')}`;
const stack = JSON.parse(await readFile(`${root}tools/tech-stack.json`, 'utf8'));
const xml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const red='#e60020', white='#fff', black='#080808';
const start=(w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#000" opacity=".16"/></pattern></defs><rect width="${w}" height="${h}" fill="${black}"/>`;
const star=(x,y,s)=>`<path d="M0-100 26-32 100-32 44 14 63 87 0 44-63 87-44 14-100-32-26-32Z" transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${white}" stroke-width="12"/>`;
function cutType(text,x,y,size) {
 let offset=0;
 return [...text].map((char,i)=>{
  const width=size*.69,angle=[-7,3,-4,5,-2,4,-5,3,-3][i%9];
  const out=`<g transform="translate(${x+offset} ${y}) rotate(${angle})"><path d="M-4-${size*.8} ${width+1}-${size*.87} ${width+3} 12-7 7Z" fill="${i%3===1?red:white}"/><text x="${width/2-2}" y="0" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="${size}" fill="${i%3===1?white:black}">${char}</text></g>`;
  offset+=width+6;return out;
 }).join('');
}
const wide=start(1280,440)+`
<path d="M845 0H1280V440H637Z" fill="${red}"/><path d="M845 0H1280V440H637Z" fill="url(#dots)"/>
${star(1040,216,1.6)}<path d="M796-20 858-20 655 460 593 460Z" fill="${white}"/>
<image href="${portrait}" x="416" y="8" width="850" height="986"/>
<path d="M0 0H701L654 440H0Z" fill="${black}"/>
<path d="M0 0H41L0 104Z" fill="${red}"/>
<text x="58" y="55" fill="${white}" font-family="monospace" font-size="17" letter-spacing="4">THE PHANTOM DEVELOPER</text>
${cutType('DEMONFIRX',61,175,75)}
<text x="61" y="245" fill="${white}" font-family="Arial,sans-serif" font-size="35" font-weight="700" letter-spacing="-1">Dewa Bagus Odie</text>
<path d="M58 275H591L579 318H46Z" fill="${red}"/><text x="71" y="304" fill="${white}" font-family="Arial,sans-serif" font-size="21" font-weight="800" letter-spacing="2">FRONTEND DEVELOPER / UI &amp; UX</text>
<text x="61" y="369" fill="#aeaeae" font-family="monospace" font-size="17" letter-spacing="1">CODE WITH INTENT. DESIGN WITH ATTITUDE.</text>
<path d="M0 418H1280V440H0Z" fill="${white}"/><path d="M0 418H599L590 440H0Z" fill="${red}"/>
</svg>`;
const mobile=start(720,660)+`
<path d="M432 0H720V660H249Z" fill="${red}"/><path d="M432 0H720V660H249Z" fill="url(#dots)"/>
${star(570,280,1.6)}<path d="M417-10H450L268 660H235Z" fill="${white}"/>
<image href="${portrait}" x="119" y="70" width="780" height="905"/>
<path d="M0 0H322L282 590H0Z" fill="${black}"/>
<text x="33" y="50" fill="${white}" font-family="monospace" font-size="17" letter-spacing="2">THE PHANTOM DEVELOPER</text>
${cutType('DEMON',35,182,81)}${cutType('FIRX',35,287,81)}
<text x="34" y="378" fill="${white}" font-family="Arial,sans-serif" font-weight="700" font-size="31"><tspan x="34">Dewa Bagus</tspan><tspan x="34" dy="39">Odie</tspan></text>
<text x="34" y="486" fill="${white}" font-family="Arial,sans-serif" font-weight="800" font-size="23" letter-spacing="1"><tspan x="34">FRONTEND</tspan><tspan x="34" dy="33">DEVELOPER</tspan></text>
<rect y="592" width="720" height="68" fill="${red}"/><text x="33" y="636" fill="${white}" font-family="monospace" font-size="24" letter-spacing="3">TAKE YOUR TIME. / @DEMONFIRX</text>
</svg>`;
function sectionCard(label, title) {
 return start(880, 108)+`
<path d="M627 0H880V108H571Z" fill="${red}"/>
<path d="M627 0H880V108H571Z" fill="url(#dots)"/>
<path d="M618 0H645L585 108H558Z" fill="${white}"/>
${star(762,59,.66)}
<path d="M0 0H20L0 43Z" fill="${red}"/>
<text x="31" y="32" font-family="Arial,sans-serif" font-weight="800" font-size="25" letter-spacing="2" fill="${white}">${xml(label)}</text>
<path d="M32 49H520L509 94H22Z" fill="${white}"/>
<text x="40" y="83" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-style="italic" font-size="43" letter-spacing="-1.4" fill="${black}">${xml(title)}</text>
</svg>`;
}

function categoryCard(title) {
 return `<svg xmlns="http://www.w3.org/2000/svg" width="416" height="66" viewBox="0 0 416 66">
<path d="M13 7 407 1 394 59 2 65Z" fill="${white}"/>
<path d="M21 13 414 7 399 53 9 60Z" fill="${red}"/>
<path d="M30 29h12l4-12 4 12h12l-10 8 4 12-10-7-10 7 4-12Z" fill="${white}"/>
<text x="224" y="44" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-style="italic" font-size="26" fill="${white}">${xml(title.toUpperCase())}</text>
</svg>`;
}

function compactSectionCard(label, title) {
 return start(440, 88)+`
<path d="M348 0H440V88H300Z" fill="${red}"/>
<path d="M348 0H440V88H300Z" fill="url(#dots)"/>
<path d="M340 0H353L310 88H297Z" fill="${white}"/>
${star(394,47,.33)}
<text x="14" y="25" font-family="Arial,sans-serif" font-weight="800" font-size="19" fill="${white}">${xml(label)}</text>
<path d="M14 37H312L296 77H6Z" fill="${white}"/>
<text x="17" y="66" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-style="italic" font-size="28" letter-spacing="-1.2" fill="${black}">${xml(title)}</text>
</svg>`;
}

const sections = [
 ...[
  ['about-me', 'ABOUT ME', 'BEHIND THE MASK'],
  ['tech-stack', 'TOOLS & TECHNOLOGIES', 'THE LOADOUT'],
 ].flatMap(([name, label, title]) => [
  [`profile/${name}`, 880, 108, sectionCard(label, title)],
  [`profile/${name}-mobile`, 440, 88, compactSectionCard(label, title)],
 ]),
 ...stack.groups.map(({art, title}) => [`profile/${art}`, 416, 66, categoryCard(title)]),
];
const headers = [['header-joker', 1280, 440, wide], ['header-joker-mobile', 720, 660, mobile]];
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({deviceScaleFactor:1});
 const images = args.includes('--sections-only') ? sections : [...headers, ...sections];
 for (const [name,w,h,svg] of images) {
  await page.setViewportSize({width:w,height:h});
  await page.setContent(`<html><style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}</style>${svg}</html>`);
  const portraitImage = page.locator('image');
  if (await portraitImage.count()) {
   await portraitImage.evaluate(el => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = el.getAttribute('href');
   }));
  }
  await page.screenshot({path:`${root}assets/${name}.png`,omitBackground:name.startsWith('profile/')});
  console.log(`Rendered ${name}: ${w} × ${h}`);
 }
} finally {await browser.close();}
