# AIDE — مکمل ویب سائٹ (سنیماٹک ڈیزائن، تین زبانیں)

کھولنا: زپ کھول کر `index.html` ڈبل کلک کریں۔ اوپر والے مینیو میں **EN ▾** سے اردو/عربی نسخہ کھلتا ہے (`ur/` اور `ar/` فولڈرز)۔ کوئی سرور، کوئی انٹرنیٹ درکار نہیں۔

## ساخت — 36 صفحات (12 × 3 زبانیں)
- **ہوم** — انگوٹھی، سین، پروگرام ایکسپلورر، سیلف چیک، Mani Writes، FAQ
- **About** — عمران کی کہانی · اعداد · کام کا طریقہ · **ٹیم (عرفان اسلم، عمران اسلم، ظل ہما اسلم — اصل تصاویر کے ساتھ)** · **آزاد اقدامات (حلیمہ سعدیہ/ADK، سیدہ عمارہ زیدی/اصلاح نیٹ ورک — اصل تصاویر کے ساتھ)**
- **Programmes** — چھ پروگرامز کی فہرست؛ ہر نام اپنے تفصیلی صفحے سے جڑا ہوا
- **ہر پروگرام کا الگ صفحہ** — ماڈیولز (نصاب)، حاصلات، فارمیٹ، کس کے لیے، وٹس ایپ بٹن: `programme-pldp / -habits / -sales / -teach / -homes / -rise`
- **Coaching · Mani Writes · Contact** (FAQ سمیت)
- **مینیو:** About اور Programmes اور Coaching کے ڈراپ ڈاؤن + زبان سوئچر؛ موبائل مینیو میں گروپس

## طریقہ کار — کم ٹوکن میں تبدیلی
سائٹ `src/` میں چھوٹے حصوں میں ہے؛ `python3 src/build.py` انہیں جوڑ کر 36 صفحات بناتا ہے:
| فائل | ذمہ داری |
|---|---|
| `src/css.css`, `pages.css`, `pages2.css` | تمام ڈیزائن + ڈراپ ڈاؤن + RTL قوانین |
| `src/nav.html` / `ur/nav.html` / `ar/nav.html` | مینیو (ڈراپ ڈاؤن سمیت) |
| `src/footer.html` (+ ur/ar نسخے) | اختتامی CTA + فوٹر |
| `src/js.js` + `src/i18n/*.js` | حرکت؛ کوئز/ایکسپلورر کا ڈیٹا ہر زبان کا الگ |
| `src/home/about/coaching/writes/contact.html` (+ ur/ar) | ہر صفحے کا اپنا مواد |
| `src/progdata.py` | چھ پروگرامز کا تصدیق شدہ ڈیٹا (3 زبانیں) — تفصیلی صفحات اور ur/ar فہرست اسی سے بنتی ہے |
| `src/programmes.html` | انگریزی فہرست (دستی) |

تبدیلی کا خرچ تبدیلی جتنا: متن بدلنا ہو تو صرف وہی چھوٹی فائل؛ پروگرام کی تفصیل بدلنی ہو تو `progdata.py` کی ایک انٹری — تینوں زبانوں کے تفصیلی صفحات خود نئے بن جاتے ہیں۔

## اصول
- صرف منظور شدہ اعداد (300+ ورکشاپس، 700+ گھنٹے، 15+ سال، 15 ممالک، 5 زبانیں)؛ کوئی فیس، کوئی جعلی testimonial نہیں۔
- ٹیم/اقدامات کی تصاویر اصل ہیں (پرانی سائٹ کے assets سے)؛ AI برانڈ تصاویر میں کوئی خاتون نہیں (مالک کا حکم)۔
- ہر تبدیلی کے بعد بلڈ + تمام صفحات کی براؤزر جانچ (ایرر، لنکس، تصاویر، وٹس ایپ prefill) لازمی — اس بلڈ میں 36/36 پاس۔

## FINAL DESIGN BUILD (2026-11-04)
- The three home pages (index.html, ur/index.html, ar/index.html) are standalone final-design pages.
  Rebuild them with:  python3 src/home_gen/build_home.py   (content lives in src/home_gen/loc_*.py)
- All other pages:     python3 src/build.py                (build.py no longer writes index.html)
- Hero film: hero-film.mp4 (web cut) + hero-poster.webp + dome logo aide-logo-dome.png at site root.
- Per-page photos: aide-about/coaching/writes/contact/programmes.webp + prog-*.webp at site root.
