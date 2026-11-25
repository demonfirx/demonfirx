import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(`${root}assets`, {recursive: true});
const red = '#ed123b', ink = '#101013', paper = '#f7f3e9';
const svg = (w, h, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${title}</title><defs><pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="${ink}" opacity=".22"/></pattern><pattern id="lines" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V10" stroke="${paper}" stroke-width="2" opacity=".08"/></pattern></defs>${body}</svg>`;
const star = (x,y,s,color=paper) => `<path d="M0 -44 11 -13 44 -15 21 8 31 39 0 22 -31 39 -21 8 -44 -15 -11 -13Z" transform="translate(${x} ${y}) scale(${s})" fill="${color}"/>`;
const label = (x,y,t,w=220) => `<g transform="translate(${x} ${y}) rotate(-4)"><path d="M0 0 ${w} 0 ${w-8} 33 -5 33Z" fill="${paper}"/><text x="10" y="23" font-family="Arial,sans-serif" font-weight="800" font-size="17" letter-spacing="3" fill="${ink}">${t}</text></g>`;
// Original vector illustration: Joker's tousled hair, domino mask, high collar and red glove.
const joker = `<g stroke-linejoin="round">
 <path d="M46 516 77 370 164 328 243 314 344 355 423 516Z" fill="${ink}" stroke="${paper}" stroke-width="5"/>
 <path d="M153 353 210 443 182 516 116 516 125 401 101 363Z" fill="#29292f"/>
 <path d="M288 337 269 432 301 516 360 516 331 401 352 367Z" fill="#29292f"/>
 <path d="M174 285 169 354 221 397 273 346 260 278Z" fill="${paper}"/>
 <path d="M199 297 209 361 235 375 263 333 256 285Z" fill="#a7a5a6"/>
 <path d="M161 347 209 397 176 439 131 346 151 318Z" fill="${ink}" stroke="${paper}" stroke-width="3"/>
 <path d="M278 326 228 399 270 428 309 346 289 307Z" fill="${ink}" stroke="${paper}" stroke-width="3"/>
 <path d="M130 170 143 255 181 299 225 325 267 297 297 240 300 151 244 100 170 117Z" fill="${paper}" stroke="${ink}" stroke-width="6"/>
 <path d="M247 166 258 226 239 247 261 243 269 201Z" fill="#a7a5a6"/>
 <path d="M180 268 215 279 246 267 223 287 205 285Z" fill="${ink}"/>
 <path d="M140 208 162 219 166 248 147 232Z" fill="#a7a5a6"/>
 <path d="M117 176 154 159 208 181 230 180 290 151 310 170 282 216 247 234 224 211 207 236 157 225Z" fill="${ink}" stroke="${paper}" stroke-width="3"/>
 <path d="M143 181 193 194 204 217 163 207Z M238 200 285 170 274 203 243 217Z" fill="${paper}"/>
 <path d="M157 191 181 198 175 204 164 201Z M253 199 274 184 269 198 258 206Z" fill="${ink}"/>
 <path d="M114 224 96 175 104 143 77 151 109 103 91 105 129 62 118 45 163 44 179 15 209 33 248 7 254 31 300 21 292 49 331 63 316 87 344 117 321 147 313 191 287 215 295 160 277 133 239 176 249 132 204 177 209 131 175 170 179 133 146 168 137 218Z" fill="${ink}" stroke="${paper}" stroke-width="4"/>
 <path d="M131 93 171 64 198 65 M208 74 244 46 275 47 M277 83 302 96 309 121 M121 131 143 111 M179 102 206 84" fill="none" stroke="${paper}" stroke-width="5"/>
 <path d="M98 516 97 440 132 401 151 348 165 291 169 252 183 232 198 228 199 240 187 267 183 306 202 271 216 239 228 229 239 232 236 248 220 282 219 312 244 281 257 262 271 259 278 266 270 281 250 309 242 340 219 372 211 410 192 449 191 516Z" fill="${red}" stroke="${ink}" stroke-width="5"/>
 <path d="M152 348 177 362 192 352 M180 306 192 324 M216 309 224 329 M150 399 180 416 201 407 M138 432 164 446" stroke="${ink}" stroke-width="4" fill="none"/>
 <path d="M94 459 128 439 194 462 187 516 86 516Z" fill="${ink}" stroke="${paper}" stroke-width="4"/>
 <path d="M102 467 184 491" stroke="${red}" stroke-width="5"/>
</g>`;

await writeFile(`${root}assets/calling-card.svg`, svg(1280,520,'ODIE / demonfirx. Frontend developer. Persona 5 Joker inspired calling card.',`
<path fill="${red}" d="M0 0H1280V520H0Z"/><path fill="url(#dots)" d="M0 0H1280V520H0Z"/>
<path d="M861 0H1280V520H702L813 399 770 347 836 282 803 240 891 129 847 99Z" fill="${paper}"/>
<path d="M891 0H1280V520H729L838 400 798 349 861 284 832 241 918 130 873 99Z" fill="${ink}"/>
<path d="M930 0H1280V520H768Z" fill="url(#lines)"/>
<path d="M-20 437 779 330 717 492 -20 548Z" fill="${ink}"/>
${label(54,43,'CALLING CARD / 001',275)}
<g transform="translate(50 94) rotate(-5)">
<text x="7" y="181" font-family="Impact,Arial Black,sans-serif" font-size="216" letter-spacing="-4" fill="${ink}">ODIE.</text>
<text y="171" font-family="Impact,Arial Black,sans-serif" font-size="216" letter-spacing="-4" fill="${paper}">ODIE.</text>
</g>
<g transform="translate(67 317) rotate(-5)"><path d="M-12 -27H584L560 20H-17Z" fill="${ink}"/><text x="2" y="6" font-family="Arial,sans-serif" font-weight="900" font-size="26" letter-spacing="5" fill="${paper}">FRONTEND DEVELOPER</text></g>
<g transform="translate(61 433) rotate(-5)"><text y="0" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="2" fill="${paper}">SHARP INTERFACES. PLAYFUL IDEAS.</text><text y="37" font-family="monospace" font-size="17" letter-spacing="2" fill="${red}">GITHUB.COM / DEMONFIRX</text></g>
${star(762,68,.66,ink)}${star(754,68,.57)}${star(1209,421,.7,red)}${star(1209,421,.47)}
<g transform="translate(817 10) scale(.97)">${joker}</g>
<path d="M1134 30 1258 17 1244 70 1125 82Z" fill="${red}"/><text x="1143" y="61" font-family="Impact,sans-serif" font-size="25" fill="${paper}" transform="rotate(-6 1143 61)">WILD CARD</text>
<path d="M0 508 180 502 302 513 418 504 607 515 775 507 947 516 1134 508 1280 514V520H0Z" fill="${paper}"/>`));

await writeFile(`${root}assets/calling-card-mobile.svg`, svg(680,760,'ODIE / demonfirx. Frontend developer. Joker inspired portrait.',`
<path fill="${red}" d="M0 0H680V760H0Z"/><path fill="url(#dots)" d="M0 0H680V760H0Z"/>
<path d="M0 341 680 260V760H0Z" fill="${paper}"/><path d="M0 361 680 280V760H0Z" fill="${ink}"/>
<path d="M0 361 680 280V760H0Z" fill="url(#lines)"/>
${label(35,35,'CALLING CARD / 001',275)}
<g transform="translate(30 70) rotate(-5)"><text x="5" y="182" font-family="Impact,Arial Black,sans-serif" font-size="216" letter-spacing="-3" fill="${ink}">ODIE.</text><text y="174" font-family="Impact,Arial Black,sans-serif" font-size="216" letter-spacing="-3" fill="${paper}">ODIE.</text></g>
<g transform="translate(38 289) rotate(-5)"><path d="M-8 -27H577L562 20H-12Z" fill="${ink}"/><text y="6" font-family="Arial,sans-serif" font-weight="900" font-size="26" letter-spacing="4" fill="${paper}">FRONTEND DEVELOPER</text></g>
${star(609,84,.7,ink)}${star(609,84,.57)}
<g transform="translate(245 343) scale(.84)">${joker}</g>
<g transform="translate(34 453) rotate(-6)"><text font-family="Impact,sans-serif" font-size="49" fill="${paper}"><tspan x="0">SHARP</tspan><tspan x="0" dy="51">INTERFACES.</tspan><tspan x="0" dy="70" fill="${red}">PLAYFUL</tspan><tspan x="0" dy="51" fill="${red}">IDEAS.</tspan></text></g>
<path d="M0 710H680V760H0Z" fill="${red}"/><text x="34" y="743" font-family="monospace" font-weight="700" font-size="21" letter-spacing="2" fill="${paper}">GITHUB.COM / DEMONFIRX</text>`));

const projects = [
 ['portfolio','01','ODIE / PORTFOLIO','React + TypeScript / Tailwind CSS / Motion','A personal portfolio with expressive type and motion.','M14 52H138V137H14Z M14 72H138 M23 62H28 M34 62H39 M45 62H50 M39 99 28 109 39 119 M107 99 118 109 107 119 M83 93 66 126'],
 ['pokemon','02','POKEMON BATTLE','JavaScript / CSS / HTML','Turn-based battles, type effects, and a smart opponent.','M23 99a53 53 0 1 0 106 0 53 53 0 1 0-106 0 M23 99H61 M91 99H129 M61 99a15 15 0 1 0 30 0 15 15 0 1 0-30 0'],
 ['roughsketch','03','ROUGHSKETCH UI','JavaScript / CSS / HTML','From hand-drawn wireframes to generated interfaces.','M24 48 128 53 124 142 19 138Z M36 68 81 66 79 93 33 94Z M91 67 112 68 M91 80 110 79 M33 107 111 109 M33 122 89 121 M112 125 143 94 150 101 119 133 109 136Z'],
 ['nintendo','04','NINTENDO RETRO','CSS / JavaScript / HTML','A retro web tribute to Nintendo.','M42 66H113L138 118Q143 138 125 138L103 116H49L29 138Q10 143 13 122Z M44 81V107 M31 94H57 M108 87H109 M120 100H121 M68 106H84'],
];
for (const [file, number, name, tech, desc, symbol] of projects) {
 const words = desc.split(' '), middle = Math.ceil(words.length / 2);
 const line1 = words.slice(0,middle).join(' '), line2 = words.slice(middle).join(' ');
 await writeFile(`${root}assets/${file}-mobile.svg`, svg(640,320,`${name}: ${desc} ${tech}`,`
<path fill="${ink}" d="M0 0H640V320H0Z"/><path fill="url(#lines)" d="M0 0H640V320H0Z"/>
<path d="M0 0H640V63H0Z" fill="${red}"/><text x="25" y="42" font-family="monospace" font-size="27" letter-spacing="2" fill="${paper}">TARGET / ${number}</text>
<path d="M558 31H606M591 18 606 31 591 44" fill="none" stroke="${paper}" stroke-width="4"/>
<text x="25" y="133" font-family="Impact,Arial Black,sans-serif" font-size="52" fill="${paper}">${name}</text>
<text x="25" y="191" font-family="Arial,sans-serif" font-size="29" fill="${paper}"><tspan x="25">${line1}</tspan><tspan x="25" dy="40">${line2}</tspan></text>
<path d="M25 265H615" stroke="${paper}" opacity=".25"/><text x="25" y="299" font-family="monospace" font-size="20" fill="#f76680">${tech}</text>`));
 await writeFile(`${root}assets/${file}.svg`, svg(1280,240,`${name}: ${desc} ${tech}`,`
<path fill="${ink}" d="M0 0H1280V240H0Z"/><path fill="url(#lines)" d="M0 0H1280V240H0Z"/>
<path d="M0 0H222L163 240H0Z" fill="${red}"/><path d="M210 0H222L163 240H150Z" fill="${paper}"/>
<text x="25" y="36" font-family="monospace" font-size="17" letter-spacing="2" fill="${paper}">TARGET / ${number}</text>
<g transform="translate(16 38)" stroke="${paper}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${symbol}"/></g>
<text x="249" y="88" font-family="Impact,Arial Black,sans-serif" font-size="55" letter-spacing="1" fill="${paper}">${name}</text>
<text x="250" y="133" font-family="Arial,sans-serif" font-size="23" fill="${paper}">${desc}</text>
<text x="250" y="189" font-family="monospace" font-size="20" fill="#f76680">${tech}</text>
<path d="M1180 168H1230M1211 150 1230 168 1211 186" fill="none" stroke="${paper}" stroke-width="5"/>
<path d="M250 216H1230" stroke="${paper}" stroke-width="1" opacity=".25"/>`));
}
for (const [name, text, width, inverse] of [['visit-portfolio','VIEW PORTFOLIO',210,false],['explore-repos','EXPLORE REPOS',200,true]]) {
 await writeFile(`${root}assets/${name}.svg`, svg(width,44,text,`<path d="M7 0H${width}L${width-7} 44H0Z" fill="${inverse?ink:red}"/><text x="18" y="28" fill="${paper}" font-family="Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="1">${text}</text><path d="M${width-34} 22H${width-18}M${width-24} 16 ${width-18} 22 ${width-24} 28" fill="none" stroke="${paper}" stroke-width="2"/>`));
}
await writeFile(`${root}assets/sign-off.svg`, svg(1280,110,'The next move is yours. Explore the code.',`<path fill="${red}" d="M0 0H1280V110H0Z"/><path fill="url(#dots)" d="M0 0H1280V110H0Z"/><path d="M-10 20 945 0 916 110H-10Z" fill="${ink}"/><text x="35" y="71" font-family="Impact,Arial Black,sans-serif" font-size="47" letter-spacing="2" fill="${paper}">THE NEXT MOVE IS YOURS.</text><text x="968" y="64" font-family="monospace" font-size="19" font-weight="700" fill="${paper}">EXPLORE THE CODE</text>${star(898,53,.6)}`));
console.log('Built 13 original SVG assets.');
