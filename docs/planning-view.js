'use strict';
let planTab='player',planOpen=true;
const planSelected=new Set();
const planGroups=[
 ['player','Player','ตัวละคร',[
 ['Immortal Mode','ตัวเอง','มีแล้ว · SP ผ่าน','เปิด–ปิดการป้องกันความเสียหาย'],
 ['ฟื้นฟูสถานะ','ตัวเอง','ผู้ใช้ยืนยันผ่าน','Restore Status / Doctors มีในเกมแล้ว ผลยืนยันไม่แยกทุกโหมด'],
 ['น้ำหนักกระเป๋า 50 / 300','ตัวเอง','มีแล้ว · SP ผ่าน','เพิ่มน้ำหนักที่แบกได้ พื้นที่จัดวางเท่าเดิม']]],
 ['teleport','Teleport','เดินทาง',[
 ['จุดบันทึก 4 จุด','ตัวเอง','มีแล้ว · ผ่านเบื้องต้น','บันทึกตำแหน่งปัจจุบันและวาร์ปกลับ'],
 ['สถานที่สำคัญ','ตัวเอง','มีโค้ด · รอทดสอบ','เลือกปลายทางจากสถานที่ของเกม'],
 ['จุดที่เล็ง / กลับจุดก่อนหน้า','ตัวเอง','มีโค้ด · รอทดสอบ','เดินทางและย้อนกลับตำแหน่ง'],
 ['วาร์ปไปหาผู้เล่น','ตัวเอง','ผู้ใช้ยืนยันผ่าน','เลือกเพื่อนแล้ววาร์ปเฉพาะตัวเรา มีในเกมแล้ว'],
 ['เรียกผู้เล่นมาหา','ผู้เล่นเป้าหมาย','นอกขอบเขต','ตัดออกตามแนวทางติดตั้งคนเดียว ไม่มี Bring to me']]],
 ['building','Building','ก่อสร้าง',[
 ['ปลดล็อกแบบก่อสร้าง','ตัวเอง','Client ผ่าน','ผู้ใช้ยืนยัน Client แสดงและวางแปลนทั้งหมดผ่านใน 0.4.54'],
 ['สร้างแปลนที่เล็งให้เสร็จ','ทั้งโลก','Client / Host ผ่าน','Client ใช้กับแปลนใหม่ที่วางเองขณะ Mod ON และยังถือ ownership']]],
 ['spawn','Spawn','สร้างสิ่งของ',[
 ['Items','ตัวเอง / โลก','มีโค้ด · รอทดสอบ','ค้นหาไอเทม เลือกจำนวน 1–20 แล้วเสก'],
 ['Animals / AI','ทั้งโลก','มีโค้ด · รอทดสอบ','เลือกชนิดและจุดเกิด ต้องตรวจผลกับ Client'],
 ['ชุดไอเทมที่บันทึกไว้','ตัวเอง','เสนอใหม่','จัดชุดเครื่องมือหรือวัสดุสำหรับเรียกใช้ซ้ำ']]],
 ['equipment','Equipment','อุปกรณ์',[
 ['ซ่อมของที่ถือ','ตัวเอง','มีโค้ด · รอทดสอบ','คืนความทนทานของอุปกรณ์ที่ถือ'],
 ['ซ่อมรายชิ้น / ทั้งหมด','ตัวเอง','มีโค้ด · รอทดสอบ','เลือกอุปกรณ์ในกระเป๋าของ Admin']]],
 ['world','World','โลก',[
 ['เวลาและอากาศ','ทั้งโลก','มีโค้ด · รอทดสอบ','ปรับเวลา หยุดวงจรกลางวัน ฝน และความเร็วจำลอง · SP ก่อน'],
 ['ต้นไม้เกิดใหม่ใน 10 นาที','ทั้งโลก','มีโค้ด · รอทดสอบ','ค่อย ๆ โตที่เดิม ข้ามสิ่งปลูกสร้าง และโตเต็มวัยเมื่อโหลดเซฟ'],
 ['โปรไฟล์โลก','ทั้งโลก','เสนอใหม่','บันทึกการตั้งค่าแยกตามเซฟของ Host'],
 ['Minimap × Permanent Compass','ถอดออก','ไม่ผ่าน · ยกเลิกแล้ว','ผู้ใช้สั่งเอาออก ถอดโค้ดและเมนูในรุ่นเตรียม 0.4.56'],
 ['Freecam / Bird eye view','ถอดออก','ผู้ใช้สั่งเอาออก','ถอด hook กล้องและเมนูในรุ่นเตรียม 0.4.57'],
 ['i_can_fly','ตัวละครเรา','เตรียม 0.4.57 · รอทดสอบ','บินเร็ววิ่ง ×3 · Space ขึ้น / Ctrl ซ้ายลง · F8 ออก ตกปลอดภัย'],
 ['Always Show Names','Co-op','เตรียม 0.4.57 · รอทดสอบ','ชื่อเพื่อนไม่จางตามระยะ พร้อมรายชื่อระยะไกล'],
 ['Show player on map','ตัวเรา / แผนที่เกม','เตรียม 0.4.58 · รอทดสอบ','จุดตัวเราบนแผนที่ที่ปลดล็อกแล้ว รองรับ 8 calibration ไม่เปิด Minimap'],
 ['Auto Pickup Arrows','SP / Host / Client','เตรียม 0.4.58 · รอทดสอบ','เก็บลูกธนูจริงใกล้ตัว 1–10 ม. ตรวจช่องกระเป๋าและ ownership ไม่เก็บผ่านกำแพง'],
 ['NPC Friend · House Keeper','ถอดชั่วคราว','รุ่นเตรียม 0.4.60','ผู้ใช้สั่งเอาออกชั่วคราว ไม่รวมโค้ดหรือ hook ในแพ็กเกจใหม่ เก็บ source ไว้'],
 ['NPC Friend · Life Guard','ถอดชั่วคราว','รุ่นเตรียม 0.4.60','เอาออกทั้งเมนูและ runtime ชั่วคราว ไม่ถือว่าผ่านจากการถอด']]],
 ['server','Server','ห้องเล่น',[
 ['ข้อมูลห้องและสิทธิ์ Host','ห้องเล่น','เสนอใหม่','แสดงบทบาทจริงและปิดคำสั่ง Admin เมื่อเป็น Client'],
 ['รายชื่อผู้เล่นออนไลน์','ผู้เล่นเป้าหมาย','เสนอใหม่','เลือกเป้าหมายกลางให้คำสั่งผู้เล่น'],
 ['ประวัติคำสั่งของ Host','ห้องเล่น','เสนอใหม่','บันทึกคำสั่ง เป้าหมาย เวลา และผลสำเร็จหรือล้มเหลว'],
 ['MP Cap Remover · 8 คน','ห้องใหม่','ติดตั้ง 0.4.55 · รอทดสอบ','ตั้ง 4–8 คนจากเมนูก่อนเข้าโลก ไม่เปลี่ยนห้องที่กำลังเล่น']]],
 ['settings','Settings','ตั้งค่า Hub',[
 ['ปุ่มลัดและหน้าตาเมนู','เฉพาะเครื่อง','เสนอใหม่','กำหนดปุ่ม Insert ขนาด และความโปร่งแสง'],
 ['คำสั่งโปรด','เฉพาะเครื่อง','เสนอใหม่','ปักหมุดคำสั่งที่ใช้บ่อย'],
 ['ค้นหาคำสั่งทั้งหมด','เฉพาะเครื่อง','เสนอใหม่','ค้นหาจากชื่อและเปิดหมวดที่เกี่ยวข้อง']]]
];
function planningPage(){
 const group=planGroups.find(g=>g[0]===planTab)||planGroups[0];
 return heading('In-game GUI · Planning','วางแผน Hub ตามคำสั่งหลัก แยกจากตัวจำลองรุ่นปัจจุบัน','DESIGN PROPOSAL')+`<div class="game-toolbar"><span>Admin คนเดียวคือ Host · สถานะ SP ไม่ยืนยันผล Multiplayer</span><button data-plan-menu>${planOpen?'ซ่อน':'เปิด'}เมนู <kbd>Insert</kbd></button></div><section class="game-stage planning-stage" aria-label="เมนูในเกมฉบับวางแผน"><div class="game-canopy"></div><div class="game-trunks"></div><div class="game-ground"></div><div class="game-session">ADMIN HUB <small>FUTURE DESIGN / NOT A GAME BUILD</small></div>${planOpen?`<section class="game-window planning-window"><div class="game-title">Green Hell Admin Hub · Planning <span>Insert / Esc to close</span><button data-plan-menu aria-label="ปิดเมนู">×</button></div><div class="plan-layout"><nav class="plan-nav" aria-label="หมวดคำสั่งหลัก">${planGroups.map(g=>`<button data-plan-tab="${g[0]}" aria-pressed="${planTab===g[0]}"><b>${g[1]}</b><small>${g[2]}</small></button>`).join('')}</nav><div class="plan-content"><div class="plan-intro"><div class="eyebrow">${group[2]} / COMMANDS</div><h2>${group[1]}</h2><p>เลือกคำสั่งเพื่อเก็บในรายการวางแผน · ${planSelected.size} รายการที่เลือก</p></div>${planTab==='player'?`<div class="player-plan-tabs"><button data-player-section="overview" aria-pressed="${playerPlanSection==='overview'}">Overview</button><button data-player-section="skills" aria-pressed="${playerPlanSection==='skills'}">Skills · ทักษะ</button></div>`:''}${planTab==='spawn'?`<div class="player-plan-tabs"><button data-spawn-section="overview" aria-pressed="${spawnPlanSection==='overview'}">Overview</button><button data-spawn-section="kit" aria-pressed="${spawnPlanSection==='kit'}">Survival Kit</button></div>`:''}${planTab==='player'&&playerPlanSection==='skills'?skillsPreview():planTab==='spawn'&&spawnPlanSection==='kit'?kitPreview():group[3].map((c,i)=>{const id=group[0]+':'+i;return `<article class="plan-command"><div class="plan-command-heading"><h3>${esc(c[0])}</h3><span class="pill ${c[2].includes('เสนอใหม่')?'':'pass'}">${esc(c[2])}</span></div><p>${esc(c[3])}</p><div class="plan-command-bottom"><span>ขอบเขต: <b>${esc(c[1])}</b></span><button data-plan-select="${id}" aria-pressed="${planSelected.has(id)}">${planSelected.has(id)?'✓ เลือกแล้ว':'＋ เลือกวางแผน'}</button></div></article>`;}).join('')}</div></div><div class="game-status"><span>ปุ่มหน้านี้ใช้เลือกแผนเท่านั้น · ไม่เรียกคำสั่งหรือเปลี่ยนสถานะ Dashboard</span><button data-plan-menu>Close</button></div></section>`:`<button class="game-open" data-plan-menu>เปิดเมนูวางแผน <kbd>Insert</kbd></button>`}</section><div class="notice" style="margin-top:16px"><b>รายการที่เลือกวางแผน (${planSelected.size})</b><p>${planSelected.size?[...planSelected].map(id=>{const [g,i]=id.split(':');return esc(planGroups.find(x=>x[0]===g)[3][Number(i)][0]);}).join(' · '):'ยังไม่ได้เลือก ลองเลือกจากแต่ละหมวดได้'}</p>รายการเลือกเก็บเฉพาะระหว่างเปิดหน้าเว็บ ยังไม่ใช่การอนุมัติหรือเริ่มพัฒนาฟีเจอร์</div>`;
}
function handlePlanClick(e){
 if(handleKitClick(e)||handleSkillClick(e))return true;
 const tab=e.target.closest('[data-plan-tab]');
 if(tab){if(planGroups.some(g=>g[0]===tab.dataset.planTab)){planTab=tab.dataset.planTab;render();}return true;}
 if(e.target.closest('[data-plan-menu]')){planOpen=!planOpen;render();return true;}
 const select=e.target.closest('[data-plan-select]');
 if(select){const id=select.dataset.planSelect;const valid=planGroups.some(g=>g[3].some((_,i)=>g[0]+':'+i===id));if(valid){planSelected.has(id)?planSelected.delete(id):planSelected.add(id);render();}return true;}
 return false;
}
