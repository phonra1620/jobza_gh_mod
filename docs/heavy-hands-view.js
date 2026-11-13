'use strict';
const heavyHandsDemo={selected:'Log',held:null,message:''};
function heavyHandsEntries(){return (window.GH_GAME_LIBRARY?.items||[]).filter(i=>i.info_type==='HeavyObject'&&gameSpawnEstimate(i).candidate);}
function heavyHandsPreview(){
 const entries=heavyHandsEntries();
 return `<section class="panel"><div class="panel-head"><h2>HeavyObject → Hands / ถือในมือ</h2><span class="pill">0.4.65 · จำลอง</span></div><div class="panel-content"><p>Client สร้างของหนักขึ้นถือได้ · จำนวน 1 ต่อครั้ง · Ground และ AI ยังต้องเป็น Host</p><label>ของหนัก <select id="heavy-hands-item">${entries.map(i=>`<option value="${esc(i.id)}" ${i.id===heavyHandsDemo.selected?'selected':''}>${esc(i.name_th||i.name_en||i.id)} · ${esc(i.id)}</option>`).join('')}</select></label><div class="action-group"><button data-heavy-hands="spawn" ${!hubMasterPreview?'disabled':''}>Hands · สร้างขึ้นถือ (จำลอง)</button><button data-heavy-hands="clear" ${!hubMasterPreview||!heavyHandsDemo.held?'disabled':''}>วางในตัวอย่าง</button></div><p aria-live="polite">${esc(heavyHandsDemo.message||'มือว่างในตัวอย่าง')}</p><p class="muted">ในเกมต้องเก็บอาวุธก่อน หรือถือของหนักชนิดเดียวกันที่ยังซ้อนได้ ใช้ native Take / PickUp และขีดจำกัดของเกม · การถือ วาง ใส่แบบก่อสร้าง และ sync กับ Host ยังรอทดสอบจริง</p></div></section>`;
}
function handleHeavyHandsClick(event){
 const button=event.target.closest('[data-heavy-hands]');if(!button)return false;
 if(!hubMasterPreview)return true;
 if(button.dataset.heavyHands==='clear'){heavyHandsDemo.held=null;heavyHandsDemo.message='วางในตัวอย่างแล้ว';}
 else if(button.dataset.heavyHands==='spawn'){
  const id=document.getElementById('heavy-hands-item')?.value||heavyHandsDemo.selected;
  if(!heavyHandsEntries().some(i=>i.id===id))return true;
  heavyHandsDemo.selected=id;
  if(heavyHandsDemo.held&&heavyHandsDemo.held!==id)heavyHandsDemo.message='วางของชนิดเดิมในตัวอย่างก่อน';
  else{heavyHandsDemo.held=id;heavyHandsDemo.message=`จำลองถือ ${id} · ในเกมซ้อนได้ตามช่องว่างของ native stack` ;}
 }
 render();return true;
}
