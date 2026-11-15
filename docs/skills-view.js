'use strict';
let playerPlanSection='skills',selectedSkill='Fists',skillUndo=null;
let skillMessage='ปรับ slider ค่าดิบ หรือเลือก Level แล้วกด Apply · ข้อมูลจำลอง';
const mockSkills=window.GH_NOTEBOOK.tabs.find(t=>t.id==='NotepadSkills').pages.map(p=>({id:p.id,name:p.title.th,english:p.title.en,value:0,effect:p.elements.filter(e=>e.role==='body').map(e=>e.th).join(' ')}));
const skillDrafts=Object.fromEntries(mockSkills.map(s=>[s.id,'0']));
const skillPreviewName=skill=>hubUiLanguage==='en'?skill.english:skill.name;
const validSkillDraft=value=>String(value).trim()!==''&&Number.isFinite(Number(value))&&Number(value)>=0&&Number(value)<=100;
function previewSkillLevel(id,value){const keys=window.GH_SKILL_CURVES[id]||[];if(!keys.length)return 0;if(value>=100)return keys.length;return Math.max(0,keys.findIndex(k=>value>=k[0]&&value<k[1]));}
function previewSkillLevels(id){const keys=window.GH_SKILL_CURVES[id]||[];return [...keys.map((k,n)=>({level:n,value:k[0]})),{level:keys.length,value:100}];}
const previewCraftHistory={};
function previewSpawnDurability(id){
 const skill=mockSkills.find(s=>s.id==='Crafting').value,keys=[[0,0],[20,.2],[40,.3],[60,.4],[80,.5],[100,.5]];
 let bonus=.5;for(let n=0;n<keys.length-1;n++){const [x,y]=keys[n],[next,nextY]=keys[n+1];if(skill<next){bonus=y+(nextY-y)*(skill-x)/(next-x);break;}}
 const history=previewCraftHistory[id]||0,itemBonus=[0,.06,.12,.17,.22,.26,.30,.34,.37,.40,.42,.44,.46,.48,.50][Math.min(14,history)];
 return Math.round(Math.min(1,.15+bonus+itemBonus)*10000)/100;
}
function skillsPreview(){
 const skill=mockSkills.find(s=>s.id===selectedSkill)||mockSkills[0],draft=skillDrafts[skill.id],valid=validSkillDraft(draft),changed=valid&&Number(draft)!==skill.value;
 return `<section class="skills-preview"><div class="plan-command-heading"><h3>Skills / ทักษะตัวละคร</h3><span class="pill">.80 · จำลอง</span></div><p class="skills-caption">ลำดับและชื่อไทยตรงหน้าหนังสือเกม · ค่า 0–100 และ Level จำลองจาก progress curve ของเกม</p><div class="skills-layout"><nav class="skills-list" aria-label="เลือกทักษะ">${mockSkills.map(s=>`<button data-skill-select="${s.id}" aria-pressed="${s.id===selectedSkill}"><span>${skillPreviewName(s)}<small>${s.english}</small></span><b>${s.value}<small>Level ${previewSkillLevel(s.id,s.value)}</small></b></button>`).join('')}</nav><div class="skill-editor"><span class="eyebrow">PLAYER → SKILLS</span><h2>${skillPreviewName(skill)}</h2><p>${esc(skill.effect)}</p><div class="skill-comparison"><div><small>ค่าปัจจุบัน</small><strong>${skill.value}</strong></div><span>→</span><div><small>ค่าที่เสนอ</small><strong id="skill-proposed">${valid?Number(draft):'—'}</strong></div></div><label for="skill-range">ค่าดิบ 0–100</label><input id="skill-range" type="range" min="0" max="100" step="0.01" value="${valid?draft:skill.value}" data-skill-value="range"><label for="skill-number">กรอกค่า รองรับทศนิยม</label><input id="skill-number" type="number" min="0" max="100" step="any" value="${esc(draft)}" data-skill-value="number"><div class="skill-presets" aria-label="เลือกระดับทักษะ">${previewSkillLevels(skill.id).map(k=>`<button data-skill-level="${k.level}" aria-pressed="${valid&&previewSkillLevel(skill.id,Number(draft))===k.level}">Level ${k.level}</button>`).join('')}</div><div class="action-group"><button id="skill-apply" class="primary" data-skill-command="apply" ${!changed?'disabled':''}>Apply · ใช้ค่าจำลอง</button><button data-skill-command="cancel">ยกเลิก</button><button data-skill-command="undo" ${!skillUndo?'disabled':''}>Undo</button></div><p id="skill-feedback" role="status">${esc(skillMessage)}</p></div></div><div class="notice">ไม่เชื่อมเกมหรือเซฟ · ของเสกจำลองอิง Crafting / ประวัติคราฟตัวอย่าง โดยไม่เพิ่มทักษะหรือจำนวนครั้งคราฟเอง</div></section>`;
}
function handleSkillInput(e){
 if(!e.target.dataset?.skillValue)return false;
 const value=e.target.value,valid=validSkillDraft(value),skill=mockSkills.find(s=>s.id===selectedSkill);skillDrafts[selectedSkill]=value;
 document.getElementById('skill-proposed').textContent=valid?String(Number(value)):'—';document.getElementById('skill-apply').disabled=!valid||Number(value)===skill.value;
 const mirror=document.getElementById(e.target.dataset.skillValue==='range'?'skill-number':'skill-range');if(valid)mirror.value=value;
 skillMessage=valid?'ค่าปัจจุบันยังไม่เปลี่ยนจนกด Apply':'กรุณาระบุค่าระหว่าง 0–100';document.getElementById('skill-feedback').textContent=skillMessage;return true;
}
function handleSkillClick(e){
 const section=e.target.closest('[data-player-section]');if(section){playerPlanSection=section.dataset.playerSection==='skills'?'skills':'overview';render();return true;}
 const choice=e.target.closest('[data-skill-select]');if(choice){if(mockSkills.some(s=>s.id===choice.dataset.skillSelect))selectedSkill=choice.dataset.skillSelect;render();return true;}
 const level=e.target.closest('[data-skill-level]');if(level){const target=previewSkillLevels(selectedSkill).find(k=>k.level===Number(level.dataset.skillLevel));if(target)skillDrafts[selectedSkill]=String(target.value);render();return true;}
 const command=e.target.closest('[data-skill-command]');if(!command)return false;
 const skill=mockSkills.find(s=>s.id===selectedSkill),draft=skillDrafts[selectedSkill];
 switch(command.dataset.skillCommand){
  case 'apply':if(!validSkillDraft(draft)){skillMessage='กรุณาระบุค่าระหว่าง 0–100';break;}if(Number(draft)===skill.value)break;skillUndo={id:skill.id,value:skill.value};skill.value=Number(draft);skillMessage=`${skill.name}: ${skillUndo.value} → ${skill.value} (Level ${previewSkillLevel(skill.id,skill.value)}) · จำลอง`;break;
  case 'cancel':skillDrafts[skill.id]=String(skill.value);skillMessage='ยกเลิกค่าที่เสนอแล้ว';break;
  case 'undo':if(skillUndo){const old=mockSkills.find(s=>s.id===skillUndo.id);old.value=skillUndo.value;skillDrafts[old.id]=String(old.value);selectedSkill=old.id;skillUndo=null;skillMessage='คืนค่าก่อน Apply ล่าสุดแล้ว';}break;
 }render();return true;
}
