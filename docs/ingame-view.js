'use strict';
let gameMenuOpen=true, gameTab='home';
const gameTabs=['home','self-tools','items','kit','repair','teleport','field-tools','companions','world'];
const gameTabLabels={home:'Home','self-tools':'Self / Players',items:'Items',kit:'Survival Kit',repair:'Equipment',teleport:'Teleport','field-tools':'Travel / Tools',companions:'Pet',world:'World'};
function inGamePage(){
 if(gameTab!=='home'&&!hubRouteAllowed(gameTab,state.mode))gameTab='home';
 const content={home:hubHomePage,'self-tools':hubSelfToolsPage,'field-tools':hubFieldToolsPage,companions:hubCompanionsPage,kit:kitPreview,building,backpack,forest,player,world,items:()=>spawns(false),ai:()=>spawns(true),teleport,repair};
 return heading('In-game GUI','จำลองหน้าต่าง Hub ที่ลอยทับฉากเกม · ใช้สถานะร่วมกับ Dashboard','INTERACTIVE MOCKUP')+`
 <div class="game-toolbar"><span>ฉากป่าจำลอง · ไม่ใช่ภาพจากเกม</span><button data-game-menu>${gameMenuOpen?'ซ่อน':'เปิด'}เมนู <kbd>Insert</kbd></button></div>
 <section class="game-stage" aria-label="ตัวอย่างหน้าจอในเกม"><div class="game-canopy"></div><div class="game-trunks"></div><div class="game-ground"></div><div class="game-crosshair" aria-hidden="true">·</div>
 <div class="game-session">GREEN HELL <small>${hubRoles[state.mode].label.toUpperCase()} / PREVIEW</small></div>
 ${gameMenuOpen?`<section class="game-window" aria-label="Green Hell Mod Hub"><div class="game-title">Green Hell Mod Hub 0.4.61 <span>Insert / Esc to close</span><button data-game-menu aria-label="ปิดเมนู">×</button></div><div class="game-home-layout"><nav class="game-tabs" aria-label="แท็บเมนูในเกม">${gameTabs.filter(id=>id==='home'||hubRouteAllowed(id,state.mode)).map(id=>`<button data-game-tab="${id}" aria-pressed="${gameTab===id}" class="${gameTab===id?'selected':''}">${hubTranslateText(gameTabLabels[id]||id)}</button>`).join('')}${hubLanguageButtons()}</nav><div class="game-content">${hubTranslateHtml(content[gameTab]())}</div></div><div class="game-status"><span>${esc(logs[0]?.text||'Ready. Insert opens this menu.')} · จำลอง</span><button data-game-menu>Close</button></div></section>`:`<button class="game-open" data-game-menu>เปิด Admin Hub <kbd>Insert</kbd></button>`}
 <div class="game-hud"><span>♡ 100 &nbsp; ◇ 100 &nbsp; ♧ 100 ${state.toggles.god?'<b class="immortal-indicator" aria-label="Immortal Mode active"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="vertical-align:middle"><path d="M12 2 21 5v6c0 5-5 9-9 11-4-2-9-6-9-11V5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2"/></svg> IMMORTAL</b>':''}</span><span><kbd>N</kbd> Notebook &nbsp; <kbd>Insert</kbd> Admin Hub</span><span>4.8 / ${state.toggles.carry?'300':'50'} kg</span></div></section><p class="shortcut-note">สลับแท็บ เปิด–ปิดฟีเจอร์ ซ่อมอาวุธ และทดลองบันทึกจุดวาร์ปได้ ข้อมูลเป็นตัวอย่างบนเว็บ</p>`;
}
function handleGameClick(e){
 const tab=e.target.closest('[data-game-tab]');
 if(tab){if(gameTabs.includes(tab.dataset.gameTab)){gameTab=tab.dataset.gameTab;query='';render();}return true;}
 if(e.target.closest('[data-game-menu]')){gameMenuOpen=!gameMenuOpen;render();return true;}
 return false;
}
