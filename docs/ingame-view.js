'use strict';
let gameMenuOpen=false,gameTab='home';
const gameTabs=['home','self-tools','items','kit','repair','teleport','field-tools','companions','world'];
const gameTabLabels={home:'Home','self-tools':'Self / Players',items:'Items',kit:'Survival Kit',repair:'Equipment',teleport:'Teleport','field-tools':'Fly',companions:'Pet',world:'World'};
function inGamePage(){
 if(gameTab!=='home'&&!hubRouteAllowed(gameTab,state.mode))gameTab='home';
 const content={home:hubHomePage,'self-tools':hubSelfToolsPage,'field-tools':hubFieldToolsPage,companions:hubCompanionsPage,kit:kitPreview,building,backpack,forest,player,world,items:()=>spawns(false),ai:()=>spawns(true),teleport,repair};
 const menu=hubMasterPreview&&hubInterfaceMode==='admin'&&gameMenuOpen&&!hubControlOpen;
 const native=hubMasterPreview&&!hubControlOpen&&hubNativeScreen!=='none';
 return heading('In-game GUI','จำลอง .80 · ไม่ใช่ภาพเกมจริงและไม่เชื่อมต่อเซฟ','INTERACTIVE MOCKUP')+`<div class="game-toolbar"><button data-hub-control>Insert · โหมด / ON–OFF</button><button data-game-open-admin ${!hubMasterPreview||hubInterfaceMode!=='admin'?'disabled':''}>Shift + R · เมนูรวม</button>${[['notebook','สมุดบันทึก'],['map','แผนที่ / Teleport'],['backpack','กระเป๋า']].map(([id,label])=>`<button data-native-screen="${id}" ${!hubMasterPreview?'disabled':''}>${label}</button>`).join('')}</div><section class="game-stage" aria-label="ตัวอย่างหน้าจอในเกม"><div class="game-canopy"></div><div class="game-trunks"></div><div class="game-ground"></div><div class="game-crosshair" aria-hidden="true">·</div><div class="game-session">GREEN HELL <small>${hubRoles[state.mode].label.toUpperCase()} / .80 PREVIEW</small></div>
 ${hubControlOpen?hubControlPanel():''}
 ${menu?`<section class="game-window" aria-label="Green Hell Mod Hub"><div class="game-title">Green Hell Mod Hub 0.4.80 <span>Insert: control · Shift + R / Esc: close</span><button data-game-menu aria-label="ปิดเมนู">×</button></div><div class="game-home-layout"><nav class="game-tabs" aria-label="แท็บเมนูในเกม">${gameTabs.map(id=>`<button data-game-tab="${id}" ${id!=='home'&&!hubRouteAllowed(id,state.mode)?'disabled aria-disabled="true"':''} aria-pressed="${gameTab===id}">${hubTranslateText(gameTabLabels[id]||id)}</button>`).join('')}${hubLanguageButtons()}</nav><div class="game-content">${hubTranslateHtml(content[gameTab]())}</div></div></section>`:''}
 ${native?`<section class="game-window native-demo"><div class="game-title">${hubNativeScreen==='map'?'แผนที่ · Teleport':hubNativeScreen==='notebook'?'สมุดบันทึก · Building':'กระเป๋า'} <button data-native-screen="none">×</button></div><div class="game-content">${hubNativeScreen==='map'?teleport():hubNativeScreen==='notebook'?hubBuilding80Page():backpack()}</div></section>`:''}
 ${hubMasterPreview&&expansionPreview.names&&state.mode!=='single'&&!menu&&!native&&!hubControlOpen?demoPeers.map(p=>`<div class="native-peer-label" style="left:${p.left}%;top:${p.top}%">${p.name}<small>${p.distance} m</small></div>`).join(''):''}
 ${!hubMasterPreview&&!hubControlOpen?'<div class="game-off-hint">Mod OFF · กด Insert เพื่อเลือกโหมดและเปิดใช้งาน</div>':''}
 <div class="game-hud"><span>${vitalIcon('HP')}100 ${vitalIcon('Energy')}100 ${hubMasterPreview&&state.toggles.god?'<b class="immortal-indicator">IMMORTAL</b>':''}</span><span><kbd>Insert</kbd> Mod control · ${hubInterfaceMode==='player'?'Player: ซ่อนเมนูรวม':'Shift + R: Admin menu'}</span><span>4.8 / ${hubMasterPreview&&state.toggles.carry?'300':'50'} kg</span></div></section><p class="shortcut-note">สถานะเว็บเป็นข้อมูลจำลอง · การติดตั้ง .80 ไม่ใช่ผลทดสอบในเกม</p>`;
}
function handleGameClick(e){
 const tab=e.target.closest('[data-game-tab]');if(tab){if(hubMasterPreview&&hubInterfaceMode==='admin'&&gameTabs.includes(tab.dataset.gameTab)&&hubRouteAllowed(tab.dataset.gameTab,state.mode)){gameTab=tab.dataset.gameTab;query='';render();}return true;}
 if(e.target.closest('[data-game-menu]')){gameMenuOpen=false;render();return true;}return false;
}
