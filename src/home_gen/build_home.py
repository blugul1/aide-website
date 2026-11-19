# -*- coding: utf-8 -*-
"""Builds the three AIDE home pages (final design) from locale dicts.
Skeleton + CSS adapted from the owner's approved aide-chriske-demo.
Run: python3 build_home.py  -> writes into aide-full-site/{,ur/,ar/}index.html
"""
import re, sys, urllib.parse, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from loc_en import EN
from loc_ur import UR
from loc_ar import AR

SITE = pathlib.Path(__file__).resolve().parents[2]
GEN = pathlib.Path(__file__).resolve().parent
DEMO = (SITE.parent / 'aide-chriske-demo' / 'index.html').read_text(encoding='utf-8')
CSS = DEMO[DEMO.index('<style>')+7: DEMO.index('</style>')]

# Brand fonts, per locale (owner decision 2026-11-13: UR-D / AR-B / EN-B).
# Keep in sync with FONT_LINKS in src/build.py. Jakarta stays: assessments-app font.
_FONT_PRE = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
FONT_LINKS = {
    "en": _FONT_PRE + '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600;700;800&family=Open+Sans:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">',
    "ur": _FONT_PRE + '<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">',
    "ar": _FONT_PRE + '<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;700&family=Noto+Sans+Arabic:wght@500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">',
}

ADD_CSS = """
  /* ===== FINAL BUILD ADDITIONS ===== */
  /* ===== Typography — brand fonts, Nov 2026 (UR-D / AR-B / EN-B) ===== */
  html[lang="en"] body{font-family:"Open Sans","Segoe UI",system-ui,Arial,sans-serif;font-size:18px;line-height:1.7}
  html[lang="en"] h1,html[lang="en"] h2,html[lang="en"] h3{font-family:"Montserrat","Segoe UI",sans-serif}
  html[lang="ur"] body{font-family:"Noto Nastaliq Urdu","Traditional Arabic",serif;font-size:22px;font-weight:500;line-height:2.2}
  html[lang="ur"] h1,html[lang="ur"] h2,html[lang="ur"] h3{line-height:2.0;letter-spacing:0}
  html[lang="ur"] .hook{line-height:1.9;letter-spacing:0;font-size:clamp(26px,3.4vw,38px)}
  html[lang="ur"] p{line-height:2.2}
  html[lang="ur"] .hero-lead p{line-height:2.2}
  html[lang="ur"] .nav-links a,html[lang="ur"] .lang-links a{font-size:17px}
  html[lang="ur"] .toggle{font-size:15px}
  html[lang="ur"] .proof span,html[lang="ur"] .prog-row p,html[lang="ur"] .member span,html[lang="ur"] .member .intro,html[lang="ur"] .team-note,html[lang="ur"] .init p,html[lang="ur"] .step p,html[lang="ur"] .boundary,html[lang="ur"] .foot-small,html[lang="ur"] .hero-note,html[lang="ur"] .hero-sub2,html[lang="ur"] .coach-row span,html[lang="ur"] .gcard .fmt{font-size:17px;line-height:2.0}
  html[lang="ur"] .sec-head p{font-size:19px}
  html[lang="ur"] .gcard h3,html[lang="ur"] .coach-row b{font-size:19px}
  html[lang="ur"] .eyebrow,html[lang="ur"] .gcard .open,html[lang="ur"] .gopt-btn,html[lang="ur"] .prog-feature .fmt,html[lang="ur"] .prog-row .fmt,html[lang="ur"] .init .who,html[lang="ur"] .write-quote .src{font-size:15px;letter-spacing:0}
  html[lang="ur"] .hero-sub2{letter-spacing:0;text-transform:none}
  html[lang="ar"] body{font-family:"Noto Naskh Arabic","Traditional Arabic",sans-serif;font-size:19px;font-weight:500;line-height:1.8}
  html[lang="ar"] h1,html[lang="ar"] h2,html[lang="ar"] h3,html[lang="ar"] .hook{font-family:"Noto Sans Arabic",sans-serif;font-weight:700;line-height:1.5;letter-spacing:0}
  html[lang="ar"] .hook{font-size:clamp(30px,4vw,50px);line-height:1.35}
  html[lang="ar"] .nav-links a,html[lang="ar"] .lang-links a{font-size:16px}
  html[lang="ar"] .toggle{font-size:15px}
  html[lang="ar"] .proof span,html[lang="ar"] .prog-row p,html[lang="ar"] .member span,html[lang="ar"] .member .intro,html[lang="ar"] .team-note,html[lang="ar"] .init p,html[lang="ar"] .step p,html[lang="ar"] .boundary,html[lang="ar"] .foot-small,html[lang="ar"] .hero-note,html[lang="ar"] .hero-sub2,html[lang="ar"] .coach-row span,html[lang="ar"] .gcard .fmt{font-size:16px;line-height:1.8}
  html[lang="ar"] .sec-head p{font-size:18px}
  html[lang="ar"] .gcard h3,html[lang="ar"] .coach-row b{font-size:18px}
  html[lang="ar"] .eyebrow,html[lang="ar"] .gcard .open,html[lang="ar"] .gopt-btn,html[lang="ar"] .prog-feature .fmt,html[lang="ar"] .prog-row .fmt,html[lang="ar"] .init .who,html[lang="ar"] .write-quote .src{font-size:14px;letter-spacing:0;text-transform:none}
  html[lang="ar"] .hero-sub2{letter-spacing:0;text-transform:none}
  .hero{min-height:0;display:block;background:var(--navy)}
  .stage{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--navy)}
  .vwrap{position:absolute;inset:0}
  .vwrap video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .hero-in{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:0 0 46px}
  .hero-in .emblem{width:74px;height:74px;margin-bottom:16px}
  .hook{font-size:clamp(38px,5.6vw,80px)}
  .hero-lead{background:var(--bg);padding:46px 0 10px;transition:background .5s ease}
  .hero-lead p{font-size:clamp(17px,1.7vw,20px);line-height:1.8;max-width:920px;color:var(--text)}
  /* Hero emblem hidden below 1400px (2026-11-13): with the brand lockup line
     the bottom-anchored hero content fills the viewport-tall stage, and the
     emblem was pushed behind the fixed nav. It duplicates the nav bezel logo. */
  @media (max-width:1399px){ .hero-in .emblem{display:none} }
  .hook .w{display:inline-block;opacity:0;transform:translateY(.35em);animation:wup .7s cubic-bezier(.2,.7,.25,1) forwards;animation-delay:calc(var(--i)*65ms + 150ms)}
  @keyframes wup{to{opacity:1;transform:none}}
  .hero-sub2{margin-top:14px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.66)}
  /* HERO BRAND LOCKUP (2026-11-13, restacked same evening on Imran's order:
     AIDE + slogan BIG, rest of the hero text small): stacked brand block —
     AIDE huge, green rule, tagline — above the eyebrow. On UR/AR pages the
     block sits at the text (right) edge; the English wording stays LTR. */
  .hero-in .hero-brand{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:0 0 18px;font-family:"Montserrat","Segoe UI",system-ui,sans-serif;line-height:1.1;text-shadow:0 1px 10px rgba(0,0,0,.45);animation:heroRowIn .4s ease-out backwards}
  .hero-brand b{font-size:clamp(52px,6vw,84px);font-weight:800;letter-spacing:.06em;color:#fff;line-height:1}
  .hero-brand .hb-dot{width:64px;height:3px;background:#3DAB94;flex:none}
  .hero-brand .hb-tag{font-size:clamp(15px,1.7vw,22px);font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:#BFE9DF;line-height:1.4}
  html[lang="ur"] .hero-in .hero-brand,html[lang="ar"] .hero-in .hero-brand{align-items:flex-end;text-align:right}
  @media (max-width:560px){.hero-in .hero-brand{gap:6px;margin-bottom:14px}.hero-brand b{font-size:44px}.hero-brand .hb-dot{width:44px}.hero-brand .hb-tag{font-size:13px;letter-spacing:.22em}}
  /* Empty hero eyebrow (UR/AR locales carry no expansion line): remove the
     box entirely so no gap remains between the brand block and headline. */
  .hero-in .eyebrow:empty{display:none}
  .blend .row{animation:heroRowIn .4s ease-out backwards;transition:transform .3s ease}
  .blend .row:nth-child(1){animation-delay:.15s}
  .blend .row:nth-child(2){animation-delay:.27s}
  .blend .row:nth-child(3){animation-delay:.39s}
  .blend .row:hover{transform:translateY(-4px)}
  /* GLOW GOLD (owner 2026-11-19): hero third row, solid-button ring, proof words */
  .blend .row.alt{color:#E3C878}
  .btn.btn-solid{border:1.5px solid rgba(201,162,39,.9);box-shadow:0 0 0 1px rgba(201,162,39,.18),0 10px 28px rgba(61,171,148,.30)}
  .proof b em{color:#C9A227}
  /* GLOW (owner 2026-11-19): emerald radial over the hero shade + gold ring on the nav CTA */
  .hero .shade{background:radial-gradient(55% 46% at 26% 72%, rgba(61,171,148,.40) 0%, rgba(61,171,148,.16) 45%, rgba(61,171,148,0) 70%),linear-gradient(180deg, rgba(10,26,59,.42) 0%, rgba(10,26,59,.08) 34%, rgba(10,26,59,.55) 78%, rgba(10,26,59,.88) 100%)}
  .nav-links a.nav-cta{border:1.5px solid rgba(201,162,39,.9);box-shadow:0 0 0 1px rgba(201,162,39,.18),0 10px 28px rgba(61,171,148,.35)}
  @keyframes heroRowIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
  .blend{animation:heroFloat 7s ease-in-out 1.4s infinite alternate}
  @keyframes heroFloat{from{transform:translateY(0)}to{transform:translateY(-7px)}}
  @media (prefers-reduced-motion: reduce){.hero-brand,.blend,.blend .row{animation:none!important}.blend .row{opacity:1;transform:none}}
  /* HERO FIT (2026-11-13, reworked same evening): the stage is exactly one
     viewport tall, so the film fills the whole first screen. NEVER combine
     aspect-ratio with max-height here: when the cap binds, the browser
     shrinks the WIDTH to preserve the ratio, leaving a bare navy strip
     (the 16/10 + 100vh bug: a 1229px stage on a 1366px screen). Headline
     sizes follow the brand-first hierarchy — the lockup is the big
     element now, the headline reads smaller. */
  @media (min-width:821px){
    .stage{aspect-ratio:auto;height:100vh;height:100svh;max-height:none}
    .hero-in{padding-bottom:44px}
    .hero-in .blend{font-size:clamp(40px,4.6vw,58px)}
    html[lang="ur"] .hero-in .hook{font-size:clamp(24px,2.9vw,32px)}
    html[lang="ar"] .hero-in .hook{font-size:clamp(28px,3.4vw,40px)}
    .hero-cta{margin-top:24px}
    .hero-sub2{margin-top:10px}
  }
  @media (min-width:1700px){
    .hero-in .wrap{width:min(1560px,92vw)}
    .hero-in .blend{font-size:72px}
  }
  /* Short laptop screens (e.g. 1366x768): shrink the headline one step so
     the brand lockup clears the fixed nav with room to spare. */
  @media (min-width:821px) and (max-height:800px){
    .hero-in{padding-bottom:36px}
    .hero-in .blend{font-size:clamp(38px,4.2vw,50px)}
    html[lang="ur"] .hero-in .hook{font-size:clamp(22px,2.8vw,28px)}
    html[lang="ar"] .hero-in .hook{font-size:clamp(26px,3.2vw,34px)}
  }
  /* Narrow desktop (the nav wraps to two rows, ~161px tall): shrink further
     and tighten, so the brand lockup clears the taller nav. Comes last so
     it wins where both narrow and short apply. */
  @media (min-width:821px) and (max-width:1100px){
    .hero-in{padding-bottom:36px}
    .hero-brand b{font-size:clamp(44px,5vw,60px)}
    .hero-brand .hb-tag{font-size:15px}
    .hero-in .blend{font-size:clamp(36px,4.4vw,46px)}
    html[lang="ur"] .hero-in .hook{font-size:clamp(22px,2.8vw,28px)}
    html[lang="ar"] .hero-in .hook{font-size:clamp(26px,3.2vw,34px)}
  }
  /* Very short viewports (browser chrome eats viewport height, e.g.
     1366x640): the bottom-anchored hero content overflows the top and
     the AIDE brand hides behind the fixed nav — only its bottom sliver
     shows. Compact everything one more step. Applies ONLY below 700px
     height, so every verified size (768px+) is untouched. */
  @media (min-width:821px) and (max-height:700px){
    .hero-in{padding-bottom:28px}
    .hero-brand{gap:6px;margin-bottom:12px}
    .hero-brand b{font-size:clamp(44px,5vw,50px)}
    .hero-brand .hb-tag{font-size:14px;letter-spacing:.22em}
    .hero-in .blend{font-size:40px}
    html[lang="ur"] .hero-in .hook{font-size:24px}
    html[lang="ar"] .hero-in .hook{font-size:30px}
    .hero-cta{margin-top:16px}
    .hero-sub2{margin-top:8px}
  }
  /* Narrow + short together (two-row nav + short stage): tighten once
     more — the UR headline is the tallest content. */
  @media (min-width:821px) and (max-width:1100px) and (max-height:700px){
    .hero-in{padding-bottom:24px}
    .hero-brand b{font-size:44px}
    .hero-in .blend{font-size:38px}
    html[lang="ur"] .hero-in .hook{font-size:22px}
    html[lang="ar"] .hero-in .hook{font-size:28px}
    .hero-cta{margin-top:12px}
  }
  /* Wide-ratio viewports (browser chrome shortens the viewport below
     16:9): object-fit:cover crops the film top+bottom, cutting heads in
     the tightest shots. Above 16:9, pin the visible window to the TOP of
     the frame so heads are never cropped; the crop comes off the bottom
     (laps, floors, audience) instead. At/below 16:9 nothing crops, so
     the default centering stands. */
  @media (min-width:821px) and (min-aspect-ratio:16/9){
    .vwrap video{object-position:50% 0}
  }
  /* NAV DIM (2026-11-14, Imran's idea): while a head rises into the top
     strip of the hero film, JS adds .nav-dim to the nav and its blue
     dims so the head shows through the blur. Same hues as the themes,
     lower alpha; the 14px backdrop blur stays. */
  nav{transition:background-color .35s ease}
  html[data-theme="night"] nav.nav-dim{background:rgba(10,26,59,.30)}
  html[data-theme="day"] nav.nav-dim{background:rgba(232,233,235,.40)}
  /* DIAGONAL CUT (2026-11-13): the .cut divider overlaps the hero's bottom
     edge (negative top margin, opaque, z-index 3 over the hero content).
     At 54px its triangle covered the RTL hero-sub2 line (right-aligned,
     bottom of the hero) — only glyph tops showed. Smaller triangle + the
     triangle mirrored on RTL pages (same polygon as the demo's .flip),
     so the text edge stays clear on every locale. */
  .cut{height:36px;margin-top:-36px}
  html[dir="rtl"] .cut{clip-path:polygon(0 0,100% 100%,0 100%)}
  @media (max-width:820px){
    .stage{aspect-ratio:auto;max-height:none;display:block}
    .vwrap{position:relative;aspect-ratio:16/9;width:100%}
    .hero-in{position:static;padding:34px 0 44px;background:linear-gradient(180deg,#081230,#0D2148)}
    .hero-in .emblem{display:none}
    .hook{font-size:clamp(30px,9vw,44px)}
    body{padding-bottom:54px}
  }
  .proven .wrap{grid-template-columns:repeat(3,1fr)}
  .proof:nth-child(4){border-left:none}
  .proof:nth-child(n+4){border-top:1px solid rgba(255,255,255,.12)}
  @media (max-width:900px){ .proven .wrap{grid-template-columns:1fr 1fr} .proof:nth-child(3){border-left:none} .proof:nth-child(n+3){border-top:1px solid rgba(255,255,255,.12)} .proof:nth-child(4){border-left:1px solid rgba(255,255,255,.12)} }
  @media (max-width:520px){ .proven .wrap{grid-template-columns:1fr} .proof{border-left:none!important} }
  .steps3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:34px 0 6px}
  .steps3 .step b i{font-style:normal}
  @media (max-width:820px){ .steps3{grid-template-columns:1fr} }
  .prog-feature{position:relative}
  .prog-feature::before{content:"";position:absolute;top:0;left:-45%;width:45%;height:3px;z-index:3;
    background:linear-gradient(90deg,transparent,#C9A227,#4FBFA7,transparent);animation:beam 12s ease-in-out infinite}
  @keyframes beam{0%{left:-45%}38%{left:100%}100%{left:100%}}
  .team-grid{grid-template-columns:repeat(3,1fr)}
  .member:nth-child(4){transform:none}
  .member .intro{font-size:14px;color:var(--text-dim);line-height:1.65;margin-top:9px}
  @media (max-width:960px){ .team-grid{grid-template-columns:1fr 1fr} }
  @media (max-width:520px){ .team-grid{grid-template-columns:1fr} }
  .init p{font-size:15px;line-height:1.72}
  .coach-list{display:grid;gap:12px}
  .coach-row{background:var(--surface);border:1px solid var(--surface-line);padding:18px 22px;box-shadow:var(--card-shadow)}
  .coach-row b{display:block;font-size:16.5px;color:var(--head)}
  .coach-row span{display:block;font-size:14px;color:var(--text-dim);margin-top:3px;line-height:1.6}
  .coach-row a{display:inline-block;margin-top:9px;font-weight:700;color:var(--sea);text-decoration:none;border-bottom:2px solid var(--sea);padding-bottom:2px}
  .coach-row a:hover{color:var(--sea-hi)}
  .sticky-book{display:none}
  @media (max-width:820px){
    .sticky-book{display:block;position:fixed;left:0;right:0;bottom:0;z-index:58;background:var(--sea);color:#04160F;
      text-align:center;font-weight:700;font-size:15.5px;padding:15px 10px;text-decoration:none;box-shadow:0 -6px 24px rgba(0,0,0,.3)}
  }
  .lang-links a{font-weight:700}
  .foot-pages a{margin-inline-end:14px}
  @media (prefers-reduced-motion: reduce){
    .hook .w{opacity:1;transform:none;animation:none}
    .prog-feature::before{animation:none;display:none}
  }
  /* ===== MOTION PASS 2026-11-04 — حرکت ماسٹری پیک specs ===== */
  .rv{transform:translateY(18px);transition:opacity .55s ease,transform .55s cubic-bezier(.2,.7,.2,1)}
  .btn{transition:transform .22s cubic-bezier(.34,1.56,.64,1),background .25s ease}
  .btn:active{transform:scale(.96)}
  .sticky-book:active{opacity:.85}
  @media (prefers-reduced-motion: reduce){
    .btn:active,.sticky-book:active{transform:none;opacity:1}
  }
  /* ===== LIVING PASS 2026-11-05 — زندہ روح: guide, uswa explorer, hero veil ===== */
  .bezel::after,.emblem::after{animation-duration:30s}
  body{opacity:0;transition:opacity .35s ease}
  body.ready{opacity:1}
  @media (prefers-reduced-motion: reduce){ body{opacity:1;transition:none} }
  .veil{position:absolute;inset:0;z-index:1;pointer-events:none;mix-blend-mode:screen;
    background:radial-gradient(60% 50% at 28% 30%,rgba(201,162,39,.20),transparent 70%),radial-gradient(50% 45% at 78% 68%,rgba(61,171,148,.16),transparent 70%);
    animation:breathe 9s ease-in-out infinite alternate}
  @keyframes breathe{from{opacity:.45;transform:scale(1)}to{opacity:.95;transform:scale(1.05)}}
  @media (prefers-reduced-motion: reduce){ .veil{animation:none;opacity:.5} }
  .vwrap{cursor:pointer}
  .vstate{position:absolute;bottom:16px;inset-inline-end:18px;z-index:2;width:44px;height:44px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-size:17px;color:#fff;
    background:rgba(10,26,59,.38);border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(6px);
    opacity:0;transform:scale(.85);transition:opacity .25s ease,transform .25s ease;pointer-events:none}
  .vstate.show{opacity:1;transform:scale(1)}
  .guide{padding:56px 0 8px}
  .guide-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:26px}
  .gopt-btn{background:var(--surface);border:1px solid var(--surface-line);color:var(--head);border-radius:14px;
    padding:18px 16px;font:inherit;font-weight:700;font-size:15.5px;cursor:pointer;text-align:start;line-height:1.55;
    transition:border-color .25s ease,transform .25s ease,background .25s ease}
  .gopt-btn:hover{transform:translateY(-2px);border-color:var(--sea)}
  .gopt-btn.on{border-color:var(--sea);background:linear-gradient(160deg,rgba(61,171,148,.16),rgba(61,171,148,.04))}
  .gpanel{display:none;margin-top:16px}
  .gpanel.on{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;animation:gfade .4s ease}
  @keyframes gfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .gcard{display:block;background:var(--surface);border:1px solid var(--surface-line);border-radius:14px;padding:18px;text-decoration:none}
  .gcard h3{font-size:17px;color:var(--head);margin-bottom:6px}
  .gcard .fmt{font-size:13px;color:var(--sea-hi);letter-spacing:.02em}
  .gcard .open{display:inline-block;margin-top:10px;font-weight:700;color:var(--sea);font-size:14px}
  @media (max-width:900px){ .guide-grid{grid-template-columns:1fr 1fr} .gpanel.on{grid-template-columns:1fr} }
  .uswa button{background:var(--navy-2);padding:24px 22px;border:none;font:inherit;text-align:start;cursor:pointer;color:inherit;
    transition:background .25s ease,box-shadow .25s ease}
  .uswa button i{font-style:normal;color:var(--sea-hi);font-weight:800;font-size:22px;display:block;margin-bottom:8px}
  .uswa button b{display:block;color:#fff;font-size:17px}
  .uswa button span{font-size:13.5px;color:rgba(232,233,235,.65)}
  .uswa button.on{box-shadow:inset 0 0 0 2px var(--sea);background:#0E2A57}
  .uswa-detail{margin-top:1px;background:var(--navy-2);border-top:2px solid var(--sea);padding:18px 22px;color:var(--text)}
  .uswa-detail b{color:#fff}
  .uswa-detail .wk{display:block;margin-top:5px;font-size:13.5px;color:var(--sea-hi)}
  .nav-links a.act{color:var(--sea-hi)}
  .qback{margin-top:14px;background:none;border:none;color:var(--sea);font:inherit;font-weight:700;cursor:pointer;padding:6px 2px}
  .qnext{margin-top:16px;font-size:15px}
  .qnext a{color:var(--sea);font-weight:700;text-decoration:none;border-bottom:2px solid var(--sea);padding-bottom:2px}
  .book-panel{background:var(--surface);border:1px solid var(--surface-line);border-radius:16px;padding:22px;box-shadow:var(--card-shadow)}
  .bp-label{display:block;font-weight:700;color:var(--head);margin-bottom:10px;font-size:16px}
  .bp-select{width:100%;font:inherit;font-size:16px;padding:13px 14px;border-radius:10px;border:1px solid var(--surface-line);
    background:var(--bg-soft);color:var(--head);cursor:pointer}
  .bp-select:focus{outline:2px solid var(--sea);outline-offset:1px}
  .bp-field{margin-top:14px;font-size:15px;line-height:1.7;color:var(--text-dim);min-height:3.2em}
  .bp-for{margin-top:2px;font-size:14.5px;line-height:1.65;color:var(--sea);font-weight:600}
  .bp-note{margin-top:14px;font-size:13.5px;line-height:1.65;color:var(--text-dim)}
  .books-strip{display:flex;align-items:stretch;gap:14px;background:var(--surface);border:1px solid var(--surface-line);border-radius:16px;padding:16px;box-shadow:var(--card-shadow);text-decoration:none;transition:transform .3s cubic-bezier(.2,.7,.2,1),border-color .3s ease}
  .books-strip:hover{transform:translateY(-3px);border-color:var(--sea)}
  .bs-item{flex:1;display:flex;flex-direction:column;gap:9px;min-width:0}
  .bs-item img{width:100%;aspect-ratio:7/10;object-fit:cover;border-radius:8px}
  .bs-item>span{font-size:13.5px;line-height:1.6;color:var(--text);font-weight:600}
  .bs-item>span[lang="ur"]{line-height:1.95}
  .bs-go{align-self:center;font-weight:700;color:var(--sea);white-space:nowrap;font-size:15px}
  @media (max-width:820px){ .books-strip{flex-wrap:wrap} .bs-item{flex:1 1 40%} .bs-go{flex:1;text-align:center;padding-top:4px} }
  @media (prefers-reduced-motion: reduce){ .books-strip:hover{transform:none} }
  .qnote{margin-top:14px;font-size:13.5px;line-height:1.65;color:var(--text-dim)}
  .ext-note{margin-top:10px;font-size:13.5px;color:var(--text-dim)}
  .ghint{font-size:13px;color:var(--text-dim);margin:2px 2px 10px}
  .book-panel .btn{margin-top:6px}
  .member .book-line{margin-top:12px}
  .member .book-line a{color:var(--sea);font-weight:700;text-decoration:none;border-bottom:2px solid var(--sea);padding-bottom:2px;font-size:14.5px}
  .member .book-line a:hover{color:var(--sea-hi)}
  .team-grid .member{position:relative;transition:transform .45s cubic-bezier(.2,.7,.25,1),box-shadow .45s ease}
  .team-grid .member:hover{transform:translateY(-6px) scale(1.015);box-shadow:0 26px 50px rgba(0,0,0,.38)}
  .team-grid .member:nth-child(4):hover{transform:translateY(-6px) scale(1.015)}
  .team-grid .member:active{transform:translateY(-2px) scale(.995)}
  .member .prof-line{margin-top:10px}
  .member .card-link{color:var(--sea);font-weight:700;text-decoration:none}
  .member .card-link::after{content:"";position:absolute;inset:0}
  .member .book-line{position:relative;z-index:2}
  @media (prefers-reduced-motion: reduce){ .team-grid .member{transition:none} .team-grid .member:hover{transform:none} }
  @media (prefers-reduced-motion: reduce){ .gpanel.on{animation:none} .veil{animation:none} }
/* AIDE popup card — LIVE 2026-11-15 (Abhasa pattern, AIDE design system).
   Homes only. Inner pages pending approval; books/store pages excluded.
   ?popup=1 forces it open (preview hook); ?popup=0 disables it. */
.apop{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,26,59,.62);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);visibility:hidden;opacity:0;pointer-events:none;transition:opacity .32s ease,visibility 0s linear .32s}
.apop.open{visibility:visible;opacity:1;pointer-events:auto;transition:opacity .32s ease}
.apop-card{width:100%;max-width:560px;max-height:calc(100svh - 40px);overflow-y:auto;background:#fff;border-radius:20px;padding:34px 34px 26px;position:relative;box-shadow:0 24px 60px rgba(10,26,59,.35);transform:translateY(14px) scale(.985);transition:transform .32s ease;text-align:center}
.apop.open .apop-card{transform:none}
.apop-x{position:absolute;top:14px;inset-inline-end:14px;width:44px;height:44px;border:1px solid #E8E9EB;background:#fff;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0A1A3B;padding:0}
.apop-x:hover{background:#F2F4F3}
.apop-x svg{width:18px;height:18px}
.apop-x:focus-visible,.apop-btn:focus-visible,.apop-cta a:focus-visible{outline:3px solid #3DAB94;outline-offset:2px}
.apop-eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#2E8C7A;font-weight:700;margin:0 0 10px}
[dir="rtl"] .apop-eyebrow{letter-spacing:0;text-transform:none;font-size:15px}
.apop-h{font-family:Montserrat,"Segoe UI",system-ui,-apple-system,Arial,sans-serif;font-size:clamp(26px,4.6vw,32px);font-weight:800;color:#0A1A3B;line-height:1.25;margin:0 0 10px}
html[lang="ur"] .apop-h,body.loc-ur .apop-h{font-family:'Noto Nastaliq Urdu','Traditional Arabic',serif;line-height:1.9}
html[lang="ar"] .apop-h,body.loc-ar .apop-h{font-family:'Noto Sans Arabic','Noto Naskh Arabic',sans-serif;line-height:1.5}
.apop-sub{font-size:16.5px;line-height:1.65;color:#44506A;margin:0 0 22px}
html[lang="ur"] .apop-sub,body.loc-ur .apop-sub{line-height:2}
html[lang="ar"] .apop-sub,body.loc-ar .apop-sub{line-height:1.8}
.apop-row{display:flex;align-items:center;gap:16px;text-align:start;border:1px solid #E8E9EB;border-radius:14px;padding:16px 18px;margin:0 0 12px;background:#FBFCFC}
.apop-ic{flex:0 0 56px;width:56px;height:56px;border-radius:50%;background:rgba(61,171,148,.13);display:flex;align-items:center;justify-content:center;color:#2E8C7A}
.apop-ic svg{width:26px;height:26px}
.apop-row-tx{flex:1;min-width:0}
.apop-row-tx h3{font-family:Montserrat,"Segoe UI",system-ui,-apple-system,Arial,sans-serif;font-size:19px;font-weight:800;color:#0A1A3B;margin:0 0 3px;line-height:1.3}
html[lang="ur"] .apop-row-tx h3,body.loc-ur .apop-row-tx h3{font-family:'Noto Nastaliq Urdu','Traditional Arabic',serif;line-height:1.9}
html[lang="ar"] .apop-row-tx h3,body.loc-ar .apop-row-tx h3{font-family:'Noto Sans Arabic','Noto Naskh Arabic',sans-serif;line-height:1.5}
.apop-row-tx p{font-size:14.5px;line-height:1.55;color:#5A6B84;margin:0}
html[lang="ur"] .apop-row-tx p,body.loc-ur .apop-row-tx p{line-height:1.9}
html[lang="ar"] .apop-row-tx p,body.loc-ar .apop-row-tx p{line-height:1.7}
.apop-btn{flex:0 0 auto;background:#3DAB94;color:#04160F;font-weight:700;font-size:15px;padding:11px 18px;border-radius:999px;text-decoration:none;white-space:nowrap}
.apop-btn:hover{background:#358F7C}
.apop-div{display:flex;align-items:center;gap:14px;margin:20px 0 16px;color:#7A8699;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}
.apop-div::before,.apop-div::after{content:"";flex:1;height:1px;background:#E8E9EB}
[dir="rtl"] .apop-div{letter-spacing:0;text-transform:none;font-size:14px}
.apop-cta{display:flex;gap:12px}
.apop-cta a{flex:1;display:flex;align-items:center;justify-content:center;gap:9px;min-height:52px;border-radius:999px;font-weight:700;font-size:16.5px;text-decoration:none;color:#fff;padding:12px 10px}
.apop-call{background:#0A1A3B}
.apop-call:hover{background:#16305E}
.apop-wa{background:#25D366}
.apop-wa:hover{background:#1FB857}
.apop-cta svg{width:20px;height:20px;flex:0 0 auto}
.apop-trust{display:flex;align-items:center;justify-content:center;gap:7px;margin:16px 0 0;font-size:13.5px;color:#7A8699}
.apop-trust svg{width:14px;height:14px;flex:0 0 auto}
@media (max-width:480px){
  .apop{padding:12px}
  .apop-card{padding:18px 20px 14px;border-radius:16px}
  .apop-eyebrow{margin-bottom:6px}
  .apop-h{font-size:26px;margin-bottom:6px}
  .apop-sub{font-size:15.5px;margin-bottom:12px}
  html[lang="ur"] .apop-sub,body.loc-ur .apop-sub{line-height:1.9}
  .apop-row{flex-wrap:wrap;gap:12px;padding:11px 16px;margin-bottom:10px}
  .apop-row-tx{flex:1 1 calc(100% - 68px)}
  .apop-btn{flex:1 1 100%;text-align:center;padding:11px 10px}
  .apop-div{margin:10px 0 8px}
  .apop-cta{flex-direction:column;gap:10px}
  .apop-cta a{flex:none;min-height:48px;padding:10px}
  .apop-trust{margin-top:8px;font-size:13px}
}
@media (prefers-reduced-motion:reduce){.apop,.apop-card{transition:none}}

/* ===== CONCEPT 2026-11-18: pill header + mega cards over the live video hero (lab copy only) ===== */
/* Top state: fully transparent, NO blur band — the film shows through cleanly. The old nav-dim's
   head-reveal purpose is served by transparency itself, so its background is neutralised. */
nav{background:transparent;border-bottom-color:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;transition:background-color .45s ease,border-color .45s ease}
html[data-theme="night"] nav.nav-dim,html[data-theme="day"] nav.nav-dim{background:transparent}
nav .nav-in{max-width:1180px;border-radius:120px;border:1px solid transparent;transition:max-width .45s ease,padding .45s ease,background-color .45s ease,border-color .45s ease,box-shadow .45s ease}
nav.scrolled .nav-in{max-width:1160px;padding:6px 14px;background:rgba(255,255,255,.82);border-color:rgba(10,26,59,.12);box-shadow:0 12px 32px rgba(10,26,59,.18);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
nav.scrolled .brand b{color:#0A1A3B}
nav.scrolled .brand span span{color:#6B7688}
nav.scrolled .nav-links a:not(.nav-cta){color:#1B2A45}
nav.scrolled .toggle{color:#0A1A3B;border-color:rgba(10,26,59,.25);background:rgba(255,255,255,.6)}
.nav-links a.nav-cta{display:inline-flex;align-items:center;gap:10px;background:var(--sea);color:#04160F;font-weight:700;font-size:14.5px;padding:7px 7px 7px 20px;border-radius:120px;text-decoration:none;flex:none;white-space:nowrap}
.nav-links a.nav-cta .arr{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.45);display:grid;place-items:center;font-size:14px;flex:none;transition:transform .25s ease}
.nav-links a.nav-cta:hover{background:var(--sea-hi)}
.nav-links a.nav-cta:hover .arr{transform:translateX(3px)}
.nav-links .has-drop{position:relative;display:inline-flex;align-items:center}
.nav-links .has-drop>a{display:inline-flex;align-items:center;gap:6px}
.nav-links .has-drop .chev{width:11px;height:11px;transition:transform .3s ease;flex:none}
.nav-links .has-drop:hover .chev{transform:rotate(180deg)}
.nav-links .drop{position:absolute;top:100%;inset-inline-start:0;min-width:240px;background:rgba(255,255,255,.96);border:1px solid rgba(10,26,59,.10);border-radius:16px;padding:8px;display:none;flex-direction:column;box-shadow:0 24px 60px rgba(10,26,59,.16);z-index:70;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.nav-links .has-drop:hover .drop,.nav-links .has-drop:focus-within .drop,.nav-links .has-drop.open .drop{display:flex}
.nav-links .drop a{color:#1B2A45;text-decoration:none;padding:9px 12px;border-radius:9px;font-size:14.5px;white-space:nowrap}
.nav-links .drop a:hover{background:#E7F2ED;color:#0A1A3B}
.nav-links .drop a.mega-item::after{content:none}
.nav-links .drop.mega{left:50%;inset-inline-start:auto;transform:translateX(-50%);width:min(880px,94vw);padding:12px 0 0;background:transparent;border:0;border-radius:0;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none}
.nav-links .mega-card{background:rgba(255,255,255,.96);border:1px solid rgba(10,26,59,.10);border-radius:24px;box-shadow:0 24px 60px rgba(10,26,59,.16);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:12px}
.nav-links .mega-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.nav-links .drop a.mega-item{display:flex;gap:14px;padding:14px 16px;border-radius:16px;white-space:normal;align-items:flex-start}
.nav-links .drop a.mega-item:hover{background:#F0F6F3}
.nav-links .mega-ico{width:44px;height:44px;flex:none;border-radius:12px;background:#E7F2ED;display:grid;place-items:center;color:#1F7A66}
.nav-links .mega-ico svg{width:22px;height:22px}
.nav-links .mega-tx{display:flex;flex-direction:column;min-width:0}
.nav-links .mega-tx b{font-size:16px;font-weight:700;color:#0A1A3B;line-height:1.35}
.nav-links .mega-meta{display:block;font-size:12.5px;font-weight:600;color:#1F7A66;margin-top:4px}
.nav-links .mega-foot{display:flex;justify-content:flex-end;padding:12px 16px 4px;margin-top:8px;border-top:1px solid #EEEADF}
.nav-links .mega-foot a{font-weight:700;color:#1F7A66;font-size:14px}
.nav-links .mega-foot a:hover{background:none;text-decoration:underline}
html[lang="ur"] .nav-links .mega-tx b{line-height:1.9}
html[lang="ur"] .nav-links .mega-meta{line-height:1.9}
html[lang="ar"] .nav-links .mega-tx b,html[lang="ar"] .nav-links .mega-meta{line-height:1.7}
/* --- header fit: one row, nothing squeezes internally. Section-anchor links are
   shed from the header (concept choice — they duplicate scrolling; one rule
   restores them) so the bar fits one row with the booking button. --- */
nav .nav-links{gap:14px}
nav .nav-links a{white-space:nowrap}
nav .brand{flex:none}
nav .brand b,nav .brand span span{white-space:nowrap}
nav .toggle{flex:none}
nav .lang-wrap{flex:none}
nav .sec-link{display:none}
nav.scrolled .toggle #themeLabel{display:none}
@media (max-width:1400px){.toggle #themeLabel{display:none}}
@media (max-width:1150px){nav .nav-links{gap:10px}nav .brand span span{display:none}.nav-links a.nav-cta{padding:6px 6px 6px 16px;font-size:14px}}
@media (max-width:480px){nav .toggle{display:none}}
@media (max-width:820px){
  nav .nav-in{max-width:100%;border-radius:24px}
  nav.scrolled .nav-in{max-width:100%}
  nav .nav-links a.nav-cta{display:inline-flex}
  .toggle #themeLabel{display:none}
  nav .nav-links .has-drop{display:none}
  nav .lang-wrap{display:none}
  nav .nav-in{gap:8px;width:calc(100vw - 16px)}
  nav .nav-links{gap:8px}
  nav .bezel{width:44px;height:44px}
  .nav-links a.nav-cta{padding:6px 6px 6px 12px;font-size:13px}
  .nav-links a.nav-cta .arr{width:28px;height:28px}
}
/* --- Resources preview card: links + a preview panel that follows the hovered link --- */
.nav-links .drop.res-mega{left:50%;inset-inline-start:auto;transform:translateX(-50%);width:min(620px,94vw);padding:12px 0 0;background:transparent;border:0;border-radius:0;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none}
.nav-links .res-card{display:flex;min-height:220px;background:rgba(255,255,255,.96);border:1px solid rgba(10,26,59,.10);border-radius:24px;box-shadow:0 24px 60px rgba(10,26,59,.16);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:12px}
.nav-links .res-links{display:flex;flex-direction:column;flex:0 0 218px;padding:4px}
.nav-links .res-links a{padding:11px 12px;font-size:15px;font-weight:600}
.nav-links .res-pv{flex:1;min-width:0;border-inline-start:1px solid #EEEADF;display:flex;flex-direction:column}
.nav-links .drop a.pv{display:none;flex-direction:column;flex:1;padding:14px;padding-inline-start:26px;border-radius:16px;white-space:normal}
.nav-links .drop a.pv[data-pv="0"]{display:flex}
.nav-links .res-mega:has([data-pv="1"]:hover) .pv[data-pv="0"],.nav-links .res-mega:has([data-pv="1"]:focus-visible) .pv[data-pv="0"],.nav-links .res-mega:has([data-pv="2"]:hover) .pv[data-pv="0"],.nav-links .res-mega:has([data-pv="2"]:focus-visible) .pv[data-pv="0"],.nav-links .res-mega:has([data-pv="3"]:hover) .pv[data-pv="0"],.nav-links .res-mega:has([data-pv="3"]:focus-visible) .pv[data-pv="0"]{display:none}
.nav-links .res-mega:has([data-pv="1"]:hover) .pv[data-pv="1"],.nav-links .res-mega:has([data-pv="1"]:focus-visible) .pv[data-pv="1"],.nav-links .res-mega:has([data-pv="2"]:hover) .pv[data-pv="2"],.nav-links .res-mega:has([data-pv="2"]:focus-visible) .pv[data-pv="2"],.nav-links .res-mega:has([data-pv="3"]:hover) .pv[data-pv="3"],.nav-links .res-mega:has([data-pv="3"]:focus-visible) .pv[data-pv="3"]{display:flex}
.nav-links .drop a.pv:hover{background:#F0F6F3}
.nav-links .pv-covers{display:flex;gap:8px;margin-bottom:12px}
.nav-links .pv-covers img{width:88px;aspect-ratio:640/908;object-fit:cover;border-radius:8px;box-shadow:0 6px 18px rgba(10,26,59,.20)}
.nav-links .pv-img{display:block;width:100%;height:125px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 6px 18px rgba(10,26,59,.18)}
.nav-links .drop a.pv b{font-size:17px;font-weight:700;color:#0A1A3B;line-height:1.35}
.nav-links .pv-line{display:block;font-size:13.5px;color:#4A5A72;margin-top:5px;line-height:1.5}
html[lang="ur"] .nav-links .drop a.pv b,html[lang="ur"] .nav-links .pv-line{line-height:1.9}
html[lang="ar"] .nav-links .drop a.pv b,html[lang="ar"] .nav-links .pv-line{line-height:1.7}
/* --- language dropdown: one button, three options stacked --- */
.nav-links .lang-btn{background:none;border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:99px;padding:7px 13px;cursor:pointer;font:inherit;font-size:13.5px;white-space:nowrap;flex:none}
.nav-links .lang-btn:hover{border-color:var(--sea)}
html[data-theme="day"] .nav-links .lang-btn{color:#0A1A3B;border-color:rgba(10,26,59,.25)}
nav.scrolled .lang-btn{color:#0A1A3B;border-color:rgba(10,26,59,.25);background:rgba(255,255,255,.6)}
.nav-links .drop.lang-drop{min-width:150px}
.nav-links .drop.lang-drop a[aria-current="page"]{font-weight:700;color:#1F7A66}
/* --- mega centring fix (owner 2026-11-19): drops anchor to the full-width nav so they centre on the
   viewport at every width (EN mega overflowed 47-97px at 821-1024px when centred on its link).
   margin-top pulls the drop up to touch the link row, so the hover bridge has no dead strip. --- */
.nav-links .has-drop:has(.drop.mega),.nav-links .has-drop:has(.drop.res-mega){position:static}
.nav-links .drop.mega,.nav-links .drop.res-mega{inset-inline-start:auto;left:50%;right:auto;transform:translateX(-50%);margin-top:-30px}
/* --- HERO WORD IDLE (LAB EXPERIMENT 2026-11-19 — owner feel-check in the morning; NOT live) ---
   CHANGE lifts gently, DIFFERENTLY settles + widens a touch; different periods so they never lockstep.
   Inner spans: the .w entrance is untouched; idle motion composes on top. */
.hook .w-bob,.hook .w-sway{display:inline-block}
.hook .w-bob{animation:bobY 4.5s ease-in-out infinite}
.hook .w-sway{animation:swayY 5.5s ease-in-out infinite}
@keyframes bobY{0%,100%{transform:translateY(0)}50%{transform:translateY(-.06em)}}
@keyframes swayY{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(.04em) scale(1.02)}}
@media (prefers-reduced-motion:reduce){.hook .w-bob,.hook .w-sway{animation:none}}
/* LIQUID NAVY (owner 2026-11-19 — LAB): background navy as floating liquid — soft luminous orbs drift behind everything; solid navy surfaces go translucent so the liquid shows through */
html[data-theme="night"] body::before,html[data-theme="night"] body::after{content:"";position:fixed;inset:-90px;z-index:-1;pointer-events:none}
html[data-theme="night"] body::before{background:radial-gradient(52% 42% at 16% 20%,rgba(61,171,148,.25) 0%,rgba(61,171,148,0) 70%),radial-gradient(44% 36% at 80% 24%,rgba(201,162,39,.13) 0%,rgba(201,162,39,0) 70%),radial-gradient(58% 46% at 64% 82%,rgba(31,122,102,.23) 0%,rgba(31,122,102,0) 70%);animation:liquidDrift 36s ease-in-out infinite alternate}
html[data-theme="night"] body::after{background:radial-gradient(40% 32% at 74% 62%,rgba(79,191,167,.17) 0%,rgba(79,191,167,0) 70%),radial-gradient(46% 38% at 24% 70%,rgba(61,171,148,.15) 0%,rgba(61,171,148,0) 70%);animation:liquidDrift2 44s ease-in-out infinite alternate}
@keyframes liquidDrift{from{transform:translate3d(-26px,-14px,0) scale(1)}to{transform:translate3d(28px,18px,0) scale(1.05)}}
@keyframes liquidDrift2{from{transform:translate3d(22px,12px,0)}to{transform:translate3d(-24px,-18px,0)}}
/* solid navy surfaces go see-through (night only) so the liquid shows through */
html[data-theme="night"] #programmes,html[data-theme="night"] #start{background:rgba(13,33,72,.42)!important;background:color-mix(in srgb,var(--bg-soft) 38%,transparent)!important}
html[data-theme="night"] .cut{background:rgba(10,26,59,.45)!important;background:color-mix(in srgb,var(--bg) 45%,transparent)!important}
html[data-theme="night"] .prog-feature{background:rgba(10,26,59,.55);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%)}
/* PROG TONES (owner 2026-11-20 — one colour per programme, same system as programmes page) */
.prog-row.tone-habit{background:color-mix(in srgb,#3DAB94 26%,var(--bg-soft));border-inline-start:4px solid #3DAB94}
.prog-row.tone-habit .no,.prog-row.tone-habit .fmt,.prog-row.tone-habit .arr{color:#4FBFA7}
.prog-row.tone-habit:hover{background:color-mix(in srgb,#3DAB94 34%,var(--bg-soft))}
.prog-row.tone-sales{background:color-mix(in srgb,#C9A227 26%,var(--bg-soft));border-inline-start:4px solid #C9A227}
.prog-row.tone-sales .no,.prog-row.tone-sales .fmt,.prog-row.tone-sales .arr{color:#E3C878}
.prog-row.tone-sales:hover{background:color-mix(in srgb,#C9A227 34%,var(--bg-soft))}
.prog-row.tone-teach{background:color-mix(in srgb,#5B8DC9 26%,var(--bg-soft));border-inline-start:4px solid #5B8DC9}
.prog-row.tone-teach .no,.prog-row.tone-teach .fmt,.prog-row.tone-teach .arr{color:#8FB4DE}
.prog-row.tone-teach:hover{background:color-mix(in srgb,#5B8DC9 34%,var(--bg-soft))}
.prog-row.tone-homes{background:color-mix(in srgb,#1F7A66 28%,var(--bg-soft));border-inline-start:4px solid #1F7A66}
.prog-row.tone-homes .no,.prog-row.tone-homes .fmt,.prog-row.tone-homes .arr{color:#5EC4A8}
.prog-row.tone-homes:hover{background:color-mix(in srgb,#1F7A66 36%,var(--bg-soft))}
.prog-row.tone-rise{background:linear-gradient(180deg,#F4EFE3,#E9DFC6);border:1px solid rgba(201,162,39,.5);border-inline-start:4px solid #C9A227}
.prog-row.tone-rise h3{color:#0A1A3B}
.prog-row.tone-rise p{color:#3D4A5C}
.prog-row.tone-rise .no,.prog-row.tone-rise .fmt,.prog-row.tone-rise .arr{color:#8A6D1B}
.prog-row.tone-rise:hover{background:linear-gradient(180deg,#EFE8D5,#E2D5B4)}
html[data-theme="day"] .prog-row.tone-habit .no,html[data-theme="day"] .prog-row.tone-habit .fmt,html[data-theme="day"] .prog-row.tone-habit .arr{color:#1F7A66}
html[data-theme="day"] .prog-row.tone-sales .no,html[data-theme="day"] .prog-row.tone-sales .fmt,html[data-theme="day"] .prog-row.tone-sales .arr{color:#8A6D1B}
html[data-theme="day"] .prog-row.tone-teach .no,html[data-theme="day"] .prog-row.tone-teach .fmt,html[data-theme="day"] .prog-row.tone-teach .arr{color:#2F5D8A}
html[data-theme="day"] .prog-row.tone-homes .no,html[data-theme="day"] .prog-row.tone-homes .fmt,html[data-theme="day"] .prog-row.tone-homes .arr{color:#1F7A66}
html[data-theme="night"] .uswa div{background:rgba(14,34,73,.45)}
@media (prefers-reduced-motion:reduce){html[data-theme="night"] body::before,html[data-theme="night"] body::after{animation:none}}
@media (prefers-reduced-transparency:reduce){html[data-theme="night"] body::before,html[data-theme="night"] body::after{display:none}html[data-theme="night"] #programmes,html[data-theme="night"] #start,html[data-theme="night"] .cut{background:var(--bg-soft)!important}html[data-theme="night"] .prog-feature{background:var(--navy)}html[data-theme="night"] .uswa div{background:var(--navy-2)}}
  /* TAKEAWAYS (owner 2026-11-19 — LAB): three-site review — announcement bar, three doors, dated cohorts, workbook, five reasons; proof count-up is JS-only on the existing strip */
  :root{--td-bar-h:44px}
  html[lang="ur"]{--td-bar-h:56px}
  .td-bar{display:flex;align-items:center;justify-content:center;height:var(--td-bar-h);padding:0 16px;background:#081230;color:#E3C878;font-size:15px;font-weight:600;text-align:center;border-bottom:1px solid rgba(227,200,120,.22);white-space:nowrap;overflow:hidden}
  .td-bar a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(227,200,120,.55);overflow:hidden;text-overflow:ellipsis}
  .td-bar a:hover{color:#fff}
  .td-bar .arr{font-weight:800}
  html[lang="ur"] .td-bar{font-size:17px;line-height:1.9}
  @media (max-width:600px){.td-bar{white-space:normal;height:auto;min-height:var(--td-bar-h);padding:6px 16px;line-height:1.45}.td-bar a{white-space:normal;overflow:visible;text-overflow:clip}html[lang="ur"] .td-bar{line-height:1.7}:root{--td-bar-h:58px}html[lang="ur"]{--td-bar-h:78px}html[lang="ar"]{--td-bar-h:56px}}
  nav{top:var(--td-bar-h);transition:background-color .35s ease,top .3s ease}
  nav.scrolled{top:0}
  .td-doors{background:var(--bg-soft)}
  html[data-theme="night"] .td-doors{background:rgba(13,33,72,.45)}
  .td-door-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
  .td-door{position:relative;display:block;text-decoration:none;border-radius:20px;overflow:hidden;aspect-ratio:3/3.9;background:var(--navy-2);border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 50px rgba(0,0,0,.35)}
  .td-door img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
  .td-door:hover img{transform:scale(1.05)}
  .td-door .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,12,30,0) 42%,rgba(4,12,30,.82) 78%,rgba(4,12,30,.94) 100%)}
  .td-door .td-body{position:absolute;left:0;right:0;bottom:0;padding:24px}
  .td-door .eyebrow{display:block;margin:0 0 6px}
  .td-door h3{margin:0 0 6px}
  .td-door p{margin:0;color:rgba(242,245,247,.85)}
  html[lang="en"] .td-door p{font-size:15px;line-height:1.5}
  .td-door .tile{position:absolute;top:18px;right:18px;width:44px;height:44px;border-radius:50%;background:var(--gold);color:#04160F;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;transition:transform .3s ease}
  .td-door:hover .tile{transform:translate(3px,-3px)}
  .td-cohort-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
  .td-cohort{background:var(--surface,rgba(255,255,255,.055));backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--surface-line,rgba(255,255,255,.12));border-radius:18px;padding:26px;display:flex;flex-direction:column}
  .td-cohort .prog{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sea-hi);margin:0 0 8px}
  html[lang="ur"] .td-cohort .prog,html[lang="ar"] .td-cohort .prog{letter-spacing:0;font-size:14px}
  .td-cohort h3{margin:0 0 18px}
  .td-cohort .fact{display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-top:1px solid var(--line,rgba(255,255,255,.1));font-size:15px}
  html[lang="ur"] .td-cohort .fact,html[lang="ar"] .td-cohort .fact{font-size:17px}
  .td-cohort .fact span{color:var(--text-dim);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding-top:2px}
  html[lang="ur"] .td-cohort .fact span,html[lang="ar"] .td-cohort .fact span{letter-spacing:0;font-size:14px}
  .td-cohort .fact b{font-weight:600;text-align:right}
  html[dir="rtl"] .td-cohort .fact b{text-align:left}
  .td-cohort .btn{margin-top:20px;justify-content:center}
  .td-workbook{position:relative;padding:110px 0;text-align:center;overflow:hidden;background:#04101f}
  .td-workbook img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5}
  .td-workbook .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,12,30,.55),rgba(4,12,30,.82))}
  .td-workbook .inner{position:relative;max-width:760px;margin:0 auto;padding:0 24px}
  .td-workbook h2{margin:0 0 6px}
  .td-wb-ur{font-family:"Noto Nastaliq Urdu","Traditional Arabic",serif;font-size:24px;line-height:2;color:#E3C878;margin:6px 0 26px}
  .td-workbook p{color:rgba(242,245,247,.85)}
  html[lang="en"] .td-workbook p{font-size:17px}
  .td-rsn-grid{display:grid;grid-template-columns:300px 1fr;gap:36px;align-items:start}
  .td-rsn-btns{display:flex;flex-direction:column;gap:10px}
  .td-rsn-btn{display:flex;align-items:center;gap:14px;text-align:left;cursor:pointer;background:transparent;border:1px solid var(--line,rgba(255,255,255,.14));border-radius:14px;padding:14px 16px;color:var(--text);font-size:16px;font-weight:600}
  html[lang="ur"] .td-rsn-btn,html[lang="ar"] .td-rsn-btn{font-size:18px}
  html[dir="rtl"] .td-rsn-btn{text-align:right}
  .td-rsn-btn .n{font-family:Montserrat,sans-serif;font-weight:800;font-size:15px;color:var(--text-dim);width:30px;height:30px;flex:0 0 30px;border-radius:50%;border:1px solid var(--line,rgba(255,255,255,.25));display:flex;align-items:center;justify-content:center}
  .td-rsn-btn:hover{border-color:rgba(255,255,255,.4)}
  .td-rsn-btn.on{border-color:var(--gold);background:rgba(201,162,39,.12)}
  .td-rsn-btn.on .n{background:var(--gold);color:#04160F;border-color:var(--gold)}
  .td-rsn-panel{background:var(--surface,rgba(255,255,255,.055));backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--surface-line,rgba(255,255,255,.12));border-radius:18px;padding:34px;min-height:220px;transition:opacity .25s ease,transform .25s ease}
  .td-rsn-panel.swap{opacity:0;transform:translateY(6px);transition:opacity .18s ease,transform .18s ease}
  .td-rsn-panel h3{margin:0 0 10px}
  .td-rsn-panel p{color:var(--text-dim);margin:0}
  @media (max-width:900px){
    .td-door-grid,.td-cohort-grid{grid-template-columns:1fr}
    .td-door{aspect-ratio:16/10}
    .td-door img.book-cover{object-position:center 78%}
    .td-rsn-grid{grid-template-columns:1fr}
    .td-workbook{padding:84px 0}
  }

"""

RTL_CSS = """
  [dir="rtl"] .pull{border-left:none;border-right:4px solid var(--sea)}
  [dir="rtl"] .boundary{border-left:none;border-right:4px solid var(--sea);padding:6px 18px 6px 0}
  [dir="rtl"] .proof{border-left:none;border-right:1px solid rgba(255,255,255,.12)}
  [dir="rtl"] .proof:first-child{border-right:none}
  [dir="rtl"] .about-photo::after{left:auto;right:-16px;border-left:none;border-right:3px solid var(--sea)}
  [dir="rtl"] .prog-row:hover{padding-left:6px;padding-right:16px}
  [dir="rtl"] .qopt{text-align:right}
  [dir="rtl"] .ascent{right:auto;left:0}
  [dir="rtl"] .toTop{right:auto;left:22px}
  [dir="rtl"] .step b i{margin-right:0;margin-left:10px}
  [dir="rtl"] .brand{margin-right:0;margin-left:auto}
"""

UR_CSS = """
  body{font-family:'Noto Nastaliq Urdu','Segoe UI',serif}
  p{line-height:2.05}
  h1,h2,h3{font-family:'Noto Nastaliq Urdu','Segoe UI',serif}
  h2{line-height:1.95}
  h3{line-height:1.9}
  .hook{text-transform:none;letter-spacing:0;font-weight:700;font-size:clamp(24px,3.9vw,46px);line-height:2.05}
  .eyebrow{letter-spacing:.02em;text-transform:none;font-size:13.5px}
  .hero-note,.hero-sub2{letter-spacing:.02em;text-transform:none}
  .btn{padding:17px 26px 13px}
  .proof b{font-family:'Segoe UI',system-ui,sans-serif}
  .proof span{line-height:1.95}
  .member .intro,.coach-row span,.init p{line-height:2}
  .qopt{line-height:1.95}
  .quiz-card h3{line-height:2}
  @media (max-width:820px){ .hook{font-size:clamp(23px,7.4vw,36px)} }
"""

AR_CSS = """
  body{font-family:'Traditional Arabic',Tahoma,'Segoe UI',serif}
  p{line-height:1.95}
  h2{line-height:1.55}
  h3{line-height:1.6}
  .hook{text-transform:none;letter-spacing:0;font-size:clamp(30px,4.8vw,64px);line-height:1.5}
  .eyebrow{letter-spacing:.02em;text-transform:none;font-size:14px}
  .hero-note,.hero-sub2{letter-spacing:.02em;text-transform:none}
  .proof span{line-height:1.85}
  .member .intro,.coach-row span,.init p{line-height:1.9}
  .qopt{line-height:1.85}
  @media (max-width:820px){ .hook{font-size:clamp(26px,8vw,40px)} }
"""

LDJSON = '{"@context":"https://schema.org","@type":"Person","name":"Imran Aslam","jobTitle":"Life Coach & Trainer","url":"https://imranaslam.pk/","worksFor":{"@type":"Organization","name":"AIDE — Accelerating Insights and Development for Excellence"},"address":{"@type":"PostalAddress","addressLocality":"Bhimber","addressRegion":"Azad Kashmir","addressCountry":"PK"}}'

def wa(msg): return "https://wa.me/923309222029?text=" + urllib.parse.quote(msg)

def build(L):
    SLUGS = ["imran-aslam", "irfan-aslam", "zill-e-huma-aslam", "halima-sadia", "ammara-zaidi"]
    P = L["prefix"]
    css = CSS.replace('url("hero-poster.webp")', 'url("'+P+'hero-poster.webp")') + ADD_CSS.replace('{{P}}', P)
    if L["dir"] == "rtl": css += RTL_CSS
    if L["lang"] == "ur": css += UR_CSS
    if L["lang"] == "ar": css += AR_CSS
    _CHEV = '<svg class="chev" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
    _ICONS = {
      "programme-pldp.html": '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
      "programme-habits.html": '<path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/>',
      "programme-sales.html": '<path d="M4 20V10M10 20V4M16 20v-8M21 20H3"/>',
      "programme-teach.html": '<path d="M12 6c-2-1.5-4.5-2-8-2v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2z"/><path d="M12 6v13"/>',
      "programme-homes.html": '<path d="M3 11l9-7 9 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
      "programme-rise.html": '<path d="M4 18a8 8 0 0 1 16 0"/><path d="M12 6v4M5.6 7.6l2.8 2.8M18.4 7.6l-2.8 2.8M3 18h18"/>',
    }
    _ORDER = ["programme-pldp.html","programme-habits.html","programme-sales.html","programme-teach.html","programme-homes.html","programme-rise.html"]
    _RES = {
      "en": [("Books","books.html"),("Assessment Centre","assessments.html"),("Practical Tools","resources.html#tools"),("Reading Lists","resources.html#reading")],
      "ur": [("کتابیں","books.html"),("اسیسمنٹ سینٹر","assessments.html"),("عملی اوزار","resources.html#tools"),("مطالعہ فہرستیں","resources.html#reading")],
      "ar": [("الكتب","books.html"),("مركز التقييم","assessments.html"),("أدوات عملية","resources.html#tools"),("قوائم القراءة","resources.html#reading")],
    }
    _ALL = {"en": "All programmes", "ur": "تمام پروگرامز", "ar": "كل البرامج"}
    _NAVCTA = {"en": "Free discovery call", "ur": "مفت ڈسکوری کال", "ar": "مكالمة استكشاف مجانية"}
    _progs_sorted = sorted(L["progs"], key=lambda r: _ORDER.index(r[2]))
    _mega_items = "".join(
      f'<a class="mega-item" href="{h}"><span class="mega-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{_ICONS[h]}</svg></span><span class="mega-tx"><b>{t}</b><span class="mega-meta">{f}</span></span></a>'
      for _n, t, h, _d, f in _progs_sorted)
    # Homepage prog rows keep English programme brand names on every locale
    # (same precedent as prog_entry's guide title below); the mega matches them.
    _pldp_item = f'<a class="mega-item" href="programme-pldp.html"><span class="mega-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{_ICONS["programme-pldp.html"]}</svg></span><span class="mega-tx"><b>Prophetic Leadership Development Program</b><span class="mega-meta">{L["pldp_fmt"]}</span></span></a>'
    _mega_items = _pldp_item + _mega_items
    _mega = f'<div class="drop mega"><div class="mega-card"><div class="mega-grid">{_mega_items}</div><div class="mega-foot"><a href="programmes.html">{_ALL[L["lang"]]} →</a></div></div></div>'
    _PV = {
      "en": ["Fifty-five books, one shelf.", "Know where you stand.", "Start where you are.", "Read deeper."],
      "ur": ["پچپن کتابیں، ایک ہی سلسلہ", "اپنی کیفیت جانیں", "جہاں ہیں، وہیں سے آغاز", "گہرائی سے پڑھیں"],
      "ar": ["خمسة وخمسون كتابًا، سلسلة واحدة", "اعرف أين تقف", "ابدأ من حيث أنت", "اقرأ بعمق"],
    }
    _PP = "" if L["lang"] == "en" else "../"
    _COVERS = "".join(f'<img decoding="async" src="{_PP}book-{c}.webp" alt="">' for c in ["shadi-se-pehle", "pehla-saal", "7-conversations"])
    _PV_ICO = ['<span class="pv-covers">' + _COVERS + '</span>',
      f'<img class="pv-img" decoding="async" src="{_PP}pv-assess.webp" alt="">',
      f'<img class="pv-img" decoding="async" src="{_PP}pv-tools.webp" alt="">',
      f'<img class="pv-img" decoding="async" src="{_PP}pv-reading.webp" alt="">']
    _res_links = "".join(f'<a href="{h}" data-pv="{i}">{t}</a>' for i, (t, h) in enumerate(_RES[L["lang"]]))
    _res_pvs = "".join(f'<a class="pv" data-pv="{i}" href="{h}">{_PV_ICO[i]}<b>{t}</b><span class="pv-line">{_PV[L["lang"]][i]}</span></a>' for i, (t, h) in enumerate(_RES[L["lang"]]))
    _resdrop = f'<div class="drop res-mega"><div class="res-card"><div class="res-links">{_res_links}</div><div class="res-pv">{_res_pvs}</div></div></div>'
    def _navlink(t, h):
      if h in ("#about", "#team", "#coaching", "#writing"):
        return f'<a class="sec-link" href="{h}">{t}</a>'
      if h == "#programmes":
        return f'<div class="has-drop"><a href="{h}">{t}{_CHEV}</a>{_mega}</div>'
      if h == "resources.html":
        return f'<div class="has-drop"><a href="{h}">{t}{_CHEV}</a>{_resdrop}</div>'
      return f'<a href="{h}">{t}</a>'
    nav = "".join(_navlink(t, h) for t, h in L["nav"])
    nav_cta = f'<a class="nav-cta" href="{wa(L["wa_book"])}" target="_blank" rel="noopener">{_NAVCTA[L["lang"]]}<span class="arr">→</span></a>'
    if L["lang"] == "en": langs = f'<span class="lang-links"><a href="index.html">EN</a> · <a href="ur/index.html">اردو</a> · <a href="ar/index.html">العربية</a></span>'
    elif L["lang"] == "ur": langs = '<span class="lang-links"><a href="../index.html">EN</a> · <a href="index.html">اردو</a> · <a href="../ar/index.html">العربية</a></span>'
    else: langs = '<span class="lang-links"><a href="../index.html">EN</a> · <a href="../ur/index.html">اردو</a> · <a href="index.html">العربية</a></span>'
    if L["lang"] == "en": langs_nav = '<div class="has-drop lang-wrap"><button class="lang-btn" type="button" aria-label="Change language">EN ▾</button><div class="drop lang-drop"><a href="index.html" aria-current="page">EN</a><a href="ur/index.html">اردو</a><a href="ar/index.html">العربية</a></div></div>'
    elif L["lang"] == "ur": langs_nav = '<div class="has-drop lang-wrap"><button class="lang-btn" type="button" aria-label="Change language">اردو ▾</button><div class="drop lang-drop"><a href="../index.html">EN</a><a href="index.html" aria-current="page">اردو</a><a href="../ar/index.html">العربية</a></div></div>'
    else: langs_nav = '<div class="has-drop lang-wrap"><button class="lang-btn" type="button" aria-label="Change language">العربية ▾</button><div class="drop lang-drop"><a href="../index.html">EN</a><a href="../ur/index.html">اردو</a><a href="index.html" aria-current="page">العربية</a></div></div>'
    hook = "\n".join(f'<span class="row{" alt" if i==2 else ""}">{line}</span>' for i, line in enumerate(L["hook"]))
    strip = "".join(f'<div class="proof rv"><b>{n} <em>{u}</em></b><span>{d}</span></div>' for n, u, d in L["strip"])
    steps = "".join(f'<div class="step rv"><b><i>{i+1}</i>{t}</b><p>{d}</p></div>' for i, (t, d) in enumerate(L["steps"]))
    about_p = "".join(f"<p>{p}</p>" for p in L["about_p"])
    uswa = "".join(f'<button type="button" class="up{" on" if k == 0 else ""}" data-u="{k}"><i>{i}</i><b>{b}</b><span>{s}</span></button>' for k, (i, b, s) in enumerate(L["uswa"]))
    _PTONE = {"02": "tone-sales", "03": "tone-habit", "04": "tone-homes", "05": "tone-teach", "06": "tone-rise"}
    rows = "".join(
        f'<a class="prog-row {_PTONE[n]}" href="{h}"><span class="no">{n}</span><span><h3>{t}</h3><p>{d}</p><span class="fmt">{f}</span></span><span class="arr">→</span></a>'
        for n, t, h, d, f in L["progs"])
    doors = "".join(
        f'<a class="td-door rv" href="{h}"><img loading="lazy" decoding="async" class="{"book-cover" if img == "book-pehla-saal.webp" else ""}" src="{P}{img}" alt="{t}"><span class="shade" aria-hidden="true"></span><span class="tile" aria-hidden="true">↗</span><span class="td-body"><span class="eyebrow">{k}</span><h3>{t}</h3><p>{d}</p></span></a>'
        for k, t, d, h, img in L["doors"])
    cl = L["cohort_labels"]
    cohorts = "".join(
        f'<article class="td-cohort rv"><p class="prog">{tag}</p><h3>{t}</h3><div class="fact"><span>{cl[0]}</span><b>{s}</b></div><div class="fact"><span>{cl[1]}</span><b>{m}</b></div><div class="fact"><span>{cl[2]}</span><b>{ln}</b></div><a class="btn btn-solid" href="{wa(msg)}" target="_blank" rel="noopener">{L["cohort_btn"]}</a></article>'
        for tag, t, s, m, ln, msg in L["cohorts"])
    rsn_btns = "".join(
        f'<button type="button" class="td-rsn-btn{" on" if k == 0 else ""}" data-r="{k}"><span class="n">{k+1}</span>{t}</button>'
        for k, (t, _x) in enumerate(L["reasons"]))
    rsn0 = L["reasons"][0]
    team = "".join(
        f'<article class="member rv"><img loading="lazy" decoding="async" src="{P}{img}" alt="{name}"><div class="bd"><h3>{name}</h3><span>{role}</span><p class="intro">{intro}</p><p class="book-line"><a href="{wa(L["coach"][k][2])}" target="_blank" rel="noopener">{L["book_with"]} {name}</a></p><p class="prof-line"><a class="card-link" href="team-{SLUGS[k]}.html">{L["team_profile"]} →</a></p></div></article>'
        for k, (img, name, role, intro) in enumerate(L["team"]))
    inits = "".join(
        f'<article class="init rv"><img loading="lazy" decoding="async" src="{P}{img}" alt="{who}"><div><h3>{t}</h3><span class="who">{who}</span><p>{body}</p><p style="margin-top:10px"><a href="{L["init_links"][i][0]}" target="_blank" rel="noopener" style="color:var(--sea);font-weight:700;text-decoration:none">{L["init_links"][i][1]} →</a></p></div></article>'
        for i, (img, t, who, body) in enumerate(L["inits"]))
    coachp = "".join(f"<p>{p}</p>" for p in L["coach_p"])
    coach = "".join(
        f'<div class="coach-row"><b>{n}</b><span>{f}</span><a href="{wa(m)}" target="_blank" rel="noopener">{L["book_with"]} {n}</a></div>'
        for n, f, m in L["coach"])
    books_items = "".join(f'<span class="bs-item"><img loading="lazy" decoding="async" src="{P}{img}" alt="{t}"><span lang="{lg}">{t}</span></span>' for img, t, lg in L["books_items"])
    guide_btns = "".join(f'<button type="button" class="gopt-btn" data-g="{k}">{t}</button>' for k, t in enumerate(L["guide_opts"]))
    foot_pages = " · ".join(f'<a href="{h}">{t}</a>' for t, h in L["foot_pages"])
    foot_legal = " · ".join(f'<a href="{h}">{t}</a>' for t, h in L["foot_legal"])
    quiz_js = "var QS = [" + ",".join(
        "{q:" + repr(q) + ",o:[" + ",".join(repr(o) for o in opts) + "]}" for q, opts in L["quiz"]) + "];"
    res_js = "var RES = [" + ",".join("[" + repr(t) + "," + repr(x) + "]" for t, x in L["quiz_res"]) + "];"
    guide_map = [[("pldp",), (3,), (0,)], [(3,), (1,)], [(2,), (1,)], [(4,), (1,)], [(2,), ("coach",)], [(0,), ("pldp",)]]
    def prog_entry(key):
        if key == "coach":
            t, f = L["guide_coach"]
            return (t, "#coaching", f)
        if key == "pldp":
            return ("Prophetic Leadership Development Program", "programme-pldp.html", L["pldp_fmt"])
        n, t, h, d, f = L["progs"][key]
        return (t, h, f)
    guide_js = "var GUIDE = [" + ",".join("[" + ",".join("[" + ",".join(repr(x) for x in prog_entry(k[0])) + "]" for k in grp) + "]" for grp in guide_map) + "];"
    uswa_js = "var USWA = [" + ",".join("[" + repr(b) + "," + repr(sp) + "," + repr(w) + "]" for (i, b, sp), w in zip(L["uswa"], L["uswa_weeks"])) + "];"
    reasons_js = "var REASONS = [" + ",".join("[" + repr(t) + "," + repr(x) + "]" for t, x in L["reasons"]) + "];"
    qnext_js = "var QNEXT = [" + ",".join("[" + repr(t) + "," + repr(h) + "]" for t, h in L["quiz_prog"]) + "];"
    coach_js = "var COACH = [" + ",".join("[" + repr(n) + "," + repr(f) + "," + repr(wa(m)) + "]" for n, f, m in L["coach"]) + "]; var BOOKWITH = " + repr(L["book_with"]) + "; var COACHFOR = " + repr(L["coach_for"]) + "; var GUIDEOPEN = " + repr(L["guide_tap"]) + ";"
    js_tpl = (GEN / 'home_js.js').read_text(encoding='utf-8')
    js = js_tpl.replace("%%DAY%%", repr(L['theme_day'])).replace("%%NIGHT%%", repr(L['theme_night'])).replace("%%QUIZ%%", quiz_js).replace("%%RES%%", res_js).replace("%%GUIDE%%", guide_js).replace("%%USWA%%", uswa_js).replace("%%QNEXT%%", qnext_js).replace("%%COACH%%", coach_js).replace("%%REASONS%%", reasons_js)
    _canon = "https://imranaslam.pk/" + ("" if L["lang"] == "en" else L["lang"] + "/")
    fontlink = FONT_LINKS[L["lang"]]
    return f"""<!DOCTYPE html>
<html lang="{L['lang']}" dir="{L['dir']}" data-theme="night">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{L['title']}</title>
<meta name="description" content="{L['desc']}">
<link rel="icon" type="image/png" href="{P}aide-logo.png">
<link rel="canonical" href="{_canon}">
<link rel="alternate" hreflang="en" href="https://imranaslam.pk/">
<link rel="alternate" hreflang="ur" href="https://imranaslam.pk/ur/">
<link rel="alternate" hreflang="ar" href="https://imranaslam.pk/ar/">
<link rel="alternate" hreflang="x-default" href="https://imranaslam.pk/">
<meta property="og:type" content="website">
<meta property="og:title" content="{L['title']}">
<meta property="og:description" content="{L['desc']}">
<meta property="og:url" content="{_canon}">
<meta property="og:image" content="https://imranaslam.pk/og-cover.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://imranaslam.pk/og-cover.jpg">
<script type="application/ld+json">
{LDJSON}
</script>
{fontlink}
<style>{css}</style>
</head>
<body>
<noscript><style>body{{opacity:1}}</style></noscript>

<div class="td-bar"><a href="assessments.html">{L['bar']} <span class="arr">→</span></a></div>

<nav>
  <div class="wrap nav-in">
    <a class="brand" href="#top">
      <span class="bezel"><img src="{P}aide-logo-dome.png" alt="AIDE logo"></span>
      <span><b>Imran Aslam</b><span>{L['brand_sub']}</span></span>
    </a>
    <div class="nav-links">
      {nav}
      {langs_nav}
      <button class="toggle" id="themeToggle" type="button" aria-label="Theme">
        <span class="dot"></span><span id="themeLabel">{L['theme_night']}</span>
      </button>
      {nav_cta}
    </div>
  </div>
</nav>

<header class="hero" id="top">
  <div class="stage" id="heroStage">
    <div class="vwrap">
      <video id="heroVideo" loop muted playsinline autoplay preload="auto" poster="{P}hero-poster.webp" aria-hidden="true">
        <source src="{P}hero-film.mp4" type="video/mp4">
      </video>
    </div>
    <div class="veil" aria-hidden="true"></div>
    <span class="vstate" id="vState" aria-hidden="true">❚❚</span>
    <div class="glow" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>
    <div class="hero-in">
      <div class="wrap">
        <div class="emblem" aria-hidden="true"><img src="{P}aide-logo-dome.png" alt=""></div>
        <p class="hero-brand" dir="ltr"><b>AIDE</b><span class="hb-dot" aria-hidden="true"></span><span class="hb-tag">From Awareness to Excellence</span></p>
        <span class="eyebrow">{L['eyebrow']}</span>
        <h1 class="blend hook" id="hook">{hook}</h1>
        <div class="hero-cta">
          <a class="btn btn-solid magnetic" href="{wa(L['wa_book'])}" target="_blank" rel="noopener">{L['btn_book']}</a>
          <a class="btn btn-line" href="#programmes">{L['btn_prog']}</a>
        </div>
        <p class="hero-sub2">{L['hero_line']}</p>
      </div>
    </div>
  </div>
</header>
<span class="cut" aria-hidden="true"></span>
<div class="hero-lead"><div class="wrap"><p>{L['support']}</p></div></div>

<div class="proven" aria-label="The verified record">
  <div class="wrap">{strip}</div>
</div>

<div class="wrap"><div class="steps3">{steps}</div></div>

<section class="td-doors" id="doors">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['doors_eyebrow']}</span>
      <h2>{L['doors_h2']}</h2>
      <p>{L['doors_sub']}</p>
    </div>
    <div class="td-door-grid">{doors}</div>
  </div>
</section>

<section class="guide" id="guide">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['guide_eyebrow']}</span>
      <h2>{L['guide_h2']}</h2>
      <p>{L['guide_q']}</p>
    </div>
    <div class="guide-grid" id="guideGrid">{guide_btns}</div>
    <div id="guidePanels"></div>
    <p class="rv" style="margin-top:18px;color:var(--text-dim)">{L['guide_hint']}</p>
  </div>
</section>

<section id="about">
  <div class="wrap about-grid">
    <div class="about-photo rv"><img src="{P}imran-warm.webp" alt="Imran Aslam"></div>
    <div class="about-copy rv">
      <span class="eyebrow">{L['about_eyebrow']}</span>
      <h2 style="margin:14px 0 22px">{L['about_h2']}</h2>
      {about_p}
      <div class="pull">{L['pull']}</div>
    </div>
  </div>
</section>

<span class="cut flip" aria-hidden="true" style="background:var(--bg-soft)"></span>

<section id="programmes" style="background:var(--bg-soft);padding-top:64px">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['prog_eyebrow']}</span>
      <h2>{L['prog_h2']}</h2>
      <p>{L['prog_intro']}</p>
    </div>
    <div class="prog-feature tone-pldp rv">
      <div class="txt">
        <span class="eyebrow" style="color:var(--sea-hi)">Flagship · USWA</span>
        <h3>Prophetic Leadership Development Program</h3>
        <p>{L['pldp_p']}</p>
        <p class="fmt">{L['pldp_fmt']}</p>
        <a class="ask" href="programme-pldp.html">{L['pldp_page']} →</a>
        <a class="ask" style="margin-inline-start:22px" href="{wa('Assalam-o-Alaikum! I want details about the Prophetic Leadership Development Program (PLDP).')}" target="_blank" rel="noopener">{L['pldp_ask']} →</a>
      </div>
      <div class="uswa">{uswa}</div>
    </div>
    <div class="uswa-detail rv" id="uswaDetail" aria-live="polite"></div>
    <div class="prog-rows rv">{rows}</div>
  </div>
</section>

<section class="td-cohorts" id="cohorts">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['cohort_eyebrow']}</span>
      <h2>{L['cohort_h2']}</h2>
      <p>{L['cohort_sub']}</p>
    </div>
    <div class="td-cohort-grid">{cohorts}</div>
  </div>
</section>

<section id="team">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['team_eyebrow']}</span>
      <h2>{L['team_h2']}</h2>
      <p>{L['team_intro']}</p>
    </div>
    <div class="team-grid">{team}</div>
    <div class="sec-head init-head rv">
      <span class="eyebrow">{L['init_eyebrow']}</span>
      <h2>{L['init_h2']}</h2>
      <p>{L['init_intro']}</p>
    </div>
    <div class="init-grid">{inits}</div>
  </div>
</section>

<section id="coaching">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['coach_eyebrow']}</span>
      <h2>{L['coach_h2']}</h2>
    </div>
    <div class="assess-grid">
      <div class="rv">
        <div style="font-size:17.5px">{coachp}</div>
        <p class="boundary">{L['boundary']}</p>
        <p style="margin-top:20px;font-size:16.5px">{L['coach_close']}</p>
        <p style="margin-top:20px"><a class="btn btn-solid magnetic" href="{wa(L['wa_book'])}" target="_blank" rel="noopener">{L['coach_btn']}</a></p>
      </div>
      <div class="book-panel rv">
        <label class="bp-label" for="coachPick">{L['coach_pick']}</label>
        <select id="coachPick" class="bp-select"></select>
        <p class="bp-field" id="coachField"></p>
        <p class="bp-for" id="coachFor"></p>
        <p><a class="btn btn-solid" id="coachBook" href="#" target="_blank" rel="noopener"></a></p>
        <p class="bp-note">{L['bp_note']}</p>
      </div>
    </div>
  </div>
</section>

<span class="cut" aria-hidden="true" style="background:var(--bg-soft)"></span>

<section class="td-workbook">
  <img class="bg" loading="lazy" decoding="async" src="{P}gen-men-workshop.webp" alt="">
  <span class="scrim" aria-hidden="true"></span>
  <div class="inner">
    <p class="eyebrow" style="color:#E3C878">{L['wb_eyebrow']}</p>
    <h2>{L['wb_h2']}</h2>
    <p class="ur td-wb-ur" lang="ur">{L['wb_ur']}</p>
    <p>{L['wb_p']}</p>
    <a class="btn btn-solid magnetic" href="assessments.html">{L['wb_btn']} <span class="arr">→</span></a>
  </div>
</section>

<section id="start" style="background:var(--bg-soft);padding-top:64px">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['quiz_eyebrow']}</span>
      <h2>{L['quiz_h2']}</h2>
      <p>{L['quiz_intro']}</p>
    </div>
    <div class="assess-grid">
      <div class="assess-photo rv"><img loading="lazy" decoding="async" src="{P}imran-dialogue.webp" alt="Imran Aslam in conversation"></div>
      <div class="quiz-card rv">
        <div class="qprog"><i id="qBar"></i></div>
        <div id="qBody">
          <h3 id="qText"></h3>
          <div id="qOpts"></div>
          <button class="qback" id="qBack" type="button" style="display:none">← {L['quiz_back']}</button>
        </div>
        <div class="qres" id="qRes">
          <div class="big" id="qResTitle"></div>
          <p id="qResText" class="dim"></p>
          <p class="qnext">{L['quiz_next']} <a id="qNextLink" href="programme-habits.html"></a></p>
          <p class="qnote">{L['quiz_note']}</p>
          <p style="margin-top:20px"><a class="btn btn-solid magnetic" href="{wa(L['wa_quiz'])}" target="_blank" rel="noopener">{L['quiz_btn']}</a></p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="writing">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['write_eyebrow']} · <span lang="ur">مانی رائٹس</span></span>
      <h2>{L['write_h2']}</h2>
    </div>
    <div class="assess-grid">
      <div class="assess-photo rv"><img loading="lazy" decoding="async" src="{P}imran-writing.webp" alt="Imran Aslam writing"></div>
      <div class="rv">
        <p style="font-size:17.5px;line-height:1.85">{L['write_p']}</p>
        <p style="margin-top:22px"><a class="btn btn-solid magnetic" href="https://phirphur.blogspot.com/" target="_blank" rel="noopener">{L['write_btn']}</a></p>
        <p class="ext-note">{L['write_ext']}</p>
      </div>
    </div>
  </div>
</section>

<section id="books">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['books_eyebrow']}</span>
      <h2>{L['books_h2']}</h2>
      <p>{L['books_line']}</p>
    </div>
    <a class="books-strip rv" href="books.html">{books_items}<span class="bs-go">{L['books_go']} →</span></a>
  </div>
</section>

<section class="td-reasons" id="reasons">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="eyebrow">{L['rsn_eyebrow']}</span>
      <h2>{L['rsn_h2']}</h2>
      <p>{L['rsn_sub']}</p>
    </div>
    <div class="td-rsn-grid">
      <div class="td-rsn-btns" role="tablist" aria-label="{L['rsn_h2']}">{rsn_btns}</div>
      <div class="td-rsn-panel" id="tdRsnPanel" role="tabpanel">
        <h3 id="tdRsnTitle">{rsn0[0]}</h3>
        <p id="tdRsnText">{rsn0[1]}</p>
      </div>
    </div>
  </div>
</section>

<div class="cta-block">
  <div class="wrap">
    <div>
      <div class="emblem cta-emblem" aria-hidden="true"><img src="{P}aide-logo-dome.png" alt=""></div>
      <h2>{L['cta_h2']}</h2>
      <p>{L['cta_p']}</p>
    </div>
    <a class="btn magnetic" href="{wa(L['wa_book'])}" target="_blank" rel="noopener">{L['cta_btn']}</a>
    <a class="btn dark" href="#programmes">{L['cta_btn2']}</a>
  </div>
</div>

<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <p class="line">{L['foot_line']}</p>
        <p style="margin-top:10px;max-width:46ch">{L['foot_about']}</p>
      </div>
      <div>
        <p class="foot-pages">{foot_pages}</p>
        <p style="margin-top:10px">{L['foot_place']}</p>
        <p style="margin-top:10px">WhatsApp <a href="{wa(L['wa_book'])}" target="_blank" rel="noopener">+92 330 9222029</a> · Calls +92 317 9222029<br>Email <a href="mailto:blugul1@gmail.com">blugul1@gmail.com</a></p>
        <p style="margin-top:10px">{langs}</p>
      </div>
    </div>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line);font-size:13px">{foot_legal}</div>
    <div class="foot-small">
      <span>© 2026 AIDE — Imran Aslam</span>
      <span>From Awareness to Excellence</span>
    </div>
  </div>
</footer>

<a class="sticky-book" href="{wa(L['wa_book'])}" target="_blank" rel="noopener">{L['sticky']}</a>
<div class="ascent" aria-hidden="true"><i id="ascentFill"></i></div>
<button class="toTop" id="toTop" type="button" aria-label="Back to the top">↑</button>

{L['popup']}
<script>
{js}
</script>
</body>
</html>
"""

for L, out in [(EN, SITE / "index.html"), (UR, SITE / "ur" / "index.html"), (AR, SITE / "ar" / "index.html")]:
    html = build(L)
    out.write_text(html, encoding="utf-8")
    print(out, len(html))
print("HOMES BUILT")
