import vm from 'node:vm';
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
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
const renderedAssets=new Set();
assert.ok(routes.includes('overview')&&routes.includes('field-tools')&&routes.includes('workbook'));
assert.ok(!routes.includes('history')&&!routes.includes('roadmap'));
for(const role of ['single','host','client'])for(const route of routes){
 run(`state.mode=${JSON.stringify(role)};active=${JSON.stringify(route)};render()`);
 assert.ok(node('#main').innerHTML.length>100,`Empty ${role}/${route}`);
 assert.doesNotMatch(node('#main').innerHTML,/\uFFFD|\?{3,}/,`Encoding ${role}/${route}`);
 for(const match of node('#main').innerHTML.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
  assert.ok(!match[1].startsWith('/')||match[1].startsWith('//'),`Root URL in ${route}: ${match[1]}`);
  if(match[1].startsWith('./'))renderedAssets.add(match[1]);
 }
}
for(const asset of renderedAssets)assert.ok((await stat(path.join(root,asset.split(/[?#]/)[0]))).isFile(),`Missing rendered asset: ${asset}`);
run('state.mode="host";active="field-tools";render()');
for(const feature of ['in-wall','invisible','ignore-me'])assert.ok(node('#main').innerHTML.includes(`data-expansion="${feature}"`));
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
