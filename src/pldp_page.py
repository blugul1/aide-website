# -*- coding: utf-8 -*-
"""PLDP programme page — event-style layout (owner-approved demo, 2026-11-06).
Copy sources: progdata.py (per-locale settled copy) + the demo's settled
elements (3 layers, pillars, FAQ, inclusions). No invented copy anywhere.
Used by build.py only for slug == "pldp"; all other programmes keep
detail_body() untouched."""
import re, urllib.parse

WA_NUM = "923309222029"

def _wa(msg):
    return "https://wa.me/" + WA_NUM + "?text=" + urllib.parse.quote(msg)

PILLAR_KEYS = ["u", "s", "w", "w", "w", "w", "w", "a"]  # per week 1..8 (week index 0..7 -> weeks 1,2,3,4,5,6,7,8 mapped below)
WEEK_PILLAR = ["u", "s", "u", "w", "w", "w", "w", "a"]

TXT = {
"en": dict(
  tagline="Leadership as a trust — in the light of the Prophetic example",
  next_chip="Next cohort — dates announced soon",
  cta_primary="Details & registration — WhatsApp",
  cta_schedule="See the 8-week schedule",
  back="← All programmes",
  stats=[("08", "weeks — the full training journey"), ("04", "USWA pillars — Understanding, Sincerity, Wisdom, Accountability"), ("16", "hours of live training"), ("360°", "feedback & capstone")],
  layers_h="The programme's three layers",
  layers_p="Every week runs on the same three layers — first the foundation, then understanding, and finally the field of practice.",
  layers=[("Layer 1 — Foundation", "The Quran, the authentic Sunnah and reliable Seerah — the programme's true root; every principle is taken from here first."),
          ("Layer 2 — Explanation", "Modern leadership psychology — used only to explain, never to replace the foundation. It is light; it does not change the path."),
          ("Layer 3 — Practice", "Fieldwork, feedback and your personal Blueprint — what you learn is tested the same week, in your own team and setting.")],
  fw_h="The four pillars of USWA",
  fw_p="Select a pillar — its weeks light up in the schedule below.",
  pillars=[("u", "01 · U", "Understanding", "Reading people, contexts and moments before you decide.", "Weeks 1 & 3"),
           ("s", "02 · S", "Sincerity", "Purity of intention and the inner audit — leadership begins here.", "Week 2"),
           ("w", "03 · W", "Wisdom", "Consultation, hard decisions, team-building and timing.", "Weeks 4–7"),
           ("a", "04 · A", "Accountability", "Self-reckoning, hearing feedback and acting on it — the final station.", "Week 8")],
  note_default="No pillar selected yet — together, the four pillars make the full eight-week map.",
  note_tmpl="Selected pillar: {name} — {weeks} highlighted in the schedule. Click again to clear the selection.",
  sched_h="Eight weeks, step by step",
  sched_p="Each week is one step — from the foundation to accountability.",
  strip="Contact us for a seat in the next cohort →",
  growth_h="Growth you can measure",
  growth_p="In PLDP, growth is judged not by feeling, but by the mirror and by feedback.",
  band=[("The USWA Leadership Mirror", "At the start and the end — 20 behaviours, four pillars. Place the first day's map beside the last day's and see the difference yourself."),
        ("360° feedback — the full cycle", "Your leadership through the eyes of the people around you — then a plan to act on that feedback."),
        ("Capstone: My Prophetic Leadership Blueprint", "At the end, every participant presents a personal Blueprint — what was learned, turned into a map for their own field.")],
  band_link="Try the mirror now — Assessment Centre",
  outcomes_h="By the end, you will be able to",
  fees_h="Fees",
  fees_p="The programme is the same either way — the only difference is when you book.",
  early_name="Early bird", early_chip="Best choice", early_cta="Ask about the early bird — WhatsApp",
  std_name="Standard", std_cta="Contact us to register — WhatsApp",
  inclusions=["8 live sessions (weekly, 2 hours)", "Weekly fieldwork", "The complete workbook", "USWA Mirror + 360 feedback (start & end)", "Capstone Blueprint"],
  fee_note="Early-bird fee PKR 36,000 — confirm current availability and the closing date on WhatsApp.",
  who_h="Who it is for",
  who_title="Who it is for",
  who_extra=" — who carry responsibility for others and want their leadership shaped in the light of the Prophetic example.",
  notfor_title="Who it is not for",
  trainer="Trainer: Imran Aslam — Life Coach &amp; Trainer, founder of AIDE",
  faq_h="Common questions",
  faq=[("What language is the programme in?", "Fully in Urdu; technical terms are given in English brackets where needed."),
       ("How much time does it take each week?", "A 2-hour live session + roughly 30 to 60 minutes of fieldwork."),
       ("Is it just lectures?", "No; every week requires fieldwork, feedback and practice — the larger part of each session is participation."),
       ("Do I get a certificate?", "Yes — on completing the attendance, the worksheets and the capstone."),
       ("How do I get the early bird?", "The early-bird fee is PKR 36,000; confirm availability and the closing date on WhatsApp.")],
  final_h="Leadership is a trust — carry it in the light of the Prophetic example.",
  hero_alt="Inside a mosque at dawn — a large sea-green mihrab at the front, the imam's sea-green prayer mat at its threshold, rows of navy prayer mats behind, and a glossy white floor reflecting the light",
),
"ur": dict(
  tagline="قیادت بطورِ امانت — اسوہ کی روشنی میں",
  next_chip="اگلا کوہورٹ — تاریخ کا اعلان جلد",
  cta_primary="تفصیلات و رجسٹریشن — WhatsApp",
  cta_schedule="8 ہفتوں کا شیڈول دیکھیں",
  back="→ تمام پروگرامز",
  stats=[("08", "ہفتے — مکمل تربیتی سفر"), ("04", "USWA ستون — فہم، اخلاص، حکمت، احتساب"), ("16", "گھنٹے لائیو تربیت"), ("360°", "فیڈ بیک و کیپ اسٹون")],
  layers_h="پروگرام کی تین تہیں",
  layers_p="ہر ہفتہ انہی تین تہوں پر چلتا ہے — پہلے بنیاد، پھر سمجھ، اور آخر میں میدانِ عمل۔",
  layers=[("تہہ 1 — بنیاد", "قرآن، مستند سنت اور معتبر سیرت — پروگرام کی اصل جڑ یہی ہے، اور ہر اصول پہلے یہیں سے لیا جاتا ہے۔"),
          ("تہہ 2 — توضیح", "جدید قیادت کی نفسیات — صرف سمجھانے کے لیے، بنیاد کے بدلے نہیں۔ یہ روشنی ہے، راستہ نہیں بدلتی۔"),
          ("تہہ 3 — عمل", "فیلڈ ورک، فیڈ بیک اور ذاتی بلیو پرنٹ — جو سیکھا، اسی ہفتے اپنی ٹیم اور اپنے ماحول میں آزمایا۔")],
  fw_h="اسوہ کے چار ستون",
  fw_p="کسی ستون کو چنیں — نیچے شیڈول میں اس کے ہفتے خود نمایاں ہو جائیں گے۔",
  pillars=[("u", "01 · U", "فہم", "لوگوں، حالات اور لمحوں کو فیصلے سے پہلے پڑھنا۔", "ہفتہ 1 و 3"),
           ("s", "02 · S", "اخلاص", "نیت کی صفائی اور اندر کا احتساب — قیادت یہیں سے شروع ہوتی ہے۔", "ہفتہ 2"),
           ("w", "03 · W", "حکمت", "مشورہ، مشکل فیصلے، ٹیم سازی اور وقت کی پہچان۔", "ہفتہ 4 تا 7"),
           ("a", "04 · A", "احتساب", "محاسبہ، فیڈ بیک کو سننا اور اس پر عمل — اختتامی پڑاؤ۔", "ہفتہ 8")],
  note_default="ابھی کوئی ستون منتخب نہیں — چاروں ستون مل کر آٹھ ہفتوں کا پورا نقشہ بناتے ہیں۔",
  note_tmpl="منتخب ستون: {name} — شیڈول میں اس کے {weeks} نمایاں ہیں۔ دوبارہ کلک کرنے سے انتخاب ختم ہو جائے گا۔",
  sched_h="آٹھ ہفتے، قدم بہ قدم",
  sched_p="ہر ہفتہ ایک قدم — بنیاد سے احتساب تک۔",
  strip="اگلے کوہورٹ میں نشست کے لیے رابطہ کریں ←",
  growth_h="ترقی جو ناپی جا سکے",
  growth_p="PLDP میں ترقی کا اندازہ احساس پر نہیں، آئینے اور فیڈ بیک پر ہوتا ہے۔",
  band=[("اسوہ قیادت آئینہ", "آغاز و اختتام پر — 20 رویے، چار ستون۔ پہلے دن کا نقشہ اور آخری دن کا نقشہ سامنے رکھ کر فرق خود دیکھیں۔"),
        ("360° فیڈ بیک کا مکمل دور", "آپ کے گرد موجود لوگوں کی نظر سے آپ کی قیادت — پھر اس فیڈ بیک پر عمل کا منصوبہ۔"),
        ("کیپ اسٹون: میرا نبوی قیادت بلیو پرنٹ", "اختتام پر ہر شریک اپنا ذاتی بلیو پرنٹ پیش کرتا ہے — سیکھا ہوا علم، اپنے میدان کے لیے نقشے میں بدلا ہوا۔")],
  band_link="آئینہ ابھی آزمائیں — اسیسمنٹ سینٹر",
  outcomes_h="اختتام پر آپ کے پاس کیا ہوگا",
  fees_h="فیس",
  fees_p="دونوں صورتوں میں پروگرام ایک ہی ہے — فرق صرف بکنگ کے وقت کا ہے۔",
  early_name="ارلی برڈ", early_chip="بہترین انتخاب", early_cta="ارلی برڈ پر رابطہ کریں — WhatsApp",
  std_name="معیاری", std_cta="رجسٹریشن کے لیے رابطہ کریں — WhatsApp",
  inclusions=["8 لائیو سیشنز (ہفتہ وار 2 گھنٹے)", "ہفتہ وار فیلڈ ورک", "مکمل ورک بک", "اسوہ آئینہ + 360 فیڈ بیک (آغاز و اختتام)", "کیپ اسٹون بلیو پرنٹ"],
  fee_note="ارلی برڈ فیس 36,000 روپے — موجودہ دستیابی اور آخری تاریخ WhatsApp پر پوچھ لیں۔",
  who_h="یہ پروگرام کس کے لیے ہے",
  who_title="کس کے لیے ہے",
  who_extra=" — جو دوسروں کی ذمہ داری اٹھاتے ہیں، اور چاہتے ہیں کہ ان کی قیادت اسوہ کی روشنی میں ڈھلے۔",
  notfor_title="کس کے لیے نہیں",
  trainer="ٹرینر: عمران اسلم — Life Coach &amp; Trainer، بانی AIDE",
  faq_h="عام سوالات",
  faq=[("پروگرام کی زبان کیا ہے؟", "مکمل اردو؛ اصطلاحات انگریزی بریکٹ کے ساتھ جہاں ضرورت ہو۔"),
       ("ہفتہ وار کتنا وقت درکار ہے؟", "2 گھنٹے لائیو سیشن + تقریباً 30 تا 60 منٹ فیلڈ ورک۔"),
       ("کیا یہ صرف لیکچر ہے؟", "نہیں؛ ہر ہفتے فیلڈ ورک، فیڈ بیک اور مشق لازم ہے — سیشن کا بڑا حصہ شرکت پر مبنی ہے۔"),
       ("سرٹیفکیٹ ملتا ہے؟", "جی؛ حاضری، ورک شیٹس اور کیپ اسٹون کی تکمیل پر۔"),
       ("ارلی برڈ کیسے ملے گا؟", "ارلی برڈ فیس PKR 36,000 ہے؛ دستیابی اور آخری تاریخ WhatsApp پر تصدیق کریں۔")],
  final_h="قیادت ایک امانت ہے — اسے اسوہ کی روشنی میں اٹھائیں۔",
  hero_alt="مسجد کے اندر صبح کا منظر — سامنے بڑی سبز محراب، اس کے دہانے پر امام کی سبز جائے نماز، پیچھے نیوی نیلی جائے نمازوں کی قطاریں اور روشنی جھلکتا چمکیلا سفید فرش",
),
"ar": dict(
  tagline="القيادة أمانة — في ضوء الأسوة النبوية",
  next_chip="الدفعة القادمة — تُعلن التواريخ قريبًا",
  cta_primary="التفاصيل والتسجيل — واتساب",
  cta_schedule="اطّلع على جدول الأسابيع الثمانية",
  back="→ كل البرامج",
  stats=[("08", "أسابيع — رحلة التدريب الكاملة"), ("04", "أركان الأسوة — الفهم، الإخلاص، الحكمة، المساءلة"), ("16", "ساعة تدريب مباشر"), ("360°", "تغذية راجعة ومشروع تخرّج")],
  layers_h="طبقات البرنامج الثلاث",
  layers_p="كل أسبوع يسير على الطبقات الثلاث نفسها — أولًا الأساس، ثم الفهم، وأخيرًا ميدان التطبيق.",
  layers=[("الطبقة 1 — الأساس", "القرآن والسنة الصحيحة والسيرة الموثوقة — جذر البرنامج الحقيقي؛ كل مبدأ يؤخذ من هنا أولًا."),
          ("الطبقة 2 — الشرح", "علم نفس القيادة الحديث — للشرح فقط، لا ليحل محل الأساس. إنه نورٌ لا يغيّر الطريق."),
          ("الطبقة 3 — التطبيق", "العمل الميداني والتغذية الراجعة ومخططك الشخصي — ما تتعلمه تختبره في الأسبوع نفسه، في فريقك وبيئتك.")],
  fw_h="أركان الأسوة الأربعة",
  fw_p="اختر ركنًا — ستبرز أسابيعه في الجدول أدناه.",
  pillars=[("u", "01 · U", "الفهم", "قراءة الناس والسياقات واللحظات قبل أن تقرر.", "الأسبوعان 1 و3"),
           ("s", "02 · S", "الإخلاص", "صفاء النية ومحاسبة النفس — القيادة تبدأ من هنا.", "الأسبوع 2"),
           ("w", "03 · W", "الحكمة", "الشورى والقرارات الصعبة وبناء الفرق وحسن التوقيت.", "الأسابيع 4–7"),
           ("a", "04 · A", "المساءلة", "المحاسبة وسماع التغذية الراجعة والعمل بها — المحطة الأخيرة.", "الأسبوع 8")],
  note_default="لم يُختر أي ركن بعد — الأركان الأربعة معًا ترسم خريطة الأسابيع الثمانية كاملةً.",
  note_tmpl="الركن المختار: {name} — أسابيعه {weeks} مبرزة في الجدول. انقر مجددًا لإلغاء الاختيار.",
  sched_h="ثمانية أسابيع، خطوة بخطوة",
  sched_p="كل أسبوع خطوة — من الأساس إلى المساءلة.",
  strip="تواصل معنا لحجز مقعد في الدفعة القادمة ←",
  growth_h="نموٌّ يمكن قياسه",
  growth_p="في هذا البرنامج لا يُقاس النمو بالشعور، بل بالمرآة والتغذية الراجعة.",
  band=[("مرآة القيادة الأسوة", "في البداية والنهاية — 20 سلوكًا، أربعة أركان. ضع خريطة اليوم الأول بجانب خريطة اليوم الأخير وترى الفرق بنفسك."),
        ("تغذية راجعة 360° — الدورة الكاملة", "قيادتك بعيون من حولك — ثم خطة للعمل بتلك التغذية."),
        ("مشروع التخرج: مخطط قيادتي النبوية", "في الختام يقدّم كل مشارك مخططه الشخصي — ما تعلّمه، محوَّلًا إلى خريطة لميدانه.")],
  band_link="جرّب المرآة الآن — مركز التقييم",
  outcomes_h="في الختام، ستكون قادرًا على",
  fees_h="الرسوم",
  fees_p="البرنامج واحد في كلتا الحالتين — الفرق الوحيد هو توقيت الحجز.",
  early_name="الحجز المبكر", early_chip="الخيار الأفضل", early_cta="اسأل عن الحجز المبكر — واتساب",
  std_name="القياسي", std_cta="تواصل معنا للتسجيل — واتساب",
  inclusions=["8 جلسات مباشرة (أسبوعيًا، ساعتان)", "عمل ميداني أسبوعي", "دليل المشارك الكامل", "مرآة الأسوة + تغذية 360 (في البداية والنهاية)", "مخطط التخرج"],
  fee_note="رسوم الحجز المبكر 36,000 روبية — أكّد التوفر الحالي وتاريخ الإغلاق عبر واتساب.",
  who_h="لمن هذا البرنامج",
  who_title="لمن هذا",
  who_extra=" — ممن يحملون مسؤولية الآخرين ويريدون أن تتشكل قيادتهم في ضوء المثال النبوي.",
  notfor_title="لمن لا يناسبه",
  trainer="المدرّب: عمران أسلم — مدرّب حياة ومدرّب، مؤسس AIDE",
  faq_h="أسئلة شائعة",
  faq=[("ما لغة البرنامج؟", "بالأردية بالكامل؛ وتُعطى المصطلحات بين قوسين بالإنجليزية عند الحاجة."),
       ("كم من الوقت يتطلب أسبوعيًا؟", "جلسة مباشرة لمدة ساعتين + نحو 30 إلى 60 دقيقة من العمل الميداني."),
       ("هل هو محاضرات فقط؟", "لا؛ كل أسبوع يتطلب عملًا ميدانيًا وتغذية راجعة وممارسة — والجزء الأكبر من الجلسة قائم على المشاركة."),
       ("هل أحصل على شهادة؟", "نعم — عند إكمال الحضور وأوراق العمل ومشروع التخرج."),
       ("كيف أحصل على الحجز المبكر؟", "رسوم الحجز المبكر 36,000 روبية؛ أكّد التوفر والموعد النهائي عبر واتساب.")],
  final_h="القيادة أمانة — احملها في ضوء الأسوة النبوية.",
  hero_alt="داخل مسجد عند الفجر — محراب أخضر كبير في المقدمة، وسجادة صلاة الإمام الخضراء عند عتبته، وصفوف سجادات كحلية خلفها، وأرضية بيضاء لامعة تعكس الضوء",
)}

PILLAR_LATIN = {"u": "Understanding", "s": "Sincerity", "w": "Wisdom", "a": "Accountability"}
COHORT_WORDS = {"cohort", "کوہورٹ", "مجموعة"}

def _chips(loc, p, t):
    parts = [x.strip() for x in p["fact"].split("·")]
    parts = [x for x in parts if x and x not in COHORT_WORDS]
    parts.append(t["next_chip"])
    return "".join(f'<span class="pd-chip"><i></i>{x}</span>' for x in parts)

def _price(loc, n):
    if loc == "ar":
        return f'<span dir="ltr">{n}</span> <small>روبية</small>'
    return f'<small>PKR</small> {n}'

def body(loc, p, notfor):
    t = TXT[loc]
    wa = _wa(p["wa"])
    nums = re.findall(r"\d{1,3},\d{3}", p["fee"])
    std_fee, early_fee = nums[0], nums[1]
    stats = "".join(f'<div class="pd-stat rv"><div class="pd-num" dir="ltr">{n}</div><div class="pd-lbl">{l}</div></div>' for n, l in t["stats"])
    layers = "".join(f'<div class="pd-card rv"><div class="pd-knum" dir="ltr">LAYER 0{i+1}</div><h3>{h}</h3><p>{b}</p></div>' for i, (h, b) in enumerate(t["layers"]))
    pillar_name = {k: name for k, _n, name, _d, _w in [(x[0], x[1], x[2], x[3], x[4]) for x in t["pillars"]]}
    pillars = "".join(
        f'<button type="button" class="pd-card pd-pillar rv" data-pillar="{k}" data-name="{name}" data-weeks="{wk}" aria-pressed="false">'
        f'<div class="pd-knum" dir="ltr">{num}</div><h3>{name} <span class="pd-lat" dir="ltr">{PILLAR_LATIN[k]}</span></h3><p>{desc}</p><div class="pd-wk">{wk}</div></button>'
        for k, num, name, desc, wk in t["pillars"])
    rows = "".join(
        f'<div class="pd-sched-row" data-pillar="{WEEK_PILLAR[i]}"><span class="pd-wk-num" dir="ltr">{i+1}</span><span class="pd-wk-title">{m}</span><span class="pd-tag">{pillar_name[WEEK_PILLAR[i]]}</span></div>'
        for i, m in enumerate(p["modules"]))
    band = "".join(
        (f'<div class="pd-band-item"><h3><a href="assessments.html">{h}</a></h3><p>{b}</p></div>' if i == 0 else f'<div class="pd-band-item"><h3>{h}</h3><p>{b}</p></div>')
        for i, (h, b) in enumerate(t["band"]))
    outs = "".join(f'<div class="pd-outcome rv"><span class="pd-tick">✓</span><p>{o}</p></div>' for o in p["outcomes"])
    incl = "".join(f"<li>{x}</li>" for x in t["inclusions"])
    faqs = "".join(f'<div class="faq-item"><button class="faq-q" aria-expanded="false">{q}<span class="arr">+</span></button><div class="faq-a"><div>{a}</div></div></div>' for q, a in t["faq"])
    sub = f'<div class="uname rv" lang="{p["sublang"]}" style="font-size:22px">{p["sub"]}</div>' if p["sub"] else ""
    nf = f'<div class="pd-card pd-who-no rv"><h3>{t["notfor_title"]}</h3><p>{notfor}</p></div>' if notfor else ""
    return f"""<main class="pd-main">
<section class="page-hero light pd-hero"><div class="wrap">
  <span class="eyebrow rv">Flagship Cohort · PLDP</span>
  <h1 class="rv">{p["title"]}</h1>
  <div class="pd-subline rv">{t["tagline"]}</div>
  {sub}
  <div class="pd-chips rv">{_chips(loc, p, t)}</div>
  <figure class="pd-hero-fig rv"><img src="pldp-hero.webp" alt="{t["hero_alt"]}" width="1672" height="941"></figure>
  <p class="lead rv">{p["desc"]}</p>
  <div class="pd-hero-ctas rv"><a class="btn magnetic" href="{wa}" target="_blank" rel="noopener">{t["cta_primary"]}</a><a class="btn ghost magnetic" href="#pd-schedule">{t["cta_schedule"]}</a></div>
  <p class="rv" style="margin-top:16px"><a href="programmes.html" style="color:#1F7A66">{t["back"]}</a></p>
</div></section>
<div class="pd-body">
  <div class="pd-stats-sec"><div class="wrap"><div class="pd-stats">{stats}</div></div></div>
  <section class="pd-sec"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">The Three Layers</span><h2>{t["layers_h"]}</h2><p>{t["layers_p"]}</p></div>
    <div class="pd-cards3">{layers}</div>
  </div></section>
  <section class="pd-sec"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">USWA Framework</span><h2>{t["fw_h"]}</h2><p>{t["fw_p"]}</p></div>
    <div class="pd-cards4">{pillars}</div>
    <p class="pd-pillar-note" id="pdPillarNote" data-tmpl="{t["note_tmpl"]}">{t["note_default"]}</p>
  </div></section>
  <section class="pd-sec" id="pd-schedule"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">The 8 Weeks</span><h2>{t["sched_h"]}</h2><p>{t["sched_p"]}</p></div>
    <div class="pd-sched-card rv">{rows}<a class="pd-sched-strip" href="{wa}" target="_blank" rel="noopener">{t["strip"]}</a></div>
  </div></section>
  <section class="pd-sec"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">Measured Growth</span><h2>{t["growth_h"]}</h2><p>{t["growth_p"]}</p></div>
    <div class="pd-band rv">{band}</div>
    <p class="pd-band-link rv"><a href="assessments.html">{t["band_link"]}</a></p>
  </div></section>
  <section class="pd-sec"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">Outcomes</span><h2>{t["outcomes_h"]}</h2></div>
    <div class="pd-outcomes">{outs}</div>
  </div></section>
  <section class="pd-sec"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">Fees</span><h2>{t["fees_h"]}</h2><p>{t["fees_p"]}</p></div>
    <div class="pd-fees">
      <div class="pd-fee-card pd-fee-early rv"><span class="pd-fee-tag">{t["early_chip"]}</span><div class="pd-fee-name">{t["early_name"]}</div><div class="pd-fee-price" dir="ltr">{_price(loc, early_fee)}</div><ul>{incl}</ul><a class="btn pd-btn-sea" href="{wa}" target="_blank" rel="noopener">{t["early_cta"]}</a></div>
      <div class="pd-fee-card pd-fee-std rv"><div class="pd-fee-name">{t["std_name"]}</div><div class="pd-fee-price" dir="ltr">{_price(loc, std_fee)}</div><ul>{incl}</ul><a class="btn magnetic" href="{wa}" target="_blank" rel="noopener">{t["std_cta"]}</a></div>
    </div>
    <p class="pd-fee-note rv">{t["fee_note"]}</p>
  </div></section>
  <section class="pd-sec"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">Who It Is For</span><h2>{t["who_h"]}</h2></div>
    <div class="pd-who-grid">
      <div class="pd-card rv"><h3>{t["who_title"]}</h3><p>{p["who"]}{t["who_extra"]}</p></div>
      {nf}
    </div>
    <div class="pd-trainer rv"><span class="pd-avatar" dir="ltr">IA</span><p>{t["trainer"]}</p></div>
  </div></section>
  <section class="pd-sec"><div class="wrap">
    <div class="pd-sec-head rv"><span class="eyebrow" dir="ltr">FAQ</span><h2>{t["faq_h"]}</h2></div>
    <div class="pd-faq">{faqs}</div>
  </div></section>
  <div class="pd-final"><div class="wrap rv"><h2>{t["final_h"]}</h2><a class="btn magnetic" href="{wa}" target="_blank" rel="noopener">{t["cta_primary"]}</a></div></div>
</div>
</main>
"""
