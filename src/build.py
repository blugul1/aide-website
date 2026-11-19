#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""AIDE full site — merge step (3 locales).
Each page = head + shared CSS + locale nav + ONE body + locale footer + locale JS.
Edit only the part that owns a change in src/, then re-run:  python3 src/build.py
"""
import pathlib, urllib.parse
import progdata
import profiles
import pldp_page

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
WA_NUM = "923309222029"
JSONLD = '{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://imranaslam.pk/#organization","name":"AIDE — Accelerating Insights and Development for Excellence","url":"https://imranaslam.pk/","logo":"https://imranaslam.pk/aide-logo.png","founder":{"@id":"https://imranaslam.pk/#imran"},"areaServed":[{"@type":"Country","name":"Pakistan"},{"@type":"Country","name":"United Arab Emirates"},{"@type":"Country","name":"Saudi Arabia"},{"@type":"Country","name":"United Kingdom"}]},{"@type":"Person","@id":"https://imranaslam.pk/#imran","name":"Imran Aslam","alternateName":"عمران اسلم","jobTitle":"Life Coach & Trainer","worksFor":{"@id":"https://imranaslam.pk/#organization"},"address":{"@type":"PostalAddress","addressLocality":"Bhimber","addressRegion":"Azad Kashmir","addressCountry":"PK"},"knowsAbout":["Life coaching","Corporate training","NLP","Leadership development","Habit formation","Teacher training"],"sameAs":["https://www.facebook.com/261431087696392","https://www.facebook.com/146472196203279"]}]}'

LOCALES = {
    "en": dict(folder="", lang="en", dir="ltr", bodyclass="", label="EN"),
    "ur": dict(folder="ur", lang="ur", dir="rtl", bodyclass="loc-ur", label="اردو"),
    "ar": dict(folder="ar", lang="ar", dir="rtl", bodyclass="loc-ar", label="ع"),
}
LANGNAMES = {"en": "English", "ur": "اردو", "ar": "العربية"}

TITLES = {
 "en": {"index.html": ("Imran Aslam | Life Coach & Trainer — AIDE", "Coaching, training and honest conversation — from awareness to excellence."),
        "about.html": ("About Imran Aslam — AIDE", "Psychologist (cognitive & behavioural), NLP Master Practitioner and corporate trainer."),
        "programmes.html": ("Programmes — AIDE", "Six signature programmes — Prophetic Leadership, Habit Architecture, Behavioural Sales, Teach With Heart, Strong Homes and RISE — online and on-site."),
        "coaching.html": ("1:1 Coaching — AIDE", "One-to-one coaching and counselling-informed support — online or in Bhimber."),
        "resources.html": ("Resources — AIDE", "AIDE's books, assessment centre and practical tools — free material you can use today."),
        "books.html": ("Books — AIDE", "55 practical books by Imran Aslam — marriage, home, parenting, heart and mind, community and leadership. Opening offer: 20% off everything until 31 December 2026. Read the introduction and first chapter of the first four books free."),
        "assessments.html": ("Assessment Centre — AIDE", "28 short self-assessments — including AIDE's eight signature mirrors, found nowhere else. No labels, no diagnosis; your results stay only in your browser."),
        "writes.html": ("Mani Writes — Reflections by Imran Aslam", "Urdu narrative reflections — the thinking behind the coaching. Stories and questions from twenty years of listening; new writing appears on Mani Writes first."),
        "contact.html": ("Contact — Book a free discovery call — AIDE", "Start with a free 15-minute discovery call on WhatsApp — no obligation. Coaching, programmes and training, online or in Bhimber."), "start.html": ("Start Here — AIDE", "New to AIDE? Find the right door in sixty seconds — coaching, programmes or training for your organisation."), "refund.html": ("Refund & Replacement — AIDE", "How refunds, replacements and exchanges work for AIDE's digital books — plain rules, stated before you buy."), "delivery.html": ("Delivery & Access — AIDE", "How your AIDE book reaches you after payment, how long verification takes, and how to get access again on a new phone."), "terms.html": ("Purchase Terms — AIDE", "What you receive when you buy an AIDE book — the watermark, personal use, prices and payment methods."), "privacy.html": ("Privacy — AIDE", "What AIDE keeps when you browse, take an assessment or buy a book — and what it never does with it.")},
 "ur": {"index.html": ("عمران اسلم | لائف کوچ و ٹرینر — AIDE", "کوچنگ، تربیت اور ایماندارانہ گفتگو — آگاہی سے عمدگی تک۔"),
        "about.html": ("عمران اسلم کا تعارف — AIDE", "ماہرِ نفسیات (علمی و رویہ جاتی)، NLP ماسٹر پریکٹیشنر اور کارپوریٹ ٹرینر۔"),
        "programmes.html": ("پروگرامز — AIDE", "AIDE کے چھ سگنیچر پروگرامز — قیادت، عادات، فروخت، تدریس، گھر اور نوجوانوں کی زندگی کی تعمیر — آن لائن اور موقع پر، افراد، ٹیموں اور اسکولوں کے لیے۔"),
        "coaching.html": ("انفرادی کوچنگ — AIDE", "انفرادی کوچنگ اور کونسلنگ سے آگاہ معاونت — آن لائن یا بھمبر میں۔ عادات، فیصلے، رشتے یا قیادت — پہلا قدم مفت 15 منٹ کی ڈسکوری کال ہے۔"),
        "resources.html": ("وسائل — AIDE", "AIDE کی کتابیں، اسیسمنٹ سینٹر اور عملی اوزار — مفت مواد جو آج ہی استعمال کے قابل ہے۔"),
        "books.html": ("کتابیں — AIDE", "عمران اسلم کی 55 عملی کتابیں — شادی، گھر، والدین، دل و دماغ، کمیونٹی اور قیادت۔ افتتاحی رعایت: 31 دسمبر 2026 تک ہر چیز پر 20%۔ پہلی چار کتابوں کی تمہید اور پہلا باب مفت پڑھیں۔"),
        "assessments.html": ("اسیسمنٹ سینٹر — AIDE", "28 مختصر خود جائزے — جن میں AIDE کے آٹھ دستخطی آئینے بھی ہیں، جو کہیں اور نہیں ملتے۔ بغیر لیبل، بغیر تشخیص؛ نتائج صرف آپ کے براؤزر میں رہتے ہیں۔"),
        "writes.html": ("مانی رائیٹس — عمران اسلم کی تحریریں", "اردو داستانی تاثرات — کوچنگ کے پیچھے کی سوچ۔ کہانیاں، منظر اور ایماندار سوالات، بیس برس کی سننے کی مشق سے؛ نئی تحریریں پہلے مانی رائیٹس پر۔"),
        "contact.html": ("رابطہ — مفت ڈسکوری کال — AIDE", "وٹس ایپ پر مفت 15 منٹ ڈسکوری کال سے آغاز کریں — بغیر کسی پابندی کے۔ انفرادی کوچنگ، پروگرامز اور تربیت — آن لائن یا بھمبر میں۔"), "start.html": ("یہاں سے شروع کریں — AIDE", "AIDE میں نئے ہیں؟ ساٹھ سیکنڈ میں درست راستہ تلاش کریں — کوچنگ، پروگرامز یا اپنے ادارے کی تربیت۔"), "refund.html": ("واپسی و تبدیلی — AIDE", "AIDE کی ڈیجیٹل کتابوں پر رقم کی واپسی، تبدیلی اور ایکسچینج کے سادہ اصول — خرید سے پہلے واضح۔"), "delivery.html": ("ترسیل و رسائی — AIDE", "ادائیگی کے بعد آپ کی کتاب آپ تک کیسے پہنچتی ہے، تصدیق میں کتنا وقت لگتا ہے، اور نئے فون پر رسائی دوبارہ کیسے ملتی ہے۔"), "terms.html": ("خرید کی شرائط — AIDE", "AIDE کی کتاب خریدنے پر آپ کو کیا ملتا ہے — واٹر مارک، ذاتی استعمال، قیمتیں اور ادائیگی کے طریقے۔"), "privacy.html": ("رازداری — AIDE", "ویب سائٹ دیکھنے، اسیسمنٹ کرنے یا کتاب خریدنے پر AIDE کیا معلومات رکھتا ہے — اور آپ کی تفصیل کے ساتھ کیا کبھی نہیں کرتا۔")},
 "ar": {"index.html": ("عمران أسلم | مدرّب حياة ومدرّب — AIDE", "توجيه وتدريب ومحادثة صادقة — من الوعي إلى التميز."),
        "about.html": ("عن عمران أسلم — AIDE", "أخصائي نفسي (معرفي وسلوكي)، ممارس متقدم في NLP، ومدرّب شركات. عشرون عامًا من التدريب والتوجيه في بيمبر وعبر الإنترنت — من الوعي إلى التميز."),
        "programmes.html": ("البرامج — AIDE", "برامج AIDE الستة المميزة — القيادة والعادات والمبيعات والتدريس والبيت وتصميم حياة الشباب — عبر الإنترنت وفي الموقع، للأفراد والفرق والمدارس."),
        "coaching.html": ("توجيه فردي — AIDE", "توجيه فردي ودعم مستنير بالإرشاد — عبر الإنترنت أو في بهمبر. العادات والقرارات والعلاقات والقيادة — ابدأ بمكالمة استكشاف مجانية."),
        "resources.html": ("الموارد — AIDE", "كتب AIDE ومركز التقييم والأدوات العملية — مواد مجانية يمكنك استخدامها اليوم."),
        "books.html": ("الكتب — AIDE", "55 كتابًا عمليًا لعمران أسلم — الزواج والبيت والوالدية والقلب والعقل والمجتمع والقيادة. عرض الافتتاح: خصم 20% على كل شيء حتى 31 ديسمبر 2026. اقرأ مقدمة الكتب الأربعة الأولى وفصلها الأول مجانًا."),
        "assessments.html": ("مركز التقييم — AIDE", "28 تقييمًا ذاتيًا قصيرًا — منها مرايا AIDE الثماني المميزة التي لا توجد في أي مكان آخر. بلا وُسوم، بلا تشخيص؛ نتائجك تبقى في متصفحك وحدك."),
        "writes.html": ("ماني رايتس — كتابات عمران أسلم", "تأملات قصصية بالأردية — الفكر الذي خلف التوجيه. قصص ومشاهد وأسئلة صادقة من عشرين عامًا من الإصغاء؛ الكتابات الجديدة تظهر أولًا على ماني رايتس."),
        "contact.html": ("اتصال — مكالمة استكشاف مجانية — AIDE", "ابدأ بمكالمة استكشاف مجانية لخمس عشرة دقيقة على واتساب — دون أي التزام. توجيه وبرامج وتدريب، عبر الإنترنت أو في بهمبر."), "start.html": ("ابدأ من هنا — AIDE", "جديد في AIDE؟ اعثر على الباب الصحيح في ستين ثانية — توجيه أو برامج أو تدريب لمؤسستك."), "refund.html": ("الاسترداد والاستبدال — AIDE", "قواعد بسيطة وواضحة لاسترداد كتب AIDE الرقمية واستبدالها وتبديلها — معلنة قبل الشراء."), "delivery.html": ("التسليم والوصول — AIDE", "كيف يصلك كتابك من AIDE بعد الدفع، وكم يستغرق التحقق، وكيف تستعيد الوصول على هاتف جديد."), "terms.html": ("شروط الشراء — AIDE", "ماذا تحصل عليه عند شراء كتاب من AIDE — العلامة المائية، والاستخدام الشخصي، والأسعار وطرق الدفع."), "privacy.html": ("الخصوصية — AIDE", "ما الذي يحتفظ به AIDE عند تصفحك أو إجراء تقييم أو شراء كتاب — وما لا يفعله أبدًا ببياناتك.")},
}

DETAIL_TXT = {
 "en": dict(cover="What you will cover", outcomes="By the end, you will be able to", format="The format", who="Who it is for", ask="Ask about this programme", back="← All programmes", notfor="Who it is not for", fee="Fees & dates", fee_p="Runs in cohorts. The fee and the next cohort's dates are confirmed in writing on the free discovery call — before any payment, and with no obligation to enrol.", fee_p2="Cohort dates are announced as each cohort opens, and your place is confirmed in writing before any payment."),
 "ur": dict(cover="اس میں کیا شامل ہے", outcomes="اختتام پر آپ قابل ہوں گے کہ", format="فارمیٹ", who="کس کے لیے", ask="اس پروگرام کے بارے میں پوچھیں", back="→ تمام پروگرامز", notfor="کس کے لیے نہیں", fee="فیس اور تاریخیں", fee_p="کوہورٹ کی صورت میں چلتا ہے۔ فیس اور اگلے کوہورٹ کی تاریخیں مفت ڈسکوری کال پر تحریری طور پر واضح کی جاتی ہیں — کسی ادائیگی سے پہلے، اور داخلے کی کوئی پابندی نہیں۔", fee_p2="تاریخیں ہر کوہورٹ کے اعلان کے ساتھ آتی ہیں، اور آپ کی جگہ کسی ادائیگی سے پہلے تحریری طور پر کنفرم ہوتی ہے۔"),
 "ar": dict(cover="ماذا ستغطي", outcomes="في الختام، ستكون قادرًا على", format="الصيغة", who="لمن هذا البرنامج", ask="اسأل عن هذا البرنامج", back="→ كل البرامج", notfor="لمن لا يناسبه", fee="الرسوم والتواريخ", fee_p="يُقدَّم على دفعات. تُوضَّح الرسوم وتواريخ الدفعة القادمة كتابةً في مكالمة الاستكشاف المجانية — قبل أي دفع، ودون أي التزام بالتسجيل.", fee_p2="تُعلَن تواريخ كل دفعة عند فتحها، ويُؤكَّد مكانك كتابةً قبل أي دفع."),
}

def wa_link(msg):
    return f"https://wa.me/{WA_NUM}?text=" + urllib.parse.quote(msg)

def langswitch(loc, page):
    out = []
    for other in ["en", "ur", "ar"]:
        if other == loc:
            href = page
        elif loc == "en":
            href = f"{other}/{page}"
        elif other == "en":
            href = f"../{page}"
        else:
            href = f"../{other}/{page}"
        out.append((other, href))
    desk = "\n".join(f'<a href="{h}">{LANGNAMES[o]}</a>' for o, h in out)
    mob = '<span class="mm-lang">' + "".join(f'<a href="{h}">{LANGNAMES[o]}</a>' for o, h in out) + "</span>"
    return desk, mob

def detail_body(loc, p):
    t = DETAIL_TXT[loc]
    mods = "".join(f"<li>{m}</li>" for m in p["modules"])
    outs = "".join(f"<li>{o}</li>" for o in p["outcomes"])
    note = f'<div class="note rv" style="margin-top:22px">{p["note"]}</div>' if p["note"] else ""
    _nf = progdata.NOTFOR.get(loc, {}).get(p["slug"], "")
    nf = f'<div class="notfor rv"><h3>{t["notfor"]}</h3><p>{_nf}</p></div>' if _nf else ""
    sub = f'<div class="uname" lang="{p["sublang"]}" style="font-size:22px">{p["sub"]}</div>' if p["sub"] else ""
    fee_html = f'<p class="fee-line">{p["fee"]}</p><p>{t["fee_p2"]}</p>' if p.get("fee") else f'<p>{t["fee_p"]}</p>' 
    return f"""<main>
<section class="page-hero"><div class="wrap">
  <span class="eyebrow rv">{p["fmt"]}</span>
  <h1 class="rv">{p["title"]}</h1>
  {sub}
  <p class="lead rv">{p["desc"]}</p>
  {("<img class=\"ph-img rv\" src=\"" + p["photo"] + "\" alt=\"" + p["title"] + "\">") if p.get("photo") else ""}
  <p class="rv" style="margin-top:14px"><a href="programmes.html" style="color:var(--sea2)">{t["back"]}</a></p>
</div></section>
<section style="padding-top:14px"><div class="wrap detail-grid">
  <div>
    <div class="sec-head rv"><h2 style="font-size:30px">{t["cover"]}</h2></div>
    <ol class="mod-grid rv">{mods}</ol>
    <div class="sec-head rv" style="margin-top:34px"><h2 style="font-size:30px">{t["outcomes"]}</h2></div>
    <ul class="out-list rv">{outs}</ul>
    {note}
    {nf}
  </div>
  <aside class="fact-box rv">
    <h4>{t["format"]}</h4><p>{p["fact"]}</p>
    <h4>{t["who"]}</h4><p>{p["who"]}</p>
    <h4>{t["fee"]}</h4>{fee_html}
    <a class="btn magnetic" href="{wa_link(p["wa"])}" target="_blank" rel="noopener">{t["ask"]}</a>
  </aside>
</div></section>
</main>
"""


def profile_body(loc, person):
    t = profiles.PROFILE_TXT[loc]
    stats_html = ""
    if person.get("stats"):
        cells = "".join(f'<div class="stat"><b>{n}</b><span>{u}</span></div>' for n, u in person["stats"])
        stats_html = f'<section style="padding-top:0"><div class="wrap"><div class="stats pstats rv">{cells}</div></div></section>\n'
    paras = "".join(f"<p>{x}</p>" for x in person["intro"])
    exps = "".join(f"<li>{e}</li>" for e in person["exp"])
    rel_label, rel_href = person["rel"]
    ext = ' target="_blank" rel="noopener"' if rel_href.startswith("http") else ""
    return f"""<main>
<section class="page-hero"><div class="wrap">
  <span class="eyebrow rv">{person["role"]}</span>
  <h1 class="rv">{person["name"]}</h1>
  <p class="lead rv">{person["lead"]}</p>
  <img class="ph-img rv" src="{person["photo"]}" alt="{person["name"]}">
  <p class="rv" style="margin-top:14px"><a href="index.html#team" style="color:var(--sea2)">{t["back"]}</a></p>
</div></section>
{stats_html}<section style="padding-top:14px"><div class="wrap detail-grid">
  <div>
    <div class="sec-head rv"><h2 style="font-size:30px">{t["about"]}</h2></div>
    <div class="prose rv">{paras}</div>
    <div class="sec-head rv" style="margin-top:34px"><h2 style="font-size:30px">{t["exp"]}</h2></div>
    <ul class="out-list rv">{exps}</ul>
  </div>
  <aside class="fact-box rv">
    <h3>{t["services"]}</h3><p>{person["field"]}</p>
    <a class="btn magnetic" href="{wa_link(person["wa"])}" target="_blank" rel="noopener">{t["book"]} {person["name"]}</a>
    <p class="bp-note2">{t["next"]}</p>
    <h3 style="margin-top:22px">{t["rel"]}</h3><p><a href="{rel_href}"{ext} style="color:var(--sea2)">{rel_label}</a></p>
  </aside>
</div></section>
</main>
"""

def programmes_body(loc):
    t = DETAIL_TXT[loc]
    heads = {"en": ("Programmes", "Six ways in.", "Signature programmes built from real practice, not theory. Admissions open in cohorts — fees and dates are confirmed on the free discovery call, in writing, before anything is charged."),
             "ur": ("پروگرامز", "چھ راستے۔", "سگنیچر پروگرامز اصل مشق سے بنے ہیں، نظریے سے نہیں۔ داخلے کوہورٹ کی صورت میں کھلتے ہیں — فیس اور تاریخیں مفت ڈسکوری کال پر تحریری طور پر واضح کی جاتی ہیں، کسی بھی وصولی سے پہلے۔"),
             "ar": ("البرامج", "ستة طرق للدخول.", "برامج مميزة مبنية على ممارسة حقيقية، لا على نظريات. يفتح القبول على دفعات — وتُوضَّح الرسوم والتواريخ في مكالمة الاستكشاف المجانية، كتابةً، قبل تحصيل أي شيء.")}
    ey, h1, lead = heads[loc]
    ATOMIC_PROG = {"ur": "AIDE کے چھ سگنیچر پروگرامز طے شدہ فارمیٹ، براہِ راست سیشنز اور عملی مشق والے کورسز ہیں — اسوۂ نبوی پر قیادت (USWA)، عادت کی تبدیلی، رویہ جاتی فروخت، اساتذہ کی جذباتی ذہانت، مضبوط گھر اور نوجوانوں کی زندگی کا نقشہ۔ ہر پروگرام پاکستان و خلیج کی اصل مشق سے بنا ہے اور تالیف سے نہیں، رویّے کی تبدیلی سے ناپا جاتا ہے۔", "ar": "برامج AIDE الستة المميزة دورات منظمة بصيغ ثابتة وجلسات مباشرة وتطبيق عملي — القيادة على النموذج النبوي (USWA)، وتغيير العادات، والبيع السلوكي، والذكاء العاطفي للمعلمين، والبيوت القوية، وتصميم حياة الشباب. كل برنامج مبني على ممارسة حقيقية في باكستان والخليج، ويُقاس بتغيّر السلوك لا بالتصفيق."}
    blocks = []
    for p in progdata.PROGS[loc]:
        mods = "".join(f"<li>{m}</li>" for m in p["modules"][:4])
        sub = f'<div class="uname" lang="{p["sublang"]}">{p["sub"]}</div>' if p["sub"] else ""
        bcls = "btn magnetic" if p["slug"] == "pldp" else "btn ghost magnetic"
        blocks.append(f"""<div class="prog rv"><div class="row"><div>
    <span class="fmt">{p["fmt"]}</span><h2><a href="programme-{p["slug"]}.html" style="color:inherit;text-decoration:none">{p["title"]}</a></h2>{sub}
    <p>{p["desc"]}</p>{("<p class=\"fee-line\">" + p["fee"] + "</p>") if p.get("fee") else ""}<ul>{mods}</ul>
  </div><div class="side"><a class="{bcls}" href="{wa_link(p["wa"])}" target="_blank" rel="noopener">{t["ask"]}</a></div></div></div>""")
    return f"""<main>
<section class="page-hero"><div class="wrap">
  <span class="eyebrow rv">{ey}</span>
  <h1 class="rv">{h1}</h1>
  <p class="lead rv">{lead}</p>
  <img class="ph-img rv" src="aide-programmes.webp" alt="Imran Aslam on stage">
</div></section>
{("<section style=\"padding-top:26px\"><div class=\"wrap\"><div class=\"atomic rv\"><p>" + ATOMIC_PROG[loc] + "</p></div></div></section>") if loc in ATOMIC_PROG else ""}
<section style="padding-top:22px"><div class="wrap">
{chr(10).join(blocks)}
</div></section>
</main>
"""

css_base = (SRC / "css.css").read_text(encoding="utf-8") + "\n" + (SRC / "pages.css").read_text(encoding="utf-8") + "\n" + (SRC / "pages2.css").read_text(encoding="utf-8")
js_base = (SRC / "js.js").read_text(encoding="utf-8")

def js_for(loc):
    s = js_base
    for tag, fname in [("PROGS", f"progs-{loc}.js"), ("QUIZ", f"quiz-{loc}.js")]:
        data = (SRC / "i18n" / fname).read_text(encoding="utf-8").strip()
        a = s.index(f"/*DATA:{tag}*/"); b = s.index("/*/DATA*/", a) + len("/*/DATA*/")
        s = s[:a] + data + s[b:]
    if loc == "ur":
        s = s.replace("'Assalam-o-Alaikum! I want details about the AIDE programme: '", "'السلام علیکم! مجھے AIDE پروگرام کی تفصیلات چاہئیں: '")
        s = s.replace("'Assalam-o-Alaikum! I took the AIDE self-check on the website. My result: \"'", "'السلام علیکم! میں نے ویب سائٹ پر AIDE سیلف چیک کیا۔ میرا نتیجہ: \"'")
        s = s.replace("'\". I would like the free 15-minute discovery call.'", "'\"۔ مجھے مفت 15 منٹ کی ڈسکوری کال چاہیے۔'")
    if loc == "ar":
        s = s.replace("'Assalam-o-Alaikum! I want details about the AIDE programme: '", "'السلام عليكم! أريد تفاصيل عن برنامج AIDE: '")
        s = s.replace("'Assalam-o-Alaikum! I took the AIDE self-check on the website. My result: \"'", "'السلام عليكم! أجريت الفحص الذاتي في موقع AIDE. نتيجتي: \"'")
        s = s.replace("'\". I would like the free 15-minute discovery call.'", "'\". أرغب في مكالمة الاستكشاف المجانية لمدة 15 دقيقة.'")
    return s

import re
MAIN_PAGES = ["about.html", "programmes.html", "coaching.html", "resources.html", "books.html", "assessments.html", "writes.html", "contact.html", "start.html", "refund.html", "delivery.html", "terms.html", "privacy.html"]
BODY_FILE = {"index.html": "home.html", "about.html": "about.html", "programmes.html": "programmes.html", "coaching.html": "coaching.html", "resources.html": "resources.html", "books.html": "books.html", "assessments.html": "assessments.html", "writes.html": "writes.html", "contact.html": "contact.html", "start.html": "start.html", "refund.html": "refund.html", "delivery.html": "delivery.html", "terms.html": "terms.html", "privacy.html": "privacy.html"}

# Assessment Centre app: assets exist only for assessments.html (injected by assemble()).
# Brand fonts, per locale (owner decision 2026-11-13: UR-D / AR-B / EN-B).
# Plus Jakarta Sans stays on every locale: it is the assessments-app font.
_FONT_PRE = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
FONT_LINKS = {
    "en": _FONT_PRE + '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600;700;800&family=Open+Sans:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">',
    "ur": _FONT_PRE + '<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">',
    "ar": _FONT_PRE + '<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;700&family=Noto+Sans+Arabic:wght@500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">',
}
AC_JS = (SRC / "ac-app.js").read_text(encoding="utf-8") if (SRC / "ac-app.js").exists() else ""
# Booking popup: assets exist only for coaching.html (injected by assemble()).
BK_CSS = (SRC / "booking-popup.css").read_text(encoding="utf-8") if (SRC / "booking-popup.css").exists() else ""
BK_JS = (SRC / "booking-popup.js").read_text(encoding="utf-8") if (SRC / "booking-popup.js").exists() else ""

for loc, cfg in LOCALES.items():
    srcdir = SRC if loc == "en" else SRC / loc
    nav = (srcdir / "nav.html").read_text(encoding="utf-8")
    footer = (srcdir / "footer.html").read_text(encoding="utf-8")
    js = js_for(loc)
    css = css_base
    prefix = "" if loc == "en" else "../"
    if prefix:
        css = css.replace("url('", "url('../")
    outdir = ROOT / cfg["folder"] if cfg["folder"] else ROOT
    outdir.mkdir(parents=True, exist_ok=True)

    def assemble(page, body):
        title, desc = TITLES[loc].get(page, (f"{page} — AIDE", ""))
        desk, mob = langswitch(loc, page)
        n = nav.replace("<!--LANGSWITCH-->", desk).replace("<!--LANGSWITCH-M-->", mob)
        key = page.replace("index.html", "").replace(".html", "")
        if key and f'data-nav="{key}"' in n:
            n = n.replace(f'data-nav="{key}"', f'data-nav="{key}" class="act"')
        if page.startswith("programme-"):
            n = n.replace('data-nav="programmes"', 'data-nav="programmes" class="act"')
        if page in ("books.html", "assessments.html"):
            n = n.replace('data-nav="resources"', 'data-nav="resources" class="act"')
        b = body
        if prefix:
            b = b.replace('src="', 'src="../').replace('href="index.html', 'href="index.html')
        f = footer
        page_css = css + ("\n" + BK_CSS if page == "coaching.html" and BK_CSS else "")
        canon = "https://imranaslam.pk/" + ("" if loc == "en" else loc + "/") + page
        html = f"""<!DOCTYPE html>
<html lang="{cfg['lang']}" dir="{cfg['dir']}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" type="image/png" href="{prefix}aide-logo.png">
<link rel="canonical" href="{canon}">
<link rel="alternate" hreflang="en" href="https://imranaslam.pk/{page}">
<link rel="alternate" hreflang="ur" href="https://imranaslam.pk/ur/{page}">
<link rel="alternate" hreflang="ar" href="https://imranaslam.pk/ar/{page}">
<link rel="alternate" hreflang="x-default" href="https://imranaslam.pk/{page}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="https://imranaslam.pk/og-cover.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://imranaslam.pk/og-cover.jpg">
<script type="application/ld+json">{JSONLD}</script>
{FONT_LINKS[loc]}
<style>
{page_css}
</style>
</head>
<body class="{cfg['bodyclass']}">
<noscript><style>body{{opacity:1}}</style></noscript>
<div id="progress" aria-hidden="true"></div>
<div class="aurora" aria-hidden="true"><div class="orb sea"></div><div class="orb deep"></div><div class="orb bronze"></div></div>
{n}
{b}
{f}
<button class="toTop2" id="toTop2" type="button" aria-label="Back to the top">↑</button>
<script>
{js}
</script>
{("<script>\n" + AC_JS + "</script>") if page == "assessments.html" and AC_JS else ""}
{("<script>\n" + BK_JS + "</script>") if page == "coaching.html" and BK_JS else ""}
</body>
</html>
"""
        html = html.replace('id="sceneImg"', 'id="sceneImg" data-keep-eager="1"')
        def _lazy(m):
            tag = m.group(0)
            if "loading=" in tag or "data-keep-eager" in tag:
                return tag
            return tag.replace("<img ", '<img loading="lazy" decoding="async" ', 1)
        segs = re.split(r'(<figure class="panel">.*?</figure>)', html, flags=re.S)
        html = "".join(seg if seg.startswith('<figure class="panel">') else re.sub(r'<img [^>]*>', _lazy, seg) for seg in segs)
        html = html.replace(' data-keep-eager="1"', '')
        (outdir / page).write_text(html, encoding="utf-8")
        return len(html)

    for page in MAIN_PAGES:
        if page == "programmes.html" and loc != "en":
            body = programmes_body(loc)
        else:
            body = (srcdir / BODY_FILE[page]).read_text(encoding="utf-8")
        print(loc, page, assemble(page, body))
    for person in profiles.PROFILES[loc]:
        page = f"team-{person['slug']}.html"
        TITLES[loc][page] = (f"{person['name']} — AIDE", person["lead"][:150])
        print(loc, page, assemble(page, profile_body(loc, person)))
    for p in progdata.PROGS[loc]:
        page = f"programme-{p['slug']}.html"
        TITLES[loc][page] = (f"{p['title']} — AIDE", p["desc"][:150])
        if p["slug"] == "pldp":
            _body = pldp_page.body(loc, p, progdata.NOTFOR.get(loc, {}).get("pldp", ""))
        else:
            _body = detail_body(loc, p)
        print(loc, page, assemble(page, _body))
