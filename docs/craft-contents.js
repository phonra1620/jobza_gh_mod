'use strict';
let craftCategory='axes',craftContentsOpen=true;
const craftCategories=[['armor','Armor','เกราะ'],['axes','Axes','ขวาน'],['bandages','Bandages','ผ้าพันแผล'],['blades','Blades','มีด'],['blowpipes','Blowpipes & Darts','ลูกดอกและท่อเป่า'],['bows','Bows & Arrows','ธนูและลูกธนู'],['fishing','Fishing Tools','อุปกรณ์ตกปลา'],['tools','Hand Tools','เครื่องมือ'],['molds','Molds','แม่พิมพ์'],['spears','Spears','หอก']];
function craftIllustration(id){
 const aliases={stone:'Stone',stick:'Stick',smallstick:'Small_Stick',rope:'Rope',leaf:'Molineria_leaf',banana:'Banana_Leaf',axe:'Stone_Axe',blade:'Stone_Blade',bandage:'Leaf_Bandage',drill:'Hand_Drill_Stick',leafarmor:'leaf_armor',stickarmor:'stick_armor'};
 const native=window.GH_NATIVE_ITEMS?.[aliases[id]||id];
 if(native?.image)return `<img class="native-craft-icon" src="${esc(native.image)}" alt="${esc(native.th||native.en||native.id)}" loading="lazy">`;
 return '<span class="native-icon-missing">ไม่พบภาพ</span>';

}
function setupCraftCategories(){
 Object.assign(craftMaterialNames,{banana:'ใบกล้วย'});craftStock.banana=1;
 const materialAliases={Stone:'stone',Stick:'stick',Small_Stick:'smallstick',Rope:'rope',Molineria_leaf:'leaf',Banana_Leaf:'banana'};
 const resultAliases={Stone_Axe:'axe',Stone_Blade:'blade',Leaf_Bandage:'bandage',Hand_Drill_Stick:'drill',leaf_armor:'leafarmor',stick_armor:'stickarmor'};
 const names={axe:'ขวานหิน',blade:'มีดหิน',bandage:'ผ้าพันแผล',drill:'เครื่องมือก่อไฟ',leafarmor:'เกราะใบไม้',stickarmor:'เกราะไม้'};
 const native=window.GH_NATIVE_RECIPES||[];
 const recipes=native.filter(r=>!['Construction','Trap','Trough','Dynamite'].includes(r.type)).map(r=>{
  const id=resultAliases[r.id]||r.id,key=r.id.toLowerCase();
  let category=['ItemTool','Weapon','Torch','Arrow','Bow','Spear','Blowpipe'].includes(r.type)?'tools':'other';
  if(key.includes('form')||key.includes('mold'))category='molds';
  else if(key.includes('armor'))category='armor';
  else if(key.includes('axe'))category='axes';
  else if(r.type==='Dressing')category='bandages';
  else if(key.includes('blade')||key.includes('knife'))category='blades';
  else if(key.includes('blowpipe')||key.includes('dart'))category='blowpipes';
  else if(key.includes('bow')||key.includes('arrow'))category='bows';
  else if(key.includes('fishing')||key.includes('hook'))category='fishing';
  else if(r.type==='Spear')category='spears';
  const ingredients={};
  for(const [item,n] of Object.entries(r.ingredients)){const material=materialAliases[item]||item;ingredients[material]=n;if(!(material in craftStock))craftStock[material]=0;craftMaterialNames[material]=window.GH_NATIVE_ITEMS?.[item]?.th||window.GH_NATIVE_ITEMS?.[item]?.en||item;}
  return {id,name:window.GH_NATIVE_ITEMS?.[r.id]?.th||window.GH_NATIVE_ITEMS?.[r.id]?.en||r.id,icon:'◇',category,ingredients,nativeId:r.id};
 });
 craftRecipes.splice(0,craftRecipes.length,...recipes);
 craftCategories.push(['other','Other','อื่น ๆ']);
}
function craftContents(){
 const category=craftCategories.find(c=>c[0]===craftCategory),rows=craftRecipes.filter(r=>r.category===craftCategory);
 const recipe=craftRecipes.find(r=>r.id===craftRecipe);
 return `<aside class="craft-presets contents-panel"><div class="contents-heading"><b>☷ Contents</b><button data-craft-command="contents">${craftContentsOpen?'hide':'show'}</button></div>${craftContentsOpen?`<nav aria-label="หมวดสูตร">${craftCategories.map((c,i)=>`<button data-craft-category="${c[0]}" aria-pressed="${craftCategory===c[0]}"><span>${i+1}. ${c[1]}<small>${c[2]}</small></span></button>`).join('')}</nav>`:''}</aside><section class="craft-recipe-sheet" aria-label="สูตรในหมวดที่เลือก"><div class="sheet-title"><b>${category[1]} · ${category[2]}</b><small>สูตรและภาพจากเกม</small></div>${rows.length?rows.map(r=>`<button class="recipe-equation" data-craft-recipe="${r.id}" aria-pressed="${craftRecipe===r.id}"><span class="recipe-piece">${craftIllustration(r.id)}<b>${r.name}</b></span><span class="recipe-sign">=</span>${Object.entries(r.ingredients).map(([id,n],i)=>`${i?'<span class="recipe-sign">+</span>':''}<span class="recipe-piece">${craftIllustration(id)}<strong>×${n}</strong><b>${craftMaterialNames[id]}</b><small class="${craftStock[id]<n?'craft-missing':''}">มี ${craftStock[id]||0} / ต้องการ ${n}</small></span>`).join('')}</button>`).join(''):'<p class="sheet-empty">ไม่พบสูตรคราฟทั่วไปในหมวดนี้</p>'}<div class="sheet-actions"><span>${rows.length?recipe.name:'?'}</span><button data-craft-command="prepare" ${!rows.length||!craftReady(recipe)?'disabled':''}>จัดวัสดุ</button><button data-craft-command="clear" ${!craftPrepared?'disabled':''}>นำออก</button></div></section>`;
}
