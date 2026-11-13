const healthyFields=['Fat','Carbohydrates','Proteins','Water','AddEnergy','Energy','SanityChange','ConsumeEffect','ConsumeEffectChance','ConsumeEffectLevel','ConsumeEffectDelay','DrinkEffect','PoisonDebuff','HealingTimeDec','SpoilTime','Eatable','Drinkable'];
const healthyExtraFields=['SpoilEffectID','SpoilOnlyIfTriggered','CanCookOnFire','CookingLength','CookingItemID','CanSmoke','SmokingLength','SmokingItemID','CanDry','DryingLength','DryingItemID'];
let healthyMode='nutrition';
let healthySymptom='';
function healthyDisplayValue(value){
 if(value==null)return '—';
 const text=String(value).trim();
 if(text!==''&&/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text)&&Number.isFinite(Number(text)))
  return Number(text).toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:2});
 if(text.includes(',')){
  try{const args=JSON.parse('['+text+']');return args.map(v=>typeof v==='number'?healthyDisplayValue(v):JSON.stringify(v)).join(', ');}catch{}
 }
 return String(value);
}
const healthyItemMap=new Map(window.GH_GAME_LIBRARY.items.map(i=>[i.id,i]));
function healthyRecipe(item){
 const label=id=>{const i=healthyItemMap.get(id);if(i)return i.name_th||i.name_en||id;const liquid=window.GH_HEALTHY_SOURCES.liquids.find(l=>l.id===id);return liquid?.name_th||liquid?.name_en||id;};
 if(item.source_kind==='Liquids')return (item.components||[]).filter(id=>id!=='None').map(label).join(' + ')||null;
 const raw=item.properties.find(p=>p.name==='Components')?.arguments;
 if(!raw)return null;
 return raw.replace(/^"|"$/g,'').split(';').map(part=>{const [id,count]=part.trim().split('*');return id?label(id)+' × '+(count||'1'):'';}).filter(Boolean).join(' + ')||null;
}
function healthyRecipeHeader(){return healthySortHeader('recipe','สูตรผสม');}
function healthyRecipeCell(item){return `<td>${wbEscape(healthyRecipe(item)||'ไม่ระบุสูตรผสม')}${item.source_kind==='Liquids'&&healthyRecipe(item)?'<div class="muted">ต้นฉบับไม่ระบุปริมาณส่วนผสม</div>':''}</td>`;}
function healthySymptomFilter(){
 if(healthyMode!=='care')return '';
 const symptoms=[...new Set(healthyItems().flatMap(i=>healthyTreatments(i).filter(t=>t.therapeutic).map(t=>t.symptom)))].sort((a,b)=>a.localeCompare(b,'th'));
 return `<label>อาการ / ผลที่เกี่ยวข้อง<select id="healthy-symptom"><option value="">ทุกอาการ</option>${symptoms.map(s=>`<option value="${wbEscape(s)}" ${s===healthySymptom?'selected':''}>${wbEscape(s)}</option>`).join('')}</select></label>`;
}
const healthySort={nutrition:{key:'name',direction:1},care:{key:'name',direction:1}};
function healthySortValue(item,key){
 if(key==='recipe')return healthyRecipe(item);
 if(key==='id')return item.id;
 if(key==='info_type')return item.info_type||null;
 if(key==='name')return item.name_th||item.name_en||item.id;
 if(key==='icon')return item.icon_key||null;
 if(key==='symptom')return healthyTreatments(item)[0]?.symptom??null;
 if(key==='level'){
  const value=healthyTreatments(item)[0]?.value;
  return value!=null&&value!=='—'&&Number.isFinite(Number(value))?Number(value):null;
 }
 if(key==='details')return item.properties.filter(p=>healthyFields.includes(p.name)).map(p=>p.name+' '+p.arguments).join(' ')||null;
 const raw=healthyProperties(item)[key];
 return raw!=null&&raw!==''&&Number.isFinite(Number(raw))?Number(raw):null;
}
function healthySortedRows(rows){
 const sort=healthySort[healthyMode];
 return [...rows].sort((a,b)=>{
  const x=healthySortValue(a,sort.key),y=healthySortValue(b,sort.key);
  if(x==null||y==null)return x==null&&y==null?a.id.localeCompare(b.id):x==null?1:-1;
  const compared=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'th',{numeric:true});
  return compared*sort.direction||a.id.localeCompare(b.id);
 });
}
function healthySortHeader(key,label){
 const sort=healthySort[healthyMode],selected=sort.key===key;
 return `<th aria-sort="${selected?(sort.direction===1?'ascending':'descending'):'none'}"><button class="healthy-sort" data-healthy-sort="${key}" title="คลิกเพื่อสลับเรียงขึ้น–ลง${key==='level'||key==='symptom'?' ตามผลบรรทัดแรกของรายการ':''}">${label} <span aria-hidden="true">${selected?(sort.direction===1?'↑':'↓'):'↕'}</span></button></th>`;
}
function healthyTreatments(item){
 const p=healthyProperties(item),result=[];
 const effect=(p.ConsumeEffect||'').replace(/^"|"$/g,'');
 const names={FoodPoisoning:'อาหารเป็นพิษ',Fever:'ไข้',ParasiteSickness:'พยาธิ',Insomnia:'นอนไม่หลับ',DirtSickness:'ความสกปรก'};
 if(effect&&effect!=='None'){
  const value=p.ConsumeEffectLevel;
  result.push({symptom:names[effect]||effect,key:'ConsumeEffectLevel',value:value??'—',therapeutic:Number(value)<0,direction:value==null?'ไม่ระบุระดับ':Number(value)<0?'ลดระดับอาการ':Number(value)>0?'เพิ่มระดับอาการ / ผลข้างเคียง':'ระดับผลเป็นศูนย์'});
 }
 for(const effect of item.drink_effects||[])result.push({symptom:names[effect.effect]||effect.effect,key:'DrinkEffect level',value:String(effect.level),therapeutic:effect.level<0,direction:(effect.level<0?'ลดระดับอาการ':'เพิ่มระดับอาการ / ผลข้างเคียง')+` (โอกาส ${healthyDisplayValue(effect.chance)}; หน่วง ${healthyDisplayValue(effect.delay)} ตามข้อมูล)`});
 if(p.PoisonDebuff!=null)result.push({symptom:'พิษ',key:'PoisonDebuff',value:p.PoisonDebuff,therapeutic:Number(p.PoisonDebuff)>0,direction:'ค่าลดพิษ'});
 if(p.HealingTimeDec!=null)result.push({symptom:'แผล',key:'HealingTimeDec',value:p.HealingTimeDec,therapeutic:Number(p.HealingTimeDec)>0,direction:'ค่าลดเวลารักษาแผล ไม่ใช่ระดับโรค'});
 if(item.source_kind!=='Liquids')for(const wound of window.GH_HEALTHY_SOURCES.wound_items[item.id]||[])result.push({symptom:wound.symptom,key:'BIWoundSlot.CanInsertItem',value:'—',therapeutic:true,direction:'ใช้กับแผลตามเงื่อนไข: '+wound.condition});
 return result;
}
function healthyPropertyLabel(key){return ({ConsumeEffect:'ผลหลังใช้',ConsumeEffectChance:'โอกาสเกิดผล (ค่าดิบ)',ConsumeEffectLevel:'ระดับผล (ค่าดิบ)',ConsumeEffectDelay:'เวลาหน่วง (ค่าดิบ)',PoisonDebuff:'ค่าลดพิษ',HealingTimeDec:'ค่าลดเวลารักษาแผล',SpoilTime:'เวลาเน่าเสีย (ค่าดิบ)',SpoilEffectID:'เปลี่ยนเป็นเมื่อเน่าเสีย',SpoilOnlyIfTriggered:'เน่าเสียเมื่อถูกกระตุ้น',CanCookOnFire:'อนุญาตให้ปรุงด้วยไฟ',CookingLength:'เวลาปรุง (ค่าดิบ)',CookingItemID:'ผลลัพธ์เมื่อปรุง',CanSmoke:'อนุญาตให้รมควัน',SmokingLength:'เวลารมควัน (ค่าดิบ)',SmokingItemID:'ผลลัพธ์เมื่อรมควัน',CanDry:'อนุญาตให้ทำแห้ง',DryingLength:'เวลาทำแห้ง (ค่าดิบ)',DryingItemID:'ผลลัพธ์เมื่อทำแห้ง'})[key]||key;}
function healthyPropertyRows(item,keys){
 return item.properties.filter(p=>keys.includes(p.name)).map(p=>`<div style="margin-bottom:8px"><b>${healthyPropertyLabel(p.name)}</b>: ${wbEscape(healthyDisplayValue(p.arguments))}<div class="muted">${wbEscape(p.name)}</div></div>`).join('')||'—';
}
function healthyProperties(item){const p=Object.fromEntries(item.properties.map(p=>[p.name,p.arguments]));if(p.Energy!=null&&p.AddEnergy==null)p.AddEnergy=p.Energy;return p;}
function healthyAllItems(){return [...window.GH_GAME_LIBRARY.items.map(i=>({...i,source_kind:'Items'})),...window.GH_HEALTHY_SOURCES.liquids];}
function healthyItems(){return healthyAllItems().filter(i=>healthyMode==='nutrition'?['Fat','Carbohydrates','Proteins','Water'].some(k=>{const raw=healthyProperties(i)[k];return raw!=null&&Number.isFinite(Number(raw))&&Number(raw)!==0;}):healthyTreatments(i).some(t=>t.therapeutic));}
function healthyItemIdentity(i){return `<b>${wbEscape(i.name_th||i.name_en||'—')}</b><div>${wbEscape(i.name_en||'—')}</div>`;}
function healthyIdHeader(){return healthySortHeader('id','รหัสไอเทม / ของเหลว');}
function healthyNameHeader(){return healthySortHeader('name','ชื่อรายการ');}
function healthyIdCell(i){return `<td>${wbEscape(i.id)}<div class="muted">${wbEscape(i.source_kind||'Items')}</div></td>`;}
function healthyPage(){
 return `<div class="page-heading"><div><div class="eyebrow">GAME DATABASE / NUTRITION</div><h1>Healthy</h1><p>คุณค่าอาหาร สมุนไพร และยาในเกม</p></div></div>
 <section class="list-explanation"><h2>ที่มาและวิธีคัดรายการ</h2><p>รวมข้อมูล Items ทุกประเภทและ Liquids จาก resources.assets ในฐานข้อมูลของเรา ไม่จำกัดเฉพาะ Food/Herb/Dressing ชื่อใช้คำแปลเกม ส่วนของเหลวที่ชื่อซ้ำว่า “ต้ม” จะแสดงวัตถุดิบและรหัสกำกับ เพื่อแยกสูตรโดยไม่แต่งชื่อเกม</p><p><b>คุณค่าทางอาหาร:</b> แสดงทุกรายการที่ประกาศ Fat, Carbohydrates, Proteins หรือ Water เป็นค่าที่ไม่ใช่ศูนย์ รวมอาหาร น้ำ และซุป ทั้งค่าบวกและลบ ค่า — หมายถึงไม่มีค่าประกาศ ไม่ใช่ศูนย์ ไม่แปลงเป็นแคลอรี ค่าของของเหลวเป็นค่าตามสูตร ไม่ใช่การรับรองปริมาณที่ได้รับต่อการดื่มหนึ่งครั้ง</p><p><b>การรักษา / การแพทย์:</b> แสดงรายการที่มี ConsumeEffect/DrinkEffect ลดระดับอาการ, PoisonDebuff หรือ HealingTimeDec เป็นค่าบวก รวมไอเทมใช้กับแผลที่ตรวจใน BIWoundSlot.CanInsertItem เช่น หนอนแมลง มด และเข็ม ผลข้างเคียงของรายการที่รักษาได้ยังแสดงควบคู่ ไม่รวมรายการที่มีแต่ผลเสีย</p><p>ค่าผลต่างระบบไม่รวมกันเป็นระดับโรคเดียวกัน การใช้กับแผลขึ้นกับชนิดแผล สถานะ และเงื่อนไข slot ไม่ใช่ยืนยันว่ารักษาหายทันที ค่าจาก properties ยังไม่คำนวณ inheritance/defaults ทั้งหมด และข้อมูลการรักษาด้วยวิธีอื่นที่ไม่มีไอเทม เช่น นอนพัก ยังไม่อยู่ในรายการนี้</p></section>
 <div class="mini-tabs"><button data-healthy-mode="nutrition" class="${healthyMode==='nutrition'?'primary':''}">คุณค่าทางอาหาร</button><button data-healthy-mode="care" class="${healthyMode==='care'?'primary':''}">การรักษา / การแพทย์</button></div>
 <p class="notice">ตัวอย่าง Painkillers ประกาศ ConsumeEffect = Fever และ ConsumeEffectLevel = -5; ค่าติดลบเป็นระดับผลตามข้อมูล ไม่ได้ยืนยันว่ารักษาหายทันที ส่วนยาพอกแสดง PoisonDebuff และ HealingTimeDec ตามที่ประกาศ ค่าหน่วงและเวลาแสดงดิบโดยไม่เดาหน่วย</p>
 <div class="wb-tools"><label>ค้นหา<input id="healthy-search" type="search" placeholder="ชื่อไทย / English / ID / ผลที่ประกาศ"></label><label>ประเภท<select id="healthy-type"><option value="">ทั้งหมด</option>${[...new Set(healthyItems().map(i=>i.info_type))].sort().map(t=>`<option value="${wbEscape(t)}">${wbEscape(t)}</option>`).join('')}</select></label><label>ข้อมูลที่มี<select id="healthy-feature"><option value="">ทั้งหมด</option><option value="ConsumeEffect">ผลหลังใช้ / ผลข้างเคียง</option><option value="PoisonDebuff">ค่าลดพิษ</option><option value="HealingTimeDec">เวลารักษาแผล</option><option value="SpoilTime">การเน่าเสีย</option><option value="CookingItemID">การปรุงด้วยไฟ</option><option value="SmokingItemID">การรมควัน</option><option value="DryingItemID">การทำแห้ง</option></select></label>${healthySymptomFilter()}<span id="healthy-count" role="status" aria-live="polite"></span></div><div id="healthy-results"></div>`;
}
function renderHealthyRows(){
 const target=document.getElementById('healthy-results');if(!target)return;
 const all=healthyItems(),query=(document.getElementById('healthy-search').value||'').trim().toLocaleLowerCase(),type=document.getElementById('healthy-type').value;
 const feature=document.getElementById('healthy-feature').value;
 const symptom=healthyMode==='care'?healthySymptom:'';
 const rows=healthySortedRows(all.filter(i=>(!symptom||healthyTreatments(i).some(t=>t.therapeutic&&t.symptom===symptom))&&(!type||i.info_type===type)&&(!feature||i.properties.some(p=>p.name===feature))&&(!query||[i.id,i.name_en,i.name_th,i.ingredient_label,healthyRecipe(i),...healthyTreatments(i).map(t=>t.symptom+' '+t.direction),...i.properties.filter(p=>[...healthyFields,...healthyExtraFields].includes(p.name)).map(p=>healthyPropertyLabel(p.name)+' '+p.name+' '+p.arguments)].some(v=>String(v||'').toLocaleLowerCase().includes(query)))));
 document.getElementById('healthy-count').textContent=`แสดง ${rows.length} / ${all.length} รายการ`;
 if(healthyMode==='care'){
  target.innerHTML=`<div class="table-wrap wb-table healthy-care"><table><thead><tr>${healthyIdHeader()}${healthyNameHeader()}${healthyRecipeHeader()}${healthySortHeader('info_type','info_type')}${healthySortHeader('symptom','อาการ / การรักษา')}${healthySortHeader('level','ระดับผล / ค่ารักษา')}${healthySortHeader('details','เงื่อนไขและค่าต้นฉบับ')}</tr></thead><tbody>${rows.map(i=>{const treatments=healthyTreatments(i);return `<tr>${healthyIdCell(i)}<td>${healthyItemIdentity(i)}</td>${healthyRecipeCell(i)}<td>${wbEscape(i.info_type||'?')}</td><td>${treatments.map(t=>`<div style="margin-bottom:12px"><b>${wbEscape(t.symptom)}</b><div>${wbEscape(t.direction)}</div></div>`).join('')||'ไม่พบค่ารักษาหรือผลหลังใช้ที่ประกาศ'}</td><td>${treatments.map(t=>`<div style="margin-bottom:12px"><b>${wbEscape(t.symptom)}: ${wbEscape(healthyDisplayValue(t.value))}</b><div class="muted">${wbEscape(t.key)}</div></div>`).join('')||'—'}</td><td><details><summary>ผลหลังใช้ / รักษา</summary>${healthyPropertyRows(i,['ConsumeEffect','ConsumeEffectLevel','ConsumeEffectChance','ConsumeEffectDelay','PoisonDebuff','HealingTimeDec'])}</details><details><summary>การเน่าเสีย</summary>${healthyPropertyRows(i,['SpoilTime','SpoilEffectID','SpoilOnlyIfTriggered'])}</details><details><summary>การปรุง / แปรรูป</summary>${healthyPropertyRows(i,healthyExtraFields.filter(k=>!k.startsWith('Spoil')))}</details></td></tr>`;}).join('')||'<tr><td colspan="7">ไม่พบรายการที่ตรงกับคำค้น</td></tr>'}</tbody></table></div>`;
  return;
 }
 const columns=[['Fat','ไขมัน'],['Carbohydrates','คาร์บ'],['Proteins','โปรตีน'],['Water','น้ำ'],['AddEnergy','พลังงาน'],['SanityChange','สติ']];
 target.innerHTML=`<div class="table-wrap wb-table healthy-table"><table><thead><tr>${healthyIdHeader()}${healthyNameHeader()}${healthyRecipeHeader()}${healthySortHeader('info_type','info_type')}${healthySortHeader('icon','ไอคอน')}${columns.map(([key,label])=>healthySortHeader(key,wbEscape(label)+'<br><small>'+key+'</small>')).join('')}${healthySortHeader('details','ผลและเงื่อนไขที่ประกาศ')}</tr></thead><tbody>${rows.map(i=>{const p=healthyProperties(i);return `<tr>${healthyIdCell(i)}<td>${healthyItemIdentity(i)}</td>${healthyRecipeCell(i)}<td>${wbEscape(i.info_type||'?')}</td><td>${i.image?`<img loading="lazy" width="56" height="56" src="${wbEscape(i.image)}" alt="${wbEscape(i.name_th||i.id)}">`:'—'}</td>${columns.map(([key])=>`<td>${wbEscape(p[key]??'—')}</td>`).join('')}<td>${i.properties.filter(p=>healthyFields.includes(p.name)&&!columns.some(([key])=>key===p.name)).map(p=>`<div><b>${wbEscape(p.name)}</b>: ${wbEscape(healthyDisplayValue(p.arguments))}</div>`).join('')||'—'}</td></tr>`;}).join('')||'<tr><td colspan="12">ไม่พบรายการที่ตรงกับคำค้น</td></tr>'}</tbody></table></div>`;
}
document.addEventListener('input',e=>{if(e.target.id==='healthy-search')renderHealthyRows();});
document.addEventListener('change',e=>{if(e.target.id==='healthy-symptom'){healthySymptom=e.target.value;renderHealthyRows();}else if(['healthy-type','healthy-feature'].includes(e.target.id))renderHealthyRows();});
document.addEventListener('click',e=>{const button=e.target.closest('[data-healthy-mode]');if(!button)return;const query=document.getElementById('healthy-search').value,type=document.getElementById('healthy-type').value,feature=document.getElementById('healthy-feature').value;healthyMode=button.dataset.healthyMode;document.getElementById('main').innerHTML=healthyPage();document.getElementById('healthy-search').value=query;document.getElementById('healthy-type').value='';document.getElementById('healthy-feature').value='';renderHealthyRows();});

document.addEventListener('click',e=>{const button=e.target.closest('[data-healthy-sort]');if(!button)return;const sort=healthySort[healthyMode];if(sort.key===button.dataset.healthySort)sort.direction*=-1;else{sort.key=button.dataset.healthySort;sort.direction=1;}renderHealthyRows();});
