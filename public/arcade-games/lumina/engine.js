'use strict';
// Simulation is independent of canvas so combat and progression can be tested.
(() => {
const WIDTH=1280,HEIGHT=800;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
class ForestGame {
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){this.mode='ready';this.time=0;this.player={x:640,y:440,r:15,hp:100,maxHp:100,inv:0,dash:0,cooldown:0,dx:0,dy:-1};this.enemies=[];this.bullets=[];this.hostile=[];this.shards=[];this.particles=[];this.collected=0;this.kills=0;this.spawnClock=.6;this.shotClock=.2;this.bossSpawned=false;this.bossDefeated=false;this.nextId=1;this.message='森に散らばった8つの光を取り戻そう';this.messageTime=4;}
 start(){if(this.mode==='won'||this.mode==='lost')this.reset();this.mode='playing';}
 pause(){if(this.mode==='playing')this.mode='paused';else if(this.mode==='paused')this.mode='playing';}
 spawn(boss=false){let angle=this.random()*Math.PI*2;const p=this.player;let x=clamp(p.x+Math.cos(angle)*420,55,WIDTH-55),y=clamp(p.y+Math.sin(angle)*420,95,HEIGHT-55);if(Math.hypot(x-p.x,y-p.y)<220){x=p.x<WIDTH/2?WIDTH-80:80;y=p.y<HEIGHT/2?HEIGHT-80:100;}
 const e={id:this.nextId++,x,y,r:boss?48:18,hp:boss?240:30,maxHp:boss?240:30,speed:boss?47:60+this.collected*3,boss,flash:0,shoot:2.2};this.enemies.push(e);return e;}
 burst(x,y,color,count=12){for(let i=0;i<count;i++)this.particles.push({x,y,vx:(this.random()-.5)*190,vy:(this.random()-.5)*190,life:.5+this.random()*.4,color});}
 dash(mx,my){const p=this.player;if(this.mode!=='playing'||p.cooldown>0)return false;const d=Math.hypot(mx,my);if(d){p.dx=mx/d;p.dy=my/d;}p.dash=.17;p.inv=Math.max(p.inv,.3);p.cooldown=1.3;this.burst(p.x,p.y,'#85fff0');return true;}
 fire(x,y){const p=this.player,dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy)||1;this.bullets.push({x:p.x,y:p.y,vx:dx/d*530,vy:dy/d*530,r:6,life:1.6});p.dx=dx/d;p.dy=dy/d;}
 hurt(amount){const p=this.player;if(p.inv>0||this.mode!=='playing')return;p.hp=Math.max(0,p.hp-amount);p.inv=.85;this.burst(p.x,p.y,'#ff91b4');if(p.hp===0){this.mode='lost';this.message='光は、まだ消えない。もう一度！';}}
 update(dt,input={}){if(this.mode!=='playing')return;dt=Math.min(.05,Math.max(0,dt));this.time+=dt;this.messageTime=Math.max(0,this.messageTime-dt);const p=this.player;for(const k of ['inv','dash','cooldown'])p[k]=Math.max(0,p[k]-dt);
 let mx=Number(input.right||false)-Number(input.left||false),my=Number(input.down||false)-Number(input.up||false),d=Math.hypot(mx,my);if(d){mx/=d;my/=d;if(!p.dash){p.dx=mx;p.dy=my;}}
 if(p.dash>0){mx=p.dx;my=p.dy;}const speed=p.dash>0?680:215;p.x=clamp(p.x+mx*speed*dt,36,WIDTH-36);p.y=clamp(p.y+my*speed*dt,90,HEIGHT-36);
 this.spawnClock-=dt;if(this.spawnClock<=0&&!this.bossSpawned){if(this.enemies.length<9)this.spawn();this.spawnClock=Math.max(.8,1.6-this.collected*.07);}
 this.shotClock-=dt;if(this.shotClock<=0){let target=null,best=560;for(const e of this.enemies){let distance=Math.hypot(e.x-p.x,e.y-p.y);if(distance<best){best=distance;target=e;}}if(input.aim)this.fire(input.aim.x,input.aim.y);else if(target)this.fire(target.x,target.y);this.shotClock=.22;}
 for(const e of this.enemies){e.flash=Math.max(0,e.flash-dt);const dx=p.x-e.x,dy=p.y-e.y,dist=Math.hypot(dx,dy)||1;e.x+=dx/dist*e.speed*dt;e.y+=dy/dist*e.speed*dt;if(dist<e.r+p.r)this.hurt(e.boss?22:12);if(e.boss){e.shoot-=dt;if(e.shoot<=0){for(let i=0;i<10;i++){const a=i*Math.PI/5+this.time*.2;this.hostile.push({x:e.x,y:e.y,vx:Math.cos(a)*130,vy:Math.sin(a)*130,r:7,life:7});}e.shoot=2.4;}}}
 for(const b of this.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;for(const e of this.enemies){if(e.hp>0&&b.life>0&&Math.hypot(b.x-e.x,b.y-e.y)<b.r+e.r){e.hp-=10;e.flash=.09;b.life=0;this.burst(b.x,b.y,e.boss?'#ffd48a':'#a6f6d8',4);break;}}}
 for(const e of this.enemies)if(e.hp<=0){this.kills++;this.burst(e.x,e.y,e.boss?'#ffe29b':'#93ffcf',24);if(e.boss){this.bossDefeated=true;this.mode='won';this.message='森に、ふたたび光が灯った';}else this.shards.push({x:e.x,y:e.y,r:10});}
 this.enemies=this.enemies.filter(e=>e.hp>0);this.bullets=this.bullets.filter(b=>b.life>0&&b.x>-30&&b.y>-30&&b.x<WIDTH+30&&b.y<HEIGHT+30);
 for(const b of this.hostile){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(Math.hypot(b.x-p.x,b.y-p.y)<b.r+p.r){this.hurt(10);b.life=0;}}this.hostile=this.hostile.filter(b=>b.life>0);
 for(const s of this.shards){const dx=p.x-s.x,dy=p.y-s.y,dist=Math.hypot(dx,dy);if(dist<115&&dist>1){s.x+=dx/dist*300*dt;s.y+=dy/dist*300*dt;}if(dist<27){s.taken=true;this.collected++;p.hp=Math.min(100,p.hp+5);this.burst(s.x,s.y,'#a6ffe7',9);}}
 this.shards=this.shards.filter(s=>!s.taken);
 if(this.collected>=8&&!this.bossSpawned&&this.mode==='playing'){this.bossSpawned=true;this.spawn(true);p.hp=Math.min(100,p.hp+25);this.message='森の守護者が目覚めた！ 光の魔法で解き放とう';this.messageTime=5;this.burst(p.x,p.y,'#ffe29a',30);}
 for(const q of this.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;}this.particles=this.particles.filter(q=>q.life>0);
 }
 snapshot(){return {mode:this.mode,time:this.time,player:{...this.player},collected:this.collected,kills:this.kills,enemies:this.enemies.length,bossSpawned:this.bossSpawned,bossDefeated:this.bossDefeated,bullets:this.bullets.length};}
}
if(typeof module!=='undefined')module.exports={ForestGame,WIDTH,HEIGHT};else Object.assign(window,{ForestGame,FOREST_WIDTH:WIDTH,FOREST_HEIGHT:HEIGHT});
})();
