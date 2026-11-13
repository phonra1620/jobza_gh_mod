function gameSpawnEstimate(row){
 const reasons=[];
 if(row.kind==='sentinel')reasons.push('ค่าควบคุม enum');
 if(row.is_construction===true)reasons.push('กลุ่มก่อสร้าง / โครงสร้าง');
 if(row.is_construction==null&&row.info_type==='Stand')reasons.push('Stand มีลักษณะเป็นสิ่งปลูกสร้างตามเกณฑ์ของเรา');
 if(['ReadableItem','Parasite'].includes(row.info_type))reasons.push('หมวดที่ไม่ต้องการ Spawn: '+row.info_type);
 if(![row.name_en,row.name_th].some(name=>typeof name==='string'&&name.trim()&&name.trim()!==row.id))reasons.push('ไม่มีชื่อแสดงผลที่ต่างจากรหัส');
 if(!row.prefab_path)reasons.push('ไม่พบ mapping');
 return {candidate:reasons.length===0,reasons};
}
function gameSpawnCell(row){
 const estimate=gameSpawnEstimate(row);
 return `<td><span class="pill ${estimate.candidate?'pass':'pending'}">${estimate.candidate?'คาดว่าได้':'ยังไม่แนะนำ'}</span><div class="muted">${estimate.candidate?'ผ่านเกณฑ์เบื้องต้น ยังไม่ทดสอบจริง':estimate.reasons.map(wbEscape).join(' / ')}</div></td>`;
}
function gameLibraryPage(ai=false){
 const rows=ai?window.GH_GAME_LIBRARY.animals:window.GH_GAME_LIBRARY.items;
 const types=ai?['AIID','sentinel']:[...new Set(rows.map(r=>r.info_type))].sort();
 return `<div class="page-heading"><div><div class="eyebrow">GAME DATABASE</div><h1>${ai?'Animals and AI List':'Items List'}</h1><p>${ai?'รหัสจาก AIs.AI/AIID ในโค้ดเกม รวมสัตว์ AI และค่าควบคุม enum':'รายการไอเทมจากฐานข้อมูลเกม พร้อมชื่อและคุณสมบัติที่ประกาศไว้'}</p></div></div>
 <section class="list-explanation" aria-label="ที่มาและวิธีคัดรายการ">
 <h2>ที่มาและวิธีคัดรายการ</h2>
 ${ai?`<p><b>แหล่งข้อมูล:</b> รหัสและค่า enum จาก AIs.AI/AIID ใน Assembly-CSharp.dll ที่ติดตั้ง ชื่อและ prefab mapping เชื่อมกับข้อมูลจาก resources.assets ที่แปลงไว้ใน GameDatabase/GreenHell.db</p>
 <p><b>รายการนี้คืออะไร:</b> รวมสัตว์และ AI ประเภทอื่น ไม่ใช่รายการสัตว์ล้วน และมีค่าควบคุม None / Count ซึ่งติดป้าย sentinel แยกไว้ ยังไม่มีฟิลด์ is_animal ที่ยืนยันว่าแต่ละรหัสเป็นสัตว์</p>
 <p><b>วิธีเชื่อมชื่อ:</b> ค้น key ที่ตรงรหัสก่อน หากไม่พบจึงค้นแบบไม่แยกตัวพิมพ์เล็ก–ใหญ่เฉพาะกรณีพบ key เดียว เช่น Arowana → arowana ชื่อที่ไม่พบแสดง — ไม่เดาคำแปล</p>
 <p><b>Spawn คาดการณ์:</b> ต้องมีชื่อไทยหรืออังกฤษที่ไม่ว่างและต่างจากรหัส มี prefab mapping และไม่ใช่ sentinel เกณฑ์ is_construction และหมวดไอเทมไม่ใช้กับ AI</p>`:
 `<p><b>แหล่งข้อมูล:</b> Items ใน resources.assets แปลงเป็น GameDatabase/GreenHell.db ชื่อมาจาก Texts_EN / Texts_TH และ TextsTemp ตำแหน่งต้นแบบมาจาก PrefabsMap ส่วน is_construction อ้างอิง IsConstruction() ของคลาสข้อมูลใน Assembly-CSharp.dll</p>
 <p><b>รายการนี้คืออะไร:</b> รวมไอเทมทุกประเภท ไม่ได้มีเฉพาะของในกระเป๋า มีทั้งอุปกรณ์ อาหาร ซากสัตว์ เนื้อ ชิ้นส่วนสัตว์ และประเภทโครงสร้าง สัตว์ที่เป็น AI แยกใน Animals and AI List เช่น Arowana เป็น AI แต่ Arowana_Body เป็นไอเทม</p>
 <p><b>Spawn คาดการณ์:</b> ต้องมีชื่อไทยหรืออังกฤษที่ไม่ว่างและต่างจากรหัส และมี prefab mapping จากนั้นตรวจสองกลุ่มที่ตัดออกดังนี้</p>
 <p><b>กลุ่มสิ่งปลูกสร้าง:</b> ตัด is_construction = true ตามโค้ดเกม และตัด is_construction = null ที่เป็นประเภท Stand เพราะแท่นหรือที่เก็บของกลุ่มนี้มีลักษณะเหมือนสิ่งปลูกสร้างตามเกณฑ์ของเรา ค่า null ในประเภทอื่น เช่น Seed, HeavyObject, Bowl และ Herb ไม่ถูกตัดด้วยเกณฑ์สิ่งปลูกสร้าง</p>
 <p><b>หมวดที่ไม่ต้องการ Spawn:</b> ตัด ReadableItem และ Parasite โดยไม่ขึ้นกับค่า is_construction เป็นความต้องการคัดรายการ ไม่ได้หมายความว่าสองประเภทนี้เป็นสิ่งปลูกสร้างหรือเกม Spawn ไม่ได้</p>
 <p><b>คุณสมบัติและไอคอน:</b> แสดงค่าที่ประกาศใน Items ไม่ได้คำนวณค่าที่สืบทอดทุกชนิด ไอคอนใช้ภาพจากเกมที่แยกไว้เท่าที่มี หากไม่มีภาพจะแสดง icon key แทน</p>`}
 <p><b>การกรอง:</b> ค้นชื่อ รหัส หรือ prefab path แล้วกรองประเภท mapping และสถานะ Spawn ร่วมกัน รายการที่ไม่ผ่านยังอยู่ในคลังพร้อมเหตุผล เลือก Spawn → คาดว่าได้ เพื่อดูเฉพาะรายการผ่านเกณฑ์</p>
 <p><b>ข้อจำกัด:</b> พบ mapping หมายถึงพบเส้นทางต้นแบบ ไม่ยืนยันว่าโหลดหรือ Spawn สำเร็จ สถานะนี้เป็นข้อสันนิษฐาน ไม่ใช่ผลทดสอบในเกมหรือ Multiplayer หน้าเว็บอ่านข้อมูลที่ส่งออกไว้ ต้องสร้างข้อมูลเว็บใหม่เมื่อฐานข้อมูลเปลี่ยน</p>
 </section>
 <div class="wb-tools"><label>ค้นหา<input id="game-library-search" type="search" placeholder="ชื่อไทย / English / ID"></label><label>ประเภท<select id="game-library-type"><option value="">ทุกประเภท</option>${types.map(t=>`<option>${wbEscape(t)}</option>`).join('')}</select></label><label>Prefab<select id="game-library-map"><option value="">ทั้งหมด</option><option value="yes">พบ mapping</option><option value="no">ไม่พบ mapping</option></select></label><label>Spawn (คาดการณ์)<select id="game-library-spawn"><option value="">ทั้งหมด</option><option value="yes">คาดว่าได้</option><option value="no">ยังไม่แนะนำ</option></select></label><span id="game-library-count" role="status" aria-live="polite"></span></div>
 ${ai?'<p class="notice">ชื่อที่ไม่มีคำแปลจะแสดง — โดยไม่เดาชื่อเพิ่มเติม การพบ mapping ไม่ยืนยันว่า Spawn ได้ และ sentinel ไม่ใช่สัตว์</p>':''}
 <div id="game-library-results"></div>`;
}
function renderGameLibraryRows(){
 const target=document.getElementById('game-library-results');if(!target)return;
 const ai=active==='gamedb-ai';
 const all=ai?window.GH_GAME_LIBRARY.animals:window.GH_GAME_LIBRARY.items;
 const query=(document.getElementById('game-library-search').value||'').trim().toLocaleLowerCase();
 const type=document.getElementById('game-library-type').value;
 const map=document.getElementById('game-library-map').value;
 const spawn=document.getElementById('game-library-spawn').value;
 const rows=all.filter(r=>(!spawn||gameSpawnEstimate(r).candidate===(spawn==='yes'))&&(!type||(ai?r.kind:r.info_type)===type)&&(!map||Boolean(r.prefab_path)===(map==='yes'))&&(!query||[r.id,r.name_en,r.name_th,r.prefab_path].some(v=>String(v??'').toLocaleLowerCase().includes(query))));
 document.getElementById('game-library-count').textContent=`แสดง ${rows.length} / ${all.length} รายการ`;
 const headers=ai?['รหัส AI','ค่า enum','ชื่ออังกฤษจากเกม','ชื่อไทยจากเกม','ประเภท','Spawn (คาดการณ์)','Prefab']:['รหัสไอเทม','ชื่ออังกฤษจากเกม','ชื่อไทยจากเกม','ไอคอน','Info type','Spawn (คาดการณ์)','Prefab / คุณสมบัติ'];
 target.innerHTML=`<div class="table-wrap wb-table"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>ai?`<tr><td>${wbEscape(r.id)}</td><td>${r.value}</td><td>${wbEscape(r.name_en||'—')}</td><td>${wbEscape(r.name_th||'—')}</td><td>${wbEscape(r.kind)}</td>${gameSpawnCell(r)}<td>${wbEscape(r.prefab_path||'ไม่พบ mapping')}</td></tr>`:`<tr><td>${wbEscape(r.id)}</td><td>${wbEscape(r.name_en||'—')}</td><td>${wbEscape(r.name_th||'—')}</td><td>${r.image?`<img loading="lazy" width="64" height="64" src="${wbEscape(r.image)}" alt="${wbEscape(r.name_th||r.id)}">`:`<span class="muted">${wbEscape(r.icon_key)}<br>ยังไม่มีภาพตัวอย่าง</span>`}</td><td>${wbEscape(r.info_type)}</td>${gameSpawnCell(r)}<td>${wbEscape(r.prefab_path||'ไม่พบ mapping')}<details><summary>คุณสมบัติ (${r.properties.length})</summary>${r.properties.map(p=>`<div><b>${wbEscape(p.name)}</b>: ${wbEscape(p.arguments)}</div>`).join('')}</details></td></tr>`).join('')||`<tr><td colspan="7">ไม่พบรายการที่ตรงกับคำค้น</td></tr>`}</tbody></table></div>`;
}
document.addEventListener('input',e=>{if(e.target.id==='game-library-search')renderGameLibraryRows();});
document.addEventListener('change',e=>{if(['game-library-type','game-library-map','game-library-spawn'].includes(e.target.id))renderGameLibraryRows();});
