'use strict';
let spawnPlanSection='kit',kitDrops=0;
let kitNextAction=0,kitRowDrops=0;
let kitMessage='วางชุดบนพื้นซ้ำได้ เพื่อแจกให้ผู้เล่นอื่นหยิบ';
const kitItems=window.GH_SURVIVAL_KIT.map(i=>[i.key,i.name_th,i.id,i.count,Math.round((i.dry_mass+i.water_amount*0.01)*1000)]);
let kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],i[3]]));
const kitMass=()=>kitItems.reduce((sum,i)=>sum+kitCounts[i[0]]*i[4],0);
const kg=grams=>(grams/1000).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
function kitPreview(){
 const client=state.mode==='client';
 return `<section class="kit-preview"><div class="plan-command-heading"><div><span class="eyebrow">SUPPLIES / ${client?'BACKPACK ONLY':'BACKPACK OR GROUND'}</span><h3>Survival Kit · ชุดเอาตัวรอด</h3></div><span class="pill">จำลองเท่านั้น</span></div><p>${client?'Client รับของเข้ากระเป๋าตัวเราได้ ส่วน Ground ยังล็อก':'รับเข้ากระเป๋าตัวเรา หรือวางบนพื้น เลือกได้รายแถวหรือทั้งชุด'} · จำนวน 0–10 · ไม่สวมอุปกรณ์อัตโนมัติ</p><div class="kit-metrics"><div><small>จำนวนที่เลือก</small><strong>${kitItems.reduce((sum,i)=>sum+kitCounts[i[0]],0)}</strong></div><div><small>ชุดที่รับจำลอง</small><strong>${kitDrops}</strong></div></div><div class="kit-table"><table><thead><tr><th>รายการ</th><th>จำนวน</th><th>ปลายทาง</th></tr></thead><tbody>${kitItems.map(i=>`<tr><td><b>${i[1]}</b><small>${i[2]}${i[0]==='water'?' · น้ำสะอาด 100/100':''}</small></td><td><div class="kit-quantity"><button data-kit-count="${i[0]}" data-delta="-1" ${kitCounts[i[0]]===0?'disabled':''}>−</button><span>${kitCounts[i[0]]}</span><button data-kit-count="${i[0]}" data-delta="1" ${kitCounts[i[0]]===10?'disabled':''}>+</button></div></td><td><div class="action-group"><button data-kit-spawn="${i[0]}" data-kit-destination="backpack" ${kitCounts[i[0]]===0?'disabled':''}>Backpack</button><button data-kit-spawn="${i[0]}" data-kit-destination="ground" ${client||kitCounts[i[0]]===0?'disabled':''}>Ground</button></div></td></tr>`).join('')}</tbody></table></div><div class="action-group"><button class="primary" data-kit-command="claim-bag" ${kitMass()===0?'disabled':''}>ทั้งชุด → Backpack</button><button data-kit-command="claim" ${client||kitMass()===0?'disabled':''}>ทั้งชุด → Ground</button><button data-kit-command="defaults">Default Kit</button><button data-kit-command="deselect">Deselect All</button><button data-kit-command="reset">รีเซ็ตตัวอย่าง</button></div><p role="status">${kitMessage}</p><div class="notice">การกดบนเว็บเป็นตัวอย่าง ไม่เชื่อมเกม · ของจริงต้องมีช่องกระเป๋า และรับได้เฉพาะกระเป๋าตัวเรา · ไม่ถือว่าการจำลองสำเร็จเป็นผลทดสอบในเกม</div></section>`;
}
function handleKitClick(e){
 const section=e.target.closest('[data-spawn-section]');if(section){spawnPlanSection=section.dataset.spawnSection==='kit'?'kit':'overview';render();return true;}
 const count=e.target.closest('[data-kit-count]');if(count){const {kitCount,delta}=count.dataset;if(kitCount in kitCounts&&['1','-1'].includes(delta)){kitCounts[kitCount]=Math.min(10,Math.max(0,kitCounts[kitCount]+Number(delta)));kitMessage='ปรับจำนวนจำลองแล้ว';render();}return true;}
 const row=e.target.closest('[data-kit-spawn]');if(row){const destination=row.dataset.kitDestination||(state.mode==='client'?'backpack':'ground');if(state.mode==='client'&&destination!=='backpack')return true;const item=kitItems.find(i=>i[0]===row.dataset.kitSpawn);if(!item||kitCounts[item[0]]===0)return true;if(Date.now()<kitNextAction){kitMessage='รอ 2 วินาทีก่อน Spawn อีกครั้ง';render();return true;}kitNextAction=Date.now()+2000;kitRowDrops+=kitCounts[item[0]];kitMessage=`จำลองรับ ${item[1]} ×${kitCounts[item[0]]} → ${destination}${item[0]==='water'?' · น้ำสะอาด 100/100':''}`;render();return true;}
 const button=e.target.closest('[data-kit-command]');if(!button)return false;
 switch(button.dataset.kitCommand){
  case 'claim':case 'claim-bag':if(state.mode==='client'&&button.dataset.kitCommand==='claim')return true;if(kitMass()===0){kitMessage='เลือกอย่างน้อยหนึ่งชิ้นก่อน';break;}if(Date.now()<kitNextAction){kitMessage='รอ 2 วินาทีก่อน Spawn อีกครั้ง';break;}kitNextAction=Date.now()+2000;kitDrops++;kitMessage=`รับชุดจำลองที่ ${kitDrops} → ${button.dataset.kitCommand==='claim-bag'?'Backpack':'Ground'} ตามจำนวนที่เลือกแล้ว`;break;
  case 'defaults':kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],i[3]]));kitMessage='คืนชุดตามแผนแล้ว';break;
  case 'deselect':kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],0]));kitMessage='ตั้งจำนวนทุกรายการเป็น 0 แล้ว';break;
  case 'reset':kitCounts=Object.fromEntries(kitItems.map(i=>[i[0],i[3]]));kitDrops=0;kitRowDrops=0;kitNextAction=0;kitMessage='เริ่มตัวอย่างใหม่แล้ว';break;
 }
 render();return true;
}
