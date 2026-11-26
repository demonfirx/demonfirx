import {createHash} from 'node:crypto';
import {mkdir, readFile, readdir, unlink, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {escapeXml} from './profile-data.mjs';

const pinnedQuery = `query ($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository { nameWithOwner url visibility primaryLanguage { name } }
      }
    }
  }
}`;
const directory = 'assets/profile/wild-cards';
const start = '<!-- wild-cards:start -->';
const end = '<!-- wild-cards:end -->';
const displayTitles = new Map([
 ['demonfirx/creditflow', 'CreditFlow'],
 ['demonfirx/cv-dewaagungyogienovian', 'Dewa Agung Yogie CV'],
 ['demonfirx/cv-dewabagusodie-v2', 'ODIE Portfolio'],
 ['demonfirx/pokemon-battle', 'Pokémon Battle'],
]);

function publicRepositoryUrl({nameWithOwner, url}) {
 if (!/^[a-z0-9-]+\/[a-z0-9_.-]+$/i.test(nameWithOwner) ||
     url !== `https://github.com/${nameWithOwner}`) {
  throw Error('Invalid pinned repository URL');
 }
 return url;
}

export async function fetchPinnedRepositories(login, token, request = fetch) {
 if (!login || !token) throw Error('Set PROFILE_LOGIN and GH_TOKEN to read public pins');
 const response = await request('https://api.github.com/graphql', {
  method: 'POST',
  headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
  body: JSON.stringify({query: pinnedQuery, variables: {login}}),
  signal: AbortSignal.timeout(30_000),
 });
 if (!response.ok) throw Error(`GitHub GraphQL returned HTTP ${response.status}`);
 const result = await response.json();
 const nodes = result.data?.user?.pinnedItems?.nodes;
 if (result.errors?.length || !Array.isArray(nodes)) throw Error('GitHub GraphQL did not return a complete pin list');
 return nodes.filter(repository => repository?.visibility === 'PUBLIC').map(repository => {
  publicRepositoryUrl(repository);
  return repository;
 });
}

function renderCard(title, language) {
 const letters = Array.from(title.toUpperCase());
 const visible = letters.length > 26 ? letters.slice(0, 25).join('') + '…' : letters.join('');
 const width = visible.length > 19 ? 'textLength="487" lengthAdjust="spacingAndGlyphs"' : '';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="186" viewBox="0 0 760 186">
<defs><pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#000" opacity=".16"/></pattern></defs>
<path d="M0 0H760V186H0Z" fill="#080808"/>
<path d="M610 0H760V186H529Z M0 177H542L538 186H0Z" fill="#e60020"/>
<path d="M610 0H760V186H529Z" fill="url(#dots)"/>
<path d="M599 0H619L539 186H519Z M32 35 575 26 550 98 17 107Z" fill="#fff"/>
<text x="38" y="82" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-style="italic" font-size="38" fill="#080808" ${width}>${escapeXml(visible)}</text>
<path d="M42 136l9 9-9 9-9-9Z" fill="#e60020"/>
<text x="63" y="154" font-family="Arial,sans-serif" font-weight="800" font-size="26" fill="#fff">${escapeXml(language)}</text>
<path d="M0-100 26-32 100-32 44 14 63 87 0 44-63 87-44 14-100-32-26-32Z" transform="translate(676 79) scale(.55)" fill="none" stroke="#fff" stroke-width="12"/>
<path d="M704 160l22-22m-18 0h18v18" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
</svg>\n`;
}

export async function syncWildCards(root, repositories) {
 const readmePath = join(root, 'README.md');
 const readme = await readFile(readmePath, 'utf8');
 const startIndex = readme.indexOf(start);
 const endIndex = readme.indexOf(end);
 if (startIndex === -1 || endIndex <= startIndex || readme.lastIndexOf(start) !== startIndex || readme.lastIndexOf(end) !== endIndex) {
  throw Error('README must contain one Wild Cards section');
 }
 const cards = new Map();
 const links = repositories.map(repository => {
  const url = publicRepositoryUrl(repository);
  const title = displayTitles.get(repository.nameWithOwner.toLowerCase()) ?? repository.nameWithOwner.split('/')[1];
  const language = repository.primaryLanguage?.name;
  const svg = renderCard(title, language ?? 'GitHub repository');
  const hash = createHash('sha256').update(svg).digest('hex').slice(0, 16);
  const file = `card-${hash}.svg`;
  cards.set(file, svg);
  const label = `${title} repository${language ? ` · ${language}` : ''}`;
  return `  <a href="${escapeXml(url)}" title="${escapeXml(repository.nameWithOwner)}"><img src="${directory}/${file}" width="390" alt="${escapeXml(label)}"></a>`;
 });
 const eol = readme.includes('\r\n') ? '\r\n' : '\n';
 const lines = ['<p align="center">', ...(links.length ? links : ['  No public repositories are pinned right now.']), '</p>'];
 const next = readme.slice(0, startIndex + start.length) + eol + lines.join(eol) + eol + readme.slice(endIndex);

 const outputPath = join(root, directory);
 await mkdir(outputPath, {recursive: true});
 for (const [file, svg] of cards) await writeFile(join(outputPath, file), svg);
 if (next !== readme) await writeFile(readmePath, next);
 for (const file of await readdir(outputPath)) {
  if (/^card-[a-f0-9]{16}\.svg$/.test(file) && !cards.has(file)) await unlink(join(outputPath, file));
 }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
 const repositories = await fetchPinnedRepositories(process.env.PROFILE_LOGIN ?? 'demonfirx', process.env.GH_TOKEN);
 await syncWildCards(fileURLToPath(new URL('..', import.meta.url)), repositories);
 console.log(`Synced ${repositories.length} public pinned repositories.`);
}
