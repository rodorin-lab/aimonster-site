(function(root){'use strict';
const CHASSIS=[
 {id:'vanguard',name:'VX–01 VANGUARD',role:'汎用強襲機',hp:270,speed:1,color:'#c4d9df',accent:'#71eff5',unlock:0,description:'装甲と機動性を両立した、灰都解放隊の主力機。'},
 {id:'wraith',name:'VX–02 WRAITH',role:'高速遊撃機',hp:205,speed:1.3,color:'#7d9caf',accent:'#c1a2ff',unlock:1,description:'軽量フレームと高効率スラスター。第１作戦で解放。'},
 {id:'bulwark',name:'VX–03 BULWARK',role:'重装砲撃機',hp:385,speed:.79,color:'#a99b84',accent:'#ffc178',unlock:2,description:'圧倒的な装甲で戦線を維持する重機体。第２作戦で解放。'}
];
const MISSIONS=[
 {id:'ashfall',title:'01 / 燃える港',subtitle:'OPERATION ASHFALL',region:'灰都・第七港湾',boss:'BASTION',bossJP:'四脚重砲機〈バスティオン〉',theme:'harbor',reward:600,bossHP:1800,
  briefing:'自律兵器群が避難航路を封鎖した。港湾の２区域を制圧し、四脚重砲機バスティオンを破壊せよ。民間輸送船の出港まで、もう時間がない。',
  opening:[['セラ / 戦術管制','こちら管制セラ。ロドリン、通信は良好。君の帰還ルートは私が守る。'],['ロドリン / パイロット','了解。アイリス、機体の調整は任せた。避難船に道を作ろう。'],['IRIS / 支援AI','全系統正常。射線とエネルギーを監視します。さあ、一緒に行きましょう。']],
  ending:'港の警告灯が消え、避難船が霧の向こうへ進み始めた。回収した敵の記録には、凍結した観測施設の座標が残されていた。'},
 {id:'whiteout',title:'02 / 白夜の残響',subtitle:'OPERATION WHITEOUT',region:'北部・凍結観測所',boss:'WRAITH ZERO',bossJP:'高速迎撃機〈レイス・ゼロ〉',theme:'snow',reward:850,bossHP:2400,
  briefing:'暴走信号の発信源を追い、凍結観測所へ。迎撃部隊を排除し、高速実験機の記録装置を確保する。突進の予兆を見たら横方向へ回避せよ。',
  opening:[['セラ / 戦術管制','この施設は、かつて私たちの機体を開発していた場所。今は敵の中継基地になっている。'],['ロドリン / パイロット','なら、残された記録を持ち帰ろう。何が起きたのか知りたい。'],['IRIS / 支援AI','高速機の反応を検知。攻撃予告を確認し、回避を優先してください。']],
  ending:'実験機の記録は、暴走が事故ではないことを示していた。全兵器を束ねる中枢〈ヘリオス〉が、空中炉心都市で目覚めようとしている。'},
 {id:'daybreak',title:'03 / 夜明けを取り戻せ',subtitle:'OPERATION DAYBREAK',region:'空中炉心都市・最終防衛線',boss:'HELIOS',bossJP:'空中要塞〈ヘリオス〉',theme:'reactor',reward:1200,bossHP:3400,
  briefing:'炉心都市の防衛線を突破し、空中要塞ヘリオスの制御核を停止させる。誘導砲撃の着弾範囲から離れ、連続レーザーの射線を断て。これが最後の作戦だ。',
  opening:[['セラ / 戦術管制','最後の防衛線よ。あの炉心を止めれば、灰都の空を取り戻せる。'],['ロドリン / パイロット','ここまで一緒に来たんだ。最後まで、僕たちのやり方で行こう。'],['IRIS / 支援AI','私は、あなたの判断を支えます。夜明けまで、あと一歩です。']],
  ending:'ヘリオスの光が静かに消え、都市に朝日が差し込んだ。「おかえり、ロドリン」――セラの声に、IRISの短い帰還通知が重なる。鋼の機兵は、もう一度、人の街へ帰っていく。'}
];
const MODULES=[{id:'power',name:'高出力ジェネレーター',desc:'全武器ダメージ +12% / LV',base:180},{id:'armor',name:'積層複合装甲',desc:'最大AP +40 / LV',base:160},{id:'cooling',name:'高効率冷却器',desc:'EN回復・特殊武器冷却 +18% / LV',base:170}];
const KEY='ailis.iron-vanguard.campaign.v1';
const fresh=()=>({version:1,credits:300,cleared:[],records:{},chassis:'vanguard',weapon:'rifle',modules:{power:0,armor:0,cooling:0},settings:{bgm:.32,se:.55,voice:false,shake:.65,hitstop:true,assist:true,autofire:false,quest:false},rewards:[]});
const int=(n,a,b,f=a)=>Number.isFinite(n)?Math.max(a,Math.min(b,Math.floor(n))):f;
function normalize(raw){if(!raw||typeof raw!=='object'||raw.version!==1)throw Error('対応していないセーブ形式です');const p=fresh();p.credits=int(raw.credits,0,999999);p.cleared=MISSIONS.map(x=>x.id).filter(id=>raw.cleared?.includes(id));const count=unlocked(p);p.chassis=CHASSIS.some(c=>c.id===raw.chassis&&c.unlock<=count)?raw.chassis:'vanguard';p.weapon=['rifle','gatling',...(count>=2?['rail']:[])].includes(raw.weapon)?raw.weapon:'rifle';for(const m of MODULES)p.modules[m.id]=int(raw.modules?.[m.id],0,5);for(const k of ['bgm','se','shake'])p.settings[k]=typeof raw.settings?.[k]==='number'?Math.max(0,Math.min(1,raw.settings[k])):p.settings[k];for(const k of ['voice','hitstop','assist','autofire','quest'])if(typeof raw.settings?.[k]==='boolean')p.settings[k]=raw.settings[k];for(const m of MISSIONS){const r=raw.records?.[m.id];if(r&&typeof r==='object')p.records[m.id]={score:int(r.score,0,9999999),time:int(r.time,0,99999),rank:['S','A','B','C'].includes(r.rank)?r.rank:'C',clears:int(r.clears,0,99999)};}p.rewards=Array.isArray(raw.rewards)?raw.rewards.filter(x=>typeof x==='string'&&x.length<100).slice(-100):[];return p;}
function unlocked(p){let n=0;while(n<MISSIONS.length&&p.cleared.includes(MISSIONS[n].id))n++;return n;}
function load(storage){try{const raw=storage.getItem(KEY);return{profile:raw?normalize(JSON.parse(raw)):fresh(),warning:null};}catch(e){return{profile:fresh(),warning:'セーブを読み込めませんでした。元データは上書きせず、バックアップを書き出して確認してください。',error:String(e)};}}
function persist(storage,p){try{storage.setItem(KEY,JSON.stringify(normalize(p)));return true;}catch{return false;}}
function purchase(p,id){const m=MODULES.find(m=>m.id===id);if(!m||p.modules[id]>=5)return false;const cost=m.base*(p.modules[id]+1);if(p.credits<cost)return false;p.credits-=cost;p.modules[id]++;return true;}
function reward(p,mission,result,runId){const i=MISSIONS.findIndex(m=>m.id===mission);if(i<0||i>unlocked(p)||p.rewards.includes(runId)||result.mode!=='victory')return null;const m=MISSIONS[i],first=!p.cleared.includes(m.id),rank=result.hpRatio>.65&&result.time<180?'S':result.hpRatio>.35?'A':result.hpRatio>.1?'B':'C',credits=(first?m.reward:Math.round(m.reward*.25))+({S:150,A:100,B:50,C:0}[rank]);p.credits+=credits;if(first)p.cleared.push(m.id);p.rewards.push(runId);p.rewards=p.rewards.slice(-100);const old=p.records[m.id];p.records[m.id]={score:Math.max(old?.score||0,result.score),time:Math.min(old?.time||99999,Math.ceil(result.time)),rank:old&&'SABC'.indexOf(old.rank)<'SABC'.indexOf(rank)?old.rank:rank,clears:(old?.clears||0)+1};return{credits,first,rank,unlock:first?(i===0?'WRAITH / 第２作戦':i===1?'BULWARK / レールガン / 最終作戦':'CAMPAIGN COMPLETE'):null};}
function advice(b){const p=b.player,boss=b.enemies.find(e=>e.type==='boss');if(p.hp/p.maxHp<.25)return{level:'danger',text:'装甲危険。回復物資へ移動し、交戦距離を保って。'};if(b.hazards?.some(h=>Math.hypot(h.x-p.x,h.y-p.y)<h.r+45))return{level:'danger',text:'砲撃着弾範囲です。すぐに範囲外へ！'};if(boss?.charge>0)return{level:'danger',text:boss.variant===1?'突進予兆。横方向へブースト回避！':'大型兵器が攻撃準備。赤い予告範囲から離脱！'};if(p.energy<25)return{level:'warn',text:'ブースト残量低下。遮蔽物を使って回復を待って。'};if(p.missile<=0&&b.enemies.length>2)return{level:'info',text:'複数の敵影。誘導ミサイルが使用可能です。'};return{level:'info',text:boss?'弱点コアを狙って。射線を切りながら攻撃を継続。':'戦術リンク良好。敵の予告射線を避け、各個に撃破。'};}
const api={CHASSIS,MISSIONS,MODULES,KEY,fresh,normalize,unlocked,load,persist,purchase,reward,advice};if(typeof module!=='undefined')module.exports=api;else root.CampaignData=api;
})(typeof window!=='undefined'?window:globalThis);
