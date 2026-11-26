import {escapeXml} from './profile-data.mjs';

const paper = '#fff';
const ink = '#080808';
const red = '#e60020';
const muted = '#d5c8cd';
const languageColors = {
 JavaScript: '#f1e05a', TypeScript: '#3178c6', CSS: '#a563df',
 HTML: '#e34c26', Python: '#3572a5', PHP: '#4f5d95',
 Blade: '#f7523f', Shell: '#89e051', Astro: '#ff5a03',
};

function text(x, y, value, size, {fill = paper, attributes = ''} = {}) {
 return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${attributes}>${escapeXml(value)}</text>`;
}

function card(title, description, content) {
 return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="262" viewBox="0 0 400 262" role="img" aria-label="${escapeXml(description)}">
 <path d="M.5.5H399.5V261.5H.5Z" fill="${ink}" stroke="#544047"/>
 <path d="M0 0H23L0 54Z M340 0H400V55H313Z M0 255H400V262H0Z" fill="${red}"/>
 <path d="M341 0H350L324 55H315Z M270 255H356L352 262H266Z" fill="${paper}"/>
 <path d="M25 10 312 7 300 48 15 51Z" fill="${paper}"/>
 <path d="M369 12l4.7 10h11l-8.8 7.2 3.2 10.8-10.1-6.6-9.7 6.6 3-10.8-9-7.2h11Z" fill="none" stroke="${paper}" stroke-width="1.6"/>
 <g font-family="Arial, Helvetica, sans-serif">
  ${text(30, 36, title, 18, {fill: ink, attributes: 'font-style="italic" font-weight="900"'})}
  ${content}
 </g>
</svg>\n`;
}

export function renderStatsCard({name, stats, calendar}) {
 const rows = [
  ['Public repositories', stats.publicRepositories], ['Stars earned', stats.stars],
  ['Public commits', stats.publicCommits], ['Public pull requests', stats.publicPRs],
  ['Public issues', stats.publicIssues], [`${calendar.year} contributions`, calendar.total],
 ];
 const metrics = rows.map(([label, value], index) => {
  const y = 76 + index * 27;
  return `<path d="M22 ${y - 11}l3.5 4-3.5 4-3.5-4Z" fill="${red}"/>
   ${text(35, y, label, 15)}
   ${text(374, y, value.toLocaleString('en'), 17, {attributes: 'text-anchor="end" font-weight="800"'})}
   <path d="M18 ${y + 8}H378" stroke="#352b30"/>`;
 }).join('\n');
 return card('PUBLIC STATS', `${name}'s GitHub public statistics`,
  metrics + text(19, 243, 'Public activity · refreshed automatically', 12, {fill: muted}));
}

export function renderLanguagesCard(languages) {
 const total = languages.reduce((sum, language) => sum + language.bytes, 0);
 const visibleLanguages = languages.slice(0, 6);
 const barWidth = 362;
 let offset = 19;
 let content = `<rect x="19" y="72" width="${barWidth}" height="12" fill="#352b30"/>`;
 if (total > 0) {
  content += visibleLanguages.map(({name, bytes}, index) => {
   const color = languageColors[name] ?? '#8598a8';
   const width = barWidth * bytes / total;
   const bar = `<rect x="${offset}" y="72" width="${width}" height="12" fill="${color}"/>`;
   offset += width;
   const x = 19 + index % 2 * 183;
   const y = 120 + Math.floor(index / 2) * 31;
   const label = `${name} ${(100 * bytes / total).toFixed(1)}%`;
   return bar + `<path d="M${x} ${y - 12}h9l-2 9h-9Z" fill="${color}"/>` + text(x + 15, y, label, 14);
  }).join('\n');
 } else {
  content += text(19, 120, 'No public language data yet.', 14, {fill: muted});
 }
 content += text(19, 222, 'By code size in public, non-fork repositories.', 12, {fill: muted});
 content += text(19, 242, 'Includes profile automation.', 12, {fill: muted});
 return card('MOST USED LANGUAGES', 'Most used languages by bytes in public non-fork repositories', content);
}
