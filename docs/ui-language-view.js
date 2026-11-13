'use strict';
let hubUiLanguage='en';
try{hubUiLanguage=localStorage.getItem('gh-hub-ui-language')==='th'?'th':'en';}catch{}
function hubTranslateText(value){
 const original={...(window.GH_UI_LANGUAGE||{}),
  'Locked in this mode':'ใช้ไม่ได้ในโหมดนี้',
  'In wall':'In wall · ทะลุวัตถุ','Invisible':'Invisible · ซ่อนตัว','Ignore me':'Ignore me · AI มองข้าม',
  'Pass through objects while flying; exit to checked clear ground':'ทะลุวัตถุขณะบิน เมื่อออกจะย้ายไปพื้นว่างที่ตรวจแล้ว',
  'Hide body and name; AI ignores you':'ซ่อนร่างและชื่อ พร้อมให้ AI มองข้ามเรา',
  'AI ignores you; friends still see you':'AI มองข้ามเรา เพื่อนยังเห็นตามปกติ',
  'Frequently used':'ใช้งานบ่อย','Restore my status':'ฟื้นสถานะตัวเรา','Treat my conditions':'รักษาอาการตัวเรา','Survival kit':'ชุดเอาตัวรอด','Find items':'ค้นหาไอเทม','Repair equipment':'ซ่อมอุปกรณ์','Teleport / visit friends':'เดินทาง / ไปหาเพื่อน','Fly / map / arrows':'บิน / แผนที่ / เก็บธนู','My skills':'ทักษะตัวเรา',
  'HP / energy / water and nutrients':'HP · พลังงาน · น้ำและสารอาหาร','Wounds and diseases / Doctors':'แผลและโรค · เปิดหน้า Doctors','Food, water and equipment':'อาหาร น้ำ และอุปกรณ์พร้อมใช้','Search names / add to backpack':'ค้นชื่อ แล้วเพิ่มของเข้ากระเป๋า','My weapons, tools and armor':'อาวุธ เครื่องมือ และเกราะของเรา','Saved places, game locations and players':'จุดที่บันทึก สถานที่ และผู้เล่น','i_can_fly / names / exploration tools':'i_can_fly · ชื่อเพื่อน · เครื่องมือสำรวจ','Toggle follower / removed on save':'เปิด–ปิดผู้ติดตาม · นำออกเมื่อเซฟ','Host world controls':'เครื่องมือจัดการโลกของ Host','View / change skill levels':'ดูและปรับระดับ Skills',
  'Open controls':'เปิดหน้าควบคุม','Start with what you need now':'เริ่มจากสิ่งที่ต้องใช้ตอนนี้','Open the page, then choose an action':'เปิดหน้าควบคุมก่อน จึงเลือกคำสั่ง','Scope of this mode':'ขอบเขตโหมดนี้','Common shortcuts':'ปุ่มที่หยิบบ่อย','Preview / no game connection':'ตัวอย่างหน้าตา · ไม่เชื่อมกับเกม','Open / close menu':'เปิด / ปิดเมนู','Aimed blueprint':'แปลนที่เล็ง','Enter / exit flight':'เข้า / ออกจากการบิน','My survival and exploration tools':'ดูแลตัวเอง แล้วออกสำรวจ','Ready to play with friends':'พร้อมเล่นกับเพื่อน ดูแลห้องได้สะดวก','My tools in a friend\'s session':'เครื่องมือของเรา ใช้ในห้องของเพื่อน',
  'I host the session':'เราเปิดห้อง','I join a friend':'เราเข้าห้องเพื่อน','Look after yourself, supplies and followers':'ของใช้ ฟื้นสถานะ ซ่อมอุปกรณ์ และผู้ช่วยในโลกของเรา','Find friends, prepare kits and manage the world':'เดินทางหาเพื่อน เตรียมชุดของ และเข้าถึงเครื่องมือจัดการโลก','My status, backpack and travel; no Host world edits':'ดูแลตัวเรา เติมของเข้ากระเป๋า และเดินทาง โดยไม่แก้โลกของ Host'
 },dictionary=hubUiLanguage==='th'?original:Object.fromEntries(Object.entries(original).map(([en,th])=>[th,en]));
 if(dictionary[value])return dictionary[value];
 const trimmed=value.trim();if(dictionary[trimmed])return value.replace(trimmed,dictionary[trimmed]);
 return value;
}
function hubTranslateHtml(html){return html.replace(/>([^<>]+)</g,(_,text)=>{const translated=hubTranslateText(text);return '>'+(translated===text?text:esc(translated))+'<';});}
function hubLanguageButtons(){return `<div class="hub-language-buttons" role="group" aria-label="Mod UI language"><button data-hub-language="en" aria-pressed="${hubUiLanguage==='en'}">EN</button><button data-hub-language="th" aria-pressed="${hubUiLanguage==='th'}">TH</button></div>`;}
function handleHubLanguageClick(event){const button=event.target.closest('[data-hub-language]');if(!button)return false;const lang=button.dataset.hubLanguage;if(!['en','th'].includes(lang))return true;hubUiLanguage=lang;try{localStorage.setItem('gh-hub-ui-language',lang);}catch{}render();return true;}
