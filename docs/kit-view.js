'use strict';
let spawnPlanSection='kit',kitDrops=0,kitNextAction=0,kitRowDrops=0;
let kitMessage='Backpack สวมเกราะส่วนที่ขาดก่อน · Ground สร้างครบเพื่อแจกเพื่อน';
const kitItems=window.GH_SURVIVAL_KIT.map(i=>[i.key,i.name_th,i.id,i.count,Math.round((i.dry_mass+i.water_amount*0.01)*1000)]);
let kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],i[3]]));
const kitMass=()=>kitItems.reduce((sum,i)=>sum+kitCounts[i[0]]*i[4],0);
const kg=grams=>(grams/1000).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
function kitPreview(){
 const client=state.mode==='client',disabled=!hubMasterPreview;
 return `<section class="kit-preview"><p class="notice">ความทนทานใช้สูตรคราฟเดิม: 15% + โบนัส Crafting + ประวัติคราฟไอเทมนั้น สูงสุด 100% · การเสกไม่เพิ่ม XP/history · ตัวอย่างธนู ${previewSpawnDurability('Bow')}%</p><div class="plan-command-heading"><div><span class="eyebrow">SUPPLIES / ${client?'BACKPACK ONLY':'BACKPACK OR GROUND'}</span><h3>Survival Kit · ชุดเอาตัวรอด</h3></div><span class="pill">.80 · จำลองเท่านั้น</span></div><p>จำนวน 0–10 ต่อรายการ · Client ใช้ Backpack เท่านั้น</p>${kitArmorPreview()}<div class="kit-metrics"><div><small>จำนวนที่เลือก</small><strong>${kitItems.reduce((sum,i)=>sum+kitCounts[i[0]],0)}</strong></div><div><small>ชุดที่รับจำลอง</small><strong>${kitDrops}</strong></div></div><div class="kit-table"><table><thead><tr><th>รายการ</th><th>จำนวน</th><th>ปลายทาง</th></tr></thead><tbody>${kitItems.map(i=>`<tr><td><b>${i[1]}</b><small>${i[2]}${i[0]==='water'?' · น้ำสะอาด 100/100':''}${['bow','spear','axe','blade','armor','firebow'].includes(i[0])?' · ความทนทานจำลอง '+previewSpawnDurability(i[2])+'%':''}</small></td><td><div class="kit-quantity"><button data-kit-count="${i[0]}" data-delta="-1" ${kitCounts[i[0]]===0?'disabled':''}>−</button><span>${kitCounts[i[0]]}</span><button data-kit-count="${i[0]}" data-delta="1" ${kitCounts[i[0]]===10?'disabled':''}>+</button></div></td><td><div class="action-group"><button data-kit-spawn="${i[0]}" data-kit-destination="backpack" ${disabled||kitCounts[i[0]]===0?'disabled':''}>Backpack</button><button data-kit-spawn="${i[0]}" data-kit-destination="ground" ${disabled||client||kitCounts[i[0]]===0?'disabled':''}>Ground</button></div></td></tr>`).join('')}</tbody></table></div><div class="action-group"><button class="primary" data-kit-command="claim-bag" ${disabled||kitMass()===0?'disabled':''}>ทั้งชุด → Backpack</button><button data-kit-command="claim" ${disabled||client||kitMass()===0?'disabled':''}>ทั้งชุด → Ground</button><button data-kit-command="defaults">Default Kit</button><button data-kit-command="deselect">Deselect All</button><button data-kit-command="reset">รีเซ็ตตัวอย่าง</button></div><p role="status">${esc(kitMessage)}</p><div class="notice">ไม่เชื่อมเกม · ช่องกระเป๋า/ownership/Resume/การเห็นของฝั่งเพื่อนยังต้องทดสอบในเกม ผลเว็บไม่ใช่ runtime PASS</div></section>`;
}
function claimKitPreview(keys,destination){
 let created=0,equipped=0,skipped=0;
 for(const key of keys){const count=kitCounts[key];if(key==='armor'&&destination==='backpack'){const result=previewKitArmor(count);created+=result.equipped;equipped+=result.equipped;skipped+=result.skipped;}else created+=count;}
 return {created,equipped,skipped};
}
function handleKitClick(e){
 const section=e.target.closest('[data-spawn-section]');if(section){spawnPlanSection=section.dataset.spawnSection==='kit'?'kit':'overview';render();return true;}
 const count=e.target.closest('[data-kit-count]');if(count){const {kitCount,delta}=count.dataset;if(kitCount in kitCounts&&['1','-1'].includes(delta)){kitCounts[kitCount]=Math.min(10,Math.max(0,kitCounts[kitCount]+Number(delta)));kitMessage='ปรับจำนวนจำลองแล้ว';render();}return true;}
 const row=e.target.closest('[data-kit-spawn]');if(row){const destination=row.dataset.kitDestination||(state.mode==='client'?'backpack':'ground'),item=kitItems.find(i=>i[0]===row.dataset.kitSpawn);if(!hubMasterPreview||!item||!kitCounts[item[0]]||(state.mode==='client'&&destination!=='backpack'))return true;if(Date.now()<kitNextAction){kitMessage='รอ 2 วินาที';render();return true;}kitNextAction=Date.now()+2000;const result=claimKitPreview([item[0]],destination);kitRowDrops+=result.created;kitMessage=`จำลอง ${item[1]} → ${destination}: สร้าง ${result.created} · สวม ${result.equipped} · ข้ามเกราะที่มีแล้ว ${result.skipped}`;render();return true;}
 const button=e.target.closest('[data-kit-command]');if(!button)return false;
 switch(button.dataset.kitCommand){
  case 'claim':case 'claim-bag':{if(!hubMasterPreview||(state.mode==='client'&&button.dataset.kitCommand==='claim'))return true;if(kitMass()===0){kitMessage='เลือกอย่างน้อยหนึ่งชิ้นก่อน';break;}if(Date.now()<kitNextAction){kitMessage='รอ 2 วินาที';break;}kitNextAction=Date.now()+2000;kitDrops++;const destination=button.dataset.kitCommand==='claim-bag'?'backpack':'ground',result=claimKitPreview(kitItems.map(i=>i[0]),destination);kitMessage=`ชุดจำลอง ${kitDrops} → ${destination}: สร้าง ${result.created} · สวม ${result.equipped} · ข้ามเกราะที่มีแล้ว ${result.skipped}`;break;}
  case 'defaults':kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],i[3]]));break;
  case 'deselect':kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],0]));break;
  case 'reset':kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],i[3]]));kitDrops=kitRowDrops=kitNextAction=0;kitArmorSlots=[false,false,false,false];kitMessage='เริ่มตัวอย่างใหม่แล้ว';break;
 }render();return true;
}
