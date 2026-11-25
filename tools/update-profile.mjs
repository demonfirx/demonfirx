import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {collectPublicData,escapeXml as esc} from './profile-data.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const data=await collectPublicData(process.env.PROFILE_LOGIN||'demonfirx',process.env.GH_TOKEN||process.env.GITHUB_TOKEN);
await mkdir(`${root}assets/generated`,{recursive:true});
const ink='#0d1117',paper='#f0f6fc',muted='#8b949e',accent='#ff3654',green=['#161b22','#0e4429','#006d32','#26a641','#39d353'];
const svg=(w,h,label,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="8" fill="${ink}" stroke="#30363d"/><g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif">${body}</g></svg>`;
const text=(x,y,value,size=16,color=paper,extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${esc(value)}</text>`;
const rows=[['Public repositories',data.stats.publicRepositories],['Stars earned',data.stats.stars],['Public commits',data.stats.publicCommits],['Public pull requests',data.stats.publicPRs],['Public issues',data.stats.publicIssues],[`${data.calendar.year} contributions`,data.calendar.total]];
await writeFile(`${root}assets/generated/stats.svg`,svg(400,245,`${data.name}'s GitHub public statistics`,
 text(22,33,'On GitHub',21,accent,'font-weight="700"')+rows.map(([label,value],i)=>text(22,67+i*27,label,15,muted)+text(374,67+i*27,value.toLocaleString('en'),16,paper,'text-anchor="end" font-weight="700"')).join('')+text(22,232,'Public activity · refreshed automatically',10,muted)));
const colors={JavaScript:'#f1e05a',TypeScript:'#3178c6',CSS:'#a563df',HTML:'#e34c26',Python:'#3572a5',PHP:'#4f5d95',Blade:'#f7523f',Shell:'#89e051',Astro:'#ff5a03'};
const langs=data.languages.slice(0,6),total=data.languages.reduce((s,l)=>s+l.bytes,0);let x=22;
const bars=langs.map(l=>{const width=356*l.bytes/total;const b=`<rect x="${x}" y="62" width="${width}" height="10" fill="${colors[l.name]||'#8598a8'}"/>`;x+=width;return b;}).join('');
const labels=langs.map((l,i)=>{const column=i%2,row=Math.floor(i/2),left=22+column*180;return `<circle cx="${left+4}" cy="${106+row*34}" r="4" fill="${colors[l.name]||'#8598a8'}"/>`+text(left+15,111+row*34,`${l.name} ${(100*l.bytes/total).toFixed(1)}%`,13);}).join('');
await writeFile(`${root}assets/generated/languages.svg`,svg(400,245,'Most used languages by bytes in public non-fork repositories',text(22,33,'Most used languages',21,accent,'font-weight="700"')+bars+labels+text(22,215,'By code size in public, non-fork repositories.',11,muted)+text(22,233,'Includes profile automation; not a skill rating.',10,muted)));

const yearStart=new Date(`${data.calendar.year}-01-01T00:00:00Z`),offset=yearStart.getUTCDay();
const cell=13,step=14,x0=24,y0=63;
const mapped=data.calendar.days.map((day,index)=>({...day,x:x0+Math.floor((index+offset)/7)*step,y:y0+((index+offset)%7)*step}));
const bricks=mapped.filter(day=>day.count>0).slice(-28),duration=Math.max(18,bricks.length*1.1);
let css='',ballPoints=['0%{transform:translate(400px,245px)}'],paddlePoints=['0%{transform:translateX(360px)}'];
for(let i=0;i<bricks.length;i++){
 const b=bricks[i],hit=(i*2+1)/(bricks.length*2+1)*100,bounce=(i*2+2)/(bricks.length*2+1)*100;
 const px=Math.max(24,Math.min(704,b.x-30));
 ballPoints.push(`${hit.toFixed(3)}%{transform:translate(${b.x+6}px,${b.y+13}px)}`,`${bounce.toFixed(3)}%{transform:translate(${px+40}px,245px)}`);
 paddlePoints.push(`${hit.toFixed(3)}%,${bounce.toFixed(3)}%{transform:translateX(${px}px)}`);
 css+=`.b${i}{animation:hit${i} ${duration}s linear infinite}@keyframes hit${i}{0%,${Math.max(0,hit-.1).toFixed(3)}%{opacity:1}${hit.toFixed(3)}%,100%{opacity:.06}}`;
}
ballPoints.push('100%{transform:translate(400px,245px)}');paddlePoints.push('100%{transform:translateX(360px)}');
const style=`<style>.ball{animation:ball ${duration}s linear infinite}.paddle{animation:paddle ${duration}s linear infinite}@keyframes ball{${ballPoints.join('')}}@keyframes paddle{${paddlePoints.join('')}}${css}@media(prefers-reduced-motion:reduce){.ball,.paddle,.brick{animation:none!important}}</style>`;
const grid=mapped.map(day=>{const index=bricks.findIndex(b=>b.date===day.date);return `<rect class="brick${index>=0?` b${index}`:''}" x="${day.x}" y="${day.y}" width="${cell}" height="${cell}" rx="2" fill="${green[day.level]}"><title>${day.date}: ${day.count} contributions</title></rect>`;}).join('');
await writeFile(`${root}game.svg`,svg(800,296,`Contribution brick breaker autoplay, using ${data.login}'s real ${data.calendar.year} calendar`,style+
 text(24,29,'CONTRIBUTION ARCADE',17,paper,'font-weight="700"')+text(776,29,'AUTOPLAY / DEMONFIRX',12,accent,'text-anchor="end"')+
 grid+`<path d="M24 176H776" stroke="#30363d"/><g class="ball"><circle r="5" fill="${paper}"/><circle r="2" fill="${accent}"/></g><g class="paddle"><rect y="251" width="80" height="8" rx="4" fill="${accent}"/></g>`+
 text(24,283,`${data.calendar.year} · ${data.calendar.total} contributions · ${data.calendar.bestStreak}-day best streak`,12,muted)+text(776,283,'Real calendar / automatic replay',11,muted,'text-anchor="end"')));
await writeFile(`${root}assets/generated/activity-static.svg`,svg(800,192,'Static contribution calendar',text(24,29,`${data.calendar.year} · ${data.calendar.total} contributions`,17,paper,'font-weight="700"')+grid.replaceAll(/ class="[^"]*"/g,'')));
await writeFile(`${root}assets/generated/metrics.json`,JSON.stringify(data,null,2)+'\n');
let readme=await readFile(`${root}README.md`,'utf8');
const summary=`<!-- activity:start -->\n<p align="center"><strong>${data.calendar.year}</strong> · ${data.calendar.total} contributions · Best streak: ${data.calendar.bestStreak} days</p>\n<!-- activity:end -->`;
if(!readme.includes('<!-- activity:start -->')||!readme.includes('<!-- activity:end -->'))throw Error('README activity markers missing');
readme=readme.replace(/<!-- activity:start -->[\s\S]*?<!-- activity:end -->/,summary);
await writeFile(`${root}README.md`,readme);
console.log(JSON.stringify({publicRepositories:data.stats.publicRepositories,contributions:data.calendar.total,days:data.calendar.days.length,updatedAt:data.generatedAt}));
