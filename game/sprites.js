(function(root){'use strict';
const sheets={},portraits={},masks={},M=root.DuelSpriteData||{};
function index(f,frame){
 if(f.hp<=0||f.pose==='ko'||f.stun>0||f.pose==='hit')return 12;
 if(f.block||f.hakiWind)return 11;
 if(f.move?.key==='retreat')return 11;
 if(!f.move)return !f.ground?13:f.pose==='walk'?(Math.floor(frame/7)%2?1:0):0;
 const s=f.move,n=f.moveFrame,rank=['light','heavy','special','ult'].indexOf(['interact','recall1','recall2'].includes(s.key)?'special':s.key),wind=[2,4,6,8][rank],hit=[3,5,7,9][rank];
 if(n<=s.startup)return n<Math.min(4,s.startup*.2)?0:wind;
 if(n<=s.startup+s.active){if(f.c.id==='luffy'&&s.kind==='shield')return 6;const span=Math.ceil(s.active/s.hits),a=n-s.startup-1,j=Math.floor(a/span);if(f.c.id==='luffy'&&rank===3&&!(f.fruitSealed>0))return j%2?5:3;return rank===3&&j%2?10:hit;}
 return n<s.startup+s.active+Math.min(5,s.recovery*.25)?wind:0;
}
function appearance(f){const a=!(f.fruitSealed>0)&&(f.buffs?.awakening>0||f.formFrames>0||f.move&&f.move.key==='ult'&&f.moveFrame>=f.move.startup*.7&&f.moveFrame<=f.move.startup+f.move.active);const id=a&&f.c.id==='luffy'?'luffy-nika':a&&f.c.id==='kaido'?'kaido-dragon':a&&f.c.id==='lucci'?'lucci-beast':a&&f.c.id==='chopper'?'chopper-giant':f.c.id;return {...f.c,id,visualHeight:f.c.id==='moria'&&f.formFrames>0?315:a&&f.c.id==='luffy'?320:undefined};}
const height=c=>c.visualHeight|| (c.id==='sengoku-buddha'?330:c.id==='kaido-dragon'?240:c.id==='chopper-giant'?340:c.id==='lucci-beast'?265:c.id==='chopper'?155:['kaido','whitebeard','bigmom'].includes(c.id)?250:c.id==='moria'?255:c.id==='garp'?235:c.id==='blueno'?226:c.id==='cracker'?228:c.id==='sengoku'?245:c.id==='kuma'?255:c.id==='blackbeard'?235:c.id==='franky'||c.id==='jinbe'?226:c.id==='brook'?235:215);
function scale(c){return height(c)/M[c.id].frames[0].height;}
function paint(g,c,i,x,y,dir,alpha=1){const img=sheets[c.id],meta=M[c.id];if(!img||!meta)return false;const f=meta.frames[i],s=scale(c),[bx,by,bw,bh]=f.box;
 g.save();g.globalAlpha*=alpha;g.translate(x,y);g.scale(dir*s,s);g.translate(-f.anchor[0],-f.anchor[1]);
 const cache=c.id+':'+i;let mask=masks[cache];if(!mask){mask=masks[cache]=new Path2D();for(let n=0;n<f.outline.length;n++){const p=f.outline[n];n?mask.lineTo(...p):mask.moveTo(...p)}mask.closePath();}g.clip(mask);g.drawImage(img,bx,by,bw,bh,bx,by,bw,bh);g.restore();return true;
}
function draw(g,f,frame,alpha=1){return paint(g,appearance(f),index(f,frame),f.x,f.y,f.dir,alpha);}
function tip(f,frame){const c=appearance(f);if(!sheets[c.id]||!M[c.id])return null;const v=M[c.id].frames[index(f,frame)],s=scale(c);return [f.x+(v.tip[0]-v.anchor[0])*s*f.dir,f.y+(v.tip[1]-v.anchor[1])*s];}
function portrait(c){if(portraits[c.id])return portraits[c.id];if(!sheets[c.id])return null;const canvas=document.createElement('canvas');canvas.width=360;canvas.height=480;const g=canvas.getContext('2d');g.scale(1.75,1.75);paint(g,c,0,95,258,1);return portraits[c.id]=canvas.toDataURL('image/png');}
async function load(){await Promise.all(Object.keys(M).map(id=>new Promise(resolve=>{const im=new Image();im.onload=()=>{sheets[id]=im;resolve()};im.onerror=()=>resolve();im.src='assets/atlas-'+id+'.webp'})));return Object.keys(sheets);}
root.DuelSprites={draw,tip,portrait,index,appearance,load,version:'1.0.0',count:()=>Object.keys(sheets).length};root.DuelSprites.ready=typeof Image==='function'?load():Promise.resolve([]);if(typeof module!=='undefined'&&module.exports)module.exports=root.DuelSprites;
})(globalThis);

