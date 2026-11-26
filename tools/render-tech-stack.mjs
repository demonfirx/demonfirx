import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {escapeXml} from './profile-data.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(await readFile(`${root}tools/tech-stack.json`,'utf8'));
const items=manifest.groups.flatMap(g=>g.items);
await mkdir(`${root}assets/skills`,{recursive:true});
for(let i=0;i<items.length;i+=4)await Promise.all(items.slice(i,i+4).map(async item=>{
 const response=await fetch(`https://skillicons.dev/icons?i=${encodeURIComponent(item.icon)}&theme=dark`,{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error(`Icon ${item.name}: HTTP ${response.status}`);
 const svg=await response.text();
 if(!svg.includes('<svg')||!svg.includes('width="48"')||svg.includes('<script'))throw Error(`Invalid single icon for ${item.name}`);
 await writeFile(`${root}assets/skills/${item.icon}.svg`,svg.split('\n').map(line=>line.trimEnd()).join('\n').trimEnd()+'\n');
}));
const groups=manifest.groups.map(group=>{
 const heading = `<h4 align="center"><img src="assets/profile/${escapeXml(group.art)}.png" width="208" height="33" alt="${escapeXml(group.title)}"></h4>`;
 const links = group.items.map(item=>`  <a href="${escapeXml(item.url)}" title="${escapeXml(item.name)}"><img src="assets/skills/${item.icon}.svg" alt="${escapeXml(item.name)}" width="48" height="48"></a>`).join('\n');
 return `${heading}\n<p align="center">\n${links}\n</p>`;
}).join('\n\n');
let readme=await readFile(`${root}README.md`,'utf8');
if(!readme.includes('<!-- tech-stack:start -->')||!readme.includes('<!-- tech-stack:end -->'))throw Error('Tech stack markers missing');
readme=readme.replace(/<!-- tech-stack:start -->[\s\S]*?<!-- tech-stack:end -->/,`<!-- tech-stack:start -->\n${groups}\n<!-- tech-stack:end -->`);
await writeFile(`${root}README.md`,readme);
console.log(`Rendered ${items.length} individually linked icons from the portfolio evidence list.`);
