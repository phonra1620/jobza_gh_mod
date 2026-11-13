'use strict';
let playerPlanSection='skills', selectedSkill='blades', skillUndo=null;
let skillMessage='เลือกทักษะและปรับค่า แล้วกด Apply เพื่อทดลอง';
const mockSkills=[
 {id:'blades',name:'มีด',english:'Blades',value:32,effect:'ตัวอย่างหมวดทักษะใช้อาวุธมีคม'},
 {id:'axes',name:'ขวาน',english:'Axes',value:24,effect:'ตัวอย่างหมวดทักษะใช้ขวาน'},
 {id:'spears',name:'หอก',english:'Spears',value:18,effect:'ตัวอย่างหมวดทักษะใช้หอก'},
 {id:'archery',name:'ธนู',english:'Archery',value:12,effect:'ตัวอย่างหมวดทักษะใช้ธนู'},
 {id:'throwing',name:'การขว้าง',english:'Throwing',value:8,effect:'ตัวอย่างหมวดทักษะการขว้าง'},
 {id:'fists',name:'มือเปล่า',english:'Fists',value:5,effect:'ตัวอย่างหมวดทักษะต่อสู้มือเปล่า'},
 {id:'crafting',name:'การคราฟ',english:'Crafting',value:41,effect:'ความชำนาญในการสร้างอุปกรณ์ เกี่ยวข้องกับความทนทานที่สร้างได้'},
 {id:'cooking',name:'ทำอาหาร',english:'Cooking',value:16,effect:'ตัวอย่างหมวดทักษะทำอาหาร'}
];
const skillDrafts=Object.fromEntries(mockSkills.map(s=>[s.id,String(s.value)]));
const validSkillDraft=value=>String(value).trim()!==''&&Number.isInteger(Number(value))&&Number(value)>=0&&Number(value)<=100;
function skillsPreview(){
 const skill=mockSkills.find(s=>s.id===selectedSkill),draft=skillDrafts[skill.id];
 const valid=validSkillDraft(draft),changed=valid&&Number(draft)!==skill.value;
 return `<section class="skills-preview"><div class="plan-command-heading"><h3>Skills / ทักษะตัวละคร</h3><span class="pill">MOCK DATA · ตัวเอง</span></div><p class="skills-caption">ค่า 0–100 เป็นตัวอย่าง ไม่ใช่เลเวลอาวุธ · ชื่อไทยเพื่อออกแบบ ยังไม่ใช่ชื่อที่ดึงจากเกม</p><div class="skills-layout"><nav class="skills-list" aria-label="เลือกทักษะ">${mockSkills.map(s=>`<button data-skill-select="${s.id}" aria-pressed="${s.id===selectedSkill}"><span>${s.name}<small>${s.english}</small></span><b>${s.value}</b></button>`).join('')}</nav><div class="skill-editor"><span class="eyebrow">PLAYER → SKILLS</span><h2>${skill.name}</h2><p>${skill.effect}</p><div class="skill-comparison"><div><small>ค่าปัจจุบัน</small><strong>${skill.value}</strong></div><span>→</span><div><small>ค่าที่เสนอ</small><strong id="skill-proposed">${valid?Number(draft):'—'}</strong></div></div><label for="skill-range">ปรับค่าทักษะ <span>0–100</span></label><input id="skill-range" type="range" min="0" max="100" step="1" value="${valid?Number(draft):skill.value}" data-skill-value="range"><label for="skill-number">หรือระบุค่า</label><input id="skill-number" type="number" min="0" max="100" step="1" inputmode="numeric" value="${esc(draft)}" data-skill-value="number"><div class="skill-presets">${[0,25,50,75,100].map(n=>`<button data-skill-preset="${n}">${n}</button>`).join('')}</div><div class="action-group"><button id="skill-apply" class="primary" data-skill-command="apply" ${!changed?'disabled':''}>Apply · ใช้ค่าจำลอง</button><button data-skill-command="cancel">ยกเลิกการปรับ</button></div><button class="text-button" data-skill-command="undo" ${!skillUndo?'disabled':''}>↶ คืนค่าก่อน Apply ล่าสุด</button><p id="skill-feedback" role="status" aria-live="polite">${esc(skillMessage)}</p></div></div><div class="notice">Apply เปลี่ยนเฉพาะข้อมูลตัวอย่างหน้านี้ ไม่แก้ Skill หรือเซฟในเกม ค่าจะหายเมื่อรีโหลด ไม่มีการคำนวณโบนัสโจมตีหรือ Level จริงใน mockup นี้</div></section>`;
}
function handleSkillInput(e){
 if(!e.target.dataset?.skillValue)return false;
 const value=e.target.value;
 skillDrafts[selectedSkill]=value;
 const valid=validSkillDraft(value),skill=mockSkills.find(s=>s.id===selectedSkill);
 document.getElementById('skill-proposed').textContent=valid?String(Number(value)):'—';
 document.getElementById('skill-apply').disabled=!valid||Number(value)===skill.value;
 const mirror=document.getElementById(e.target.dataset.skillValue==='range'?'skill-number':'skill-range');
 if(valid)mirror.value=value;
 skillMessage=valid?'ยังไม่เปลี่ยนค่าปัจจุบัน กด Apply เพื่อใช้ค่าใหม่':'กรุณาระบุจำนวนเต็ม 0–100';
 document.getElementById('skill-feedback').textContent=skillMessage;
 return true;
}
function handleSkillClick(e){
 const section=e.target.closest('[data-player-section]');
 if(section){playerPlanSection=section.dataset.playerSection==='skills'?'skills':'overview';render();return true;}
 const choice=e.target.closest('[data-skill-select]');
 if(choice){if(mockSkills.some(s=>s.id===choice.dataset.skillSelect)){selectedSkill=choice.dataset.skillSelect;skillMessage='ค่าปัจจุบันยังไม่เปลี่ยนจนกว่าจะกด Apply';render();}return true;}
 const preset=e.target.closest('[data-skill-preset]');
 if(preset){if(validSkillDraft(preset.dataset.skillPreset)){skillDrafts[selectedSkill]=preset.dataset.skillPreset;skillMessage='เลือกค่าที่เสนอแล้ว ยังไม่ได้ Apply';render();}return true;}
 const command=e.target.closest('[data-skill-command]');
 if(!command)return false;
 const skill=mockSkills.find(s=>s.id===selectedSkill),draft=skillDrafts[selectedSkill];
 switch(command.dataset.skillCommand){
  case 'apply':if(!validSkillDraft(draft)){skillMessage='กรุณาระบุจำนวนเต็ม 0–100';break;}if(Number(draft)===skill.value)break;skillUndo={id:skill.id,value:skill.value};skill.value=Number(draft);skillMessage=`จำลอง: ${skill.name} ${skillUndo.value} → ${skill.value} เรียบร้อย`;break;
  case 'cancel':skillDrafts[skill.id]=String(skill.value);skillMessage='ยกเลิกค่าที่เสนอแล้ว';break;
  case 'undo':if(skillUndo){const previous=mockSkills.find(s=>s.id===skillUndo.id);previous.value=skillUndo.value;skillDrafts[previous.id]=String(previous.value);selectedSkill=previous.id;skillUndo=null;skillMessage='คืนค่าก่อน Apply ล่าสุดแล้ว (จำลอง)';}break;
 }
 render();return true;
}
