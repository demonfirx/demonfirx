import test from 'node:test';
import assert from 'node:assert/strict';
import {parseContributions,summarizeLanguages,escapeXml} from './profile-data.mjs';

const html=(total=3)=>`<h2>${total} contributions in 2026</h2>`+Array.from({length:7},(_,i)=>`<td data-date="2026-01-0${i+1}" id="d${i}" data-level="${i<3?1:0}"></td><tool-tip for="d${i}">${i<3?'1 contribution':'No contributions'} on January ${i+1}.</tool-tip>`).join('');
test('calendar keeps dates, daily counts and best streak',()=>{const c=parseContributions(html(),2026);assert.equal(c.total,3);assert.equal(c.bestStreak,3);assert.equal(c.days.length,7);assert.equal(c.days[6].count,0);});
test('incomplete calendar fails instead of publishing false zeros',()=>{assert.throws(()=>parseContributions(html(9),2026));assert.throws(()=>parseContributions('<html>Rate limited</html>',2026));assert.throws(()=>parseContributions(html().replace('for="d0"','for="missing"'),2026));});
test('language aggregation excludes private and forked code',()=>{const repos=[{name:'a'},{name:'secret',private:true},{name:'fork',fork:true}];assert.deepEqual(summarizeLanguages(repos,{a:{JavaScript:10},secret:{Secret:99},fork:{Python:99}}),[{name:'JavaScript',bytes:10}]);});
test('data labels cannot inject SVG markup',()=>assert.equal(escapeXml('<script a="b">&'), '&lt;script a=&quot;b&quot;&gt;&amp;'));
