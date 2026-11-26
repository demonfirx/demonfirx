import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {collectPublicData,escapeXml as esc} from './profile-data.mjs';
import {renderStatsCard, renderLanguagesCard} from './profile-cards.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const data=await collectPublicData(process.env.PROFILE_LOGIN||'demonfirx',process.env.GH_TOKEN||process.env.GITHUB_TOKEN);
await mkdir(`${root}assets/generated`,{recursive:true});
const ink='#0d1117',paper='#f0f6fc',green=['#161b22','#0e4429','#006d32','#26a641','#39d353'];
const svg=(w,h,label,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="8" fill="${ink}" stroke="#30363d"/><g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif">${body}</g></svg>`;
const text=(x,y,value,size=16,color=paper,extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${esc(value)}</text>`;
await writeFile(`${root}assets/generated/stats.svg`, renderStatsCard(data));
await writeFile(`${root}assets/generated/languages.svg`, renderLanguagesCard(data.languages));

const yearStart=new Date(`${data.calendar.year}-01-01T00:00:00Z`),offset=yearStart.getUTCDay();
const cell=13,step=14,x0=24,y0=63;
const mapped=data.calendar.days.map((day,index)=>({...day,x:x0+Math.floor((index+offset)/7)*step,y:y0+((index+offset)%7)*step}));
const grid=mapped.map(day=>`<rect x="${day.x}" y="${day.y}" width="${cell}" height="${cell}" rx="2" fill="${green[day.level]}"><title>${day.date}: ${day.count} contributions</title></rect>`).join('');
await writeFile(`${root}assets/generated/activity-static.svg`,svg(800,192,'Static contribution calendar',text(24,29,`${data.calendar.year} · ${data.calendar.total} contributions`,17,paper,'font-weight="700"')+grid));
await writeFile(`${root}assets/generated/metrics.json`,JSON.stringify(data,null,2)+'\n');
let readme=await readFile(`${root}README.md`,'utf8');
const summary=`<!-- activity:start -->\n<p align="center"><strong>${data.calendar.year}</strong> · ${data.calendar.total} contributions · Best streak: ${data.calendar.bestStreak} days</p>\n<!-- activity:end -->`;
if(!readme.includes('<!-- activity:start -->')||!readme.includes('<!-- activity:end -->'))throw Error('README activity markers missing');
readme=readme.replace(/<!-- activity:start -->[\s\S]*?<!-- activity:end -->/,summary);
await writeFile(`${root}README.md`,readme);
console.log(JSON.stringify({publicRepositories:data.stats.publicRepositories,contributions:data.calendar.total,days:data.calendar.days.length,updatedAt:data.generatedAt}));
