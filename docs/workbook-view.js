let workbookSheet=0;
const wbEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const workbookRecipeColumns=[0,1,2,3,6,8];
function workbookPage(){
 const data=window.GH_CRAFTING_WORKBOOK;
 return `<div class="page-heading"><div><div class="eyebrow">CRAFTING DATABASE</div><h1>GreenHell-Crafting List</h1><p>รายการประดิษฐ์และวัสดุ ค้นหาด้วยชื่อไทย ชื่ออังกฤษ หรือรหัสไอเทม</p></div></div>
 <section class="list-explanation" aria-label="ที่มาและวิธีคัดรายการคราฟ">
 <h2>ที่มาและวิธีคัดรายการ</h2>
 <p><b>แหล่งข้อมูล:</b> GameDatabase/GreenHell.db ซึ่งแปลงจาก resources.assets ของเกมที่ติดตั้ง ข้อมูลไอเทมและสูตรมาจาก Items ชื่อมาจาก Texts_EN / Texts_TH และ TextsTemp ไอคอนเป็นภาพที่แยกจากเกมไว้</p>
 <p><b>วิธีคัดสูตร:</b> เลือกไอเทมที่มี Components และไม่ใช่ IsConstruction ตามการตรวจโค้ด Assembly-CSharp.dll จึงได้สูตรหน้าประดิษฐ์ 80 รายการ ไม่ใช้ค่า Craftable เพียงอย่างเดียวตัดสิน ส่วนแท็บวัสดุรวมวัตถุดิบที่ใช้ในสูตรเหล่านี้โดยไม่ซ้ำกัน</p>
 <p><b>วิธีแสดงผล:</b> ใช้รหัสไอเทมเชื่อมชื่อ ไอคอน และจำนวนวัสดุ ช่องค้นหาค้นข้อความในข้อมูลรายการ และ dropdown ประเภทกรอง Info type ชื่อที่ไม่มีคำแปลไม่แต่งเพิ่ม</p>
 <p><b>ข้อจำกัด:</b> เป็นข้อมูลสถิต ไม่ได้อ่านเซฟที่กำลังเล่น สูตรอาจถูกล็อกด้วย m_CraftingLockedItems หรือมีเงื่อนไขเพิ่มเติม งานเฉพาะสถานีที่ไม่มี Components ไม่รวมในรายการนี้ และยังไม่ได้ทดสอบคราฟครบทุกสูตร</p>
 </section>
 <div class="mini-tabs">${data.sheets.map((s,i)=>`<button data-workbook-sheet="${i}" class="${i===workbookSheet?'primary':''}">${wbEscape(s.name)} (${s.rows.length})</button>`).join('')}</div>
 <div class="wb-tools"><label>ค้นหา<input id="wb-search" type="search" placeholder="เช่น ขวาน / Axe / Rope" autocomplete="off"></label><label>ประเภท<select id="wb-type"><option value="">ทุกประเภท</option>${[...new Set(data.sheets[0].rows.map(r=>r.values[8]))].map(t=>`<option>${wbEscape(t)}</option>`).join('')}</select></label><span id="wb-count" role="status" aria-live="polite"></span></div>
 <div id="wb-results"></div><p class="muted">อัปเดตข้อมูล: ${wbEscape(new Date(data.exportedAt).toLocaleString('th-TH'))}<br>บางสูตรขึ้นอยู่กับการปลดล็อกในเซฟ</p>`;
}
function renderWorkbookRows(){
 const target=document.getElementById('wb-results');if(!target)return;
 const sheet=window.GH_CRAFTING_WORKBOOK.sheets[workbookSheet];
 const query=(document.getElementById('wb-search').value||'').trim().toLocaleLowerCase();
 const type=document.getElementById('wb-type');type.disabled=workbookSheet!==0;
 const rows=sheet.rows.filter(r=>(workbookSheet!==0||!type.value||r.values[8]===type.value)&&(!query||r.values.some(v=>String(v??'').toLocaleLowerCase().includes(query))));
 const columns=workbookSheet===0?workbookRecipeColumns:sheet.headers.map((_,i)=>i);
 document.getElementById('wb-count').textContent=`แสดง ${rows.length} / ${sheet.rows.length} รายการ`;
 target.innerHTML=rows.length?`<div class="table-wrap wb-table"><table><thead><tr>${columns.map(i=>`<th>${wbEscape(sheet.headers[i])}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${columns.map(i=>`<td>${i===3&&sheet.headers[i]==='ไอคอน'?(r.image?`<img loading="lazy" width="64" height="64" src="${wbEscape(r.image)}" alt="${wbEscape(r.values[2])}">`:'ไม่มีภาพ'):wbEscape(r.values[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<div class="panel" style="padding:24px">ไม่พบรายการที่ตรงกับคำค้น</div>';
}
document.addEventListener('input',e=>{if(e.target.id==='wb-search')renderWorkbookRows();});
document.addEventListener('change',e=>{if(e.target.id==='wb-type')renderWorkbookRows();});
document.addEventListener('click',e=>{const button=e.target.closest('[data-workbook-sheet]');if(!button)return;workbookSheet=Number(button.dataset.workbookSheet);document.getElementById('main').innerHTML=workbookPage();renderWorkbookRows();});
