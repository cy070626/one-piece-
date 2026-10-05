(function(root){'use strict';
const A=root.DuelAbilities,I=root.DuelInk,oldDraw=I.draw,oldPortrait=I.portrait,oldBg=A.background,oldFg=A.foreground,oldProj=A.projectile;
const ids=new Set(['imu','marine']);
function line(g,p,color,width=2){g.strokeStyle=color;g.lineWidth=width;g.beginPath();p.forEach(([x,y],n)=>n?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
function ellipse(g,x,y,rx,ry,fill,stroke){g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke();}}
function shape(g,points,fill,stroke='#102030',width=1.5){g.beginPath();for(const [op,...v] of points){if(op==='M')g.moveTo(...v);else if(op==='L')g.lineTo(...v);else if(op==='Q')g.quadraticCurveTo(...v);else if(op==='C')g.bezierCurveTo(...v);else g.closePath();}g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}}
function gradient(g,x,y,w,h,stops){const c=g.createLinearGradient(x,y,w,h);stops.forEach(([t,v])=>c.addColorStop(t,v));return c;}
function robe(g,f,frame,p,alpha){
 g.save();g.translate(f.x,f.y);g.scale(f.dir,1);g.globalAlpha*=alpha;g.lineJoin='round';
 const sway=Math.sin(frame*.043)*3,breath=Math.sin(frame*.035)*.8;
 const halo=g.createRadialGradient(0,-150,28,0,-150,170);halo.addColorStop(0,'#22172b00');halo.addColorStop(.5,'#7c244938');halo.addColorStop(1,'#562a7000');g.fillStyle=halo;g.fillRect(-160,-295,320,298);
 g.save();g.globalAlpha*=.35;g.strokeStyle='#a85476';g.lineWidth=1.3;g.beginPath();g.ellipse(0,-147,89,123,-.12,Math.PI*.12,Math.PI*1.87);g.stroke();g.strokeStyle='#78678d';g.beginPath();g.ellipse(0,-147,98,133,-.12,Math.PI*1.14,Math.PI*1.95);g.stroke();
 for(let n=0;n<7;n++){const phase=(frame*.005+n/7)%1,x=Math.sin(n*2.4+frame*.01)*(70+phase*26),y=-12-phase*248;g.globalAlpha=alpha*(1-phase)*.45;shape(g,[['M',x,y],['L',x+2,y-7],['L',x+4,y],['L',x+2,y+4],['Z']],'#c56a8b',null);}g.restore();
 g.save();g.globalAlpha*=.24;g.strokeStyle='#a0436d';g.lineWidth=1.4;for(let n=0;n<3;n++){g.beginPath();g.ellipse(0,-3,76+n*13,12+n*4,-.04+Math.sin(frame*.013)*.04,Math.PI*.08,Math.PI*1.88);g.stroke();}g.restore();

 // Elongated silhouette, obscured face, restrained red gaze. Fabric geometry follows the pose.
 g.rotate(p.lean*.22);g.translate(0,p.hip*.4+breath);
 const velvet=gradient(g,-55,-215,55,0,[[0,'#080b15'],[.32,'#222337'],[.55,'#0c101d'],[.8,'#353047'],[1,'#101522']]);
 shape(g,[['M',-21,-199],['Q',-42,-181,-44,-121],['C',-46,-74,-53+sway,-28,-72+sway,-3],['Q',-46,8,-24,1],['Q',-2,10,21,1],['Q',48,9,72+sway,0],['C',44,-38,32,-106,30,-159],['Q',31,-189,17,-201],['Z']],velvet,'#798395',1.1);
 shape(g,[['M',-18,-190],['Q',-17,-119,-33,-10],['Q',-3,2,23,-7],['Q',11,-108,13,-191],['Z']],gradient(g,-16,-190,25,-4,[[0,'#060a11'],[.55,'#202331'],[1,'#070b13']]),'#0a0c15',1);
 for(let n=0;n<9;n++){const x=-33+n*8;line(g,[[x*.38,-165],[x*.78+sway*.3,-83],[x*1.62+sway,-5]],n%3===0?'#a0a6bb33':'#03071299',n%3===0?1:2.5);}
 shape(g,[['M',-25,-183],['Q',-59,-159,-45,-97],['L',-30,-101],['Q',-18,-151,-9,-166],['L',0,-150],['L',10,-166],['Q',33,-139,32,-103],['L',47,-94],['Q',53,-155,23,-182],['Q',0,-174,-25,-183],['Z']],gradient(g,-40,-170,46,-98,[[0,'#454354'],[.35,'#171d2c'],[.7,'#060b16'],[1,'#373847']]),'#68788a',1.1);
 // Sleeves are broad folded cloth; hands stay at the same animation endpoints.
 for(const arm of [p.back,p.front]){const [ex,ey,hx,hy]=arm;g.save();g.translate(0,-79+p.hip*.6);const shoulder=arm===p.front?20:-23;
 shape(g,[['M',shoulder-10,-92],['Q',ex-14,ey-13,hx-10,hy+1],['L',hx+7,hy+12],['Q',ex+14,ey+19,shoulder+10,-67],['Z']],gradient(g,shoulder,-85,hx,hy,[[0,'#303447'],[.5,'#0a101d'],[1,'#383644']]),'#64748699',1);
 line(g,[[shoulder,-83],[ex,ey],[hx,hy+7]],'#9b9ca533',1);
 shape(g,[['M',hx-6,hy+2],['L',hx+2,hy-2],['L',hx+10,hy-1],['L',hx+12,hy+2],['L',hx+8,hy+4],['L',hx+14,hy+7],['L',hx+11,hy+10],['L',hx+1,hy+7],['L',hx-7,hy+9],['Z']],'#0c1120','#b0a5b766',1);g.restore();}
 // Head remains a void under the narrow hood, with no invented facial identity.
 shape(g,[['M',-18,-222],['Q',0,-238,18,-222],['L',21,-184],['Q',0,-172,-20,-186],['Z']],'#01040b','#808596',1.1);
 shape(g,[['M',-21,-221],['L',-13,-226],['L',-11,-181],['L',-20,-186],['Z']],'#282d3b',null);
 for(const x of [-7,8]){ellipse(g,x,-203,3.1,4.5,'#bd3045');ellipse(g,x+.4,-203,1.4,3.3,'#090a11');line(g,[[x-5,-210],[x+4,-209]],'#090b16',2);}
 const crown=gradient(g,-20,-282,21,-222,[[0,'#050912'],[.48,'#252b3b'],[1,'#586071']]);
 shape(g,[['M',-20,-224],['L',-23,-276],['L',-12,-237],['L',-10,-298],['L',-1,-241],['L',4,-300],['L',9,-241],['L',22,-280],['L',19,-223],['Q',0,-215,-20,-224],['Z']],crown,'#a4adbb',1.2);
 line(g,[[-18,-225],[-2,-221],[18,-224]],'#d5d8df88',1.2);g.restore();return p;
}
function marine(g,f,frame,p,alpha){
 g.save();g.translate(f.x,f.y);g.scale(f.dir,1);g.globalAlpha*=alpha;g.translate(0,-79+p.hip);g.lineJoin='round';g.lineCap='round';
 const skin=gradient(g,-20,-155,20,-110,[[0,'#ffe5c8'],[.5,'#eac5a4'],[1,'#c29175']]);
 const cloth=gradient(g,-28,-89,31,-2,[[0,'#f5f5eb'],[.38,'#dce5e6'],[.7,'#f7f8ed'],[1,'#89a8b7']]);
 function arm(a,front){const [ex,ey,hx,hy]=a,sx=front?24:-24;g.save();g.rotate(p.lean*.55);
  g.strokeStyle='#674e44';g.lineWidth=16;g.beginPath();g.moveTo(sx,-77);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();g.strokeStyle=front?'#e7c5a5':'#c9a48a';g.lineWidth=13;g.stroke();
  const midx=sx+(ex-sx)*.48,midy=-77+(ey+77)*.48;g.strokeStyle='#1b3b50';g.lineWidth=23;g.beginPath();g.moveTo(sx,-77);g.lineTo(midx,midy);g.stroke();g.strokeStyle=front?'#f1f1e6':'#b6c9ce';g.lineWidth=19;g.stroke();
  ellipse(g,hx,hy,8.5,7.3,front?'#e8c4a4':'#c59e84','#755d4e');line(g,[[hx-3,hy+2],[hx+4,hy+1]],'#b18a70',.8);g.restore();}
 arm(p.back,false);
 // Separate thigh, calf and boot contours follow knees and feet, with adult proportions.
 for(let j=0;j<2;j++){const [kx,ky,fx,fy]=p.legs[j],hx=j===0?-12:13;
  shape(g,[['M',hx-10,-8],['Q',kx-12,ky-7,fx-9,fy-6],['L',fx+10,fy-5],['Q',kx+11,ky+2,hx+9,-7],['Z']],gradient(g,hx,-4,fx+10,fy,[[0,j?'#34536c':'#1d364f'],[.4,'#466985'],[1,'#172e47']]),'#193c52',1.6);
  line(g,[[hx,-3],[kx,ky],[fx+1,fy-9]],'#8da8bd66',1.2);line(g,[[kx-6,ky],[kx+5,ky+3]],'#648798',1.2);
  shape(g,[['M',fx-10,fy-11],['L',fx+8,fy-11],['L',fx+11,fy-3],['Q',fx+23,fy-1,fx+25,fy+7],['L',fx-13,fy+7],['L',fx-12,fy-3],['Z']],gradient(g,fx-12,fy-10,fx+24,fy+8,[[0,'#17334a'],[.5,'#304e61'],[1,'#0a1c30']]),'#071b2b',1.7);line(g,[[fx-11,fy+5],[fx+22,fy+5]],'#819aa7',1);}
 g.save();g.rotate(p.lean);
 shape(g,[['M',-25,-91],['Q',-36,-66,-25,-33],['L',-21,-6],['Q',0,4,23,-7],['L',28,-53],['Q',32,-75,22,-90],['L',10,-96],['L',-9,-96],['Z']],cloth,'#19394d',1.8);
 shape(g,[['M',-26,-89],['L',-8,-97],['L',0,-79],['L',11,-97],['L',25,-86],['L',16,-68],['L',0,-77],['L',-16,-68],['Z']],'#19496a','#0b2c43',1.1);
 shape(g,[['M',-7,-102],['L',8,-103],['L',10,-90],['L',1,-80],['L',-9,-93],['Z']],skin,'#684e42',1);
 shape(g,[['M',-11,-94],['L',-5,-89],['L',0,-81],['L',-10,-85],['L',-18,-74],['Z']],'#f5f6ed','#9badb8',.8);
 shape(g,[['M',10,-94],['L',6,-87],['L',0,-81],['L',10,-84],['L',18,-74],['Z']],'#f5f6ed','#9badb8',.8);
 shape(g,[['M',-3,-80],['L',3,-80],['L',5,-75],['L',2,-71],['L',7,-39],['L',1,-34],['L',-4,-41],['L',-1,-72],['L',-4,-76],['Z']],'#25618b','#173950',1);
 line(g,[[1,-30],[1,-10]],'#94aeb9',1);for(const y of [-29,-21,-14])ellipse(g,2,y,1.6,1.6,'#e9d79c','#8d957f');
 for(const x of [-25,25]){shape(g,[['M',x-9,-86],['L',x+6,-89],['L',x+9,-82],['L',x-8,-79],['Z']],'#3c7088','#153a53',1);line(g,[[x-6,-82],[x+5,-84]],'#c5d3cc',1);}
 shape(g,[['M',8,-60],['L',22,-60],['L',21,-48],['L',8,-47],['Z']],'#d3e2e3','#658d9e',.8);line(g,[[9,-57],[20,-57]],'#688a98',1);
 shape(g,[['M',-22,-10],['Q',0,-5,23,-10],['L',22,-3],['Q',0,2,-23,-3],['Z']],'#183e5a','#09283f',1);g.fillStyle='#abb0a3';g.fillRect(-3,-7,7,5);
 // A neutral face under a low visor; no exaggerated nose, eye or jaw detail.
 g.save();g.translate(0,-111);g.rotate(p.head||0);
 shape(g,[['M',-12,-26],['Q',-1,-34,12,-25],['L',14,-8],['L',12,8],['Q',5,17,-3,13],['Q',-12,8,-13,-4],['Z']],gradient(g,-12,-26,14,12,[[0,'#ae8b78'],[.38,'#d6b598'],[.7,'#f1d7b5'],[1,'#c9a589']]),'#69594e',1);
 shape(g,[['M',-13,-22],['Q',-18,-36,2,-37],['Q',17,-33,15,-18],['L',-12,-12],['Z']],'#25313a',null);
 shape(g,[['M',-12,-19],['L',15,-20],['L',13,-5],['Q',3,-9,-12,-6],['Z']],gradient(g,0,-22,0,-5,[[0,'#193145'],[1,'#76827f']]),null);
 line(g,[[4,7],[9,7]],'#9c7e66',.8);
 shape(g,[['M',-18,-27],['Q',-20,-45,0,-45],['Q',18,-46,19,-29],['L',13,-24],['L',-14,-24],['Z']],gradient(g,-20,-45,20,-25,[[0,'#d0e2e5'],[.5,'#fffced'],[1,'#91b2c1']]),'#16405b',1.3);
 shape(g,[['M',-18,-25],['L',19,-27],['L',29,-21],['Q',33,-18,24,-16],['L',-17,-18],['Z']],'#23536f','#102d44',1.2);
 g.font='bold 6px sans-serif';g.textAlign='center';g.fillStyle='#265d7b';g.fillText('MARINE',1,-34);
 g.restore();g.restore();arm(p.front,true);g.restore();return p;
}

I.draw=(g,f,frame,p,alpha=1)=>f.c.id==='imu'?robe(g,f,frame,p,alpha):f.c.id==='marine'?marine(g,f,frame,p,alpha):oldDraw(g,f,frame,p,alpha);
const portraits={};I.portrait=c=>{if(!ids.has(c.id))return oldPortrait(c);if(portraits[c.id])return portraits[c.id];const canvas=document.createElement('canvas');canvas.width=360;canvas.height=480;const g=canvas.getContext('2d');g.scale(1.35,1.35);const f={c,x:132,y:325,dir:1,hp:c.hp,pose:'idle',ground:true,stun:0,buffs:{}};I.draw(g,f,0,root.DuelMotion.sample(f,0));return portraits[c.id]=canvas.toDataURL('image/png');};
function royal(g,f,m,motion){if(!f.move)return;const s=f.move,wind=f.moveFrame<=s.startup,active=f.moveFrame>s.startup&&f.moveFrame<=s.startup+s.active;if(!wind&&!active)return;const t=Math.min(1,f.moveFrame/Math.max(1,s.startup)),frame=motion?m.frame:0,x=s.kind==='zone'?f.zoneTarget:f.x,y=f.y-120;g.save();g.globalAlpha=wind?.25+t*.25:.85;g.shadowColor='#e875a8';g.shadowBlur=motion?12:0;g.strokeStyle='#dc81b7';g.lineWidth=2;
if(s.key==='ult'){const grad=g.createRadialGradient(x,y,10,x,y,195);grad.addColorStop(0,'#451936aa');grad.addColorStop(.7,'#160b21aa');grad.addColorStop(1,'#81305a00');g.fillStyle=grad;g.fillRect(x-220,y-215,440,330);for(let n=0;n<4;n++){const phase=(frame*.018+n*.25)%1,xx=x-140+n*92;g.strokeStyle=n%2?'#ffc9db':'#ae739f';g.lineWidth=wind?2:3;g.beginPath();g.moveTo(xx-30,y-205);g.lineTo(xx+11,y-140);g.lineTo(xx-9,y-135);g.lineTo(xx+26,y-48);g.stroke();if(active){g.fillStyle='#271124';g.beginPath();g.moveTo(xx-15,y-200+phase*50);g.lineTo(xx+22,y-150+phase*90);g.lineTo(xx+12,y+8);g.lineTo(xx-9,y-92);g.closePath();g.fill();g.stroke();}}g.beginPath();g.ellipse(x,f.y-12,190,25,0,0,7);g.stroke();}
else if(s.key==='special'){for(let n=0;n<3;n++){g.beginPath();g.ellipse(f.x,f.y-127,58+n*7+t*15,80+n*5,Math.sin(frame*.04)*.05,0,7);g.stroke();}line(g,[[f.x-20,f.y-230],[f.x-10,f.y-250],[f.x,f.y-234],[f.x+10,f.y-255],[f.x+24,f.y-229]],'#f2bbd2',3);}
else if(s.key==='light'){for(let n=0;n<3;n++){g.beginPath();g.moveTo(f.x+f.dir*35,f.y-170+n*12);g.quadraticCurveTo(f.x+f.dir*(90+t*30),f.y-155+n*12,f.x+f.dir*148,f.y-122+n*12);g.stroke();}}
else{for(let n=0;n<4;n++){const a=frame*.03+n*Math.PI/2;ellipse(g,f.x+f.dir*55+Math.cos(a)*17,f.y-135+Math.sin(a)*17,4,5,'#d984b2');}}g.restore();}
A.background=(g,f,m,motion=true,...args)=>f.c.id==='imu'?royal(g,f,m,motion):oldBg(g,f,m,motion,...args);
A.foreground=(g,f,m,motion=true,...args)=>{if(f.c.id==='imu')return;if(f.c.id==='marine'&&f.move){const s=f.move,n=f.moveFrame-s.startup;if(n>0&&n<=s.active){g.save();g.globalAlpha=.55;g.strokeStyle='#c6e6f4';g.lineWidth=s.key==='heavy'?4:2;const tip=root.DuelMotion.tip(f,m.frame);const [x,y]=tip;g.beginPath();g.arc(x-f.dir*12,y,20+s.damage*.1,-1.1,1.2);g.stroke();g.restore();}return;}return oldFg(g,f,m,motion,...args);};
A.projectile=(g,p,m,motion=true,...args)=>{if(m.fighters[p.owner].c.id!=='imu')return oldProj(g,p,m,motion,...args);g.save();g.translate(p.x,p.y);g.scale(Math.sign(p.vx),1);g.fillStyle='#241028';g.strokeStyle='#ed9bbc';g.lineWidth=2;g.shadowColor='#ef5f92';g.shadowBlur=motion?10:0;g.beginPath();g.moveTo(-68,-6);g.lineTo(-5,-12);g.lineTo(30,0);g.lineTo(-5,12);g.lineTo(-68,6);g.closePath();g.fill();g.stroke();for(let n=0;n<4;n++){g.globalAlpha=.25;line(g,[[-100+n*10,-12+n*8],[-35,Math.sin(m.frame*.1+n)*8]],'#d782bd',2);}g.restore();};
root.DuelBenchmarkVisual={robe,marine,royal,proceduralIds:[...ids]};
})(globalThis);
