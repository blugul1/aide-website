const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp=(a,b,t)=>a+(b-a)*t;
/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14});
document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el=>io.observe(el));
/* stats count-up on scroll (owner 2026-11-20 — About/team/assessments strips: numbers count up as they scroll in) */
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bars = document.querySelectorAll('.stats .stat b');
  function countUp(b){
    var node = b.firstChild;
    if(!node) return;
    var m = /(\d+)(\+?)/.exec(node.textContent || '');
    if(!m) return;
    var target = parseInt(m[1], 10), plus = m[2] || '';
    if(reduceMotion){ node.textContent = target + plus + ' '; return; }
    var start = null, dur = 1200;
    function tick(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased) + plus + ' ';
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window && bars.length){
    var sio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ countUp(en.target); sio.unobserve(en.target); }
      });
    }, {threshold: 0.4});
    bars.forEach(function(b){ sio.observe(b); });
  } else {
    bars.forEach(countUp);
  }
})();
/* hero — revolving picture ring engine */
const stage=document.getElementById('stage'),ring=document.getElementById('ring'),orbit=document.getElementById('orbit'),glow=document.getElementById('glow');
const panels=ring?[...ring.children]:[];
const STEP=panels.length?360/panels.length:90;
function layoutRing(){if(!ring)return;const w=ring.clientWidth,R=Math.round((w/2)/Math.tan(Math.PI/panels.length))+42;panels.forEach((p,i)=>p.style.transform=`rotateY(${i*STEP}deg) translateZ(${R}px)`)}
layoutRing();addEventListener('resize',layoutRing);
let ang=0,vel=0,dragging=false,lastX=0,hoverPause=false,paused=false,snapTarget=null,lastT=performance.now(),lastFront=-1;
const BASE=RM?0:0.0105;
(function loop(t){const dt=Math.min(50,t-lastT);lastT=t;
  if(snapTarget!==null&&!dragging){ang+=(snapTarget-ang)*.11;if(Math.abs(snapTarget-ang)<.15){ang=snapTarget;snapTarget=null}}
  else{if(!dragging&&!hoverPause&&!paused)ang+=BASE*dt;if(!dragging&&Math.abs(vel)>.001){ang+=vel;vel*=.95}}
  if(ring){const fy=RM?0:Math.sin(t/1700)*7;ring.style.transform=`translateY(${fy}px) rotateX(-7deg) rotateY(${ang}deg)`;
    if(panels.length){const fi=((Math.round(-ang/STEP)%panels.length)+panels.length)%panels.length;if(fi!==lastFront){lastFront=fi;panels.forEach((p,j)=>p.classList.toggle('front',j===fi))}}}
  requestAnimationFrame(loop)})(performance.now());
if(stage){
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('.orbit-btn'))return;dragging=true;lastX=e.clientX;vel=0;snapTarget=null;stage.setPointerCapture(e.pointerId)});
  stage.addEventListener('pointermove',e=>{if(!dragging)return;const d=e.clientX-lastX;lastX=e.clientX;ang+=d*.32;vel=d*.32});
  const end=()=>{dragging=false};
  stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  stage.addEventListener('pointerenter',()=>hoverPause=true);
  stage.addEventListener('pointerleave',()=>hoverPause=false);
}
const snap=dir=>{snapTarget=Math.round(ang/STEP)*STEP+dir*STEP};
document.getElementById('orbPrev')?.addEventListener('click',()=>snap(1));
document.getElementById('orbNext')?.addEventListener('click',()=>snap(-1));
const orbPause=document.getElementById('orbPause');
function setPaused(v){paused=v;if(orbPause){orbPause.setAttribute('aria-pressed',String(v));orbPause.setAttribute('aria-label',v?'Play the rotating photos':'Pause the rotating photos');orbPause.textContent=v?'▶':'❚❚'}}
orbPause?.addEventListener('click',()=>setPaused(!paused));
stage?.addEventListener('focusin',()=>{if(!paused)setPaused(true)});
/* stage parallax + cursor glow */
if(stage&&matchMedia('(pointer:fine)').matches&&!RM){
  let tx=0,ty=0,cx=0,cy=0;
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*2;ty=((e.clientY-r.top)/r.height-.5)*2});
  stage.addEventListener('pointerleave',()=>{tx=0;ty=0});
  (function ploop(){cx=lerp(cx,tx,.06);cy=lerp(cy,ty,.06);if(orbit)orbit.style.transform=`rotateY(${cx*3.5}deg) rotateX(${-cy*2.5}deg)`;requestAnimationFrame(ploop)})();
  const hero=document.querySelector('.hero');let gx=0,gy=0,mx=0,my=0;
  {const hr=hero.getBoundingClientRect();mx=hr.width*.7;my=hr.height*.34;gx=mx;gy=my}
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
  (function gloop(){gx=lerp(gx,mx,.06);gy=lerp(gy,my,.06);glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(gloop)})();
}
/* magnetic buttons */
if(matchMedia('(pointer:fine)').matches&&!RM){document.querySelectorAll('.magnetic').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
  b.addEventListener('pointerleave',()=>{b.style.transform=''});
})}
/* scroll scrub engine: scene zoom/shade/lines + watermark drift */
const scene=document.querySelector('.scene'),sImg=document.getElementById('sceneImg'),sShade=document.getElementById('sceneShade'),lines=document.querySelectorAll('.scene .line'),wm=document.getElementById('wmText'),prog=document.getElementById('progress'),navEl=document.querySelector('nav');
function scrub(){
  const doc=document.documentElement,max=doc.scrollHeight-innerHeight;
  if(prog)prog.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;
  if(navEl)navEl.classList.toggle('scrolled',scrollY>40);
  if(RM){lines.forEach(el=>{el.style.opacity=1;el.style.transform='none'});if(sImg){sImg.style.transform='none';sImg.style.filter='none'}if(sShade)sShade.style.opacity=.85;return}
  if(scene&&sImg){
    const r=scene.getBoundingClientRect(),total=r.height-innerHeight;
    let p=total>0?Math.min(1,Math.max(0,-r.top/total)):0;
    sImg.style.filter=`brightness(${.62+p*.14}) saturate(${.92+p*.1})`;
    if(sShade)sShade.style.opacity=.7+p*.2;
    lines.forEach((el,i)=>{const start=.08+i*.17;let lp=Math.min(1,Math.max(0,(p-start)/.22));el.style.opacity=lp;el.style.transform=`translateY(${(1-lp)*34}px)`});
  }
  if(wm){const r=wm.parentElement.getBoundingClientRect();let p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));wm.style.transform=`translateX(${6-p*16}%)`}
}
let ticking=false;
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{scrub();ticking=false})}},{passive:true});
scrub();
/* programmes explorer */
/*DATA:PROGS*/const PROGS=[
 {k:'Flagship · Cohort',s:'Prophetic Leadership',t:'Prophetic Leadership Development Program',f:'8 weeks · Urdu · live sessions + fieldwork',d:'Leadership rebuilt from its source: the Quran, the authentic Sunnah and the Seerah — with modern leadership psychology used only to explain, never to replace.',li:['USWA framework (Quran 33:21): Understanding, Sincerity, Wisdom, Accountability','360 feedback, assessments and a capstone leadership blueprint'],w:'For imams, founders, managers and community leaders'},
 {k:'Signature · Behaviour',s:'Habit Architecture',t:'Habit Architecture',f:'Live cohort · practical, tracked, honest',d:'Habits are not built by motivation. They are built by design — cue, routine, environment — and then defended on the bad days, not the good ones.',li:['Design the cue and the environment before the willpower','Weekly tracking with honest review, not guilt'],w:'For anyone whose resolutions keep dying by February'},
 {k:'Signature · Sales',s:'Behavioural Sales',t:'Behavioural Sales Excellence',f:'Corporate · for sales teams',d:'Selling as behaviour, not pressure: reading the buyer, honest persuasion, and follow-up systems that do not depend on memory or mood.',li:['Buyer psychology, without manipulation','Pipeline habits that survive busy weeks'],w:'For sales teams and their managers'},
 {k:'Signature · Education',s:'Teach With Heart',t:'Teach With Heart',f:'School cohorts · for teachers',d:'Teaching that reaches the student in front of you: attention, feedback and classroom energy — grounded in how learning actually works.',li:['Attention and feedback that lands','The teacher\u2019s own state as a teaching tool'],w:'For schools and their teaching staff'},
 {k:'Signature · Family',s:'Strong Homes',t:'Strong Homes, Calm Hearts',f:'For couples and parents',d:'The home is the first organisation any of us leads. Communication, conflict and calm — practised, not preached.',li:['Conversations that de-escalate instead of ignite','Routines that protect the home\u2019s peace'],w:'For couples and parents'},
 {k:'Signature · Youth',s:'RISE Youth',t:'RISE Youth',f:'For students and young professionals',d:'Confidence with roots: identity, direction and habits for the years that decide the rest.',li:['Direction before motivation','Study, screen and self — in that order'],w:'For ages 16–25 and the people raising them'}
];/*/DATA*/
if(document.getElementById('progList')&&document.getElementById('flip')){
const list=document.getElementById('progList'),flip=document.getElementById('flip');let cur=-1,flipBusy=false;
PROGS.forEach((p,i)=>{const b=document.createElement('button');b.className='prog-btn';b.setAttribute('aria-pressed','false');b.innerHTML=p.s+'<small>'+p.f+'</small>';b.addEventListener('click',()=>select(i,b));list.appendChild(b)});
function fill(i){const p=PROGS[i];document.getElementById('fKicker').textContent=p.k;document.getElementById('fTitle').textContent=p.t;document.getElementById('fFmt').textContent=p.f;document.getElementById('fDesc').textContent=p.d;document.getElementById('fList').innerHTML=p.li.map(x=>'<li>'+x+'</li>').join('');document.getElementById('fWho').textContent=p.w;document.getElementById('fWa').href='https://wa.me/923309222029?text='+encodeURIComponent('Assalam-o-Alaikum! I want details about the AIDE programme: '+p.t+'.')}
function select(i,btn){if(i===cur||flipBusy)return;cur=i;document.querySelectorAll('.prog-btn').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});btn.classList.add('on');btn.setAttribute('aria-pressed','true');if(RM){fill(i);return}flipBusy=true;flip.classList.add('flipping');setTimeout(()=>{fill(i);flip.classList.remove('flipping');setTimeout(()=>flipBusy=false,420)},400)}
fill(0);cur=0;list.children[0].classList.add('on');list.children[0].setAttribute('aria-pressed','true');
/* flip card — light follows the pointer */
if(matchMedia('(pointer:fine)').matches&&!RM){flip.addEventListener('pointermove',e=>{const r=flip.getBoundingClientRect();flip.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');flip.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')})}
}
/* quiz */
if(document.getElementById('qText')&&document.getElementById('qOpts')){
/*DATA:QUIZ*/const QS=[
 {q:'When a plan breaks down, what usually happens next?',o:[['I rebuild it the same day — smaller, but moving',0],['I wait for motivation to return',1],['The plan quietly disappears',2]]},
 {q:'How do you decide what matters most this week?',o:[['It is written down, in order',0],['It lives in my head, mostly',1],['Whoever shouts loudest decides',2]]},
 {q:'After a hard conversation goes badly, you…',o:[['Revisit it and repair what I can',0],['Replay it for days without acting',1],['Avoid the person entirely',2]]}
];
const BANDS=[[2,'A starting point','Honest answers are the raw material. Your systems — not your sincerity — are what need work first. A short call can map where to begin.'],[4,'Building — support speeds this up','The intent is there and some structure exists. This is the stage where a short, honest conversation does the most good — bring one real problem to the free call and leave with a clear first step.'],[6,'A strong system','You already run on structure. The next gains are refinement: leadership depth, team habits, the harder rooms.']];/*/DATA*/
let qi=0,score=0;const qText=document.getElementById('qText'),qOpts=document.getElementById('qOpts'),qBar=document.getElementById('qBar');
function renderQ(){qBar.style.width=(qi/QS.length*100)+'%';qText.textContent=QS[qi].q;qOpts.innerHTML='';QS[qi].o.forEach(([label,pts])=>{const b=document.createElement('button');b.className='qopt';b.textContent=label;b.addEventListener('click',()=>{score+=pts;const body=document.getElementById('qBody');if(RM){advance();return}body.classList.add('qswap');setTimeout(()=>{advance();body.classList.remove('qswap')},280)});qOpts.appendChild(b)})}
function advance(){qi++;if(qi<QS.length)renderQ();else{qBar.style.width='100%';document.getElementById('qBody').style.display='none';const band=BANDS.find(([max])=>score<=max);document.getElementById('qResTitle').textContent=band[1];document.getElementById('qResText').textContent=band[2];document.getElementById('qWa').href='https://wa.me/923309222029?text='+encodeURIComponent('Assalam-o-Alaikum! I took the AIDE self-check on the website. My result: "'+band[1]+'". I would like the free 15-minute discovery call.');document.getElementById('qRes').classList.add('show')}}
renderQ();
}
/* faq */
document.querySelectorAll('.faq-item').forEach(item=>{const q=item.querySelector('.faq-q'),a=item.querySelector('.faq-a');q.addEventListener('click',()=>{const open=item.classList.toggle('open');q.setAttribute('aria-expanded',open);a.style.maxHeight=open?a.scrollHeight+'px':'0'})});
/* marquee: duplicate content for seamless loop */
const mq=document.getElementById('mqTrack');if(mq){mq.innerHTML+=mq.innerHTML;mq.querySelectorAll('.ur').forEach(s=>s.setAttribute('lang','ur'))}
/* mobile menu */
const menuBtn=document.getElementById('menuBtn'),mobileMenu=document.getElementById('mobileMenu');
if(menuBtn&&mobileMenu){menuBtn.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open);menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');menuBtn.textContent=open?'✕':'☰'});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open menu');menuBtn.textContent='☰'}))}

/* dropdowns: tap/click support for touch (language button + parent taps) */
document.querySelectorAll('.has-drop').forEach(h=>{const b=h.querySelector('.lang-btn');if(b)b.addEventListener('click',e=>{e.stopPropagation();const o=h.classList.contains('open');document.querySelectorAll('.has-drop.open').forEach(x=>x.classList.remove('open'));if(!o)h.classList.add('open')})});
document.addEventListener('click',()=>document.querySelectorAll('.has-drop.open').forEach(x=>x.classList.remove('open')));

/* ===== MOTION PASS 2026-11-04: reveal stagger (guarded, self-contained) ===== */
(function(){try{
  if(!('IntersectionObserver' in window))return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var SEL='.rv,.rv-l,.rv-r';
  document.querySelectorAll(SEL).forEach(function(el){
    if(el.classList.contains('btn'))return;
    var p=el.parentElement;if(!p)return;
    var sibs=Array.prototype.filter.call(p.children,function(c){return c.classList&&c.matches(SEL)&&!c.classList.contains('btn')});
    var i=sibs.indexOf(el);
    if(i>0)el.style.transitionDelay=Math.min(i*80,400)+'ms';
  });
}catch(e){}})();

/* ===== LIVING PASS 2026-11-05 (inner pages): fade-in + back-to-top ===== */
document.body.classList.add('ready');
(function(){try{
  var b=document.getElementById('toTop2'); if(!b) return;
  var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  addEventListener('scroll',function(){ b.classList.toggle('show', window.scrollY>600); },{passive:true});
  b.addEventListener('click',function(){ window.scrollTo({top:0,behavior:rm?'auto':'smooth'}); });
}catch(e){}})();

/* ===== BOOKING DROPDOWN 2026-11-05 (inner coaching page) ===== */
(function(){try{
  var pick=document.getElementById('coachPick2'); if(!pick) return;
  var field=document.getElementById('coachField2'), btn=document.getElementById('coachBook2'), forEl=document.getElementById('coachFor2');
  function setC(){
    var o=pick.options[pick.selectedIndex]; if(!o) return;
    if(field) field.textContent=o.getAttribute('data-field')||'';
    if(forEl) forEl.textContent=o.getAttribute('data-for')||'';
    if(btn){ btn.textContent=(pick.getAttribute('data-bookwith')||'Book with')+' '+o.textContent; btn.setAttribute('href', o.getAttribute('data-wa')||'#'); }
  }
  pick.addEventListener('change', setC); setC();
}catch(e){}})();

/* ===== BOOKS WEB READER (مطالعہ) 2026-11-06 — free samples: intro + chapter 1 ===== */
(function(){try{
  var reader=document.getElementById('reader'); if(!reader) return;
  var body=document.getElementById('rdBody'), scroll=document.getElementById('rdScroll'),
      title=document.getElementById('rdTitle'), wa=document.getElementById('rdWa'),
      fill=document.getElementById('rdProgFill'), modeBtn=document.getElementById('rdMode'),
      up=document.getElementById('rdFontUp'), down=document.getElementById('rdFontDown');
  var SIZES=[16.5,18,19.5,21,23,25], step=2, cur=null, lastBtn=null;
  try{ var fs=parseInt(localStorage.getItem('aideReaderFont')); if(fs>=0&&fs<SIZES.length) step=fs;
       if(localStorage.getItem('aideReaderMode')==='night'){ reader.classList.add('night'); modeBtn.setAttribute('aria-pressed','true'); } }catch(e){}
  function applySize(){ body.style.fontSize=SIZES[step]+'px'; try{localStorage.setItem('aideReaderFont',step)}catch(e){} }
  function savePos(){ if(!cur) return; var max=scroll.scrollHeight-scroll.clientHeight; if(max>0){ try{localStorage.setItem('aideReaderPos:'+cur,(scroll.scrollTop/max).toFixed(4))}catch(e){} } }
  function prog(){ var max=scroll.scrollHeight-scroll.clientHeight; var f=max>0?scroll.scrollTop/max:0; fill.style.width=(f*100)+'%'; }
  scroll.addEventListener('scroll',function(){ prog(); savePos(); },{passive:true});
  function open(btn){
    var src=document.getElementById('sample-'+btn.getAttribute('data-book')); if(!src) return;
    cur=btn.getAttribute('data-book'); lastBtn=btn;
    body.innerHTML=src.innerHTML;
    var lang=btn.getAttribute('data-lang')||'ur';
    title.textContent=btn.getAttribute('data-title')||'';
    title.setAttribute('lang',lang); title.setAttribute('dir',lang==='en'?'ltr':'rtl');
    wa.setAttribute('href',btn.getAttribute('data-wa')||'#');
    applySize();
    reader.hidden=false; document.body.classList.add('rd-lock');
    var p=0; try{ p=parseFloat(localStorage.getItem('aideReaderPos:'+cur))||0 }catch(e){}
    requestAnimationFrame(function(){ var max=scroll.scrollHeight-scroll.clientHeight; scroll.scrollTop=max*p; prog(); });
    document.getElementById('rdClose').focus();
  }
  function close(){ savePos(); reader.hidden=true; document.body.classList.remove('rd-lock'); if(lastBtn) lastBtn.focus(); }
  document.querySelectorAll('.rd-open').forEach(function(b){ b.addEventListener('click',function(){ open(b); }); });
  document.getElementById('rdClose').addEventListener('click',close);
  document.getElementById('rdBackdrop').addEventListener('click',close);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!reader.hidden) close(); });
  up.addEventListener('click',function(){ if(step<SIZES.length-1){ step++; applySize(); } });
  down.addEventListener('click',function(){ if(step>0){ step--; applySize(); } });
  modeBtn.addEventListener('click',function(){ var n=reader.classList.toggle('night'); modeBtn.setAttribute('aria-pressed',n); try{localStorage.setItem('aideReaderMode',n?'night':'day')}catch(e){} });
}catch(e){}})();

/* PLDP pillars -> schedule highlight (programme-pldp pages only; no-op elsewhere) */
(function(){
  var btns=document.querySelectorAll('.pd-pillar');
  if(!btns.length) return;
  var rows=document.querySelectorAll('.pd-sched-row');
  var note=document.getElementById('pdPillarNote');
  var def=note?note.innerHTML:'';
  var active=null;
  function clear(){rows.forEach(function(r){r.classList.remove('hl')});btns.forEach(function(b){b.setAttribute('aria-pressed','false')});active=null;if(note)note.innerHTML=def;}
  btns.forEach(function(btn){btn.addEventListener('click',function(){
    var key=btn.getAttribute('data-pillar');
    if(active===key){clear();return;}
    clear();active=key;btn.setAttribute('aria-pressed','true');
    rows.forEach(function(r){if(r.getAttribute('data-pillar')===key)r.classList.add('hl');});
    if(note){var t=note.getAttribute('data-tmpl')||'';note.innerHTML=t.replace('{name}',btn.getAttribute('data-name')||'').replace('{weeks}',btn.getAttribute('data-weeks')||'');}
  });});
})();

/* ===== BOOKS CART + GIFT (کارٹ و تحفہ) 2026-11-13 — UR books page only; no-op elsewhere ===== */
(function(){try{
  var bar=document.getElementById('cartBar'); if(!bar) return;
  var catEl=document.getElementById('bookCatalog'); if(!catEl) return;
  var CAT=JSON.parse(catEl.textContent);
  var KEY='aideCart.v1';
  function pktToday(){var d=new Date(Date.now()+5*3600*1000); /* PKT=UTC+5 fixed, no DST; device-timezone independent */
    function p(x){return (x<10?'0':'')+x;}
    return d.getUTCFullYear()+'-'+p(d.getUTCMonth()+1)+'-'+p(d.getUTCDate());}
  var OPENING=pktToday()>=CAT.opening.start&&pktToday()<=CAT.opening.end;
  function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function priceOf(it){return OPENING?it.o:it.p;}
  function giftCount(n){return n>=20?8:(n>=10?3:(n>=5?1:0));}
  var state={picks:[],bundles:[]};
  try{var s=JSON.parse(localStorage.getItem(KEY));
    if(s&&s.picks&&s.bundles){state.picks=s.picks.filter(function(n){return CAT.books[String(n)];});
      state.bundles=s.bundles.filter(function(k){return CAT.bundles[k];});}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
  function compute(){
    var picks=state.picks.map(function(n){var b=CAT.books[String(n)];return {n:n,t:b.t,pr:priceOf(b),rg:b.p};});
    var sorted=picks.slice().sort(function(a,b){return a.pr-b.pr||a.n-b.n;});
    var g=giftCount(picks.length);
    var giftNs={}; sorted.slice(0,g).forEach(function(p){giftNs[p.n]=1;});
    var sub=0,gsave=0,reg=0;
    picks.forEach(function(p){sub+=p.pr; reg+=p.rg; if(giftNs[p.n])gsave+=p.pr;});
    var blines=state.bundles.map(function(k){var b=CAT.bundles[k];return {k:k,t:b.t,pr:priceOf(b),rg:b.p};});
    blines.forEach(function(b){sub+=b.pr; reg+=b.rg;});
    return {picks:picks,giftNs:giftNs,g:g,blines:blines,sub:sub,gsave:gsave,total:sub-gsave,reg:reg,regSave:reg-sub};
  }
  var panel=document.getElementById('cartPanel'),
      linesEl=document.getElementById('cartLines'),
      sumsEl=document.getElementById('cartSums'),
      nextEl=document.getElementById('cartNext'),
      countEl=document.getElementById('cartCount'),
      totalEl=document.getElementById('cartTotal'),
      giftEl=document.getElementById('cartGiftNote'),
      waEl=document.getElementById('cartWa');
  function hint(n){
    if(n===0) return '';
    if(n<5) return (5-n)+' مزید کتابیں چنیں — 1 تحفہ ملے گا!';
    if(n<10) return (10-n)+' مزید کتابیں — 3 تحفے!';
    if(n<20) return (20-n)+' مزید کتابیں — 8 تحفے!';
    return 'آپ کو 8 تحفے مل رہے ہیں — سب سے بڑا درجہ!';
  }
  function render(){
    var c=compute();
    var count=c.picks.length+c.blines.length;
    bar.hidden=count===0;
    countEl.textContent=count;
    totalEl.textContent=fmt(c.total);
    giftEl.textContent=c.g>0?(' · '+c.g+(c.g>1?' تحفے':' تحفہ')):'';
    nextEl.textContent=hint(c.picks.length);
    if(count===0){
      linesEl.innerHTML='<p class="cart-empty">کارٹ خالی ہے۔ کارڈ پر «کارٹ میں ڈالیں» دبائیں۔</p>';
      sumsEl.innerHTML='';
      waEl.setAttribute('href','#');
    } else {
      var h='';
      c.picks.forEach(function(p,i){
        var gift=!!c.giftNs[p.n];
        h+='<div class="cart-line'+(gift?' is-gift':'')+'"><span class="cl-t">'+(i+1)+'. '+esc(p.t)+'</span><span class="cl-p">'+(gift?'<s>'+fmt(p.pr)+' روپے</s> تحفہ — مفت':fmt(p.pr)+' روپے')+'</span><button class="cl-x" type="button" data-rm-book="'+p.n+'" aria-label="ہٹائیں">✕</button></div>';
      });
      c.blines.forEach(function(b){
        h+='<div class="cart-line is-bundle"><span class="cl-t">مجموعہ: '+esc(b.t)+'</span><span class="cl-p">'+fmt(b.pr)+' روپے</span><button class="cl-x" type="button" data-rm-bundle="'+esc(b.k)+'" aria-label="ہٹائیں">✕</button></div>';
      });
      linesEl.innerHTML=h;
      sumsEl.innerHTML=(c.regSave>0?'<div class="cart-sum"><span>معمول کی قیمت</span><b><s>'+fmt(c.reg)+' روپے</s></b></div>'
        +'<div class="cart-sum save"><span>افتتاحی بچت</span><b>− '+fmt(c.regSave)+' روپے</b></div>'
        :'<div class="cart-sum"><span>مجموعہ</span><b>'+fmt(c.sub)+' روپے</b></div>')
        +(c.gsave>0?'<div class="cart-sum save"><span>تحفے کی بچت ('+c.g+(c.g>1?' تحفے':' تحفہ')+')</span><b>− '+fmt(c.gsave)+' روپے</b></div>':'')
        +'<div class="cart-sum total"><span>کل قابلِ ادائیگی</span><b>'+fmt(c.total)+' روپے</b></div>';
      var msg=['السلام علیکم! مجھے AIDE کی یہ کتابیں حاصل کرنی ہیں:'];
      c.picks.forEach(function(p,i){msg.push((i+1)+'. '+p.t+' — '+fmt(p.pr)+' روپے'+(c.giftNs[p.n]?' (تحفہ — مفت)':''));});
      c.blines.forEach(function(b){msg.push('مجموعہ: '+b.t+' — '+fmt(b.pr)+' روپے');});
      if(c.gsave>0){msg.push('تحفے کی بچت ('+c.g+(c.g>1?' تحفے':' تحفہ')+'): − '+fmt(c.gsave)+' روپے');}
      if(c.regSave>0){msg.push('افتتاحی بچت: − '+fmt(c.regSave)+' روپے');}
      msg.push('کل: '+fmt(c.total)+' روپے');
      msg.push('براہ کرم ادائیگی کی تفصیل بھیج دیں۔');
      waEl.setAttribute('href','https://wa.me/923309222029?text='+encodeURIComponent(msg.join('\n')));
    }
    linesEl.querySelectorAll('[data-rm-book]').forEach(function(b){b.addEventListener('click',function(){
      state.picks=state.picks.filter(function(n){return String(n)!==b.getAttribute('data-rm-book');}); save(); syncButtons(); render(); });});
    linesEl.querySelectorAll('[data-rm-bundle]').forEach(function(b){b.addEventListener('click',function(){
      state.bundles=state.bundles.filter(function(k){return k!==b.getAttribute('data-rm-bundle');}); save(); syncButtons(); render(); });});
  }
  function syncButtons(){
    document.querySelectorAll('[data-add]').forEach(function(b){
      var n=b.getAttribute('data-add'), on=state.picks.indexOf(+n)>-1||state.picks.indexOf(n)>-1;
      b.textContent=on?'کارٹ میں ہے ✓':'کارٹ میں ڈالیں';
      b.classList.toggle('in-cart',on);
    });
    document.querySelectorAll('[data-bundle]').forEach(function(b){
      var k=b.getAttribute('data-bundle'), on=state.bundles.indexOf(k)>-1;
      b.textContent=on?'مجموعہ کارٹ میں ہے ✓':'مجموعہ کارٹ میں ڈالیں';
      b.classList.toggle('in-cart',on);
    });
  }
  document.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){
    var n=+b.getAttribute('data-add');
    var i=state.picks.indexOf(n);
    if(i>-1) state.picks.splice(i,1); else state.picks.push(n);
    save(); syncButtons(); render(); });});
  document.querySelectorAll('[data-bundle]').forEach(function(b){b.addEventListener('click',function(){
    var k=b.getAttribute('data-bundle');
    var i=state.bundles.indexOf(k);
    if(i>-1) state.bundles.splice(i,1); else state.bundles.push(k);
    save(); syncButtons(); render(); });});
  function openPanel(){panel.hidden=false;document.body.classList.add('rd-lock');document.getElementById('cartClose').focus();}
  function closePanel(){panel.hidden=true;document.body.classList.remove('rd-lock');}
  document.getElementById('cartOpen').addEventListener('click',openPanel);
  document.getElementById('cartClose').addEventListener('click',closePanel);
  document.getElementById('cartBackdrop').addEventListener('click',closePanel);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden)closePanel();});
  document.getElementById('cartClear').addEventListener('click',function(){state={picks:[],bundles:[]};save();syncButtons();render();});
  syncButtons(); render();
}catch(e){}})();


/* ===== DATE-AWARE PRICES (تاریخ کے حساب سے قیمتیں) 2026-11-13 — books pages; no-op elsewhere ===== */
(function(){try{
  if(!document.querySelector('.js-price,.js-bundle,.js-wa,.js-wa-btn,.js-hint,[data-open-only]')) return;
  function pktToday(){var d=new Date(Date.now()+5*3600*1000); /* PKT=UTC+5 fixed, no DST; device-timezone independent */
    function p(x){return (x<10?'0':'')+x;}
    return d.getUTCFullYear()+'-'+p(d.getUTCMonth()+1)+'-'+p(d.getUTCDate());}
  var T=pktToday();
  var PHASE=T<'2026-11-14'?'pre':(T<='2026-12-31'?'open':'post');
  function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
  var SENT={
    ur:{pre:function(r,o){return 'قیمت: '+fmt(r)+' روپے · افتتاحی قیمت 14 نومبر سے: '+fmt(o)+' روپے';},
        open:function(r,o){return 'افتتاحی قیمت: '+fmt(o)+' روپے (14 نومبر تا 31 دسمبر 2026) · معمول کی قیمت: '+fmt(r)+' روپے';},
        post:function(r){return 'قیمت: '+fmt(r)+' روپے';}},
    en:{pre:function(r,o){return 'Price: Rs '+fmt(r)+' · Opening price from 14 November: Rs '+fmt(o);},
        open:function(r,o){return 'Opening price: Rs '+fmt(o)+' (14 November – 31 December 2026) · Regular price: Rs '+fmt(r);},
        post:function(r){return 'Price: Rs '+fmt(r);}},
    ar:{pre:function(r,o){return 'السعر: '+fmt(r)+' روبية · سعر الافتتاح ابتداءً من 14 نوفمبر: '+fmt(o)+' روبية';},
        open:function(r,o){return 'سعر الافتتاح: '+fmt(o)+' روبية (14 نوفمبر – 31 ديسمبر 2026) · السعر المعتاد: '+fmt(r)+' روبية';},
        post:function(r){return 'السعر: '+fmt(r)+' روبية';}}
  };
  if(PHASE==='post'){document.querySelectorAll('[data-open-only]').forEach(function(el){el.hidden=true;});}
  document.querySelectorAll('.js-price').forEach(function(el){
    var r=+el.getAttribute('data-regular'), o=+el.getAttribute('data-opening');
    if(el.getAttribute('data-fmt')==='sentence'){
      var loc=el.getAttribute('data-loc')||'ur';
      el.textContent=SENT[loc][PHASE](r,o);
    } else if(PHASE==='pre'){
      el.innerHTML='<b>'+fmt(r)+' روپے</b> <span>افتتاحی قیمت 14 نومبر سے: '+fmt(o)+' روپے</span>';
    } else if(PHASE==='open'){
      el.innerHTML='<b>'+fmt(o)+' روپے</b> <s>'+fmt(r)+' روپے</s> <span>افتتاحی قیمت — 31 دسمبر 2026 تک</span>';
    } else {
      el.innerHTML='<b>'+fmt(r)+' روپے</b>';
    }
  });
  document.querySelectorAll('.js-bundle').forEach(function(w){
    var iv=+w.getAttribute('data-indiv'), r=+w.getAttribute('data-regular'), o=+w.getAttribute('data-opening');
    var sums=w.querySelector('.bk-bundle-sums'), pr=w.querySelector('.bk-bundle-price'), pb=w.querySelector('.bk-perbook'), ct=+w.getAttribute('data-count')||0;
    if(pb&&ct>0){
      var active=PHASE==='open'?o:r;
      pb.innerHTML='تقریباً <b>'+fmt(Math.round(active/ct))+' روپے</b> فی کتاب';
    }
    if(sums){
      if(PHASE==='open') sums.innerHTML='انفرادی مجموعہ: <s>'+fmt(iv)+' روپے</s> · مجموعے کی قیمت: '+fmt(r)+' روپے · افتتاحی بچت: '+fmt(iv-o)+' روپے';
      else if(PHASE==='pre') sums.innerHTML='انفرادی مجموعہ: <s>'+fmt(iv)+' روپے</s> · مجموعے کی قیمت: '+fmt(r)+' روپے · بچت: '+fmt(iv-r)+' روپے';
      else sums.innerHTML='انفرادی مجموعہ: <s>'+fmt(iv)+' روپے</s> · بچت: '+fmt(iv-r)+' روپے';
    }
    if(pr){
      if(PHASE==='pre') pr.innerHTML='<b>'+fmt(r)+' روپے</b> <span>افتتاحی قیمت 14 نومبر سے: '+fmt(o)+' روپے</span>';
      else if(PHASE==='open') pr.innerHTML='<b>'+fmt(o)+' روپے</b> <span>افتتاحی قیمت — 31 دسمبر 2026 تک</span>';
      else pr.innerHTML='<b>'+fmt(r)+' روپے</b>';
    }
  });
  document.querySelectorAll('.js-hint').forEach(function(el){
    var r=+el.getAttribute('data-regular'), o=+el.getAttribute('data-opening');
    el.textContent=el.getAttribute('data-pre')+fmt(PHASE==='open'?o:r)+' روپے';
  });
  function waHref(kind,title,r,o){
    var price=PHASE==='open'?o:r, label=PHASE==='open'?'افتتاحی قیمت':'قیمت';
    var msg=kind==='bundle'
      ? 'السلام علیکم! مجھے مجموعہ «'+title+'» حاصل کرنا ہے۔ '+label+' '+fmt(price)+' روپے۔'
      : 'السلام علیکم! مجھے کتاب «'+title+'» حاصل کرنی ہے۔ '+label+' '+fmt(price)+' روپے۔';
    return 'https://wa.me/923309222029?text='+encodeURIComponent(msg);
  }
  document.querySelectorAll('.js-wa').forEach(function(el){
    el.href=waHref(el.getAttribute('data-kind'),el.getAttribute('data-wa-title'),+el.getAttribute('data-regular'),+el.getAttribute('data-opening'));
  });
  document.querySelectorAll('.js-wa-btn').forEach(function(el){
    el.setAttribute('data-wa',waHref('book',el.getAttribute('data-title'),+el.getAttribute('data-regular'),+el.getAttribute('data-opening')));
  });
}catch(e){}})();

/* ===== ANIMATED LOGO BADGE (About hero, 2026-11-13): pointer tilt =====
   Desktop pointers only, capped at 5deg; off under reduced motion and on
   touch. Guarded: runs only on pages that carry the badge. */
(function(){var b=document.getElementById('alogo');if(!b)return;var inner=document.getElementById('alogoTiltInner');if(!inner)return;if(RM)return;if(!matchMedia('(pointer:fine)').matches)return;
b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();var dx=(e.clientX-(r.left+r.width/2))/(r.width/2);var dy=(e.clientY-(r.top+r.height/2))/(r.height/2);dx=Math.max(-1,Math.min(1,dx));dy=Math.max(-1,Math.min(1,dy));inner.style.setProperty('--ry',(dx*5).toFixed(2)+'deg');inner.style.setProperty('--rx',(-dy*5).toFixed(2)+'deg')});
b.addEventListener('pointerleave',function(){inner.style.setProperty('--ry','0deg');inner.style.setProperty('--rx','0deg')});})();
