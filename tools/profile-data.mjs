export const escapeXml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

export function parseContributions(html, year) {
 const counts = new Map();
 for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
  const id=match[1].match(/\bfor="([^"]+)"/)?.[1];
  const label=match[2].replace(/<[^>]+>/g,'').trim();
  const count=label.startsWith('No contributions')?0:Number(label.match(/^([\d,]+) contributions?\b/)?.[1].replaceAll(',',''));
  if(id && Number.isInteger(count) && count>=0) counts.set(id,count);
 }
 const days=[];
 for (const match of html.matchAll(/<td\b[^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*>/g)) {
  const attr=Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
  if(!attr['data-date'].startsWith(`${year}-`))continue;
  const count=counts.get(attr.id),level=Number(attr['data-level']);
  if(count===undefined || !Number.isInteger(level)||level<0||level>4)throw Error('Incomplete contribution cell');
  days.push({date:attr['data-date'],count,level});
 }
 days.sort((a,b)=>a.date.localeCompare(b.date));
 const totalMatch=html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').match(/([\d,]+) contributions? in \d{4}/);
 const total=totalMatch?Number(totalMatch[1].replaceAll(',','')):NaN;
 if(days.length<7||new Set(days.map(d=>d.date)).size!==days.length||!Number.isInteger(total)||days.reduce((s,d)=>s+d.count,0)!==total)throw Error('Invalid or incomplete public contribution calendar');
 let bestStreak=0,streak=0;
 for(const day of days){streak=day.count?streak+1:0;bestStreak=Math.max(bestStreak,streak);}
 return {year,total,bestStreak,days};
}

export function summarizeLanguages(repositories, languages) {
 const sum={};
 for(const repo of repositories.filter(r=>!r.private&&!r.fork))for(const [name,bytes] of Object.entries(languages[repo.name]||{})){
  if(!Number.isSafeInteger(bytes)||bytes<0)throw Error('Invalid language byte count');
  sum[name]=(sum[name]||0)+bytes;
 }
 return Object.entries(sum).map(([name,bytes])=>({name,bytes})).sort((a,b)=>b.bytes-a.bytes);
}

export async function collectPublicData(login, token) {
 if(!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(login))throw Error('Invalid GitHub login');
 const headers={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:`Bearer ${token}`}:{})};
 async function api(path){const r=await fetch(`https://api.github.com${path}`,{headers,signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`GitHub public endpoint ${path}: HTTP ${r.status}`);return r.json();}
 const now=new Date(),year=Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Jakarta',year:'numeric'}).format(now));
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 let repos=[];
 for(let page=1;;page++) {const batch=await api(`/users/${login}/repos?per_page=100&page=${page}&type=owner`);repos.push(...batch.filter(r=>!r.private));if(batch.length<100)break;}
 const own=repos.filter(r=>!r.fork),languageMap={};
 // Limit concurrency to avoid a burst against the public API.
 for(let i=0;i<own.length;i+=4)await Promise.all(own.slice(i,i+4).map(async repo=>{languageMap[repo.name]=await api(`/repos/${login}/${repo.name}/languages`);}));
 const [user,prs,issues,commits,response]=await Promise.all([
  api(`/users/${login}`),api(`/search/issues?q=${encodeURIComponent(`author:${login} is:pr is:public`)}`),
  api(`/search/issues?q=${encodeURIComponent(`author:${login} is:issue is:public`)}`),
  api(`/search/commits?q=${encodeURIComponent(`author:${login} is:public`)}`),
  fetch(`https://github.com/users/${login}/contributions?from=${year}-01-01&to=${today}`,{signal:AbortSignal.timeout(30000)})
 ]);
 if(!response.ok)throw Error(`Public calendar HTTP ${response.status}`);
 if([prs,issues,commits].some(r=>r.incomplete_results))throw Error('GitHub search returned incomplete counts');
 return {login,name:user.name||login,generatedAt:now.toISOString(),source:'GitHub public endpoints only',
  stats:{publicRepositories:own.length,stars:own.reduce((s,r)=>s+r.stargazers_count,0),publicPRs:prs.total_count,publicIssues:issues.total_count,publicCommits:commits.total_count},
  languages:summarizeLanguages(own,languageMap),calendar:parseContributions(await response.text(),year)};
}
