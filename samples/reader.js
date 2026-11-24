/* AIDE opening-pages flip reader.
   Client-side pagination: measures the real rendered text and splits it into
   flip pages at runtime, so pages fit at any screen size. Re-paginates on
   resize (debounced) and restores the reader's position by source node index.
   Desktop: persistent 2-page spread. Mobile (<=680px): transient-leaf 1 page.
   RTL (Urdu): spine RIGHT, forward = click LEFT half / ArrowLeft, flip =
   POSITIVE rotateY 0 to +180, origin right center. Never negative rotateY.
   LTR (English): mirrored, NEGATIVE rotateY, origin left center.
   Layout height is font-independent (fixed line-height), so pagination does
   not need to wait for webfonts. */
(function () {
  'use strict';

  var DATA = JSON.parse(document.getElementById('rd-data').textContent);
  var RTL = document.documentElement.dir === 'rtl';
  var book = document.getElementById('book');
  var dotsEl = document.getElementById('dots');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var countEl = document.getElementById('count');
  var src = document.getElementById('src');

  var T = RTL ? {
    page: 'صفحہ', pages: 'صفحات', of: 'از', to: 'تا',
    sampleEnd: 'ابتدائی صفحات ختم',
    endNote: 'آپ نے اس کتاب کے ابتدائی صفحات پڑھ لیے: تمہید اور پہلے تین ابواب۔',
    fullHas: 'مکمل کتاب میں {n} ابواب ہیں۔',
    get: 'کتاب حاصل کریں',
    freeSample: 'ابتدائی صفحات',
    chaptersWord: 'ابواب',
    allBooks: 'تمام کتابیں'
  } : {
    page: 'Page', pages: 'Pages', of: 'of', to: 'to',
    sampleEnd: 'End of opening pages',
    endNote: 'You have read the opening pages of this book: the introduction and the first three chapters.',
    fullHas: 'The full book has {n} chapters.',
    get: 'Get this book',
    freeSample: 'Opening pages',
    chaptersWord: 'chapters',
    allBooks: 'All books'
  };

  /* ---------- source nodes ---------- */
  var nodes = []; // {el, kind, html, text}
  Array.prototype.forEach.call(src.children, function (el) {
    var kind = el.tagName.toLowerCase();
    nodes.push({
      el: el,
      kind: kind,
      html: el.outerHTML,
      text: el.textContent,
      isChapter: kind === 'h3' && el.classList.contains('chapter'),
      isHeading: kind === 'h3' || kind === 'h4'
    });
  });

  /* ---------- cover + end pages ---------- */
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmtNum(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function coverHtml() {
    var items = DATA.chapters.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    var digital = RTL
      ? 'ڈیجیٹل بکس دستیاب ہیں۔ فی الوقت پرنٹنگ ایڈیشن دستیاب نہیں ہے۔'
      : 'Digital books available. The print edition is not available at the moment.';
    return '<div class="flip-page cover">'
      + '<img class="cover-img" src="' + DATA.cover + '" alt="">'
      + '<div class="cover-kicker">AIDE</div>'
      + '<h2>' + esc(DATA.title) + '</h2>'
      + '<div class="cover-author">' + esc(DATA.author) + '</div>'
      + '<div class="cover-badge">' + T.freeSample + '</div>'
      + '<ul class="cover-contents">' + items + '</ul>'
      + '<div class="cover-digital">' + digital + '</div>'
      + '</div>';
  }
  function endHtml() {
    return '<div class="flip-page endpage">'
      + '<h3>' + T.sampleEnd + '</h3>'
      + '<p>' + T.endNote + '</p>'
      + '<p>' + T.fullHas.replace('{n}', DATA.totalChapters) + '</p>'
      + '<p><a class="rd-get" href="' + DATA.wa + '" target="_blank" rel="noopener">' + T.get + '</a></p>'
      + '<p class="rd-price">' + DATA.priceLine + '</p>'
      + '<p class="rd-back"><a href="' + DATA.booksUrl + '">' + T.allBooks + '</a></p>'
      + '</div>';
  }

  /* ---------- probe + pagination ---------- */
  var probe = document.createElement('div');
  probe.className = 'flip-page';
  probe.style.cssText = 'position:absolute;visibility:hidden;top:0;left:0;overflow:hidden;';
  document.body.appendChild(probe);

  var pageW = 0, pageH = 0;
  var pages = []; // {html, start} start = first source node index on the page

  function measureBook() {
    var w = book.clientWidth, h = book.clientHeight;
    pageW = isSingle() ? w : Math.floor(w / 2);
    pageH = h;
  }

  function fits(html) {
    probe.innerHTML = curHtml.join('') + html;
    return probe.scrollHeight <= probe.clientHeight + 1;
  }

  var curHtml = [];
  var curNodes = [];

  function splitParagraph(pEl) {
    /* Split a <p> into [prefixHtml, remainderHtml] by words, preserving
       inline <strong>/<em> wrappers. Returns null if it cannot split. */
    var atoms = []; // {tag, text} one entry per word; {tag:'atom', html, w}
    var wCount = 0;
    Array.prototype.forEach.call(pEl.childNodes, function (ch) {
      if (ch.nodeType === 3) {
        ch.textContent.split(/\s+/).filter(Boolean).forEach(function (w) {
          atoms.push({ tag: null, text: w, w: wCount++ });
        });
      } else if (ch.nodeType === 1) {
        var tag = ch.tagName.toLowerCase();
        if (tag === 'strong' || tag === 'em') {
          ch.textContent.split(/\s+/).filter(Boolean).forEach(function (w) {
            atoms.push({ tag: tag, text: w, w: wCount++ });
          });
        } else {
          atoms.push({ tag: 'atom', html: ch.outerHTML, w: wCount });
        }
      }
    });
    // attach each non-text atom to the following word (or the last word)
    atoms.forEach(function (a) {
      if (a.tag === 'atom' && a.w >= wCount) { a.w = Math.max(0, wCount - 1); }
    });
    if (wCount < 2) return null;
    function buildHtml(fromW, toW) { // words [fromW, toW)
      var out = '', open = null;
      function close() { if (open) { out += '</' + open + '>'; open = null; } }
      atoms.forEach(function (a) {
        if (a.w < fromW || a.w >= toW) return;
        if (a.tag === 'atom') { close(); out += a.html + ' '; return; }
        if (a.tag !== open) { close(); if (a.tag) { out += '<' + a.tag + '>'; open = a.tag; } }
        out += esc(a.text) + ' ';
      });
      close();
      var cls = fromW > 0 ? ' class="cont"' : '';
      return '<p' + cls + '>' + out.trim() + '</p>';
    }
    // binary search: largest word count that fits
    var lo = 1, hi = wCount, best = 0;
    while (lo <= hi) {
      var mid = Math.floor((lo + hi) / 2);
      if (fits(buildHtml(0, mid))) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    if (best <= 0) return null;
    if (best >= wCount) return null;
    return [buildHtml(0, best), buildHtml(best, wCount)];
  }

  function splitStorybox(nd) {
    /* A story box taller than one page used to sit whole on a page and get
       cut off by overflow:hidden. Split it across pages by its inner
       paragraphs, keeping the box (title on the first chunk only). A single
       over-long paragraph inside is split by words, like any <p>. */
    var titleEl = nd.el.querySelector('.storytitle');
    var titleHtml = titleEl ? titleEl.outerHTML : '';
    var paras = Array.prototype.slice.call(nd.el.querySelectorAll('p'));
    var first = true;
    var chunk = [];
    function wrap(list, isFirst) {
      return '<div class="storybox' + (isFirst ? '' : ' cont') + '">'
        + (isFirst ? titleHtml : '') + list.join('') + '</div>';
    }
    function flushChunk() {
      if (!chunk.length) return;
      curHtml.push(wrap(chunk, first)); curNodes.push(nd);
      first = false; chunk = [];
    }
    paras.forEach(function (pEl) {
      var rest = pEl;
      while (rest) {
        if (fits(wrap(chunk.concat([rest.outerHTML]), first))) {
          chunk.push(rest.outerHTML); rest = null; break;
        }
        if (chunk.length > 0) { flushChunk(); pushPage(); continue; }
        // chunk empty: the paragraph fits an empty page but not this one
        // (the page already has content) - move to a fresh page first
        if (curHtml.length > 0) { pushPage(); continue; }
        var parts = splitParagraph(rest);
        if (!parts) { chunk.push(rest.outerHTML); rest = null; break; }
        chunk.push(parts[0]);
        flushChunk(); pushPage();
        var tmp = document.createElement('div');
        tmp.innerHTML = parts[1];
        rest = tmp.firstChild;
      }
    });
    flushChunk();
  }

  function pushPage() {
    // orphan-heading rule: a heading alone at the bottom moves to next page
    var carry = [];
    while (curNodes.length > 1 && curNodes[curNodes.length - 1].isHeading) {
      carry.unshift({ html: curHtml.pop(), node: curNodes.pop() });
    }
    var start = curNodes.length ? curNodes[0].idx : 0;
    pages.push({ html: curHtml.join(''), start: start });
    curHtml = [];
    curNodes = [];
    carry.forEach(function (c) { curHtml.push(c.html); curNodes.push(c.node); });
    return carry.length ? carry[0].node.idx : null;
  }

  function paginate() {
    measureBook();
    // the flip face carries a 1px border, so a desktop page is 1px narrower than pageW; single mode has no border
    probe.style.width = (isSingle() ? pageW : pageW - 1) + 'px';
    probe.style.height = pageH + 'px';
    pages = [];
    curHtml = [];
    curNodes = [];
    nodes.forEach(function (nd, idx) {
      nd.idx = idx;
      // a chapter head always starts a fresh page
      if (nd.isChapter && curHtml.length > 0) { pushPage(); }
      if (nd.kind === 'p') {
        if (fits(nd.html)) { curHtml.push(nd.html); curNodes.push(nd); return; }
        // split the paragraph across pages
        var rest = nd.el;
        while (rest) {
          if (fits(rest.outerHTML)) { curHtml.push(rest.outerHTML); curNodes.push(nd); rest = null; break; }
          var parts = splitParagraph(rest);
          if (!parts) { // cannot split: whole paragraph on its own page (may overflow slightly)
            if (curHtml.length > 0) { pushPage(); }
            curHtml.push(rest.outerHTML); curNodes.push(nd); rest = null; break;
          }
          curHtml.push(parts[0]); curNodes.push(nd);
          pushPage();
          var tmp = document.createElement('div');
          tmp.innerHTML = parts[1];
          rest = tmp.firstChild;
        }
        return;
      }
      // atomic element (heading, list, table, storybox, rule)
      if (nd.el.classList && nd.el.classList.contains('storybox')) { splitStorybox(nd); return; }
      if (fits(nd.html)) { curHtml.push(nd.html); curNodes.push(nd); }
      else {
        if (curHtml.length > 0) { pushPage(); }
        curHtml.push(nd.html); curNodes.push(nd); // alone on a page, may overflow slightly
      }
    });
    if (curHtml.length > 0) { pushPage(); }
    // assemble: cover, content pages, end page
    var all = [{ html: coverHtml(), start: 0 }];
    pages.forEach(function (p) { all.push({ html: p.html, start: p.start }); });
    all.push({ html: endHtml(), start: nodes.length });
    pages = all;
  }

  /* ---------- render ---------- */
  var leaves = [];
  var spread = 0;      // desktop: current spread index
  var page = 0;        // single: current page index
  var flipping = false;
  var singlePageEl = null;

  function isSingle() {
    return window.matchMedia('(max-width: 680px)').matches;
  }
  function totalPages() { return pages.length; }
  function totalSpreads() { return Math.ceil(pages.length / 2); }
  function blankHtml() { return '<div class="flip-page blank"></div>'; }

  function setLeafZ(leaf, z) { leaf.style.zIndex = String(z); }

  function buildDesktop() {
    book.classList.remove('single');
    book.innerHTML = '';
    var L = totalSpreads();
    var base = document.createElement('div');
    base.className = 'base';
    base.innerHTML = '<div class="face"><div class="flip-page">' + pages[0].html + '</div></div>';
    book.appendChild(base);
    leaves = [];
    for (var i = 0; i < L; i++) {
      var leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.dataset.i = String(i);
      var front = pages[2 * i + 1], back = pages[2 * i + 2];
      leaf.innerHTML =
        '<div class="face front"><div class="flip-page">' + (front ? front.html : '') + '</div></div>' +
        '<div class="face back"><div class="flip-page">' + (back ? back.html : '') + '</div></div>';
      if (!front) { leaf.querySelector('.front .flip-page').classList.add('blank'); }
      if (!back) { leaf.querySelector('.back .flip-page').classList.add('blank'); }
      book.appendChild(leaf);
      leaves.push(leaf);
    }
    applySpread(spread, true);
  }

  function applySpread(s, instant) {
    spread = Math.max(0, Math.min(totalSpreads() - 1, s));
    var L = leaves.length;
    if (instant) { book.classList.add('noanim'); }
    leaves.forEach(function (leaf, i) {
      var flipped = i < spread;
      leaf.classList.toggle('flipped', flipped);
      setLeafZ(leaf, flipped ? i + 1 : L - i);
    });
    if (instant) {
      void book.offsetWidth; // force reflow so the no-animation state sticks
      book.classList.remove('noanim');
    }
    updateControls();
  }

  function buildSingle() {
    book.classList.add('single');
    book.innerHTML = '';
    singlePageEl = document.createElement('div');
    singlePageEl.className = 'single-page';
    singlePageEl.innerHTML = '<div class="flip-page">' + pages[page].html + '</div>';
    book.appendChild(singlePageEl);
    leaves = [];
    updateControls();
  }

  /* ---------- flips ---------- */
  function finishFlip(fn) {
    var done = false;
    function doneOnce() { if (!done) { done = true; fn(); } }
    setTimeout(doneOnce, 1000);
  }

  function next() {
    if (flipping) return;
    if (isSingle()) {
      if (page >= totalPages() - 1) return;
      flipping = true;
      var leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.style.zIndex = '10';
      leaf.innerHTML =
        '<div class="face front"><div class="flip-page">' + pages[page].html + '</div></div>' +
        '<div class="face back"><div class="flip-page">' + pages[page + 1].html + '</div></div>';
      book.appendChild(leaf);
      void leaf.offsetWidth;
      leaf.classList.add('flipped');
      finishFlip(function () {
        page++;
        singlePageEl.innerHTML = '<div class="flip-page">' + pages[page].html + '</div>';
        leaf.remove();
        flipping = false;
        updateControls();
      });
    } else {
      if (spread >= totalSpreads() - 1) return;
      flipping = true;
      var lf = leaves[spread];
      setLeafZ(lf, totalSpreads() + 10);
      lf.classList.add('flipped');
      finishFlip(function () {
        spread++;
        setLeafZ(lf, spread);
        flipping = false;
        updateControls();
      });
    }
  }

  function prev() {
    if (flipping) return;
    if (isSingle()) {
      if (page <= 0) return;
      flipping = true;
      var leaf = document.createElement('div');
      leaf.className = 'leaf flipped'; // start rotated, showing back (current page)
      leaf.style.zIndex = '10';
      leaf.innerHTML =
        '<div class="face front"><div class="flip-page">' + pages[page - 1].html + '</div></div>' +
        '<div class="face back"><div class="flip-page">' + pages[page].html + '</div></div>';
      book.appendChild(leaf);
      void leaf.offsetWidth; // paint the rotated start state first
      leaf.classList.remove('flipped'); // animate back to 0 (previous page)
      finishFlip(function () {
        page--;
        singlePageEl.innerHTML = '<div class="flip-page">' + pages[page].html + '</div>';
        leaf.remove();
        flipping = false;
        updateControls();
      });
    } else {
      if (spread <= 0) return;
      flipping = true;
      spread--;
      var lf = leaves[spread];
      setLeafZ(lf, totalSpreads() + 10);
      lf.classList.remove('flipped');
      finishFlip(function () {
        setLeafZ(lf, totalSpreads() - spread);
        flipping = false;
        updateControls();
      });
    }
  }

  function goToSpread(s) {
    if (isSingle()) {
      page = Math.max(0, Math.min(totalPages() - 1, s * 2));
      singlePageEl.innerHTML = '<div class="flip-page">' + pages[page].html + '</div>';
    } else {
      applySpread(s, true);
    }
    updateControls();
  }

  /* ---------- controls ---------- */
  function updateControls() {
    var P = totalPages();
    // dots: one per desktop spread, sliding window of at most 12
    var nDots = totalSpreads();
    var active = isSingle() ? Math.floor(page / 2) : spread;
    var MAX_DOTS = 12, start = 0;
    if (nDots > MAX_DOTS) {
      start = Math.max(0, Math.min(nDots - MAX_DOTS, active - Math.floor(MAX_DOTS / 2)));
    }
    dotsEl.innerHTML = '';
    for (var i = start; i < Math.min(nDots, start + MAX_DOTS); i++) {
      (function (k) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'rd-dot' + (k === active ? ' on' : '');
        d.setAttribute('aria-label', (k + 1));
        d.addEventListener('click', function () { goToSpread(k); });
        dotsEl.appendChild(d);
      })(i);
    }
    if (isSingle()) {
      countEl.textContent = T.page + ' ' + (page + 1) + ' ' + T.of + ' ' + P;
      prevBtn.disabled = page <= 0;
      nextBtn.disabled = page >= P - 1;
    } else {
      var first = spread * 2 + 1, last = Math.min(spread * 2 + 2, P);
      countEl.textContent = first === last
        ? T.page + ' ' + first + ' ' + T.of + ' ' + P
        : T.pages + ' ' + first + ' ' + T.to + ' ' + last + ' ' + T.of + ' ' + P;
      prevBtn.disabled = spread <= 0;
      nextBtn.disabled = spread >= nDots - 1;
    }
  }

  /* ---------- events ---------- */
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { RTL ? next() : prev(); }
    else if (e.key === 'ArrowRight') { RTL ? prev() : next(); }
  });

  book.addEventListener('click', function (e) {
    if (e.target.closest('a,button')) return;
    var r = book.getBoundingClientRect();
    var left = (e.clientX - r.left) < r.width / 2;
    if (RTL) { left ? next() : prev(); } else { left ? prev() : next(); }
  });

  var tx = null, ty = null;
  book.addEventListener('touchstart', function (e) {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  book.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    tx = null; ty = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (RTL) { dx < 0 ? next() : prev(); } else { dx > 0 ? next() : prev(); }
  }, { passive: true });

  /* ---------- resize: re-paginate, restore position ---------- */
  var resizeTimer = null;
  var lastW = 0, lastH = 0, lastSingle = null;
  function anchorNode() {
    if (isSingle()) { return pages[page] ? pages[page].start : 0; }
    var p = pages[spread * 2];
    return p ? p.start : 0;
  }
  function restoreTo(anchor) {
    var idx = 0;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].start <= anchor) { idx = i; } else { break; }
    }
    if (anchor >= nodes.length) { idx = pages.length - 1; }
    if (isSingle()) {
      page = idx;
      buildSingle();
    } else {
      spread = Math.floor(idx / 2);
      buildDesktop();
    }
  }
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var w = book.clientWidth, h = book.clientHeight, s = isSingle();
      if (s === lastSingle && Math.abs(w - lastW) < 24 && Math.abs(h - lastH) < 24) return;
      var anchor = anchorNode();
      lastW = w; lastH = h; lastSingle = s;
      paginate();
      restoreTo(anchor);
    }, 300);
  });

  /* ---------- init ---------- */
  paginate();
  lastW = book.clientWidth; lastH = book.clientHeight; lastSingle = isSingle();
  if (isSingle()) { buildSingle(); } else { buildDesktop(); }

  // debug/probe hook
  window.__reader = {
    next: next, prev: prev, goToSpread: goToSpread,
    state: function () {
      return {
        single: isSingle(), page: page, spread: spread,
        pages: totalPages(), spreads: totalSpreads(),
        pageW: pageW, pageH: pageH, nodes: nodes.length
      };
    }
  };
})();
