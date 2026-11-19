/* AIDE booking popup — vanilla JS, no dependencies.
 * Opens from the coaching page "Book with" button. Talks to the booking API
 * (window.AIDE_BOOKING_API, default the PythonAnywhere app). Falls back to
 * the button's WhatsApp link when the API is unreachable. */
(function () {
  'use strict';
  var API = window.AIDE_BOOKING_API || 'https://blugul1.pythonanywhere.com/booking';
  var LOCALE = (document.documentElement.lang || 'en').slice(0, 2);
  if (LOCALE !== 'ur' && LOCALE !== 'ar') LOCALE = 'en';

  var STR = {
    en: {
      title: 'Book a session', subtitle: 'Pick a service, a day and a time.',
      free_call: 'Free discovery call', free_call_sub: '15 minutes · free',
      session_45: 'Coaching session', session_45_sub: '45 minutes',
      session_90: 'Coaching session', session_90_sub: '90 minutes',
      package_90x4: '4-session package', package_90x4_sub: 'Four 90-minute sessions',
      price: 'Rs {p}', opening: 'Opening offer until 31 Dec 2026',
      pickDay: 'Choose a day', pickTime: 'Choose a time (PKT)',
      noSlots: 'No open times this day — try another day.',
      details: 'Your details', name: 'Your name', wa: 'WhatsApp number',
      langLabel: 'Session language', topic: 'What would you like to work on? (optional)',
      mode: 'How', online: 'Online', bhimber: 'In person, Bhimber',
      bookBtn: 'Request booking', back: 'Back', close: 'Close',
      pending: 'Request sent', ref: 'Booking ref',
      pendingNote: 'Your time is held while {coach} confirms. Send the WhatsApp message so they see it right away — confirmation follows there.',
      sendWa: 'Send on WhatsApp',
      loadFail: 'Could not reach the booking calendar. Please try again, or book on WhatsApp.',
      slotTaken: 'That time was just taken — please pick another.',
      holdExpired: 'Your hold expired — please pick the time again.',
      generic: 'Something went wrong. Please try again.',
      heldFor: 'Held for {m}:{s}',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      coaches: { imran: 'Imran Aslam', irfan: 'Irfan Aslam', huma: 'Zill-e-Huma Aslam', halima: 'Halima Sadia', ammara: 'Syeda Ammara Zaidi' },
      langNames: { ur: 'Urdu', en: 'English', ar: 'Arabic' },
      retry: 'Try again', waFallback: 'Book on WhatsApp instead'
    },
    ur: {
      title: 'سیشن بک کریں', subtitle: 'سروس، دن اور وقت چنیں۔',
      free_call: 'مفت تعارفی کال', free_call_sub: '15 منٹ · مفت',
      session_45: 'کوچنگ سیشن', session_45_sub: '45 منٹ',
      session_90: 'کوچنگ سیشن', session_90_sub: '90 منٹ',
      package_90x4: 'چار سیشن کا پیکج', package_90x4_sub: 'چار 90 منٹ کے سیشن',
      price: '{p} روپے', opening: 'افتتاحی رعایت 31 دسمبر 2026 تک',
      pickDay: 'دن چنیں', pickTime: 'وقت چنیں (پاکستان وقت)',
      noSlots: 'اس دن کوئی وقت خالی نہیں — کوئی اور دن چنیں۔',
      details: 'آپ کی تفصیل', name: 'آپ کا نام', wa: 'وٹس اپ نمبر',
      langLabel: 'سیشن کی زبان', topic: 'کس موضوع پر کام کرنا چاہتے ہیں؟ (اختیاری)',
      mode: 'طریقہ', online: 'آن لائن', bhimber: 'بھمبر میں ملاقات',
      bookBtn: 'بکنگ کی درخواست بھیجیں', back: 'واپس', close: 'بند کریں',
      pending: 'درخواست بھیج دی گئی', ref: 'بکنگ حوالہ',
      pendingNote: 'آپ کا وقت محفوظ ہے، {coach} کی تصدیق کا انتظار ہے۔ وٹس اپ پیغام بھیج دیں تاکہ انہیں فوراً نظر آئے — تصدیق وہیں ملے گی۔',
      sendWa: 'وٹس اپ پر بھیجیں',
      loadFail: 'کیلنڈر تک رسائی نہیں ہو سکی۔ دوبارہ کوشش کریں یا وٹس اپ پر بک کریں۔',
      slotTaken: 'یہ وقت ابھی لیا گیا — کوئی اور وقت چنیں۔',
      holdExpired: 'وقت کی پکڑ ختم ہو گئی — دوبارہ وقت چنیں۔',
      generic: 'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔',
      heldFor: '{m}:{s} تک محفوظ',
      months: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
      weekdays: ['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار'],
      coaches: { imran: 'عمران اسلم', irfan: 'عرفان اسلم', huma: 'ظلِ ہما اسلم', halima: 'حلیمہ سعدیہ', ammara: 'سیدہ عمارہ زیدی' },
      langNames: { ur: 'اردو', en: 'انگریزی', ar: 'عربی' },
      retry: 'دوبارہ کوشش کریں', waFallback: 'وٹس اپ پر بک کریں'
    },
    ar: {
      title: 'احجز جلسة', subtitle: 'اختر الخدمة واليوم والوقت.',
      free_call: 'مكالمة تعارف مجانية', free_call_sub: '15 دقيقة · مجاناً',
      session_45: 'جلسة توجيه', session_45_sub: '45 دقيقة',
      session_90: 'جلسة توجيه', session_90_sub: '90 دقيقة',
      package_90x4: 'باقة 4 جلسات', package_90x4_sub: 'أربع جلسات 90 دقيقة',
      price: 'Rs {p}', opening: 'عرض الافتتاح حتى 31 ديسمبر 2026',
      pickDay: 'اختر اليوم', pickTime: 'اختر الوقت (بتوقيت باكستان)',
      noSlots: 'لا أوقات متاحة في هذا اليوم — جرّب يوماً آخر.',
      details: 'بياناتك', name: 'الاسم', wa: 'رقم واتساب',
      langLabel: 'لغة الجلسة', topic: 'ما الموضوع الذي تريد العمل عليه؟ (اختياري)',
      mode: 'الطريقة', online: 'عبر الإنترنت', bhimber: 'حضورياً في بهمبر',
      bookBtn: 'أرسل طلب الحجز', back: 'رجوع', close: 'إغلاق',
      pending: 'تم إرسال الطلب', ref: 'مرجع الحجز',
      pendingNote: 'وقتك محجوز بانتظار تأكيد {coach}. أرسل رسالة واتساب ليصلهم الطلب فوراً — وسيأتيك التأكيد هناك.',
      sendWa: 'أرسل عبر واتساب',
      loadFail: 'تعذّر الوصول إلى التقويم. حاول مجدداً أو احجز عبر واتساب.',
      slotTaken: 'تم حجز هذا الوقت للتو — اختر وقتاً آخر.',
      holdExpired: 'انتهت مدة الحجز المؤقت — اختر الوقت مجدداً.',
      generic: 'حدث خطأ ما. حاول مجدداً.',
      heldFor: 'محجوز لمدة {m}:{s}',
      months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      weekdays: ['اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد'],
      coaches: { imran: 'عمران أسلم', irfan: 'عرفان أسلم', huma: 'ظلِّ هما أسلم', halima: 'حليمة سعدية', ammara: 'سيدة عمارة زيدي' },
      langNames: { ur: 'الأردية', en: 'الإنجليزية', ar: 'العربية' },
      retry: 'حاول مجدداً', waFallback: 'احجز عبر واتساب'
    }
  }[LOCALE];

  function t(key, vars) {
    var s = STR[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtTime(min) { return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function api(path, opts) {
    return fetch(API + path, opts).then(function (r) {
      return r.json().then(function (j) { return { status: r.status, body: j }; });
    });
  }

  var S = null; // session state, created on open
  var overlay = null, card = null, bodyBox = null, lastFocus = null, countdownTimer = null;

  function buildShell() {
    overlay = el('div', 'ab-overlay');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', t('title'));
    card = el('div', 'ab-card');
    var head = el('div', 'ab-head');
    var titles = el('div', 'ab-titles');
    titles.appendChild(el('h2', 'ab-title', t('title')));
    titles.appendChild(el('p', 'ab-subtitle', t('subtitle')));
    var x = el('button', 'ab-x', '×');
    x.type = 'button'; x.setAttribute('aria-label', t('close'));
    x.addEventListener('click', close);
    head.appendChild(titles); head.appendChild(x);
    bodyBox = el('div', 'ab-body');
    card.appendChild(head); card.appendChild(bodyBox);
    overlay.appendChild(card);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay) close(); });
    document.body.appendChild(overlay);
  }

  function showError(msg, fallbackWa) {
    bodyBox.innerHTML = '';
    var box = el('div', 'ab-error', msg);
    bodyBox.appendChild(box);
    var row = el('div', 'ab-row');
    var retry = el('button', 'ab-btn', t('retry'));
    retry.type = 'button';
    retry.addEventListener('click', function () { renderServices(); });
    row.appendChild(retry);
    if (fallbackWa) {
      var a = el('a', 'ab-btn ab-btn-ghost', t('waFallback'));
      a.href = fallbackWa; a.target = '_blank'; a.rel = 'noopener';
      row.appendChild(a);
    }
    bodyBox.appendChild(row);
  }

  function open(coachId, fallbackWa) {
    lastFocus = document.activeElement;
    S = { coachId: coachId, fallbackWa: fallbackWa, services: null, service: null,
          cursor: new Date(), monthDays: {}, date: null, startMin: null,
          holdId: null, holdExpires: null, notice: null };
    var today = new Date(); today.setHours(0, 0, 0, 0);
    S.cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    S.today = today;
    S.maxDate = new Date(today); S.maxDate.setDate(S.maxDate.getDate() + 60);
    if (!overlay) buildShell();
    overlay.classList.add('ab-open');
    document.body.classList.add('ab-lock');
    renderServices();
    var f = card.querySelector('.ab-x'); if (f) f.focus();
  }

  function releaseHold() {
    if (S && S.holdId) {
      var id = S.holdId; S.holdId = null; stopCountdown();
      api('/api/release', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hold_id: id }) }).catch(function () {});
    }
  }

  function close() {
    releaseHold();
    if (overlay) overlay.classList.remove('ab-open');
    document.body.classList.remove('ab-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function stopCountdown() { if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; } }

  /* ---- step 1: services ---- */
  function renderServices() {
    stopCountdown();
    bodyBox.innerHTML = '';
    var coachName = el('p', 'ab-coach', t('coaches')[S.coachId] || S.coachId);
    bodyBox.appendChild(coachName);
    var list = el('div', 'ab-services');
    bodyBox.appendChild(list);
    list.appendChild(el('p', 'ab-muted', '…'));
    api('/api/coaches').then(function (res) {
      if (res.status !== 200 || !res.body.ok) { showError(t('loadFail'), S.fallbackWa); return; }
      var coach = null;
      res.body.coaches.forEach(function (c) { if (c.id === S.coachId) coach = c; });
      if (!coach) { showError(t('loadFail'), S.fallbackWa); return; }
      S.services = coach.services;
      S.openingUntil = res.body.opening_until;
      list.innerHTML = '';
      coach.services.forEach(function (svc) {
        var b = el('button', 'ab-service');
        b.type = 'button';
        var top = el('div', 'ab-service-top');
        top.appendChild(el('span', 'ab-service-name', t(svc.kind)));
        var pr = el('span', 'ab-service-price');
        if (svc.price === 0) { pr.textContent = t('free_call_sub').split('·')[1].trim(); }
        else {
          pr.textContent = t('price', { p: fmtNum(svc.price) });
          if (svc.regular_price > svc.price) {
            var old = el('s', 'ab-service-old', t('price', { p: fmtNum(svc.regular_price) }));
            pr.appendChild(document.createTextNode(' ')); pr.appendChild(old);
          }
        }
        top.appendChild(pr);
        b.appendChild(top);
        b.appendChild(el('div', 'ab-service-sub', t(svc.kind + '_sub')));
        b.addEventListener('click', function () { S.service = svc; S.date = null; S.startMin = null; renderCalendar(); });
        list.appendChild(b);
      });
      if (S.openingUntil) {
        var note = el('p', 'ab-opening', t('opening'));
        bodyBox.appendChild(note);
      }
    }).catch(function () { showError(t('loadFail'), S.fallbackWa); });
  }

  /* ---- step 2: calendar + slots ---- */
  function renderCalendar() {
    stopCountdown();
    bodyBox.innerHTML = '';
    if (S.notice) { bodyBox.appendChild(el('div', 'ab-notice', S.notice)); S.notice = null; }
    var summary = el('p', 'ab-coach', t('coaches')[S.coachId] + ' · ' + t(S.service.kind) + ' · ' +
      (S.service.price === 0 ? t('free_call_sub').split('·')[1].trim() : t('price', { p: fmtNum(S.service.price) })));
    bodyBox.appendChild(summary);
    bodyBox.appendChild(el('h3', 'ab-h', t('pickDay')));

    var nav = el('div', 'ab-calnav');
    var prev = el('button', 'ab-calbtn', '‹'); prev.type = 'button';
    var next = el('button', 'ab-calbtn', '›'); next.type = 'button';
    var label = el('span', 'ab-callabel');
    nav.appendChild(prev); nav.appendChild(label); nav.appendChild(next);
    bodyBox.appendChild(nav);

    var grid = el('div', 'ab-grid');
    bodyBox.appendChild(grid);
    var slotBox = el('div', 'ab-slots');
    bodyBox.appendChild(slotBox);
    var row = el('div', 'ab-row');
    var back = el('button', 'ab-btn ab-btn-ghost', t('back'));
    back.type = 'button';
    back.addEventListener('click', renderServices);
    row.appendChild(back);
    bodyBox.appendChild(row);

    function drawMonth() {
      label.textContent = STR.months[S.cursor.getMonth()] + ' ' + S.cursor.getFullYear();
      prev.disabled = S.cursor <= new Date(S.today.getFullYear(), S.today.getMonth(), 1);
      var nextMonth = new Date(S.cursor.getFullYear(), S.cursor.getMonth() + 1, 1);
      next.disabled = nextMonth > S.maxDate;
      grid.innerHTML = '';
      STR.weekdays.forEach(function (w) { grid.appendChild(el('span', 'ab-wd', w)); });
      var first = new Date(S.cursor.getFullYear(), S.cursor.getMonth(), 1);
      var lead = (first.getDay() + 6) % 7; // Monday-first
      for (var i = 0; i < lead; i++) grid.appendChild(el('span', 'ab-empty'));
      var daysIn = new Date(S.cursor.getFullYear(), S.cursor.getMonth() + 1, 0).getDate();
      for (var d = 1; d <= daysIn; d++) {
        (function (dayNum) {
          var dt = new Date(S.cursor.getFullYear(), S.cursor.getMonth(), dayNum);
          var key = iso(dt);
          var b = el('button', 'ab-day', String(dayNum));
          b.type = 'button';
          var slots = S.monthDays[key];
          var usable = dt >= S.today && dt <= S.maxDate;
          if (!usable || (slots && slots.length === 0)) b.disabled = true;
          if (slots && slots.length > 0) b.classList.add('ab-has');
          if (S.date === key) b.classList.add('ab-sel');
          b.addEventListener('click', function () { S.date = key; S.startMin = null; drawMonth(); drawSlots(); });
          grid.appendChild(b);
        })(d);
      }
    }

    function drawSlots() {
      slotBox.innerHTML = '';
      if (!S.date) return;
      slotBox.appendChild(el('h3', 'ab-h', t('pickTime')));
      var slots = S.monthDays[S.date] || [];
      if (!slots.length) { slotBox.appendChild(el('p', 'ab-muted', t('noSlots'))); return; }
      var wrap = el('div', 'ab-chipwrap');
      slots.forEach(function (m) {
        var c = el('button', 'ab-chip', fmtTime(m));
        c.type = 'button';
        c.setAttribute('dir', 'ltr');
        if (S.startMin === m) c.classList.add('ab-sel');
        c.addEventListener('click', function () { holdSlot(m); });
        wrap.appendChild(c);
      });
      slotBox.appendChild(wrap);
    }

    function loadMonth() {
      var from = iso(new Date(S.cursor.getFullYear(), S.cursor.getMonth(), 1));
      var to = iso(new Date(S.cursor.getFullYear(), S.cursor.getMonth() + 1, 0));
      grid.innerHTML = '';
      grid.appendChild(el('p', 'ab-muted', '…'));
      api('/api/availability?coach_id=' + encodeURIComponent(S.coachId) +
        '&service_id=' + S.service.id + '&from=' + from + '&to=' + to).then(function (res) {
        if (res.status !== 200 || !res.body.ok) { showError(t('loadFail'), S.fallbackWa); return; }
        S.monthDays = res.body.days || {};
        drawMonth(); drawSlots();
      }).catch(function () { showError(t('loadFail'), S.fallbackWa); });
    }

    prev.addEventListener('click', function () {
      S.cursor = new Date(S.cursor.getFullYear(), S.cursor.getMonth() - 1, 1); loadMonth();
    });
    next.addEventListener('click', function () {
      S.cursor = new Date(S.cursor.getFullYear(), S.cursor.getMonth() + 1, 1); loadMonth();
    });
    loadMonth();
  }

  function holdSlot(min) {
    api('/api/hold', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coach_id: S.coachId, service_id: S.service.id, date: S.date, start_min: min }) })
      .then(function (res) {
        if (res.status === 409) { S.notice = t('slotTaken'); renderCalendar(); return; }
        if (res.status !== 200 || !res.body.ok) { showError(t('generic'), S.fallbackWa); return; }
        S.startMin = min; S.holdId = res.body.hold_id;
        S.holdExpires = new Date(res.body.expires_at).getTime();
        renderDetails();
      }).catch(function () { showError(t('generic'), S.fallbackWa); });
  }

  /* ---- step 3: details ---- */
  function renderDetails() {
    bodyBox.innerHTML = '';
    var summary = el('p', 'ab-coach');
    summary.appendChild(document.createTextNode(t('coaches')[S.coachId] + ' · ' + t(S.service.kind) + ' · '));
    var dt = el('bdi', null, S.date + ' · ' + fmtTime(S.startMin) + ' PKT');
    dt.setAttribute('dir', 'ltr');
    summary.appendChild(dt);
    bodyBox.appendChild(summary);
    var holdNote = el('p', 'ab-hold', '');
    bodyBox.appendChild(holdNote);
    bodyBox.appendChild(el('h3', 'ab-h', t('details')));

    function tick() {
      var left = Math.max(0, Math.floor((S.holdExpires - Date.now()) / 1000));
      holdNote.textContent = t('heldFor', { m: Math.floor(left / 60), s: String(left % 60).padStart(2, '0') });
      if (left <= 0) { stopCountdown(); releaseHold(); S.notice = t('holdExpired'); renderCalendar(); }
    }
    tick();
    stopCountdown();
    countdownTimer = setInterval(tick, 1000);

    var form = el('form', 'ab-form');
    form.noValidate = true;
    function field(labelText, input) {
      var lab = el('label', 'ab-field');
      lab.appendChild(el('span', 'ab-flabel', labelText));
      lab.appendChild(input);
      return lab;
    }
    var nameI = el('input', 'ab-input'); nameI.type = 'text'; nameI.required = true;
    nameI.maxLength = 80; nameI.autocomplete = 'name';
    form.appendChild(field(t('name'), nameI));
    var waI = el('input', 'ab-input'); waI.type = 'tel'; waI.required = true;
    waI.setAttribute('dir', 'ltr'); waI.autocomplete = 'tel';
    waI.placeholder = '03XXXXXXXXX';
    form.appendChild(field(t('wa'), waI));

    var langRow = el('div', 'ab-radio-row');
    langRow.appendChild(el('span', 'ab-flabel', t('langLabel')));
    ['ur', 'en', 'ar'].forEach(function (lg) {
      var lab = el('label', 'ab-radio');
      var r = el('input'); r.type = 'radio'; r.name = 'ab-lang'; r.value = lg;
      if (lg === LOCALE) r.checked = true;
      lab.appendChild(r); lab.appendChild(document.createTextNode(' ' + STR.langNames[lg]));
      langRow.appendChild(lab);
    });
    form.appendChild(langRow);

    var modeRow = el('div', 'ab-radio-row');
    modeRow.appendChild(el('span', 'ab-flabel', t('mode')));
    [['online', t('online')], ['bhimber', t('bhimber')]].forEach(function (pair, i) {
      var lab = el('label', 'ab-radio');
      var r = el('input'); r.type = 'radio'; r.name = 'ab-mode'; r.value = pair[0];
      if (i === 0) r.checked = true;
      lab.appendChild(r); lab.appendChild(document.createTextNode(' ' + pair[1]));
      modeRow.appendChild(lab);
    });
    form.appendChild(modeRow);

    var topicI = el('textarea', 'ab-input'); topicI.rows = 2; topicI.maxLength = 500;
    form.appendChild(field(t('topic'), topicI));

    var errBox = el('p', 'ab-formerr');
    errBox.hidden = true;
    form.appendChild(errBox);

    var row = el('div', 'ab-row');
    var back = el('button', 'ab-btn ab-btn-ghost', t('back'));
    back.type = 'button';
    back.addEventListener('click', function () { releaseHold(); renderCalendar(); });
    var submit = el('button', 'ab-btn', t('bookBtn'));
    submit.type = 'submit';
    row.appendChild(back); row.appendChild(submit);
    form.appendChild(row);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameI.value.trim();
      var wa = waI.value.replace(/[\s\-]/g, '');
      if (!name) { errBox.textContent = t('name'); errBox.hidden = false; nameI.focus(); return; }
      if (!/^\+?\d{10,15}$/.test(wa)) { errBox.textContent = t('wa'); errBox.hidden = false; waI.focus(); return; }
      errBox.hidden = true;
      submit.disabled = true;
      var lang = (form.querySelector('input[name="ab-lang"]:checked') || {}).value || LOCALE;
      var mode = (form.querySelector('input[name="ab-mode"]:checked') || {}).value || 'online';
      api('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hold_id: S.holdId, client_name: name, client_wa: wa,
          language: lang, topic: topicI.value.trim(), mode: mode }) })
        .then(function (res) {
          if (res.status === 409) { stopCountdown(); S.holdId = null; S.notice = t('holdExpired'); renderCalendar(); return; }
          if (res.status !== 200 || !res.body.ok) { submit.disabled = false; showError(t('generic'), S.fallbackWa); return; }
          stopCountdown(); S.holdId = null;
          renderPending(res.body);
        }).catch(function () { submit.disabled = false; showError(t('generic'), S.fallbackWa); });
    });
    bodyBox.appendChild(form);
  }

  /* ---- step 4: pending ---- */
  function renderPending(booking) {
    bodyBox.innerHTML = '';
    bodyBox.appendChild(el('h3', 'ab-h ab-ok', t('pending')));
    var ref = el('p', 'ab-ref', t('ref') + ': ');
    var b = el('bdi', null, String(booking.booking_id));
    ref.appendChild(b);
    bodyBox.appendChild(ref);
    bodyBox.appendChild(el('p', 'ab-note',
      t('pendingNote', { coach: t('coaches')[S.coachId] })));
    var row = el('div', 'ab-row');
    var wa = el('a', 'ab-btn', t('sendWa'));
    wa.href = 'https://wa.me/' + booking.notify_wa + '?text=' + encodeURIComponent(booking.notify_text);
    wa.target = '_blank'; wa.rel = 'noopener';
    row.appendChild(wa);
    var done = el('button', 'ab-btn ab-btn-ghost', t('close'));
    done.type = 'button';
    done.addEventListener('click', close);
    row.appendChild(done);
    bodyBox.appendChild(row);
  }

  /* ---- wiring: any [data-booking-open] button opens the popup ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-booking-open]') : null;
    if (!btn) return;
    e.preventDefault();
    var coachId = btn.getAttribute('data-coach') || 'imran';
    var pick = document.getElementById('coachPick2');
    if (pick && pick.options[pick.selectedIndex]) {
      var map = ['imran', 'irfan', 'huma', 'halima', 'ammara'];
      coachId = map[pick.selectedIndex] || coachId;
    }
    open(coachId, btn.getAttribute('href') || null);
  });
})();
