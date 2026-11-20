import vm from 'node:vm';
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';

const root=path.resolve(process.argv[2]||fileURLToPath(new URL('../docs/',import.meta.url)));
const html=await readFile(path.join(root,'index.html'),'utf8');
assert.doesNotMatch(html,/(?:src|href)="\/(?!\/)/,'Project-site asset must be relative');
const scripts=[...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(m=>m[1]);
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',hidden:true,classList:{add(){},remove(){}},addEventListener(){},focus(){},setSelectionRange(){}});return nodes.get(id);}
const sandbox={document:{querySelector:node,getElementById:id=>node('#'+id),addEventListener(){}},window:{addEventListener(){}},location:{hash:''},localStorage:{getItem:()=>null,setItem(){}},structuredClone,setTimeout:()=>0,clearTimeout(){},console};
vm.createContext(sandbox);
for(const file of scripts) vm.runInContext(await readFile(path.join(root,file),'utf8'),sandbox,{filename:file});
const run=code=>vm.runInContext(code,sandbox);
assert.doesNotMatch(node('#nav').innerHTML,/#history|#roadmap/,'Private navigation excluded');
const routes=run('Object.keys(views)');
assert.ok(routes.includes('siri'),'Public download route');
run('active="siri";render()');
for(const id of ['features','clean','install','controls','trouble'])assert.match(node('#main').innerHTML,new RegExp(`id="siri-${id}"`));
assert.match(node('#main').innerHTML,/ModAPI-backup/);
assert.match(node('#main').innerHTML,/BepInEx/);
assert.match(node('#main').innerHTML,/Verify integrity/);
assert.match(node('#main').innerHTML,/ยังไม่มีผลยืนยันการทดสอบในเกม/);
const release=JSON.parse(await readFile(path.join(root,'downloads/GreenHellSiri/release.json'),'utf8'));
assert.equal(release.name,'GreenHellSiri');assert.equal(release.version,'0.1.0');
assert.equal(release.file,'GreenHellSiri-0.1.0-7ca41faa26fe9f365783e93bc9333dfa.mod');
const packageBytes=await readFile(path.join(root,'downloads/GreenHellSiri',release.file));
assert.equal(packageBytes.length,30780);assert.equal(release.bytes,30780);
assert.equal(createHash('sha256').update(packageBytes).digest('hex').toUpperCase(),'803361A1A79A2318AC7B9A7AFC307171E8C2EF8D3E46E023746EBACBF0BA4AB3');
assert.equal(createHash('sha256').update(packageBytes).digest('hex').toUpperCase(),release.sha256);
assert.match(gunzipSync(packageBytes).toString('utf8'),/<Mod ID="GreenHellSiri">/);
assert.ok(node('#main').innerHTML.includes(`href="./downloads/GreenHellSiri/${release.file}" download`));
const renderedAssets=new Set();
const cardOrder=['restore','kit','items','repair','travel','utility','pet','doctors','skills','world'];
let navOrder;
assert.ok(routes.includes('overview')&&routes.includes('field-tools')&&routes.includes('workbook'));
assert.ok(!routes.includes('history')&&!routes.includes('roadmap'));
for(const role of ['single','host','client'])for(const route of routes){
 run(`state.mode=${JSON.stringify(role)};active=${JSON.stringify(route)};render()`);
 assert.ok(node('#main').innerHTML.length>100,`Empty ${role}/${route}`);
 if(route==='overview'){
  assert.deepEqual(Array.from(node('#main').innerHTML.matchAll(/data-hub-tool="([^"]+)"/g),m=>m[1]),cardOrder);
  const current=Array.from(node('#nav').innerHTML.matchAll(/href="#([^"]+)"/g),m=>m[1]);
  if(navOrder)assert.deepEqual(current,navOrder);else navOrder=current;
  if(role==='client')for(const id of ['pet','world'])assert.match(node('#main').innerHTML,new RegExp(`data-hub-tool="${id}"[^>]*aria-disabled="true"`));
 }
 assert.doesNotMatch(node('#main').innerHTML,/\uFFFD|\?{3,}/,`Encoding ${role}/${route}`);
 for(const match of node('#main').innerHTML.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
  assert.ok(!match[1].startsWith('/')||match[1].startsWith('//'),`Root URL in ${route}: ${match[1]}`);
  if(match[1].startsWith('./'))renderedAssets.add(match[1]);
 }
}
for(const asset of renderedAssets)assert.ok((await stat(path.join(root,asset.split(/[?#]/)[0]))).isFile(),`Missing rendered asset: ${asset}`);
run('state.mode="host";active="field-tools";render()');
run('active="crafting";craftCategory="bandages";craftRecipe=craftRecipes.find(r=>r.category==="bandages").id;render()');
assert.equal((node('#main').innerHTML.match(/data-bandage-result=/g)||[]).length,run('craftRecipes.filter(r=>r.category==="bandages").length'));
assert.match(node('#main').innerHTML,/VenomBite \/ SnakeBite/);
run('active="field-tools";render()');
assert.ok(node('#main').innerHTML.includes('data-expansion="in-wall"'));
for(const feature of ['invisible','ignore-me','names','map-player'])assert.ok(!node('#main').innerHTML.includes(`data-expansion="${feature}"`));
run('active="self-tools";hubSelfSection="survival";render()');
for(const feature of ['invisible','ignore-me'])assert.ok(node('#main').innerHTML.includes(`data-expansion="${feature}"`));
run('active="teleport";render()');
for(const feature of ['names','map-player'])assert.ok(node('#main').innerHTML.includes(`data-expansion="${feature}"`));
let count=0;
async function inspect(directory){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory()){await inspect(file);continue;}
  count++;
  assert.ok(!/project-history|history-view|roadmap-data|roadmap-view/.test(entry.name),'Private file excluded');
  if(!/\.(?:js|html|css|json|txt|md)$/.test(entry.name))continue;
  const text=await readFile(file,'utf8');
  assert.doesNotMatch(text,/\b[A-Za-z]:(?:\\+|\/)/,`Local machine path: ${file}`);
  assert.doesNotMatch(text,/github_pat_[A-Za-z0-9_]+|gh[pousr]_[A-Za-z0-9]{20,}/,`Credential: ${file}`);
  if(!/\.(?:html|css|js)$/.test(entry.name))continue;
  for(const match of text.matchAll(/(?:src|href)=["'](\.\/[^"'${}]+)["']/g)){
   const target=path.resolve(path.dirname(file),match[1].split(/[?#]/)[0]);
   assert.ok(target.startsWith(root+path.sep),'Asset stays inside public root');
   assert.ok((await stat(target)).isFile(),`Missing asset ${match[1]}`);
  }
 }
}
await inspect(root);
console.log(`PASS: ${count} public files, ${scripts.length} scripts, ${routes.length} routes across 3 roles, no private history/paths/tokens, relative asset targets (offline; no browser visual QA)`);
