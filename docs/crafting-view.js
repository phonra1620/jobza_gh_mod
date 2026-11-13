'use strict';
let craftingMode=true,craftRecipe='axe',craftPrepared=false,craftMessage='เลือก preset เพื่อดูสูตรและวัสดุ';
let craftStock={stone:2,stick:3,rope:0,leaf:2};
const craftMaterialNames={stone:'หินเล็ก',stick:'กิ่งไม้',rope:'เชือก',leaf:'ใบโมลิเนเรีย'};
const craftRecipes=[{id:'axe',name:'ขวานหิน',icon:'⚒',ingredients:{stone:1,stick:1}},{id:'blade',name:'มีดหิน',icon:'◩',ingredients:{stone:2}},{id:'bandage',name:'ผ้าพันแผล',icon:'✚',ingredients:{leaf:1}},{id:'drill',name:'เครื่องมือก่อไฟ',icon:'♨',ingredients:{stick:1,smallstick:1}}];
craftMaterialNames.smallstick='กิ่งไม้เล็ก';craftStock.smallstick=0;
setupCraftCategories();
const craftReady=recipe=>Object.entries(recipe.ingredients).every(([id,n])=>craftStock[id]>=n);
function craftingPreview(){
 const recipe=craftRecipes.find(r=>r.id===craftRecipe),ready=craftReady(recipe);
 return heading('Crafting Presets','แสดงสูตรข้างพื้นที่ประดิษฐ์เมื่อเข้าโหมดคราฟ','INTERACTION MOCKUP')+`<div class="game-toolbar"><span>สูตรและจำนวนวัสดุจากไฟล์เกมที่ติดตั้ง · ชื่อและไอคอนจากเกม · กระเป๋าเป็นข้อมูลจำลอง</span><button data-craft-command="mode">${craftingMode?'ออกจาก':'เข้า'}โหมดประดิษฐ์</button></div><section class="game-stage craft-stage"><div class="game-canopy"></div><div class="game-trunks"></div><div class="game-ground"></div><div class="craft-bag"><b>ที่เก็บของ · ตัวอย่าง</b>${Object.entries(craftStock).map(([id,n])=>`<div>${craftMaterialNames[id]} <strong>× ${n}</strong></div>`).join('')}<button data-craft-command="refill">เติมวัสดุตัวอย่าง</button></div>${craftingMode?`<div class="craft-stone"><span class="eyebrow">CRAFTING AREA</span><h2>${craftPrepared?recipe.name:'พื้นที่ประดิษฐ์'}</h2><div class="craft-ingredients">${craftPrepared?Object.entries(recipe.ingredients).map(([id,n])=>`<span>${craftMaterialNames[id]} × ${n}</span>`).join(''):'เลือกสูตร แล้วจัดวัสดุจากกระเป๋า'}</div><button data-craft-command="finish" ${!craftPrepared||!ready?'disabled':''}>ประดิษฐ์ (จำลอง)</button></div>${craftContents()}`:`<div class="craft-mode-off"><h2>โหมดประดิษฐ์ปิดอยู่</h2><p>Preset จะแสดงเมื่อเข้าโหมดประดิษฐ์เท่านั้น</p></div>`}<div class="craft-feedback" role="status" aria-live="polite">${esc(craftMessage)}</div></section><p class="shortcut-note">ต้นแบบเว็บ ยังไม่เพิ่มลงม็อดจริง สูตรอ่านจาก Items snapshot ของเกม ไม่รวมกระบวนการเฉพาะสถานี ชื่อที่ยังไม่มีคำแปลใช้รหัสเดิม การจัดวัสดุเป็นการเตรียมรายการจำลอง ส่วนปุ่มประดิษฐ์จึงหักวัสดุ ไม่มีผลกับเกมหรือเซฟ</p>`;
}
function handleCraftClick(e){
 const category=e.target.closest('[data-craft-category]');
 if(category){if(craftCategories.some(c=>c[0]===category.dataset.craftCategory)){craftCategory=category.dataset.craftCategory;const first=craftRecipes.find(r=>r.category===craftCategory);if(first)craftRecipe=first.id;craftPrepared=false;render();}return true;}

 const choice=e.target.closest('[data-craft-recipe]');
 if(choice){if(craftRecipes.some(r=>r.id===choice.dataset.craftRecipe)){craftRecipe=choice.dataset.craftRecipe;craftPrepared=false;craftMessage='เลือกสูตรแล้ว ตรวจวัสดุก่อนจัดลงพื้นที่';render();}return true;}
 const control=e.target.closest('[data-craft-command]');if(!control)return false;
 const recipe=craftRecipes.find(r=>r.id===craftRecipe);
 switch(control.dataset.craftCommand){
 case 'contents':craftContentsOpen=!craftContentsOpen;break;
 case 'mode':craftingMode=!craftingMode;craftPrepared=false;craftMessage=craftingMode?'เข้าโหมดประดิษฐ์แล้ว':'ซ่อน preset แล้ว';break;
 case 'prepare':if(craftingMode&&craftReady(recipe)){craftPrepared=true;craftMessage='จัดรายการวัสดุแล้ว กดประดิษฐ์เพื่อทดลอง';}break;
 case 'clear':craftPrepared=false;craftMessage='นำวัสดุออกแล้ว ไม่มีการหักวัสดุ';break;
 case 'finish':if(craftingMode&&craftPrepared&&craftReady(recipe)){for(const [id,n] of Object.entries(recipe.ingredients))craftStock[id]-=n;craftPrepared=false;craftMessage=`ประดิษฐ์ ${recipe.name} สำเร็จ (จำลอง) หักวัสดุแล้ว`;}break;
 case 'refill':craftStock={stone:2,stick:3,rope:0,leaf:2,smallstick:2,banana:2};craftPrepared=false;craftMessage='เติมเฉพาะข้อมูลวัสดุสาธิตบนเว็บแล้ว';break;
 }
 render();return true;
}
