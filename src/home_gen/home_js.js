(function(){
  "use strict";
  document.body.classList.add('ready');
  var DAY = %%DAY%%, NIGHT = %%NIGHT%%;
  var root = document.documentElement, label = document.getElementById('themeLabel');
  function setTheme(t){
    root.setAttribute('data-theme', t);
    label.textContent = (t === 'day') ? DAY : NIGHT;
    try{ localStorage.setItem('aide-ck-theme', t); }catch(e){}
  }
  try{
    var saved = localStorage.getItem('aide-ck-theme');
    if(saved === 'day' || saved === 'night'){ setTheme(saved); }
  }catch(e){}
  document.getElementById('themeToggle').addEventListener('click', function(){
    setTheme(root.getAttribute('data-theme') === 'day' ? 'night' : 'day');
  });

  /* ---------- HERO FILM ----------
     Plays in full and loops. When the hero scrolls out of view the film
     pauses; the moment it returns, it resumes — it never stays stuck. */
  var v = document.getElementById('heroVideo');
  var stage = document.getElementById('heroStage');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(v && stage){
  var heroVisible = true, userPaused = false;
  function tryPlay(){ if(!reduce && !userPaused && heroVisible && !document.hidden){ var p = v.play(); if(p && p.catch){ p.catch(function(){}); } } }
  var vState = document.getElementById('vState'), vT = null;
  function flashState(){ if(!vState) return; vState.textContent = v.paused ? '▶' : '❚❚'; vState.classList.add('show'); clearTimeout(vT); vT = setTimeout(function(){ vState.classList.remove('show'); }, 900); }
  var vwrap = document.querySelector('.vwrap');
  if(vwrap && !reduce){ vwrap.addEventListener('click', function(){ if(v.paused){ userPaused = false; tryPlay(); } else { userPaused = true; v.pause(); } flashState(); }); }
  if(reduce){ v.removeAttribute('autoplay'); v.pause(); }
  else {
    v.addEventListener('error', function(){ v.style.display = 'none'; }, true);
    if('IntersectionObserver' in window){
      var vio = new IntersectionObserver(function(es){
        es.forEach(function(en){
          heroVisible = en.isIntersecting;
          if(en.isIntersecting){ tryPlay(); } else { v.pause(); }
        });
      }, {threshold: 0.15});
      vio.observe(stage);
    }
    document.addEventListener('visibilitychange', function(){
      if(document.hidden){ v.pause(); } else { tryPlay(); }
    });
    v.addEventListener('canplay', tryPlay);
    tryPlay();
  }
  }

  /* ---------- NAV DIM (head reveal) ----------
     Imran's idea (2026-11-14): the fixed nav covers the top strip of the
     hero stage. During the film moments when a head rises into that
     strip, the nav background dims so the head shows through the blur
     instead of hiding behind the solid bar. Intervals measured from
     hero-film.mp4 (head inside the top 25% of the frame). Desktop only:
     on mobile the film sits in its own band below the nav. */
  (function(){
    var nav = document.querySelector('nav');
    if(!v || !nav || reduce) return;
    var DIM = [[0,5.0],[15.4,18.2],[22.2,25.0],[26.6,31.6],[35.4,38.2]];
    var dimmed = false, seen = true;
    function apply(on){
      if(on === dimmed) return;
      dimmed = on;
      nav.classList.toggle('nav-dim', on);
    }
    function sync(){
      var t = v.currentTime || 0, on = false, i;
      if(seen && window.innerWidth >= 821){
        for(i = 0; i < DIM.length; i++){
          if(t >= DIM[i][0] && t <= DIM[i][1]){ on = true; break; }
        }
      }
      apply(on);
    }
    v.addEventListener('timeupdate', sync);
    v.addEventListener('seeked', sync);
    v.addEventListener('play', sync);
    if('IntersectionObserver' in window && stage){
      new IntersectionObserver(function(es){
        es.forEach(function(en){
          seen = en.isIntersecting;
          if(!seen) apply(false); else sync();
        });
      }, {threshold: 0.15}).observe(stage);
    }
    sync();
  })();

  /* ---------- WORD REVEAL on the hook ---------- */
  var hook = document.getElementById('hook'), wi = 0;
  function splitWords(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType === 3){
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){
          if(!part){ return; }
          if(/^\s+$/.test(part)){ if(part.indexOf('\n') !== -1){ var s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', wi++); s.textContent = part; frag.appendChild(s); } else { frag.appendChild(document.createTextNode(' ')); } }
          else { var s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', wi++);
            /* LAB EXPERIMENT 2026-11-19: tag CHANGE + DIFFERENTLY (all locales) for idle motion */
            var bare = part.replace(/[\.!?\u06D4\u061F,;:]+$/, '').toLowerCase();
            var idleCls = (bare === 'change' || bare === 'بدلتے' || bare === 'يتغيرون') ? 'w-bob' : (bare === 'differently' || bare === 'مختلف') ? 'w-sway' : null;
            if(idleCls){ var inner = document.createElement('span'); inner.className = idleCls; inner.textContent = part; s.appendChild(inner); }
            else { s.textContent = part; }
            frag.appendChild(s); }
        });
        node.replaceChild(frag, n);
      } else if(n.nodeType === 1){ splitWords(n); }
    });
  }
  if(hook && !reduce){ splitWords(hook); }

  /* ---------- Reveal on scroll ---------- */
  var rv = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('on'); io.unobserve(en.target); } });
    }, {threshold: 0.12});
    rv.forEach(function(el){ io.observe(el); });
  } else { rv.forEach(function(el){ el.classList.add('on'); }); }

  /* ---------- MAGNETIC buttons ---------- */
  if(!reduce && window.matchMedia('(pointer: fine)').matches){
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2) / r.width, y = (e.clientY - r.top - r.height/2) / r.height;
        el.style.transform = 'translate(' + (x*7) + 'px,' + (y*5 - 2) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  /* ---------- Self-check ---------- */
  %%QUIZ%%
  %%RES%%
  %%QNEXT%%
  var step = 0, score = 0, hist = [];
  var qBar = document.getElementById('qBar'), qText = document.getElementById('qText'),
      qOpts = document.getElementById('qOpts'), qBody = document.getElementById('qBody'),
      qRes = document.getElementById('qRes'), qResTitle = document.getElementById('qResTitle'),
      qResText = document.getElementById('qResText');
  var qBack = document.getElementById('qBack'), qNextLink = document.getElementById('qNextLink');
  if(qBack){ qBack.addEventListener('click', function(){ if(step > 0 && hist.length){ score -= hist.pop(); step--; qRes.style.display = 'none'; qBody.style.display = 'block'; render(); } }); }
  function render(){
    qBar.style.width = (step / QS.length * 100) + '%';
    if(qBack){ qBack.style.display = step > 0 ? 'inline-block' : 'none'; }
    if(step >= QS.length){
      qBody.style.display = 'none'; qRes.style.display = 'block';
      var band = score <= 2 ? 0 : (score <= 4 ? 1 : 2);
      var r = RES[band];
      qResTitle.textContent = r[0]; qResText.textContent = r[1];
      if(qNextLink && QNEXT[band]){ qNextLink.textContent = QNEXT[band][0]; qNextLink.setAttribute('href', QNEXT[band][1]); }
      return;
    }
    qText.textContent = QS[step].q;
    qOpts.innerHTML = '';
    QS[step].o.forEach(function(opt, i){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'qopt'; b.textContent = opt;
      b.addEventListener('click', function(){ hist.push(i); score += i; step++; render(); });
      qOpts.appendChild(b);
    });
  }
  render();

  /* ---------- THE ASCENT ---------- */
  var fill = document.getElementById('ascentFill'), toTop = document.getElementById('toTop'),
      rootEl = document.documentElement, ticking = false, navEl = document.querySelector('nav');
  function hexLerp(a, b, t){
    function c(h, i){ return parseInt(h.substr(i, 2), 16); }
    function h2(n){ var x = Math.round(n).toString(16); return x.length < 2 ? '0' + x : x; }
    return '#' + h2(c(a,1) + (c(b,1) - c(a,1)) * t) + h2(c(a,3) + (c(b,3) - c(a,3)) * t) + h2(c(a,5) + (c(b,5) - c(a,5)) * t);
  }
  function ascent(){
    ticking = false;
    var max = rootEl.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if(fill){ fill.style.transform = 'scaleY(' + p + ')'; }
    var day = rootEl.getAttribute('data-theme') === 'day';
    if(day){
      rootEl.style.setProperty('--bg', hexLerp('#E8E9EB', '#F6F7F8', p));
      rootEl.style.setProperty('--bg-soft', hexLerp('#DFE3E7', '#EDEFF1', p));
    } else {
      rootEl.style.setProperty('--bg', hexLerp('#0A1A3B', '#122E63', p));
      rootEl.style.setProperty('--bg-soft', hexLerp('#0D2148', '#17386F', p));
    }
    if(toTop){ toTop.classList.toggle('show', window.scrollY > 600); }
    if(navEl){ var y = window.scrollY || 0; if(y > 40){ navEl.classList.add('scrolled'); } else if(y < 12){ navEl.classList.remove('scrolled'); } }
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(ascent); } }, { passive: true });
  window.addEventListener('resize', ascent);
  if(toTop){ toTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }); }
  ascent();

  /* ---------- BOOKING DROPDOWN ---------- */
  %%COACH%%
  var cPick = document.getElementById('coachPick'), cField = document.getElementById('coachField'), cBook = document.getElementById('coachBook'), cFor = document.getElementById('coachFor');
  if(cPick && typeof COACH !== 'undefined'){
    COACH.forEach(function(c, i){ var o = document.createElement('option'); o.value = i; o.textContent = c[0]; cPick.appendChild(o); });
    function setCoach(){
      var c = COACH[+cPick.value || 0];
      if(cField){ cField.textContent = c[1]; }
      if(cFor && typeof COACHFOR !== 'undefined'){ cFor.textContent = COACHFOR[+cPick.value || 0] || ''; }
      if(cBook){ cBook.textContent = BOOKWITH + ' ' + c[0]; cBook.setAttribute('href', c[2]); }
    }
    cPick.addEventListener('change', setCoach); setCoach();
  }

  /* ---------- PATH GUIDE ---------- */
  %%GUIDE%%
  var gBtns = document.querySelectorAll('.gopt-btn'), gHost = document.getElementById('guidePanels');
  if(gBtns.length && gHost && typeof GUIDE !== 'undefined'){
    GUIDE.forEach(function(grp, gi){
      var panel = document.createElement('div'); panel.className = 'gpanel'; panel.id = 'gpanel-' + gi;
      if(typeof GUIDEOPEN !== 'undefined' && GUIDEOPEN){ var gh = document.createElement('p'); gh.className = 'ghint'; gh.textContent = GUIDEOPEN; panel.appendChild(gh); }
      grp.forEach(function(pr){
        var a = document.createElement('a'); a.className = 'gcard'; a.href = pr[1];
        a.innerHTML = '<h3></h3><span class="fmt"></span><span class="open"></span>';
        a.querySelector('h3').textContent = pr[0];
        a.querySelector('.fmt').textContent = pr[2];
        a.querySelector('.open').textContent = '→';
        panel.appendChild(a);
      });
      gHost.appendChild(panel);
    });
    gBtns.forEach(function(b){
      b.addEventListener('click', function(){
        var gi = +b.getAttribute('data-g'), was = b.classList.contains('on');
        gBtns.forEach(function(x){ x.classList.remove('on'); });
        document.querySelectorAll('.gpanel').forEach(function(x){ x.classList.remove('on'); });
        if(!was){ b.classList.add('on'); var p = document.getElementById('gpanel-' + gi); if(p){ p.classList.add('on'); } }
      });
    });
  }

  /* ---------- USWA EXPLORER ---------- */
  %%USWA%%
  %%REASONS%%
  var uBtns = document.querySelectorAll('.up'), uDet = document.getElementById('uswaDetail');
  function setUswa(k){
    if(!uDet || typeof USWA === 'undefined' || !USWA[k]) return;
    uBtns.forEach(function(x){ x.classList.toggle('on', +x.getAttribute('data-u') === k); });
    uDet.innerHTML = '<b></b><span class="uswa-line"></span><span class="wk"></span>';
    uDet.querySelector('b').textContent = USWA[k][0] + ' — ';
    uDet.querySelector('.uswa-line').textContent = USWA[k][1];
    uDet.querySelector('.wk').textContent = USWA[k][2];
  }
  if(uBtns.length){ uBtns.forEach(function(b){ b.addEventListener('click', function(){ setUswa(+b.getAttribute('data-u')); }); }); setUswa(0); }

  /* ---------- TAKEAWAYS (three-site review, lab 2026-11-19) ----------
     Proof count-up on the existing strip + the five-reasons selector. */
  (function(){
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* Count-up: animate the number inside each .proven .proof b (e.g. "300+"). */
    var proofBars = document.querySelectorAll('.proven .proof b');
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
    if('IntersectionObserver' in window && proofBars.length){
      var pio = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){ countUp(en.target); pio.unobserve(en.target); }
        });
      }, {threshold: 0.4});
      proofBars.forEach(function(b){ pio.observe(b); });
    } else {
      proofBars.forEach(countUp);
    }
    /* Five reasons selector. */
    var rBtns = document.querySelectorAll('.td-rsn-btn'),
        rTitle = document.getElementById('tdRsnTitle'),
        rText = document.getElementById('tdRsnText'),
        rPanel = document.getElementById('tdRsnPanel');
    if(rBtns.length && rTitle && rText && typeof REASONS !== 'undefined'){
      rBtns.forEach(function(btn){
        btn.addEventListener('click', function(){
          rBtns.forEach(function(x){ x.classList.remove('on'); });
          btn.classList.add('on');
          var r = REASONS[+btn.getAttribute('data-r')];
          if(!r) return;
          function swap(){ rTitle.textContent = r[0]; rText.textContent = r[1]; rPanel.classList.remove('swap'); }
          if(reduceMotion){ swap(); return; }
          rPanel.classList.add('swap');
          setTimeout(swap, 180);
        });
      });
    }
  })();

  /* ---------- NAV: where you are ---------- */
  var navMap = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){ navMap[a.getAttribute('href').slice(1)] = a; });
  if('IntersectionObserver' in window){
    var nio = new IntersectionObserver(function(es){
      es.forEach(function(en){ var a = navMap[en.target.id]; if(a && en.isIntersecting){ Object.keys(navMap).forEach(function(k){ navMap[k].classList.remove('act'); }); a.classList.add('act'); } });
    }, {rootMargin: '-38% 0px -55% 0px'});
    Object.keys(navMap).forEach(function(id){ var el = document.getElementById(id); if(el){ nio.observe(el); } });
  }
})();

/* ===== MOTION PASS 2026-11-04: reveal stagger (guarded, self-contained) ===== */
(function(){try{
  if(!('IntersectionObserver' in window))return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('.rv').forEach(function(el){
    if(el.classList.contains('btn'))return;
    var p=el.parentElement;if(!p)return;
    var sibs=Array.prototype.filter.call(p.children,function(c){return c.classList&&c.classList.contains('rv')&&!c.classList.contains('btn')});
    var i=sibs.indexOf(el);
    if(i>0)el.style.transitionDelay=Math.min(i*80,400)+'ms';
  });
}catch(e){}})();

/* ===== POPUP CARD 2026-11-15 (guarded, self-contained) ===== */
/* AIDE popup card — LIVE 2026-11-15 (homes only). Triggers: 25s delay OR exit-intent
   (desktop pointer only), whichever first; once per session. ?popup=1 forces
   it open (preview hook); ?popup=0 disables it. Close: X, backdrop, Esc. */
(function () {
  var POP = document.getElementById('apop');
  if (!POP) return;
  var KEY = 'aidePopSeen';
  var params = new URLSearchParams(location.search);
  if (params.get('popup') === '0') return;
  var force = params.get('popup') === '1';
  function open() {
    if (POP.classList.contains('open')) return;
    POP.classList.add('open');
    document.body.style.overflow = 'hidden';
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    var x = POP.querySelector('.apop-x');
    if (x) x.focus({ preventScroll: true });
  }
  function close() {
    POP.classList.remove('open');
    document.body.style.overflow = '';
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }
  var seen = false;
  try { seen = !!sessionStorage.getItem(KEY); } catch (e) {}
  if (force) {
    open();
  } else if (!seen) {
    var t = setTimeout(open, 25000);
    if (window.matchMedia && matchMedia('(pointer:fine)').matches) {
      document.addEventListener('mouseout', function h(e) {
        if (!e.relatedTarget && e.clientY <= 0) {
          clearTimeout(t);
          open();
          document.removeEventListener('mouseout', h);
        }
      });
    }
  }
  POP.addEventListener('click', function (e) { if (e.target === POP) close(); });
  var xBtn = POP.querySelector('.apop-x');
  if (xBtn) xBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && POP.classList.contains('open')) close();
  });
  /* language dropdown: tap/click support for touch (same pattern as inner js.js) */
  document.querySelectorAll('.has-drop').forEach(function (h) {
    var b = h.querySelector('.lang-btn');
    if (b) b.addEventListener('click', function (e) {
      e.stopPropagation();
      var o = h.classList.contains('open');
      document.querySelectorAll('.has-drop.open').forEach(function (x) { x.classList.remove('open'); });
      if (!o) h.classList.add('open');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.has-drop.open').forEach(function (x) { x.classList.remove('open'); });
  });
})();
