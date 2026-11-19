#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate src/ur/books.html — the full 55-book catalogue — from the approved
card data (book-cards-data.json). The 4 long detail sections, the author CTA,
the web reader and the 4 embedded samples are preserved verbatim from the
frozen original (ur-books-orig.html), with only their price lines and format
chips updated to the final price list.

Re-run:  python3 src/books_gen/build_books.py   (then python3 src/build.py)
"""
import html
import json
import pathlib
import urllib.parse

GEN = pathlib.Path(__file__).resolve().parent
SRC = GEN.parent
ROOT = SRC.parent
DATA = pathlib.Path.home() / "workspace/files/book-pricing-2026-11-12/book-cards-data.json"
CHAPTERS = pathlib.Path.home() / "workspace/files/book-pricing-2026-11-12/book-chapters-data.json"
ORIG = GEN / "ur-books-orig.html"
OUT = SRC / "ur" / "books.html"

WA = "https://wa.me/923309222029?text="


def fmt(n):
    return f"{n:,}"


def wa_link(msg):
    return WA + urllib.parse.quote(msg)


def esc(s):
    return html.escape(str(s), quote=True)


d = json.loads(DATA.read_text(encoding="utf-8"))
books = sorted(d["books"], key=lambda b: b["n"])
chapters = {b["n"]: b for b in json.loads(CHAPTERS.read_text(encoding="utf-8"))["books"]}
bundles = d["bundles"]
grouping = d["grouping"]

BUNDLE_BY_NAME = {b["name"]: b for b in bundles}
BUNDLE_KEY = {
    "پہلی چار کتابیں (ابتدائی سیٹ)": "bnd-starter",
    "شادی مجموعہ": "bnd-shadi",
    "والدین مجموعہ": "bnd-walidain",
    "گھر، رشتے اور کردار": "bnd-ghar",
    "دل، ذہن اور زمانہ": "bnd-dil",
    "کمیونٹی و فلاح": "bnd-community",
    "قیادت سیریز": "bnd-qiyadat",
    "مکمل کیٹلاگ": "bnd-full",
}
CLUSTER_SLUG = {
    "شادی مجموعہ": "shadi",
    "گھر، رشتے اور کردار": "ghar",
    "والدین مجموعہ": "walidain",
    "دل، ذہن اور زمانہ": "dil",
    "کمیونٹی و فلاح": "community",
    "قیادت سیریز": "qiyadat",
}
CLUSTER_INTRO = {
    "شادی مجموعہ": "نکاح سے پہلے کی گفتگوئیں، شادی کا پہلا سال، رشتے کی تلاش، تاخیر، علیحدگی کے بعد کا سفر اور شادی کی آسانیاں۔",
    "گھر، رشتے اور کردار": "گھر کی رہنمائی، حِلم، مالی سکون، سسرال، بات چیت کے آداب، شکر و مودت، معذرت، حسد، اصلاح اور رشتہ داروں کے حقوق۔",
    "والدین مجموعہ": "بچے کا غصہ، پہلے پانچ سال، سکول کا دور، نوعمری، بیٹی و بیٹے کی تربیت، اکلوتا بچہ، خصوصی ضروریات اور دادا دادی۔",
    "دل، ذہن اور زمانہ": "قیادت بطورِ امانت، ذہنی تھکاوٹ، باہر کے کام، بحران کے بعد کی شروعات، مردانہ بوجھ، اسکرین، سوشل میڈیا، نوجوان، ثقافت، خوراک، عبادت اور بحران میں خاندان۔",
    "کمیونٹی و فلاح": "تہوار و تقریبات، خاندانی دستاویزات، بڑھاپے کی دہلیز، محلہ و مہمان نوازی، کفالتِ یتیم، زکوٰۃ و صدقات اور گھریلو ملازمین کے حقوق۔",
    "قیادت سیریز": "سیلز کا فن، کارپوریٹ کلچر، بزنس قیادت، ٹیم سازی اور گاہک کا اعتماد — عرفان اسلم و عمران اسلم کی مشترکہ سیریز۔",
}

# ---- frozen original: preserve detail sections + reader + samples verbatim ----
if not ORIG.exists():
    ORIG.write_text((SRC / "ur" / "books.html").read_text(encoding="utf-8"), encoding="utf-8")
orig = ORIG.read_text(encoding="utf-8")
i_detail = orig.index('<section class="book-sec" id="book1"')
i_tail = orig.index('<section style="padding-top:8px">')
detail = orig[i_detail:i_tail]
tail = orig[i_tail:]

# Price lines + format chips in the 4 detail sections (final price list).
OPENING = {1: (792, 990), 2: (712, 890), 3: (1032, 1290), 4: (952, 1190)}
for n, (op, reg) in OPENING.items():
    old = f'<p class="bk-price rv">قیمت: {fmt(reg)} روپے</p>'
    assert old in detail, f"price line missing for book {n}"
    new = (f'<p class="bk-price rv js-price" data-fmt="sentence" data-loc="ur" data-regular="{reg}" data-opening="{op}">افتتاحی قیمت: {fmt(op)} روپے (14 نومبر تا 31 دسمبر 2026) · '
           f'معمول کی قیمت: {fmt(reg)} روپے</p>\n    '
           f'<p class="bk-note rv">قیمت میں پرنٹ و موبائل پی ڈی ایف، EPUB، DOCX اور مفت مشق نامہ شامل ہے۔</p>')
    detail = detail.replace(old, new, 1)
assert detail.count('<span class="chip">EPUB</span>') == 4
detail = detail.replace('<span class="chip">EPUB</span>',
                        '<span class="chip">EPUB</span><span class="chip">DOCX</span><span class="chip">مشق نامہ مفت</span>')

# ---- detail sections for books 5-55 (packs verified complete 2026-11-17: ----
# ---- every final-pack holds print + mobile PDFs, EPUB and DOCX). Follows ----
# ---- the books 1-4 section pattern: cover, title, subtitle promise, the ----
# ---- verified card copy as the descriptive paragraph, full contents from ----
# ---- the chapter JSON, format chips, cart + WhatsApp actions, js-price. ----
def toc_html(n):
    lis = []
    for it in chapters[n]["items"]:
        t = it["title"]
        if it["kind"] == "appendix":
            t = "ضمیمہ: " + t
        if it.get("closing_note"):
            t += f" (اختتامی: {it['closing_note']})"
        lis.append(f"      <li>{esc(t)}</li>")
    return "\n".join(lis)


def detail_section(b):
    n = b["n"]
    return f"""<section class="book-sec" id="book{n}"><div class="wrap bk-grid">
  <div class="bk-cover rv"><img src="covers/b{n}.webp" alt="{esc(b["title"])} کا سرورق"></div>
  <div class="bk-main">
    <span class="k rv">اردو · AIDE کتب</span>
    <h2 class="rv">{esc(b["title"])}</h2>
    <p class="bk-promise rv">{esc(b["subtitle"])}</p>
    <h3 class="bk-h rv">کس کے لیے</h3>
    <p class="bk-who rv">{esc(b["copy"])}</p>
    <h3 class="bk-h rv">اندر کیا ہے</h3>
    <ol class="bk-toc rv">
{toc_html(n)}
    </ol>
    <h3 class="bk-h rv">فارمیٹس</h3>
    <div class="chips rv"><span class="chip">Print PDF</span><span class="chip">Mobile PDF</span><span class="chip">EPUB</span><span class="chip">DOCX</span><span class="chip">مشق نامہ مفت</span></div>
    <div class="bk-actions rv">
      <button class="btn magnetic cart-add" type="button" data-add="{n}">کارٹ میں ڈالیں</button>
      <a class="btn ghost magnetic" href="{wa_link(f'السلام علیکم! مجھے کتاب «{b["title"]}» حاصل کرنی ہے۔')}" target="_blank" rel="noopener">کتاب حاصل کریں</a>
    </div>
    <p class="bk-price rv js-price" data-fmt="sentence" data-loc="ur" data-regular="{b["price"]}" data-opening="{b["opening_price"]}">افتتاحی قیمت: {fmt(b["opening_price"])} روپے (14 نومبر تا 31 دسمبر 2026) · معمول کی قیمت: {fmt(b["price"])} روپے</p>
    <p class="bk-note rv">قیمت میں پرنٹ و موبائل پی ڈی ایف، EPUB، DOCX اور مفت مشق نامہ شامل ہے۔</p>
  </div>
</div></section>

"""


for b in books:
    if b["n"] >= 5:
        assert b["n"] in chapters and chapters[b["n"]]["items"], f"no chapter data for book {b['n']}"
        detail += detail_section(b)

# ---- hero + opening banner + jump nav ----
hero = """<main>
<section class="page-hero light"><div class="wrap">
  <span class="eyebrow rv">کتابیں</span>
  <h1 class="rv">کتابیں جو گھر بدلتی ہیں</h1>
  <p class="lead rv">55 کتابیں — شادی، گھر، والدین، دل و دماغ، کمیونٹی اور قیادت۔ ہر کتاب اصل کوچنگ کمروں اور پاکستانی گھروں سے لکھی گئی ہے — نہ درآمد شدہ نظریہ، نہ خطیبانہ لہجہ۔ پہلی چار کتابوں کی تمہید اور پہلا باب یہیں مفت پڑھیں۔</p>
</div></section>

<section style="padding-top:6px"><div class="wrap">
  <div class="bk-open rv" data-open-only><b>افتتاحی رعایت — 14 نومبر تا 31 دسمبر 2026:</b> ہر کتاب اور ہر مجموعے پر 20% رعایت۔ مجموعوں پر یہ رعایت مستقل 40% رعایت کے اوپر ہے۔ 1 جنوری 2027 سے معمول کی قیمتیں لاگو ہوں گی۔</div>
  <nav class="bk-jump rv" aria-label="کیٹلاگ کے حصے">
    <a href="#bundles">مجموعے</a><a href="#gift">تحفہ</a><a href="#cat-shadi">شادی</a><a href="#cat-ghar">گھر و رشتے</a><a href="#cat-walidain">والدین</a><a href="#cat-dil">دل و ذہن</a><a href="#cat-community">کمیونٹی</a><a href="#cat-qiyadat">قیادت</a><a href="#faq">سوالات</a><a href="#book1">تفصیل</a>
  </nav>
</div></section>
"""

# ---- bundles ----
bundle_cards = []
for b in bundles:
    key = BUNDLE_KEY[b["name"]]
    members = b["members"]
    if members == "all":
        count = 55
        indiv = sum(x["price"] for x in books)
        member_titles = None
    else:
        count = len(members)
        by_n = {x["n"]: x for x in books}
        indiv = sum(by_n[n]["price"] for n in members)
        member_titles = [by_n[n]["title"] for n in members]
    saving = indiv - b["opening_price"]
    pb_open = int(b["opening_price"] / count + 0.5)  # round-half-up, matches JS Math.round
    featured = ' bk-bundle-feat' if key == "bnd-full" else ""
    titles_html = ""
    if member_titles:
        lis = "".join(f"<li>{esc(t)}</li>" for t in member_titles)
        titles_html = f'<details class="bk-bundle-titles"><summary>شامل کتابیں دیکھیں</summary><ul>{lis}</ul></details>'
    else:
        titles_html = '<p class="bk-bundle-all">کیٹلاگ کی تمام 55 کتابیں — چھوں موضوعاتی حصوں سمیت۔</p>'
    bundle_cards.append(f"""<article class="bk-bundle rv{featured}">
    <h3>{esc(b["name"])}</h3>
    <p class="bk-bundle-count">{count} کتابیں</p>
    {titles_html}
    <div class="js-bundle" data-indiv="{indiv}" data-regular="{b["price"]}" data-opening="{b["opening_price"]}" data-count="{count}">
    <p class="bk-bundle-sums">انفرادی مجموعہ: <s>{fmt(indiv)} روپے</s> · مجموعے کی قیمت: {fmt(b["price"])} روپے · افتتاحی بچت: {fmt(saving)} روپے</p>
    <p class="bk-bundle-price"><b>{fmt(b["opening_price"])} روپے</b> <span>افتتاحی قیمت — 31 دسمبر 2026 تک</span></p>
    <p class="bk-perbook">تقریباً <b>{fmt(pb_open)} روپے</b> فی کتاب</p>
    </div>
    <p class="bk-bundle-note">ہر کتاب کے ساتھ مفت مشق نامہ بھی شامل ہے۔</p>
    <div class="bk-actions">
      <button class="btn magnetic cart-add-bundle" type="button" data-bundle="{key}">مجموعہ کارٹ میں ڈالیں</button>
      <a class="btn ghost magnetic js-wa" data-kind="bundle" data-wa-title="{esc(b["name"])}" data-regular="{b["price"]}" data-opening="{b["opening_price"]}" href="{wa_link(f'السلام علیکم! مجھے مجموعہ «{b["name"]}» حاصل کرنا ہے۔ افتتاحی قیمت {fmt(b["opening_price"])} روپے۔')}" target="_blank" rel="noopener">واٹس ایپ پر حاصل کریں</a>
    </div>
  </article>""")
bundles_html = f"""<section id="bundles" style="padding-top:34px"><div class="wrap">
  <div class="sec-head rv"><span class="eyebrow">مجموعے</span><h2 style="font-size:30px">موضوعاتی مجموعے — مستقل 40% رعایت</h2>
  <p class="bk-sec-lead">ہر مجموعے کی قیمت اس کی کتابوں کی انفرادی قیمتوں سے مستقل طور پر کم رکھی گئی ہے — ہمیشہ کے لیے۔ <span data-open-only>افتتاحی مدت میں اس پر مزید 20% رعایت بھی ہے۔</span></p></div>
  <div class="bk-bundle-grid">{''.join(bundle_cards)}</div>
</div></section>
"""

# ---- gift ----
gift_html = """<section id="gift" style="padding-top:34px"><div class="wrap">
  <div class="sec-head rv"><span class="eyebrow">تحفہ</span><h2 style="font-size:30px">اپنی مرضی کی کتابیں چنیں — تحفہ ہمارا</h2>
  <p class="bk-sec-lead">اپنی پسند کی کتابیں منتخب کریں، تحفے بھی حاصل کریں۔ 5 تا 9 پر ایک تحفہ، 10 تا 19 پر تین، 20+ پر آٹھ۔ تحفہ = آپ کی چنی ہوئی کتابوں میں سب سے سستی کتاب(یں) مفت۔ مجموعے تحفہ گنتی میں شامل نہیں۔ یہ نظام مستقل ہے — افتتاحی مدت تک محدود نہیں۔</p></div>
  <div class="bk-gift-grid">
    <div class="bk-gift rv"><b>5 تا 9 کتابیں</b><span>1 کتاب تحفہ</span><p>مثال: 4 کی قیمت — افتتاح میں 3,168 روپے، بعد میں 3,960 روپے (معیاری 990 والی کتابوں پر)۔</p></div>
    <div class="bk-gift rv"><b>10 تا 19 کتابیں</b><span>3 کتابیں تحفہ</span><p>مثال: 7 کی قیمت — افتتاح میں 5,544 روپے، بعد میں 6,930 روپے (معیاری 990 والی کتابوں پر)۔</p></div>
    <div class="bk-gift rv"><b>20 یا زیادہ کتابیں</b><span>8 کتابیں تحفہ</span><p>مثال: 12 کی قیمت — افتتاح میں 9,504 روپے، بعد میں 11,880 روپے (معیاری 990 والی کتابوں پر)۔</p></div>
  </div>
  <p class="bk-note rv">موضوعاتی مجموعے کارٹ میں اپنی مقررہ قیمت پر الگ لائن کی حیثیت سے آتے ہیں؛ ان کی کتابیں تحفے کی گنتی میں شامل نہیں ہوتیں، اور تحفہ مجموعے کے اندر نہیں لگتا۔ ہر کتاب کے ساتھ مفت مشق نامہ بھی شامل ہے۔</p>
</div></section>
"""

# ---- catalogue grid ----
def facts_line(b):
    if b["n"] == 5:
        return "دو جلدیں · 604 + 727 صفحات · 100 جڑیں · مشق نامہ مفت"
    return f"{b['pages']} صفحات · {b['chapters']} ابواب · مشق نامہ مفت"


def card(b):
    n = b["n"]
    lang = b["lang"]
    bundle = BUNDLE_BY_NAME[b["bundle"]]
    hints = []
    hints.append((f"«{b['bundle']}» میں بھی ہے — ", bundle["price"], bundle["opening_price"]))
    if b.get("starter"):
        st = BUNDLE_BY_NAME["پہلی چار کتابیں (ابتدائی سیٹ)"]
        hints.append(("ابتدائی سیٹ میں بھی ہے — ", st["price"], st["opening_price"]))
    hint_html = "".join(
        f'<p class="bk-card-hint js-hint" data-pre="{esc(pre)}" data-regular="{reg}" data-opening="{op}">{esc(pre + fmt(op) + " روپے")}</p>'
        for pre, reg, op in hints)
    cover = f'<img src="covers/b{n}.webp" alt="{esc(b["title"])} کا سرورق" width="480" height="681">'
    cover = f'<a class="bk-card-cover" href="#book{n}" aria-label="{esc(b["title"])} کی تفصیل دیکھیں">{cover}</a>'
    title_attr = f' lang="en"' if lang == "en" else ""
    links = ""
    if n <= 4:
        wa_msg = f"السلام علیکم! مجھے کتاب «{b['title']}» حاصل کرنی ہے۔ افتتاحی قیمت {fmt(b['opening_price'])} روپے۔"
        links = (f'<p class="bk-card-links"><button class="lnk rd-open js-wa-btn" type="button" data-book="b{n}" '
                 f'data-lang="{lang}" data-title="{esc(b["title"])}" data-regular="{b["price"]}" data-opening="{b["opening_price"]}" data-wa="{wa_link(wa_msg)}">نمونہ مفت پڑھیں</button>'
                 f' <span aria-hidden="true">·</span> <a href="#book{n}">تفصیل دیکھیں</a></p>')
    else:
        links = f'<p class="bk-card-links"><a href="#book{n}">تفصیل دیکھیں</a></p>'
    author = b["author"]
    author_html = f'<p class="bk-card-author" lang="en">{esc(author)}</p>' if author == "Imran Aslam" else f'<p class="bk-card-author">{esc(author)}</p>'
    return f"""<article class="bk-card rv" id="card-{n}">
  {cover}
  <div class="bk-card-body">
    <p class="bk-card-k">{'انگریزی' if lang == 'en' else 'اردو'} · {esc(b["cluster"])}</p>
    <h3{title_attr}>{esc(b["title"])}</h3>
    <p class="bk-card-sub"{title_attr}>{esc(b["subtitle"])}</p>
    <p class="bk-card-copy"{title_attr}>{esc(b["copy"])}</p>
    <p class="bk-card-facts">{esc(facts_line(b))}</p>
    {author_html}
    <p class="bk-card-price js-price" data-regular="{b["price"]}" data-opening="{b["opening_price"]}"><b>{fmt(b["opening_price"])} روپے</b> <s>{fmt(b["price"])} روپے</s> <span>افتتاحی قیمت — 31 دسمبر 2026 تک</span></p>
    {hint_html}
    <div class="bk-card-actions">
      <button class="btn sm cart-add" type="button" data-add="{n}">کارٹ میں ڈالیں</button>
      <a class="btn ghost sm js-wa" data-kind="book" data-wa-title="{esc(b["title"])}" data-regular="{b["price"]}" data-opening="{b["opening_price"]}" href="{wa_link(f'السلام علیکم! مجھے کتاب «{b["title"]}» حاصل کرنی ہے۔ افتتاحی قیمت {fmt(b["opening_price"])} روپے۔')}" target="_blank" rel="noopener">حاصل کریں</a>
    </div>
    {links}
  </div>
</article>"""


sections = []
for cluster in grouping:
    members = [b for b in books if b["cluster"] == cluster]
    slug = CLUSTER_SLUG[cluster]
    cards = "".join(card(b) for b in members)
    sections.append(f"""<section id="cat-{slug}" style="padding-top:34px"><div class="wrap">
  <div class="sec-head rv"><span class="eyebrow">{esc(cluster)}</span><h2 style="font-size:30px">{esc(cluster)} — {len(members)} کتابیں</h2>
  <p class="bk-sec-lead">{esc(CLUSTER_INTRO[cluster])}</p></div>
  <div class="bk-grid">{cards}</div>
</div></section>""")
grid_html = "\n".join(sections)

# ---- FAQ strip (answers sourced verbatim in substance from refund/delivery pages) ----
faq_html = """<section id="faq" style="padding-top:34px"><div class="wrap">
  <div class="sec-head rv"><span class="eyebrow">سوالات</span><h2 style="font-size:30px">خریدنے سے پہلے — عام سوالات</h2>
  <p class="bk-sec-lead">جو باتیں خریدنے سے پہلے پوچھی جاتی ہیں — وہی جواب جو پالیسیوں میں لکھے ہیں، مختصر یہیں۔</p></div>
  <div class="bk-faq">
    <div class="faq-item rv"><button class="faq-q" type="button" aria-expanded="false">کتابیں کس شکل میں ملیں گی؟<span class="arr">+</span></button><div class="faq-a"><div>ہر کتاب پرنٹ PDF، موبائل PDF، EPUB اور DOCX میں ملتی ہے، ساتھ مفت مشق نامہ۔ آپ کی کاپی پر آپ کے نام، آرڈر نمبر اور خرید کی تاریخ کا چھوٹا سا واٹر مارک ہوتا ہے۔</div></div></div>
    <div class="faq-item rv"><button class="faq-q" type="button" aria-expanded="false">ادائیگی کیسے کروں؟<span class="arr">+</span></button><div class="faq-a"><div>JazzCash یا Easypaisa (<bdi>0317 9222029</bdi>) یا بینک سے۔ آرڈر واٹس ایپ پر بھیجیں اور رسید بھیجیں — رقم اصل اکاؤنٹ میں دیکھ کر منظوری ملتی ہے، صرف تصویر پر نہیں۔</div></div></div>
    <div class="faq-item rv"><button class="faq-q" type="button" aria-expanded="false">کتابیں کب تک پہنچیں گی؟<span class="arr">+</span></button><div class="faq-a"><div>تصدیق عموماً چند گھنٹوں میں ہو جاتی ہے؛ رش والے دن اگلے کاروباری دن تک جا سکتی ہے۔ پھر کتاب واٹس ایپ اور ای میل دونوں پر بھیجی جاتی ہے۔</div></div></div>
    <div class="faq-item rv"><button class="faq-q" type="button" aria-expanded="false">فائل نہ کھلے یا غلط کتاب آ جائے تو؟<span class="arr">+</span></button><div class="faq-a"><div>پہلے نئی کاپی بھیجتے ہیں۔ خرابی ہماری طرف کی ہو اور دور نہ ہو تو ترسیل کے سات دن کے اندر پوری رقم واپس — اسی اکاؤنٹ میں جہاں سے ادائیگی آئی تھی۔</div></div></div>
    <div class="faq-item rv"><button class="faq-q" type="button" aria-expanded="false">غلط کتاب خرید لی ہو تو؟<span class="arr">+</span></button><div class="faq-a"><div>اڑتالیس گھنٹے کے اندر بتا دیں، اور کتاب مفت نمونے سے آگے نہ پڑھی گئی ہو، تو اسی کتاب سے بدل دیں گے جو آپ اصل میں چاہتے تھے۔ فرق ہو تو حساب دونوں طرف برابر ہوگا۔</div></div></div>
  </div>
  <div class="note rv" style="margin-top:20px">مکمل تفصیل: <a href="refund.html" style="color:var(--sea2)">واپسی و تبدیلی</a> · <a href="delivery.html" style="color:var(--sea2)">ترسیل و رسائی</a> · <a href="terms.html" style="color:var(--sea2)">خرید کی شرائط</a></div>
</div></section>
"""

# ---- cart UI + catalog data ----
catalog = {
    "opening": {"start": "2026-11-14", "end": "2026-12-31"},
    "books": {str(b["n"]): {"t": b["title"], "p": b["price"], "o": b["opening_price"]} for b in books},
    "bundles": {BUNDLE_KEY[b["name"]]: {"t": b["name"], "p": b["price"], "o": b["opening_price"]} for b in bundles},
}
cart_html = f"""
<div class="cart-bar" id="cartBar" hidden>
  <button class="cart-bar-btn" id="cartOpen" type="button">کارٹ دیکھیں — <span id="cartCount">0</span> آئٹم · <span id="cartTotal">0</span> روپے<span id="cartGiftNote"></span></button>
</div>
<div class="cart-panel" id="cartPanel" hidden role="dialog" aria-modal="true" aria-labelledby="cartTitle">
  <div class="rd-backdrop" id="cartBackdrop"></div>
  <div class="cart-box">
    <div class="rd-head">
      <div class="rd-titles"><span class="rd-k">آپ کا انتخاب</span><h3 id="cartTitle">کارٹ</h3></div>
      <button class="rd-x" type="button" id="cartClose" aria-label="کارٹ بند کریں">✕</button>
    </div>
    <div class="cart-lines" id="cartLines"></div>
    <p class="cart-next" id="cartNext"></p>
    <div class="cart-sums" id="cartSums"></div>
    <ul class="cart-trust">
      <li>ہر کتاب چار فارمیٹ میں — پرنٹ، موبائل، ای بک، اور قابلِ تدوین فائل — ساتھ مفت مشق نامہ۔</li>
      <li>ترسیل عام طور پر چند گھنٹوں میں، مصروف دنوں میں اگلے کاروباری دن۔</li>
      <li>خراب فائل یا غلط کتاب پر پہلے نئی کاپی؛ ہماری غلطی حل نہ ہو تو 7 دن میں مکمل رقم واپس۔</li>
    </ul>
    <p class="cart-note">ادائیگی جاز کیش / ایزی پیسہ (<bdi>0317 9222029</bdi>) یا بینک سے ہوگی۔ آرڈر واٹس ایپ پر بھیجیں — رقم اکاؤنٹ میں دیکھ کر منظوری کے بعد کتابیں واٹس ایپ پر پہنچیں گی۔</p>
    <div class="bk-actions">
      <a class="btn magnetic" id="cartWa" href="#" target="_blank" rel="noopener">واٹس ایپ پر آرڈر بھیجیں</a>
      <button class="btn ghost" id="cartClear" type="button">کارٹ خالی کریں</button>
    </div>
  </div>
</div>
<script type="application/json" id="bookCatalog">{json.dumps(catalog, ensure_ascii=False)}</script>
"""

OUT.write_text(hero + bundles_html + gift_html + grid_html + faq_html + detail + tail + cart_html, encoding="utf-8")
print("wrote", OUT, "books:", len(books), "bundles:", len(bundles))
