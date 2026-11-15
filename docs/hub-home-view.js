'use strict';
let hubMasterPreview=false;
let hubPetPreview=false;
const hubSelfPreview={hp:62,energy:48,water:54,treated:false};
const hubRoles={single:{label:'Solo',title:'ดูแลตัวเอง แล้วออกสำรวจ',note:'ของใช้ ฟื้นสถานะ ซ่อมอุปกรณ์ และผู้ช่วยในโลกของเรา'},host:{label:'Host',title:'พร้อมเล่นกับเพื่อน ดูแลห้องได้สะดวก',note:'เดินทางหาเพื่อน เตรียมชุดของ และเข้าถึงเครื่องมือจัดการโลก'},client:{label:'Client',title:'เครื่องมือของเรา ใช้ในห้องของเพื่อน',note:'ดูแลตัวเรา เติมของเข้ากระเป๋า และเดินทาง โดยไม่แก้โลกของ Host'}};
function hubQuickTools(mode){
 const all={restore:['self-tools','ฟื้นสถานะตัวเรา','HP · พลังงาน · น้ำและสารอาหาร','Self'],doctors:['self-tools','รักษาอาการตัวเรา','แผลและโรค · เปิดหน้า Doctors','Self'],kit:['kit','ชุดเอาตัวรอด','อาหาร น้ำ และอุปกรณ์พร้อมใช้',mode==='client'?'Backpack only':'Ground / Backpack'],items:['items','ค้นหาไอเทม','ค้นชื่อ แล้วเพิ่มของเข้ากระเป๋า',mode==='client'?'Backpack only':'Self / World'],repair:['repair','ซ่อมอุปกรณ์','อาวุธ เครื่องมือ และเกราะของเรา','Self'],travel:['teleport','เดินทาง / ไปหาเพื่อน','จุดที่บันทึก สถานที่ และผู้เล่น','Self'],utility:['field-tools','บิน / แผนที่ / เก็บธนู','i_can_fly · ชื่อเพื่อน · เครื่องมือสำรวจ','Self'],pet:['companions','LazyFrog / กบอ๊บอ๊บ','เปิด–ปิดผู้ติดตาม · นำออกเมื่อเซฟ','SP / Host'],world:['world','เวลาและอากาศ','เครื่องมือจัดการโลกของ Host','World'],skills:['skills','ทักษะตัวเรา','ดูและปรับระดับ Skills','Self']};
 all.utility[1]='Fly / In wall';all.utility[2]='i_can_fly / movement';
 const ids=['restore','kit','items','repair','travel','utility','pet','doctors','skills','world'];
 return ids.map(id=>({id,route:all[id][0],title:all[id][1],description:all[id][2],scope:all[id][3],allowed:hubRouteAllowed(all[id][0],mode)}));
}
function hubRouteAllowed(route,mode){return !(mode==='client'&&['world','forest','ai','companions','npc-worker'].includes(route))&&!(mode==='host'&&route==='forest');}
function hubNavigationEntries(entries,group){
 const link=([id,icon,label])=>{
  const allowed=group==='game'||hubRouteAllowed(id,state.mode);
  return `<a href="#${id}" class="${active===id?'active ':''}${allowed?'':'is-locked'}" ${active===id?'aria-current="page"':''} ${allowed?'':'aria-disabled="true" data-hub-locked title="ใช้ไม่ได้ในโหมดนี้"'}><span class="symbol" aria-hidden="true">${icon==='?'?'▦':icon}</span><span>${label}${allowed?'':' · LOCKED'}</span></a>`;
 };
 if(group==='game')return entries.map(link).join('');
 const primary=entries.filter(s=>hubRouteOrder.includes(s[0]));
 const secondary=entries.filter(s=>!hubRouteOrder.includes(s[0]));
 return primary.map(link).join('')+`<details class="hub-nav-more" ${secondary.some(s=>s[0]===active)?'open':''}><summary>แผนงาน / ผลทดสอบ / ตัวอย่าง</summary>${secondary.map(link).join('')}</details>`;
}
function hubRolePicker(){return `<div class="hub-role-picker" role="group" aria-label="โหมดตัวอย่าง">${Object.entries(hubRoles).map(([key,value])=>`<button data-hub-mode="${key}" aria-pressed="${state.mode===key}"><strong>${value.label}</strong><span>${key==='single'?'เล่นคนเดียว':key==='host'?'เราเปิดห้อง':'เราเข้าห้องเพื่อน'}</span></button>`).join('')}</div>`;}
function hubPreviewNotice(){return `<div class="hub-preview-note"><span class="hub-live-dot"></span><span>.80 / ${hubMasterPreview?'ON':'OFF'} / ${hubInterfaceMode||'choose mode'} / browser simulation</span><button data-hub-control>Insert: mode / ON-OFF</button></div>`;}
function hubActionPage(content){return hubPreviewNotice()+`<fieldset class="hub-action-page" ${!hubMasterPreview?'disabled':''}>${content}</fieldset>`;}
function hubHomePage(){
 const role=hubRoles[state.mode]||hubRoles.single;
 return heading('ใช้งานบ่อย',role.title,role.label.toUpperCase())+hubRolePicker()+hubPreviewNotice()+`<p class="hub-role-note">${role.note}</p><div class="hub-section-title"><h2>เริ่มจากสิ่งที่ต้องใช้ตอนนี้</h2><span>เปิดหน้าควบคุมก่อน จึงเลือกคำสั่ง</span></div><div class="hub-quick-grid">${hubQuickTools(state.mode).map((tool,index)=>`<a class="hub-quick-card ${tool.allowed?'':'is-locked'} ${index<2?'hub-priority':''}" href="#${tool.route}" data-hub-tool="${tool.id}" ${tool.allowed?'':'aria-disabled="true" data-hub-locked'}><div><span class="hub-tool-number">${String(index+1).padStart(2,'0')}</span><span class="pill">${tool.scope}</span></div><h2>${tool.title}</h2><p>${tool.description}</p><span class="hub-open-label">${tool.allowed?'เปิดหน้าควบคุม <span aria-hidden="true">↗</span>':'ใช้ไม่ได้ในโหมดนี้'}</span></a>`).join('')}</div><div class="hub-bottom-grid"><section class="panel"><div class="panel-head"><h2>ขอบเขตโหมดนี้</h2></div><p class="panel-content">${state.mode==='client'?'Pet / เวลา / อากาศ / AI spawn ยังล็อก · Kit และ Items ใช้กระเป๋าตัวเรา · วาร์ปขยับเฉพาะตัวเรา':state.mode==='host'?'ดูสถานะเพื่อนได้ แต่แก้ HP หรือทักษะเพื่อนไม่ได้ · Forest และการคราฟโต๊ะทันทีเป็น Solo เท่านั้น':'ใช้เครื่องมือกับตัวเราและโลกนี้ได้ · Pet ต้องเปิดใหม่หลังเซฟ'}</p><a class="hub-text-link" href="#mode-status">ดูความสามารถและผลทดสอบแยกรายโหมด ↗</a></section><section class="panel"><div class="panel-head"><h2>ปุ่มที่หยิบบ่อย</h2></div><div class="hub-shortcuts"><span><kbd>Shift + R</kbd> เปิด / ปิดเมนู</span><span><kbd>G</kbd> แปลนที่เล็ง</span><span><kbd>F8</kbd> เข้า / ออกจากการบิน</span></div></section></div><p class="hub-evidence-note">Installed 0.4.80: select .80 and Apply. Native game/cache restored clean; no Apply or runtime confirmation. Solo checklist 1-6 PASS belongs to .69, not the new UI.</p>`;
}
function hubSelfToolsPage(){return hubSelf80Page();}
function hubFieldToolsPage(){return hubFly80Page();}
function hubCompanionsPage(){if(state.mode==='client')return heading('ผู้ติดตาม','โหมด Client ยังไม่รองรับ Pet','LOCKED');return heading('ผู้ติดตามของเรา','LazyFrog / กบอ๊บอ๊บ · NPC Friend ถอดออกชั่วคราว','SP / HOST')+hubPreviewNotice()+`<div>${panel('LazyFrog / กบอ๊บอ๊บ',`<div class="panel-content"><p>ผู้ติดตามส่วนตัว เปิดใหม่หลังเซฟ</p><button data-hub-pet aria-pressed="${hubPetPreview}" ${!hubMasterPreview?'disabled':''}>${hubPetPreview?'ปิด LazyFrog':'เปิด LazyFrog'}</button><p><a class="inventory-link" href="#mode-status">ดูผลทดสอบ Pet</a></p></div>`)}</div>`;}
function setHubPreviewMode(mode){if(!hubRoles[mode])return;state.mode=mode;expansionPreview.mode=mode;if(mode!=='single')expansionPreview.invisible=false;if(mode==='client'){state.toggles.everywhere=false;framePreviewHeight=0;hubPetPreview=false;expansionPreview.npc='off';expansionPreview.job='รอคำสั่ง';}if(!hubRouteAllowed(active,mode))active='overview';save();render();}
function handleHubHomeClick(event){
 if(handleHeavyHandsClick(event))return true;
 if(event.target.closest('[data-hub-locked]')){event.preventDefault?.();return true;}
 const mode=event.target.closest('[data-hub-mode]');if(mode){setHubPreviewMode(mode.dataset.hubMode);return true;}
 if(event.target.closest('[data-hub-master]')){toggleHubControl();return true;}
 if(event.target.closest('[data-hub-pet]')){if(hubMasterPreview&&state.mode!=='client')hubPetPreview=!hubPetPreview;render();return true;}
 const action=event.target.closest('[data-hub-self]');if(action){if(hubMasterPreview){if(action.dataset.hubSelf==='restore')hubSelfPreview.hp=hubSelfPreview.energy=hubSelfPreview.water=hubSelfPreview.stamina=hubSelfPreview.fat=hubSelfPreview.carb=hubSelfPreview.protein=100;else if(action.dataset.hubSelf==='doctors')hubSelfPreview.treated=true;render();}return true;}
 return false;
}
