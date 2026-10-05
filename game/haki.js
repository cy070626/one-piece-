(function(root){'use strict';
const config={armament:{name:'武装色',key:'H',cost:20,startup:12,duration:180,cooldown:480,boost:1.12},observation:{name:'见闻色',key:'G',cost:30,startup:10,duration:150,cooldown:600,reduction:.25,dodges:1},conqueror:{name:'霸王色',key:'Shift+H',cost:45,startup:30,duration:120,cooldown:720,boost:1.08,range:230,height:140,stun:18,weakStun:30,weakGap:15,immunity:180}};
function forCharacter(c,kind){return {...config[kind],...(c?.hakiTuning?.[kind]||{})};}
function stunFrames(src,dst){const s=config.conqueror;let frames=(src.c.willpower||70)-(dst.c.willpower||70)>=s.weakGap?s.weakStun:s.stun;if(dst.c.haki?.conqueror)frames=Math.ceil(frames/2);if(dst.hakiMode==='observation'&&dst.haki>0)frames=Math.ceil(frames/2);return frames;}
function description(){return 'H武装色：20能量，0.20秒前摇，3秒物理伤害+12%，8秒共享冷却，可穿透元素化。武装色生效时，物理K/L在支付技能费用后若仍有6能量，额外消耗6能量，起手前6帧获得霸体并减伤15%；只保护最初0.10秒，后续前摇与收招可打断，不提供无敌。防御、离开射程或等待护持结束可反制。G见闻色：30能量，0.17秒前摇，2.5秒非地形伤害减免25%；未出招、未防御且无硬直时自动闪避一次伤害判定，10秒共享冷却。Shift+H霸王色：45能量，0.50秒前摇，230像素内、垂直差140像素内释放无伤害震慑，通常0.30秒，本版意志值低至少15点者0.50秒；拥有霸王色的目标时长减半，见闻状态再减半。防御、霸体、无敌可抵抗，目标已有硬直或3秒震慑抗性时不能续控。随后2秒物理伤害+8%、护盾消耗+20%，12秒共享冷却。两道合法震慑同帧互相覆盖时相抵消。三种均须落地、非防御、非出招且无硬直时蓄力，可打断、不退款、互斥，结束后气竭1秒、所有伤害降低10%。';}
const api={config,forCharacter,stunFrames,description,version:'0.9.0'};root.DuelHaki=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
