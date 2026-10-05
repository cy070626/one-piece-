(function(root){
'use strict';
// Continuous vector silhouettes. No bitmap crops or joint texture fragments.
const P={luffy:['#e94d3a','#377ab7','#efbb91','#182331'],zoro:['#eee6cc','#293f37','#e7b28a','#83b86a'],sanji:['#202c43','#202c43','#efc49d','#f0cb55'],nami:['#e7e8de','#517faa','#f2c8ac','#f08930'],enel:['#eee8d4','#ded3b0','#e7bd8e','#e8e4cf'],crocodile:['#3c443b','#423b36','#d4ac89','#202c2b'],lucci:['#2a3543','#25303e','#e1b593','#141e29'],kaido:['#654479','#322b42','#c79774','#182735'],usopp:['#c0a272','#8f7651','#c99d73','#272725'],chopper:['#418fc4','#c65375','#c99660','#b48653'],robin:['#345174','#4a3b6b','#efc6b0','#142d48'],brook:['#252c40','#22283b','#efe7c8','#202331'],franky:['#e45542','#233e65','#deb085','#50b7cd'],jinbe:['#d89b48','#563e45','#66b7c4','#1b3d56']};
for(const id of ['whitebeard','shanks','bigmom','blackbeard','buggy','doflamingo','mihawk','akainu','kizaru','kuzan','law'])P[id]=['#495972','#273340','#e0ba99','#403942'];
Object.assign(P,{marco:['#8662b5','#334a64','#efc099','#e2c778'],sengoku:['#eee9dd','#dfdfd5','#ddbb92','#17242b'],kuma:['#253b46','#a4acb5','#d4ac90','#18252b'],bartolomeo:['#683c57','#3a3b51','#e3b596','#6bc991']});
function path(g,commands,fill,stroke='#172637',w=1.7){g.beginPath();for(const [op,...v]of commands){if(op==='M')g.moveTo(...v);else if(op==='L')g.lineTo(...v);else if(op==='Q')g.quadraticCurveTo(...v);else if(op==='C')g.bezierCurveTo(...v);else if(op==='Z')g.closePath();}if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.stroke();}}
function oval(g,x,y,rx,ry,col,stroke='#172637',rot=0){g.beginPath();g.ellipse(x,y,rx,ry,rot,0,Math.PI*2);g.fillStyle=col;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=1.5;g.stroke();}}
function line(g,pts,col,w=1.5){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.strokeStyle=col;g.lineWidth=w;g.stroke();}
function shade(g,c,x=-25,y=-80){const a=g.createLinearGradient(x,y,x+70,y+30);a.addColorStop(0,c);a.addColorStop(.55,c);a.addColorStop(1,'#26364a');return a;}
function limb(g,a,b,c,width,col,endWidth=width*.73){
 const normal=(u,v)=>{const d=Math.max(.01,Math.hypot(v[0]-u[0],v[1]-u[1]));return[-(v[1]-u[1])/d,(v[0]-u[0])/d];},n=normal(a,b),k=normal(b,c),mid=[(n[0]+k[0])/2,(n[1]+k[1])/2],at=(v,z,w,sign)=>[v[0]+z[0]*w*sign,v[1]+z[1]*w*sign],wa=width*.5,wb=width*.48,wc=endWidth*.5,A=at(a,n,wa,1),B=at(b,mid,wb,1),C=at(c,k,wc,1),D=at(c,k,wc,-1),E=at(b,mid,wb,-1),F=at(a,n,wa,-1);
 path(g,[['M',...A],['Q',...B,...C],['Q',c[0]+k[0]*wc*1.1,c[1]+k[1]*wc*1.1,...D],['Q',...E,...F],['Q',a[0]-n[0]*wa*.7,a[1]-n[1]*wa*.7,...A],['Z']],shade(g,col,a[0]-wa,a[1]));
 line(g,[[a[0]+n[0]*wa*.55,a[1]+n[1]*wa*.55],[b[0]+mid[0]*wb*.55,b[1]+mid[1]*wb*.55]],'#ffffff22',1.3);
}
function hand(g,x,y,a,skin,open=false,size=1,hoof=false){g.save();g.translate(x,y);g.rotate(a);g.scale(size,size);
 if(hoof){path(g,[['M',-8,-8],['Q',0,-12,8,-8],['L',9,6],['L',-9,6],['Z']],'#674735');line(g,[[0,-9],[0,6]],'#d0b18b',1.8);g.restore();return;}
 path(g,[['M',-7,-5],['Q',-9,-9,-3,-10],['L',5,-9],['Q',10,-5,8,2],['L',4,7],['Q',-3,9,-7,3],['Z']],skin);
 if(open){for(let j=0;j<4;j++){const yy=-7+j*3.8;path(g,[['M',3,yy],['Q',10,yy-1,16-j*.9,yy+.5],['Q',18-j*.9,yy+3,4,yy+3]],skin,'#a77a61',.9);}path(g,[['M',-3,5],['Q',5,15,9,10],['Q',8,7,4,4]],skin);}
 else{line(g,[[1,-7],[4,-3],[3,4]],'#a1775f',1);line(g,[[-5,-2],[1,0],[3,4]],'#a1775f',1);}
 g.restore();}
function star(g,x,y,r,col){const cmds=[];for(let j=0;j<10;j++){const a=-Math.PI/2+j*Math.PI/5,k=j%2?r*.45:r;cmds.push([j?'L':'M',x+Math.cos(a)*k,y+Math.sin(a)*k]);}cmds.push(['Z']);path(g,cmds,col,null);}
function head(g,id,skin,hair,p){
 g.save();g.translate(0,-101);g.rotate(p.head);const female=id==='nami'||id==='robin';
 if(['nami','robin'].includes(id))path(g,[['M',-25,-43],['Q',-31,-11,-30,22],['L',-18,10],['L',16,19],['Q',35,-1,24,-47],['Z']],hair);
 if(id==='brook'){
  oval(g,0,-34,39,41,hair);for(let j=0;j<13;j++)oval(g,Math.cos(j*.49)*32,-34+Math.sin(j*.49)*34,11,12,hair,null);
  path(g,[['M',-21,-36],['Q',-21,-61,10,-56],['Q',30,-45,18,-18],['L',9,-7],['L',-8,-7],['L',-19,-20],['Z']],skin);
  oval(g,-9,-33,6,8,'#29323d',null);oval(g,10,-34,6,8,'#29323d',null);path(g,[['M',1,-26],['L',-3,-20],['L',6,-20],['Z']],'#374453',null);line(g,[[-12,-12],[12,-12]],'#36424a',2);for(let j=-9;j<=10;j+=5)line(g,[[j,-15],[j,-7]],'#596067',1);
  path(g,[['M',-27,-58],['L',-20,-88],['L',20,-88],['L',26,-58],['Z']],'#303646');oval(g,0,-57,37,6,'#202a39');line(g,[[-24,-64],[24,-64]],'#d7a84d',4);g.restore();return;
 }
 if(id==='chopper'){
  oval(g,-25,-26,11,8,skin);oval(g,25,-26,11,8,skin);oval(g,0,-21,29,27,skin);
  oval(g,-11,-25,4,6,'#202f40',null);oval(g,11,-25,4,6,'#202f40',null);oval(g,0,-14,10,8,'#ebd3b6',null);oval(g,0,-19,4,3,'#4c79b5',null);line(g,[[-4,-11],[0,-8],[5,-11]],'#6b4e3e',1.2);
  for(const sign of [-1,1]){line(g,[[sign*18,-47],[sign*30,-66],[sign*26,-85]],'#906844',6);line(g,[[sign*30,-65],[sign*43,-72],[sign*47,-84]],'#906844',5);line(g,[[sign*26,-74],[sign*14,-81]],'#906844',4);}
  path(g,[['M',-27,-35],['L',-25,-57],['Q',0,-77,25,-57],['L',27,-35],['Z']],'#db7088');oval(g,0,-35,34,6,'#76b6d3');line(g,[[-6,-57],[6,-45]],'#fff4e3',6);line(g,[[6,-57],[-6,-45]],'#fff4e3',6);g.restore();return;
 }
 const broad=id==='jinbe'||id==='kaido'||id==='franky',w=broad?31:female?23:25;
 oval(g,-w+2,-25,6,9,skin);path(g,[['M',-w,-43],['Q',-w-3,-59,1,-61],['Q',w+10,-52,w,-26],['L',w-3,-12],['Q',11,8,-6,1],['Q',-w,-9,-w,-43],['Z']],shade(g,skin,-w,-50));
 // Nose, eyes and expression share one perspective and follow the neck rotation.
 const squint=['zoro','lucci','kaido','crocodile','jinbe'].includes(id);for(const [x,y]of [[-9,-32],[12,-34]]){path(g,[['M',x-6,y-3],['Q',x,y-(female?8:5),x+6,y-2],['Q',x+2,y+6,x-5,y+3],['Z']],'#f7f2df');oval(g,x+1,y,2.4,squint?3:4.3,female?'#49627b':'#223748',null);line(g,[[x-7,y-8],[x+5,y-10]],hair,2);}
 path(g,[['M',5,-29],['L',9,-18],['L',3,-17]],null,'#ad795d',1.2);path(g,[['M',-3,-7],['Q',7,-3,16,-9]],null,'#815a50',1.5);
 if(id==='usopp')path(g,[['M',6,-26],['L',39,-20],['Q',43,-15,9,-16]],skin,'#a67d5e',1.2);
 if(id==='jinbe'){for(const x of [-10,14])path(g,[['M',x,-8],['L',x+3,-20],['L',x+6,-8],['Z']],'#f4e8c7');path(g,[['M',-16,-48],['Q',0,-62,21,-47],['L',15,-43],['L',-9,-43],['Z']],hair);line(g,[[-22,-13],[-29,-5],[-14,1]],hair,5);line(g,[[19,-10],[26,-3],[13,1]],hair,5);}
 else if(id==='enel'){path(g,[['M',-25,-42],['Q',-32,-64,0,-64],['Q',27,-65,28,-42],['Z']],hair);for(let j=-18;j<25;j+=7)line(g,[[j,-60],[j+4,-47]],'#c0baa6',1);line(g,[[-26,-18],[-34,5],[-29,15]],skin,5);oval(g,-29,13,4,5,'#e2c56f');}
 else if(id==='zoro'){const cmds=[['M',-27,-40]];for(let j=0;j<10;j++)cmds.push(['L',-29+j*6,-49-(j%2?14:5)]);cmds.push(['L',26,-31],['L',10,-43],['L',-5,-37],['Z']);path(g,cmds,hair);line(g,[[-14,-36],[-9,-22]],'#765a4d',1.4);for(let j=0;j<3;j++)oval(g,-25+j*3,-16,2,3,'#d8c26d');}
 else if(id==='sanji'){path(g,[['M',-28,-35],['Q',-34,-62,0,-63],['Q',29,-65,30,-39],['L',5,-17],['L',8,-44],['L',-3,-25],['L',-7,-47],['Z']],hair);path(g,[['M',10,-44],['C',22,-48,27,-39,20,-38],['C',16,-37,18,-43,21,-42]],null,'#6d633c',1.3);line(g,[[15,-9],[27,-7]],'#f0e9cf',2);}
 else if(id==='nami'||id==='robin'){path(g,[['M',-27,-36],['Q',-31,-67,3,-63],['Q',32,-60,27,-35],['L',17,-51],['Q',1,-38,-11,-40],['L',-20,-23],['Z']],hair);for(let j=0;j<3;j++)path(g,[['M',-18+j*7,-55],['Q',-30+j*8,-20,-25+j*5,11]],null,id==='nami'?'#fac46d':'#4a6481',1.3);}
 else if(id==='franky'){path(g,[['M',-30,-43],['L',-24,-67],['L',-13,-58],['L',-6,-77],['L',9,-59],['L',24,-69],['L',30,-44],['Z']],hair);line(g,[[-24,-38],[-4,-36]],'#262f3d',5);line(g,[[7,-37],[26,-40]],'#262f3d',5);path(g,[['M',0,-25],['L',9,-25],['L',6,-15],['L',-1,-15],['Z']],'#bdc7c4');path(g,[['M',-8,-7],['L',17,-9],['L',13,0],['L',-4,0],['Z']],'#edf3e8');}
 else if(id==='kaido'){path(g,[['M',-31,-42],['Q',-34,-73,7,-63],['Q',36,-58,32,-23],['L',44,14],['L',20,0],['L',12,-42],['L',-20,-44],['L',-33,12],['Z']],hair);for(const sign of [-1,1])path(g,[['M',sign*22,-50],['Q',sign*46,-54,sign*40,-80],['Q',sign*54,-58,sign*36,-41],['Z']],'#e0cc9f');line(g,[[-10,-8],[-28,3],[-44,-1]],hair,5);line(g,[[14,-8],[30,1],[47,-5]],hair,5);}
 else{path(g,[['M',-27,-39],['Q',-36,-61,-2,-65],['Q',30,-65,30,-42],['L',18,-50],['L',10,-41],['L',0,-49],['L',-8,-40],['L',-16,-48],['L',-24,-27],['Z']],hair);}
 if(id==='luffy'){oval(g,0,-55,38,7,'#e8c175');path(g,[['M',-27,-56],['Q',-30,-84,0,-85],['Q',29,-84,27,-56],['Z']],'#ebc981');line(g,[[-27,-61],[27,-61]],'#bc473b',5);for(let j=-20;j<22;j+=8)line(g,[[j,-79],[j+3,-69]],'#cdab69',.8);line(g,[[15,-22],[20,-20]],'#845c4d',1);}
 if(id==='lucci'){path(g,[['M',-25,-52],['L',-22,-91],['L',23,-91],['L',28,-53],['Z']],'#1c2a38');oval(g,0,-52,37,6,'#233548');line(g,[[-25,-61],[26,-61]],'#93a3b1',5);path(g,[['M',-10,-3],['L',1,5],['L',14,-3]],null,'#172637',3);}
 if(id==='usopp'){path(g,[['M',-26,-43],['Q',-27,-68,1,-68],['Q',25,-66,28,-43],['Z']],'#c7ac65');oval(g,-8,-58,11,7,'#d8d6b5');oval(g,16,-59,11,7,'#d8d6b5');oval(g,-8,-58,7,4,'#607589');oval(g,16,-59,7,4,'#607589');}
 if(id==='crocodile'){line(g,[[-21,-25],[22,-24]],'#93664e',1.5);for(let j=-18;j<22;j+=5)line(g,[[j,-27],[j,-21]],'#8b604b',.8);line(g,[[15,-9],[31,-6]],'#c29559',4);}
 g.restore();
}
function weapon(g,id,x,y,a){g.save();g.translate(x,y);g.rotate(a);
 if(id==='zoro'||id==='brook'){path(g,[['M',0,-2],['L',87,-2],['L',99,0],['L',87,3],['L',0,3],['Z']],'#e4f0ed','#647f92',1);line(g,[[5,0],[89,0]],'#ffffff',.8);line(g,[[-3,-9],[-3,9]],'#d7b56a',4);line(g,[[-19,0],[-4,0]],'#4f4160',6);}
 if(id==='nami'||id==='enel'){line(g,[[-46,0],[82,0]],id==='nami'?'#78bed2':'#debd65',5);for(const x of [-40,0,41,80])oval(g,x,0,4,4,'#e1d4a3',null);}
 if(id==='kaido'){line(g,[[-22,0],[19,0]],'#9c8a72',7);path(g,[['M',20,-12],['L',92,-12],['Q',105,0,92,12],['L',20,12],['Z']],'#2b3a49');for(let j=29;j<91;j+=14)path(g,[['M',j,-12],['L',j+5,-22],['L',j+9,-12],['Z']],'#899cac');}
 if(id==='usopp'){line(g,[[0,16],[0,-11],[-16,-31]],'#678c53',5);line(g,[[0,-11],[16,-31]],'#678c53',5);line(g,[[-16,-31],[16,-31]],'#d6ba91',1.5);}
 if(id==='crocodile'){g.beginPath();g.arc(5,1,12,-1.8,2.1);g.strokeStyle='#d8b361';g.lineWidth=5;g.stroke();}
 g.restore();}
Object.assign(P,{cracker:['#b95687','#6a4939','#dfb995','#905caa'],ain:['#45556f','#30384d','#efc5b2','#507fbd'],blueno:['#252d38','#242d39','#d7b497','#20242c'],ace:['#e8b58d','#30313b','#e8b58d','#242b35'],garp:['#ecebe6','#e6e5df','#ddb494','#d0d3d0'],hancock:['#aa3150','#b54661','#edc6b3','#1d2630'],moria:['#352b48','#d89442','#c4b6d3','#af4b48']});P.imu=['#211a2e','#211a2e','#402a44','#1a1525'];P.marine=['#eeeeec','#e7e6df','#dcb79b','#283849'];P.magellan=['#272331','#27202e','#bca3a1','#201e24'];P.shiryu=['#293039','#202733','#c7a38d','#27212b'];function draw(g,f,frame,p,alpha=1){const id=f.c.id,[cloth,pants,skin,hair]=P[id],scale=id==='chopper'?.82:id==='kaido'?1.1:1;
 g.save();g.translate(f.x,f.y);g.scale(f.dir*scale,scale);g.globalAlpha=alpha*(f.invul>0?.65:1);g.translate(0,-79+p.hip);g.lineCap='round';g.lineJoin='round';
 const broad=id==='franky'?1.3:id==='jinbe'?1.5:id==='kaido'?1.2:1,sw=22*broad;
 // Boots and trousers are single tapered paths, with a small fold at each bent knee.
 for(let i=0;i<2;i++){const[kx,ky,fx,fy]=p.legs[i];limb(g,[i?12:-12,0],[kx,ky],[fx,fy-6],id==='jinbe'?26:id==='franky'?20:18,pants,12);if(id==='luffy')limb(g,[kx,ky+2],[fx,fy-15],[fx,fy-5],12,skin,10);g.save();g.translate(fx,fy-4);if(fy<40)g.rotate(-.6);path(g,[['M',-7,-5],['Q',8,-11,17,-3],['L',22,4],['Q',6,10,-9,5],['Z']],id==='luffy'?'#bea076':'#243b4e');line(g,[[-8,5],[20,5]],'#8397a3',1.5);g.restore();}
 g.save();g.rotate(p.lean);g.scale(1+(p.inflate||0),1);
 if(['robin','crocodile','brook','kaido'].includes(id))path(g,[['M',-sw,-81],['Q',-48,-70,-49,22+Math.sin(frame*.09)*3],['L',-15,5],['L',26,22],['L',47,13],['Q',45,-55,sw,-81],['Z']],id==='crocodile'?'#415c4b':cloth);
 if(id==='robin')path(g,[['M',-25,-81],['Q',-34,-50,-30,8],['L',-17,-5],['L',-11,-71],['Z']],'#203853');
 if(id==='enel'){for(let j=0;j<4;j++){const a=j*Math.PI/2;line(g,[[-19,-69],[-40+Math.cos(a)*20,-90+Math.sin(a)*20]],'#b59a58',3);oval(g,-40+Math.cos(a)*20,-90+Math.sin(a)*20,11,11,'#d2b66e');oval(g,-40+Math.cos(a)*20,-90+Math.sin(a)*20,7,7,'#e9dbc0');}}
 const arm=(coords,back)=>{const[ex,ey,hx,hy]=coords,start=[back?-sw:sw,-72],bare=['luffy','zoro','enel','kaido','usopp','chopper','franky','jinbe'].includes(id),col=bare?skin:cloth,large=id==='chopper'&&f.move&&['heavy','ult'].includes(f.move.key),robot=id==='franky';limb(g,start,[ex,ey],[hx,hy],robot?32:large?25:14,col,robot?30:large?23:10);if(robot){oval(g,ex,ey,17,17,'#e15d48');star(g,ex,ey,10,'#d7e6e3');line(g,[[hx-7,hy-7],[hx+7,hy+7]],'#5bb2c7',4);}hand(g,hx,hy,Math.atan2(hy-ey,hx-ex),skin,['nami','robin','enel','jinbe'].includes(id),robot?1.45:large?1.75:1,id==='chopper');};
 arm(p.back,true);
 const bareTorso=['luffy','enel','kaido','franky'].includes(id),base=bareTorso?skin:cloth;
 path(g,[['M',-sw,-85],['Q',-sw-8,-61,-sw+1,-30],['Q',-sw+3,-7,-19,5],['Q',0,12,20,4],['Q',sw-4,-10,sw+2,-33],['Q',sw+9,-66,sw,-85],['Q',0,-93,-sw,-85],['Z']],shade(g,base,-sw,-75));
 if(id==='luffy'){path(g,[['M',-23,-86],['L',-6,-88],['Q',-15,-61,-8,-14],['L',-24,-11],['Z']],cloth);path(g,[['M',6,-88],['L',23,-86],['Q',28,-46,20,-12],['L',10,-12],['Z']],cloth);line(g,[[-8,-47],[9,-34]],'#9d7056',2);line(g,[[8,-47],[-8,-34]],'#9d7056',2);}
 if(id==='zoro'){path(g,[['M',-23,-86],['L',-6,-89],['L',5,-43],['L',-13,-65],['Z']],'#fbf4dd');path(g,[['M',7,-89],['L',22,-86],['L',9,-33],['L',-2,-52],['Z']],'#c9cdb0');line(g,[[-20,-11],[22,-11]],'#6da76c',11);for(let j=-15;j<22;j+=7)line(g,[[j,-15],[j,-7]],'#4c7853',1);}
 if(['sanji','lucci','crocodile','brook'].includes(id)){path(g,[['M',-9,-87],['L',12,-87],['L',2,-46],['Z']],id==='sanji'?'#578cab':'#e6e2ce');path(g,[['M',-21,-84],['L',-10,-88],['L',-1,-49],['L',-16,-67],['Z']],'#43556a');path(g,[['M',12,-88],['L',23,-82],['L',15,-62],['L',1,-49],['Z']],'#43556a');line(g,[[1,-80],[6,-52]],id==='brook'?'#d79e43':'#293542',5);for(let j=0;j<3;j++)oval(g,11,-35+j*11,2,2,'#d5b776',null);}
 if(id==='nami'){path(g,[['M',-20,-82],['Q',-6,-64,20,-81],['L',14,-44],['Q',0,-31,-15,-45],['Z']],'#ecebe0');line(g,[[-17,-69],[16,-62]],'#539c90',4);line(g,[[-13,-52],[14,-49]],'#539c90',3);}
 if(id==='robin'){path(g,[['M',-19,-86],['L',-3,-62],['L',10,-85]],null,'#b6c9cf',2);line(g,[[0,-63],[0,-12]],'#7391a6',1);oval(g,0,-12,6,3,'#d5bc6d',null);}
 if(id==='usopp'){path(g,[['M',-22,-83],['L',-14,-86],['L',-2,-15],['L',-10,-13],['Z']],'#776344');path(g,[['M',13,-86],['L',22,-83],['L',12,-14],['L',4,-14],['Z']],'#776344');path(g,[['M',-16,-50],['L',17,-50],['L',12,-5],['L',-13,-5],['Z']],'#a98d5e');oval(g,0,-26,11,9,'#c9b17a');}
 if(id==='chopper'){path(g,[['M',-18,-72],['L',17,-39],['L',11,-33],['L',-22,-64],['Z']],'#f2dcbf');path(g,[['M',18,-72],['L',-15,-39],['L',-10,-33],['L',22,-63],['Z']],'#f2dcbf');}
 if(id==='franky'){path(g,[['M',-29,-85],['L',-13,-88],['L',-18,-45],['L',-35,-41],['Z']],cloth);path(g,[['M',14,-88],['L',29,-84],['L',34,-43],['L',20,-48],['Z']],cloth);line(g,[[-9,-60],[0,-54],[11,-60]],'#ad8064',2);line(g,[[0,-55],[0,-18]],'#ad8064',1.5);for(let j=0;j<3;j++)line(g,[[-11,-45+j*9],[11,-45+j*9]],'#ad8064',1);star(g,-25,-67,6,'#e5dc9d');star(g,25,-65,6,'#e5dc9d');}
 if(id==='jinbe'){path(g,[['M',-33,-86],['L',-2,-58],['L',28,-85],['L',30,-6],['L',-28,-6],['Z']],cloth);line(g,[[-23,-84],[7,-25]],'#eee2bd',8);line(g,[[23,-83],[-12,-11]],'#eee2bd',8);for(let j=0;j<3;j++){path(g,[['M',-22+j*19,-38],['Q',-17+j*19,-46,-11+j*19,-36],['Q',-18+j*19,-30,-22+j*19,-38],['Z']],'#58394d');}line(g,[[-28,-9],[29,-9]],'#693f50',12);}
 if(id==='enel'||id==='kaido'){line(g,[[-13,-59],[0,-53],[14,-59]],'#a87b61',1.5);line(g,[[0,-54],[0,-17]],'#a87b61',1);for(let j=0;j<2;j++)line(g,[[-9,-39+j*10],[10,-39+j*10]],'#a87b61',1);line(g,[[-25,-5],[25,-5]],id==='enel'?'#6b5689':'#8b6a9e',10);}
 limb(g,[0,-90],[0,-99],[0,-104],12,skin,12);head(g,id,skin,hair,p);arm(p.front,false);weapon(g,id,p.front[2],p.front[3],p.weapon);
 if(id==='zoro'&&f.move&&['heavy','special','ult'].includes(f.move.key)){weapon(g,id,p.back[2],p.back[3],-.5-p.weapon*.65);if(['special','ult'].includes(f.move.key))weapon(g,id,16,-109,-.05);}
 if(id==='lucci'&&f.move?.key==='light')line(g,[[p.front[2],p.front[3]],[p.front[2]+18,p.front[3]]],skin,3);
 g.restore();g.restore();return p;
}
const portraits={};function portrait(c){if(['cracker','ain','blueno','ace','garp','hancock','moria'].includes(c.id))return 'assets/concept-'+c.id+'.webp';const sprite=root.DuelSprites?.portrait(c);if(sprite)return sprite;if(portraits[c.id])return portraits[c.id];const canvas=document.createElement('canvas');canvas.width=360;canvas.height=480;const g=canvas.getContext('2d');g.scale(1.75,1.75);const f={c,x:100,y:260,dir:1,pose:'idle',ground:true,stun:0,invul:0};draw(g,f,0,root.DuelMotion.sample(f,0));return portraits[c.id]=canvas.toDataURL('image/png');}
const api={draw,portrait,version:'1.0.0'};root.DuelInk=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
