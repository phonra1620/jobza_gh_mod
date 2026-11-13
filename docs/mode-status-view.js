'use strict';
const modeStatusLabels={single:'Single Player',host:'Host',client:'Client'};
const modeStatusKinds={
 pass:{label:'ทดสอบผ่าน',symbol:'✓',description:'มีผลทดสอบในเกมจากผู้ใช้'},
 ready:{label:'รอทดสอบ',symbol:'◷',description:'มีโค้ดแล้ว แต่ยังไม่ยืนยันผลในโหมดนี้'},
 locked:{label:'ล็อกไว้',symbol:'⊘',description:'โค้ดปัจจุบันไม่อนุญาตในโหมดนี้'},
 fail:{label:'ไม่ผ่าน',symbol:'!',description:'พบปัญหาในการทดสอบจริง'},
 none:{label:'ไม่มี / ไม่เกี่ยวข้อง',symbol:'—',description:'ยังไม่มีฟีเจอร์นี้ในม็อด หรือใช้ไม่ได้กับโหมดนี้'},
 native:{label:'เกมรองรับ / ม็อดยังไม่มี',symbol:'◇',description:'พบระบบเดิมของเกม แต่ยังไม่เพิ่มปุ่มในม็อด'}
};
// Status is evidence for this project, not a promise for every prefab or game build.
const modeStatusRows=[
 ['pet','LazyFrog / กบอ๊บอ๊บ','Companions → LazyFrog',['locked','pass','locked'],'ผลเดิมฝั่ง Host ผ่านใน 0.4.49 · เปลี่ยนชื่อใน .59 ไม่ได้เปลี่ยนโมเดลหรือพฤติกรรม · ยังรอทดสอบขนาด ผิว และ late join · เซฟแล้วต้องเปิดใหม่'],
 ['bag-spawn','Spawn Items เข้ากระเป๋าตัวเรา','Spawn → Items',['ready','ready','ready'],'ติดตั้ง 0.4.53 · กด Backpack เพื่อรับทันที จำนวน 0–10 น้ำหนักเกินได้ถ้ามีช่อง ลองเรียงก่อนแจ้งเต็ม ไม่มี fallback ลงพื้น · Client ใช้เส้นทางนี้ได้และทิ้งผ่านเกมได้ แต่ยังรอผลทดสอบการเห็น/หยิบของฝั่ง Host'],
 ['quick-launch','Quick Launch ทำงานเสมอ','เริ่มเกม',['ready','ready','ready'],'รวมในรุ่นติดตั้ง 0.4.53 · ทำงานแม้ Mod: OFF ไม่ต้องเปิดสวิตช์ และไม่ขึ้นกับ Single / Host / Client; ยังไม่มีผลยืนยันแยกรายโหมด'],
 ['master','เมนูหลัก / Mod ON–OFF','เมนูหลัก',['ready','pass','ready'],'เริ่มต้น OFF; Shift + R เปิดเมนูได้ ปิดม็อดแล้วซ่อนปุ่มบนหน้าเกมอื่น Quick Launch ยังทำงานเสมอ · ผล Host ผ่าน'],
 ['immortal','Immortal Mode ของเรา','Player',['ready','pass','ready'],'ติดตั้ง 0.4.53 เปิดสิทธิ์ตัวเราใน Client แล้ว รอทดสอบ · ผล Host ผ่าน: เพื่อนยังรับความเสียหายตามปกติ'],
 ['restore','Restore Status ของเรา','Player → Healthy',['ready','ready','locked'],'ฟื้น HP, Energy, Stamina, น้ำและสารอาหารทั้งชุดหรือรายค่า · แสดงค่าปัจจุบันทุก 5 วินาที; ยังไม่มีผลยืนยันแยกครบทุกโหมด'],
 ['doctors','Doctors ของเรา','Player → Healthy',['ready','ready','locked'],'รักษาโรค แผล ปรสิต และค่าผิดปกติของตัวเรา · รีเฟรชข้อมูลทุก 5 วินาที'],
 ['skills','ปรับ Skills ของเรา','Player',['ready','ready','ready'],'ติดตั้ง 0.4.53 เปิดสิทธิ์ Client แล้ว มี log คำสั่งปรับ Archery แต่ยังไม่ถือเป็นผลทดสอบครบถ้วน · แก้ได้เฉพาะตัวเรา'],
 ['targets','เลือกผู้เล่นใน Player','Player',['none','ready','ready'],'ติดตั้ง 0.4.53 · Host / Client เลือก Self / เพื่อนได้ แต่เลือกเพื่อนแล้วดูได้อย่างเดียว'],
 ['peer-read','ดูสถานะเพื่อนแบบอ่านอย่างเดียว','Player',['none','ready','ready'],'ติดตั้ง 0.4.53 · แสดงเฉพาะค่าที่ได้รับ เช่น HP น้ำหนัก สิ่งสกปรก; อาการแสดงเฉพาะเมื่อใช่ ไม่แสดง Energy/น้ำ/สารอาหารที่ไม่มีข้อมูล ซ่อนแท็บ Immortal / Skills / Healthy เมื่อเลือกเพื่อน และมี Teleport to player · รีเฟรชทุก 5 วินาที; รอทดสอบในเกม'],
 ['remote-status','แก้ HP / สารอาหาร / Skills ของเพื่อน','Player',['none','none','none'],'ยังไม่มีในม็อดภายใต้การติดตั้งคนเดียว · เลือกเพื่อนแล้วแสดงข้อจำกัด ไม่แสดงหรือแก้ค่าตัวเราแทน'],
 ['carry','Carry limit 50 / 300','กระเป๋าเป้',['ready','pass','locked'],'ติดตั้ง 0.4.40 · ผล Host ผ่าน: เปลี่ยนน้ำหนักจำกัดเฉพาะตัวเรา'],
 ['armor','ดู % เกราะ / ซ่อมเกราะที่สวม','ตรวจสอบ',['pass','ready','locked'],'ผู้ใช้ยืนยันแผงเกราะใน Single Player แล้ว · แสดงเปอร์เซ็นต์จำนวนเต็ม; ยังไม่ทดสอบ Host แยก'],
 ['repair','ซ่อมอาวุธ / เครื่องมือ','Equipment',['ready','ready','locked'],'มีโค้ดแล้ว · ยังไม่มีผลทดสอบแยกในชุด Host ล่าสุด'],
 ['items','Spawn Items ลงพื้น','Spawn → Items',['ready','pass','locked'],'ผล Host ผ่าน: เพื่อนเห็นและหยิบใช้ได้ · 0–10 ต่อคำสั่ง · Client ยังล็อกตาม policy ของม็อด ไม่ใช่ข้อห้ามถาวรที่พิสูจน์แล้วของเกม; ใช้ Backpack แล้วทิ้งผ่านเกมเป็นทางเลือก'],
 ['kit','Survival Kit ลงพื้น / น้ำสะอาด 100/100','Spawn → Survival Kit',['pass','pass','locked'],'ผล Single/Host เส้นทางพื้นผ่าน · Client ยังล็อกเส้นทางพื้น ให้เลือก Backpack ในรุ่นเตรียม 0.4.54 แทน'],
 ['kit-bag','Survival Kit เข้ากระเป๋าตัวเรา','Spawn → Survival Kit',['ready','ready','ready'],'ติดตั้ง 0.4.54 · Backpack รายแถว/ทั้งชุด จำนวน 0–10 น้ำสะอาด 100/100 น้ำหนักเกินได้ถ้ามีช่อง · ช่องเต็มหยุดแล้ว Resume เฉพาะส่วนที่เหลือ; รอทดสอบทุกโหมด'],
 ['ai','Spawn Animals / AI','Spawn',['ready','pass','locked'],'ผล Host ผ่าน: ทั้งสองเครื่องเห็นและโต้ตอบได้ · ผลนี้ไม่รับรองทุกชนิดในฐานข้อมูล'],
 ['blueprints','แสดง / วางแปลนทั้งหมด','สมุดบันทึก → Building',['ready','pass','ready'],'0.4.54 เปิดสูตรในสมุดของ Client ได้ รอทดสอบ · ผล Host เดิมผ่าน: เลือกและวางแปลนได้ เพื่อนเห็นแปลน'],
 ['build','สร้างแปลนทั่วไปทันทีด้วย G','Building',['ready','pass','ready'],'0.4.54 Client ต้องวางแปลนใหม่เองขณะ Mod ON และยังถือ ownership จากนั้นกด G · ไม่รับแปลนเก่าหรือที่รับจากเพื่อน · รอทดสอบ Host เห็นตรงกัน; ผล Host เดิมผ่าน'],
 ['table','คราฟโต๊ะทันทีด้วย G','Building',['ready','locked','locked'],'เปิดเฉพาะ Single Player · รวมแก้วัสดุค้างในรุ่นติดตั้ง แต่ยังรอผลทดสอบหลังแก้'],
 ['time','เลื่อนเวลา −1 / +1 / +6 ชั่วโมง','World',['ready','pass','locked'],'ผู้ใช้ยืนยันว่าเวลาตรงกับเพื่อนแล้ว · แยกจากปัญหา Force rain / dry'],
 ['freeze','เปิด–ปิดการเดินเวลา','World',['ready','ready','locked'],'มีโค้ด แต่ยังไม่มีผลยืนยันว่าการหยุดเวลาตรงกันทั้งสองเครื่อง'],
 ['weather','Force rain / Force dry','World',['ready','fail','locked'],'Host เปลี่ยนอากาศได้เฉพาะเครื่องตนเอง แต่เพื่อนยังเห็น Natural · ยังไม่แก้การซิงก์'],
 ['speed','ปรับความเร็วเกม 0.1× / 1× / 10×','World',['ready','locked','locked'],'จำกัด Single Player · ยังไม่เปิดให้ Host / Client'],
 ['forest','ต้นไม้กลับมาเติบโต','World → Forest',['ready','locked','locked'],'จำกัด Single Player · ปิดม็อดแล้วกลับสู่เส้นทางอัปเดตของเกม'],
 ['waypoints','Teleport จุดบันทึก / สถานที่','แผนที่ → Teleport',['pass','ready','locked'],'Save here / Teleport ผ่านเบื้องต้นใน Single Player · ยังไม่รับรองทุกสถานที่และการโหลดพื้นที่'],
 ['go-peer','ไปหาเพื่อน (Go to player)','แผนที่ → Teleport / Player',['none','ready','ready'],'ติดตั้ง 0.4.53 · เลือกชื่อแล้ว Teleport to player ย้ายเฉพาะตัวเรา เพื่อนไม่ต้องลงม็อด · ยังรอผลทดสอบ Host/Client ครบถ้วน'],
 ['bring','ดึงเพื่อนมาหาเรา','Teleport',['none','none','none'],'นำออกแล้วตามแนวทางติดตั้งคนเดียว · ไม่มี Bring to me หรือคำสั่งม็อดส่งไปเครื่องเพื่อน'],
 ['leeches','ดึงปลิงให้เพื่อน','ช่วยเพื่อน',['none','native','native'],'พบ LeechReplicator.OnLeechRemovedByCoop ในเกม · ยังไม่มีปุ่มช่วยเพื่อนใน Doctors ของม็อด'],
 ['help','ช่วยเพื่อนที่หมดสติ','ช่วยเพื่อน',['none','native','native'],'พบ PlayerTriggerAction / HelpCoop ในเกม · ยังไม่มีปุ่มในม็อด และไม่ใช่การเติม HP เต็ม'],
 ['bandage','พันแผล / ใส่ยาพอกให้เพื่อน','ช่วยเพื่อน',['none','none','none'],'ยังไม่พบคำสั่ง native ที่ยืนยันได้จากส่วนที่ตรวจ · ยังไม่มีในม็อด ไม่สรุปว่าเป็นไปไม่ได้ทุกกรณี'],
 ['save','เซฟแล้วโหลดของ / สิ่งก่อสร้าง','โลก',['ready','pass','ready'],'ผล Host ผ่านสำหรับของและสิ่งก่อสร้างที่ทดสอบ · ไม่ได้ยืนยันว่าทุกค่าและสวิตช์ม็อดจะถูกบันทึก']
].map(([id,name,group,statuses,note])=>({id,name,group,statuses,note}));
// Local permissions shipped in .53; .54 additions are prepared, not runtime PASS.
modeStatusRows.push({id:'in-wall',name:'In wall',group:'Travel / Tools',statuses:['ready','ready','ready'],note:'0.4.61 · ใช้ขณะบินเท่านั้น · ออกไปพื้นซึ่งตรวจพื้นที่ว่างแล้ว หากไม่พบจะพักการออกและลองใหม่ · ยังรอทดสอบจริง'});
modeStatusRows.push({id:'invisible',name:'Invisible',group:'Travel / Tools',statuses:['ready','ready','ready'],note:'0.4.61 · ซ่อนร่างและชื่อพร้อมให้ AI มองข้ามเรา · ใช้ native replication · ยังรอทดสอบจริงกับเพื่อนที่ไม่ลงม็อด'});
modeStatusRows.push({id:'ignore-me',name:'Ignore me',group:'Travel / Tools',statuses:['ready','ready','ready'],note:'0.4.61 · AI ไม่เลือกเราเป็นเป้าหมาย เพื่อนเห็นปกติเมื่อปิด Invisible · ไม่ใช่อมตะ · ยังรอทดสอบจริง'});
for(const row of modeStatusRows){
 if(['immortal','restore','doctors','skills','carry','armor','repair','waypoints','bag-spawn'].includes(row.id)){
  row.statuses[2]='ready';
  if(!['immortal','skills','bag-spawn'].includes(row.id))row.note='ติดตั้ง 0.4.53 เปิดสิทธิ์ Client เฉพาะตัวเราแล้ว รอทดสอบจริง · '+row.note;
 }
 if(row.id==='armor')row.note+=' · 0.4.54 เปิดแผงเมื่อเข้าตรวจสอบทุกครั้ง แม้ยังอ่านเกราะไม่พบ รอทดสอบ Client';
}
// Acceptance is recorded without inventing a mode when the user's report did not name one.
for(const row of modeStatusRows){
 if(['pet','skills','restore','doctors','kit','kit-bag','go-peer','blueprints','build'].includes(row.id))
  row.acceptance='ผู้ใช้ยืนยันผ่าน · 11 พ.ย. 2026';
 if(['skills','restore','doctors','go-peer'].includes(row.id))
  row.note='ผู้ใช้ยืนยันฟีเจอร์ผ่านแล้ว แต่ไม่ได้แยกผล SP/Host/Client ในรายงานล่าสุด จึงคงสถานะรายโหมดที่ยังไม่ระบุไว้ · ใช้กับตัวเราเท่านั้น';
 if(row.id==='pet')row.note='ผู้ใช้ยืนยันผู้ติดตามเดิมผ่านบน Host · ชื่อใหม่ LazyFrog / กบอ๊บอ๊บ · ยังไม่ได้แยกผล scale / ผิว / late join · เซฟแล้วนำออก';
 if(row.id==='kit')row.note='เส้นทางพื้น SP/Host ผ่านเดิม และผู้ใช้ยืนยัน Survival Kit ผ่านล่าสุด · Client พื้นยังล็อก ให้ใช้ Backpack';
 if(row.id==='kit-bag'){row.statuses[2]='pass';row.note='ผู้ใช้ยืนยัน Client Kit Backpack ผ่านใน 0.4.54 · รายแถว/ทั้งชุด น้ำสะอาด 100/100 ช่องเต็มแล้ว Resume เฉพาะส่วนที่เหลือ';}
 if(row.id==='blueprints'){row.statuses[2]='pass';row.note='ผู้ใช้ยืนยัน Client แสดง/วางแปลนทั้งหมดผ่านใน 0.4.54 · ผล Host เดิมผ่าน';}
 if(row.id==='build'){row.statuses[2]='pass';row.note='ผู้ใช้ยืนยัน Client G แปลนที่วางเองผ่านใน 0.4.54 · ต้องวางใหม่ขณะ Mod ON และยังถือ ownership; ไม่รับแปลนเก่าหรือของเพื่อน';}
}
for(const [id,name,group,statuses,note] of [
 ['minimap','Minimap × Permanent Compass · ถอดออก','ประวัติฟีเจอร์',['none','none','none'],'ผู้ใช้รายงานไม่ผ่านและสั่งเอาออก · ถอดโค้ด เมนู overlay และกล้อง/texture ของ Minimap ออกจากรุ่นเตรียม 0.4.56 แล้ว · ไม่เปิดให้ใช้ในตัวอย่างเว็บ'],
 ['freecam','Freecam / Bird eye view','World → Navigation',['ready','ready','ready'],'ติดตั้งต้นแบบ 0.4.55 · เคลื่อนเฉพาะกล้อง ตัวเราอยู่เดิม; WASD, Q/E, Shift, Mouse · F8/Esc กลับ · ยังรอ gameplay และการคืน input'],
 ['housekeeper','NPC Friend · House Keeper','World → NPC Friend',['ready','ready','locked'],'ติดตั้งต้นแบบ 0.4.55 · สั่ง F7 เล็งต้นไม้/แท่น/แปลน ใช้วัสดุจริง พื้นที่ฐาน 15 ม. Base care เติมแปลนแล้วเติมแท่น; ยังไม่มีเติมไฟ/รดน้ำ/ซ่อมบ้าน'],
 ['lifeguard','NPC Friend · Life Guard','World → NPC Friend',['ready','ready','locked'],'ติดตั้งต้นแบบ 0.4.55 · ตามเราและสู้ AI ที่กำลังคุกคามเรา/NPC ใน 15 ม. ไม่เลือกผู้เล่นเป็นศัตรู · NPC ตายได้ ไม่มีรักษา/ชุบชีวิต; รอทดสอบการเดิน/โจมตี/ซิงก์'],
 ['mp-cap','MP Cap Remover · สูงสุด 8 คน','เมนูก่อนเข้าโลก',['none','ready','none'],'ติดตั้งต้นแบบ 0.4.55 · เลือก 4–8 ก่อนสร้างห้องใหม่ มีผลกับ session ใหม่ แยกจาก Mod ON/OFF · ยังไม่ได้พิสูจน์คนที่ 5–8 เชื่อมต่อจริง']
])modeStatusRows.push({id,name,group,statuses,note});
for(const row of modeStatusRows){
 if(row.id==='pet'){row.name='LazyFrog / กบอ๊บอ๊บ · SP / Host';row.statuses[0]='fail';row.note='SP เคยเปิดไม่ได้ · แก้สิทธิ์ใน .57 แล้ว รอทดสอบจริง · .59 เปลี่ยนชื่อและจัดเมนู ไม่ใช่ผล gameplay ใหม่ · ผล Host เดิมคงเดิม';}
 if(row.id==='freecam'){row.statuses=['none','none','none'];row.note='ผู้ใช้สั่งถอด Freecam / Bird eye · เอาโค้ด hook กล้อง เมนู และปุ่มจำลองออกใน 0.4.57';}
 if(['housekeeper','lifeguard'].includes(row.id)){row.statuses=['fail','fail','locked'];row.note='ผู้ใช้รายงานเรียกตัวได้แต่ทำงาน/ต่อสู้ไม่ได้ · 0.4.57 แก้วงจร goal และการเดินมนุษย์แล้ว รอทดสอบใหม่ · Client ยังล็อก';}
}
modeStatusRows.push({id:'fly',name:'i_can_fly · ตัวละครบิน',group:'World → Navigation',statuses:['ready','ready','ready'],note:'เตรียม 0.4.57 · ความเร็ววิ่ง ×3, WASD, Space ขึ้น / Ctrl ซ้ายลง, ปล่อยปุ่มลอยค้าง · F8/Esc ออกแล้วตกตรงนั้น ป้องกันดาเมจและบาดเจ็บจากการตก · รอทดสอบ'});
modeStatusRows.push({id:'always-names',name:'Always Show Names',group:'World → Navigation',statuses:['none','ready','ready'],note:'เตรียม 0.4.57 · ชื่อเพื่อนไม่จางตามระยะ พร้อมรายชื่อและระยะทางด้านข้างแม้โมเดลอยู่ไกล/นอกจอ · รอทดสอบ Co-op'});
modeStatusRows.push({id:'map-player',name:'Show player on map',group:'World → Navigation / แผนที่เกม',statuses:['ready','ready','ready'],note:'เตรียม 0.4.58 จากไฟล์อ้างอิง Nexus 53 ในเครื่อง · จุดตัวเราบนหน้าแผนที่ที่ปลดล็อกแล้ว รองรับ calibration 8 หน้า · ซ่อนเมื่ออยู่นอกหน้านั้น ไม่ใช่ Minimap · รอทดสอบตำแหน่งจริง'});
modeStatusRows.push({id:'auto-arrows',name:'Auto Pickup Arrows',group:'World → Navigation',statuses:['ready','ready','ready'],note:'เตรียม 0.4.58 จากไฟล์อ้างอิง Nexus 58 ในเครื่อง · Arrow/Metal_arrow ระยะ 1–10 ม. ค่าเริ่มต้น 2 ม. · ตรวจของจริง/ช่องกระเป๋า/กำแพง/ownership ก่อน native Take ไม่สร้างลูกธนู · รอทดสอบจริง'});
for(const row of modeStatusRows){
 if(['pet','housekeeper','lifeguard'].includes(row.id))row.group='Companions';
 if(['fly','always-names','map-player','auto-arrows'].includes(row.id))row.group='Travel / Tools';
}
for(const row of modeStatusRows){
 if(['housekeeper','lifeguard'].includes(row.id)){row.statuses=['none','none','none'];row.note='NPC Friend temporarily removed in 0.4.60; source retained for later development.';}
 if(row.id==='master')row.note+=' Host menu checklist 1: user PASS on 0.4.59; language switch in 0.4.60 pending.';
}
// Current release evidence stays distinct from historical capability reports.
const release061Note='0.4.61 เพิ่ม In wall / Invisible / Ignore me · ยังรอ Apply และทดสอบจริงทุกโหมด · NPC Friend ยังถอดชั่วคราว';
modeStatusRows.push({id:'menu-home',name:'Home / Host checklist 1',group:'Main menu',statuses:['ready','pass','ready'],note:'User confirmed checklist 1 PASS on Host 0.4.59; no other checklist groups accepted.'});
modeStatusRows.push({id:'ui-language',name:'EN / TH',group:'Main menu',statuses:['ready','ready','ready'],note:'Installed package 0.4.61: mod-window labels/descriptions, saved local language preference; runtime pending.'});
const expansionPreview={flight:false,inWall:false,invisible:false,ignoreMe:false,names:false,mapPlayer:false,arrows:false,npc:'off',job:'รอคำสั่ง',capacity:4,mode:'host'};
function expansionPreviewPanel(){
 const demo=expansionPreview,canNpc=demo.mode!=='client';
 const control=(id,label,selected=false,disabled=false)=>`<button data-expansion="${id}" aria-pressed="${selected}" ${disabled?'disabled':''}>${label}</button>`;
 return `<section class="panel expansion-preview"><div class="panel-head"><h2>0.4.61 · ทดลองหน้าควบคุม</h2><span class="pill">จำลองเท่านั้น</span></div><p>Installed package 0.4.61; Apply pending. In wall / Invisible / Ignore me added; runtime pending. NPC Friend remains removed. Interactive preview only.</p><div class="expansion-controls">${['single','host','client'].map(mode=>control('mode:'+mode,modeStatusLabels[mode],demo.mode===mode)).join('')}</div><div class="expansion-grid"><div><h3>i_can_fly / Always Show Names</h3><div class="expansion-controls">${control('flight','i_can_fly',demo.flight)}${control('in-wall','In wall',demo.inWall,!demo.flight)}${control('invisible','Invisible',demo.invisible)}${control('ignore-me','Ignore me',demo.ignoreMe)}${control('names','Always Show Names',demo.names)}${control('map-player','Show player on map',demo.mapPlayer)}${control('auto-arrows','Auto Pickup Arrows',demo.arrows)}</div><p aria-live="polite">i_can_fly: ${demo.flight?'ON':'OFF'} | Names: ${demo.names?'ON':'OFF'}</p><p class="muted">WASD / Space: up / Left Ctrl: down / F8: exit. Speed: run x3.</p></div><div><h3>MP Cap Remover</h3><div class="expansion-controls">${control('cap:-','−',false,demo.capacity<=4||demo.mode!=='host')}<strong aria-live="polite">${demo.capacity} / 8 คน</strong>${control('cap:+','＋',false,demo.capacity>=8||demo.mode!=='host')}</div><p>เลือกก่อนสร้างห้องใหม่ · ไม่เปลี่ยนห้องที่กำลังเล่น</p><p class="muted">ในเกมตั้งจากเมนูหลัก ไม่ขึ้นกับ Mod ON/OFF · ยังไม่ยืนยันคนที่ 5–8</p></div></div></section>`;
}
function handleExpansionPreview(event){
 const button=event.target.closest('[data-expansion]');if(!button)return false;
 const [kind,value]=button.dataset.expansion.split(':'),demo=expansionPreview;
 if(kind==='mode'&&['single','host','client'].includes(value)){demo.mode=value;if(value==='client'){demo.npc='off';demo.job='รอคำสั่ง';}}
 else if(kind==='flight'){demo.flight=!demo.flight;if(!demo.flight)demo.inWall=false;}
 else if(kind==='in-wall'&&demo.flight)demo.inWall=!demo.inWall;
 else if(kind==='invisible')demo.invisible=!demo.invisible;
 else if(kind==='ignore-me')demo.ignoreMe=!demo.ignoreMe;
 else if(kind==='names')demo.names=!demo.names;
 else if(kind==='map-player')demo.mapPlayer=!demo.mapPlayer;
 else if(kind==='auto-arrows')demo.arrows=!demo.arrows;
 else if(kind==='cap'&&demo.mode==='host'&&['+','-'].includes(value))demo.capacity=Math.max(4,Math.min(8,demo.capacity+(value==='+'?1:-1)));
 render();return true;
}
let modeStatusMode='all',modeStatusFilter='all',modeStatusQuery='';
function filteredModeStatusRows(){
 const query=modeStatusQuery.trim().toLocaleLowerCase();
 const index=['single','host','client'].indexOf(modeStatusMode);
 return modeStatusRows.filter(row=>(!query||`${row.name} ${row.group} ${row.note}`.toLocaleLowerCase().includes(query))
  &&(modeStatusFilter==='all'||(index<0?row.statuses.includes(modeStatusFilter):row.statuses[index]===modeStatusFilter)));
}
function modeStatusCell(code){const kind=modeStatusKinds[code];return `<span class="mode-status-badge mode-status-${code}"><span aria-hidden="true">${kind.symbol}</span> ${esc(kind.label)}</span>`;}
function modeStatusTable(){
 const modes=modeStatusMode==='all'?Object.keys(modeStatusLabels):[modeStatusMode];
 const rows=filteredModeStatusRows();
 return `<p class="muted" aria-live="polite">แสดง ${rows.length} / ${modeStatusRows.length} รายการ · สถานะตามหลักฐาน ณ 11 พ.ย. 2026 · ป้ายผลผู้ใช้แบบรวมไม่เท่ากับยืนยันครบทุกโหมด</p><div class="table-wrap mode-status-table"><table><thead><tr><th scope="col">ความสามารถ</th>${modes.map(mode=>`<th scope="col">${modeStatusLabels[mode]}</th>`).join('')}<th scope="col">เงื่อนไข / หลักฐาน</th></tr></thead><tbody>${rows.map(row=>`<tr data-capability-id="${row.id}"><th scope="row">${esc(row.name)}<small>${esc(row.group)}</small>${row.acceptance?`<small class="mode-status-pass">${esc(row.acceptance)}</small>`:''}</th>${modes.map(mode=>`<td>${modeStatusCell(row.statuses[Object.keys(modeStatusLabels).indexOf(mode)])}</td>`).join('')}<td>${esc(row.note)}</td></tr>`).join('')||`<tr><td colspan="${modes.length+2}" class="empty">ไม่พบรายการที่ตรงกับตัวกรอง</td></tr>`}</tbody></table></div>`;
}
function modeStatusPage(){
 return heading('Mode capabilities','แต่ละโหมดทำอะไรได้แล้ว และอะไรยังใช้ไม่ได้','SINGLE INSTALL')+`<p class="notice">${release061Note}</p><div class="notice mode-status-notice"><strong>ติดตั้งม็อดเฉพาะเครื่องเรา</strong><p>รุ่นติดตั้ง: <b>0.4.61</b> · ต้องเลือก .61 และ Apply<br>ผู้ใช้ยืนยันข้อ 1 เมนู Host ของ .59 ผ่านแล้ว · .60 เพิ่ม EN/TH และถอด NPC Friend ชั่วคราว · LazyFrog ยังอยู่<br>ภาษาใหม่และข้อทดสอบอื่นยังไม่ยืนยัน · การติดตั้งไม่ใช่ผลทดสอบในเกม</p></div>${expansionPreviewPanel()}
 <div class="mode-status-cards">${[['single','โลกของเรา','0.4.55 เพิ่ม Navigation / NPC Friend รอทดสอบ · คราฟโต๊ะและ Forest ยัง SP เท่านั้น'],['host','ผู้เปิดห้อง','LazyFrog และชุดเดิมผ่านตามรายงาน · NPC Friend / MP 8 คน รอทดสอบ · ฝนยังไม่ซิงก์'],['client','ผู้เข้าร่วมห้อง','Kit Backpack / สูตรแปลน / G แปลนที่วางเอง ผู้ใช้ยืนยันผ่าน · Navigation ใหม่รอทดสอบ · NPC ล็อก']].map(([mode,title,detail])=>`<button class="mode-status-card ${modeStatusMode===mode?'selected':''}" data-capability-mode="${mode}" aria-pressed="${modeStatusMode===mode}"><span>${modeStatusLabels[mode]}</span><strong>${title}</strong><small>${detail}</small></button>`).join('')}</div>
 <section class="panel"><div class="panel-head"><h2>เปรียบเทียบความสามารถ</h2><button data-capability-mode="all" aria-pressed="${modeStatusMode==='all'}">ดูครบ 3 โหมด</button></div><div class="mode-status-tools"><label>ค้นหาความสามารถ<input class="input" id="mode-status-search" value="${esc(modeStatusQuery)}" placeholder="เช่น ปลิง, Teleport, เวลา"></label><label>สถานะ<select class="input" id="mode-status-filter"><option value="all">ทุกสถานะ</option>${Object.entries(modeStatusKinds).map(([key,kind])=>`<option value="${key}" ${modeStatusFilter===key?'selected':''}>${kind.label}</option>`).join('')}</select></label></div><div class="mode-status-results" id="mode-status-results">${modeStatusTable()}</div></section>
 <details class="panel mode-status-legend"><summary>ความหมายของสถานะและขอบเขตผลทดสอบ</summary><div>${Object.entries(modeStatusKinds).map(([key,kind])=>`<p>${modeStatusCell(key)} ${esc(kind.description)}</p>`).join('')}<p>“ล็อกไว้” หมายถึงสิทธิ์ในโค้ดปัจจุบัน ไม่ได้หมายความว่าเกมไม่มีทางรองรับ ส่วน “รอทดสอบ” ไม่ได้ยืนยันว่าใช้งานได้จริง</p><p>การเลือกเพื่อนใน Player ไม่ทำให้ Host มีสิทธิ์แก้ HP / อาหาร / Skills ของเพื่อน และการแก้ข้อมูลตัวเองบน Client ยังต้องเปิดสิทธิ์และทดสอบเป็นรายฟีเจอร์</p><p>หน้าอื่นของ mockup เป็นการจำลองหน้าตา กดปุ่มได้ไม่ได้แปลว่าม็อดจริงรองรับโหมดนั้น</p></div></details>`;
}
function handleModeStatusClick(event){
 if(handleExpansionPreview(event))return true;
 const target=event.target.closest('[data-capability-mode]');
 if(!target)return false;
 if(['all',...Object.keys(modeStatusLabels)].includes(target.dataset.capabilityMode)){modeStatusMode=target.dataset.capabilityMode;render();}
 return true;
}
function handleModeStatusInput(event){
 if(!['mode-status-search','mode-status-filter'].includes(event.target.id))return false;
 if(event.target.id==='mode-status-search')modeStatusQuery=event.target.value;
 else modeStatusFilter=event.target.value in modeStatusKinds?event.target.value:'all';
 document.getElementById('mode-status-results').innerHTML=modeStatusTable();
 return true;
}
