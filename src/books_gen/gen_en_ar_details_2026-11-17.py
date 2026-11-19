#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-shot: insert books 5-55 detail sections into src/books.html (EN) and
src/ar/books.html (AR), following each locale's books 1-4 section pattern.
Strings come only from the two verified JSONs + the existing locale chrome.
Run once; the body files remain the hand-maintained sources afterwards.
"""
import html
import json
import pathlib
import urllib.parse
import sys

SITE = pathlib.Path.home() / "workspace/goals/aide-website-build/files/aide-full-site"
SRC = SITE / "src"
DATA = pathlib.Path.home() / "workspace/files/book-pricing-2026-11-12/book-cards-data.json"
CHAPTERS = pathlib.Path.home() / "workspace/files/book-pricing-2026-11-12/book-chapters-data.json"
WA = "https://wa.me/923309222029?text="


def fmt(n):
    return f"{n:,}"


def esc(s):
    return html.escape(str(s), quote=True)


def wa_link(msg):
    return WA + urllib.parse.quote(msg)


books = sorted(json.loads(DATA.read_text(encoding="utf-8"))["books"], key=lambda b: b["n"])
chapters = {b["n"]: b for b in json.loads(CHAPTERS.read_text(encoding="utf-8"))["books"]}


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


LOCALE = {
    "en": dict(
        k="Urdu · AIDE Books", who_h="Who it is for", inside_h="Inside the book",
        fmt_h="Formats", workbook="Free workbook", get="Get this book",
        price=lambda r, o: f"Opening price: Rs {fmt(o)} (14 November – 31 December 2026) · Regular price: Rs {fmt(r)}",
        note="Every price includes print + mobile PDF, EPUB, DOCX and a free workbook.",
        wa=lambda t: f"Assalam-o-Alaikum! I would like to get the book '{t}'.",
        alt=lambda t: f"Cover of {t}", loc="en"),
    "ar": dict(
        k="بالأردية · كتب AIDE", who_h="لمن هذا الكتاب", inside_h="ماذا في الكتاب",
        fmt_h="الصيغ", workbook="دفتر تدريب مجاني", get="احصل على الكتاب",
        price=lambda r, o: f"سعر الافتتاح: {fmt(o)} روبية (14 نوفمبر – 31 ديسمبر 2026) · السعر المعتاد: {fmt(r)} روبية",
        note="يشمل كل سعر ملف PDF للطباعة والجوال، وEPUB، وDOCX، ودفتر تدريب مجاني.",
        wa=lambda t: f"السلام عليكم! أود الحصول على كتاب «{t}» (بالأردية).",
        alt=lambda t: f"غلاف {t}", loc="ar"),
}


def section(b, L):
    n = b["n"]
    return f"""<section class="book-sec" id="book{n}"><div class="wrap bk-grid">
  <div class="bk-cover rv"><img src="covers/b{n}.webp" alt="{esc(L['alt'](b['title']))}"></div>
  <div class="bk-main">
    <span class="k rv">{L['k']}</span>
    <h2 class="rv" lang="ur">{esc(b["title"])}</h2>
    <p class="bk-promise rv" lang="ur">{esc(b["subtitle"])}</p>
    <h3 class="bk-h rv">{L['who_h']}</h3>
    <p class="bk-who rv" lang="ur">{esc(b["copy"])}</p>
    <h3 class="bk-h rv">{L['inside_h']}</h3>
    <ol class="bk-toc rv" lang="ur">
{toc_html(n)}
    </ol>
    <h3 class="bk-h rv">{L['fmt_h']}</h3>
    <div class="chips rv"><span class="chip">Print PDF</span><span class="chip">Mobile PDF</span><span class="chip">EPUB</span><span class="chip">DOCX</span><span class="chip">{L['workbook']}</span></div>
    <div class="bk-actions rv">
      <a class="btn ghost magnetic" href="{wa_link(L['wa'](b['title']))}" target="_blank" rel="noopener">{L['get']}</a>
    </div>
    <p class="bk-price rv js-price" data-fmt="sentence" data-loc="{L['loc']}" data-regular="{b["price"]}" data-opening="{b["opening_price"]}">{L['price'](b["price"], b["opening_price"])}</p>
    <p class="bk-note rv">{L['note']}</p>
  </div>
</div></section>

"""


TAIL_MARK = '<section style="padding-top:8px">'

for loc, path in (("en", SRC / "books.html"), ("ar", SRC / "ar" / "books.html")):
    text = path.read_text(encoding="utf-8")
    assert 'id="book5"' not in text, f"{path} already has book5 sections — refusing to double-insert"
    assert text.count(TAIL_MARK) == 1, f"{path}: tail marker count != 1"
    L = LOCALE[loc]
    new_sections = "".join(section(b, L) for b in books if b["n"] >= 5)
    assert new_sections.count('<section class="book-sec"') == 51
    head, tail = text.split(TAIL_MARK, 1)
    path.write_text(head + new_sections + TAIL_MARK + tail, encoding="utf-8")
    print("wrote", path, "sections added: 51")
