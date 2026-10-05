const crew=[['luffy','路飞','船长'],['zoro','索隆','剑士'],['nami','娜美','航海士'],['usopp','乌索普','狙击手'],['sanji','山治','厨师'],['chopper','乔巴','船医'],['robin','罗宾','考古学家'],['franky','弗兰奇','船匠'],['brook','布鲁克','音乐家'],['jinbe','甚平','舵手']];
const rivals=DuelRoster.roster.filter(c=>c.faction!=='crew').map(c=>[c.id,c.name,c.role]);
const available=new Set(DuelRoster.roster.map(c=>c.id));
const info=document.querySelector('#info'),body=document.querySelector('#info-body');
let infoOpener;function showInfo(html){infoOpener=document.activeElement;body.innerHTML=html;info.showModal()}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==b.dataset.view);document.querySelectorAll('[data-view]').forEach(n=>n.classList.toggle('active',n===b));document.querySelector('.version').textContent={arena:'对决竞技场',guide:'玩法指南',crew:'草帽一伙',rivals:'对手档案',world:'航海世界'}[b.dataset.view];window.scrollTo(0,0)}));
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();document.querySelector('[data-view="arena"]').click()});
function renderCards(data,target){const note=document.createElement('p');note.className='rating-reference';note.textContent='评级仅供参考，实际表现取决于技能克制、操作、资源和场地，不代表固定的强弱或胜负顺序。';document.querySelector(target).before(note);for(const [id,name,role] of data){const c=DuelRoster.byId[id],extra={franky:['热情、豪放的船匠。','以机械改造的身体和造船技术帮助伙伴。','建造能够环游世界的梦想之船。'],jinbe:['沉稳、重视承诺的舵手。','擅长鱼人空手道与操船。','盼望不同种族能够平等相处。']}[id];const card=document.createElement('button');card.className='character';card.dataset.character=id;card.innerHTML='<span class="rank-badge rank-'+(c.assessment.grade)+'" aria-label="参考评级 '+(c.assessment.grade)+'">'+(c.assessment.grade)+'</span>'+(available.has(id)?`<img loading="lazy" src="${['luffy','zoro','brook','crocodile'].includes(c.id)?'assets/showcase-'+c.id+'.webp':DuelInk.portrait(c)}" alt="${name}">`:`<div class="placeholder" aria-label="${name}人物档案">${name[0]}</div>`)+`<div class="card-body"><h2>${name}</h2><p>${role} <span aria-hidden="true">↗</span></p></div>`;card.addEventListener('click',()=>showInfo(`<div class="eyebrow">人物档案 / 基础介绍</div><h2>${name}</h2><p>${c.profile.affiliation} · ${c.profile.identity}</p><p>${c.profile.journey}</p><p>${c?c.profile.nature:extra[0]}</p><p>${c?c.profile.ability:extra[1]}</p>${c?`${DuelSkillInfo.powerHtml(c)}<p class="rating-reference">评级仅供参考，胜负取决于技能克制、操作与资源。</p><h3>游戏参数</h3><p>生命 ${c.hp} · 移速 ${c.speed.toFixed(2)}像素/帧 · 能量上限100</p><div class="archive-skills">${c.skills.map((s,i)=>`<p><b>${['J','K','L','I'][i]} · ${s.name}</b><br>基础伤害 ${Number(s.damage.toFixed(1))}${s.hits>1?' × '+s.hits:''} · 能量${s.cost} · 前摇${(s.startup/60).toFixed(2)}秒 · 冷却${(s.cooldown/60).toFixed(1)}秒</p>`).join('')}</div><a href="game.html?player=${c.id}&manual=ult">查看完整技能、演出与反制说明 ↗</a><h3>玩法路线</h3><p>${c.playGuide}</p><h3>对决风格</h3><p>${c.role}。${c.profile.strength}</p><p>破绽：${c.profile.weakness}</p>`:`<p>${extra[2]}</p><p>此角色暂未加入对战名单。</p>`}<a href="${c?c.source:'https://one-piece.com/character/'+id+'/index.html'}" target="_blank" rel="noopener">查看${c.id==='marine'?'官方世界观参考':'官方人物资料'} ↗</a>`));document.querySelector(target).append(card)}}
renderCards(crew,'#crew-grid');renderCards(rivals,'#rival-grid');
document.querySelector('#rules').addEventListener('click',()=>showInfo('<div class="eyebrow">HOW TO PLAY</div><h2>对决规则</h2><p>单人对 CPU。标准模式每回合 60 秒，三局两胜；另有练习与生存模式。</p><ul><li>A / D 移动，W / 空格 二连跳，S 面向对手防御。</li><li>J 轻击，K 重击，L 特殊技，I 必杀技。E 短后撤：12能量、3秒冷却，仅落地空闲可用，无无敌或霸体，不能脱离硬直。</li><li>CPU分入门、进阶、专业三档，同一角色数值相同。角色卡显示评级、优势与弱点；赛后提供本局实际事件与整场走势复盘。</li><li>打中或被防住后的收招阶段，可向更高阶技能取消接招；挥空不能取消。</li><li>必杀按角色消耗60至85能量。前摇与收招可被命中打断；路飞觉醒有效期0.53秒霸体、减伤18%，仍受伤；其他专属阶段见技能说明。</li><li>区域大招提前标记落点，可移动离开。面向对手防御减伤88%，护盾耗尽会破防。霸体和无敌只在技能标注的阶段生效。</li><li>Shift+I极限释放：满100能量、必杀冷却结束、每回合一次。强化5秒攻击+15%；随后虚弱3秒，攻击与移速−15%，自动回能减半。高风险极限+20%后虚弱5秒、攻击与移速−20%。被打断不退款。防御、离开落点或等待虚弱期反击。</li><li>护盾耗尽会破防；连续攻击的伤害逐步递减。</li><li>蓝条初始20，上限100，自动恢复2.1/秒。命中、受伤、防御与饮料补能；生命明显落后时加快25%。相距260像素并连续1.5秒停止交战，且无本方弹幕、召唤物或地形时，回能提高至3.6/秒。道具有限倾向弱势方，双方均可抢。</li><li>P / Esc 暂停，每回合累计最多30秒。手机建议横屏，使用虚拟按键。</li></ul><p>倒计时结束时，按剩余生命比例判胜。角色数值为同人游戏规则，独立于原作战力。</p>'));
document.querySelector('.close').addEventListener('click',()=>info.close());
document.querySelectorAll('[data-practice]').forEach(b=>b.onclick=()=>{frame.src='game.html?mode=practice';game.showModal();frame.focus()});
const game=document.querySelector('#game-dialog'),frame=document.querySelector('#game-frame');
document.querySelector('#launch').addEventListener('click',()=>{frame.src='game.html';game.showModal();frame.focus()});
function closeGame(){frame.removeAttribute('src');game.close();(gameOpener||document.querySelector('#launch')).focus()}
document.querySelector('#game-close').addEventListener('click',closeGame);
game.addEventListener('cancel',e=>{e.preventDefault();closeGame()});
window.addEventListener('message',e=>{if(e.source===frame.contentWindow&&e.origin===location.origin&&e.data?.type==='duel-exit')closeGame()});

document.querySelectorAll('[data-study]').forEach(b=>b.addEventListener('click',()=>{frame.src='game.html?player='+encodeURIComponent(b.dataset.study)+'&manual='+encodeURIComponent(b.dataset.skill);game.showModal();frame.focus()}));

DuelSprites.ready.then(()=>document.querySelectorAll('.character').forEach(card=>{const img=card.querySelector('img'),c=DuelRoster.byId[card.dataset.character];if(img&&c)img.src=DuelInk.portrait(c)}));

document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{frame.src=b.dataset.mode==='team'?'team.html':"game.html?mode="+encodeURIComponent(b.dataset.mode);game.showModal();frame.focus()}));

document.querySelector('#ability-table').innerHTML='<table><thead><tr><th>角色</th><th>果实与原作能力</th><th>本版霸气标注</th><th>L 特殊技与限制</th></tr></thead><tbody>'+DuelRoster.roster.map(c=>{const s=c.skills[2],h=c.haki;return '<tr><td><a href="game.html?player='+c.id+'&manual=special">'+c.name+' ↗</a></td><td>'+c.fruit.label+'</td><td>'+[h.armament?'武装色':null,h.conqueror?'霸王色':null,h.observation?'见闻色':null].filter(Boolean).join(' / ')+'</td><td>'+s.name+' · '+s.cost+'能量 · 冷却'+(s.cooldown/60).toFixed(1)+'秒'+(s.elementalFrames?' · 元素化'+(s.elementalFrames/60).toFixed(1)+'秒':'')+'</td></tr>'}).join('')+'</tbody></table><p>点击角色查看完整条件与反制。见闻色提供有限减伤与一次自动闪避。能力类攻击穿透元素化、霸王强化与技能数值采用本游戏的均衡规则。</p>';

document.querySelector('#haki-guide').textContent=DuelHaki.description();
let currentView='arena',viewHistory=[];const viewBack=document.querySelector('#view-back');
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.view!==currentView){viewHistory.push(currentView);currentView=b.dataset.view;}viewBack.hidden=currentView==='arena';}));
viewBack.onclick=()=>{const previous=viewHistory.pop()||'arena';document.querySelector('[data-view="'+previous+'"]').click();viewHistory.pop();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!info.open&&!game.open&&currentView!=='arena'){e.preventDefault();viewBack.click();}});
info.addEventListener('close',()=>infoOpener?.focus());

let gameOpener=null;document.addEventListener('click',e=>{const entry=e.target.closest('#launch,[data-mode],[data-practice],[data-study],a[href^="game.html"]');if(!entry)return;gameOpener=entry;if(entry.tagName==='A'){e.preventDefault();frame.src=entry.getAttribute('href');game.showModal();frame.focus();}});

if(location.hash==='#guide')document.querySelector('[data-view=guide]').click();

document.querySelectorAll(".guide-grid article").forEach(a=>{const paragraphs=a.querySelectorAll(":scope > p");if(paragraphs.length<2)return;const d=document.createElement("details"),summary=document.createElement("summary");summary.textContent="条件、限制与反制";d.append(summary);for(const para of [...paragraphs].slice(1))d.append(para);a.append(d);});

const powerGuide=document.querySelector('.power-guide');if(powerGuide){const fold=document.createElement('details'),summary=document.createElement('summary');summary.textContent='果实与霸气如何对抗';const title=powerGuide.querySelector('h3');if(title)title.remove();fold.append(summary);while(powerGuide.firstChild)fold.append(powerGuide.firstChild);powerGuide.append(fold);}
