/* Pilot app logic for the three Urdu assessments.
 * Pure functions (scoring, CSV/JSON building) are testable in Node.
 * DOM wiring only runs in a browser.
 * No data leaves the device. Completed responses live in localStorage only.
 */
'use strict';

var RESPONSE_LABELS = ['کبھی نہیں', 'کبھی کبھار', 'اکثر', 'تقریباً ہمیشہ'];
var MAX_VALUE = 3;
var STORAGE_KEY = 'pilot_responses_v1';

/* Score one item: raw 0..3; reverse items flip (3 becomes 0). */
function scoreItem(item, raw) {
  if (raw === null || raw === undefined) return null;
  return item.reverse ? (MAX_VALUE - raw) : raw;
}

/* responses: {itemId: rawValue}. Returns {scales: {name:{score,max,items}},
   total, maxTotal, answered, totalItems}. */
function computeScores(items, responses) {
  var scales = {};
  var order = [];
  var total = 0, maxTotal = 0, answered = 0;
  items.forEach(function (it) {
    if (!scales[it.scale]) { scales[it.scale] = { score: 0, max: 0, items: 0 }; order.push(it.scale); }
    var raw = responses[it.id];
    var s = scoreItem(it, raw);
    scales[it.scale].max += MAX_VALUE;
    scales[it.scale].items += 1;
    maxTotal += MAX_VALUE;
    if (s !== null) {
      scales[it.scale].score += s;
      total += s;
      answered += 1;
    }
  });
  return { scales: scales, scaleOrder: order, total: total, maxTotal: maxTotal,
           answered: answered, totalItems: items.length };
}

function csvEscape(v) {
  var s = String(v === null || v === undefined ? '' : v);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

var CSV_HEADER = ['respondent_code', 'assessment_id', 'assessment_name', 'scale',
  'item_id', 'reverse', 'raw_value', 'raw_label', 'scored_value',
  'age', 'gender', 'city', 'timestamp'];

/* One long-format CSV row per answered item. */
function buildCSV(record) {
  var lines = [CSV_HEADER.join(',')];
  record.items.forEach(function (it) {
    var raw = record.responses[it.id];
    var row = [
      record.respondent_code, record.assessment_id, record.assessment_name,
      it.scale, it.id, it.reverse ? 1 : 0,
      raw === undefined ? '' : raw,
      raw === undefined ? '' : RESPONSE_LABELS[raw],
      raw === undefined ? '' : scoreItem(it, raw),
      record.age || '', record.gender || '', record.city || '',
      record.timestamp
    ];
    lines.push(row.map(csvEscape).join(','));
  });
  return '\uFEFF' + lines.join('\r\n') + '\r\n';
}

/* Full record as JSON (responses + per-scale scores + total). */
function buildRecordJSON(record) {
  var scores = computeScores(record.items, record.responses);
  var out = {
    respondent_code: record.respondent_code,
    assessment_id: record.assessment_id,
    assessment_name: record.assessment_name,
    timestamp: record.timestamp,
    age: record.age || null,
    gender: record.gender || null,
    city: record.city || null,
    response_scale: RESPONSE_LABELS,
    responses: record.items.map(function (it) {
      var raw = record.responses[it.id];
      return {
        item_id: it.id, scale: it.scale, reverse: it.reverse,
        raw_value: (raw === undefined ? null : raw),
        raw_label: (raw === undefined ? null : RESPONSE_LABELS[raw]),
        scored_value: scoreItem(it, raw)
      };
    }),
    scores: {
      scales: scores.scaleOrder.map(function (name) {
        return { scale: name, score: scores.scales[name].score, max: scores.scales[name].max };
      }),
      total: scores.total, max_total: scores.maxTotal
    }
  };
  return JSON.stringify(out, null, 2);
}

function makeCode() {
  var chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  var s = '';
  for (var i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'P-' + s;
}

/* ---------- Browser wiring (skipped under Node) ---------- */
if (typeof document !== 'undefined') {
  var DATA = null;         // parsed items.json
  var state = {
    assessment: null,      // assessment meta object
    items: [],             // items of chosen assessment
    index: 0,              // current item index
    responses: {},         // itemId -> raw 0..3
    code: makeCode(),
    age: '', gender: '', city: ''
  };

  function $(id) { return document.getElementById(id); }
  function show(id) {
    ['screen-home', 'screen-info', 'screen-quiz', 'screen-results', 'screen-error']
      .forEach(function (s) { $(s).style.display = (s === id) ? '' : 'none'; });
    window.scrollTo(0, 0);
  }

  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function loadData() {
    fetch('items.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        if (!d || !Array.isArray(d.assessments) || !Array.isArray(d.items)) throw new Error('items.json کی ساخت درست نہیں (assessments یا items نہیں ملے)۔');
        DATA = d;
        renderHome();
        show('screen-home');
      })
      .catch(function (e) {
        $('error-detail').textContent = 'items.json نہیں کھل سکی (' + e.message + ')۔';
        show('screen-error');
      });
  }

  function renderHome() {
    var wrap = $('assessment-list');
    wrap.innerHTML = '';
    DATA.assessments.forEach(function (a) {
      var card = document.createElement('button');
      card.className = 'assess-card';
      card.innerHTML =
        '<span class="assess-name">' + a.name + '</span>' +
        '<span class="assess-meta">' + a.audience + ' | ' + (a.final_items || a.pool_items) + ' سوال | ' +
        a.scales.length + ' پیمانے</span>' +
        '<span class="assess-note">آزمائش سے پہلے کا نسخہ</span>';
      card.addEventListener('click', function () { startAssessment(a); });
      wrap.appendChild(card);
    });
  }

  function startAssessment(a) {
    state.assessment = a;
    state.items = DATA.items.filter(function (it) { return it.assessment === a.id; });
    state.index = 0;
    state.responses = {};
    $('info-title').textContent = a.name;
    $('info-code').textContent = state.code;
    show('screen-info');
  }

  function beginQuiz() {
    state.age = $('f-age').value.trim();
    state.gender = $('f-gender').value;
    state.city = $('f-city').value.trim();
    renderQuestion();
    show('screen-quiz');
  }

  function renderQuestion() {
    var it = state.items[state.index];
    var n = state.items.length;
    $('q-progress-text').textContent = 'سوال ' + (state.index + 1) + ' از ' + n;
    $('q-progress-bar').style.width = ((state.index) / n * 100) + '%';
    $('q-scale').textContent = it.scale;
    $('q-text').textContent = it.text;
    var opts = $('q-options');
    opts.innerHTML = '';
    RESPONSE_LABELS.forEach(function (label, v) {
      var b = document.createElement('button');
      b.className = 'opt' + (state.responses[it.id] === v ? ' selected' : '');
      b.textContent = label;
      b.addEventListener('click', function () {
        state.responses[it.id] = v;
        renderQuestion();
      });
      opts.appendChild(b);
    });
    $('btn-prev').style.visibility = state.index === 0 ? 'hidden' : 'visible';
    var last = state.index === n - 1;
    $('btn-next').textContent = last ? 'نتیجہ دیکھیں' : 'اگلا سوال';
  }

  function nextQuestion() {
    var it = state.items[state.index];
    if (state.responses[it.id] === undefined) {
      $('q-hint').textContent = 'براہ کرم پہلے جواب منتخب کریں۔';
      return;
    }
    $('q-hint').textContent = '';
    if (state.index === state.items.length - 1) { finish(); return; }
    state.index += 1;
    renderQuestion();
  }

  function prevQuestion() {
    if (state.index > 0) { state.index -= 1; renderQuestion(); }
  }

  function finish() {
    var scores = computeScores(state.items, state.responses);
    var record = {
      respondent_code: state.code,
      assessment_id: state.assessment.id,
      assessment_name: state.assessment.name,
      timestamp: new Date().toISOString(),
      age: state.age, gender: state.gender, city: state.city,
      items: state.items,
      responses: state.responses
    };
    // Save locally only; nothing is sent anywhere.
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { saved = []; }
    saved.push(record);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (e) { /* storage full */ }
    window._lastRecord = record;

    var html = '<table class="results"><tr><th>پیمانہ</th><th>نمبر</th><th>زیادہ سے زیادہ</th></tr>';
    scores.scaleOrder.forEach(function (name) {
      var s = scores.scales[name];
      html += '<tr><td>' + name + '</td><td>' + s.score + '</td><td>' + s.max + '</td></tr>';
    });
    html += '<tr class="total-row"><td>کل</td><td>' + scores.total + '</td><td>' + scores.maxTotal + '</td></tr></table>';
    html += '<p class="pilot-note">یہ آزمائش سے پہلے کا آخری نسخہ ہے۔ ابھی کوئی درجہ بندی، نتیجہ یا فیصلہ طے نہیں ہوا؛ نمبر صرف آزمائش کے اعداد ہیں۔</p>';
    $('results-body').innerHTML = html;
    $('results-title').textContent = state.assessment.name + ' — نتیجہ';
    show('screen-results');
  }

  function downloadOne(kind) {
    var r = window._lastRecord;
    if (!r) return;
    var base = 'pilot-' + r.assessment_id + '-' + r.respondent_code + '-' + r.timestamp.slice(0, 10);
    if (kind === 'json') download(base + '.json', buildRecordJSON(r), 'application/json');
    else download(base + '.csv', buildCSV(r), 'text/csv');
  }

  function downloadAll(kind) {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { saved = []; }
    if (!saved.length) { alert('اس آلے پر ابھی کوئی محفوظ شدہ جواب نہیں ہے۔'); return; }
    if (kind === 'json') {
      download('pilot-all-responses.json', JSON.stringify(saved.map(function (r) {
        return JSON.parse(buildRecordJSON(r));
      }), null, 2), 'application/json');
    } else {
      var parts = saved.map(function (r) { return buildCSV(r).replace(/^\uFEFF/, ''); });
      download('pilot-all-responses.csv', '\uFEFF' + CSV_HEADER.join(',') + '\r\n' + parts.map(function (p) {
        return p.split('\r\n').slice(1).join('\r\n');
      }).join(''), 'text/csv');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('btn-start-info').addEventListener('click', beginQuiz);
    $('btn-prev').addEventListener('click', prevQuestion);
    $('btn-next').addEventListener('click', nextQuestion);
    $('btn-dl-json').addEventListener('click', function () { downloadOne('json'); });
    $('btn-dl-csv').addEventListener('click', function () { downloadOne('csv'); });
    $('btn-dl-all-json').addEventListener('click', function () { downloadAll('json'); });
    $('btn-dl-all-csv').addEventListener('click', function () { downloadAll('csv'); });
    $('btn-again').addEventListener('click', function () { state.code = makeCode(); renderHome(); show('screen-home'); });
    loadData();
  });
}

/* Node export for testing. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { scoreItem: scoreItem, computeScores: computeScores,
    buildCSV: buildCSV, buildRecordJSON: buildRecordJSON,
    RESPONSE_LABELS: RESPONSE_LABELS, CSV_HEADER: CSV_HEADER };
}
