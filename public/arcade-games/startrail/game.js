'use strict';
(() => {
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),status=document.querySelector('#status');
const W=960,H=540,world=3650,keys=new Set();
const platforms=[{x:0,y:450,w:620,h:120},{x:740,y:450,w:490,h:120},{x:1370,y:450,w:530,h:120},{x:2040,y:450,w:470,h:120},{x:2650,y:450,w:1000,h:120},
{x:260,y:350,w:140,h:20},{x:470,y:275,w:130,h:20},{x:820,y:340,w:170,h:20},{x:1080,y:270,w:130,h:20},{x:1450,y:345,w:170,h:20},{x:1730,y:265,w:140,h:20},{x:2140,y:335,w:160,h:20},{x:2390,y:260,w:140,h:20},{x:2770,y:340,w:170,h:20},{x:3050,y:270,w:180,h:20}];
const starSpots=[[190,410],[320,312],[520,237],[870,302],[1140,232],[1490,307],[1790,227],[2190,297],[2450,222],[2830,302],[3130,232],[3370,405]];
let p,stars,enemies,particles,camera,elapsed,mode,previous=0,accumulator=0,deaths=0;
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function reset(){p={x:65,y:400,w:28,h:38,vx:0,vy:0,jumps:0,ground:false,inv:0,hp:3,face:1,coyote:0,buffer:0};stars=starSpots.map(([x,y])=>({x,y,taken:false}));enemies=[{x:920,y:422,w:34,h:28,left:770,right:1180,dir:1},{x:1570,y:422,w:34,h:28,left:1400,right:1840,dir:-1},{x:2200,y:422,w:34,h:28,left:2080,right:2450,dir:1},{x:2910,y:422,w:34,h:28,left:2700,right:3220,dir:-1}];particles=[];camera=0;elapsed=0;mode='ready';accumulator=0;deaths=0;keys.clear();status.textContent='画面をクリック、または移動キーでスタート！';}
function burst(x,y,color){for(let i=0;i<14;i++)particles.push({x,y,vx:(Math.random()-.5)*250,vy:(Math.random()-.7)*240,t:.6,color});}
function jump(){p.buffer=.14;}
function damage(fall=false){if(p.inv>0&&!fall)return;p.hp--;burst(p.x,p.y,'#ff8fac');if(p.hp<=0){mode='lost';status.textContent='もう一度！ Rキーでリトライ';return;}p.inv=1.5;if(fall){deaths++;p.x=65;p.y=390;p.vx=0;p.vy=0;p.jumps=0;}else{p.vy=-300;p.vx=-p.face*240;}}
function step(dt){if(mode!=='playing')return;elapsed+=dt;p.inv=Math.max(0,p.inv-dt);p.buffer=Math.max(0,p.buffer-dt);p.coyote=Math.max(0,p.coyote-dt);
const axis=Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA'));
p.vx+=(axis*285-p.vx)*Math.min(1,dt*(p.inv>1.25?3:15));if(axis)p.face=axis;
if(p.buffer>0&&(p.jumps<2||p.coyote>0)){p.vy=-490;p.jumps=p.coyote>0?1:p.jumps+1;p.coyote=0;p.ground=false;p.buffer=0;burst(p.x+14,p.y+38,'#82f4df');}
p.vy=Math.min(760,p.vy+1250*dt);p.x+=p.vx*dt;p.x=Math.max(0,Math.min(world-p.w,p.x));
for(const b of platforms)if(overlap(p,b)){if(p.vx>0)p.x=b.x-p.w;else if(p.vx<0)p.x=b.x+b.w;}
const oldBottom=p.y+p.h;p.y+=p.vy*dt;p.ground=false;
for(const b of platforms)if(overlap(p,b)){if(p.vy>=0&&oldBottom<=b.y+1){p.y=b.y-p.h;p.vy=0;p.ground=true;p.jumps=0;p.coyote=.1;}else if(p.vy<0){p.y=b.y+b.h;p.vy=0;}}
if(p.y>H+100)damage(true);
for(const s of stars)if(!s.taken&&Math.hypot(p.x+14-s.x,p.y+19-s.y)<34){s.taken=true;burst(s.x,s.y,'#ffe29a');}
for(const e of enemies){if(e.dead)continue;e.x+=e.dir*65*dt;if(e.x<e.left||e.x+e.w>e.right)e.dir*=-1;if(overlap(p,e)){if(p.vy>0&&oldBottom<=e.y+13){e.dead=true;p.vy=-360;p.jumps=Math.min(p.jumps,1);burst(e.x+17,e.y,'#ce9bff');}else damage();}}
for(const q of particles){q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=450*dt;}particles=particles.filter(q=>q.t>0);
camera+=(Math.max(0,Math.min(world-W,p.x-W*.33))-camera)*Math.min(1,dt*7);
if(p.x>3500&&mode==='playing'){mode='won';burst(p.x,p.y,'#ffe29a');status.textContent=`クリア！ 星 ${stars.filter(s=>s.taken).length}/12 ・ ${elapsed.toFixed(1)}秒　Rで再挑戦`;}}
function round(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function text(t,x,y,size,color='#eef5ff',align='left'){ctx.fillStyle=color;ctx.font=`600 ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(t,x,y);}
function star(x,y,r){ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}ctx.closePath();ctx.fill();}
function draw(){const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#101b37');sky.addColorStop(1,'#324361');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
for(let i=0;i<70;i++){const x=((i*173.71-camera*.12)%W+W)%W,y=25+(i*83)%290;ctx.fillStyle=`rgba(200,232,255,${.25+Math.sin(i+elapsed)*.15})`;ctx.fillRect(x,y,2,2);}
ctx.fillStyle='#fce8bd';ctx.beginPath();ctx.arc(790-camera*.04,102,34,0,Math.PI*2);ctx.fill();
for(let layer=0;layer<2;layer++){ctx.fillStyle=layer?'#21364a':'#1a2c45';ctx.beginPath();ctx.moveTo(0,H);for(let x=-100;x<W+150;x+=60)ctx.lineTo(x,350+layer*55+Math.sin((x+camera*(.12+layer*.12))/140)*45+Math.cos(x/70)*16);ctx.lineTo(W,H);ctx.fill();}
ctx.save();ctx.translate(-Math.round(camera),0);
for(const b of platforms){round(b.x,b.y,b.w,b.h,6,'#263f4d');round(b.x,b.y,b.w,7,3,'#72d9b7');ctx.fillStyle='#35535f';for(let x=b.x+15;x<b.x+b.w;x+=38)ctx.fillRect(x,b.y+22,16,4);}
for(const s of stars)if(!s.taken){const yy=s.y+Math.sin(elapsed*3+s.x)*4;ctx.shadowColor='#ffd985';ctx.shadowBlur=16;ctx.fillStyle='#ffe29a';star(s.x,yy,12);ctx.shadowBlur=0;}
for(const e of enemies)if(!e.dead){round(e.x,e.y+Math.sin(elapsed*8)*2,e.w,e.h,12,'#c99af2');round(e.x+7,e.y+8,5,7,2,'#302d59');round(e.x+22,e.y+8,5,7,2,'#302d59');}
// A little explorer with a mint scarf and a lantern-like glow.
if(p.inv<=0||Math.floor(elapsed*15)%2===0){ctx.shadowColor='#76ead7';ctx.shadowBlur=14;round(p.x,p.y,p.w,p.h,9,'#e8f3fb');ctx.shadowBlur=0;round(p.x+3,p.y+5,22,16,6,'#283f62');round(p.x+(p.face>0?16:7),p.y+9,5,5,2,'#9afce8');round(p.x-3,p.y+24,34,6,3,'#72e9ce');ctx.fillStyle='#72e9ce';ctx.fillRect(p.x+(p.face>0?-13:27),p.y+26,14,5);}
ctx.fillStyle='#70f2d5';ctx.fillRect(3555,280,5,170);ctx.fillStyle='#8ef3dc';ctx.beginPath();ctx.moveTo(3560,280);ctx.lineTo(3620,300);ctx.lineTo(3560,325);ctx.fill();text('GOAL',3530,265,16,'#a9ffe9');
for(const q of particles){ctx.globalAlpha=Math.max(0,q.t/.6);ctx.fillStyle=q.color;ctx.fillRect(q.x,q.y,4,4);}ctx.globalAlpha=1;ctx.restore();
round(20,18,225,48,12,'#0c172bd9');text('♥ '.repeat(Math.max(0,p.hp)),36,49,22,'#ff9eb6');text(`✦ ${stars.filter(s=>s.taken).length} / 12`,140,49,19,'#ffe29a');round(795,18,145,48,12,'#0c172bd9');text(`${elapsed.toFixed(1)} s`,867,49,20,'#b5d9ed','center');
if(mode!=='playing'){ctx.fillStyle='#081021aa';ctx.fillRect(0,0,W,H);round(185,155,590,235,24,'#13243af2');const title=mode==='won'?'星の道、踏破！':mode==='lost'?'もう一回、飛んでみよう！':mode==='paused'?'ちょっとひと休み':'星をたどる、小さな冒険';text(title,W/2,219,30,'#f1f8ff','center');text(mode==='won'?`✦ ${stars.filter(s=>s.taken).length} / 12    TIME ${elapsed.toFixed(1)} s`:'二段ジャンプで谷を越え、スライムは上から踏もう。',W/2,266,17,'#b8cce3','center');text(mode==='won'||mode==='lost'?'Rキー / 画面をクリックでリトライ':mode==='paused'?'Pキー / 画面をクリックで再開':'矢印キー・Space / 画面をクリックでスタート',W/2,319,18,'#83efd5','center');text('RODORIN × AILIS',W/2,363,12,'#7b95b6','center');}ctx.textAlign='left';}
function start(){if(mode==='won'||mode==='lost')reset();if(mode==='ready'||mode==='paused'){mode='playing';status.textContent='星を集めて、右端の旗を目指そう！';}canvas.focus();}
function input(code,repeat=false){if(code==='KeyR'){reset();start();return;}if(code==='KeyP'){if(mode==='playing'){mode='paused';keys.clear();status.textContent='一時停止中';}else if(mode==='paused')start();return;}if(['ArrowLeft','ArrowRight','KeyA','KeyD','Space','ArrowUp','KeyW'].includes(code)){if(mode==='ready')start();keys.add(code);if(!repeat&&['Space','ArrowUp','KeyW'].includes(code))jump();}}
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW','KeyP','KeyR'].includes(e.code)){e.preventDefault();if(!e.repeat||!['KeyP','KeyR'].includes(e.code))input(e.code,e.repeat);}});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(mode==='playing'){mode='paused';status.textContent='一時停止中 — Pで再開';}});
canvas.addEventListener('click',start);document.querySelector('#restart').addEventListener('click',()=>{reset();start();});
for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);input(b.dataset.key);});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>keys.delete(b.dataset.key));}
function frame(now){if(previous)accumulator+=Math.min((now-previous)/1000,.1);previous=now;while(accumulator>=1/120){step(1/120);accumulator-=1/120;}draw();requestAnimationFrame(frame);}
reset();requestAnimationFrame(frame);
// Read-only diagnostics for local smoke tests.
window.startrailState=()=>({mode,x:p.x,y:p.y,hp:p.hp,jumps:p.jumps,stars:stars.filter(s=>s.taken).length,time:elapsed,deaths});
})();
