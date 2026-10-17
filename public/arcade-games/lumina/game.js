'use strict';
(() => {
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),overlay=document.querySelector('#overlay'),status=document.querySelector('#status');
const game=new ForestGame(),W=FOREST_WIDTH,H=FOREST_HEIGHT,keys=new Set(),art={};let last=0,accumulator=0,lastMode='',aim=null,sound=false,audio,oldShots=0,oldKills=0,loaded=0;
function round(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function text(t,x,y,size,color='#f2f6e9',align='left'){ctx.fillStyle=color;ctx.font=`500 ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(t,x,y);ctx.textAlign='left';}
function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
function diamond(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r*.65,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.65,y);ctx.closePath();ctx.fill();}
function tone(freq,duration=.06){if(!sound||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.6,audio.currentTime+duration);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}
function input(){return {left:keys.has('KeyA')||keys.has('ArrowLeft'),right:keys.has('KeyD')||keys.has('ArrowRight'),up:keys.has('KeyW')||keys.has('ArrowUp'),down:keys.has('KeyS')||keys.has('ArrowDown'),aim};}
function dash(){const i=input();if(game.dash(Number(i.right)-Number(i.left),Number(i.down)-Number(i.up)))tone(240,.16);}
function start(){if(loaded<2)return;game.start();keys.clear();lastMode='';canvas.focus();if(audio)audio.resume();syncUI();}
function reset(){game.reset();keys.clear();aim=null;oldKills=0;oldShots=0;lastMode='';syncUI();}
function syncUI(){if(lastMode===game.mode)return;lastMode=game.mode;const mode=game.mode;overlay.classList.toggle('hidden',mode==='playing');const heading=document.querySelector('#heading'),description=document.querySelector('#description'),chapter=document.querySelector('#chapter'),button=document.querySelector('#start'),hint=document.querySelector('#hint');
 if(mode==='ready'){chapter.textContent='CHAPTER 01 / THE AWAKENING';heading.textContent='小さな光の、大きな冒険。';description.innerHTML='あなたは森に迷い込んだ、小さな魔法使い。<br>魔物を倒して8つの光の結晶を集め、<br>眠れる守護者を闇から解き放とう。';button.textContent='森へ旅立つ →';hint.textContent='WASD / 矢印で移動 · 魔法は自動 · Spaceで回避';status.textContent='ロドリンとエイリスの、新しい冒険。';}
 if(mode==='paused'){chapter.textContent='TAKE A LITTLE BREATH';heading.textContent='森も、ひと休み。';description.textContent='準備ができたら、冒険の続きを。';button.textContent='冒険を再開 →';hint.textContent='Pキーでも再開できます';status.textContent='一時停止中。別ウィンドウへ移動したときも自動で停止します。';}
 if(mode==='won'){chapter.textContent='THE FOREST REMEMBERS YOU';heading.textContent='森に、ふたたび光が灯った。';description.textContent=`守護者は闇から解き放たれた。ありがとう、小さな魔法使い。 討伐 ${game.kills}体 / 結晶 ${game.collected}個 / ${game.time.toFixed(1)}秒`;button.textContent='もう一度、森へ →';hint.textContent='RODORIN × AILIS · 最初の魔法の記録';status.textContent='クリア！ おめでとう、ロドリン！';tone(880,.4);}
 if(mode==='lost'){chapter.textContent='EVERY LIGHT CAN RETURN';heading.textContent='光は、まだ消えない。';description.textContent=`集めた結晶 ${game.collected}個 / 討伐 ${game.kills}体。 走り続けて距離をとり、ダッシュで魔法弾を抜けよう。`;button.textContent='もう一度、挑戦する →';hint.textContent='Rキーでもリトライできます';status.textContent='リトライできます。結晶で少し回復、守護者登場時にも回復します。';}
 if(mode==='playing')status.textContent=game.bossSpawned?'守護者の魔法弾に注意！ ダッシュで回避しよう。':'結晶を8個集めよう。魔法は近くの敵に自動で発射されます。';
}
function draw(){const t=game.time,p=game.player;
ctx.fillStyle='#142e27';ctx.fillRect(0,0,W,H);if(art.forest){ctx.drawImage(art.forest,0,0,W,H);}ctx.fillStyle='rgba(4,24,22,.44)';ctx.fillRect(0,0,W,H);
const shade=ctx.createRadialGradient(W/2,H/2,100,W/2,H/2,760);shade.addColorStop(0,'#15382c18');shade.addColorStop(1,'#02110bdc');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
// Deliberately faint arena lines preserve background art without hiding projectiles.
ctx.strokeStyle='#a3e9c30c';ctx.lineWidth=1;for(let x=40;x<W;x+=80){ctx.beginPath();ctx.moveTo(x,80);ctx.lineTo(x,H-20);ctx.stroke();}for(let y=80;y<H;y+=80){ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-20,y);ctx.stroke();}
ctx.strokeStyle='#a5e4ba35';ctx.strokeRect(25,80,W-50,H-105);
for(let i=0;i<36;i++){const x=(i*173.7+Math.sin(t*.4+i)*22)%W,y=90+(i*127.1+Math.cos(t*.5+i)*20)%(H-130);glow(x,y,13,'#c5ffc026');ctx.fillStyle='#c5f0aa';ctx.globalAlpha=.2+(Math.sin(t*2+i)+1)*.18;ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
for(const s of game.shards){glow(s.x,s.y,28,'#92ffcb50');diamond(s.x,s.y+Math.sin(t*4+s.x)*3,11,'#a4ffe0');diamond(s.x-2,s.y-2,5,'#edfff1');}
for(const e of game.enemies){const bob=Math.sin(t*4+e.id)*3;ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(e.x,e.y+e.r*.7,e.r*.9,e.r*.4,0,0,Math.PI*2);ctx.fill();
 if(e.boss){glow(e.x,e.y,100,'#92ffcf45');ctx.save();ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.clip();if(art.guardian)ctx.drawImage(art.guardian,e.x-e.r,e.y-e.r,e.r*2,e.r*2);else round(e.x-e.r,e.y-e.r,e.r*2,e.r*2,40,'#9ebd8d');ctx.restore();ctx.strokeStyle=e.flash?'#fff':'#f6d594';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.stroke();for(let i=0;i<4;i++){const a=t+i*Math.PI/2;diamond(e.x+Math.cos(a)*61,e.y+Math.sin(a)*61,6,'#e9dda0');}}
 else {glow(e.x,e.y,33,'#bb8eff23');ctx.fillStyle=e.flash?'#fff5ed':'#987dc6';ctx.beginPath();ctx.moveTo(e.x-18,e.y+12);ctx.quadraticCurveTo(e.x-20,e.y-24+bob,e.x,e.y-24+bob);ctx.quadraticCurveTo(e.x+20,e.y-24+bob,e.x+18,e.y+12);ctx.lineTo(e.x+9,e.y+6);ctx.lineTo(e.x,e.y+15);ctx.lineTo(e.x-9,e.y+6);ctx.closePath();ctx.fill();round(e.x-10,e.y-7+bob,6,8,2,'#e7ffe2');round(e.x+4,e.y-7+bob,6,8,2,'#e7ffe2');}
 if(!e.boss&&e.hp<e.maxHp){round(e.x-20,e.y-34,40,4,2,'#132821');round(e.x-20,e.y-34,40*e.hp/e.maxHp,4,2,'#b8eed3');}}
for(const b of game.bullets){glow(b.x,b.y,22,'#9bffe97a');ctx.fillStyle='#e0fff3';ctx.beginPath();ctx.arc(b.x,b.y,5,0,Math.PI*2);ctx.fill();}
for(const b of game.hostile){glow(b.x,b.y,20,'#ffb77f50');diamond(b.x,b.y,9,'#ffd39a');}
// Canvas-drawn explorer, with a cloak, hat, staff, and readable silhouette.
ctx.save();ctx.translate(p.x,p.y);if(p.inv>0&&Math.floor(t*18)%2===0)ctx.globalAlpha=.5;glow(0,0,p.dash>0?64:42,'#8beccc48');ctx.fillStyle='#0007';ctx.beginPath();ctx.ellipse(0,19,19,8,0,0,Math.PI*2);ctx.fill();if(p.dash>0){ctx.strokeStyle='#a7ffe6';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-p.dx*18,-p.dy*18);ctx.lineTo(-p.dx*56,-p.dy*56);ctx.stroke();}round(-9,13,7,9,2,'#c4d7b9');round(3,13,7,9,2,'#c4d7b9');ctx.fillStyle='#93d7bb';ctx.beginPath();ctx.moveTo(0,-9);ctx.quadraticCurveTo(-18,0,-19,16);ctx.quadraticCurveTo(0,26,19,16);ctx.quadraticCurveTo(16,0,0,-9);ctx.fill();round(-10,-16,20,22,8,'#f2d9b4');round(-11,-15,22,8,3,'#dddcc1');ctx.fillStyle='#284e53';ctx.beginPath();ctx.moveTo(-20,-11);ctx.lineTo(-5,-42);ctx.lineTo(6,-26);ctx.lineTo(18,-13);ctx.closePath();ctx.fill();ctx.strokeStyle='#e8ca8c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-16,-14);ctx.lineTo(15,-14);ctx.stroke();round(-3,-5,3,4,1,'#294440');round(4,-5,3,4,1,'#294440');ctx.strokeStyle='#d3b480';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(20,15);ctx.lineTo(25,-20);ctx.stroke();glow(25,-22,16,'#b4ffe294');diamond(25,-22,7,'#d4ffe9');ctx.restore();
for(const q of game.particles){ctx.globalAlpha=Math.max(0,Math.min(1,q.life*2));ctx.fillStyle=q.color;ctx.fillRect(q.x,q.y,4,4);}ctx.globalAlpha=1;
round(22,17,260,48,10,'#071d19dd');text('LIFE',38,47,11,'#9dc5b4');round(83,34,150,10,5,'#29423a');round(83,34,150*p.hp/100,10,5,p.hp<30?'#ef9aa7':'#a6e6bb');text(String(p.hp),243,47,13,'#e4efdb');
round(296,17,244,48,10,'#071d19dd');diamond(318,41,9,'#b7efd6');text(`光の結晶  ${Math.min(game.collected,8)} / 8`,339,47,16,'#d9efdb');
round(W-197,17,175,48,10,'#071d19dd');text('✦ '+game.time.toFixed(1)+' s',W-110,47,17,'#d9e7cc','center');
round(22,H-52,180,30,8,'#071d19c9');text(p.cooldown>0?`回避  ${p.cooldown.toFixed(1)}s`:'SPACE  回避できます',36,H-32,12,p.cooldown>0?'#86a99a':'#bbeed1');
text(`討伐 ${game.kills}`,W-32,H-32,14,'#b5d4ba','right');
const boss=game.enemies.find(e=>e.boss);if(boss){round(340,H-65,600,48,10,'#071d19e0');text('THE HOLLOW GUARDIAN / 森の守護者',640,H-47,11,'#ecd9b0','center');round(360,H-37,560,7,3,'#3f4432');round(360,H-37,560*Math.max(0,boss.hp)/boss.maxHp,7,3,'#ead397');}
if(game.messageTime>0&&game.mode==='playing'){round(300,88,680,37,10,'#08221bd9');text(game.message,640,112,15,'#e9efcb','center');}
}
function frame(now){if(last)accumulator+=Math.min((now-last)/1000,.1);last=now;while(accumulator>=1/120){game.update(1/120,input());accumulator-=1/120;}if(game.bullets.length>oldShots)tone(650);if(game.kills>oldKills)tone(400,.12);oldShots=game.bullets.length;oldKills=game.kills;syncUI();draw();requestAnimationFrame(frame);}
document.querySelector('#start').addEventListener('click',start);document.querySelector('#restart').addEventListener('click',reset);
document.querySelector('#sound').addEventListener('click',()=>{try{if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();audio.resume();sound=!sound;document.querySelector('#sound').textContent=sound?'♫ 音 ON':'♫ 音 OFF';document.querySelector('#sound').setAttribute('aria-pressed',String(sound));tone(660,.12);}catch{status.textContent='このブラウザーでは効果音を利用できません。';}});
const accepted=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyP','KeyR'];
window.addEventListener('keydown',e=>{if(!accepted.includes(e.code))return;e.preventDefault();if(e.repeat&&['Space','KeyP','KeyR'].includes(e.code))return;if(e.code==='KeyP'){game.pause();keys.clear();}else if(e.code==='KeyR'){reset();start();}else if(e.code==='Space')dash();else keys.add(e.code);syncUI();});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();aim=null;if(game.mode==='playing')game.pause();syncUI();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();aim=null;if(game.mode==='playing')game.pause();syncUI();}});
function pointer(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
canvas.addEventListener('pointerdown',e=>{if(game.mode!=='playing')return;canvas.setPointerCapture(e.pointerId);aim=pointer(e);canvas.focus();});canvas.addEventListener('pointermove',e=>{if(aim)aim=pointer(e);});for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>aim=null);
for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>keys.delete(b.dataset.key));}
document.querySelector('#dash-touch').addEventListener('pointerdown',e=>{e.preventDefault();dash();});
document.querySelector('#start').disabled=true;
Promise.all(['forest','guardian'].map(name=>new Promise(resolve=>{const im=new Image();im.onload=()=>{art[name]=im;loaded++;resolve();};im.onerror=()=>resolve();im.src=`assets/${name}.png`;}))).then(()=>{document.querySelector('#loading').hidden=true;document.querySelector('#asset-status').textContent=`ComfyUI生成画像 ${loaded}/2 読み込み済み`;document.querySelector('#start').disabled=loaded<2;if(loaded<2){document.querySelector('#loading').hidden=false;document.querySelector('#loading').textContent='画像が不足しています。assetsを確認して再読み込みしてください。';}});
window.luminaState=()=>({...game.snapshot(),assetsLoaded:loaded});
syncUI();requestAnimationFrame(frame);
})();
