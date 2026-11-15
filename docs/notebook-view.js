// คลังเกม / หน้าหนังสือ — in-game notebook pages in scene order (data: notebook-pages-data.js, tools/export-notebook-web.py).
let notebookTab='NotepadHealingItems',notebookLang='th';
const notebookGroupLabels={Recipe:'วัตถุดิบ',Eat:'กิน',Dressing:'ยาพอก',Boiled:'ต้ม',Planting:'การปลูก',Icons:'',Reputation:'ชื่อเสียง'};
function notebookEsc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function notebookText(t){const v=notebookLang==='en'?t.en:(t.th||t.en);return notebookEsc(v).replace(/\r?\n/g,'<br>');}
function notebookPage(){
 const d=window.GH_NOTEBOOK,total=d.tabs.reduce((n,t)=>n+t.pages.length,0);
 return `<div class="page-heading"><div><div class="eyebrow">GAME DATABASE / NOTEBOOK</div><h1>หน้าหนังสือ</h1><p class="subtitle">สมุดบันทึกในเกม ${d.tabs.length} แท็บ ${total} หน้า เรียงตามลำดับใน scene ของเกม</p></div></div>
 <div class="notice notebook-notice">${d.notes.map(n=>`<div>${notebookEsc(n)}</div>`).join('')}<div class="muted">Source: ${notebookEsc(d.source)} · exported ${notebookEsc(d.exported_at)}</div></div>
 <div class="notebook-tabs" role="tablist">${d.tabs.map(t=>`<button role="tab" data-notebook-tab="${t.id}" aria-selected="${t.id===notebookTab}" class="${t.id===notebookTab?'active':''}">${notebookEsc(t.th)}<small>${notebookEsc(t.en)} · ${t.pages.length}</small></button>`).join('')}</div>
 <div class="wb-tools"><label>ค้นหาทุกแท็บ<input id="notebook-search" type="search" placeholder="ชื่อไทย / English / key ของหน้า"></label><div class="notebook-lang" role="group" aria-label="ภาษา">${[['th','ไทย'],['en','English']].map(([k,l])=>`<button data-notebook-lang="${k}" aria-pressed="${k===notebookLang}" class="${k===notebookLang?'active':''}">${l}</button>`).join('')}</div><span id="notebook-count" class="muted"></span></div>
 <div id="notebook-pages" class="notebook-pages"></div>`;
}
function notebookPageCard(tab,page,index,showTab){
 let group=null,qty='';const lines=[];
 page.elements.forEach((e,i)=>{
  if(i===0&&e.role==='title')return;
  const g=e.group||'';if(g!==group){group=g;const label=notebookGroupLabels[g]??g;if(label)lines.push(`<div class="notebook-group">${notebookEsc(label)}</div>`);}
  if(e.role==='qty'){qty=`<span class="notebook-qty">${notebookText(e)}</span> `;return;}
  lines.push(`<div class="notebook-line${e.role==='value'?' notebook-value':''}" title="${notebookEsc(e.key)}">${qty}${notebookText(e)}</div>`);qty='';
 });
 const body=lines.length?lines.join(''):`<div class="notebook-line muted">${tab.id==='NotepadMap'?'หน้าแผนที่เป็นภาพ ไม่มีข้อความ':'ไม่พบข้อความที่ถอดได้'}</div>`;
 return `<article class="notebook-card"><header><span class="notebook-num">${showTab?notebookEsc(tab.th)+' · ':''}หน้า ${index+1}</span><code>${notebookEsc(page.id)}</code></header><h3>${notebookText(page.title)}</h3>${body}</article>`;
}
function renderNotebookPages(){
 const box=document.getElementById('notebook-pages');if(!box)return;
 const d=window.GH_NOTEBOOK,q=(document.getElementById('notebook-search').value||'').trim().toLocaleLowerCase();
 let cards=[];
 if(q){d.tabs.forEach(t=>t.pages.forEach((p,i)=>{const hay=[p.id,p.title.en,p.title.th,...p.elements.flatMap(e=>[e.key,e.en,e.th])].join(' ').toLocaleLowerCase();if(hay.includes(q))cards.push(notebookPageCard(t,p,i,true));}));}
 else{const t=d.tabs.find(t=>t.id===notebookTab)||d.tabs[0];cards=t.pages.map((p,i)=>notebookPageCard(t,p,i,false));}
 box.innerHTML=cards.join('')||'<div class="empty">ไม่พบหน้าที่ตรงกับคำค้น</div>';
 document.getElementById('notebook-count').textContent=`${cards.length} หน้า${q?' (ค้นทุกแท็บ)':''}`;
}
document.addEventListener('input',e=>{if(e.target.id==='notebook-search')renderNotebookPages();});
function handleNotebookClick(e){
 const tab=e.target.closest('[data-notebook-tab]'),lang=e.target.closest('[data-notebook-lang]');
 if(!tab&&!lang)return false;
 const q=document.getElementById('notebook-search')?.value||'';
 if(tab){notebookTab=tab.dataset.notebookTab;}
 if(lang){notebookLang=lang.dataset.notebookLang;}
 document.getElementById('main').innerHTML=notebookPage();
 document.getElementById('notebook-search').value=tab?'':q;
 renderNotebookPages();
 return true;
}
document.addEventListener('click',handleNotebookClick);
