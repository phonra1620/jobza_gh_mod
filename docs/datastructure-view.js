let structureRequest=0;
let structureSelected='';
function datastructurePage(){
 const data=window.GH_DATASTRUCTURE;
 return `<div class="page-heading"><div><div class="eyebrow">GAME DATABASE / SOURCE INDEX</div><h1>Datastructure</h1><p>โครงสร้างข้อมูลจาก resources.assets</p></div></div>
 <section class="list-explanation"><h2>ที่มาและขอบเขต</h2><p>ดัชนีนี้แสดง TextAsset ${data.entries.length} ชุดที่ส่งออกจาก resources.assets พร้อมเนื้อหาต้นฉบับ เช่น Items, Liquids, Player_Diseases, Player_Treatments, Player_InjuryTreatments, PlayerSkills และ AIData ข้อมูลส่วนใหญ่ยังไม่ได้แปลงเป็นตารางที่มีความหมายครบทุกช่อง</p><p>resources.assets มี object ทั้งหมด ${data.objects.toLocaleString()} รายการ ไม่ได้มีเฉพาะ TextAsset หน้านี้ไม่รวมการแสดงภาพ โมเดล เสียง หรือโค้ด DLL และการพบไฟล์ไม่ได้ยืนยันว่าเกมใช้ทุกค่าของไฟล์นั้นในทุกโหมด</p><details><summary>แหล่งต้นฉบับและ SHA256</summary><p>${wbEscape(data.source)}</p><p>${wbEscape(data.sha256)}</p><p>สำเนาต้นฉบับอยู่ใน GameDatabase/raw-text และดัชนีครบอยู่ใน asset-index.json หน้านี้อ่านสำเนาสำหรับเว็บ ไม่แก้ไฟล์เกม</p></details></section>
 <div class="wb-tools"><label>ค้นหาแหล่งข้อมูล<input id="structure-search" type="search" placeholder="เช่น Liquids / Player / AI / Texts"></label><span id="structure-count" role="status" aria-live="polite"></span></div>
 <p class="notice">กดชื่อหรือปุ่ม “อ่าน” ในแถวข้อมูล เนื้อหาจะเปิดในกรอบด้านขวา (จอแคบอยู่ด้านล่าง) เช่น ค้น Liquids แล้วกดอ่านเพื่อดูสูตรน้ำต้ม</p>
 <div class="structure-layout"><div id="structure-results"></div><section class="list-explanation structure-preview"><h2 id="structure-title">เลือกแหล่งข้อมูลเพื่อดูเนื้อหา</h2><p id="structure-source" class="muted"></p><p id="structure-status" role="status" aria-live="polite"></p><a id="structure-download" hidden target="_blank" rel="noopener">เปิดไฟล์ต้นฉบับแยกแท็บ</a><pre id="structure-text" tabindex="0">เนื้อหาจะโหลดเมื่อเลือก อ่านอย่างเดียว</pre></section></div>`;
}
function filteredStructures(query){return window.GH_DATASTRUCTURE.entries.filter(r=>r.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));}
function renderStructureRows(){
 const target=document.getElementById('structure-results');if(!target)return;
 const rows=filteredStructures(document.getElementById('structure-search').value||'');
 document.getElementById('structure-count').textContent=`แสดง ${rows.length} / ${window.GH_DATASTRUCTURE.entries.length} ชุด`;
 target.innerHTML=`<div class="table-wrap wb-table"><table><thead><tr><th>TextAsset</th><th>อ่านข้อมูล</th></tr></thead><tbody>${rows.map(r=>`<tr data-structure-id="${r.path_id}" ${structureSelected===String(r.path_id)?'class="structure-selected"':''}><td><button data-structure-id="${r.path_id}" class="text-button">${wbEscape(r.name)}</button><div class="muted">${(r.bytes/1024).toFixed(1)} KB</div></td><td><button data-structure-id="${r.path_id}">อ่าน</button></td></tr>`).join('')||'<tr><td colspan="2">ไม่พบแหล่งข้อมูล</td></tr>'}</tbody></table></div>`;
}
async function openStructure(id){
 const row=window.GH_DATASTRUCTURE.entries.find(r=>String(r.path_id)===String(id));if(!row)return;
 const request=++structureRequest;
 const title=document.getElementById('structure-title'),source=document.getElementById('structure-source'),text=document.getElementById('structure-text');
 if(!title||!source||!text)return;
 structureSelected=String(row.path_id);renderStructureRows();
 const status=document.getElementById('structure-status'),download=document.getElementById('structure-download');
 status.textContent='กำลังโหลด '+row.name;download.href=row.url;download.hidden=false;
 title.textContent=row.name;source.textContent=`GameDatabase/${row.source} | path ID ${row.path_id}`;text.textContent='กำลังอ่านข้อมูล…';
 title.scrollIntoView?.({behavior:'smooth',block:'nearest'});
 try{const response=await fetch(row.url);if(!response.ok)throw new Error('HTTP '+response.status);const raw=await response.text();if(request===structureRequest&&document.getElementById('structure-text')===text){text.textContent=raw||'ไฟล์นี้ไม่มีเนื้อหาข้อความ';status.textContent=`โหลดแล้ว ${row.name} (${raw.length.toLocaleString()} ตัวอักษร)`;}}
 catch(error){if(request===structureRequest&&document.getElementById('structure-text')===text){status.textContent='โหลดไม่สำเร็จ';text.textContent='อ่านข้อมูลไม่สำเร็จ: '+error.message+' — ลองรีเฟรชหน้า หรือเปิดไฟล์ต้นฉบับจากลิงก์ด้านบน';}}
}
document.addEventListener('input',e=>{if(e.target.id==='structure-search')renderStructureRows();});
document.addEventListener('click',e=>{const button=e.target.closest('[data-structure-id]');if(button)openStructure(button.dataset.structureId);});
