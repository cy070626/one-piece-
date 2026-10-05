(function(root){
'use strict';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
// Every coordinate is local to the pelvis. Hands, elbows, knees and feet move independently.
const idle={lean:-.04,hip:0,head:0,back:[-35,-51,-21,-88],front:[41,-51,47,-88],legs:[[-26,38,-37,79],[27,34,38,79]],weapon:-1};
const wind={lean:-.2,hip:5,head:.08,back:[-45,-44,-29,-66],front:[-5,-67,-22,-96],legs:[[-34,41,-48,74],[26,37,42,74]],weapon:-2.7};
const strike={lean:.18,hip:5,head:-.08,back:[-28,-40,-20,-66],front:[56,-70,96,-74],legs:[[-36,38,-57,74],[36,37,51,74]],weapon:-.12};
const recoil={...idle,lean:.07,hip:3,front:[40,-62,62,-73],weapon:.45};
const profiles={
luffy:['punch','double','inflate','barrage'],zoro:['draw','cross','spin','triple'],sanji:['kick','kicks','flying','flame'],
nami:['staff','cast','evade','thunder'],enel:['palm','command','command','command'],crocodile:['hook','slash','evade','ground'],
lucci:['finger','kick','punch','shock'],kaido:['club','club','breath','upper'],usopp:['sling','sling','cast','vines'],
chopper:['punch','double','inflate','barrage'],robin:['crossarms','crossarms','crossarms','crossarms'],brook:['draw','slash','cast','triple'],franky:['punch','palm','inflate','beam'],jinbe:['palm','double','water','shock']};
Object.assign(profiles,{"whitebeard": ["slash", "shock", "shock", "shock"], "shanks": ["slash", "cast", "inflate", "triple"], "bigmom": ["slash", "cast", "command", "triple"], "blackbeard": ["punch", "double", "command", "ground"], "buggy": ["punch", "finger", "evade", "cast"], "doflamingo": ["finger", "finger", "command", "command"], "mihawk": ["slash", "cross", "slash", "triple"], "akainu": ["punch", "punch", "palm", "command"], "kizaru": ["kick", "finger", "evade", "command"], "kuzan": ["slash", "cast", "ground", "ground"]});
Object.assign(profiles,{marco:['kick','flying','command','flame'],sengoku:['palm','shock','inflate','shock'],kuma:['palm','palm','inflate','shock'],bartolomeo:['punch','palm','crossarms','shock']});
profiles.magellan=['palm','command','command','ground'];profiles.shiryu=['draw','slash','evade','triple'];
Object.assign(profiles,{cracker:['draw','slash','command','triple'],ain:['slash','cross','command','command'],blueno:['finger','kick','command','shock'],ace:['punch','punch','command','thunder'],garp:['punch','upper','cast','shock'],hancock:['kick','finger','command','kicks'],moria:['palm','command','command','ground']});
profiles.imu=['palm','command','crossarms','command'];profiles.marine=['punch','double','kick','barrage'];profiles.law=['slash','cast','command','shock'];
function target(style,phase,cycle,index){
 const p=structuredClone(phase==='wind'?wind:phase==='strike'?strike:phase==='recoil'?recoil:idle);
 const active=phase==='strike',w=phase==='wind';
 if(['kick','kicks','flying','flame'].includes(style)){
  p.front=[27,-48,19,-64];p.back=[-35,-64,-40,-92];p.lean=w?-.25:active?-.28:.04;
  if(w)p.legs[1]=[25,8,20,35];
  if(active){const high=style==='kicks'||style==='flame'?index%2===0:style==='flying';p.legs[1]=[49,high?-35:-4,103,high?-58:-12];p.legs[0]=[-15,43,-22,74];p.hip=style==='flying'?-15:0;}
 }
 if(['draw','slash','cross','spin','triple','club','upper'].includes(style)){
  if(w){p.front=[10,-99,22,-136];p.back=[-36,-56,-6,-101];p.weapon=-2.6;}
  if(active){p.front=[37,-81,68,-45];p.weapon=lerp(-.35,1.05,cycle);p.lean=.24;
   if(style==='draw'){p.front=[44,-60,82,-58];p.weapon=-.03;}
   if(style==='spin'||style==='triple'){p.weapon=(index%2?-1:1)*lerp(-.35,1.6,cycle);p.back=[-45,-81,-65,-51];}
   if(style==='upper'){p.front=[38,-90,50,-135];p.weapon=lerp(.65,-2.6,cycle);p.lean=-.16;}
  }
 }
 if(style==='double'||style==='shock'){if(w){p.front=[-2,-51,6,-78];p.back=[-29,-46,-14,-76];}if(active){p.front=[50,-62,85,-65];p.back=[37,-75,77,-82];}}
 if(style==='barrage'&&active){const reach=lerp(60,125,Math.sin(cycle*Math.PI));p.front=[46,-78,reach,-74];p.back=[24,-47,index%2?reach:-5,-52];p.lean=.12;}
 if(['cast','thunder','vines','giant','crossarms','ground','breath','command'].includes(style)){
  p.lean=w?-.1:.04;
  if(w){p.front=[36,-77,18,-105];p.back=[-32,-75,8,-100];if(style==='crossarms'){p.front=[23,-52,-14,-67];p.back=[-23,-52,17,-70];}if(style==='command'){p.front=[25,-69,37,-90];p.back=[-27,-38,-24,-15];p.weapon=-.35;}}
  if(active){p.front=[35,-85,54,-132];p.back=[-38,-75,-52,-122];p.weapon=-1.65;
   if(style==='crossarms'){p.front=[23,-51,-14,-67];p.back=[-23,-51,17,-70];}if(style==='command'){p.front=[40,-63,77,-77];p.back=[-27,-38,-24,-15];p.weapon=-.35;}if(style==='thunder'){p.front=[29,-93,30,-140];p.back=[-30,-52,-49,-71];p.weapon=-1.5;}
   if(style==='ground'){p.front=[38,-25,60,25];p.back=[-30,-53,-8,-72];p.lean=.34;p.hip=13;}
   if(style==='breath'){p.front=[30,-58,27,-81];p.back=[-31,-58,-22,-80];p.lean=.22;}
   if(style==='giant'){p.front=[51,-59,91,-62];p.back=[-13,-62,44,-84];}
  }
 }
 if(style==='sling'){p.front=[42,-70,63,-88];p.back=w?[-47,-75,-42,-94]:active?[-15,-74,12,-92]:[-34,-72,-23,-94];p.weapon=0;p.lean=w?-.12:.13;}
 if(style==='staff'&&active){p.front=[39,-72,83,-75];p.back=[13,-48,42,-69];p.weapon=-.07;}
 if(style==='inflate'){p.front=[41,-35,45,-17];p.back=[-42,-35,-45,-17];p.lean=0;p.hip=active?8:0;p.inflate=active?.4:w?.15:0;}
 if(style==='evade'){p.lean=-.35;p.front=[-22,-60,-45,-91];p.legs=[[-25,25,-62,46],[30,35,52,74]];}
 if(['beam','water'].includes(style)){p.lean=w?-.12:.12;p.weapon=0;if(w){p.front=[26,-58,29,-87];p.back=[-25,-62,8,-88];}if(active){p.front=[48,-69,90,-74];p.back=style==='beam'?[34,-79,80,-77]:[-28,-56,-15,-73];}}
 if(style==='palm'&&active)p.front=[52,-61,92,-60];
 return p;
}
function mix(a,b,t){const o={};for(const k in a){if(Array.isArray(a[k]))o[k]=a[k].map((v,i)=>Array.isArray(v)?v.map((n,j)=>lerp(n,b[k][i][j],t)):lerp(v,b[k][i],t));else o[k]=lerp(a[k],b[k]??a[k],t)}o.inflate=lerp(a.inflate||0,b.inflate||0,t);return o;}
function neutral(f){const p=structuredClone(idle),id=f.c.id;
 if(id==='nami'||id==='enel'){p.front=[35,-48,40,-26];p.back=[-30,-40,-30,-16];p.weapon=-1.45;p.lean=0;}
 if(id==='robin'){p.front=[25,-45,-12,-66];p.back=[-23,-45,17,-69];p.lean=0;}
 if(id==='usopp'){p.front=[42,-63,63,-85];p.back=[-23,-65,10,-85];p.weapon=0;p.lean=-.04;}
 if(id==='jinbe'){p.front=[40,-56,59,-77];p.back=[-31,-55,-20,-70];p.legs=[[-33,35,-45,79],[32,35,44,79]];}if(id==='franky'){p.front=[37,-41,49,-60];p.back=[-34,-42,-26,-62];}if(id==='brook'){p.front=[31,-42,42,-28];p.back=[-30,-39,-31,-14];p.weapon=-1.2;}
 if(id==='zoro'||id==='kaido'){p.front=[33,-40,36,-20];p.back=[-31,-39,-29,-17];p.weapon=id==='kaido'?-1.7:-.7;}
 return p;
}
function sample(f,frame){
 if(f.pose==='ko')return {...structuredClone(idle),lean:-1.15,hip:33};
 if(f.stun>0||f.pose==='hit')return {...structuredClone(idle),lean:-.27,hip:7,front:[16,-39,33,-27],back:[-41,-46,-49,-25],head:.13};
 if(f.block)return {...structuredClone(idle),lean:-.1,hip:5,front:[31,-79,13,-121],back:[-8,-87,6,-123]};
 if(!f.move){const p=neutral(f);if(f.pose==='walk'){const q=Math.sin(frame*.22);p.legs=[[-20-q*17,38,-28-q*25,78],[20+q*17,38,28+q*25,78]];p.front=[35-q*7,-43,36-q*15,-28];p.back=[-35+q*7,-43,-36+q*15,-28];p.hip=Math.abs(q)*-3;}else if(!f.ground){p.legs=[[-30,20,-48,40],[26,0,36,23]];p.front=[28,-96,23,-128];p.back=[-29,-75,-51,-91];}else p.hip=Math.sin(frame*.055)*.8;return p;}
 if(f.move?.key==='retreat')return neutral(f);
 const s=f.move,style=s.animation||profiles[f.c.id][['light','heavy','special','ult'].indexOf(['interact','recall1','recall2'].includes(s.key)?'special':s.key)],n=f.moveFrame;
 if(n<=s.startup)return mix(neutral(f),target(style,'wind',0,0),Math.sin(clamp(n/s.startup)*Math.PI/2));
 const span=Math.ceil(s.active/s.hits),a=n-s.startup-1,index=Math.min(s.hits-1,Math.floor(a/span)),cycle=clamp((a%span)/Math.max(1,span-1));
 if(n<=s.startup+s.active){const t=cycle<.3?1:1-(cycle-.3)/.7*.6;return mix(target(style,'wind',cycle,index),target(style,'strike',cycle,index),t);}
 return mix(target(style,'recoil',1,s.hits-1),neutral(f),clamp((n-s.startup-s.active)/s.recovery));
}
function draw(g,f,frame,image,alpha=1){if(root.DuelSprites?.draw(g,f,frame,alpha))return;return root.DuelInk.draw(g,f,frame,sample(f,frame),alpha);}
function tip(f,frame){const actual=root.DuelSprites?.tip(f,frame);if(actual)return actual;const p=sample(f,frame),id=f.c.id,scale=id==='kaido'?1.1:id==='chopper'?.82:1;let x,y;if(id==='sanji'||id==='lucci'&&f.move?.key==='heavy'){x=p.legs[1][2];y=p.legs[1][3];return [f.x+x*f.dir*scale,f.y+(-79+p.hip+y)*scale];}x=p.front[2];y=p.front[3];if(['zoro','brook','kaido','nami','enel'].includes(id)){x+=Math.cos(p.weapon)*95;y+=Math.sin(p.weapon)*95;}return [f.x+(x*Math.cos(p.lean)-y*Math.sin(p.lean))*f.dir*scale,f.y+(-79+p.hip+x*Math.sin(p.lean)+y*Math.cos(p.lean))*scale];}
if(typeof module!=='undefined'&&module.exports)require('./ink.js');
root.DuelMotion={sample,draw,tip,profiles};if(typeof module!=='undefined'&&module.exports)module.exports=root.DuelMotion;
})(globalThis);
