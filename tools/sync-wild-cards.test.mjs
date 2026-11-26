import assert from 'node:assert/strict';
import {mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {fetchPinnedRepositories, syncWildCards} from './sync-wild-cards.mjs';

const readme = '<!-- activity:start -->\n87 contributions\n<!-- activity:end -->\n<!-- wild-cards:start -->\nold cards\n<!-- wild-cards:end -->\n<source srcset="assets/generated/activity-static.svg">\n<img src="assets/generated/snake.svg">\n';
const repo = (nameWithOwner, language = 'TypeScript', visibility = 'PUBLIC') => ({
 nameWithOwner, url: `https://github.com/${nameWithOwner}`, visibility,
 primaryLanguage: language === null ? null : {name: language},
});
const snapshot = async root => ({
 readme: await readFile(join(root, 'README.md'), 'utf8'),
 assets: await readdir(join(root, 'assets/profile/wild-cards')),
});

test('sync replaces and reorders cards without changing the contribution or snake markup', async t => {
 const root = await mkdtemp(join(tmpdir(), 'wild-cards-'));
 t.after(() => rm(root, {recursive: true, force: true}));
 await writeFile(join(root, 'README.md'), readme);
 const project = repo('demonfirx/CreditFlow', 'JavaScript');
 const external = repo('another-owner/example-repo', 'C++');
 await syncWildCards(root, [project, external]);
 const before = await snapshot(root);
 assert.equal(before.assets.length, 2);
 assert.ok(before.readme.indexOf(project.url) < before.readme.indexOf(external.url));
 await syncWildCards(root, [external, project]);
 const reordered = await snapshot(root);
 assert.equal(reordered.assets.length, 2);
 assert.ok(reordered.readme.indexOf(external.url) < reordered.readme.indexOf(project.url));
 assert.deepEqual(reordered.assets, before.assets);
 await syncWildCards(root, [external]);
 const removed = await snapshot(root);
 assert.equal(removed.assets.length, 1);
 assert.doesNotMatch(removed.readme, /CreditFlow/);
 assert.match(removed.readme, /\balt="[^"\n]+repository · C\+\+"/);
 assert.equal(removed.readme.replace(/(?<=<!-- wild-cards:start -->\n)[\s\S]*?(?=\n<!-- wild-cards:end -->)/, 'old cards'), readme);
 await syncWildCards(root, [external]);
 assert.deepEqual(await snapshot(root), removed);
 await syncWildCards(root, []);
 const empty = await snapshot(root);
 assert.match(empty.readme, /No public repositories are pinned right now/);
 assert.equal(empty.assets.length, 0);
});

test('the GraphQL result must be complete and only public repository URLs are accepted', async () => {
 const response = {data: {user: {pinnedItems: {nodes: [repo('demonfirx/CreditFlow'), repo('demonfirx/hidden', null, 'PRIVATE'), null]}}}};
 const ok = payload => async () => new Response(JSON.stringify(payload));
 assert.deepEqual(await fetchPinnedRepositories('demonfirx', 'test', ok(response)), [repo('demonfirx/CreditFlow')]);
 await assert.rejects(fetchPinnedRepositories('demonfirx', 'test', ok({...response, errors: [{message: 'partial'}]})), /GraphQL/);
 response.data.user.pinnedItems.nodes[0].url = 'https://example.org/redirect';
 await assert.rejects(fetchPinnedRepositories('demonfirx', 'test', ok(response)), /repository URL/);
});
