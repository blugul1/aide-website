/* ===== ASSESSMENT CENTRE APP 2026-11-06 — injected ONLY into assessments.html by build.py (guarded by page); globals are required by the app's inline handlers ===== */
"use strict";
/* =====================================================================
   AI INTEGRATION CONFIG — read before going live.
   Demo mode: mode:"local" — the assistant and the result-guidance block
   are answered by the built-in local engine in this file. NO network
   calls are made and NO API key exists anywhere in this file.
   To go live: (1) the owner creates a free Gemini API key in AI Studio
   and stores it ONLY as a secret inside a Cloudflare Worker (never in
   this file or in any page); (2) deploy that Worker as a thin proxy;
   (3) set workerUrl below to the Worker URL and flip mode to "live".
   In live mode the assistant + guidance blocks POST band-level
   summaries only (band name, strongest/weakest dimension, score) —
   never raw answers — to the Worker, which calls Gemini and replies.
   ===================================================================== */
var AI_CONFIG = { workerUrl: "", mode: "local" };

/* ============ UI LABELS (UR / EN toggle) ============ */
var L = {
  ur:{hub:"ٹیسٹ",dash:"میرا ڈیش بورڈ",brand:"اسیسمنٹ سینٹر",brandSub:"عمران اسلم — AIDE",
    heroH:'اپنے آپ کو <em>سچائی</em> سے دیکھیں',
    heroP:"مختصر، دیانت دار خود جائزے — شخصیت، خوشحالی، رشتے اور قیادت کے لیے۔ یہ جائزے تشخیص نہیں؛ یہ غور و فکر کا آئینہ ہیں، اور اگلے قدم کی نشاندہی کرتے ہیں۔",
    priv:"🔒 نتائج صرف اسی براؤزر میں محفوظ ہیں — سرور پر کچھ نہیں جاتا",
    all:"سب",start:"شروع کریں",retake:"دوبارہ دیں",resume:"جاری رکھیں",back:"پیچھے",home:"تمام ٹیسٹ",
    mins:"منٹ",qs:"سوال",lockedNote:"دوسری لہر — تیاری/اجازت کے بعد",
    valBadge:"تصدیق شدہ آلہ",refBadge:"خود جائزہ",
    honesty:"دیانت کی ہدایت: جیسا ہے ویسا جواب دیں — جیسا ہونا چاہیے ویسا نہیں۔ درست یا غلط جواب کوئی نہیں؛ سچا جواب ہی مفید ہے۔",
    whatLooks:"یہ جائزہ کیا دیکھتا ہے",qOf:"سوال",meaning:"اس کا مطلب کیا ہے",strengths:"طاقتیں",watchouts:"احتیاط کے پہلو",
    nextStep:"تجویز کردہ اگلا قدم",share:"نتیجہ کارڈ ڈاؤن لوڈ کریں",saved:"✓ یہ نتیجہ آپ کے ڈیش بورڈ میں محفوظ ہے",
    scoreOf:"میں سے",dashH:"میرا ڈیش بورڈ",dashP:"آپ کے دیے گئے جائزے، ان کے بینڈ اور وقت کے ساتھ تبدیلی — سب کچھ صرف اسی آلے پر محفوظ۔",
    empty:"ابھی تک کوئی ٹیسٹ مکمل نہیں ہوا۔ پہلا جائزہ دے کر آغاز کریں۔",
    clearAll:"تمام ڈیٹا صاف کریں",del:"حذف کریں",lastBand:"آخری بینڈ",attempts:"کوششیں",
    foot:"AIDE — From Awareness to Excellence · طبی اسکریننگ اس سینٹر کا حصہ نہیں۔",
    topTrait:"نمایاں خصوصیت",yourCode:"آپ کا دلچسپی کوڈ",freeCall:"مفت ڈسکوری کال — WhatsApp"},
  en:{hub:"Tests",dash:"My Dashboard",brand:"Assessment Centre",brandSub:"Imran Aslam — AIDE",
    heroH:'See yourself <em>honestly</em>',
    heroP:"Short, honest self-assessments — for personality, well-being, relationships and leadership. These are mirrors for reflection, not diagnoses, and each one points to a next step.",
    priv:"🔒 Results are saved only in this browser — nothing goes to a server",
    all:"All",start:"Start",retake:"Retake",resume:"Continue",back:"Back",home:"All tests",
    mins:"min",qs:"questions",lockedNote:"Wave 2 — after preparation / permission",lockedNote2:"Wave 2 — after preparation / permission",
    valBadge:"Validated instrument",refBadge:"Reflection",
    honesty:"Answer as things are, not as they should be. There are no right or wrong answers — an honest answer is the only useful one.",
    whatLooks:"What this check looks at",qOf:"Question",meaning:"What this means",strengths:"Strengths",watchouts:"Watch-outs",
    nextStep:"Recommended next step",share:"Download result card",saved:"✓ This result is saved in your dashboard",
    scoreOf:"out of",dashH:"My Dashboard",dashP:"Your completed checks, their bands and change over time — everything stays on this device.",
    empty:"No test completed yet. Start with your first check.",
    clearAll:"Clear all data",del:"Delete",lastBand:"Last band",attempts:"attempts",
    foot:"AIDE — From Awareness to Excellence · Clinical screening is not part of this centre.",
    topTrait:"Top trait",yourCode:"Your interest code",freeCall:"Free discovery call — WhatsApp"}
};
var lang = (function(){var l=(document.documentElement.lang||"ur").toLowerCase();return (l==="en"||l==="ar")?"en":"ur";})();
function t(k){ return L[lang][k] || k; }
L.ur.lockedNote = "دوسری لہر — تیاری/اجازت کے بعد";

/* ============ VERBATIM LIVE BANKS (from live-assessments-data.js) ============ */
var TESTS=[{id:"stress",mode:"concern",link:"life-coaching.html",name:"Stress & Pressure Check",blurb:"How much pressure are you actually carrying — and how well is your system holding it?",mins:"2 minutes",rev:[7],qs:["I feel overwhelmed by everything I have to do.","My mind keeps racing even when I try to rest.","Small problems irritate me far more than they should.","Worry makes it hard for me to fall asleep.","I feel physically tense — head, shoulders or jaw — during the day.","I find it hard to switch off from work or responsibilities.","In the last two weeks I have felt close to tears, or close to snapping.","When pressure rises, I can calm myself down."]},{id:"emotions",mode:"concern",link:"life-coaching.html",name:"Emotional Balance Check",blurb:"Mood swings, grudges and regret — a quick read on your emotional regulation.",mins:"2 minutes",rev:[5,6],qs:["My mood drops suddenly, without a clear reason.","I hold a grudge long after an argument has ended.","I say things in anger that I regret afterwards.","At times I feel emotionally numb or empty.","Criticism stays in my mind for days.","I can name what I am feeling while I am feeling it.","I recover from a bad day within a day or two.","People who know me would call me emotionally reactive."]},{id:"habits",mode:"strength",link:"habits.html",name:"Habit Strength Audit",blurb:"Not motivation — machinery. How strong is the system underneath your habits?",mins:"2 minutes",rev:[],qs:["I have a fixed time and place for my most important habit.","My environment is set up so the right action is the easy action.","When I miss a day, I return the next day without drama.","I track my habits somewhere — paper, app or diary.","I have removed or reduced the triggers of my worst habit.","I start habits small instead of relying on motivation.","Someone knows my habit goals and checks on me.","Fixed daily anchors — prayer, meals, routine — structure my day."]},{id:"relationships",mode:"concern",link:"strong-homes.html",name:"Relationship Health Reflection",blurb:"Conversation, repair and respect at home — answered honestly, judged by no one.",mins:"2 minutes",rev:[6,7],qs:["Conversations at home turn into arguments quickly.","Days pass without a real conversation with my spouse or family.","I feel unheard when I raise something important.","Old issues come back in every new disagreement.","Time together feels like a duty more than a pleasure.","I carry most of the emotional load at home alone.","When I am wrong, I apologise.","In my home, disagreement stays respectful — no insults, no silent punishment."]},{id:"leadership",mode:"strength",link:"pldp.html",name:"Leadership Self-Check — USWA",blurb:"Ten behaviours from the USWA framework: Understanding, Sincerity, Wisdom, Accountability.",mins:"3 minutes",rev:[],qs:["Before deciding, I can name what I am feeling — and why. (Understanding)","I review my own behaviour honestly and regularly. (Understanding)","My promises to my team are kept, even when it costs me. (Sincerity)","My intention is service, not applause — and my actions show it. (Sincerity)","I consult before major decisions, and I actually listen. (Wisdom)","In conflict, I protect both justice and the relationship. (Wisdom)","I delegate real responsibility, not only tasks. (Wisdom)","I weigh the legacy of my decisions beyond my own tenure. (Accountability)","A system holds me accountable — a mentor, a review, a partner. (Accountability)","I am developing people who could one day replace me. (Accountability)"]}];
var OPTS=["Never", "Rarely", "Sometimes", "Often"];
var OPTS_UR=["کبھی نہیں","شاذ و نادر","کبھی کبھی","اکثر"];
var BC=[{t:"Steady",x:"Your answers suggest you are coping. Coaching is optional for you — free resources and AIDE programmes can still sharpen what is working."},{t:"Support would help",x:"A pattern is visible. This is exactly the level where structured coaching helps — before the pattern hardens into a problem."},{t:"Take this seriously",x:"Your answers suggest significant strain. Our honest recommendation: speak with a qualified counsellor or psychologist. Coaching is not a substitute for counselling, and AIDE will not pretend otherwise."}];
var BS=[{t:"A strong system",x:"Your system is doing the heavy lifting — motivation is no longer your bottleneck. Maintain it, and consider the advanced step."},{t:"Building — support speeds this up",x:"The foundations exist but the system leaks. A structured programme or coaching will close the gaps noticeably faster than willpower."},{t:"A starting point",x:"Right now you are running on intention, not system. Guided support — a programme or coaching — is the honest recommendation; willpower alone has already shown you its limits."}];
var BANK_META={
  stress:{ur:"ذہنی دباؤ جائزہ",cat:"well",next:"coaching"},
  emotions:{ur:"جذباتی توازن جائزہ",cat:"well",next:"coaching"},
  habits:{ur:"عادات کی طاقت جائزہ",cat:"self",next:"habits"},
  relationships:{ur:"رشتوں کی صحت جائزہ",cat:"rel",next:"homes"},
  leadership:{ur:"قیادت خود جائزہ — اسوہ (USWA)",cat:"lead",next:"pldp"}
};
var BANK_SW={
  concern:[
    {s:"دباؤ کے باوجود آپ کا اندرونی توازن برقرار ہے — یہ معمولی بات نہیں۔",w:"آرام اور بحالی کو معمول کا حصہ بنائے رکھیں؛ توازن خود بخود قائم نہیں رہتا۔"},
    {s:"آپ مسئلے کو پہچان رہے ہیں — یہی تبدیلی کی بنیاد ہے۔",w:"نمونہ سخت ہونے سے پہلے اسے روکیں؛ تنہا سہنے کی عادت چھوڑیں۔"},
    {s:"آپ نے دیانت داری سے جواب دیا — مدد مانگنا کمزوری نہیں، دانائی ہے۔",w:"اس کیفیت کو نظر انداز نہ کریں؛ جلد کسی اہل شخص سے بات کریں۔"}],
  strength:[
    {s:"آپ کا نظام مضبوط ہے — عادت اب ارادے نہیں، ترتیب سے چلتی ہے۔",w:"اس نظام کو دوسروں تک پھیلانا اور اگلی سطح کی عادت چننا باقی ہے۔"},
    {s:"بنیاد موجود ہے — کچھ مضبوط ستون پہلے ہی کھڑے ہیں۔",w:"جہاں نظام رستا ہے (وقت، ماحول، نگرانی) وہیں توجہ دیں۔"},
    {s:"آپ واضح طور پر دیکھ رہے ہیں کہ ارادہ اکیلا کافی نہیں — یہ دیانت بذاتِ خود طاقت ہے۔",w:"قوتِ ارادی پر مزید بوجھ نہ ڈالیں؛ پہلے چھوٹا نظام بنائیں۔"}]
};

/* ============ CATEGORIES ============ */
var CATS=[
  {id:"self",ur:"شخصیت و خود شناسی",en:"Personality & Self"},
  {id:"well",ur:"ذہنی صحت و خوشحالی",en:"Mind & Well-being"},
  {id:"rel",ur:"رشتے و خاندان",en:"Relationships & Family"},
  {id:"lead",ur:"قیادت، کاروبار و نوجوان",en:"Leadership, Business & Youth"}
];
function catName(id){ for(var i=0;i<CATS.length;i++) if(CATS[i].id===id) return lang==="ur"?CATS[i].ur:CATS[i].en; return ""; }

/* ============ NEXT-STEP MAP ============ */
var NEXT={
  coaching:{ur:"لائف کوچنگ — مفت ڈسکوری کال",en:"Life Coaching — free discovery call"},
  habits:{ur:"Habit Architecture پروگرام",en:"Habit Architecture programme"},
  homes:{ur:"Strong Homes, Steady Hearts پروگرام",en:"Strong Homes, Steady Hearts programme"},
  pldp:{ur:"PLDP — قیادت پروگرام",en:"PLDP — leadership programme"},
  rise:{ur:"RISE — نوجوانوں کا پروگرام",en:"RISE — youth programme"},
  bookanger:{ur:"کتاب «بچے کا غصہ، والدین کا راستہ» + والدین کوچنگ",en:"Book 'Bache Ka Ghussa, Walidain Ka Rasta' + parenting coaching"},
  sales:{ur:"Behavioural Sales Excellence پروگرام",en:"Behavioural Sales Excellence programme"},
  teach:{ur:"Teach With Heart پروگرام",en:"Teach With Heart programme"}
};
var WA_NUM="923309222029";

/* ============ VALIDATED INSTRUMENTS (EN + faithful UR) ============ */
var AGREE4=[{a:3,en:"Strongly agree",ur:"مکمل متفق"},{a:2,en:"Agree",ur:"متفق"},{a:1,en:"Disagree",ur:"غیر متفق"},{a:0,en:"Strongly disagree",ur:"بالکل غیر متفق"}];
var ROSENBERG={
  id:"rosenberg",type:"scale",cat:"self",badge:"val",next:"coaching",mins:2,
  ur:"خود اعتمادی جائزہ",en:"Rosenberg Self-Esteem Scale",
  blurbUr:"دنیا بھر میں استعمال ہونے والا کلاسیکی پیمانہ — آپ اپنی قدر خود کتنی آنکتے ہیں۔ (Rosenberg, 1965 — عوامی ملکیت)",
  blurbEn:"The classic Rosenberg Self-Esteem Scale (1965, public domain) — how much you value yourself.",
  noteUr:"",opts:AGREE4,rev:[2,4,7,8,9],perMax:3,
  items:[
    {en:"On the whole, I am satisfied with myself.",ur:"مجموعی طور پر میں اپنے آپ سے مطمئن ہوں۔"},
    {en:"I feel that I have a number of good qualities.",ur:"مجھے محسوس ہوتا ہے کہ مجھ میں کئی اچھی خوبیاں ہیں۔"},
    {en:"At times I think I am no good at all.",ur:"کبھی کبھی مجھے لگتا ہے کہ میں بالکل کسی کام کا نہیں۔"},
    {en:"I am able to do things as well as most other people.",ur:"میں زیادہ تر لوگوں کی طرح کام بخوبی انجام دے سکتا ہوں۔"},
    {en:"I feel I do not have much to be proud of.",ur:"مجھے لگتا ہے کہ میرے پاس فخر کرنے کے لیے خاص کچھ نہیں۔"},
    {en:"I feel that I am a person of worth, at least on an equal plane with others.",ur:"مجھے محسوس ہوتا ہے کہ میں بھی دوسروں کی طرح قدر و قیمت رکھتا ہوں۔"},
    {en:"I take a positive attitude toward myself.",ur:"میں اپنے بارے میں مثبت رویہ رکھتا ہوں۔"},
    {en:"I certainly feel useless at times.",ur:"بعض اوقات میں واقعی خود کو بے کار محسوس کرتا ہوں۔"},
    {en:"I wish I could have more respect for myself.",ur:"کاش میں اپنی ذات کی اور زیادہ قدر کر سکتا۔"},
    {en:"All in all, I am inclined to feel that I am a failure.",ur:"مجموعی طور پر میرا رجحان یہی بنتا ہے کہ میں ناکام انسان ہوں۔"}
  ],
  bands:[
    {max:14,tur:"خود اعتمادی کمزور ہے",ten:"Low self-esteem range",xur:"آپ کے جوابات بتاتے ہیں کہ ان دنوں آپ اپنی قدر خود کم آنک رہے ہیں۔ یہ کوئی مستقل حقیقت نہیں — خود اعتمادی مشق اور ماحول سے بدلتی ہے، اور یہی وہ جگہ ہے جہاں ہمدرد، منظم کوچنگ سب سے زیادہ کام آتی ہے۔",xen:"Your answers suggest you are valuing yourself less than you deserve these days. This is not a fixed truth — self-esteem changes with practice and environment, and this is exactly where kind, structured coaching helps most.",sur:"آپ نے دیانت داری سے خود کو دیکھا — یہی پہلا قدم ہے۔",sen:"You looked at yourself honestly — that is the first step.",wur:"اپنے بارے میں سخت فیصلے تنہائی میں نہ کریں؛ کسی قابلِ اعتماد شخص یا کوچ سے بات کریں۔",wen:"Do not pass harsh verdicts on yourself alone; talk to someone you trust, or a coach."},
    {max:25,tur:"خود اعتمادی معمول کی حد میں ہے",ten:"Normal range",xur:"آپ کی خود اعتمادی صحت مند درمیانی حد میں ہے — نہ خود کو کم آنکنا، نہ بڑھا چڑھا کر دیکھنا۔ اس بنیاد کو برقرار رکھنا اور مخصوص کمزور لمحوں پر کام کرنا اگلا قدم ہے۔",xen:"Your self-esteem sits in the healthy middle range — neither undervaluing nor inflating yourself. Keeping this base, and working on specific weak moments, is the next step.",sur:"اپنی خوبیوں اور خامیوں دونوں کا متوازن اندازہ آپ کی طاقت ہے۔",sen:"A balanced view of your strengths and flaws is itself a strength.",wur:"ناکامی کے لمحوں میں پرانی خود تنقیدی عادت واپس آ سکتی ہے — اسے پہچاننا ہی کافی ہے۔",wen:"In failure moments the old self-critical habit may return — noticing it is enough."},
    {max:30,tur:"خود اعتمادی مضبوط ہے",ten:"High self-esteem range",xur:"آپ اپنی قدر سے پوری طرح واقف ہیں اور یہ اعتماد اندرونی سکون سے آیا معلوم ہوتا ہے۔ اسے برقرار رکھیں — اور اس طاقت کو دوسروں کی حوصلہ افزائی میں بھی استعمال کریں۔",xen:"You are fully aware of your own worth, and this confidence seems to come from inner steadiness. Keep it — and use this strength to encourage others too.",sur:"مشکل حالات میں بھی خود پر اعتماد برقرار رکھنا آپ کی پہچان ہے۔",sen:"Staying confident in hard situations is your hallmark.",wur:"اعتماد اور خود پسندی کی سرحد پر نظر رکھیں؛ دوسروں کی رائے سننے کی عادت اسے متوازن رکھتی ہے۔",wen:"Watch the line between confidence and self-admiration; listening to others keeps it balanced."}
  ]
};
var WHO5={
  id:"who5",type:"who5",cat:"well",badge:"val",next:"coaching",mins:1,
  ur:"خوشحالی اشاریہ",en:"WHO-5 Well-Being Index",
  blurbUr:"عالمی ادارہ صحت کا پانچ سوالی اشاریہ — گزشتہ دو ہفتوں میں آپ کی خوشحالی، توانائی اور سکون کیسی رہی۔ یہ فلاحی جائزہ ہے، کوئی طبی اسکرین نہیں۔",
  blurbEn:"The WHO 5-item well-being index — your cheerfulness, calm and energy over the last two weeks. A well-being reflection, not a medical screen.",
  noteUr:"گزشتہ دو ہفتوں کے بارے میں جواب دیں۔",noteEn:"Please answer about the last two weeks.",
  opts:[{a:5,en:"All of the time",ur:"ہر وقت"},{a:4,en:"Most of the time",ur:"زیادہ تر وقت"},{a:3,en:"More than half of the time",ur:"آدھے سے زیادہ وقت"},{a:2,en:"Less than half of the time",ur:"آدھے سے کم وقت"},{a:1,en:"Some of the time",ur:"کبھی کبھار"},{a:0,en:"At no time",ur:"بالکل نہیں"}],
  rev:[],perMax:5,
  items:[
    {en:"I have felt cheerful and in good spirits.",ur:"میں نے خود کو خوش اور اچھے مزاج میں محسوس کیا۔"},
    {en:"I have felt calm and relaxed.",ur:"میں نے خود کو پرسکون اور مطمئن محسوس کیا۔"},
    {en:"I have felt active and vigorous.",ur:"میں نے خود کو چست اور توانائی سے بھرپور محسوس کیا۔"},
    {en:"I woke up feeling fresh and rested.",ur:"میں تازہ دم اور آرام دہ حالت میں بیدار ہوا۔"},
    {en:"My daily life has been filled with things that interest me.",ur:"میری روزمرہ زندگی دلچسپ چیزوں سے بھری رہی۔"}
  ],
  bands:[
    {max:50,tur:"خوشحالی پر توجہ درکار ہے",ten:"Well-being needs attention",xur:"گزشتہ دنوں میں آپ کی خوشحالی کا اشاریہ کم رہا ہے۔ یہ کوئی تشخیص نہیں — بس ایک نرم اشارہ ہے کہ آرام، نیند، حرکت اور پیاروں کے ساتھ وقت کو ترجیح دیں۔ اگر یہ کیفیت لمبی چلے تو کسی اہل شخص سے بات کرنا دانشمندی ہے۔",xen:"Your well-being index has been low in recent days. This is not a diagnosis — just a gentle signal to prioritise rest, sleep, movement and time with loved ones. If this state lasts long, talking to a qualified person is wise.",sur:"آپ نے اپنی کیفیت کو دیانت سے دیکھا — یہ خود آگاہی ہی بحالی کا آغاز ہے۔",sen:"You noticed your state honestly — that awareness is where recovery begins.",wur:"نیند اور آرام کو مزید مؤخر نہ کریں؛ ایک ہفتہ بنیادی معمولات درست کر کے دوبارہ دیکھیں۔",wen:"Do not postpone sleep and rest any further; fix the basics for a week and check again."},
    {max:75,tur:"خوشحالی درمیانی ہے",ten:"Moderate well-being",xur:"آپ کی خوشحالی نہ خراب ہے نہ بہترین — کچھ دن اچھے، کچھ بھاری۔ چھوٹی مستقل عادتیں — وقت پر نیند، چہل قدمی، شکر گزاری — اس اشاریے کو اوپر لے جا سکتی ہیں۔",xen:"Your well-being is neither poor nor at its best — some days good, some heavy. Small steady habits — sleep on time, walks, gratitude — can lift this index.",sur:"اچھے دنوں کی بنیاد موجود ہے؛ نظام اسے مستقل بنا سکتا ہے۔",sen:"The base for good days exists; a system can make them steady.",wur:"بھاری دنوں کا نمونہ دیکھیں — کس چیز کے بعد آتے ہیں؟ وہیں چھوٹی تبدیلی سب سے مؤثر ہوگی۔",wen:"Look for the pattern of heavy days — what comes right before them? A small change there works best."},
    {max:100,tur:"خوشحالی اچھی ہے",ten:"Good well-being",xur:"آپ کے گزشتہ دو ہفتے توانائی اور سکون سے بھرے رہے۔ جو چیزیں اس میں مددگار ہیں — لوگ، عادتیں، معمولات — انہیں پہچانیں اور ان کی حفاظت کریں۔",xen:"Your last two weeks were full of energy and calm. Identify what helped — people, habits, routines — and protect those things.",sur:"توانائی اور سکون کا یہ امتزاج آپ کی موجودہ طاقت ہے۔",sen:"This mix of energy and calm is your current strength.",wur:"مصروف موسم میں یہ معمولات سب سے پہلے قربان ہوتے ہیں — پہلے سے ان کی حفاظت کا بندوبست کریں۔",wen:"In busy seasons these routines are the first sacrifice — plan their protection in advance."}
  ]
};
var SWLS={
  id:"swls",type:"scale7",cat:"well",badge:"val",next:"coaching",mins:1,
  ur:"زندگی کی تسلی",en:"Satisfaction With Life Scale",
  blurbUr:"ایڈ ڈائنر کا معروف پیمانہ — مجموعی طور پر آپ اپنی زندگی سے کتنے مطمئن ہیں۔ (Diener et al., 1985)",
  blurbEn:"Diener's well-known scale — overall, how satisfied are you with your life? (Diener et al., 1985)",
  noteUr:"",
  opts:[{a:7,en:"Strongly agree",ur:"مکمل متفق"},{a:6,en:"Agree",ur:"متفق"},{a:5,en:"Slightly agree",ur:"کسی حد تک متفق"},{a:4,en:"Neither agree nor disagree",ur:"نہ متفق نہ غیر متفق"},{a:3,en:"Slightly disagree",ur:"کسی حد تک غیر متفق"},{a:2,en:"Disagree",ur:"غیر متفق"},{a:1,en:"Strongly disagree",ur:"بالکل غیر متفق"}],
  rev:[],perMax:7,minPer:1,
  items:[
    {en:"In most ways my life is close to my ideal.",ur:"زیادہ تر پہلوؤں سے میری زندگی میرے تصور کے قریب ہے۔"},
    {en:"The conditions of my life are excellent.",ur:"میری زندگی کے حالات بہترین ہیں۔"},
    {en:"I am satisfied with my life.",ur:"میں اپنی زندگی سے مطمئن ہوں۔"},
    {en:"So far I have gotten the important things I want in life.",ur:"اب تک میں زندگی میں وہ اہم چیزیں حاصل کر چکا ہوں جو میں چاہتا تھا۔"},
    {en:"If I could live my life over, I would change almost nothing.",ur:"اگر مجھے زندگی دوبارہ جینے کا موقع ملے تو میں تقریباً کچھ نہ بدلوں۔"}
  ],
  bands:[
    {max:9,tur:"نہایت غیر مطمئن",ten:"Extremely dissatisfied",xur:"آپ اس وقت اپنی زندگی سے گہری نامرضی محسوس کر رہے ہیں۔ یہ احساس سننے کے لائق ہے — اسے دبائیں نہیں؛ کسی ہمدرد، اہل شخص کے ساتھ بیٹھ کر ایک ایک پہلو کھولنا ہی درست آغاز ہے۔",xen:"Right now you feel deeply dissatisfied with your life. This feeling deserves to be heard — do not suppress it; sitting with a kind, qualified person and opening it piece by piece is the right start.",sur:"آپ نے تلخ سچ کو سچ کہا — یہ دیانت تبدیلی کی شرط ہے۔",sen:"You named a hard truth honestly — that honesty is the condition for change.",wur:"بڑے فیصلے اسی کیفیت میں نہ کریں؛ پہلے سہارا اور وضاحت حاصل کریں۔",wen:"Do not make big decisions in this state; first get support and clarity."},
    {max:14,tur:"غیر مطمئن",ten:"Dissatisfied",xur:"زندگی کے کئی پہلو آپ کی توقع سے پیچھے ہیں۔ مایوسی کو سمت میں بدلنا ممکن ہے — ایک پہلو چنیں، اسی پر منظم کام کریں، باقی بعد میں۔",xen:"Several areas of life are behind your expectations. Disappointment can be turned into direction — pick one area, work on it in an organised way, the rest later.",sur:"آپ کو معلوم ہے کہ کہاں کمی ہے — یہ وضاحت خود ایک اثاثہ ہے۔",sen:"You know where the gap is — that clarity is itself an asset.",wur:"ہر پہلو ایک ساتھ ٹھیک کرنے کی کوشش تھکا دے گی؛ ترتیب بنائیں۔",wen:"Trying to fix everything at once will exhaust you; sequence it."},
    {max:19,tur:"کسی حد تک غیر مطمئن",ten:"Slightly dissatisfied",xur:"مجموعی مزاج ہلکی نامرضی کا ہے — کچھ چیزیں ٹھیک، کچھ کھٹکتی ہیں۔ اکثر یہی وہ مرحلہ ہے جہاں چھوٹی، سوچی سمجھی تبدیلیاں بڑا فرق ڈالتی ہیں۔",xen:"The overall mood is mild dissatisfaction — some things fine, some nagging. This is often the stage where small, deliberate changes make a big difference.",sur:"زندگی کی بنیادیں موجود ہیں؛ کھٹکنے والے پہلو گنے جا سکتے ہیں۔",sen:"The foundations exist; the nagging points can be counted and named.",wur:"کھٹکنے والی چیز کو مبہم نہ رہنے دیں — اسے نام دیں، تبھی حل نکلے گا۔",wen:"Do not let the nagging thing stay vague — name it, and a solution can follow."},
    {max:20,tur:"درمیان — نہ مطمئن نہ غیر مطمئن",ten:"Neutral",xur:"آپ بالکل درمیان میں کھڑے ہیں — نہ تسلی، نہ شکوہ۔ یہ غیر جانبدار مقام اکثر ایک اہم فیصلے سے پہلے کا ہوتا ہے: کس سمت جھکاؤ پیدا کرنا ہے، یہ اب آپ کے ہاتھ میں ہے۔",xen:"You stand exactly in the middle — neither satisfied nor dissatisfied. This neutral point often comes before an important choice: which way to lean is now in your hands.",sur:"متوازن جائزہ لینے کی صلاحیت آپ کے پاس ہے۔",sen:"You can take a balanced stock of your life.",wur:"غیر جانبداری کو عادت نہ بننے دیں؛ ایک سمت کا شعوری انتخاب کریں۔",wen:"Do not let neutrality become a habit; consciously choose a direction."},
    {max:25,tur:"کسی حد تک مطمئن",ten:"Slightly satisfied",xur:"آپ زندگی سے کسی حد تک مطمئن ہیں — سمت درست ہے، رفتار اور گہرائی بڑھ سکتی ہے۔ جو چیزیں پہلے ہی تسلی دے رہی ہیں، انہیں بڑھانا سب سے آسان اگلا قدم ہے۔",xen:"You are somewhat satisfied with life — the direction is right; depth and pace can grow. Expanding what already satisfies you is the easiest next step.",sur:"تسلی کی بنیاد اور سمت دونوں موجود ہیں۔",sen:"Both the base and direction of satisfaction are present.",wur:"مطمئن ہو کر رک نہ جائیں؛ ایک پہلو میں گہرائی کا ہدف رکھیں۔",wen:"Do not stall in contentment; set one depth goal in a single area."},
    {max:30,tur:"مطمئن",ten:"Satisfied",xur:"آپ اپنی زندگی سے مطمئن ہیں — یہ وہ مقام ہے جہاں شکر گزاری اور آگے کی تعمیر ساتھ چل سکتی ہیں۔ اس تسلی کو برقرار رکھتے ہوئے ایک بڑا مقصد چننا اب ممکن ہے۔",xen:"You are satisfied with your life — the point where gratitude and further building can walk together. Keeping this contentment, you can now choose one larger purpose.",sur:"شکر گزاری اور آگے بڑھنے کا توازن آپ کی طاقت ہے۔",sen:"The balance of gratitude and growth is your strength.",wur:"تسلی سستی میں نہ بدلے — معمولات کی تجدید وقتاً فوقتاً کرتے رہیں۔",wen:"Do not let contentment turn into complacency — refresh your routines now and then."},
    {max:35,tur:"نہایت مطمئن",ten:"Extremely satisfied",xur:"آپ زندگی کی نہایت گہری تسلی محسوس کر رہے ہیں — یہ کم لوگوں کو نصیب ہوتی ہے۔ اس مقام کی سب سے خوبصورت اگلی صورت یہ ہے کہ یہ سکون دوسروں تک بھی پہنچے: رہنمائی، خدمت، یا کسی کی زندگی میں آسانی۔",xen:"You feel a deep satisfaction with life — something few people experience. The most beautiful next form of this state is letting it reach others: mentoring, service, or easing someone's life.",sur:"گہری تسلی اور اندرونی سکون آپ کا موجودہ سرمایہ ہے۔",sen:"Deep satisfaction and inner calm are your present capital.",wur:"اس کیفیت کو خودکار نہ سمجھیں — جن عادتوں نے یہ بنائی، ان کی حفاظت کریں۔",wen:"Do not take this state for granted — protect the habits that built it."}
  ]
};

/* ============ BIG FIVE — demo short form (IPIP-style, our own items) ============ */
var AGREE5=[{a:4,en:"Strongly agree",ur:"مکمل متفق"},{a:3,en:"Agree",ur:"متفق"},{a:2,en:"Neutral",ur:"درمیان"},{a:1,en:"Disagree",ur:"غیر متفق"},{a:0,en:"Strongly disagree",ur:"بالکل غیر متفق"}];
var BIGFIVE={
  id:"bigfive",type:"traits",cat:"self",badge:"ref",next:"coaching",mins:4,
  ur:"بگ فائیو شخصیت جائزہ (مختصر نسخہ)",en:"Big Five — Demo Short Form (IPIP-style)",
  blurbUr:"شخصیت کی پانچ بڑی جہتوں کا مختصر جائزہ — IPIP کے انداز میں ہمارے اپنے جملے (یہ سرکاری IPIP-50 نہیں)۔ نتائج ریڈار چارٹ میں ملیں گے۔",
  blurbEn:"A short look at the five big personality dimensions — our own statements in the IPIP spirit (not the official IPIP-50). Results appear as a radar chart.",
  noteUr:"",opts:AGREE5,perMax:4,
  traits:[
    {k:"O",ur:"کشادگی",en:"Openness",lineUr:"نئے خیالات، تجربات اور تخیل کی طرف رجحان۔",lineEn:"Drawn to new ideas, experiences and imagination.",hiUr:"آپ نئے خیالات اور تجربات کے لیے کھلے ہیں — یہ سیکھنے اور جدت کی بنیاد ہے۔",hiEn:"You are open to new ideas and experiences — the base of learning and innovation.",loUr:"آپ آزمودہ اور مانوس راستوں کو ترجیح دیتے ہیں — کبھی کبھار ایک چھوٹا نیا تجربہ فائدہ دے سکتا ہے۔",loEn:"You prefer tried and familiar paths — an occasional small new experience can help."},
    {k:"C",ur:"نظم و ضبط",en:"Conscientiousness",lineUr:"منصوبہ بندی، ترتیب اور وعدے کی پاسداری۔",lineEn:"Planning, order and keeping commitments.",hiUr:"آپ منصوبہ بند اور قابلِ اعتماد ہیں — کام مکمل کرنا آپ کی عادت ہے۔",hiEn:"You are planned and reliable — finishing work is your habit.",loUr:"نظم و ترتیب آپ کی کمزور کڑی ہے — چھوٹے نظام (فہرست، وقت، جگہ) آپ کی زندگی آسان کر سکتے ہیں۔",loEn:"Order is your weaker link — small systems (lists, time, place) can make life easier."},
    {k:"E",ur:"سماجی توانائی",en:"Extraversion",lineUr:"لوگوں کی صحبت سے توانائی اور اظہار کا انداز۔",lineEn:"Energy from company and how openly you express yourself.",hiUr:"صحبت آپ کو توانائی دیتی ہے اور آپ گروپ میں آسانی سے آگے آتے ہیں۔",hiEn:"Company energises you and you step forward easily in groups.",loUr:"آپ تنہائی سے توانائی حاصل کرتے ہیں — یہ کمی نہیں، سلیقہ ہے؛ بس اہم مواقع پر اظہار کی مشق رکھیں۔",loEn:"You recharge in solitude — a style, not a flaw; just keep practising expression for key moments."},
    {k:"A",ur:"ہمدردی و نرمی",en:"Agreeableness",lineUr:"دوسروں کے جذبات کی قدر، تعاون اور نرمی۔",lineEn:"Valuing others' feelings, cooperation and gentleness.",hiUr:"آپ ہمدرد اور نرم دل ہیں — رشتے آپ کے ہاں محفوظ رہتے ہیں۔",hiEn:"You are kind-hearted — relationships stay safe around you.",loUr:"آپ سیدھی بات کرنے والے ہیں — کبھی نرمی کا ایک جملہ رشتے کو تنازع سے بچا لیتا ہے۔",loEn:"You are direct — sometimes one gentle sentence saves a relationship from conflict."},
    {k:"S",ur:"جذباتی استحکام",en:"Emotional Stability",lineUr:"دباؤ میں سکون اور جھٹکے سے جلد بحالی۔",lineEn:"Calm under pressure and quick recovery from setbacks.",hiUr:"دباؤ میں سکون اور جلد بحالی آپ کی بڑی طاقت ہے۔",hiEn:"Calm under pressure and quick recovery are your big strengths.",loUr:"جذبات آپ پر جلد اثر کرتے ہیں — بحالی کی چھوٹی عادتیں (وقفہ، گہری سانس، لکھنا) بڑا فرق ڈال سکتی ہیں۔",loEn:"Emotions affect you quickly — small recovery habits (pause, deep breath, writing) can make a big difference."}
  ],
  items:[
    {tr:0,en:"I have a vivid imagination.",ur:"میرا تخیل زندہ اور بھرپور ہے۔"},
    {tr:0,en:"I enjoy exploring new ideas and ways of doing things.",ur:"مجھے نئے خیالات اور کام کے نئے طریقے آزمانا پسند ہے۔"},
    {tr:0,en:"I am interested in art, stories and different cultures.",ur:"مجھے فن، کہانیوں اور مختلف ثقافتوں میں دلچسپی ہے۔"},
    {tr:0,rev:1,en:"I prefer familiar routines and rarely try new things.",ur:"میں مانوس معمولات کو ترجیح دیتا ہوں اور نئی چیزیں شاذ ہی آزماتا ہوں۔"},
    {tr:1,en:"I keep my commitments and finish what I start.",ur:"میں اپنے وعدے نبھاتا ہوں اور شروع کیا ہوا کام مکمل کرتا ہوں۔"},
    {tr:1,en:"I plan my work before I begin.",ur:"میں کام شروع کرنے سے پہلے اس کی منصوبہ بندی کرتا ہوں۔"},
    {tr:1,en:"I am organised in my daily life.",ur:"میری روزمرہ زندگی منظم ہے۔"},
    {tr:1,rev:1,en:"I often leave things to the last moment.",ur:"میں اکثر کام آخری لمحے تک ٹال دیتا ہوں۔"},
    {tr:2,en:"I feel energised when I am around people.",ur:"لوگوں کی صحبت میں مجھے توانائی محسوس ہوتی ہے۔"},
    {tr:2,en:"I start conversations easily with new people.",ur:"میں نئے لوگوں سے آسانی سے گفتگو شروع کر لیتا ہوں۔"},
    {tr:2,en:"I express my opinions openly in a group.",ur:"میں گروپ میں اپنی رائے کھل کر بیان کرتا ہوں۔"},
    {tr:2,rev:1,en:"I prefer quiet time alone over social gatherings.",ur:"میں سماجی محفلوں پر اکیلے پرسکون وقت کو ترجیح دیتا ہوں۔"},
    {tr:3,en:"I go out of my way to help others.",ur:"میں دوسروں کی مدد کے لیے خاص کوشش کرتا ہوں۔"},
    {tr:3,en:"I listen patiently even when I disagree.",ur:"اختلاف کے باوجود میں صبر سے سنتا ہوں۔"},
    {tr:3,en:"I forgive quickly when someone wrongs me.",ur:"کوئی زیادتی کرے تو میں جلد معاف کر دیتا ہوں۔"},
    {tr:3,rev:1,en:"I find it hard to apologise even when I am wrong.",ur:"غلطی پر ہونے کے باوجود معذرت کرنا میرے لیے مشکل ہوتا ہے۔"},
    {tr:4,en:"I stay calm under pressure.",ur:"دباؤ میں بھی میں پرسکون رہتا ہوں۔"},
    {tr:4,en:"I recover quickly after a setback.",ur:"ناکامی یا جھٹکے کے بعد میں جلد سنبھل جاتا ہوں۔"},
    {tr:4,en:"I rarely feel overwhelmed by my emotions.",ur:"میرے جذبات مجھ پر شاذ ہی حاوی ہوتے ہیں۔"},
    {tr:4,rev:1,en:"Small problems can ruin my whole day.",ur:"چھوٹی چھوٹی پریشانیاں میرا سارا دن خراب کر سکتی ہیں۔"}
  ]
};

/* ============ RIASEC — career interests (our own items) ============ */
var ENJOY5=[{a:4,en:"I would love this",ur:"بہت پسند آئے گا"},{a:3,en:"I would enjoy this",ur:"پسند آئے گا"},{a:2,en:"Neutral",ur:"درمیان"},{a:1,en:"Not much",ur:"خاص پسند نہیں"},{a:0,en:"Not at all",ur:"بالکل نہیں"}];
var RIASEC={
  id:"riasec",type:"traits",cat:"lead",badge:"ref",next:"rise",mins:3,
  ur:"کیریئر دلچسپی جائزہ (RIASEC)",en:"Career Interests (RIASEC)",
  blurbUr:"کس قسم کے کام میں آپ کی طبیعت سب سے زیادہ لگتی ہے؟ چھ شعبوں میں سے آپ کی دلچسپی کا نقشہ اور ٹاپ 3 کوڈ۔",
  blurbEn:"What kind of work fits your nature best? Your interest map across six areas, with a top-3 code.",
  noteUr:"ہر سرگرمی کے بارے میں بتائیں کہ آپ اسے کتنا پسند کریں گے۔",noteEn:"For each activity, say how much you would enjoy it.",
  opts:ENJOY5,perMax:4,
  traits:[
    {k:"R",ur:"عملی (Realistic)",en:"Realistic",lineUr:"ہاتھ کے کام، اوزار، مشینیں اور باہر کی عملی دنیا۔",lineEn:"Hands-on work, tools, machines and the practical outdoors.",hiUr:"عملی کام آپ کو لگتا ہے — ہنر، مرمت، تعمیر یا میدان کا کام آپ کے لیے قدرتی ہو سکتا ہے۔",hiEn:"Practical work suits you — skills, repair, building or field work may feel natural.",loUr:"عملی/میدانی کام آپ کی ترجیح نہیں۔",loEn:"Hands-on field work is not your preference."},
    {k:"I",ur:"تحقیقی (Investigative)",en:"Investigative",lineUr:"سوالات، تحقیق، مسئلہ حل کرنا اور گہرائی سے سمجھنا۔",lineEn:"Questions, research, problem-solving and deep understanding.",hiUr:"آپ کی طبیعت محقق کی ہے — سائنس، تجزیہ اور گہرا مطالعہ آپ کو کھینچتا ہے۔",hiEn:"You have an investigator's nature — science, analysis and deep study attract you.",loUr:"تحقیق و تجزیے کا طویل کام آپ کو نہیں کھینچتا۔",loEn:"Long research and analysis work does not attract you."},
    {k:"A",ur:"تخلیقی (Artistic)",en:"Artistic",lineUr:"لکھنا، ڈیزائن، فن اور اپنے انداز کا اظہار۔",lineEn:"Writing, design, art and self-expression.",hiUr:"تخلیق آپ کی زبان ہے — تحریر، ڈیزائن یا میڈیا آپ کے لیے قدرتی میدان ہو سکتا ہے۔",hiEn:"Creation is your language — writing, design or media may be your natural field.",loUr:"فن و تخلیق آپ کی اولین دلچسپی نہیں۔",loEn:"Art and creation are not your first interest."},
    {k:"S",ur:"سماجی (Social)",en:"Social",lineUr:"پڑھانا، مدد کرنا، رہنمائی اور خدمت۔",lineEn:"Teaching, helping, guiding and serving.",hiUr:"لوگوں کی خدمت اور رہنمائی آپ کے دل کے قریب ہے — تدریس، کوچنگ یا فلاحی کام سوچیے۔",hiEn:"Serving and guiding people is close to your heart — consider teaching, coaching or welfare work.",loUr:"لوگوں کے ساتھ براہِ راست خدمت کا کام آپ کی اولین پسند نہیں۔",loEn:"Direct people-service work is not your first choice."},
    {k:"E",ur:"قیادت و کاروبار (Enterprising)",en:"Enterprising",lineUr:"قیادت، قائل کرنا، کاروبار اور منصوبے شروع کرنا۔",lineEn:"Leading, persuading, business and starting projects.",hiUr:"قیادت اور آغاز آپ کو جوش دیتا ہے — کاروبار، فروخت یا ٹیم کی رہنمائی آپ کا میدان ہو سکتا ہے۔",hiEn:"Leading and starting things excite you — business, sales or team leadership may be your field.",loUr:"قیادت و فروخت کا دباؤ آپ کو نہیں بھاتا۔",loEn:"The pressure of leadership and sales does not appeal to you."},
    {k:"C",ur:"منظم (Conventional)",en:"Conventional",lineUr:"ترتیب، حساب کتاب، ریکارڈ اور منصوبے کی تکمیل۔",lineEn:"Order, accounts, records and completing plans.",hiUr:"ترتیب اور درستگی آپ کی طاقت ہے — انتظام، حسابات یا نظام سازی آپ کے لیے مضبوط میدان ہے۔",hiEn:"Order and accuracy are your strengths — administration, accounts or systems work fits you.",loUr:"بندھے ہوئے دفتری نظام میں آپ کی طبیعت نہیں لگتی۔",loEn:"Rigid office systems do not suit your nature."}
  ],
  items:[
    {tr:0,en:"Fix or repair a machine or device at home.",ur:"گھر میں کسی مشین یا آلے کی مرمت کرنا۔"},
    {tr:0,en:"Build something useful with my hands, like furniture or a model.",ur:"اپنے ہاتھوں سے کوئی مفید چیز بنانا، جیسے فرنیچر یا ماڈل۔"},
    {tr:0,en:"Work outdoors with tools or equipment.",ur:"اوزاروں کے ساتھ کھلی جگہ پر کام کرنا۔"},
    {tr:1,en:"Solve a difficult puzzle or problem step by step.",ur:"مشکل مسئلہ یا پہیلی قدم بہ قدم حل کرنا۔"},
    {tr:1,en:"Research a question until I understand it deeply.",ur:"کسی سوال پر اس وقت تک تحقیق کرنا جب تک گہرائی سے سمجھ نہ آ جائے۔"},
    {tr:1,en:"Analyse information or data to find the pattern.",ur:"معلومات یا اعداد کا تجزیہ کر کے نمونہ تلاش کرنا۔"},
    {tr:2,en:"Write stories, poems or a personal journal.",ur:"کہانیاں، نظمیں یا ذاتی ڈائری لکھنا۔"},
    {tr:2,en:"Design something — a room, a poster, a product.",ur:"کوئی چیز ڈیزائن کرنا — کمرہ، پوسٹر یا پروڈکٹ۔"},
    {tr:2,en:"Create videos, music or other media.",ur:"ویڈیوز، موسیقی یا دیگر میڈیا تخلیق کرنا۔"},
    {tr:3,en:"Teach or explain something to someone.",ur:"کسی کو کچھ پڑھانا یا سمجھانا۔"},
    {tr:3,en:"Help a friend through a difficult time.",ur:"مشکل وقت میں کسی دوست کی مدد کرنا۔"},
    {tr:3,en:"Volunteer for community or welfare work.",ur:"کمیونٹی یا فلاحی کام میں رضاکارانہ حصہ لینا۔"},
    {tr:4,en:"Lead a team towards a goal.",ur:"کسی ٹیم کو ہدف کی طرف لے کر چلنا۔"},
    {tr:4,en:"Present an idea and persuade others.",ur:"خیال پیش کر کے دوسروں کو قائل کرنا۔"},
    {tr:4,en:"Start my own business or project.",ur:"اپنا کاروبار یا منصوبہ شروع کرنا۔"},
    {tr:5,en:"Organise records, files or accounts neatly.",ur:"ریکارڈ، فائلیں یا حسابات ترتیب سے رکھنا۔"},
    {tr:5,en:"Follow a clear plan and checklist to finish work.",ur:"واضح منصوبے اور فہرست کے مطابق کام مکمل کرنا۔"},
    {tr:5,en:"Work with numbers, budgets or schedules.",ur:"اعداد، بجٹ یا اوقات کار کے ساتھ کام کرنا۔"}
  ]
};

/* ============ WAVE 2 — FULL INSTRUMENTS & REFLECTIONS ============ */
var OPT_LIKE5=[{a:5,en:"Very much like me",ur:"بالکل میرے جیسا"},{a:4,en:"Mostly like me",ur:"زیادہ تر میرے جیسا"},{a:3,en:"Somewhat like me",ur:"کسی حد تک میرے جیسا"},{a:2,en:"Not much like me",ur:"زیادہ میرے جیسا نہیں"},{a:1,en:"Not like me at all",ur:"بالکل میرے جیسا نہیں"}];
var OPT_MAAS=[{a:1,en:"Almost always",ur:"تقریباً ہمیشہ"},{a:2,en:"Very frequently",ur:"بہت اکثر"},{a:3,en:"Somewhat frequently",ur:"کسی قدر اکثر"},{a:4,en:"Somewhat infrequently",ur:"کسی قدر کم"},{a:5,en:"Very infrequently",ur:"بہت کم"},{a:6,en:"Almost never",ur:"تقریباً کبھی نہیں"}];
var OPT_AGR7=[{a:7,en:"Strongly agree",ur:"مکمل متفق"},{a:6,en:"Agree",ur:"متفق"},{a:5,en:"Slightly agree",ur:"کسی حد تک متفق"},{a:4,en:"Neither agree nor disagree",ur:"نہ متفق نہ غیر متفق"},{a:3,en:"Slightly disagree",ur:"کسی حد تک غیر متفق"},{a:2,en:"Disagree",ur:"غیر متفق"},{a:1,en:"Strongly disagree",ur:"بالکل غیر متفق"}];
var OPT_PSS=[{a:0,en:"Never",ur:"کبھی نہیں"},{a:1,en:"Almost never",ur:"شاذ و نادر"},{a:2,en:"Sometimes",ur:"کبھی کبھی"},{a:3,en:"Fairly often",ur:"اکثر"},{a:4,en:"Very often",ur:"بہت اکثر"}];
var OPT_AGR5=[{a:5,en:"Strongly agree",ur:"مکمل متفق"},{a:4,en:"Agree",ur:"متفق"},{a:3,en:"Neutral",ur:"درمیان"},{a:2,en:"Disagree",ur:"غیر متفق"},{a:1,en:"Strongly disagree",ur:"بالکل غیر متفق"}];
var OPT_GSE4=[{a:4,en:"Exactly true",ur:"بالکل درست"},{a:3,en:"Moderately true",ur:"کافی حد تک درست"},{a:2,en:"Hardly true",ur:"مشکل سے درست"},{a:1,en:"Not at all true",ur:"بالکل درست نہیں"}];
var OPT_SAT7=[{a:7,en:"Extremely satisfied",ur:"نہایت مطمئن"},{a:6,en:"Very satisfied",ur:"بہت مطمئن"},{a:5,en:"Somewhat satisfied",ur:"کسی حد تک مطمئن"},{a:4,en:"Mixed",ur:"ملا جلا"},{a:3,en:"Somewhat dissatisfied",ur:"کسی حد تک غیر مطمئن"},{a:2,en:"Very dissatisfied",ur:"بہت غیر مطمئن"},{a:1,en:"Extremely dissatisfied",ur:"نہایت غیر مطمئن"}];
var OPT_RDAS=[{a:5,en:"Always agree",ur:"ہمیشہ متفق"},{a:4,en:"Often agree",ur:"اکثر متفق"},{a:3,en:"Sometimes agree",ur:"کبھی کبھی متفق"},{a:2,en:"Rarely agree",ur:"شاذ ہی متفق"},{a:1,en:"Almost never agree",ur:"تقریباً کبھی متفق نہیں"},{a:0,en:"Never agree",ur:"کبھی متفق نہیں"}];
var FREQ5=[{a:4,en:"Always",ur:"ہمیشہ"},{a:3,en:"Usually",ur:"عموماً"},{a:2,en:"Sometimes",ur:"کبھی کبھی"},{a:1,en:"Rarely",ur:"شاذ ہی"},{a:0,en:"Never",ur:"کبھی نہیں"}];

var GRIT={
  id:"grit",type:"mean",cat:"self",badge:"val",next:"habits",mins:2,
  ur:"ثابت قدمی (Grit-S)",en:"Grit — Short Scale (Grit-S)",
  blurbUr:"جذبہ اور استقامت کا معروف مختصر پیمانہ — طویل مقاصد پر آپ کی توجہ اور محنت کتنی دیر قائم رہتی ہے۔",
  blurbEn:"The well-known short grit scale — how long your focus and effort stay with long-term goals.",
  noteUr:"ہر جملے پر بتائیں کہ وہ آپ سے کتنا ملتا ہے۔",noteEn:"For each statement, say how much it is like you.",
  opts:OPT_LIKE5,perMax:5,minPer:1,rev:[0,2,4,5],
  src:"Grit-S — Duckworth & Quinn, 2009",
  subs:[{ur:"تسلسلِ دلچسپی",en:"Consistency of interest",items:[0,2,4,5]},{ur:"محنت کی استقامت",en:"Perseverance of effort",items:[1,3,6,7]}],
  items:[
    {en:"New ideas and projects sometimes distract me from previous ones."},
    {en:"I finish whatever I begin."},
    {en:"I have been obsessed with a certain idea or project for a short time but later lost interest."},
    {en:"Setbacks don't discourage me."},
    {en:"I have difficulty maintaining my focus on projects that take more than a few months to complete."},
    {en:"I often set a goal but later choose to pursue a different one instead."},
    {en:"I am diligent."},
    {en:"I am a hard worker."}
  ],
  bands:[
    {max:2.99,tur:"توجہ بکھرنے کا مرحلہ",ten:"Working zone",xur:"اس وقت آپ کی دلچسپی اور محنت دونوں جلد سمت بدلتی ہیں۔ یہ صلاحیت کی کمی نہیں — اکثر مسئلہ یہ ہوتا ہے کہ مقصد بہت بڑا اور راستہ دھندلا ہے۔ ایک ہی مقصد، چھوٹے قدموں میں، آپ کی اصل طاقت کھول سکتا ہے۔",xen:"Right now both your interest and effort change direction quickly. This is not a lack of ability — usually the goal is too big and the path too foggy. One goal, in small steps, can unlock your real strength.",sur:"آپ نے اپنے نمونے کو دیانت سے دیکھا — یہی تبدیلی کی شرط ہے۔",sen:"You saw your pattern honestly — the condition for change.",wur:"ہر نیا خیال پچھلے مقصد کو کمزور کرتا ہے؛ انتخاب سے پہلے وقفہ رکھیں۔",wen:"Every new idea weakens the last goal; pause before switching.",gur:["ایک مقصد لکھ کر چنیں اور 30 دن اسی پر قائم رہیں — باقی خیالوں کو ایک الگ فہرست میں «بعد میں» لکھ کر بند کر دیں۔","روزانہ صرف 20 منٹ اسی مقصد پر — کم مگر روزانہ؛ تسلسل شدت سے بڑا ہوتا ہے۔","ہفتے کے آخر میں اپنی پیش رفت کاغذ پر دیکھیں؛ نظر آنے والی پیش رفت ہی استقامت کی خوراک ہے۔"],gen:["Write down ONE goal and stay with it for 30 days — park other ideas on a 'later' list.","Work on it just 20 minutes daily — small but daily; consistency beats intensity.","Review your progress on paper each weekend; visible progress feeds perseverance."]},
    {max:3.99,tur:"ثابت قدمی بن رہی ہے",ten:"Building",xur:"آپ میں ثابت قدمی کی بنیاد موجود ہے — آغاز بھی ہوتا ہے اور اکثر تکمیل بھی، مگر لمبے منصوبوں کے درمیان میں توجہ کمزور پڑ جاتی ہے۔ درمیانی مرحلے کو نظام سے جوڑنا آپ کی سب سے بڑی اگلی جیت ہوگی۔",xen:"The base of grit is there — you start, and often finish, but focus weakens in the long middle of projects. Connecting that middle phase to a system is your biggest next win.",sur:"مشکل آنے پر ہار نہ ماننا آپ کی پہچان بن رہا ہے۔",sen:"Not giving up when it gets hard is becoming your hallmark.",wur:"منصوبے کے درمیانی، بور مرحلے میں نیا مقصد لالچ دیتا ہے — اسی لمحے کے لیے پہلے سے منصوبہ رکھیں۔",wen:"In the boring middle of a project, a new goal tempts you — plan for that moment in advance.",gur:["اپنے بڑے مقصد کو سہ ماہی چھوٹے اہداف میں توڑیں — ہر حصے کی تکمیل ایک جشن ہو۔","مشکل ہفتے کے لیے «کم سے کم صورت» طے رکھیں: مصروف دن میں بھی 10 منٹ کی پیش رفت۔","ایک ساتھی یا کوچ کو اپنی پیش رفت کی خبر دیتے رہیں — نگرانی استقامت کو دگنا کرتی ہے۔"],gen:["Break your big goal into quarterly small targets — each finish is a celebration.","Set a 'minimum version' for hard weeks: even 10 minutes of progress on a busy day.","Report your progress to a partner or coach — accountability doubles perseverance."]},
    {max:5,tur:"ثابت قدمی مضبوط ہے",ten:"Strong grit",xur:"آپ کی دلچسپی بھی قائم رہتی ہے اور محنت بھی — یہی امتزاج لمبے مقاصد کو منزل تک لے جاتا ہے۔ اب سوال استقامت کا نہیں، سمت کا ہے: اس طاقت کو سب سے اہم مقصد پر لگائیں۔",xen:"Both your interest and your effort hold — the combination that carries long goals to their destination. The question now is not grit but direction: put this strength on your most important goal.",sur:"دھچکے آپ کو روکتے نہیں — یہ نایاب خوبی ہے۔",sen:"Setbacks do not stop you — a rare quality.",wur:"ثابت قدمی کبھی ضد بن سکتی ہے؛ غلط سمت پر ڈٹے رہنا بھی نقصان ہے — سمت کا جائزہ وقتاً فوقتاً لیں۔",wen:"Grit can turn into stubbornness; persisting in a wrong direction also costs — review your direction now and then.",gur:["اس سال کا ایک بڑا، بامعنی مقصد چنیں — آپ کی استقامت اسی کے لائق ہے۔","اپنا طریقہ کسی نوجوان یا ساتھی کو سکھائیں — سکھانا استقامت کو مزید گہرا کرتا ہے۔","ہر سہ ماہی میں ایک دن رکھ کر سمت کا جائزہ لیں: کیا یہی مقصد اب بھی درست ہے؟"],gen:["Choose one big, meaningful goal for this year — your grit deserves it.","Teach your method to a younger person or colleague — teaching deepens grit.","Keep one day each quarter to review direction: is this still the right goal?"]}
  ]
};
var MAAS={
  id:"maas",type:"mean",cat:"self",badge:"val",next:"coaching",mins:3,
  ur:"ذہنِ حاضر (MAAS)",en:"Mindful Attention Awareness Scale (MAAS)",
  blurbUr:"روزمرہ زندگی میں آپ کی توجہ کتنی حاضر رہتی ہے — یا دن خودکار انداز میں گزر جاتا ہے؟",
  blurbEn:"How present is your attention in daily life — or does the day pass on automatic pilot?",
  noteUr:"ہر تجربہ کتنی بار ہوتا ہے، وہ بتائیں۔",noteEn:"Say how often each experience happens to you.",
  opts:OPT_MAAS,perMax:6,minPer:1,rev:[],
  src:"MAAS — Brown & Ryan, 2003",
  items:[
    {en:"I could be experiencing some emotion and not be conscious of it until some time later."},
    {en:"I break or spill things because of carelessness, not paying attention, or thinking of something else."},
    {en:"I find it difficult to stay focused on what is happening in the present moment."},
    {en:"I tend to walk quickly to get where I am going without paying attention to what I experience along the way."},
    {en:"I tend not to notice feelings of physical tension or discomfort until they really grab my attention."},
    {en:"I forget a person's name almost as soon as I have been told it for the first time."},
    {en:"It seems I am 'running on automatic', without much awareness of what I am doing."},
    {en:"I rush through activities without being really attentive to them."},
    {en:"I get so focused on the goal I want to achieve that I lose touch with what I am doing right now to get there."},
    {en:"I do jobs or tasks automatically, without being aware of what I am doing."},
    {en:"I find myself listening to someone with one ear, doing something else at the same time."},
    {en:"I go places on 'automatic pilot' and then wonder why I went there."},
    {en:"I find myself preoccupied with the future or the past."},
    {en:"I find myself doing things without paying attention."},
    {en:"I snack without being aware that I am eating."}
  ],
  bands:[
    {max:2.99,tur:"توجہ بکھری ہوئی ہے",ten:"Scattered attention",xur:"آپ کے جوابات بتاتے ہیں کہ دن کا بڑا حصہ خودکار انداز میں گزرتا ہے — جسم یہاں، ذہن کہیں اور۔ یہ کمزوری نہیں، آج کے شور بھرے ماحول کی عام قیمت ہے؛ اچھی خبر یہ ہے کہ توجہ عضلے کی طرح مشق سے مضبوط ہوتی ہے۔",xen:"Your answers suggest much of the day passes on automatic pilot — body here, mind elsewhere. This is not a weakness; it is the common price of today's noisy environment. The good news: attention strengthens with practice, like a muscle.",sur:"آپ نے اپنی بکھری توجہ کو پہچانا — پہچان ہی حاضری کا پہلا لمحہ ہے۔",sen:"You noticed your scattered attention — noticing is the first moment of presence.",wur:"فون اور شور توجہ کے سب سے بڑے چور ہیں؛ ماحول بدلے بغیر مشق مشکل رہے گی۔",wen:"Phone and noise are attention's biggest thieves; practice stays hard without changing the environment.",gur:["کھانے کا پہلا نوالہ مکمل توجہ سے کھائیں — ذائقہ، خوشبو، ساخت۔ یہ روز کی سب سے آسان مشق ہے۔","فون کو دن میں تین مقررہ اوقات کے علاوہ دور رکھیں؛ ہر اطلاع توجہ کا ایک ٹکڑا لے جاتی ہے۔","چلتے ہوئے قدموں کی حس پر توجہ دیں — دو منٹ کی یہ مشق ذہن کو حال میں واپس لاتی ہے۔"],gen:["Eat the first bite of each meal with full attention — taste, smell, texture. The easiest daily practice.","Keep the phone away except at three fixed times a day; every notification takes a piece of attention.","While walking, attend to the feel of your steps — two minutes of this brings the mind back to the present."]},
    {max:4.49,tur:"توجہ معمول کی ہے",ten:"Ordinary attention",xur:"آپ کی توجہ اوسط درجے کی ہے — کبھی حاضر، کبھی بہکی ہوئی۔ یہی وہ حد ہے جہاں چھوٹی باقاعدہ مشق نمایاں فرق پیدا کرتی ہے، خاص کر سننے اور کھانے جیسے لمحات میں۔",xen:"Your attention is at an ordinary level — sometimes present, sometimes drifting. This is exactly the range where small regular practice makes a visible difference, especially in moments like listening and eating.",sur:"اہم لمحوں میں حاضر رہنے کی صلاحیت آپ کے پاس موجود ہے۔",sen:"You do have the ability to be present in important moments.",wur:"ملٹی ٹاسکنگ آپ کی حاضری کو خاموشی سے کھا رہی ہے — ایک وقت میں ایک کام آزمائیں۔",wen:"Multitasking quietly eats your presence — try one thing at a time.",gur:["بات چیت میں فون میز سے ہٹا کر رکھیں — سامنے والا پوری توجہ محسوس کرے گا۔","دن میں ایک کام طے کریں جو صرف پوری توجہ سے ہوگا — چائے، واک، یا ایک صفحہ پڑھنا۔","سونے سے پہلے دن کے تین لمحے یاد کریں جن میں آپ واقعی حاضر تھے — یہ مشق توجہ کو تربیت دیتا ہے۔"],gen:["In conversation, put the phone off the table — the other person will feel your full attention.","Pick one daily activity to do with complete attention — tea, a walk, or one page of reading.","Before sleep, recall three moments of the day when you were truly present — this trains attention."]},
    {max:6,tur:"توجہ حاضر و بیدار ہے",ten:"Present attention",xur:"آپ غیر معمولی طور پر حاضر ذہن ہیں — لمحے کو جینا اور سننا آپ کی عادت بن چکا ہے۔ یہ کیفیت رشتوں اور فیصلوں دونوں میں آپ کا سرمایہ ہے؛ اسے برقرار رکھنے کے لیے وہی معمولات جاری رکھیں جنہوں نے یہ بنائی۔",xen:"You are unusually present — living the moment and truly listening have become your habit. This state is capital in both relationships and decisions; keep the routines that built it.",sur:"حال میں رہنے کی یہ کیفیت آپ کی نمایاں طاقت ہے۔",sen:"This presence in the moment is your standout strength.",wur:"مصروف موسموں میں یہ مشق سب سے پہلے چھوٹتی ہے — اس کی حفاظت کا پہلے سے بندوبست رکھیں۔",wen:"In busy seasons this practice is dropped first — arrange its protection in advance.",gur:["اپنی حاضری کو خدمت میں لگائیں — کسی پریشان شخص کو پوری توجہ سے سننا ہی کافی مدد ہے۔","مشق کو ایک درجہ آگے بڑھائیں: مشکل گفتگو میں بھی حاضر رہنے کی کوشش کریں۔","یہ کیفیت کسی قریبی شخص کو سکھائیں — سکھانے سے مشق گہری ہوتی ہے۔"],gen:["Put your presence into service — listening fully to a troubled person is real help.","Take the practice one level up: stay present even in a difficult conversation.","Teach this state to someone close — teaching deepens practice."]}
  ]
};
var GQ6={
  id:"gq6",type:"scale",cat:"well",badge:"val",next:"coaching",mins:1,
  ur:"شکر گزاری (GQ-6)",en:"Gratitude Questionnaire (GQ-6)",
  blurbUr:"زندگی کی نعمتوں کو دیکھنے اور محسوس کرنے کا آپ کا فطری رجحان کتنا مضبوط ہے؟",
  blurbEn:"How strong is your natural tendency to notice and feel life's blessings?",
  noteUr:"",opts:OPT_AGR7,perMax:7,minPer:1,rev:[2,5],
  src:"GQ-6 — McCullough, Emmons & Tsang, 2002",
  items:[
    {en:"I have so much in life to be thankful for."},
    {en:"If I had to list everything that I felt grateful for, it would be a very long list."},
    {en:"When I look at the world, I don't see much to be grateful for."},
    {en:"I am grateful to a wide variety of people."},
    {en:"As I get older, I find myself more able to appreciate the people, events and situations that have been part of my life history."},
    {en:"Long amounts of time can go by before I feel grateful to something or someone."}
  ],
  bands:[
    {max:34,tur:"شکر گزاری پروان چڑھ رہی ہے",ten:"Gratitude is growing",xur:"اس وقت آپ کی نظر زیادہ تر اس پر ہے جو کمی ہے — یہ انسانی فطرت ہے، مگر اس عادت کو بدلا جا سکتا ہے۔ شکر گزاری احساس سے پہلے ایک مشق ہے: پہلے عمل آتا ہے، احساس پیچھے آتا ہے۔",xen:"Right now your eye rests mostly on what is missing — that is human nature, but the habit can change. Gratitude is a practice before it is a feeling: the action comes first, the feeling follows.",sur:"آپ نے اپنی اندرونی کیفیت کو سچائی سے دیکھا۔",sen:"You looked at your inner state truthfully.",wur:"مقایسہ (دوسروں کی زندگی سے) شکر گزاری کا سب سے بڑا دشمن ہے — اس محرک کو پہچانیں۔",wen:"Comparison with others' lives is gratitude's biggest enemy — notice that trigger.",gur:["سونے سے پہلے تین چیزیں لکھیں جن پر آج شکر ممکن ہوا — چھوٹی سے چھوٹی بھی چلے گی۔","اس ہفتے ایک شخص کو زبانی یا پیغام سے شکریہ کہیں — مخصوص وجہ کے ساتھ۔","کھانے سے پہلے ایک لمحہ رک کر سوچیں یہ رزق کن کن ہاتھوں سے گزر کر آیا۔"],gen:["Before sleep, write three things from today that allowed gratitude — however small.","This week, thank one person aloud or by message — with a specific reason.","Before eating, pause a moment and think of the many hands this food passed through."]},
    {max:41,tur:"شکر گزار دل",ten:"A thankful heart",xur:"آپ میں شکر گزاری کا صحت مند رجحان موجود ہے — نعمتیں آپ کو نظر بھی آتی ہیں اور محسوس بھی ہوتی ہیں۔ اسے روزمرہ کے معمول میں بدلنا اسے مزید گہرا کرے گا۔",xen:"You have a healthy tendency to gratitude — blessings are both seen and felt by you. Turning it into a daily routine will deepen it further.",sur:"لوگوں کی قدر کرنا آپ کی نمایاں خوبی ہے۔",sen:"Appreciating people is your clear quality.",wur:"مشکل دنوں میں یہ نظر کمزور پڑتی ہے — انہی دنوں کے لیے مشق پہلے سے طے رکھیں۔",wen:"On hard days this sight weakens — keep the practice pre-decided for those days.",gur:["ہفتے میں ایک «شکر کا خط» یا طویل پیغام کسی ایسے شخص کو لکھیں جس کا احسان ابھی تک زبانی ادا نہیں ہوا۔","خاندان کے ساتھ کھانے پر ہر فرد ایک نعمت بتائے — یہ بچوں تک بھی منتقل ہوتا ہے۔","دعا میں مانگنے سے پہلے گنانا شروع کریں — ترتیب بدلنے سے کیفیت بدلتی ہے۔"],gen:["Once a week, write a 'gratitude letter' or long message to someone whose kindness you never thanked aloud.","At a family meal, let each person name one blessing — it passes to the children too.","In prayer, begin by counting before asking — changing the order changes the state."]},
    {max:42,tur:"گہری شکر گزاری",ten:"Deeply grateful",xur:"آپ کی شکر گزاری غیر معمولی گہرائی رکھتی ہے — زندگی کے ہر مرحلے کو آپ نعمت کی نظر سے دیکھتے ہیں۔ یہ روحانی و نفسیاتی دونوں لحاظ سے بڑا سرمایہ ہے؛ اب اسے دوسروں کے لیے آسانی کا ذریعہ بنانا اس کی بہترین صورت ہے۔",xen:"Your gratitude has unusual depth — you see every phase of life through the lens of blessing. This is capital both spiritually and psychologically; its finest form now is becoming a source of ease for others.",sur:"نعمتوں کو پہچاننا اور ان کے دینے والوں کو یاد رکھنا آپ کی پہچان ہے۔",sen:"Recognising blessings and remembering their givers is your hallmark.",wur:"شکر گزاری کو خودکار نہ ہونے دیں — نئی نعمتوں کو بھی شعوری طور پر نوٹ کرتے رہیں۔",wen:"Do not let gratitude become automatic — keep consciously noting new blessings too.",gur:["اپنی شکر گزاری کو خدمت میں بدلیں — کسی ایک شخص کی مشکل آسان کرنا اس ہفتے کا ہدف رکھیں۔","زندگی کی کہانی کے مشکل ابواب پر بھی شکر کے پہلو لکھیں — یہ گہرائی کو پختہ کرتا ہے۔","بچوں یا نوجوانوں کو شکر کی یہ نظر سکھائیں — یہ سب سے قیمتی ورثہ ہے۔"],gen:["Turn your gratitude into service — make easing one person's difficulty this week's goal.","Write the gratitude angle even on life's hard chapters — it matures the depth.","Teach this lens of gratitude to children or youth — it is the most valuable inheritance."]}
  ]
};

var PSS={
  id:"pss",type:"scale",cat:"well",badge:"val",next:"habits",mins:2,
  ur:"ذہنی دباؤ پیمانہ (PSS-10)",en:"Perceived Stress Scale (PSS-10)",
  blurbUr:"گزشتہ مہینے میں آپ نے اپنی زندگی کو کتنا غیر متوقع، بے قابو اور بوجھل محسوس کیا — اس کا معروف پیمانہ۔ یہ دباؤ کے ادراک کا جائزہ ہے، کوئی طبی اسکرین نہیں۔",
  blurbEn:"The well-known scale of how unpredictable, uncontrollable and overloaded you found your life in the last month. A stress-appraisal check, not a medical screen.",
  noteUr:"Standard published scale — demo use · گزشتہ ایک مہینے کے بارے میں جواب دیں۔",noteEn:"Standard published scale — demo use · Please answer about the last month.",
  opts:OPT_PSS,perMax:4,minPer:0,rev:[3,4,6,7],
  src:"PSS-10 — Cohen, Kamarck & Mermelstein, 1983",
  items:[
    {en:"In the last month, how often have you been upset because of something that happened unexpectedly?"},
    {en:"In the last month, how often have you felt that you were unable to control the important things in your life?"},
    {en:"In the last month, how often have you felt nervous and 'stressed'?"},
    {en:"In the last month, how often have you felt confident about your ability to handle your personal problems?"},
    {en:"In the last month, how often have you felt that things were going your way?"},
    {en:"In the last month, how often have you found that you could not cope with all the things that you had to do?"},
    {en:"In the last month, how often have you been able to control irritations in your life?"},
    {en:"In the last month, how often have you felt that you were on top of things?"},
    {en:"In the last month, how often have you been angered because of things that were outside of your control?"},
    {en:"In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"}
  ],
  bands:[
    {max:13,tur:"دباؤ کم ہے",ten:"Low perceived stress",xur:"گزشتہ مہینے آپ نے زندگی کو زیادہ تر اپنے قابو میں محسوس کیا۔ یہ توازن آپ کی عادات اور ماحول کی مشترکہ پیداوار ہے — اس کی حفاظت کریں، کیونکہ دباؤ خبر دے کر نہیں آتا۔",xen:"Last month you mostly felt life was in your control. This balance is the joint product of your habits and environment — protect it, because stress does not announce itself.",sur:"مشکلات کے باوجود قابو کا احساس آپ کی طاقت ہے۔",sen:"A sense of control despite difficulties is your strength.",wur:"آرام کو «فارغ وقت» سمجھ کر قربان نہ کریں — یہی آپ کے توازن کی بنیاد ہے۔",wen:"Do not sacrifice rest as 'spare time' — it is the base of your balance.",gur:["اپنے پرسکون معمولات کی فہرست لکھ لیں — مصروف موسم میں یہی فہرست آپ کی حفاظت کرے گی۔","ایک بھاری ذمہ داری پہلے سے کسی کو سونپنے یا مؤخر کرنے کا بندوبست سوچ کر رکھیں۔","اس توازن کو کسی اور کی مدد میں لگائیں — سہارا دینا بھی توازن بڑھاتا ہے۔"],gen:["Write down your calming routines — in a busy season this list will protect you.","Plan in advance to delegate or delay one heavy responsibility.","Use this balance to support someone else — giving support also grows balance."]},
    {max:26,tur:"دباؤ درمیانہ ہے",ten:"Moderate perceived stress",xur:"آپ کا دباؤ اس حد میں ہے جہاں زیادہ تر لوگ کام تو چلا لیتے ہیں مگر اندر سے تھکتے رہتے ہیں۔ یہی وہ مرحلہ ہے جہاں چھوٹے نظام — نیند، ترتیب، انکار کی مشق — سب سے بڑا فرق ڈالتے ہیں۔ یہ آپ کے کمزور نہیں، نظام کے سگنل ہیں۔",xen:"Your stress is in the range where most people keep functioning but tire inside. This is exactly the stage where small systems — sleep, order, practising 'no' — make the biggest difference. These are signals about the system, not about your worth.",sur:"آپ مسائل کو دیکھ بھی رہے ہیں اور سنبھال بھی رہے ہیں۔",sen:"You are both seeing the problems and handling them.",wur:"سب کچھ خود اٹھانے کی عادت دباؤ کو دائمی بناتی ہے — ایک بوجھ آج ہی بانٹیں۔",wen:"Carrying everything alone makes stress permanent — share one load today.",gur:["سونے کا وقت مقرر کریں اور فون اس سے ایک گھنٹہ پہلے بند — نیند دباؤ کا پہلا علاج ہے۔","ذہن میں گھومتی ذمہ داریوں کی مکمل فہرست کاغذ پر اتاریں اور ہر ایک کے آگے اگلا چھوٹا قدم لکھیں۔","اس ہفتے ایک غیر ضروری ذمہ داری کو مؤدبانہ انکار یا مؤخر کریں۔"],gen:["Fix a sleep time and switch the phone off an hour before — sleep is stress's first treatment.","Write the full list of circling responsibilities on paper, with the next small step beside each.","This week, politely decline or delay one unnecessary responsibility."]},
    {max:40,tur:"دباؤ زیادہ ہے",ten:"High perceived stress",xur:"گزشتہ مہینہ آپ نے زندگی کو بڑی حد تک بے قابو اور بوجھل محسوس کیا۔ یہ سننے کے قابل حالت ہے — اسے تنہا سہنا اور بڑھنے دینا درست نہیں۔ پہلا قدم بوجھ کم کرنا اور کسی قابلِ اعتماد، اہل شخص سے بات کرنا ہے؛ یہ کمزوری نہیں، دانائی ہے۔",xen:"Last month you felt life to be largely uncontrollable and overloaded. This state deserves to be heard — enduring it alone and letting it grow is not right. The first step is reducing the load and talking to a trusted, qualified person; that is wisdom, not weakness.",sur:"آپ نے تلخ کیفیت کو سچائی سے مانا — یہی بحالی کا دروازہ ہے۔",sen:"You admitted a hard state truthfully — that is the door to recovery.",wur:"اسی کیفیت میں بڑے فیصلے اور بڑے وعدے نہ کریں — پہلے سانس، نیند اور سہارا۔",wen:"Do not make big decisions or promises in this state — first breath, sleep and support.",gur:["آج ہی ایک بھاری بوجھ لکھ کر کسی قابلِ اعتماد شخص سے بانٹیں — مدد مانگنا عملی قدم ہے، شکایت نہیں۔","اگلے تین دن صرف بنیادیں: نیند، کھانا، چہل قدمی — باقی سب انتظار کر سکتا ہے۔","اگر یہ کیفیت لمبی چل رہی ہے تو کسی اہل کوچ یا معالج سے بات کا وقت طے کریں — AIDE کی ڈسکوری کال اسی کے لیے ہے۔"],gen:["Today, write down one heavy load and share it with a trusted person — asking for help is an action, not a complaint.","For the next three days, only the basics: sleep, food, a walk — everything else can wait.","If this state has lasted long, book a talk with a qualified coach or counsellor — AIDE's discovery call exists for this."]}
  ]
};
var BRS={
  id:"brs",type:"mean",cat:"well",badge:"val",next:"coaching",mins:1,
  ur:"لچک (Brief Resilience Scale)",en:"Brief Resilience Scale (BRS)",
  blurbUr:"مشکل وقت کے بعد آپ کتنی جلدی سنبھل جاتے ہیں — لچک کا مختصر معروف پیمانہ۔",
  blurbEn:"How quickly you bounce back after hard times — the brief, well-known resilience scale.",
  noteUr:"",opts:OPT_AGR5,perMax:5,minPer:1,rev:[1,3,5],
  src:"BRS — Smith et al., 2008",
  items:[
    {en:"I tend to bounce back quickly after hard times."},
    {en:"I have a hard time making it through stressful events."},
    {en:"It does not take me long to recover from a stressful event."},
    {en:"It is hard for me to snap back when something bad happens."},
    {en:"I usually come through difficult times with little trouble."},
    {en:"I tend to take a long time to get over set-backs in my life."}
  ],
  bands:[
    {max:2.99,tur:"لچک ابھی کمزور ہے",ten:"Low resilience range",xur:"مشکلات کے بعد سنبھلنے میں آپ کو زیادہ وقت لگتا ہے اور قیمت بھی زیادہ پڑتی ہے۔ لچک پیدائشی خوبی نہیں — یہ نیند، سہارے، معنی اور چھوٹی جیتوں سے بنتی ہے۔ اس پر منظم کام سب سے زیادہ منافع دیتا ہے۔",xen:"After difficulties, recovery takes you longer and costs you more. Resilience is not a birth trait — it is built from sleep, support, meaning and small wins. Organised work here pays the highest return.",sur:"آپ اپنی بحالی کے نمونے کو صاف دیکھ رہے ہیں۔",sen:"You can see your recovery pattern clearly.",wur:"مشکل میں خود کو تنہا کرنا بحالی کو اور لمبا کرتا ہے — ایک سہارا پہلے سے طے رکھیں۔",wen:"Isolating yourself in difficulty lengthens recovery — pre-decide one support.",gur:["اپنی پچھلی ایک مشکل لکھیں جس سے آپ نکل آئے تھے — ثبوت موجود ہے کہ آپ سنبھل سکتے ہیں۔","مشکل دنوں کے لیے «بحالی فہرست» بنائیں: نیند، واک، ایک شخص، ایک دعا/ذکر کا معمول۔","آج ایک بہت چھوٹا کام مکمل کریں — چھوٹی جیت بحالی کا ایندھن ہے۔"],gen:["Write down one past difficulty you came through — proof exists that you can recover.","Make a 'recovery list' for hard days: sleep, a walk, one person, one prayer/dhikr routine.","Complete one very small task today — small wins are recovery's fuel."]},
    {max:4.30,tur:"لچک معمول کی حد میں ہے",ten:"Normal resilience range",xur:"آپ کی بحالی کی صلاحیت عام صحت مند حد میں ہے — آپ گرتے بھی ہیں اور اٹھتے بھی ہیں۔ اسے مزید تیز اور کم قیمتی بنانا اگلا مرحلہ ہے، جو معمولات سے آتا ہے۔",xen:"Your recovery ability is in the normal healthy range — you fall and you rise. Making it faster and less costly is the next stage, and it comes from routines.",sur:"دھچکے کے بعد واپسی آپ کی عادت میں شامل ہے۔",sen:"Coming back after a setback is part of your habit.",wur:"بڑی مشکل میں بحالی پھر بھی لمبی ہو جاتی ہے — اس پیمانے کے لیے سہارا پہلے سے ترتیب دیں۔",wen:"In a big difficulty recovery still lengthens — arrange support for that scale in advance.",gur:["بحالی کا اپنا نمونہ لکھیں: کون سی تین چیزیں آپ کو ہمیشہ سنبھالتی ہیں؟ انہیں معمول بنائیں۔","ہفتے میں ایک مشکل مگر چھوٹا کام شعوری طور پر چنیں — لچک بھی مشق سے بڑھتی ہے۔","ایک «مشکل کے دوست» سے باقاعدہ رابطہ رکھیں — سہارا بحران سے پہلے بنتا ہے۔"],gen:["Write your own recovery pattern: which three things always restore you? Make them routines.","Once a week, deliberately choose one hard but small task — resilience also grows by practice.","Stay in regular contact with one 'hard-times friend' — support is built before the crisis."]},
    {max:5,tur:"لچک غیر معمولی ہے",ten:"High resilience range",xur:"آپ مشکلات سے تیزی سے اور کم قیمت پر نکل آتے ہیں — یہ نایاب صلاحیت عموماً تجربے، معنی اور مضبوط سہاروں سے بنتی ہے۔ اس کا بہترین استعمال اب دوسروں کے لیے سہارا بننا ہے۔",xen:"You come through difficulties quickly and at low cost — a rare ability usually built from experience, meaning and strong supports. Its best use now is becoming support for others.",sur:"جلد بحالی اور توازن آپ کی پہچان ہے۔",sen:"Quick recovery and balance are your hallmark.",wur:"اپنی لچک کو لا محدود نہ سمجھیں — بڑے مسلسل بوجھ میں آرام پھر بھی فرض ہے۔",wen:"Do not treat your resilience as unlimited — under long loads, rest is still a duty.",gur:["اپنی بحالی کا طریقہ کسی جدوجہد کرتے شخص کو سکھائیں — رہنمائی لچک کو بڑھاتی ہے۔","زندگی کے مشکل ابواب کا سبق لکھ کر محفوظ کریں — یہ آپ کی اگلی نسل کا سرمایہ ہے۔","ایک بڑا بامعنی چیلنج چنیں — آپ کی لچک اسی کے لائق ہے۔"],gen:["Teach your recovery method to someone who is struggling — mentoring grows resilience.","Write down the lessons of life's hard chapters — they are capital for the next generation.","Choose one big, meaningful challenge — your resilience deserves it."]}
  ]
};
var GSE={
  id:"gse",type:"scale",cat:"well",badge:"val",next:"coaching",mins:2,
  ur:"خود اثری (GSE)",en:"General Self-Efficacy Scale (GSE)",
  blurbUr:"مشکل کاموں اور غیر متوقع حالات سے نمٹنے کی اپنی صلاحیت پر آپ کا اعتماد — شوارزر کا معروف پیمانہ۔",
  blurbEn:"Your confidence in handling difficult tasks and unexpected situations — Schwarzer's well-known scale.",
  noteUr:"",opts:OPT_GSE4,perMax:4,minPer:1,rev:[],
  src:"GSE — Schwarzer & Jerusalem, 1995",
  items:[
    {en:"I can always manage to solve difficult problems if I try hard enough."},
    {en:"If someone opposes me, I can find the means and ways to get what I want."},
    {en:"It is easy for me to stick to my aims and accomplish my goals."},
    {en:"I am confident that I could deal efficiently with unexpected events."},
    {en:"Thanks to my resourcefulness, I know how to handle unforeseen situations."},
    {en:"I can solve most problems if I invest the necessary effort."},
    {en:"I can remain calm when facing difficulties because I can rely on my coping abilities."},
    {en:"When I am confronted with a problem, I can usually find several solutions."},
    {en:"If I am in trouble, I can usually think of a solution."},
    {en:"I can usually handle whatever comes my way."}
  ],
  bands:[
    {max:25,tur:"خود اثری پروان چڑھ رہی ہے",ten:"Self-efficacy is growing",xur:"اس وقت اپنی صلاحیت پر آپ کا اعتماد کمزور پڑا ہے — اکثر کسی ناکامی یا لمبے دباؤ کے بعد۔ اعتماد باتوں سے نہیں، چھوٹی مکمل جیتوں کے ثبوت سے بنتا ہے؛ وہیں سے آغاز کریں۔",xen:"Right now your confidence in your own ability has weakened — often after a failure or long pressure. Confidence is built not by words but by evidence of small completed wins; start exactly there.",sur:"آپ نے اپنے اعتماد کی اصل حالت دیانت سے دیکھی۔",sen:"You saw the true state of your confidence honestly.",wur:"اپنے آپ کو «میں کر ہی نہیں سکتا» کے فیصلے سے بچائیں — یہ جملہ ثبوت نہیں، عادت ہے۔",wen:"Avoid the verdict 'I just can't' — that sentence is a habit, not evidence.",gur:["اس ہفتے تین چھوٹے کام چنیں جو یقینی طور پر مکمل ہو سکیں — اور ہر تکمیل لکھیں۔","ایک کام منتخب کریں جو آپ پہلے کر چکے ہیں؛ اسی کی یاد اعتماد کا پہلا ثبوت ہے۔","موازنہ بند کریں — دوسروں کی کامیابی آپ کی صلاحیت کا پیمانہ نہیں۔"],gen:["This week pick three small tasks you can certainly finish — and write down each completion.","Choose one thing you have done before; its memory is the first evidence of confidence.","Stop comparing — others' success is not the measure of your ability."]},
    {max:34,tur:"خود اثری مستحکم ہے",ten:"Steady self-efficacy",xur:"آپ کی خود اثری صحت مند درمیانی حد میں ہے — مسئلہ آئے تو آپ حل کی طرف بڑھتے ہیں۔ اسے اگلی سطح پر لے جانے کا راستہ قدرے بڑے، مگر سوچے سمجھے چیلنجز ہیں۔",xen:"Your self-efficacy is in the healthy middle range — when a problem comes, you move toward solutions. The way to the next level is somewhat bigger, but deliberate, challenges.",sur:"مشکل میں حل تلاش کرنا آپ کی عادت ہے۔",sen:"Seeking solutions in difficulty is your habit.",wur:"بہت بڑا چیلنج یکدم لینا اعتماد کو دھچکا دے سکتا ہے — سیڑھی قدم بہ قدم چڑھیں۔",wen:"Taking a huge challenge at once can dent confidence — climb the stairs step by step.",gur:["ایک ایسا ہدف چنیں جو موجودہ سطح سے ذرا سا اوپر ہو — «مشکل مگر ممکن» کا علاقہ۔","ناکامی کا جائزہ عمل پر رکھیں، ذات پر نہیں: «طریقہ غلط تھا» — «میں غلط ہوں» نہیں۔","اپنی مکمل جیتوں کی فہرست (win list) بنانا شروع کریں اور مشکل دن میں پڑھیں۔"],gen:["Choose a goal slightly above your current level — the 'hard but possible' zone.","Review failure on the method, not the self: 'the approach was wrong' — not 'I am wrong'.","Start a written win-list and read it on hard days."]},
    {max:40,tur:"خود اثری مضبوط ہے",ten:"Strong self-efficacy",xur:"آپ کو اپنی صلاحیت پر گہرا اعتماد ہے اور مشکلات آپ کے لیے رکاوٹ کے بجائے مسئلہ حل کرنے کا موقع ہیں۔ اس طاقت کی بہترین صورت قیادت اور دوسروں کا اعتماد بنانا ہے۔",xen:"You have deep confidence in your ability, and difficulties are problem-solving opportunities rather than walls. The finest form of this strength is leadership and building others' confidence.",sur:"غیر متوقع حالات میں سکون اور حل — آپ کی پہچان ہے۔",sen:"Calm and solutions in unexpected situations are your hallmark.",wur:"اعتماد کبھی تیاری کی جگہ نہ لے لے — بڑے کام میں بھی احتیاط برقرار رکھیں۔",wen:"Do not let confidence replace preparation — keep care even in big tasks.",gur:["ایک بڑا، بامعنی ہدف اٹھائیں جس سے دوسروں کا بھی بھلا ہو۔","اپنے حل تلاش کرنے کا طریقہ کسی نوجوان کو سکھائیں — اعتماد منتقل بھی ہوتا ہے۔","مشکل فیصلوں کے بعد مختصر جائزہ لکھیں — یہ عادت اعتماد کو حکمت میں بدلتی ہے۔"],gen:["Take up one big, meaningful goal that also benefits others.","Teach your problem-solving method to a young person — confidence is transferable.","After hard decisions, write a short review — this habit turns confidence into wisdom."]}
  ]
};
var KANSAS={
  id:"kansas",type:"scale",cat:"rel",badge:"val",next:"homes",mins:1,
  ur:"ازدواجی تسلی (Kansas)",en:"Kansas Marital Satisfaction Scale",
  blurbUr:"صرف تین سوال — مگر ازدواجی زندگی کی مجموعی تسلی کا پرکھا ہوا، معروف پیمانہ۔",
  blurbEn:"Only three questions — but a well-tested, well-known measure of overall marital satisfaction.",
  noteUr:"",opts:OPT_SAT7,perMax:7,minPer:1,rev:[],
  src:"Kansas Marital Satisfaction Scale — Schumm et al., 1983",
  items:[
    {en:"I am satisfied with my marriage.",ur:"میں اپنی شادی سے مطمئن ہوں۔"},
    {en:"I am satisfied with my relationship with my spouse.",ur:"میں اپنے جیون ساتھی کے ساتھ اپنے تعلق سے مطمئن ہوں۔"},
    {en:"I am satisfied with my spouse as a partner.",ur:"میں اپنے جیون ساتھی سے بطور شریکِ زندگی مطمئن ہوں۔"}
  ],
  bands:[
    {max:11,tur:"رشتہ تناؤ میں ہے",ten:"The relationship is strained",xur:"آپ کے جوابات بتاتے ہیں کہ اس وقت ازدواجی زندگی میں تسلی کم اور بوجھ زیادہ ہے۔ اسے نظر انداز کرنا یا صرف وقت پر چھوڑ دینا عام طور پر کام نہیں کرتا — نرم مگر صاف گفتگو اور ضرورت پڑے تو اہل رہنمائی، یہی درست آغاز ہے۔",xen:"Your answers show that right now satisfaction in the marriage is low and the load is high. Ignoring it or leaving it to time rarely works — a gentle but clear conversation, and qualified guidance if needed, is the right start.",sur:"آپ نے سب سے نازک سچ کو دیانت سے دیکھا — یہ ہمت ہے۔",sen:"You faced the most delicate truth honestly — that is courage.",wur:"تلخی میں بڑے فیصلے (علیحدگی، دوسری شادی جیسے) نہ کریں — پہلے وضاحت اور سہارا۔",wen:"Do not make big decisions in bitterness — first clarity and support.",gur:["اس ہفتے ایک پرسکون وقت چن کر صرف سننے کی ملاقات رکھیں — الزام نہیں، صرف ایک دوسرے کی کیفیت۔","ایک چھوٹی چیز لکھیں جو آپ ساتھی کے لیے آج آسان کر سکتے ہیں — رشتے چھوٹے عمل سے پلٹتے ہیں۔","رہنمائی کو کمزوری نہ سمجھیں — Strong Homes یا کوچنگ کا دروازہ اسی مرحلے کے لیے ہے۔"],gen:["This week, choose one calm time for a listening-only meeting — no blame, just each other's state.","Write one small thing you can make easier for your spouse today — relationships turn on small acts.","Do not treat guidance as weakness — Strong Homes or coaching exists for exactly this stage."]},
    {max:16,tur:"رشتہ ملا جلا ہے",ten:"A mixed relationship",xur:"رشتے میں تسلی اور شکوہ ساتھ ساتھ چل رہے ہیں — کچھ بنیادیں مضبوط، کچھ جگہیں رستی ہوئی۔ یہی وہ مرحلہ ہے جہاں بروقت توجہ رشتے کو اچھے خاصے مقام پر لے جا سکتی ہے۔",xen:"Satisfaction and complaint are walking side by side in the relationship — some foundations strong, some places leaking. This is the stage where timely attention can take the relationship to a genuinely good place.",sur:"محبت اور تعلق کی بنیاد اب بھی موجود ہے۔",sen:"The base of love and connection still exists.",wur:"رستے ہوئے پہلوؤں کو «وقت ٹھیک کر دے گا» پر نہ چھوڑیں — بات کریں۔",wen:"Do not leave the leaking areas to 'time will fix it' — talk.",gur:["ہر ہفتے 20 منٹ کی «رشتہ ملاقات» طے کریں — موبائل بند، موضوع صرف ہم دونوں۔","شکایات کو فہرست کے بجائے ایک ایک کر کے، نرم آغاز کے ساتھ پیش کریں۔","ایک مشترکہ خوشگوار سرگرمی دوبارہ شروع کریں جو کبھی آپ دونوں کی پہچان تھی۔"],gen:["Fix a weekly 20-minute 'relationship meeting' — phones off, topic only the two of you.","Present complaints one at a time with a soft start, not as a list.","Restart one shared pleasant activity that was once your signature."]},
    {max:21,tur:"رشتہ مطمئن ہے",ten:"A satisfied relationship",xur:"آپ اپنی ازدواجی زندگی سے مطمئن ہیں — یہ تسلی عموماً روز کی چھوٹی قدر، سننے اور نرم رویے سے بنتی ہے۔ اسے برقرار رکھنا اور گہرا کرنا آپ کے اگلے مرحلے کا نام ہے۔",xen:"You are satisfied with your married life — this contentment is usually built from daily small appreciation, listening and gentleness. Keeping it and deepening it is the name of your next stage.",sur:"قدر اور نرمی آپ کے رشتے کی بنیاد ہیں۔",sen:"Appreciation and gentleness are your relationship's base.",wur:"تسلی سستی میں بدل سکتی ہے — اچھے معمولات کو خودکار نہ ہونے دیں۔",wen:"Satisfaction can slide into complacency — do not let good routines become automatic.",gur:["ساتھی کو آج ایک مخصوص خوبی بتا کر شکریہ کہیں — عمومی نہیں، ٹھوس۔","سال میں ایک «رشتے کا جائزہ دن» رکھیں: کیا اچھا ہوا، اگلا قدم کیا؟","اپنے تجربے سے کسی نوجوان جوڑے کی رہنمائی کریں — اچھے رشتے آگے بھی بڑھتے ہیں۔"],gen:["Today, thank your spouse for one specific quality — concrete, not general.","Keep one 'relationship review day' a year: what went well, what's next?","Guide a young couple from your experience — good relationships also grow forward."]}
  ]
};

var RDAS={
  id:"rdas",type:"subtotal",cat:"rel",badge:"val",next:"homes",mins:3,
  ur:"رشتہ ہم آہنگی (RDAS)",en:"Relationship Adjustment (RDAS-based)",
  blurbUr:"RDAS کی بنیاد پر — ہم آہنگی، تسلی اور یکجائی: رشتے کے تین ستونوں کا جائزہ۔ یہ ڈیمو سادہ اسکورنگ استعمال کرتا ہے؛ اصل RDAS کے مخلوط فارمیٹ پروڈکشن نسخے میں آئیں گے۔",
  blurbEn:"Based on the RDAS — consensus, satisfaction and cohesion: the three pillars of a relationship. This demo uses simplified scoring; the production version will use the RDAS's exact mixed formats.",
  noteUr:"RDAS بنیاد پر — ڈیمو سادہ اسکورنگ۔ ہر جملے سے آپ کس حد تک متفق ہیں؟",noteEn:"RDAS-based — demo simplified scoring. How much do you agree with each statement?",
  opts:OPT_RDAS,perMax:5,minPer:0,rev:[],
  src:"RDAS — Busby, Christensen, Crane & Larson, 1995 · Demo simplified scoring",
  subs:[{ur:"ہم آہنگی",en:"Consensus",items:[0,1,2,3,4,5]},{ur:"تسلی",en:"Satisfaction",items:[6,7,8,9]},{ur:"یکجائی",en:"Cohesion",items:[10,11,12,13]}],
  items:[
    {en:"We agree on our philosophy of life."},
    {en:"We agree on how we show affection to each other."},
    {en:"We agree when making major decisions."},
    {en:"We share the same core values."},
    {en:"We share the same aims and goals in life."},
    {en:"We are happy with the amount of time we spend together."},
    {en:"If I could choose again, I would choose the same partner."},
    {en:"We rarely quarrel."},
    {en:"We do not get on each other's nerves."},
    {en:"We never discuss ending this relationship."},
    {en:"We take part in outside interests and activities together."},
    {en:"We have stimulating exchanges of ideas with each other."},
    {en:"We work together on projects or tasks."},
    {en:"We calmly discuss things together."}
  ],
  bands:[
    {max:39,tur:"رشتے کو توجہ درکار ہے",ten:"The relationship needs attention",xur:"تینوں ستونوں — ہم آہنگی، تسلی اور یکجائی — میں سے کئی کمزور نظر آ رہے ہیں۔ یہ فیصلہ نہیں، نقشہ ہے: سب سے کمزور ستون ہی پہلی توجہ کا حق دار ہے، اور بروقت رہنمائی رشتوں کو حیران کن حد تک سنوار سکتی ہے۔",xen:"Several of the three pillars — consensus, satisfaction, cohesion — look weak. This is not a verdict, it is a map: the weakest pillar deserves the first attention, and timely guidance can repair relationships to a surprising degree.",sur:"آپ نے رشتے کا پورا نقشہ دیانت سے دیکھا۔",sen:"You looked at the whole map of the relationship honestly.",wur:"ہر مسئلہ ایک ساتھ اٹھانا مغلوب کر دے گا — ایک ستون، ایک قدم۔",wen:"Raising every issue at once will overwhelm — one pillar, one step.",gur:["سب سے کمزور ستون (نیچے چارٹ میں) چنیں اور اسی پر ایک چھوٹی تبدیلی اس ہفتے آزمائیں۔","روزانہ 10 منٹ کی پرسکون گفتگو طے کریں — موضوع روزمرہ، شکایت نہیں۔","اگر تلخی زیادہ ہے تو کسی اہل ثالث/کوچ کو شامل کریں — یہی وہ مرحلہ ہے جس کے لیے Strong Homes بنا ہے۔"],gen:["Pick the weakest pillar (in the chart below) and try one small change in it this week.","Fix 10 minutes of calm daily conversation — everyday topics, not complaints.","If bitterness is high, bring in a qualified mediator/coach — this is the stage Strong Homes is built for."]},
    {max:54,tur:"رشتہ کام کر رہا ہے",ten:"A working relationship",xur:"رشتہ مجموعی طور پر چل رہا ہے — کچھ ستون مضبوط، کچھ پر کام باقی ہے۔ درمیانی حالت کی خوبی یہ ہے کہ تھوڑی منظم توجہ اسے واضح اچھائی میں بدل سکتی ہے۔",xen:"Overall the relationship is working — some pillars strong, some still needing work. The beauty of the middle state is that a little organised attention can turn it into clear goodness.",sur:"یکجائی اور ساتھ کا احساس آپ کی بنیاد ہے۔",sen:"Togetherness and companionship are your base.",wur:"کمزور ستون کو «اتنا برا بھی نہیں» کہہ کر مؤخر نہ کریں — چھوٹی دراڑیں بڑھتی ہیں۔",wen:"Do not postpone the weak pillar with 'it's not that bad' — small cracks grow.",gur:["مشترکہ سرگرمیوں میں ایک نئی چیز شامل کریں — یکجائی ارادے سے بڑھتی ہے۔","فیصلوں سے پہلے مشورے کا معمول مضبوط کریں — ہم آہنگی وہیں سے بنتی ہے۔","مہینے میں ایک بار تینوں ستونوں کا خود جائزہ لیں: کہاں بہتری آئی؟"],gen:["Add one new thing to your shared activities — cohesion grows by intention.","Strengthen the habit of consulting before decisions — consensus is built there.","Once a month, review the three pillars yourselves: where did things improve?"]},
    {max:70,tur:"رشتہ ہم آہنگ ہے",ten:"A harmonious relationship",xur:"ہم آہنگی، تسلی اور یکجائی — تینوں ستون مضبوط کھڑے ہیں۔ ایسا رشتہ روز کی چھوٹی قدر اور مسلسل رابطے سے بنتا ہے؛ اسے سنبھالنا اور اس سے دوسروں کو روشناس کرانا اب آپ کا خوبصورت مرحلہ ہے۔",xen:"Consensus, satisfaction and cohesion — all three pillars stand strong. Such a relationship is built from daily small appreciation and constant connection; guarding it, and letting it inspire others, is your beautiful next stage.",sur:"ساتھی کے ساتھ فکری اور جذباتی ہم آہنگی آپ کا سرمایہ ہے۔",sen:"Intellectual and emotional harmony with your spouse is your capital.",wur:"ہم آہنگی کو معمولی سمجھ کر چھوڑ نہ دیں — معمولات کی تجدید اس کی حفاظت ہے۔",wen:"Do not take harmony for granted — refreshing routines is its protection.",gur:["ہر سہ ماہی میں ایک «رشتہ دن» رکھیں — گزشتہ موسم کی جیت اور اگلے کا ایک ہدف۔","ایک نوجوان جوڑے کی خاموش رہنمائی کریں — آپ کا نمونہ ان کے لیے درس ہے۔","شکرانے کو رشتے کی زبان بنائیں — مخصوص، باقاعدہ اور سچا۔"],gen:["Keep one 'relationship day' each quarter — last season's win and one goal for the next.","Quietly mentor a young couple — your example is their lesson.","Make gratitude the relationship's language — specific, regular and true."]}
  ]
};
var WLEIS={
  id:"wleis",type:"submean",cat:"lead",badge:"val",next:"pldp",mins:3,
  ur:"جذباتی ذہانت (WLEIS)",en:"Emotional Intelligence (WLEIS)",
  blurbUr:"اپنے اور دوسروں کے جذبات کو سمجھنا، سنبھالنا اور درست استعمال کرنا — قیادت کی بنیادی صلاحیت کا معروف پیمانہ۔ (ڈیمو میں 5 درجوں کی موافقت)",
  blurbEn:"Understanding, managing and using your own and others' emotions — the well-known measure of leadership's core ability. (5-point demo adaptation)",
  noteUr:"5-point demo adaptation · ہر جملے سے اتفاق کی حد بتائیں۔",noteEn:"5-point demo adaptation · Say how much you agree with each statement.",
  opts:OPT_AGR5,perMax:5,minPer:1,rev:[],
  src:"WLEIS — Wong & Law, 2002",
  traits:[
    {k:"SEA",ur:"اپنے جذبات کی سمجھ",en:"Self-emotion appraisal"},
    {k:"OEA",ur:"دوسروں کے جذبات کی سمجھ",en:"Others' emotion appraisal"},
    {k:"ROE",ur:"جذبات کا نظم",en:"Regulation of emotion"},
    {k:"UOE",ur:"جذبات کا استعمال",en:"Use of emotion"}
  ],
  subs:[{tr:0,items:[0,1,2,3]},{tr:1,items:[4,5,6,7]},{tr:2,items:[8,9,10,11]},{tr:3,items:[12,13,14,15]}],
  items:[
    {en:"I have a good sense of why I have certain feelings most of the time."},
    {en:"I have a good understanding of my own emotions."},
    {en:"I really understand what I feel."},
    {en:"I always know whether or not I am happy."},
    {en:"I always know my friends' emotions from their behaviour."},
    {en:"I am a good observer of others' emotions."},
    {en:"I am sensitive to the feelings and emotions of others."},
    {en:"I have a good understanding of the emotions of people around me."},
    {en:"I am able to control my temper and handle difficulties rationally."},
    {en:"I can always calm down quickly when I am very angry."},
    {en:"I have good control of my own emotions."},
    {en:"I am quite capable of controlling my own emotions."},
    {en:"I always tell myself that I am a competent person."},
    {en:"I am a self-motivated person."},
    {en:"I always encourage myself to try my best."},
    {en:"I always set goals for myself and then try my best to achieve them."}
  ],
  bands:[
    {max:2.99,tur:"جذباتی ذہانت پروان چڑھ رہی ہے",ten:"Emotional intelligence is growing",xur:"اس وقت جذبات — اپنے ہوں یا دوسروں کے — آپ کے لیے اکثر دھندلے رہتے ہیں، اور یہ دھند فیصلوں اور رشتوں دونوں پر اثر ڈالتی ہے۔ اچھی خبر: یہ سب سے زیادہ سیکھی جانے والی قیادتی صلاحیت ہے۔",xen:"Right now emotions — yours or others' — often stay foggy for you, and that fog affects both decisions and relationships. The good news: this is the most learnable of all leadership abilities.",sur:"آپ نے اپنی جذباتی کیفیت کو دیانت سے دیکھا — یہی اس ذہانت کا پہلا عضلہ ہے۔",sen:"You looked at your emotional state honestly — that is this intelligence's first muscle.",wur:"شدید جذبے میں فیصلہ اور پیغام — دونوں مؤخر کریں؛ یہ ایک عادت آپ کو کئی نقصانوں سے بچائے گی۔",wen:"In intense emotion, delay both the decision and the message; that one habit will save you many losses.",gur:["دن میں دو بار رک کر اپنے احساس کو نام دیں: «اس وقت میں ___ محسوس کر رہا ہوں» — نام دینا ہی نظم کا آغاز ہے۔","غصے کے لمحے کے لیے «وقفہ قاعدہ» طے کریں: جواب سے پہلے 10 گہری سانسیں یا جگہ بدلیں۔","ایک قریبی شخص سے پوچھیں: «مشکل وقت میں میں کیسا لگتا ہوں؟» — باہر کا آئینہ ضروری ہے۔"],gen:["Twice a day, stop and name your feeling: 'Right now I feel ___' — naming is where regulation begins.","Set a 'pause rule' for angry moments: 10 deep breaths or a change of place before replying.","Ask someone close: 'How do I seem in hard moments?' — an outside mirror is essential."]},
    {max:3.99,tur:"جذباتی ذہانت بڑھ رہی ہے",ten:"Emotional intelligence is developing",xur:"آپ کی جذباتی ذہانت درمیانی، بڑھتی ہوئی سطح پر ہے — چاروں جہتوں کا نقشہ (نیچے ریڈار میں) بتائے گا کہ اگلی مشق کہاں سب سے زیادہ فائدہ دے گی۔ عام طور پر «جذبات کا نظم» ہی وہ جہت ہے جو قیادت کو بناتی یا بگاڑتی ہے۔",xen:"Your emotional intelligence is at a middle, growing level — the map of the four dimensions (radar below) will show where the next practice pays most. Usually 'regulation' is the dimension that makes or breaks leadership.",sur:"اپنے جذبات کو پہچاننا اور اکثر سنبھال لینا آپ کی بنیاد ہے۔",sen:"Recognising your emotions and usually managing them is your base.",wur:"سب سے کمزور جہت کو نظر انداز کرنا عام غلطی ہے — قیادت وہیں سے رستی ہے۔",wen:"Ignoring the weakest dimension is the common mistake — leadership leaks from there.",gur:["ریڈار میں سب سے چھوٹی جہت چنیں اور اس ہفتے صرف اسی کی ایک مشق کریں۔","کسی مشکل گفتگو سے پہلے تین سانس اور ایک جملہ طے کریں: «میرا مقصد تعلق بھی ہے، مسئلہ بھی»۔","دن کے آخر میں ایک سطر لکھیں: آج کس لمحے جذبات نے فیصلہ کیا، اور کس لمحے میں نے؟"],gen:["Pick the smallest dimension on the radar and practise only that one this week.","Before a hard conversation, take three breaths and fix one sentence: 'My aim is both the relationship and the issue.'","At day's end write one line: today, when did emotion decide, and when did I?"]},
    {max:5,tur:"جذباتی ذہانت مضبوط ہے",ten:"Strong emotional intelligence",xur:"آپ اپنے اور دوسروں کے جذبات کو غیر معمولی وضاحت سے سمجھتے اور سنبھالتے ہیں — یہی وہ صلاحیت ہے جو قیادت کو محض عہدے سے بڑھا کر اثر بناتی ہے۔ اب اسے اپنی ٹیم کے ماحول میں منتقل کرنا آپ کا مرحلہ ہے۔",xen:"You understand and manage your own and others' emotions with unusual clarity — the ability that turns leadership from a title into influence. Passing it into your team's environment is your stage now.",sur:"دباؤ میں توازن اور دوسروں کو پڑھنے کی صلاحیت آپ کی پہچان ہے۔",sen:"Balance under pressure and reading others are your hallmark.",wur:"اس طاقت کا غلط استعمال — جذبات کو چالاکی سے چلانا — قیادت کو زہر دیتا ہے؛ اخلاقی حد ہمیشہ سامنے رکھیں۔",wen:"Misuse of this strength — steering emotions manipulatively — poisons leadership; keep the ethical line in view.",gur:["اپنی ٹیم میں «احساس کا نام» لینے کا معمول بنائیں — میٹنگ کے آغاز میں ایک سطر کیفیت کے لیے۔","کسی جدوجہد کرتے ساتھی کی کوچنگ کریں — جذباتی ذہانت منتقل بھی ہوتی ہے۔","بڑے فیصلوں سے پہلے ٹیم کے جذباتی درجہ حرارت کا جائزہ لازمی کریں۔"],gen:["Make 'naming the feeling' a team routine — one line for the state at the start of meetings.","Coach a struggling colleague — emotional intelligence is transferable.","Before big decisions, always read the team's emotional temperature."]}
  ]
};
var PPS={
  id:"pps",type:"scale",cat:"lead",badge:"val",next:"habits",mins:2,
  ur:"ٹال مٹول (Pure Procrastination Scale)",en:"Pure Procrastination Scale",
  blurbUr:"کام ٹالنے کا نمونہ کتنا گہرا ہے — فیصلے، آغاز اور تکمیل تینوں میں۔",
  blurbEn:"How deep is the delay pattern — in decisions, in starting, and in finishing.",
  noteUr:"",opts:[{a:1,en:"Very seldom true",ur:"بہت کم درست"},{a:2,en:"Seldom true",ur:"کم درست"},{a:3,en:"Sometimes true",ur:"کبھی کبھی درست"},{a:4,en:"Often true",ur:"اکثر درست"},{a:5,en:"Very often true",ur:"بہت اکثر درست"}],perMax:5,minPer:1,rev:[],
  src:"PPS — Steel, 2010",
  items:[
    {en:"I delay starting something until I have to do it."},
    {en:"I often find myself doing tasks that I had intended to do days before."},
    {en:"I generally delay before starting on work I have to do."},
    {en:"Even after I make a decision, I delay acting upon it."},
    {en:"I waste a lot of time on trivial matters before getting to the important ones."},
    {en:"I put off starting things for so long that I often do not get them done at all."},
    {en:"I keep putting off improving my work habits."},
    {en:"I delay completing tasks, even simple ones."},
    {en:"I find myself running out of time."},
    {en:"I do not get as many things done during the day as I would like."},
    {en:"I postpone starting important work, even when it matters."},
    {en:"I put tasks off until the very last minute."}
  ],
  bands:[
    {max:29,tur:"عموماً وقت پر",ten:"Mostly on time",xur:"آپ کا ٹال مٹول کا نمونہ ہلکا ہے — کام عموماً وقت پر شروع اور مکمل ہوتا ہے۔ یہ نظم آپ کی عادات کے نظام کی پیداوار ہے؛ اسے برقرار رکھنا ہی آپ کا کام ہے۔",xen:"Your delay pattern is light — work usually starts and finishes on time. This order is the product of your habit system; keeping it is your task.",sur:"آغاز میں تاخیر نہ کرنا آپ کی طاقت ہے۔",sen:"Starting without delay is your strength.",wur:"کبھی کبھار کی ٹال مٹول کو پہچانیں — عموماً وہی کام جو ناگوار یا مبہم ہو۔",wen:"Notice occasional delay — usually it is the unpleasant or unclear task.",gur:["ناگوار کام کو دن کے پہلے حصے میں رکھنے کا اصول برقرار رکھیں۔","مبہم کام آتے ہی اسے اگلے چھوٹے قدم میں توڑیں — ابہام ہی ٹال کی جڑ ہے۔","اپنی فہرست کا ہفتہ وار جائزہ جاری رکھیں۔"],gen:["Keep the rule of placing the unpleasant task early in the day.","When an unclear task arrives, break it into the next small step at once — vagueness is delay's root.","Continue your weekly list review."]},
    {max:44,tur:"ٹال مٹول کا نمونہ موجود ہے",ten:"A delay pattern is present",xur:"آپ کے جوابات ایک باقاعدہ ٹال مٹول کے نمونے کی طرف اشارہ کرتے ہیں — ارادہ ہوتا ہے، آغاز نہیں ہوتا۔ یہ سستی نہیں ہوتی؛ عموماً کام کا بڑا ہونا، ناکامی کا خوف یا ابہام اس کے پیچھے ہوتا ہے۔ خبر یہ ہے کہ آغاز کا لمحہ ہی اصل لڑائی ہے — دو منٹ کا آغاز اکثر پورا کام کھینچ لاتا ہے۔",xen:"Your answers point to a regular delay pattern — the intention exists, the start does not happen. This is not laziness; usually the task's size, fear of failure or vagueness sits behind it. The news: the moment of starting is the real battle — a two-minute start often pulls the whole task along.",sur:"آپ نے اپنے نمونے کو بغیر بہانے کے دیکھا — یہ نصف حل ہے۔",sen:"You saw your pattern without excuses — that is half the solution.",wur:"«کل سے پکا» کا وعدہ خود سے نہ کریں — کل کا وعدہ ہی اس نمونے کی خوراک ہے۔",wen:"Do not promise yourself 'tomorrow for sure' — tomorrow-promises are this pattern's food.",gur:["ہر اہم کام کے لیے صرف «پہلے دو منٹ» کا ہدف رکھیں — دماغ آغاز سے ڈرتا ہے، تسلسل سے نہیں۔","کام کو اتنا چھوٹا کریں کہ انکار مشکل ہو: ایک صفحہ، ایک کال، ایک فائل۔","اپنے لیے آخری وقت سے پہلے کی «اپنی ڈیڈ لائن» مقرر کریں اور کسی کو بتا بھی دیں۔"],gen:["For every important task set only a 'first two minutes' target — the mind fears starting, not continuing.","Shrink the task until refusal is hard: one page, one call, one file.","Set your own earlier deadline and tell someone about it."]},
    {max:60,tur:"ٹال مٹول گہری ہے",ten:"Heavy delay pattern",xur:"ٹال مٹول اس وقت آپ کی زندگی کے کئی پہلوؤں پر قیمت وصول کر رہی ہے — آخری لمحے کا دباؤ، ضائع شدہ مواقع، اور خود پر اعتماد میں کمی۔ یہ نمونہ قوتِ ارادی سے نہیں، نظام اور مدد سے ٹوٹتا ہے؛ اسے اپنا اگلا بڑا مقصد سمجھیں، شرم کا مسئلہ نہیں۔",xen:"Delay is currently charging a price across many areas of life — last-minute pressure, lost opportunities and shrinking self-trust. This pattern breaks through systems and support, not willpower; treat it as your next big goal, not a matter of shame.",sur:"آپ نے اس نمونے کو اس کی پوری قیمت سمیت دیکھا — یہ دیانت نایاب ہے۔",sen:"You saw this pattern with its full cost — that honesty is rare.",wur:"خود کو سزا دے کر شروع کرنے کی کوشش ترک کریں — نظام بدلیں، خود کو نہیں کوسیں۔",wen:"Stop trying to start by punishing yourself — change the system, not the self-blame.",gur:["صرف ایک کام چنیں — سب سے اہم — اور اسے آج 10 منٹ دیں؛ باقی فہرست کل کی ہے۔","اپنے ماحول سے سب سے بڑی رکاوٹ (عموماً فون) کام کے وقت دوسرے کمرے میں رکھیں۔","اس نمونے کو کوچنگ کا موضوع بنائیں — Habit Architecture اسی کے لیے بنا ہے؛ تنہا لڑنا ضروری نہیں۔"],gen:["Pick only ONE task — the most important — and give it 10 minutes today; the rest of the list is tomorrow's.","Put the biggest obstacle (usually the phone) in another room during work time.","Make this pattern a coaching subject — Habit Architecture is built for exactly this; you do not have to fight alone."]}
  ]
};


/* ============ AIDE SIGNATURE ASSESSMENTS (spec: signature-assessments-design-2026-11-06) ============ */
var SIG_FREQ=[{a:5,en:"Always",ur:"ہمیشہ"},{a:4,en:"Often",ur:"اکثر"},{a:3,en:"Sometimes",ur:"کبھی کبھار"},{a:2,en:"Rarely",ur:"شاذ و نادر"},{a:1,en:"Never",ur:"کبھی نہیں"}];
var SIG_HONESTY_UR="یہ AIDE کا اپنا جائزہ آلہ ہے — غور و فکر اور اگلے قدم کے لیے، کسی تشخیص کے لیے نہیں۔";
var SIG_HONESTY_EN="This is AIDE's own reflection instrument — for reflection and the next step, not for any diagnosis.";
var SIG_IDENTITY_UR="اس خانے کے آلات آپ کو کہیں اور نہیں ملیں گے، کیونکہ یہ کسی ترجمہ شدہ کتاب سے نہیں آئے — یہ عمران اسلم کے اپنے پروگراموں کی مٹی سے بنے ہیں: قیادت کا اسوہ آئینہ، گھر کے سکون کا اشاریہ، عادت کی معماری کا نقشہ۔ جو پیمانہ ہم اپنے پروگراموں میں خود استعمال کرتے ہیں، وہی یہاں آپ کے ہاتھ میں ہے۔";
var SIG_IDENTITY_EN="These instruments exist nowhere else — they were not translated from any book; they are built from Imran Aslam's own programmes: the USWA Leadership Mirror, the Home Harmony Index, the Habit Architecture Map. The same measures we use inside our programmes are here, in your hands.";

var USWA_SIG={
  id:"leadership",type:"sig",sig:true,chart:"radar",cat:"lead",badge:"sig",next:"pldp",mins:4,
  ur:"اسوہ قیادت آئینہ",en:"USWA Leadership Mirror",
  blurbUr:"«قیادت باہر کے شور سے نہیں، اندر کے آئینے سے شروع ہوتی ہے» — PLDP کے اسوہ فریم ورک کے چار ستون: فہم، اخلاص، حکمت، احتساب۔ یہی آلہ PLDP میں پروگرام سے پہلے اور بعد میں استعمال ہوتا ہے۔",
  blurbEn:"'Leadership begins in the inner mirror, not in outside noise' — the four USWA pillars of PLDP: Understanding, Sincerity, Wisdom, Accountability. The same instrument PLDP uses before and after the programme.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔",noteEn:"For each statement, say how regularly this behaviour is found in you.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کے پروگرام PLDP کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on the practical foundation of Imran Aslam's PLDP programme.",
  dims:[
    {k:"فہم",ur:"فہم",en:"Understanding",items:[0,1,2,3,4],sugUr:["اس ہفتے ایک فیصلے سے پہلے تمام فریقوں کی بات باری باری پوری سنیں — بیچ میں نہ ٹوکیں۔","کسی الزام یا خبر پر ردعمل سے پہلے ایک آزاد ذریعے سے تصدیق کریں۔","ٹیم کے ہر فرد کے موجودہ بوجھ کی ایک سطر لکھ کر پھر کام سونپیں۔"],sugEn:["Before one decision this week, hear every side fully, in turn — without interrupting.","Verify one accusation or report from an independent source before reacting.","Write one line on each team member's current load before assigning work."]},
    {k:"اخلاص",ur:"اخلاص",en:"Sincerity",items:[5,6,7,8,9],sugUr:["اس ہفتے صرف وہی وعدہ کریں جس کی تاریخ بھی ڈائری میں لکھ سکیں۔","ایک اچھا کام بغیر اعلان، بغیر تصویر — صرف نیت کے لیے کریں۔","کسی ساتھی کے اچھے کام کا کریڈٹ اسی دن، اسی کے سامنے کھل کر دیں۔"],sugEn:["Promise only what you can also write a date for in your diary.","Do one good deed with no announcement and no photo — for intention alone.","Give a colleague open credit for good work, the same day, in front of them."]},
    {k:"حکمت",ur:"حکمت",en:"Wisdom",items:[10,11,12,13,14],sugUr:["مشکل جواب فوراً نہ دیں — «میں کل بتاتا ہوں» کہہ کر ایک رات سوچیں۔","جھگڑے میں جملہ چنتے وقت پہلے پوچھیں: یہ تعلق بچائے گا یا صرف بحث جیتے گا؟","ایک موجودہ فیصلے کے چھ ماہ بعد کے اثر کو تین سطروں میں لکھیں۔"],sugEn:["Do not answer a hard question at once — say 'I will tell you tomorrow' and think overnight.","When choosing words in a conflict, ask first: will this save the relationship, or only win the argument?","Write three lines on the six-month effect of one current decision."]},
    {k:"احتساب",ur:"احتساب",en:"Accountability",items:[15,16,17,18,19],sugUr:["اس ہفتے اپنی ایک غلطی ٹیم کے سامنے خود تسلیم کریں — وضاحت کے بغیر۔","دن کے آخر میں پانچ منٹ: آج کے فیصلوں کا سادہ جائزہ لکھیں۔","ایک پرانی ذمہ داری کی تازہ خبر متعلقہ لوگوں کو خود پہنچائیں، ان کے پوچھنے سے پہلے۔"],sugEn:["Admit one of your own mistakes in front of the team this week — without excuses.","Five minutes at day's end: write a simple review of today's decisions.","Report on one old responsibility yourself, before anyone asks."]}
  ],
  items:[
    {ur:"میں فیصلے سے پہلے تمام متعلقہ لوگوں کی بات پوری سن لیتا ہوں۔",en:"I listen to everyone concerned, fully, before deciding."},
    {ur:"میں بات کی تصدیق کیے بغیر الزام یا نتیجہ نہیں نکالتا۔",en:"I verify facts before blaming or concluding."},
    {ur:"میں ہر فرد کی صلاحیت اور بوجھ کی حد سمجھ کر کام سونپتا ہوں۔",en:"I assign work knowing each person's capacity and load."},
    {ur:"میں اختلاف کی وجہ سمجھنے کی کوشش کرتا ہوں، اسے ذاتی دشمنی نہیں بناتا۔",en:"I explore the reason behind disagreement instead of making it personal."},
    {ur:"میں مشکل خبر پہلے پوری سن کر سمجھتا ہوں، فوراً ردعمل نہیں دیتا۔",en:"I hear difficult news fully before reacting."},
    {ur:"میرا طرزِ عمل لوگوں کے سامنے اور تنہائی میں ایک جیسا ہے۔",en:"My conduct is the same in public and in private."},
    {ur:"میں وہ وعدہ نہیں کرتا جو پورا کرنے کی نیت ہی نہ ہو۔",en:"I do not promise what I do not intend to fulfil."},
    {ur:"میں اچھا کام دکھاوے کے بغیر بھی اسی توجہ سے کرتا ہوں۔",en:"I do good work with the same care when nobody is watching."},
    {ur:"کسی اور کی محنت کا کریڈٹ کھلے دل سے اسی کو دیتا ہوں۔",en:"I give credit openly to the one who earned it."},
    {ur:"میں کام شروع کرنے سے پہلے اپنی نیت کا جائزہ لے لیتا ہوں۔",en:"I check my intention before beginning a task."},
    {ur:"میں ہر بات فوراً نہیں کہتا، جواب کا وقت دیکھتا ہوں۔",en:"I choose the timing of my words instead of saying everything at once."},
    {ur:"میرا ردعمل مسئلے کے حجم کے برابر رہتا ہے، اس سے بڑا نہیں بنتا۔",en:"My response stays proportionate to the size of the problem."},
    {ur:"میں فیصلے میں اگلے مہینوں کا اثر بھی دیکھتا ہوں۔",en:"I weigh the long-term effect of my decisions."},
    {ur:"جھگڑے میں میں وہ بات چنتا ہوں جو تعلق بچائے، نہ کہ صرف بحث جیتے۔",en:"In conflict I choose the words that preserve the relationship, not just win the argument."},
    {ur:"میں نصیحت اس انداز میں کرتا ہوں جو سننے والا قبول کر سکے۔",en:"I advise in a manner the listener can actually accept."},
    {ur:"میں اپنی غلطی ٹیم کے سامنے خود تسلیم کر لیتا ہوں۔",en:"I admit my own mistakes in front of my team."},
    {ur:"ٹیم کی ناکامی میں میں اپنا حصہ بھی تلاش کرتا ہوں، صرف دوسروں کا نہیں۔",en:"In a team failure I look for my share too, not only others'."},
    {ur:"میں دن کے آخر میں اپنے فیصلوں کا خود جائزہ لیتا ہوں۔",en:"I review my decisions at the end of the day."},
    {ur:"میں لی ہوئی ذمہ داری کی خبر متعلقہ لوگوں کو خود دیتا ہوں، پوچھنے کا انتظار نہیں کرتا۔",en:"I report on my responsibilities without being chased."},
    {ur:"میں تنقید میں پہلے سچ تلاش کرتا ہوں، دفاع بعد میں کرتا ہوں۔",en:"I search criticism for truth before defending myself."}
  ],
  bands:[
    {tur:"دھندلا آئینہ",ten:"A Clouded Mirror",xur:"آئینہ جھوٹ نہیں بولتا — آپ کی قیادت اس وقت نیت سے زیادہ عادت سے چل رہی ہے۔ سب سے مضبوط ستون [S] آپ کا سہارا ہے؛ اصل کام [W] میں ہے۔",xen:"The mirror does not lie — right now your leadership runs more on habit than on intention. Your strongest pillar, [S], is your support; the real work is in [W]."},
    {tur:"اٹھتی ہوئی قیادت",ten:"Leadership Rising",xur:"بنیاد موجود ہے اور سمت درست ہے۔ [W] وہ جگہ ہے جہاں تھوڑی سی مستقل توجہ پوری قیادت کا رنگ بدل دے گی۔",xen:"The foundation exists and the direction is right. [W] is the place where a little steady attention will change the colour of your whole leadership."},
    {tur:"روشن قیادت",ten:"Radiant Leadership",xur:"ماشاءاللہ، آپ کی قیادت کے چاروں ستون ایک دوسرے کو سنبھال رہے ہیں۔ اب سوال اپنے نہیں، آگے بڑھ کر دوسروں کو اٹھانے کا ہے — [W] میں بھی وہی گہرائی لانی ہے جو [S] میں ہے۔",xen:"Your four pillars are holding one another up. The question now is not yourself but lifting others — and bringing to [W] the same depth that [S] already has."}
  ]
};

var WALIDAIN_SIG={
  id:"parenting",type:"sig",sig:true,chart:"bars",cat:"rel",badge:"sig",next:"bookanger",mins:4,
  ur:"والدین آئینہ",en:"The Parenting Mirror",
  blurbUr:"«بچہ وہی سیکھتا ہے جو گھر میں جیتا ہوا دیکھتا ہے» — کتاب «بچے کا غصہ، والدین کا راستہ» کی بنیاد پر والدین کے اپنے رویے کا آئینہ: سننا، سکون، مستقل مزاجی، محبت کا اظہار، حد بندی اور مرمت۔",
  blurbEn:"'A child learns what he sees lived at home' — built on the book 'Bache Ka Ghussa, Walidain Ka Rasta': a mirror of the parent's own behaviour — listening, calm, consistency, warmth, boundaries and repair.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔",noteEn:"For each statement, say how regularly this behaviour is found in you.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کی کتاب «بچے کا غصہ، والدین کا راستہ» اور پروگرام Strong Homes کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on Imran Aslam's book 'Bache Ka Ghussa, Walidain Ka Rasta' and the Strong Homes programme.",
  dims:[
    {k:"سننا",ur:"سننا",en:"Listening",items:[0,1,2],sugUr:["دن میں ایک بار فون دوسرے کمرے میں رکھ کر بچے کی بات پوری سنیں۔","بچے کے احساس کو اس کے لفظوں میں دہرائیں: «تمہیں غصہ آیا کیونکہ…»","اس ہفتے بچے کی بات ایک بار بھی درمیان میں نہ کاٹیں — آخری جملہ اسی کا ہو۔"],sugEn:["Once a day, put the phone in another room and hear your child fully.","Reflect the feeling back: 'You got angry because…'","This week, not once interrupt your child — let the last sentence be theirs."]},
    {k:"سکون",ur:"سکون",en:"Parent's own calm",items:[3,4,5],sugUr:["غصہ آئے تو فیصلہ مؤخر کریں — پہلے پانی، وضو یا دس گہری سانسیں۔","آواز اونچی ہونے لگے تو جملہ آہستہ اور چھوٹا کر دیں۔","بچہ روئے تو پہلے قریب بیٹھیں؛ وجہ بعد میں، چپ کرانا آخر میں۔"],sugEn:["When anger rises, postpone the decision — water, wudu, or ten deep breaths first.","If your voice starts rising, make the sentence slower and shorter.","When your child cries, sit close first; the reason next, silencing last."]},
    {k:"مستقل مزاجی",ur:"مستقل مزاجی",en:"Consistency",items:[6,7,8],sugUr:["گھر کے تین بڑے اصول تمام بڑوں کی مشاورت سے لکھ کر لگائیں۔","اس ہفتے کوئی ایسی دھمکی نہ دیں جو پوری نہ کر سکیں۔","ایک اصول پر سات دن بغیر استثنا قائم رہیں، مزاج چاہے جیسا ہو۔"],sugEn:["Write the home's three big rules together with all adults and display them.","Make no threat this week that you cannot carry out.","Hold one rule for seven days without exception, whatever your mood."]},
    {k:"محبت کا اظہار",ur:"محبت کا اظہار",en:"Expressed warmth",items:[9,10,11],sugUr:["روز ایک بار بچے کو بغیر کسی کامیابی کے بھی گلے لگائیں۔","بچے کی ایک اچھی بات نام لے کر گھر والوں کے سامنے کہیں۔","روز دس منٹ بچے کی پسند کے کام میں، فون بند کر کے شریک ہوں۔"],sugEn:["Hug your child once a day — with no achievement attached.","Name one good thing your child did, in front of the family.","Ten minutes daily in your child's chosen activity, phone off."]},
    {k:"حد بندی",ur:"حد بندی",en:"Calm boundaries",items:[12,13,14],sugUr:["انکار کے ساتھ ایک سطر کی وجہ ضرور دیں — سکون سے، ایک ہی بار۔","حد لگاتے وقت بچے کی شخصیت نہیں، اس کے عمل کو موضوع بنائیں۔","دوسرے بڑے کی لگائی گئی حد بچے کے سامنے نہ توڑیں؛ اختلاف الگ کمرے میں۔"],sugEn:["With every 'no', give a one-line reason — calmly, once.","When holding a boundary, address the act, not the child's person.","Never break another adult's boundary in front of the child; disagreements go to another room."]},
    {k:"مرمت",ur:"مرمت",en:"Repair",items:[15,16,17],sugUr:["اس ہفتے اپنی ایک زیادتی پر بچے سے سچی معذرت کریں۔","تلخی ہو جائے تو سونے سے پہلے تعلق جوڑنے کی پہل خود کریں۔","بچے کی پرانی غلطی کا ذکر اس ہفتے بالکل نہ کریں — طعنہ ختم، بات ختم۔"],sugEn:["Apologise sincerely to your child for one overstep this week.","After a rupture, initiate the repair yourself before sleep.","Do not mention your child's past mistake at all this week — no taunts."]}
  ],
  items:[
    {ur:"بچہ بات کرے تو میں فون اور کام چھوڑ کر اس کی طرف متوجہ ہو جاتا ہوں۔",en:"When my child speaks, I put phone and work aside and attend."},
    {ur:"میں بچے کی بات کاٹے بغیر پوری سنتا ہوں۔",en:"I hear my child out without interrupting."},
    {ur:"جواب دینے سے پہلے میں بچے کے احساس کو اس کے لفظوں میں دہرا کر تصدیق کرتا ہوں۔",en:"Before responding, I reflect my child's feeling back to confirm it."},
    {ur:"بچے کی ضد پر میری آواز فوراً اونچی نہیں ہوتی۔",en:"My voice does not rise immediately at my child's stubbornness."},
    {ur:"میں غصے کی حالت میں سزا کا فیصلہ نہیں کرتا، پہلے خود ٹھنڈا ہوتا ہوں۔",en:"I never decide a punishment while angry; I cool down first."},
    {ur:"بچہ رونے لگے تو میں پہلے وجہ سمجھتا ہوں، چپ کرانے کی جلدی نہیں کرتا۔",en:"When my child cries, I first seek the reason instead of rushing to silence them."},
    {ur:"جو اصول آج ہے، ہمارے گھر میں کل بھی وہی رہتا ہے۔",en:"The rule that stands today stands tomorrow in our home."},
    {ur:"گھر کے بڑے اصولوں پر بچے کو ایک ہی پیغام دیتے ہیں۔",en:"The adults at home give the child one consistent message on rules."},
    {ur:"میں وہ دھمکی نہیں دیتا جو پوری نہ کر سکوں۔",en:"I never threaten a consequence I cannot carry out."},
    {ur:"میں بچے کو صرف کامیابی پر نہیں، ویسے بھی گلے لگاتا اور محبت دکھاتا ہوں۔",en:"I show affection freely, not only after an achievement."},
    {ur:"میں بچے کی اچھی بات کا نام لے کر اس کے سامنے ذکر کرتا ہوں۔",en:"I name my child's good actions appreciatively, in front of them."},
    {ur:"میں ہر دن کچھ وقت صرف بچے کے ساتھ، اس کی پسند کے کام میں گزارتا ہوں۔",en:"Every day I spend some time with my child in an activity of their choosing."},
    {ur:"انکار کرتے وقت میں وجہ سکون سے بتاتا ہوں۔",en:"When I say no, I calmly explain the reason."},
    {ur:"حد قائم کرتے ہوئے میں بچے کو شرمندہ نہیں کرتا۔",en:"I hold a boundary without shaming the child."},
    {ur:"میں بچے کے سامنے دوسرے بڑے کی قائم کی ہوئی حد نہیں توڑتا۔",en:"I do not undermine another adult's boundary in front of the child."},
    {ur:"مجھ سے زیادتی ہو جائے تو میں بچے سے معذرت کر لیتا ہوں۔",en:"If I overstep, I apologise to my child."},
    {ur:"تلخی کے بعد میں اسی دن تعلق دوبارہ جوڑنے کی پہل خود کرتا ہوں۔",en:"After a rupture, I initiate the repair the same day."},
    {ur:"میں بچے کی پرانی غلطی کو بار بار یاد دلا کر طعنہ نہیں بناتا۔",en:"I do not turn my child's past mistakes into repeated taunts."}
  ],
  bands:[
    {tur:"ردعمل والا گھر",ten:"A Reactive Home",xur:"یہ آئینہ بچے کی نہیں، ہماری تصویر ہے — اور یہی اچھی خبر ہے، کیونکہ ہم خود کو بدل سکتے ہیں۔ آپ کی طاقت [S] ہے؛ آغاز [W] سے کریں، بچے کے مزاج سے نہیں۔",xen:"This mirror shows us, not the child — and that is the good news, because we can change ourselves. Your strength is [S]; begin with [W], not with the child's temperament."},
    {tur:"سیکھتا ہوا والدین",ten:"A Learning Parent",xur:"آپ راستے پر ہیں — گھر میں محبت بھی ہے اور کوشش بھی۔ [W] وہ دراڑ ہے جہاں سے سکون رستا ہے؛ اسے بھرنا بچے کو بدلنے سے کہیں آسان ہے۔",xen:"You are on the path — the home has both love and effort. [W] is the crack through which calm leaks; filling it is far easier than changing the child."},
    {tur:"ٹھہرا ہوا والدین",ten:"A Settled Parent",xur:"آپ کا گھر بچے کے لیے محفوظ ٹھکانہ محسوس ہوتا ہوگا۔ [S] آپ کی پہچان ہے — اسے قائم رکھیں اور [W] کو اگلی منزل بنائیں۔",xen:"Your home must feel like a safe harbour to your child. [S] is your hallmark — keep it, and make [W] your next destination."}
  ]
};

var SUKOON_SIG={
  id:"relationships",type:"sig",sig:true,chart:"bars",cat:"rel",badge:"sig",next:"homes",mins:3,
  ur:"سکونِ گھر اشاریہ",en:"Strong Homes Harmony Index",
  blurbUr:"«گھر کی اصل صحت لڑائی کی کمی نہیں، مرمت کی رفتار ہے» — Strong Homes کا اپنا اشاریہ: گفتگو، اختلاف میں احترام، مشترکہ وقت، بوجھ کی تقسیم اور مرمت کی رفتار۔",
  blurbEn:"'A home's real health is not the absence of fights — it is the speed of repair' — Strong Homes' own index: conversation, respect under disagreement, shared time, shared load and speed of repair.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ کے گھر میں کتنی باقاعدگی سے پایا جاتا ہے۔",noteEn:"For each statement, say how regularly this is true in your home.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کے پروگرام Strong Homes, Steady Hearts کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on the practical foundation of Imran Aslam's Strong Homes, Steady Hearts programme.",
  dims:[
    {k:"گفتگو",ur:"گفتگو",en:"Real conversation",items:[0,1,2],sugUr:["روز دس منٹ صرف بات چیت — نہ شکایتیں، نہ ہدایات؛ بس دن کی باتیں۔","کھانے پر ایک اصول رکھیں: سنتے وقت موبائل میز پر نہیں ہوگا۔","دن کی سب سے اہم بات ایک دوسرے کو خود بتائیں، خبر بننے سے پہلے۔"],sugEn:["Ten minutes daily of pure conversation — no complaints, no instructions.","One rule at meals: no phone on the table while listening.","Share the day's most important event with each other yourselves, before it becomes 'news'."]},
    {k:"احترام",ur:"اختلاف میں احترام",en:"Respect under disagreement",items:[3,4,5],sugUr:["اختلاف میں آواز کی حد طے کریں — اونچی آواز کا مطلب وقفہ ہو، بات کا خاتمہ نہیں۔","طنز کی جگہ سیدھا جملہ رکھیں: «مجھے یہ بات بری لگی» — بس۔","لوگوں کے سامنے ایک دوسرے کی بات کاٹنے کے بجائے معاملہ الگ بات کے لیے رکھیں۔"],sugEn:["Agree a voice limit in disagreements — a raised voice means a pause, not an ending.","Replace sarcasm with one straight sentence: 'That hurt me.'","Instead of cutting each other off in front of family, keep the matter for a private talk."]},
    {k:"مشترکہ وقت",ur:"مشترکہ وقت",en:"Shared time",items:[6,7,8],sugUr:["ہفتے میں ایک شام صرف دونوں کے لیے کیلنڈر میں لکھ دیں۔","روز ایک چائے یا کھانا لازمی اکٹھے گزاریں — فون ایک طرف رکھ کر۔","مشترکہ وقت میں کام اور مسائل کی بات اگلے دن کے لیے اٹھا رکھیں۔"],sugEn:["Write one evening a week into the calendar — only for the two of you.","Share one tea or meal together daily — phones put aside.","Keep work and problems out of shared time; park them for the next day."]},
    {k:"بوجھ",ur:"بوجھ کی تقسیم",en:"Shared load",items:[9,10,11],sugUr:["گھر کے کاموں کی فہرست بنا کر تقسیم لکھ کر طے کریں — اندازے ختم کریں۔","ساتھی تھکا نظر آئے تو کہے بغیر ایک کام خود اٹھا لیں، اسی دن۔","یاد رکھنے والے کام (بل، دوائیں، ملاقاتیں) بھی باری باری بانٹیں۔"],sugEn:["List the household work and write the division down — end the guesswork.","When your partner looks exhausted, take over one task unasked, that same day.","Share the remembering-and-planning load too — bills, medicines, appointments — in turns."]},
    {k:"مرمت",ur:"مرمت کی رفتار",en:"Speed of repair",items:[12,13,14],sugUr:["جھگڑے کے بعد اسی دن ایک چھوٹی سی معمول کی بات سے سلسلہ دوبارہ شروع کریں۔","معذرت میں «لیکن» نہ لگائیں — پہل اسی کی ہو جس کی غلطی ہے۔","نئی بات میں پرانا جھگڑا بطور گواہ لانا اس ہفتے مکمل بند کریں۔"],sugEn:["After a fight, restart contact the same day with one small, ordinary sentence.","No 'but' inside an apology — the one at fault initiates.","This week, stop dragging old fights into new disagreements as evidence."]}
  ],
  items:[
    {ur:"ہمارے گھر میں روز کم از کم ایک بار اصل گفتگو ہوتی ہے، صرف ہدایات اور ضروریات نہیں۔",en:"We have at least one real conversation daily, beyond instructions and needs."},
    {ur:"میں شریکِ حیات کی بات موبائل دیکھتے ہوئے نہیں سنتا۔",en:"I do not listen to my spouse while looking at my phone."},
    {ur:"ہم دن کی اہم باتیں ایک دوسرے کو خود بتاتے ہیں۔",en:"We share the day's important events with each other unprompted."},
    {ur:"ہمارے گھر میں آواز بلند کیے بغیر اختلاف ہو سکتا ہے۔",en:"In our home, disagreement is possible without raised voices."},
    {ur:"ہم ناراضی طنز اور طعنے کے بغیر کہہ سکتے ہیں۔",en:"We can express displeasure without sarcasm or taunts."},
    {ur:"ہم خاندان کے سامنے ایک دوسرے کی بات نہیں کاٹتے۔",en:"We do not cut each other off in front of the family."},
    {ur:"ہم ہفتے میں کچھ وقت صرف اپنے دونوں کے لیے نکالتے ہیں۔",en:"We take out some time every week that is only for the two of us."},
    {ur:"دن کا ایک کھانا یا چائے ہم اکٹھے گزارتے ہیں۔",en:"We share at least one meal or tea together daily."},
    {ur:"مشترکہ وقت میں فون ایک طرف رکھ دیے جاتے ہیں۔",en:"Phones are put aside during our shared time."},
    {ur:"ہمارے گھر کے کاموں کی تقسیم واضح ہے، اندازے سے نہیں چلتی۔",en:"Household work is divided clearly, not left to assumption."},
    {ur:"ایک تھک جائے تو دوسرا کہے بغیر آگے بڑھ کر بوجھ اٹھا لیتا ہے۔",en:"When one of us is exhausted, the other steps in without being asked."},
    {ur:"یاد رکھنے اور منصوبہ بنانے کا ذہنی بوجھ بھی دونوں میں بٹا ہوا ہے۔",en:"The mental load of remembering and planning is shared too."},
    {ur:"جھگڑے کے بعد ہمارے گھر بات چیت اسی دن دوبارہ شروع ہو جاتی ہے۔",en:"After a fight, conversation resumes in our home the same day."},
    {ur:"ہم میں سے جس کی غلطی ہو، معذرت کی پہل وہی کرتا ہے۔",en:"Whichever of us is in the wrong initiates the apology."},
    {ur:"پرانے جھگڑے نئی بات میں گواہ بنا کر نہیں لائے جاتے۔",en:"Old fights are not dragged into new disagreements as evidence."}
  ],
  bands:[
    {tur:"کشیدہ گھر",ten:"A Strained Home",xur:"یہ اشاریہ گھر کو برا نہیں کہتا — یہ بتاتا ہے کہ سکون کہاں سے رِس رہا ہے۔ آپ کی بنیاد [S] ہے؛ مرمت کا پہلا کام [W] میں ہے، اور وہ چھوٹے قدم سے شروع ہوتا ہے۔",xen:"This index does not call your home bad — it shows where the calm is leaking. Your foundation is [S]; the first repair work is in [W], and it starts with a small step."},
    {tur:"چلتا ہوا گھر",ten:"A Functioning Home",xur:"گھر چل رہا ہے، مگر کچھ کمرے اب بھی بند ہیں۔ [S] آپ کی اصل طاقت ہے — اسی انداز کو [W] تک لے جائیں۔",xen:"The home is running, but some rooms are still closed. [S] is your real strength — carry the same manner into [W]."},
    {tur:"سکون والا گھر",ten:"A Peaceful Home",xur:"آپ کے گھر کی سب سے قیمتی عادت اس کی مرمت کی رفتار ہے۔ [W] کو بھی اسی سطح پر لانا اب صرف توجہ کا سوال ہے۔",xen:"Your home's most precious habit is its speed of repair. Bringing [W] to the same level is now only a matter of attention."}
  ]
};

var HABITMAP_SIG={
  id:"habits",type:"sig",sig:true,chart:"bars",cat:"self",badge:"sig",next:"habits",mins:3,
  ur:"عادت معماری نقشہ",en:"Habit Architecture Map",
  blurbUr:"«ارادہ نہیں ہارتا، نظام ہارتا ہے — اور نظام بنایا جا سکتا ہے» — Habit Architecture کا نقشہ: آپ کی عادت کی عمارت کی چار دیواریں، اور نتیجہ سب سے کمزور دیوار کا نام لے کر بتائے گا۔",
  blurbEn:"'Willpower does not fail — systems fail, and systems can be built' — the Habit Architecture Map: four walls of your habit building, and the result will name your weakest wall.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔",noteEn:"For each statement, say how regularly this behaviour is found in you.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کے پروگرام Habit Architecture کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on the practical foundation of Imran Aslam's Habit Architecture programme.",
  dims:[
    {k:"ماحول",ur:"ماحول و اشارے",en:"Environment & cues",items:[0,1,2,3],sugUr:["عادت کا سامان آج ہی نظر کے سامنے، ایک مقررہ جگہ پر رکھیں۔","بری عادت تک پہنچنے میں ایک رکاوٹ بڑھا دیں — ایپ حذف، چیز نظروں سے دور۔","عادت کو ایک مقررہ اشارے سے باندھیں: فجر کے بعد یا ناشتے کے بعد — لکھ کر۔"],sugEn:["Put your habit's tools in plain sight, in one fixed place, today.","Add one barrier to the bad habit — delete the app, move the thing out of sight.","Tie the habit to a fixed cue: after Fajr, after breakfast — in writing."]},
    {k:"آسانی",ur:"آسانی",en:"Friction design",items:[4,5,6,7],sugUr:["عادت کو دو منٹ کی صورت سے شروع کریں — بڑا عزم نہیں، چھوٹا قدم۔","کل کی عادت کی تیاری آج رات ہی کر کے رکھیں۔","مشکل دن کے لیے عادت کی «کم از کم صورت» پہلے سے لکھ کر طے کریں۔"],sugEn:["Start the habit in a two-minute form — not a grand resolve, a small step.","Prepare tomorrow's habit tonight.","Decide the 'minimum version' of your habit for hard days, in advance, in writing."]},
    {k:"تسلسل",ur:"تسلسل",en:"Streak & anchors",items:[8,9,10,11],sugUr:["کیلنڈر پر عادت کے دن کا نشان لگانا آج سے شروع کریں۔","ایک شخص کو اپنی پیش رفت کا گواہ بنائیں — ہفتے میں ایک پیغام کافی ہے۔","اتوار کو پانچ منٹ: اس ہفتے کا تسلسل گنیں اور لکھیں۔"],sugEn:["Start marking your habit days on a calendar today.","Make one person a witness to your progress — one message a week is enough.","Five minutes on Sunday: count and write this week's streak."]},
    {k:"مرمت",ur:"مرمت",en:"Return after a miss",items:[12,13,14,15],sugUr:["چھوٹ جائے تو اگلے دن کی واپسی کو «معمول» سمجھیں — ڈرامہ نہیں، بس اگلا دن۔","چھوٹنے کی وجہ ایک سطر میں لکھیں؛ خود کو طعنہ نہیں، نظام کو سوال۔","اگلی ناکامی سے پہلے نظام میں ایک تبدیلی کر دیں — ارادہ وہی پرانا نہیں چلے گا۔"],sugEn:["If a day is missed, treat next-day return as normal — no drama, just the next day.","Write the cause of the miss in one line; question the system, not yourself.","Before the next failure, change one thing in the system — the same old resolve will not do."]}
  ],
  items:[
    {ur:"میری اچھی عادت کا سامان میری نظر کے سامنے رکھا ہوتا ہے۔",en:"The tools of my good habit are kept where I can see them."},
    {ur:"میں نے بری عادت تک پہنچنا اپنے لیے مشکل بنا دیا ہے۔",en:"I have deliberately made access to my bad habit harder."},
    {ur:"میری عادت کا ایک مقررہ اشارہ ہے — مقررہ وقت، جگہ یا اس سے پہلے کا عمل۔",en:"My habit has a fixed cue — a set time, place, or preceding action."},
    {ur:"میرے ماحول میں کوئی چیز یا شخص مجھے عادت کی یاد دلاتا ہے۔",en:"Something or someone in my environment reminds me of my habit."},
    {ur:"میری عادت بہت چھوٹی صورت سے شروع ہوتی ہے، بڑے عزم سے نہیں۔",en:"My habit starts in a very small form, not with a grand resolve."},
    {ur:"عادت کی تیاری پہلے سے ہو جاتی ہے، موقع پر سوچنا نہیں پڑتا۔",en:"Preparation for the habit is done in advance, not improvised on the spot."},
    {ur:"رکاوٹ والے دن کے لیے عادت کی آسان صورت پہلے سے طے ہے۔",en:"An easier version of the habit is pre-decided for difficult days."},
    {ur:"میں نے اپنی عادت کو کسی موجودہ عمل کے ساتھ جوڑ دیا ہے، جیسے نماز یا ناشتے کے فوراً بعد۔",en:"I have attached my habit to an existing routine, such as right after prayer or breakfast."},
    {ur:"میں اپنی عادت کا نشان کہیں لگاتا یا ریکارڈ لکھتا ہوں۔",en:"I visibly mark or record my habit each time."},
    {ur:"میری عادت کے دن اور وقت مقرر ہیں، موڈ پر نہیں چھوڑے گئے۔",en:"My habit's days and times are fixed, not left to my mood."},
    {ur:"کوئی ایک شخص میری پیش رفت دیکھ یا پوچھ سکتا ہے۔",en:"One person can see or ask about my progress."},
    {ur:"میں ہفتے کے آخر میں اپنے تسلسل کا جائزہ لیتا ہوں۔",en:"I review my streak at the end of the week."},
    {ur:"ایک دن چھوٹ جائے تو اگلے دن واپسی میرے لیے معمول کی بات ہے۔",en:"If a day is missed, returning the next day is normal for me."},
    {ur:"چھوٹنے پر میں خود کو طعنہ نہیں دیتا، وجہ دیکھتا ہوں۔",en:"When I miss, I look at the cause instead of taunting myself."},
    {ur:"مشکل دور کے لیے میری عادت کی «کم از کم صورت» پہلے سے طے ہے۔",en:"A minimum version of my habit is decided in advance for hard periods."},
    {ur:"ناکامی کے بعد میں نظام میں تبدیلی کرتا ہوں، صرف ارادہ سخت نہیں کرتا۔",en:"After a failure I change the system, not just harden my resolve."}
  ],
  bands:[
    {tur:"کچی بنیاد",ten:"A Raw Foundation",xur:"آپ کی عادت ارادے پر کھڑی ہے، اور ارادہ روز بدلتا ہے۔ کمزور دیوار [W] ہے — نقشہ یہیں سے بننا شروع ہوگا۔",xen:"Your habit stands on resolve, and resolve changes daily. The weak wall is [W] — the map starts being built right there."},
    {tur:"بنتی ہوئی عمارت",ten:"A Building Rising",xur:"عمارت اٹھ رہی ہے — [S] آپ کی مضبوط دیوار ہے۔ اب [W] کو اسی سطح پر لائیں؛ عادت پھر مزاج کی محتاج نہیں رہے گی۔",xen:"The building is rising — [S] is your strong wall. Now bring [W] to the same level; the habit will no longer depend on mood."},
    {tur:"مضبوط معماری",ten:"Strong Architecture",xur:"آپ کی عادت اب نظام پر چلتی ہے، موڈ پر نہیں۔ [W] کی معمولی مرمت اسے طوفانی موسم کے لیے بھی تیار کر دے گی۔",xen:"Your habit now runs on a system, not on mood. A small repair to [W] will ready it even for stormy seasons."}
  ]
};

var SAMT_SIG={
  id:"sama",type:"sig",sig:true,chart:"bars",cat:"lead",badge:"sig",next:"rise",mins:4,
  ur:"سمت اشاریہ",en:"RISE Direction Index",
  blurbUr:"«دھند میں دوڑ سب سے تھکا دینے والی دوڑ ہے» — RISE کے چار سوالات کا اشاریہ: شناخت، سمت، نظم اور ڈیجیٹل زندگی۔ دھند کوئی جرم نہیں — یہ ہر نوجوان کے راستے کا پہلا موسم ہے۔",
  blurbEn:"'Running in fog is the most exhausting run' — the RISE index of four questions: identity, direction, order and digital life. Fog is no crime — it is the first season of every young person's road.",
  noteUr:"ہر جملے پر بتائیں کہ یہ بات آپ میں کتنی باقاعدگی سے سچ ہے۔",noteEn:"For each statement, say how regularly this is true of you.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کے پروگرام RISE: Youth Life Design کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on the practical foundation of Imran Aslam's RISE: Youth Life Design programme.",
  dims:[
    {k:"شناخت",ur:"شناخت",en:"Identity",items:[0,1,2,3],sugUr:["کاغذ پر تین جملے لکھیں: مجھے کس کام میں وقت کا پتہ نہیں چلتا۔","ایک اہل شخص سے پوچھیں: «آپ کو میری سب سے بڑی صلاحیت کیا لگتی ہے؟»","اس ہفتے ایک نئی چھوٹی چیز آزمائیں اور نتیجہ لکھیں — پسند یا ناپسند، دونوں معلومات ہیں۔"],sugEn:["Write three sentences on paper: in which work do I lose track of time?","Ask one capable person: 'What do you see as my biggest strength?'","Try one small new thing this week and write the result — like or dislike, both are information."]},
    {k:"سمت",ur:"سمت",en:"Direction",items:[4,5,6,7],sugUr:["اگلے دو سال کی ایک تصویر تین سطروں میں لکھیں — مبہم ہو تو بھی لکھیں۔","اپنے شعبے کے تین آگے بڑھے ہوئے لوگوں کے راستے پڑھیں یا سنیں۔","اس مہینے ایک چھوٹا قدم اٹھائیں جو آپ کے ممکنہ راستے کو آزمائے۔"],sugEn:["Write a three-line picture of the next two years — even if it is vague, write it.","Read or hear the paths of three people ahead of you in your field.","Take one small step this month that tests your possible path."]},
    {k:"نظم",ur:"نظم",en:"Order",items:[8,9,10,11],sugUr:["دن کی تین بڑی باتیں صبح لکھ لیں — فہرست لمبی نہیں، ترجیح صاف ہو۔","ایک مقررہ مطالعہ یا مشق کا وقت مقرر کریں، چاہے پچیس منٹ ہی ہو۔","رات کو دن کا سکرین ٹائم دیکھنا معمول بنائیں — الزام نہیں، صرف آگاہی۔"],sugEn:["Write the day's three big things in the morning — not a long list, clear priorities.","Fix a set study or practice time — even twenty-five minutes.","Make checking the day's screen time a nightly habit — no blame, just awareness."]},
    {k:"ڈیجیٹل",ur:"ڈیجیٹل زندگی",en:"Digital life",items:[12,13,14,15],sugUr:["ایک گھنٹہ روزانہ فون سے سیکھنے یا بنانے کے لیے مقرر کریں — صرف دیکھنے کے لیے نہیں۔","اپنی فیڈ کا جائزہ لیں: تین ایسے اکاؤنٹ ان فالو کریں جو صرف حسد بڑھاتے ہیں۔","سونے سے آدھا گھنٹہ پہلے فون کو دوسرے کمرے میں رکھنا شروع کریں۔"],sugEn:["Fix one hour daily for learning or making on the phone — not just watching.","Review your feed: unfollow three accounts that only breed envy.","Start putting the phone in another room half an hour before sleep."]}
  ],
  items:[
    {ur:"میں کہہ سکتا ہوں کہ مجھے کس کام میں وقت کا پتہ ہی نہیں چلتا۔",en:"I can name the work in which I lose all track of time."},
    {ur:"میں نے اپنی طاقتوں اور کمزوریوں کے بارے میں لکھ کر یا سوچ کر واضح کیا ہے۔",en:"I have reflected or written clearly about my strengths and weaknesses."},
    {ur:"میں دوسروں کے کہنے کے علاوہ خود بھی اپنے شوق کو آزما چکا ہوں۔",en:"Beyond what others say, I have tested my own interests myself."},
    {ur:"عمر اور خاندان کی توقعات کے باوجود کچھ چیزیں ایسی ہیں جو میں اپنے لیے خود چنتا ہوں۔",en:"Despite age and family expectations, some things I choose for myself."},
    {ur:"مجھے اپنے اگلے دو سال کا کم از کم مبہم نقشہ معلوم ہے۔",en:"I have at least a rough map of my next two years."},
    {ur:"میں نے اپنے ممکنہ شعبے کے آگے بڑھے لوگوں کے راستے پڑھے یا سنے ہیں۔",en:"I have read or heard the paths of people ahead of me in my possible field."},
    {ur:"میرا موجودہ تعلیمی یا عملی راستہ میرے اپنے چناؤ سے جڑا ہے، صرف حالات سے نہیں۔",en:"My current study or work path connects to my own choice, not only to circumstances."},
    {ur:"میں اگلے قدم کے بارے میں سوچنے کے علاوہ اسے آزمانے کا بھی کوئی قدم اٹھا چکا ہوں۔",en:"Beyond thinking about the next step, I have taken some step to test it."},
    {ur:"میری نیند اور جاگنے کے اوقات لگ بھگ مقرر ہیں۔",en:"My sleep and waking times are roughly fixed."},
    {ur:"میں دن کی اہم باتیں پہلے سے طے کرتا ہوں، دن مجھے نہیں دھکیلتا۔",en:"I decide the day's important things in advance; the day does not push me."},
    {ur:"مجھے اپنے روزانہ سکرین ٹائم کا اصل اندازہ ہے اور میں نے چیک کیا ہوا ہے۔",en:"I know my actual daily screen time — I have checked it."},
    {ur:"میرا مطالعہ یا مشق کا وقت مقرر ہے، موڈ پر منحصر نہیں۔",en:"My study or practice time is fixed, not dependent on mood."},
    {ur:"میں فون پر دوسروں کو دیکھنے کے علاوہ خود کچھ بناتا یا سیکھتا بھی ہوں۔",en:"Beyond watching others on my phone, I also create or learn something myself."},
    {ur:"جن اکاؤنٹس کو میں فالو کرتا ہوں، ان کا مجھ پر زیادہ تر اثر مثبت پڑتا ہے۔",en:"The accounts I follow affect me mostly positively."},
    {ur:"میں دوسرے نوجوانوں کی کامیابی دیکھ کر راستہ سوچتا ہوں، اپنی زندگی سے بیزار نہیں ہوتا۔",en:"Seeing other young people's success makes me think about my path, not hate my own life."},
    {ur:"سو셜 میڈیا کا وقت میری نیند اور پڑھائی سے نہیں ٹکراتا۔",en:"Social media time does not collide with my sleep and study."}
  ],
  bands:[
    {tur:"دھند میں",ten:"In the Fog",xur:"دھند کوئی جرم نہیں — یہ ہر نوجوان کے راستے کا پہلا موسم ہے۔ آپ کی روشنی [S] ہے؛ پہلا قدم [W] کی طرف ایک چھوٹا، آزمائشی قدم ہے۔",xen:"Fog is no crime — it is the first season of every young person's road. Your light is [S]; the first step is one small, testing step toward [W]."},
    {tur:"راستہ بن رہا ہے",ten:"The Path Is Forming",xur:"دھند چھٹ رہی ہے — سمت کی کرن [S] میں نظر آتی ہے۔ اب کام [W] کا ہے: اسے روز کے معمول میں ڈھالنا۔",xen:"The fog is clearing — a ray of direction shows in [S]. Now the work is [W]: turning it into a daily routine."},
    {tur:"سمت صاف ہے",ten:"Direction Is Clear",xur:"آپ کی سمت صاف ہے اور نظام اس کا ساتھ دے رہا ہے۔ اب سوال رفتار کا ہے — [W] کو بھی اسی معیار پر لائیں اور دوڑ شروع کریں۔",xen:"Your direction is clear and your system supports it. The question now is speed — bring [W] to the same standard and begin the run."}
  ]
};

var DILEUSTAAD_SIG={
  id:"teacher",type:"sig",sig:true,chart:"bars",cat:"lead",badge:"sig",next:"teach",mins:3,
  ur:"دلِ استاد اشاریہ",en:"Teach With Heart Index",
  blurbUr:"«استاد کا دل تھک جائے تو کلاس زندہ نہیں رہتی» — Teach With Heart پروگرام کی بنیاد پر: طلبہ کو سمجھنا، آزمائش میں صبر، فیڈبیک کا لہجہ، کلاس کا ماحول اور استاد کی اپنی توانائی۔",
  blurbEn:"'When a teacher's heart tires, the class stops living' — built on the Teach With Heart programme: understanding students, patience under pressure, feedback tone, classroom climate and the teacher's own energy.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔",noteEn:"For each statement, say how regularly this behaviour is found in you.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کے پروگرام Teach With Heart کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on the practical foundation of Imran Aslam's Teach With Heart programme.",
  dims:[
    {k:"سمجھنا",ur:"طلبہ کو سمجھنا",en:"Understanding students",items:[0,1,2],sugUr:["اس ہفتے ایک کمزور طالب علم سے پڑھائی کے علاوہ دو منٹ کی بات کریں۔","کلاس کے ہر بچے کی ایک خوبی لکھیں — خاص طور پر اس کی جس سے شکایت رہتی ہے۔","سوال پوچھنے پر پہلا جواب اپنے دل میں نقل کریں، پھر ردعمل دیں۔"],sugEn:["Speak two minutes beyond studies with one weak student this week.","Write one strength of every child in class — especially the one you complain about.","When asked a question, repeat it inwardly first, then respond."]},
    {k:"صبر",ur:"آزمائش میں صبر",en:"Patience under pressure",items:[3,4,5],sugUr:["شرارت پر پہلا ردعمل آواز نہیں، خاموشی اور قریب جانا رکھیں۔","تنبیہ سے پہلے ایک سوال پوچھیں: «کیا ہوا؟» — وجہ سزا سے پہلے آئے۔","مشکل لمحے میں تاخیر کی عادت رکھیں: جواب کلاس کے اختتام پر، فیصلہ ٹھنڈے دل سے۔"],sugEn:["At mischief, let your first response be silence and moving closer — not voice.","Before a warning, ask one question: 'What happened?' — the cause before the consequence.","In hard moments, delay: the answer at the class's end, the decision with a cool heart."]},
    {k:"فیڈبیک",ur:"فیڈبیک کا لہجہ",en:"Feedback tone",items:[6,7,8],sugUr:["درستگی کے ساتھ ایک مخصوص اچھی بات ضرور جوڑیں — «یہ سطر درست ہے، یہ جگہ دیکھو»۔","کاپی پر صرف نمبر نہیں، ایک سطر کا پیغام بھی لکھیں۔","غلطی کو بچے سے نہیں، کام سے جوڑیں: «یہ جواب ادھورا ہے»، «تم نہیں»۔"],sugEn:["Pair every correction with one specific strength — 'this line is right; look at this place'.","Write a one-line message on the copy, not just marks.","Attach the error to the work, not the child: 'this answer is incomplete' — never 'you are'."]},
    {k:"ماحول",ur:"کلاس کا ماحول",en:"Classroom climate",items:[9,10,11],sugUr:["کلاس کا آغاز ایک مثبت جملے سے کریں — شکایت سے نہیں۔","ہر ہفتے ایک طالب علم کو ذمہ داری دے کر اس پر اعتماد ظاہر کریں۔","کلاس میں غلط جواب پر ہنسی کا اصول ختم کریں: احترام کا اصول لکھ کر لگائیں۔"],sugEn:["Open the class with one positive sentence — not a complaint.","Trust one student each week with a responsibility.","End laughter at wrong answers: write and display a rule of respect."]},
    {k:"توانائی",ur:"استاد کی اپنی توانائی",en:"The teacher's own energy",items:[12,13,14],sugUr:["اپنی تھکن کا ایک اشارہ پہچانیں اور اس دن کلاس کا بوجھ ہلکا رکھیں۔","ہفتے میں ایک گھنٹہ صرف اپنے لیے مقرر کریں — سکول سے بالکل باہر۔","کسی ساتھی استاد سے اپنی مشکل بلا جھجک بانٹیں؛ اکیلا بوجھ دل کو تھکاتا ہے۔"],sugEn:["Learn one sign of your own exhaustion and lighten the class load that day.","Fix one hour a week only for yourself — entirely outside school.","Share your difficulty with a fellow teacher without hesitation; a lone load tires the heart."]}
  ],
  items:[
    {ur:"میں کمزور طالب علم کی پسماندگی کی وجہ جاننے کی کوشش کرتا ہوں، صرف نمبر نہیں دیکھتا۔",en:"I try to learn why a weak student lags, not only look at marks."},
    {ur:"میں ہر طالب علم کی کم از کم ایک خوبی نام لے کر جانتا ہوں۔",en:"I know at least one strength of every student, by name."},
    {ur:"میں طالب علم کے سوال کو بے وقعت سمجھ کر نظرانداز نہیں کرتا۔",en:"I never dismiss a student's question as worthless."},
    {ur:"طالب علم کی شرارت پر میرا پہلا ردعمل آواز اٹھانا نہیں ہوتا۔",en:"My first response to mischief is not a raised voice."},
    {ur:"میں تنبیہ سے پہلے وجہ پوچھ لیتا ہوں۔",en:"I ask the reason before issuing a warning."},
    {ur:"مشکل لمحے میں میں فیصلہ مؤخر کر سکتا ہوں، غصے میں سزا نہیں دیتا۔",en:"In a hard moment I can postpone the decision; I do not punish in anger."},
    {ur:"میری تصحیح میں طالب علم کو اپنی ایک اچھی بات بھی نظر آتی ہے۔",en:"My corrections also show the student one of their own strengths."},
    {ur:"میں فیڈبیک شخصیت پر نہیں، کام پر دیتا ہوں۔",en:"I give feedback on the work, not on the person."},
    {ur:"میں تصحیح اسی وقت یا جلد دے دیتا ہوں جب طالب علم اسے استعمال کر سکتا ہو۔",en:"I return corrections in time for the student to use them."},
    {ur:"میری کلاس میں غلط جواب دینا شرمندگی کی بات نہیں بنتا۔",en:"In my class, a wrong answer is not a source of shame."},
    {ur:"میں طلبہ کو ذمہ داری دے کر اعتماد کا اظہار کرتا ہوں۔",en:"I express trust by giving students responsibilities."},
    {ur:"کلاس کا آغاز شکایت سے نہیں، خوش آئند جملے سے ہوتا ہے۔",en:"My class begins with a welcome, not a complaint."},
    {ur:"میں اپنی تھکن کلاس کے بچوں پر نہیں اتارتا۔",en:"I do not unload my exhaustion on the children in class."},
    {ur:"میں اپنے آرام اور اپنے شوق کے لیے وقت بچاتا ہوں۔",en:"I protect time for my own rest and interests."},
    {ur:"مشکل دن کے بعد میں خود کو سنبھالنے کا کوئی طریقہ استعمال کرتا ہوں، جیسے خاموشی، چہل قدمی یا ساتھی سے بات۔",en:"After a hard day I use some way to restore myself — quiet, a walk, or a colleague's company."}
  ],
  bands:[
    {tur:"تھکا ہوا دل",ten:"A Tired Heart",xur:"یہ نمبر آپ کی قابلیت کا فیصلہ نہیں — یہ تھکن کی خبر ہے۔ [S] آپ کی باقی ماندہ روشنی ہے؛ اصل مسئلہ [W] میں ہے، مگر اس سے پہلے استاد کا اپنا حق ہے: آرام۔",xen:"This score is no verdict on your ability — it is news of exhaustion. [S] is your remaining light; the real issue is in [W], but before that, the teacher has his own right: rest."},
    {tur:"جاگتا ہوا دل",ten:"An Awakening Heart",xur:"دل جاگ رہا ہے اور کلاس اسے محسوس کرتی ہے۔ [W] کو سنبھال لیں تو آپ کی تدریس مہارت سے آگے بڑھ کر اثر بن جائے گی۔",xen:"The heart is awakening, and the class can feel it. Take hold of [W] and your teaching will move beyond skill into impact."},
    {tur:"روشن دل",ten:"A Radiant Heart",xur:"آپ کی کلاس میں بچے محفوظ بھی ہیں اور متحرک بھی — یہی استاد کی اصل کامیابی ہے۔ [W] کی چھوٹی سی مرمت اس روشنی کو مستقل کر دے گی۔",xen:"In your class children are both safe and alive — that is the teacher's real success. A small repair to [W] will make this light permanent."}
  ]
};

var BAIA_SIG={
  id:"sales",type:"sig",sig:true,chart:"bars",cat:"lead",badge:"sig",next:"sales",mins:3,
  ur:"بیع رویہ آئینہ",en:"Sales Conduct Mirror",
  blurbUr:"«دباؤ بیچتا ہے ایک بار، اعتماد بیچتا ہے ہر بار» — Behavioural Sales Excellence کے اصولوں پر: سننے کا تناسب، ضرورت کی تشخیص، فالو اپ کا نظم، انکار سے سنبھلنا اور سچائی و اعتماد۔",
  blurbEn:"'Pressure sells once; trust sells every time' — built on Behavioural Sales Excellence: listening ratio, need diagnosis, follow-up discipline, recovering from rejection, and truthfulness & trust.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔",noteEn:"For each statement, say how regularly this behaviour is found in you.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کے پروگرام Behavioural Sales Excellence کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on the practical foundation of Imran Aslam's Behavioural Sales Excellence programme.",
  dims:[
    {k:"سننا",ur:"سننے کا تناسب",en:"Listening ratio",items:[0,1,2],sugUr:["اگلی ملاقات میں پہلے دس منٹ صرف سوالات — پیشکش بالکل نہیں۔","گاہک کی آخری بات کو اپنے لفظوں میں دہرا کر تصدیق کریں۔","بات چیت کے بعد لکھیں: گاہک نے کیا کہا، میں نے کیا کہا — تناسب خود نظر آئے گا۔"],sugEn:["In the next meeting, the first ten minutes are questions only — no pitch at all.","Reflect the customer's last point back in your words and confirm it.","After a conversation, write what the customer said vs what you said — the ratio will show itself."]},
    {k:"تشخیص",ur:"ضرورت کی تشخیص",en:"Need diagnosis",items:[3,4,5],sugUr:["حل پیش کرنے سے پہلے تین سوالات لازمی پوچھیں — لکھ کر رکھیں۔","گاہک کی اصل پریشانی ایک جملے میں لکھیں، پھر اسی سے حل جوڑیں۔","اگر ضرورت آپ کی چیز سے میل نہ کھائے تو یہ بات گاہک کو خود بتا دیں۔"],sugEn:["Ask three set questions before presenting any solution — keep them written.","Write the customer's real problem in one sentence, then attach the solution to it.","If the need does not match your product, tell the customer so yourself."]},
    {k:"فالو اپ",ur:"فالو اپ کا نظم",en:"Follow-up discipline",items:[6,7,8],sugUr:["ہر وعدے کی تاریخ اسی وقت ڈائری میں لکھیں — یادداشت پر نہ چھوڑیں۔","فالو اپ میں ہر بار ایک نئی کارآمد بات شامل کریں، صرف یاد دہانی نہیں۔","رابطوں کی فہرست ہفتے میں ایک بار صاف کریں: کس کا وعدہ باقی ہے؟"],sugEn:["Write every promised date in the diary at once — never leave it to memory.","Add one new useful point in every follow-up, not just a reminder.","Clean your contact list weekly: whose promise is still pending?"]},
    {k:"انکار",ur:"انکار سے سنبھلنا",en:"Recovering from rejection",items:[9,10,11],sugUr:["انکار کے بعد دس منٹ میں تین سطریں لکھیں: کیا سیکھا، اگلی بار کیا بدلے گا۔","اگلی ملاقات اسی دن کریں — انکار کو دن کا اختتام نہ بننے دیں۔","انکار کو ذاتی عزت سے الگ رکھیں: گاہک نے وقت یا چیز کو انکار کیا، آپ کو نہیں۔"],sugEn:["After a rejection, write three lines within ten minutes: what I learned, what changes next time.","Hold the next meeting the same day — do not let rejection end the day.","Keep rejection separate from self-worth: the customer refused the timing or the thing, not you."]},
    {k:"سچائی",ur:"سچائی و اعتماد",en:"Truthfulness & trust",items:[12,13,14],sugUr:["اپنی چیز کی ایک حد گاہک کو خود بتائیں — اعتماد وہیں سے بنتا ہے۔","جس بات کا علم نہ ہو، اس پر «میں تصدیق کر کے بتاتا ہوں» کہنا معمول بنائیں۔","قیمت اور شرائط پہلی ملاقات میں صاف کر دیں؛ بعد کی حیرت اعتماد مارتی ہے۔"],sugEn:["Tell the customer one limit of your own product yourself — trust is built right there.","Make 'I will verify and tell you' your habit for anything you do not know.","Make price and terms clear in the first meeting; later surprises kill trust."]}
  ],
  items:[
    {ur:"گاہک سے ملاقات میں میری بات سے زیادہ گاہک کی بات ہوتی ہے۔",en:"In customer meetings, the customer speaks more than I do."},
    {ur:"میں گاہک کی بات بیچ میں نہیں کاٹتا۔",en:"I do not interrupt the customer."},
    {ur:"میں گاہک کی اصل بات اپنے لفظوں میں دہرا کر تصدیق کر لیتا ہوں۔",en:"I reflect the customer's real point back and confirm it."},
    {ur:"میں پیشکش سے پہلے گاہک کی ضرورت کی تشخیص کرتا ہوں۔",en:"I diagnose the customer's need before presenting an offer."},
    {ur:"میں گاہک سے وہ سوالات پوچھتا ہوں جو اس کی اصل پریشانی سامنے لائیں۔",en:"I ask questions that surface the customer's real problem."},
    {ur:"میں ہر گاہک کو ایک ہی تیار شدہ بات نہیں سناتا۔",en:"I do not give every customer the same prepared pitch."},
    {ur:"میں طے شدہ وقت پر فالو اپ ضرور کرتا ہوں، چاہے جواب منفی ہی کیوں نہ لگے۔",en:"I follow up at the promised time, even when the answer looks negative."},
    {ur:"میرا فالو اپ صرف یاد دہانی نہیں ہوتا، اس میں گاہک کے لیے کوئی کارآمد بات بھی ہوتی ہے۔",en:"My follow-up is not just a reminder — it carries something useful for the customer."},
    {ur:"میرے رابطوں اور وعدوں کا ریکارڈ لکھا ہوا موجود رہتا ہے۔",en:"My contacts and promises are kept in written record."},
    {ur:"انکار کے بعد میرا دن خراب نہیں ہوتا، میں اگلی ملاقات کی طرف بڑھ جاتا ہوں۔",en:"A rejection does not ruin my day; I move to the next meeting."},
    {ur:"میں انکار کی وجہ سمجھنے کی کوشش کرتا ہوں، گاہک کو قصوروار نہیں ٹھہراتا۔",en:"I try to understand the reason for a refusal instead of blaming the customer."},
    {ur:"مشکل گاہک سے ملاقات کے بعد بھی میرا رویہ اگلے گاہک کے ساتھ وہی مہذب رہتا ہے۔",en:"After a difficult customer, my manner with the next one stays just as courteous."},
    {ur:"میں اپنی چیز کی وہ حد یا کمزوری بھی بتا دیتا ہوں جو گاہک کے لیے اہم ہو۔",en:"I disclose a limit or weakness of my own product when it matters to the customer."},
    {ur:"جس بات کا مجھے علم نہ ہو، اس پر میں قیاس نہیں چلاتا، تصدیق کر کے بتاتا ہوں۔",en:"Where I lack knowledge, I do not guess — I verify and then tell."},
    {ur:"میں قیمت اور شرائط میں کچھ چھپا کر نہیں رکھتا۔",en:"I hide nothing in price or terms."}
  ],
  bands:[
    {tur:"دباؤ والا بیچنے والا",ten:"The Pressure Seller",xur:"یہ آئینہ آپ کی قابلیت نہیں، آپ کا طریقہ دکھا رہا ہے — اور طریقہ بدلا جا سکتا ہے۔ [W] اس وقت آپ کی فروخت کا سب سے مہنگا سوراخ ہے۔",xen:"This mirror shows not your ability but your method — and a method can be changed. [W] is currently the costliest leak in your selling."},
    {tur:"بنتا ہوا محافظِ اعتماد",ten:"A Guardian of Trust, Forming",xur:"بنیاد درست سمت میں ہے — [S] آپ کی اصل سرمایہ کاری ہے۔ [W] کو ٹھیک کرنا آپ کو اچھے بیچنے والے سے قابلِ اعتماد مشیر بنا دے گا۔",xen:"The foundation faces the right way — [S] is your real investment. Fixing [W] will turn you from a good seller into a trusted adviser."},
    {tur:"اعتماد کا بیچنے والا",ten:"The Trusted Seller",xur:"آپ وہ بیچنے والے ہیں جس کا نام گاہک خود آگے بتاتا ہے — یہی اصل کاروبار ہے۔ [W] کی دیکھ بھال اس اعتماد کو قائم رکھے گی۔",xen:"You are the seller whose name customers pass on themselves — that is the real business. Tending [W] will keep this trust standing."}
  ]
};

var FOORI_SIG={
  id:"childanger",type:"sig",sig:true,chart:"bars",cat:"rel",badge:"sig",next:"bookanger",mins:2,companion:true,fullTest:"parenting",
  ur:"غصے کے لمحے کا فوری آئینہ",en:"The Anger-Moment Mirror (Short)",
  blurbUr:"والدین آئینے کا مختصر ساتھی — صرف چھ سوالات: بچے کے غصے کے لمحے میں آپ کا اپنا لمحہ کیسا ہوتا ہے؟ مکمل تصویر کے لیے والدین آئینہ ضرور کریں۔",
  blurbEn:"The short companion to the Parenting Mirror — just six questions: what is your own moment like inside your child's angry moment? For the full picture, take the Parenting Mirror.",
  noteUr:"ہر جملے پر بتائیں کہ بچے کے غصے کے لمحوں میں یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔",noteEn:"For each statement, say how regularly this behaviour appears in you during your child's angry moments.",
  opts:SIG_FREQ,
  copyUr:"© AIDE — یہ آلہ عمران اسلم کی کتاب «بچے کا غصہ، والدین کا راستہ» کی عملی بنیاد پر تیار کیا گیا ہے۔",
  copyEn:"© AIDE — built on the practical foundation of Imran Aslam's book 'Bache Ka Ghussa, Walidain Ka Rasta'.",
  dims:[
    {k:"لمحے کا سکون",ur:"لمحے کا سکون",en:"Calm in the moment",items:[0,1,2],sugUr:["بچہ چیخے تو پہلے دس سیکنڈ خاموشی — پانی پیئیں یا وضو کریں۔","فیصلہ اور سزا غصے کے لمحے سے باہر رکھیں: «بات بعد میں ہوگی»۔","اپنی آواز کو بچے کی آواز سے ایک درجہ نیچے رکھیں۔"],sugEn:["When your child screams, take ten seconds of silence first — drink water or make wudu.","Keep decisions and punishment outside the angry moment: 'We will talk later.'","Keep your voice one notch below your child's."]},
    {k:"جڑاؤ و مرمت",ur:"جڑاؤ و مرمت",en:"Connection & repair",items:[3,4,5],sugUr:["پرسکون ہونے کے بعد پہلے ہاتھ بڑھائیں — گلے لگانا یا قریب بیٹھنا۔","اپنی زیادتی ہوئی ہو تو اسی شام بچے سے سچی معذرت کریں۔","ہر غصے والے دن سونے سے پہلے دو منٹ کی نرمی سے بات ضرور کریں۔"],sugEn:["Once calm, extend your hand first — a hug or sitting close.","If you overstepped, apologise sincerely to your child the same evening.","On every angry day, end with two minutes of gentle talk before sleep."]}
  ],
  items:[
    {ur:"بچہ چیخنے یا رونے لگے تو میری آواز اس سے اونچی نہیں ہوتی۔",en:"When my child screams or cries, my voice does not go higher than theirs."},
    {ur:"میں اس لمحے میں فیصلہ یا سزا نہیں سناتا، پہلے خود ٹھنڈا ہوتا ہوں۔",en:"In that moment I announce no decision or punishment; I cool down first."},
    {ur:"میں بچے کو فوراً چپ کرانے کے بجائے وجہ سمجھنے کی کوشش کرتا ہوں۔",en:"Instead of silencing my child at once, I try to understand the reason."},
    {ur:"بچہ پرسکون ہو جائے تو میں پہلے جڑاؤ کی طرف ہاتھ بڑھاتا ہوں۔",en:"Once my child is calm, I am the first to reach for connection."},
    {ur:"اس دن اگر مجھ سے زیادتی ہوئی ہو تو میں بچے سے معذرت کر لیتا ہوں۔",en:"If I overstepped that day, I apologise to my child."},
    {ur:"غصے والا دن گزرے تو رات کو تعلق کی مرمت سونے سے پہلے ہو جاتی ہے۔",en:"After an angry day, the relationship is repaired before sleep."}
  ],
  bands:[
    {tur:"آگ میں جواب",ten:"Answering Fire with Fire",xur:"لمحہ آپ پر سوار ہو جاتا ہے — اور یہ خبر بری نہیں، کیونکہ لمحہ سنبھالنا سیکھا جا سکتا ہے۔ آپ کی بچت [S] ہے؛ اصل مشق [W] کی ہے۔",xen:"The moment rides you — and this is not bad news, because the moment can be learned. Your saving grace is [S]; the real practice is [W]."},
    {tur:"سنبھلتا ہوا لمحہ",ten:"A Moment Coming Under Control",xur:"آپ لمحے کو پہچاننے لگے ہیں — [S] اس کی علامت ہے۔ [W] پر چند ہفتوں کی مشق اسے عادت میں بدل دے گی۔",xen:"You have begun to recognise the moment — [S] is its sign. A few weeks of practice on [W] will turn this into habit."},
    {tur:"ٹھہرا ہوا لمحہ",ten:"A Settled Moment",xur:"بچے کے طوفان میں آپ کا لمحہ ٹھہرا رہتا ہے — یہی بچے کے لیے اصل حفاظت ہے۔ [W] کو اسی سطح پر رکھنا اب صرف توجہ کا کام ہے۔",xen:"Your moment stays settled inside your child's storm — that is the child's real protection. Keeping [W] at this level is now only a matter of attention."}
  ]
};

var TALLUQ_REF={
  id:"relating",type:"sig",sig:false,chart:"bars",cat:"rel",badge:"ref",next:"homes",mins:4,
  ur:"اندازِ تعلق",en:"How I Relate",
  blurbUr:"«تعلق کا انداز قسمت نہیں، عادت ہے۔» — قریبی رشتے میں اعتماد، قربت، فاصلہ اور مرمت: چار جہتوں میں اپنے انداز کی جھلک دیکھیں۔ یہ غور و فکر کا آئینہ ہے، کوئی لیبل یا تشخیص نہیں۔",
  blurbEn:"'How we relate is habit, not fate.' — trust, closeness, space and repair in your closest relationship: see your own pattern across four dimensions. A mirror for reflection, not a label or a diagnosis.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔ جواب اپنے قریبی ترین رشتے کو ذہن میں رکھ کر دیں۔",noteEn:"For each statement, say how regularly this behaviour is found in you. Answer with your closest relationship in mind.",
  opts:SIG_FREQ,
  src:"AIDE کا اپنا غور و فکر آلہ — تشخیص یا لیبل کے لیے نہیں · AIDE's own reflection tool — not a diagnosis or a label",
  dims:[
    {k:"اعتماد",ur:"اعتماد",en:"Trust",items:[0,1,2,3],sugUr:["اس ہفتے شریکِ حیات کی ایک بات پر فوراً شک کے بجائے پہلے اچھا گمان رکھ کر سنیں۔","ایک بات جو آپ چھپا رہے تھے، مناسب وقت پر خود بتا دیں — اعتماد بتانے سے بنتا ہے۔","فون یا پیغامات چیک کرنے کی خواہش ہو تو ایک دن رک کر دیکھیں، کیا واقعی ضرورت تھی۔"],sugEn:["This week, hear one thing from your spouse with good faith first, instead of instant suspicion.","Tell them one thing you have been holding back, at a fitting time — trust is built by telling.","When you feel like checking their phone or messages, wait a day and see whether it was truly needed."]},
    {k:"قربت",ur:"قربت",en:"Closeness",items:[4,5,6,7],sugUr:["روز ایک لمحہ ایسا نکالیں جس میں آپ اپنی ضرورت یا خواہش صاف کہہ سکیں۔","تھکاوٹ یا پریشانی چھپانے کے بجائے ایک جملے میں بتا دیں: «آج میں ٹھیک نہیں۔»","شریکِ حیات کے دن کی ایک بات یاد رکھ کر شام کو خود پوچھیں۔"],sugEn:["Each day, take one moment to state a need or wish plainly.","Instead of hiding tiredness or worry, say it in one sentence: 'I am not okay today.'","Remember one thing from their day and ask about it yourself in the evening."]},
    {k:"فاصلہ",ur:"فاصلہ و آزادی",en:"Space & Independence",items:[8,9,10,11],sugUr:["شریکِ حیات کو اس کے اپنے وقت پر ایک بار بغیر سوال کے جگہ دیں۔","اپنا ایک شوق یا مشغلہ اس ہفتے دوبارہ شروع کریں — تعلق کے باہر بھی زندگی ہے۔","فاصلے کی خواہش پر برا ماننے کے بجائے پوچھیں: «تمھیں کس چیز کی ضرورت ہے؟»"],sugEn:["Once this week, give your spouse their own time without questioning it.","Restart one hobby of your own this week — there is life outside the relationship too.","Instead of taking a wish for space personally, ask: 'What do you need?'"]},
    {k:"مرمت",ur:"مرمت",en:"Repair",items:[12,13,14,15],sugUr:["اگلی ناراضی پر پہلا قدم خود اٹھائیں — چائے کا کپ بھی مرمت کی شروعات ہو سکتا ہے۔","معذرت میں «لیکن» نہ لائیں؛ صرف «مجھ سے غلطی ہوئی» کہہ کر رک جائیں۔","پرانا جھگڑا زبان پر آئے تو اسے روک کر موجودہ بات پر رہیں۔"],sugEn:["At the next disagreement, take the first step yourself — even a cup of tea can open a repair.","Apologise without a 'but'; say 'I was wrong' and stop there.","When an old fight rises to your lips, hold it back and stay with the present matter."]}
  ],
  items:[
    {ur:"میں شریکِ حیات کی بات پر پہلے اچھا گمان رکھتا ہوں، فوراً شک نہیں کرتا۔",en:"I assume good intent in my spouse's words before suspecting otherwise."},
    {ur:"میں اپنی کمزوری یا غلطی شریکِ حیات سے چھپائے بغیر بتا دیتا ہوں۔",en:"I tell my spouse about my weaknesses and mistakes without hiding them."},
    {ur:"شریکِ حیات کی غیر موجودگی میں مجھے اس کی طرف سے بے چینی نہیں ہوتی۔",en:"I do not grow anxious about my spouse when they are away."},
    {ur:"میں شریکِ حیات کے فون یا ذاتی چیزوں کی جانچ پڑتال نہیں کرتا۔",en:"I do not check my spouse's phone or personal things."},
    {ur:"میں اپنی ضرورت یا خواہش صاف لفظوں میں کہہ دیتا ہوں، اشاروں پر نہیں چھوڑتا۔",en:"I state my needs and wishes plainly instead of leaving them to hints."},
    {ur:"تھکا یا پریشان ہوں تو میں یہ بات چھپانے کے بجائے بتا دیتا ہوں۔",en:"When I am tired or worried, I say so instead of hiding it."},
    {ur:"میں شریکِ حیات کے قریب رہنا پسند کرتا ہوں — بات میں بھی، خاموشی میں بھی۔",en:"I like being close to my spouse — in conversation and in silence alike."},
    {ur:"میں شریکِ حیات کو اپنی زندگی کی چھوٹی چھوٹی باتیں خود بتاتا ہوں۔",en:"I share the small details of my life with my spouse without being asked."},
    {ur:"شریکِ حیات کو اپنے دوستوں یا مشاغل کے لیے وقت ملے تو مجھے برا نہیں لگتا۔",en:"I do not mind my spouse taking time for their own friends or interests."},
    {ur:"میں اپنے فیصلے خود بھی کر لیتا ہوں، ہر بات پر شریکِ حیات کی تصدیق ضروری نہیں سمجھتا۔",en:"I can make my own decisions without needing my spouse's approval for everything."},
    {ur:"شریکِ حیات کو تنہائی چاہیے ہو تو میں اسے ذاتی ناراضی نہیں سمجھتا۔",en:"When my spouse wants solitude, I do not take it as a personal rejection."},
    {ur:"میرے اپنے مشاغل اور دلچسپیاں ہیں جو صرف میرے ہیں۔",en:"I have my own interests that belong only to me."},
    {ur:"جھگڑے کے بعد میں بات چیت دوبارہ شروع کرنے میں پہل کرتا ہوں۔",en:"After a fight, I take the initiative to restart conversation."},
    {ur:"میری غلطی ہو تو میں معذرت کر لیتا ہوں، بات کو طول نہیں دیتا۔",en:"When I am wrong, I apologise instead of dragging the matter out."},
    {ur:"ناراضی کے دنوں میں بھی میں بنیادی احترام اور خیال قائم رکھتا ہوں۔",en:"Even on days of displeasure, I keep basic respect and care intact."},
    {ur:"پرانے جھگڑے کو میں نئی بات میں دلیل بنا کر نہیں لاتا۔",en:"I do not bring old fights into a new disagreement as evidence."}
  ],
  bands:[
    {tur:"محتاط تعلق",ten:"Guarded Relating",xur:"آپ کے تعلق میں احتیاط زیادہ ہے، کھلنا کم — اور یہ اکثر پرانی چوٹ کی حفاظت ہوتی ہے، بے حسی نہیں۔ آپ کی طاقت [S] ہے؛ پہلا قدم [W] سے لیں، چھوٹا سا، بغیر جلدی کے۔",xen:"Your relating holds more caution than openness — often an old hurt protecting itself, not coldness. Your strength is [S]; take the first small step in [W], without hurry."},
    {tur:"بن رہا تعلق",ten:"Relating in Progress",xur:"بنیاد موجود ہے — اعتماد بھی ہے، کوشش بھی۔ [W] وہ جگہ ہے جہاں تھوڑی سی مستقل توجہ تعلق کا رنگ بدل دے گی؛ [S] آپ کا سہارا ہے۔",xen:"The foundation is there — trust and effort both. [W] is where a little steady attention will change the colour of the relationship; [S] is what holds you."},
    {tur:"پرسکون تعلق",ten:"Settled Relating",xur:"آپ کا اندازِ تعلق ٹھہرا ہوا ہے — نہ چمٹنا، نہ بھاگنا۔ [S] آپ کی پہچان ہے؛ [W] کو بھی اسی سطح پر لانا اب صرف توجہ کا سوال ہے۔",xen:"Your way of relating is settled — neither clinging nor running. [S] is your mark; bringing [W] to the same level is now only a matter of attention."}
  ]
};

var MOHABBAT_REF={
  id:"lovestyle",type:"sig",sig:false,chart:"bars",cat:"rel",badge:"ref",next:"homes",mins:4,
  ur:"محبت کا انداز",en:"How Love Is Shown",
  blurbUr:"«محبت دل میں ہو تو کافی نہیں — اسے دکھانا بھی پڑتا ہے۔» — سننا، الفاظ، خدمت اور وقت: چار انداز میں دیکھیں کہ آپ کی محبت گھر تک کیسے پہنچتی ہے۔",
  blurbEn:"'Love in the heart is not enough — it has to be shown.' — listening, words, service and time: see how your love actually reaches home, across four ways of showing it.",
  noteUr:"ہر جملے پر بتائیں کہ یہ رویہ آپ میں کتنی باقاعدگی سے پایا جاتا ہے۔ جواب اپنے شریکِ حیات یا قریبی رشتے کو ذہن میں رکھ کر دیں۔",noteEn:"For each statement, say how regularly this behaviour is found in you. Answer with your spouse or closest relationship in mind.",
  opts:SIG_FREQ,
  src:"AIDE کا اپنا غور و فکر آلہ — تشخیص یا لیبل کے لیے نہیں · AIDE's own reflection tool — not a diagnosis or a label",
  dims:[
    {k:"سننا",ur:"سننا و توجہ",en:"Listening & Attention",items:[0,1,2,3],sugUr:["آج شام شریکِ حیات کی ایک بات فون ایک طرف رکھ کر پوری سنیں۔","اس کی کہی ہوئی ایک چھوٹی بات یاد رکھیں اور کل خود اس کا ذکر کریں۔","بات کے دوران مشورہ دینے سے پہلے صرف سنیں — حل بعد میں، توجہ پہلے۔"],sugEn:["This evening, hear one thing from your spouse fully, phone put aside.","Remember one small thing they said and mention it yourself tomorrow.","During a conversation, only listen before advising — attention first, solutions later."]},
    {k:"الفاظ",ur:"الفاظ و عزت",en:"Words & Respect",items:[4,5,6,7],sugUr:["آج ایک اچھی بات کا نام لے کر شکریہ کہیں — «تم نے یہ اچھا کیا»۔","اختلاف میں ایک جملہ نرمی سے کہیں، وہی بات جو غصے میں کہنی تھی۔","شریکِ حیات کی تعریف کسی اور کے سامنے کریں — عزت وہیں بڑھتی ہے۔"],sugEn:["Today, thank them by naming one good thing — 'You did this well.'","In a disagreement, say one sentence gently — the same thing anger wanted to say.","Praise your spouse in front of someone else — respect grows there."]},
    {k:"خدمت",ur:"خدمت و خیال",en:"Service & Care",items:[8,9,10,11],sugUr:["بغیر کہے ایک کام اٹھا لیں جو عام طور پر وہی کرتا ہے۔","اس کی تھکن دیکھ کر چائے یا آرام کا انتظام خود کریں۔","ایک چھوٹی ضرورت — دوا، کپڑا، کوئی چیز — یاد رکھ کر پوری کریں۔"],sugEn:["Without being asked, take up one task they usually do.","Seeing their tiredness, arrange tea or rest yourself.","Remember one small need — medicine, clothing, something — and fulfil it."]},
    {k:"وقت",ur:"وقت و قربت",en:"Time & Closeness",items:[12,13,14,15],sugUr:["اس ہفتے ایک شام صرف دونوں کی رکھیں — مہمان نہیں، فون نہیں۔","دن میں ایک بار ساتھ چائے یا کھانا بغیر اسکرین کے گزاریں۔","سونے سے پہلے دس منٹ بات کریں — دن کی بات، کل کی نہیں۔"],sugEn:["This week, keep one evening for just the two of you — no guests, no phones.","Once a day, share tea or a meal together without a screen.","Talk for ten minutes before sleep — about today, not tomorrow's worries."]}
  ],
  items:[
    {ur:"شریکِ حیات بات کرے تو میں کام چھوڑ کر اس کی طرف متوجہ ہو جاتا ہوں۔",en:"When my spouse speaks, I leave my work and turn toward them."},
    {ur:"میں اس کی کہی ہوئی چھوٹی باتیں یاد رکھتا ہوں۔",en:"I remember the small things they tell me."},
    {ur:"میں اس کے مزاج کی تبدیلی محسوس کر کے پوچھ لیتا ہوں کہ کیا بات ہے۔",en:"I notice a change in their mood and ask what is wrong."},
    {ur:"میں اس کی بات کاٹے بغیر پوری سن لیتا ہوں، حل فوراً نہیں تھوپتا۔",en:"I hear them out fully without interrupting or forcing a solution at once."},
    {ur:"میں اچھی بات پر کھل کر شکریہ اور تعریف کرتا ہوں۔",en:"I thank and praise openly when something is done well."},
    {ur:"اختلاف میں بھی میرے الفاظ میں طنز اور طعنہ نہیں آتا۔",en:"Even in disagreement, my words carry no sarcasm or taunts."},
    {ur:"میں شریکِ حیات کی عزت دوسروں کے سامنے بھی قائم رکھتا ہوں۔",en:"I uphold my spouse's dignity in front of others too."},
    {ur:"میں اپنی محبت یا قدر کا اظہار الفاظ میں بھی کرتا ہوں، صرف دل میں نہیں رکھتا۔",en:"I express my love and appreciation in words too, not only in my heart."},
    {ur:"میں گھر کا کوئی کام بغیر کہے خود اٹھا لیتا ہوں۔",en:"I take up household work myself, without being asked."},
    {ur:"شریکِ حیات تھکا ہو تو میں اس کا بوجھ ہلکا کرنے کی کوشش کرتا ہوں۔",en:"When my spouse is tired, I try to lighten their load."},
    {ur:"میں اس کی ضروریات — صحت، آرام، چھوٹی خواہشیں — کا خیال رکھتا ہوں۔",en:"I look after their needs — health, rest, small wishes."},
    {ur:"میں اس کی آسانی کے لیے اپنی عادت یا منصوبہ بدل بھی لیتا ہوں۔",en:"I will change my own habit or plan for their ease."},
    {ur:"ہم ہفتے میں کچھ وقت صرف اپنے دونوں کے لیے نکالتے ہیں۔",en:"We take out some time every week that is only for the two of us."},
    {ur:"دن کا ایک کھانا یا چائے ہم اکٹھے، بغیر اسکرین کے گزارتے ہیں۔",en:"We share at least one meal or tea daily, without a screen."},
    {ur:"میں شریکِ حیات کے ساتھ وقت گزارنے میں دلچسپی لیتا ہوں، یہ مجھ پر بوجھ نہیں۔",en:"I take pleasure in spending time with my spouse; it is not a burden on me."},
    {ur:"ہمارے درمیان چھوٹی چھوٹی خوش گوار عادتیں ہیں — چائے، سیر، کوئی مشترکہ لمحہ۔",en:"We have small pleasant rituals between us — tea, a walk, some shared moment."}
  ],
  bands:[
    {tur:"محبت، مگر ان کہی",ten:"Love, Unspoken",xur:"محبت موجود ہے، مگر راستہ بند ہے — دل کی بات گھر تک نہیں پہنچ رہی۔ [S] آپ کی کھڑکی ہے؛ آغاز [W] سے کریں، ایک چھوٹے اظہار سے۔",xen:"Love is present, but the road is closed — what the heart holds is not reaching home. [S] is your open window; begin with [W], with one small expression."},
    {tur:"محبت، کہی جا رہی",ten:"Love, Being Spoken",xur:"اظہار ہو رہا ہے، مگر کچھ انداز اب بھی خاموش ہیں۔ [S] آپ کی زبان ہے — اسی روانی کو [W] تک لے جائیں۔",xen:"Love is being expressed, but some ways of showing it are still silent. [S] is your fluent tongue — carry that same fluency into [W]."},
    {tur:"محبت، جی جا رہی",ten:"Love, Being Lived",xur:"آپ کی محبت صرف کہی نہیں جاتی، جی جاتی ہے — گھر اسے محسوس کرتا ہے۔ [S] آپ کی پہچان ہے؛ [W] پر نظر رکھیں تاکہ کوئی کونہ اندھیرا نہ رہے۔",xen:"Your love is not only spoken, it is lived — home can feel it. [S] is your mark; keep an eye on [W] so no corner stays dark."}
  ]
};

var CAREER_REF={
  id:"careerdir",type:"sig",sig:false,chart:"bars",cat:"lead",badge:"ref",next:"coaching",mins:4,
  ur:"کیریئر سمت جائزہ",en:"Career Direction Check",
  blurbUr:"«نوکری ڈھونڈنے سے پہلے سمت ڈھونڈنی ہوتی ہے۔» — اپنی طاقت، میدان کی حقیقت، مہارت کا راستہ اور اگلا قدم: دیکھیں آپ کی تیاری کہاں کھڑی ہے۔ دلچسپیوں کے لیے RIASEC بھی یہیں ہے۔",
  blurbEn:"'Before hunting for a job, you have to find a direction.' — your strengths, the reality of the field, the skill path and the next step: see where your preparation stands. RIASEC, for interests, is here too.",
  noteUr:"ہر جملے پر بتائیں کہ یہ بات آپ پر کتنی باقاعدگی سے صادق آتی ہے۔",noteEn:"For each statement, say how regularly it holds true for you.",
  opts:SIG_FREQ,
  src:"AIDE کا اپنا غور و فکر آلہ — تشخیص یا لیبل کے لیے نہیں · AIDE's own reflection tool — not a diagnosis or a label",
  dims:[
    {k:"شناخت",ur:"خود شناسی",en:"Knowing My Strengths",items:[0,1,2,3],sugUr:["اپنی تین اصل طاقتیں لکھیں — نمبر نہیں، کام: کیا چیز آپ سے اچھی ہوتی ہے۔","کسی قریبی شخص سے پوچھیں: «مجھ میں کون سی خوبی سب سے نمایاں ہے؟»","ایک ہفتہ نوٹ کریں: کون سا کام کرتے ہوئے وقت کا پتہ نہیں چلتا۔"],sugEn:["Write down three real strengths — not marks, but work: what do you do well?","Ask someone close: 'What strength of mine stands out most?'","For one week, note which work makes you lose track of time."]},
    {k:"حقیقت",ur:"میدان کی حقیقت",en:"Knowing the Field",items:[4,5,6,7],sugUr:["اپنے پسندیدہ شعبے کے کسی اصل انسان سے اس ہفتے ایک ملاقات یا کال کریں۔","اس شعبے کی شروع کی آمدنی اور محنت — دونوں — کی حقیقت لکھ کر سامنے رکھیں۔","دو متبادل راستے بھی لکھیں، تاکہ ایک دروازہ بند ہو تو دوسرا معلوم ہو۔"],sugEn:["This week, meet or call one real person in your field of interest.","Write down both the starting income and the hard work of that field — and keep it in front of you.","Write down two alternative paths too, so a closed door leaves another one known."]},
    {k:"مہارت",ur:"مہارت کا راستہ",en:"The Skill Path",items:[8,9,10,11],sugUr:["ایک قابلِ فروخت مہارت چنیں اور اس ہفتے اس پر روز آدھا گھنٹہ لگائیں۔","سیکھنے کا ثبوت بنائیں — ایک چھوٹا نمونہ، ایک تحریر، ایک کام جو دکھایا جا سکے۔","کسی استاد یا رہنما سے پوچھیں: «اس مہارت میں اگلا درجہ کیا ہے؟»"],sugEn:["Choose one sellable skill and give it half an hour daily this week.","Build proof of learning — a small sample, a piece of writing, work that can be shown.","Ask a teacher or mentor: 'What is the next level in this skill?'"]},
    {k:"عزم",ur:"عزم و اگلا قدم",en:"Commitment & Next Step",items:[12,13,14,15],sugUr:["اگلے تین ماہ کا ایک ہدف لکھیں — ایک جملہ، تاریخ کے ساتھ۔","ہفتے میں ہدف کے لیے تین مقررہ گھنٹے ڈائری میں بند کر دیں۔","آج ہی پہلا چھوٹا قدم اٹھائیں — درخواست، رابطہ، یا پہلا سبق۔"],sugEn:["Write one goal for the next three months — one sentence, with a date.","Block three fixed hours in your diary each week for the goal.","Take the first small step today — an application, a contact, or a first lesson."]}
  ],
  items:[
    {ur:"ڈگری اور نمبروں سے ہٹ کر، میں اپنی کام والی طاقت کا نام لے سکتا ہوں۔",en:"Apart from degrees and marks, I can name the strength I actually work with."},
    {ur:"میں جانتا ہوں کہ کون سا کام مجھے توانائی دیتا ہے اور کون سا تھکا دیتا ہے۔",en:"I know which work energises me and which drains me."},
    {ur:"میں اپنی کمزوریوں کو بھی نام لے کر جانتا ہوں، ان سے بھاگتا نہیں۔",en:"I know my weaknesses by name too, and do not run from them."},
    {ur:"میں نے اپنی طاقتوں پر دوسروں کی رائے بھی لی ہے، صرف اپنا اندازہ نہیں۔",en:"I have sought others' opinions on my strengths, not only my own guess."},
    {ur:"میں نے اس شعبے میں کام کرنے والے کسی شخص سے اس کی روزمرہ حقیقت پوچھی ہے۔",en:"I have asked someone working in that field about its everyday reality."},
    {ur:"میں اس شعبے کی شروع کی آمدنی اور محنت — دونوں — کی حقیقت جانتا ہوں۔",en:"I know the reality of both the starting income and the hard work in that field."},
    {ur:"میں جانتا ہوں کہ اس شعبے میں داخلے کے لیے کیا چاہیے — مہارت، سند یا تجربہ۔",en:"I know what entry into that field requires — skill, credential or experience."},
    {ur:"میرے پاس ایک متبادل راستہ بھی ہے، اگر پہلا راستہ نہ کھلے۔",en:"I have an alternative path in mind if the first one does not open."},
    {ur:"میں اس وقت کوئی ایک قابلِ فروخت مہارت باقاعدگی سے سیکھ رہا ہوں۔",en:"I am currently learning one sellable skill regularly."},
    {ur:"میرے ہفتے میں سیکھنے کے لیے مقررہ وقت نکلتا ہے۔",en:"Time for learning is set aside in my week."},
    {ur:"میرے پاس اپنے کام کا کوئی ثبوت ہے — نمونہ، تحریر یا تجربہ — جو دکھایا جا سکے۔",en:"I have some proof of my work — a sample, writing or experience — that can be shown."},
    {ur:"میرا کوئی استاد، رہنما یا تجربہ کار شخص ہے جس سے میں سیکھتا ہوں۔",en:"I have a teacher, mentor or experienced person I learn from."},
    {ur:"اگلے تین ماہ کے لیے میرا ایک واضح ہدف لکھا ہوا موجود ہے۔",en:"I have one clear goal for the next three months, written down."},
    {ur:"میں جانتا ہوں کہ میرا ہدف کیوں ہے، صرف یہ نہیں کہ وہ کیا ہے۔",en:"I know why my goal matters, not just what it is."},
    {ur:"میں نے ہدف کی طرف پہلا عملی قدم اٹھا لیا ہے، صرف سوچا نہیں۔",en:"I have taken a first practical step toward the goal, not only thought about it."},
    {ur:"میں ہر ہفتے یا مہینے اپنی پیش رفت کا جائزہ لیتا ہوں۔",en:"I review my progress every week or month."}
  ],
  bands:[
    {tur:"سمت کی تلاش",ten:"Searching for Direction",xur:"سمت ابھی دھند میں ہے — اور یہ شرم کی بات نہیں، شروعات کی علامت ہے۔ [S] آپ کی روشنی ہے؛ پہلا قدم [W] سے لیں، چھوٹا سا اور ٹھوس۔",xen:"Direction is still in mist — no shame in that; it is the sign of a beginning. [S] is your light; take the first step in [W], small and solid."},
    {tur:"سمت بن رہی ہے",ten:"Direction Forming",xur:"کچھ اینٹیں لگ چکی ہیں — [S] آپ کو آگے دھکیل رہی ہے۔ اب [W] پر مستقل توجہ، اور راستہ صاف ہونے لگے گا۔",xen:"Some bricks are laid — [S] is pushing you forward. Now steady attention on [W], and the road will start to clear."},
    {tur:"سمت صاف، قدم اٹھ رہا",ten:"Clear Direction, Moving",xur:"آپ جانتے ہیں کہ کہاں جانا ہے اور قدم بھی اٹھ رہا ہے — یہی اصل تیاری ہے۔ [S] کو قائم رکھیں اور [W] کو بھی اسی سطح پر لائیں۔",xen:"You know where you are going and the step is being taken — that is real preparation. Hold [S] steady and bring [W] to the same level."}
  ]
};

var LOCKED=[];

/* ============ ASSEMBLE PLAYABLE LIST ============ */
var PLAYABLE=[];
TESTS.forEach(function(bt){
  var m=BANK_META[bt.id];
  if(["habits","relationships","leadership"].indexOf(bt.id)>=0) return; /* replaced by AIDE signature instruments below (same ids) */
  PLAYABLE.push({id:bt.id,type:"bank",cat:m.cat,badge:"ref",next:m.next,mins:parseInt(bt.mins)||2,
    ur:m.ur,en:bt.name,blurbUr:bt.blurb,blurbEn:bt.blurb,noteUr:"",noteEn:"",
    bank:bt});
});
PLAYABLE.push(ROSENBERG,WHO5,SWLS,BIGFIVE,RIASEC);
PLAYABLE.push(GRIT,MAAS,GQ6,PSS,BRS,GSE,KANSAS,RDAS,WLEIS,PPS);
PLAYABLE.push(USWA_SIG,WALIDAIN_SIG,SUKOON_SIG,HABITMAP_SIG,SAMT_SIG,DILEUSTAAD_SIG,BAIA_SIG,FOORI_SIG);
PLAYABLE.push(TALLUQ_REF,MOHABBAT_REF,CAREER_REF);
var BY_ID={}; PLAYABLE.forEach(function(x){BY_ID[x.id]=x;});

/* ============ STATE (localStorage) ============ */
var LS_KEY="aideAssessDemo.v1";
var store={results:{},progress:{}};
try{ var raw=localStorage.getItem(LS_KEY); if(raw){ var p=JSON.parse(raw); if(p&&p.results) store=p; } }catch(e){}
function save(){ try{ localStorage.setItem(LS_KEY,JSON.stringify(store)); }catch(e){} }
var curFilter="all", curTest=null, curIdx=0, curAnswers=[];

/* ============ MOTION STATE / HELPERS ============ */
var AC_RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
var curView="hub", _seenCards={}, _qDir=1, _lastPct=0, _advancing=false, _dashCounted=false;
function countUp(el,to,dur,from){
  if(!el) return;
  from = from||0;
  if(AC_RM||!dur){ el.textContent=to; return; }
  var st=null;
  function step(ts){ if(!st)st=ts; var p=Math.min((ts-st)/dur,1), e=1-Math.pow(1-p,3); el.textContent=Math.round(from+(to-from)*e); if(p<1) requestAnimationFrame(step); else el.textContent=to; }
  requestAnimationFrame(step);
}

/* ============ SCORING ============ */
function bandIndex(bands,score){ for(var i=0;i<bands.length;i++){ if(score<=bands[i].max) return i; } return bands.length-1; }
function computeResult(test,answers){
  var i,total,pct;
  if(test.type==="bank"){
    var bt=test.bank; total=0;
    for(i=0;i<bt.qs.length;i++){ var v=answers[i]||0; if(bt.rev.indexOf(i)>=0) v=3-v; total+=v; }
    pct=Math.round(total/(bt.qs.length*3)*100);
    var bands = bt.mode==="concern"?BC:BS, bi;
    if(bt.mode==="concern"){ bi = pct<=33?0:(pct<=66?1:2); } else { bi = pct>=67?0:(pct>=34?1:2); }
    var b=bands[bi], sw=BANK_SW[bt.mode][bi];
    return {score:pct,max:100,pct:pct,bandUr:b.t,bandEn:b.t,meanUr:b.x,meanEn:b.x,
      sUr:sw.s,sEn:sw.s,wUr:sw.w,wEn:sw.w,traits:null,code:null,displayScore:pct,displayMax:100};
  }
  if(test.type==="sig"){
    var dims=test.dims.map(function(d){ var sm=0; d.items.forEach(function(ix){ sm+=(answers[ix]==null?1:answers[ix]); }); var mm=sm/d.items.length; return {k:d.k,ur:d.ur,en:d.en,pct:Math.round((mm-1)/4*100)}; });
    var opct=Math.round(dims.reduce(function(s2,x){return s2+x.pct;},0)/dims.length);
    var biS=opct>=70?2:(opct>=40?1:0), bdS=test.bands[biS];
    var srt=dims.slice().sort(function(a,b){return b.pct-a.pct;});
    var topD=srt[0], weakD=srt[srt.length-1];
    function fillS(s,lg){ return s.split("[S]").join(lg==="ur"?topD.ur:topD.en).split("[W]").join(lg==="ur"?weakD.ur:weakD.en); }
    var wdDef=null; test.dims.forEach(function(d){ if(d.k===weakD.k) wdDef=d; });
    var tiedAll = weakD.pct===topD.pct;
    var wUrS = tiedAll ? "آپ کی تمام جہتیں برابر ہیں ("+topD.pct+"٪) — اس وقت کوئی جہت کمزور نہیں۔ نیچے کے عملی قدم اسی توازن کو برقرار رکھنے اور مزید آگے بڑھانے کے لیے ہیں۔"
                       : "کمزور ترین جہت «"+weakD.ur+"» ("+weakD.pct+"٪) ہے — اگلا قدم یہیں سے شروع ہوتا ہے۔ نیچے اسی جہت کے تین عملی قدم دیے ہیں۔";
    var wEnS = tiedAll ? "All your dimensions are equal ("+topD.pct+"%) — no dimension is lagging right now. The practical steps below are for keeping this balance and building on it."
                       : "Your weakest dimension is "+weakD.en+" ("+weakD.pct+"%) — the next step starts here. Three practical steps for this very dimension are given below.";
    return {score:opct,max:100,pct:opct,bandUr:bdS.tur,bandEn:bdS.ten,meanUr:fillS(bdS.xur,"ur"),meanEn:fillS(bdS.xen,"en"),
      sUr:"آپ کی مضبوط ترین جہت «"+topD.ur+"» ("+topD.pct+"٪) ہے — یہی آپ کی بنیاد ہے، اسے قائم رکھیں۔",
      sEn:"Your strongest dimension is "+topD.en+" ("+topD.pct+"%) — this is your foundation; keep it standing.",
      wUr:wUrS,
      wEn:wEnS,
      traits:dims,code:null,topUr:topD.ur,topEn:topD.en,weakUr:weakD.ur,weakEn:weakD.en,displayScore:opct,displayMax:100,
      gUr:wdDef?wdDef.sugUr.slice():null,gEn:wdDef?wdDef.sugEn.slice():null};
  }
  if(test.type==="scale"||test.type==="scale7"){
    total=0; var mn = test.minPer||0;
    for(i=0;i<test.items.length;i++){ var a=answers[i]; if(a==null) a=mn; if(test.rev.indexOf(i)>=0) a=(test.perMax+mn)-a; total+=a; }
    var maxT=test.items.length*test.perMax, minT=test.items.length*mn;
    pct=Math.round((total-minT)/(maxT-minT)*100);
    var bi2=bandIndex(test.bands,total), bb=test.bands[bi2];
    return {score:total,max:maxT,pct:pct,bandUr:bb.tur,bandEn:bb.ten,meanUr:bb.xur,meanEn:bb.xen,
      sUr:bb.sur,sEn:bb.sen,wUr:bb.wur,wEn:bb.wen,traits:null,code:null,displayScore:(test.showPct?pct:total),displayMax:(test.showPct?100:maxT),gUr:bb.gur||null,gEn:bb.gen||null};
  }
  if(test.type==="who5"){
    total=0; for(i=0;i<test.items.length;i++){ total+=(answers[i]||0); }
    pct=total*4; var bi3=bandIndex(test.bands,pct), bw=test.bands[bi3];
    return {score:pct,max:100,pct:pct,bandUr:bw.tur,bandEn:bw.ten,meanUr:bw.xur,meanEn:bw.xen,
      sUr:bw.sur,sEn:bw.sen,wUr:bw.wur,wEn:bw.wen,traits:null,code:null,displayScore:pct,displayMax:100};
  }
  if(test.type==="traits"){
    var sums=test.traits.map(function(){return 0;}), counts=test.traits.map(function(){return 0;});
    test.items.forEach(function(it,i){ var a=answers[i]; if(a==null)a=0; if(it.rev) a=test.perMax-a; sums[it.tr]+=a; counts[it.tr]++; });
    var traits=test.traits.map(function(tr,i){ var mx=counts[i]*test.perMax; return {k:tr.k,ur:tr.ur,en:tr.en,pct:mx?Math.round(sums[i]/mx*100):0,lineUr:tr.lineUr,lineEn:tr.lineEn,hiUr:tr.hiUr,hiEn:tr.hiEn,loUr:tr.loUr,loEn:tr.loEn}; });
    var order=traits.map(function(x,i){return i;}).sort(function(x,y){return traits[y].pct-traits[x].pct;});
    var top=traits[order[0]], low=traits[order[order.length-1]];
    var avg=Math.round(traits.reduce(function(s,x){return s+x.pct;},0)/traits.length);
    if(test.blend){
      var second=traits[order[1]], lowest=traits[order[order.length-1]];
      return {score:avg,max:100,pct:avg,bandUr:"نمایاں امتزاج: "+top.ur+" + "+second.ur,bandEn:"Your dominant blend: "+top.en+" + "+second.en,
        meanUr:"آپ کے انداز میں سب سے نمایاں «"+top.ur+"» اور «"+second.ur+"» ہیں۔ "+top.lineUr+" یہ نقشہ کسی ایک لیبل کے لیے نہیں — اصل سوال یہ ہے کہ کون سی جہت اس وقت آپ کے بچے کو سب سے زیادہ چاہیے۔",
        meanEn:"Most prominent in your style are "+top.en+" and "+second.en+". "+top.lineEn+" This map is not for a single label — the real question is which dimension your child needs most right now.",
        sUr:top.hiUr,sEn:top.hiEn,wUr:lowest.loUr,wEn:lowest.loEn,traits:traits,code:null,topUr:top.ur,topEn:top.en,displayScore:avg,displayMax:100,
        gUr:["اس ہفتے سب سے کم جہت («"+lowest.ur+"») سے جڑا ایک چھوٹا عمل روزانہ کریں — صرف دس منٹ بھی کافی آغاز ہے۔","بچے سے پرسکون لمحے میں پوچھیں: «میرے کس رویے سے تمہیں سب سے زیادہ اچھا/مشکل لگتا ہے؟» — اور صرف سنیں۔","ایک قواعد-والا معاملہ چن کر اس کی وجہ بچے کو نرمی سے سمجھائیں — رہنمائی کی مشق وہیں سے شروع ہوتی ہے۔"],
        gEn:["This week, do one small daily act tied to your lowest dimension ("+lowest.en+") — even ten minutes is a real start.","In a calm moment ask your child: 'Which of my behaviours feels best/hardest to you?' — and only listen.","Pick one rules matter and gently explain its reason to your child — guidance practice starts there."]};
    }
    if(test.id==="riasec"){
      var code=order.slice(0,3).map(function(i){return traits[i].k;}).join("-");
      return {score:avg,max:100,pct:avg,bandUr:"دلچسپی کوڈ: "+code,bandEn:"Interest code: "+code,
        meanUr:"آپ کی سب سے گہری دلچسپی «"+top.ur+"» میں ہے۔ "+top.lineUr+" یہ کوڈ کیریئر کے انتخاب میں رہنمائی کے لیے ہے، پابندی کے لیے نہیں — اصل فیصلہ اپنی صلاحیت، مواقع اور اقدار کے ساتھ مل کر کریں۔",
        meanEn:"Your deepest interest is in "+top.en+". "+top.lineEn+" Use this code as guidance for career choice, not a cage — decide together with your ability, opportunities and values.",
        sUr:top.hiUr,sEn:top.hiEn,wUr:low.loUr,wEn:low.loEn,traits:traits,code:code,topUr:top.ur,topEn:top.en,displayScore:avg,displayMax:100};
    }
    return {score:avg,max:100,pct:avg,bandUr:"نمایاں خصوصیت: "+top.ur,bandEn:"Top trait: "+top.en,
      meanUr:"آپ کی نمایاں جہت «"+top.ur+"» ہے۔ "+top.lineUr+" یہ نقشہ طاقت اور احتیاط دونوں دکھاتا ہے — کمزور جہت کو دشمن نہیں، اگلی مشق سمجھیں۔",
      meanEn:"Your most prominent dimension is "+top.en+". "+top.lineEn+" This map shows both strength and caution — treat the lower dimension as your next practice, not an enemy.",
      sUr:top.hiUr,sEn:top.hiEn,wUr:low.loUr,wEn:low.loEn,traits:traits,code:null,topUr:top.ur,topEn:top.en,displayScore:avg,displayMax:100};
  }
  if(test.type==="mean"){
    total=0; var vals=[];
    for(i=0;i<test.items.length;i++){ var av=answers[i]; if(av==null) av=test.minPer; if(test.rev.indexOf(i)>=0) av=(test.perMax+test.minPer)-av; vals.push(av); total+=av; }
    var mean=total/test.items.length, dMean=Math.round(mean*10)/10;
    pct=Math.round((mean-test.minPer)/(test.perMax-test.minPer)*100);
    var bm=bandIndex(test.bands,mean), bd=test.bands[bm];
    var barsM=null;
    if(test.subs){ barsM=test.subs.map(function(sb){ var sm=0; sb.items.forEach(function(ix){ sm+=vals[ix]; }); var mm=sm/sb.items.length; return {ur:sb.ur,en:sb.en,pct:Math.round((mm-test.minPer)/(test.perMax-test.minPer)*100)}; }); }
    return {score:dMean,max:test.perMax,pct:pct,bandUr:bd.tur,bandEn:bd.ten,meanUr:bd.xur,meanEn:bd.xen,
      sUr:bd.sur,sEn:bd.sen,wUr:bd.wur,wEn:bd.wen,traits:null,code:null,displayScore:dMean,displayMax:test.perMax,frac:true,bars:barsM,gUr:bd.gur||null,gEn:bd.gen||null};
  }
  if(test.type==="submean"){
    var tSums=test.traits.map(function(){return 0;}), tCnt=test.traits.map(function(){return 0;}), tot2=0;
    test.items.forEach(function(it,i){ var a2=answers[i]; if(a2==null)a2=test.minPer; if(it.rev) a2=(test.perMax+test.minPer)-a2; var trI=(test.subs?test.subs.filter(function(x){return x.items.indexOf(i)>=0;})[0].tr:it.tr); tSums[trI]+=a2; tCnt[trI]++; tot2+=a2; });
    var oMean=tot2/test.items.length;
    var trs=test.traits.map(function(tr,i){ var m=tCnt[i]?tSums[i]/tCnt[i]:0; return {k:tr.k,ur:tr.ur,en:tr.en,pct:Math.round((m-test.minPer)/(test.perMax-test.minPer)*100)}; });
    var bs2=bandIndex(test.bands,oMean), bb2=test.bands[bs2];
    var avgP=Math.round((oMean-test.minPer)/(test.perMax-test.minPer)*100);
    return {score:Math.round(oMean*10)/10,max:test.perMax,pct:avgP,bandUr:bb2.tur,bandEn:bb2.ten,meanUr:bb2.xur,meanEn:bb2.xen,
      sUr:bb2.sur,sEn:bb2.sen,wUr:bb2.wur,wEn:bb2.wen,traits:trs,code:null,displayScore:Math.round(oMean*10)/10,displayMax:test.perMax,frac:true,gUr:bb2.gur||null,gEn:bb2.gen||null};
  }
  if(test.type==="subtotal"){
    total=0; for(i=0;i<test.items.length;i++){ total+=(answers[i]||0); }
    var maxS=test.items.length*test.perMax;
    pct=Math.round(total/maxS*100);
    var bs3=bandIndex(test.bands,total), bb3=test.bands[bs3];
    var barsS=test.subs.map(function(sb){ var sm2=0; sb.items.forEach(function(ix){ sm2+=(answers[ix]||0); }); var mx2=sb.items.length*test.perMax; return {ur:sb.ur,en:sb.en,pct:mx2?Math.round(sm2/mx2*100):0}; });
    return {score:total,max:maxS,pct:pct,bandUr:bb3.tur,bandEn:bb3.ten,meanUr:bb3.xur,meanEn:bb3.xen,
      sUr:bb3.sur,sEn:bb3.sen,wUr:bb3.wur,wEn:bb3.wen,traits:null,code:null,displayScore:total,displayMax:maxS,bars:barsS,gUr:bb3.gur||null,gEn:bb3.gen||null};
  }
  return null;
}

/* ============ VIEW HELPERS ============ */
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
/* Bring the current view into view, clear of the sticky nav (73px) plus a small gap.
   Views with a panel (intro/run/result) anchor on the panel itself so it starts right
   under the nav even on short screens; hub/dash anchor on the app top. Always called
   AFTER the view swap: scrolling first and then collapsing the tall hub mid-animation
   made the smooth scroll clamp and bounce instead of settling. */
function scrollToApp(){
  var app=$("acApp");
  if(!app){ window.scrollTo({top:0,behavior:"auto"}); return; }
  var el=app.querySelector("section.view:not(.hidden) .panel") || app;
  var y=el.getBoundingClientRect().top + window.scrollY - 86;
  window.scrollTo({top:Math.max(0,y), behavior:AC_RM?"auto":"smooth"});
}
function showView(v,back){
  $("tabHub").classList.toggle("on", v==="hub"||v==="intro"||v==="run"||v==="result");
  $("tabDash").classList.toggle("on", v==="dash");
  if(v==="hub") renderHub();
  if(v==="dash") renderDash();
  var prev=curView, curEl=$("view-"+prev), nxtEl=$("view-"+v);
  function swapAll(){ ["hub","intro","run","result","dash"].forEach(function(x){ $("view-"+x).classList.toggle("hidden", x!==v); }); }
  if(prev===v || !curEl || !nxtEl || AC_RM){
    swapAll();
    curEl && curEl.classList.remove("out","pre","pre-back");
    curView=v;
    scrollToApp();
    return;
  }
  curEl.classList.add("out");
  curEl.style.setProperty("--vx", back?"-14px":"14px");
  setTimeout(function(){
    curEl.classList.add("hidden"); curEl.classList.remove("out");
    nxtEl.classList.remove("hidden");
    nxtEl.classList.add(back?"pre-back":"pre");
    void nxtEl.offsetWidth;
    nxtEl.classList.remove("pre","pre-back");
    curView=v;
    scrollToApp();
  },200);
}
function badgeHtml(b){ if(b==="sig") return '<span class="badge sig">'+(lang==="ur"?"دستخطی اسیسمنٹ · AIDE اصل تخلیق ©":"Signature Assessment · AIDE Original ©")+'</span>'; return '<span class="badge '+(b==="val"?"val":"ref")+'">'+(b==="val"?t("valBadge"):t("refBadge"))+'</span>'; }
function lastResult(id){ var r=store.results[id]; return (r&&r.length)?r[r.length-1]:null; }

/* ============ HUB ============ */
function renderChips(){
  var h='<button class="chip'+(curFilter==="all"?" on":"")+'" onclick="setFilter(\'all\')">'+t("all")+'</button>';
  CATS.forEach(function(c){ h+='<button class="chip'+(curFilter===c.id?" on":"")+'" onclick="setFilter(\''+c.id+'\')">'+(lang==="ur"?c.ur:c.en)+'</button>'; });
  $("chips").innerHTML=h;
}
function setFilter(f){
  if(f===curFilter) return;
  curFilter=f;
  if(AC_RM){ renderHub(); return; }
  var g=$("hubGrid"); g.classList.add("fading");
  setTimeout(function(){ _seenCards={}; renderHub(); g.classList.remove("fading"); },170);
}
function renderHub(){
  renderChips();
  var hc=$("hubCount"); if(hc) hc.textContent = lang==="ur"?("🎯 کل "+PLAYABLE.length+" ٹیسٹ — سب قابلِ استعمال"):"🎯 "+PLAYABLE.length+" tests — all playable";
  var h="";
  var ordered=PLAYABLE.slice();
  if(curFilter==="all"){ ordered=PLAYABLE.filter(function(x){return x.sig;}).concat(PLAYABLE.filter(function(x){return !x.sig;})); }
  var sigHeadDone=false, restHeadDone=false;
  ordered.forEach(function(test){
    if(curFilter!=="all"&&test.cat!==curFilter) return;
    if(curFilter==="all"&&test.sig&&!sigHeadDone){ sigHeadDone=true; h+='<div class="sigsec"><h2>'+(lang==="ur"?"صرف یہاں — AIDE دستخطی اسیسمنٹس":"Only Here — AIDE Signature Assessments")+'</h2><p>'+esc(lang==="ur"?SIG_IDENTITY_UR:SIG_IDENTITY_EN)+'</p></div>'; }
    if(curFilter==="all"&&!test.sig&&!restHeadDone){ restHeadDone=true; h+='<div class="sigsec plain"><h2>'+(lang==="ur"?"مزید جائزے — عالمی پیمانے و خود جائزے":"More Assessments — Validated Scales & Self-Checks")+'</h2></div>'; }
    var lr=lastResult(test.id), prog=store.progress[test.id];
    var n = test.type==="bank"?test.bank.qs.length:test.items.length;
    h+='<div class="card'+(test.badge?" tone-"+test.badge:"")+(test.sig?" sigcard":"")+'" data-k="'+test.id+'">'+badgeHtml(test.badge)
      +'<h3>'+esc(lang==="ur"?test.ur:test.en)+'</h3>'
      +'<div class="enname en">'+esc(lang==="ur"?test.en:test.ur)+'</div>'
      +'<p>'+esc(lang==="ur"?test.blurbUr:test.blurbEn)+'</p>'
      +'<div class="meta"><span>❓ '+n+' '+t("qs")+'</span><span>⏱ '+test.mins+' '+t("mins")+'</span><span>'+esc(catName(test.cat))+'</span></div>'
      +(lr?'<span class="badge done">'+t("lastBand")+': '+esc(lang==="ur"?lr.bandUr:lr.bandEn)+'</span>':"")
      +'<div class="btnrow" style="margin-top:10px"><button class="btn" onclick="openIntro(\''+test.id+'\')">'+(prog?t("resume"):t("start"))+'</button>'
      +(lr?'<button class="btn ghost" onclick="openIntro(\''+test.id+'\')">'+t("retake")+'</button>':"")+'</div></div>';
  });
  LOCKED.forEach(function(lk){
    if(curFilter!=="all"&&lk.cat!==curFilter) return;
    h+='<div class="card locked" data-k="lk:'+esc(lk.ur)+'"><span class="badge ref">🔒 '+t("refBadge")+'</span>'
      +'<h3>'+esc(lang==="ur"?lk.ur:lk.en)+'</h3>'
      +'<div class="enname en">'+esc(lang==="ur"?lk.en:lk.ur)+'</div>'
      +'<div class="meta"><span>❓ '+lk.items+' '+t("qs")+'</span><span>'+esc(catName(lk.cat))+'</span></div>'
      +'<div class="locknote">🔒 '+t("lockedNote")+'</div></div>';
  });
  $("hubGrid").innerHTML=h;
  $("hubGrid").querySelectorAll(".card").forEach(function(c,i){
    var k=c.getAttribute("data-k");
    if(k && !_seenCards[k]){ _seenCards[k]=1; c.classList.add("enter"); c.style.setProperty("--i", Math.min(i,14)); }
  });
}

/* ============ INTRO ============ */
function openIntro(id){
  curTest=BY_ID[id]; if(!curTest) return;
  var test=curTest, n=test.type==="bank"?test.bank.qs.length:test.items.length;
  var prog=store.progress[id];
  var h=badgeHtml(test.badge)
    +'<h2>'+esc(lang==="ur"?test.ur:test.en)+'</h2>'
    +'<div class="enname en" style="color:var(--ink-dim)">'+esc(lang==="ur"?test.en:test.ur)+'</div>'
    +'<h4 style="color:var(--sea-hi);margin-top:14px">'+t("whatLooks")+'</h4>'
    +'<p class="sub">'+esc(lang==="ur"?test.blurbUr:test.blurbEn)+'</p>'
    +((lang==="ur"?test.noteUr:test.noteEn)?'<p class="sub" style="margin-top:6px">'+esc(lang==="ur"?test.noteUr:test.noteEn)+'</p>':"")
    +'<div class="meta" style="margin:14px 0"><span>❓ '+n+' '+t("qs")+'</span><span>⏱ '+test.mins+' '+t("mins")+'</span><span>🏷 '+esc(catName(test.cat))+'</span></div>'
    +'<div class="mini"><h4>🤲</h4><p>'+t("honesty")+'</p></div>'
    +(test.src?'<p class="sub" style="margin-top:8px;font-size:13px;opacity:.75">'+esc(test.src)+'</p>':"")
    +'<div class="btnrow"><button class="btn" onclick="startTest()">'+(prog?t("resume")+" ("+(prog.idx+1)+"/"+n+")":t("start"))+'</button>'
    +'<button class="btn ghost" onclick="showView(\'hub\',true)">'+t("home")+'</button></div>';
  $("introPanel").innerHTML=h;
  showView("intro");
}

/* ============ RUNNER ============ */
function startTest(){
  var id=curTest.id, prog=store.progress[id], n=curTest.type==="bank"?curTest.bank.qs.length:curTest.items.length;
  if(prog && prog.answers && prog.answers.length===n){ curAnswers=prog.answers.slice(); curIdx=Math.min(prog.idx||0,n-1); }
  else { curAnswers=new Array(n).fill(null); curIdx=0; }
  _lastPct=0; _qDir=1;
  renderQuestion(); showView("run");
}
function curItem(){
  var test=curTest;
  if(test.type==="bank") return {en:test.bank.qs[curIdx],ur:null};
  return test.items[curIdx];
}
function curOpts(){
  var test=curTest;
  if(test.type==="bank") return OPTS.map(function(o,i){ return {a:i,en:o,ur:OPTS_UR[i]}; });
  return test.opts;
}
function renderQuestion(){
  var test=curTest, n=test.type==="bank"?test.bank.qs.length:test.items.length;
  var it=curItem(), opts=curOpts();
  var pctDone=Math.round(curIdx/n*100);
  var h='<div class="qwrap" style="--qx:'+(_qDir<0?"28px":"-28px")+'">'
    +'<div class="ascwrap"><div class="ascmeta"><span>'+esc(lang==="ur"?test.ur:test.en)+'</span><span>'+t("qOf")+' '+(curIdx+1)+' / '+n+' · <span id="pctNum">'+pctDone+'</span>%</span></div>'
    +'<div class="asctrack"><div class="ascfill" style="width:'+pctDone+'%"></div></div></div>';
  if(it.ur){ h+='<div class="qtext">'+esc(it.ur)+'</div><div class="qtext-en en">'+esc(it.en)+'</div>'; }
  else { h+='<div class="qtext-en en" style="font-size:19px;color:var(--ink);margin-top:14px">'+esc(it.en)+'</div>'; }
  h+='<div class="opts">';
  opts.forEach(function(o){
    var sel = curAnswers[curIdx]===o.a;
    h+='<button class="opt'+(sel?" sel":"")+'" onclick="answer('+o.a+',this)"><span>'+esc(lang==="ur"?o.ur:o.en)+'</span><small class="en">'+esc(lang==="ur"?o.en:o.ur)+'</small></button>';
  });
  h+='</div><div class="qnav"><button class="btn ghost" '+(curIdx===0?'disabled':'')+' onclick="prevQ()">← '+t("back")+'</button>'
    +'<button class="btn ghost" onclick="quitTest()">'+t("home")+'</button></div></div>';
  $("runPanel").innerHTML=h;
  var f=$("runPanel").querySelector(".ascfill");
  if(f && !AC_RM){
    f.style.transition="none"; f.style.width=_lastPct+"%";
    void f.offsetWidth;
    f.style.transition=""; f.style.width=pctDone+"%";
  }
  countUp($("pctNum"),pctDone,400,_lastPct);
  _lastPct=pctDone;
}
function answer(a,el){
  if(_advancing) return;
  curAnswers[curIdx]=a;
  var test=curTest, n=test.type==="bank"?test.bank.qs.length:test.items.length;
  $("runPanel").querySelectorAll(".opt").forEach(function(o){ o.classList.remove("sel"); });
  if(el) el.classList.add("sel");
  if(curIdx<n-1){ store.progress[test.id]={answers:curAnswers.slice(),idx:curIdx+1}; save(); }
  _advancing=true; _qDir=1;
  var wrap=$("runPanel").querySelector(".qwrap");
  setTimeout(function(){
    if(wrap && !AC_RM) wrap.classList.add("qout");
    setTimeout(function(){
      _advancing=false;
      if(curIdx<n-1){ curIdx++; renderQuestion(); }
      else { delete store.progress[test.id]; save(); finishTest(); }
    }, AC_RM?0:170);
  }, AC_RM?0:250);
}
function prevQ(){ if(curIdx>0){ _qDir=-1; curIdx--; renderQuestion(); } }
function quitTest(){
  var test=curTest;
  if(curAnswers.some(function(x){return x!==null;})){ store.progress[test.id]={answers:curAnswers.slice(),idx:curIdx}; save(); }
  showView("hub",true);
}

/* ============ RESULT ============ */
function radarSVG(traits){
  var cx=170,cy=150,R=105,n=traits.length,pts=[],rings="";
  function pt(i,r){ var ang=-Math.PI/2 + i*2*Math.PI/n; return [cx+r*Math.cos(ang), cy+r*Math.sin(ang)]; }
  [0.33,0.66,1].forEach(function(f){ var rp=traits.map(function(_,i){ var p=pt(i,R*f); return p[0].toFixed(1)+","+p[1].toFixed(1); }).join(" "); rings+='<polygon points="'+rp+'" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1"/>'; });
  var data=traits.map(function(tr,i){ var p=pt(i,R*tr.pct/100); return p[0].toFixed(1)+","+p[1].toFixed(1); }).join(" ");
  var labels=traits.map(function(tr,i){ var p=pt(i,R+26); return '<text x="'+p[0].toFixed(1)+'" y="'+p[1].toFixed(1)+'" fill="#9FE8D6" font-size="14" font-weight="700" text-anchor="middle" dominant-baseline="middle">'+esc(tr.k)+'</text>'; }).join("");
  var dots=traits.map(function(tr,i){ var p=pt(i,R*tr.pct/100); return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="4" fill="#4FBFA7"/>'; }).join("");
  return '<svg width="340" height="300" viewBox="0 0 340 300" role="img">'+rings+'<polygon class="radar-poly" points="'+data+'" fill="rgba(61,171,148,.30)" stroke="#4FBFA7" stroke-width="2"/>'+dots+labels+'</svg>';
}
function finishTest(){
  var test=curTest, res=computeResult(test,curAnswers);
  res.guide=guidanceFor(test,res,curAnswers);
  if(!store.results[test.id]) store.results[test.id]=[];
  store.results[test.id].push({date:new Date().toISOString(),score:res.displayScore,max:res.displayMax,pct:res.pct,bandUr:res.bandUr,bandEn:res.bandEn,topUr:res.topUr||null,topEn:res.topEn||null,code:res.code||null});
  save();
  renderResult(test,res);
  showView("result");
}
function renderResult(test,res){
  var nx=NEXT[test.next]||NEXT.coaching;
  var msg="السلام علیکم، میں نے AIDE اسیسمنٹ سینٹر میں «"+test.ur+"» مکمل کیا ہے۔ میرا بینڈ: "+res.bandUr+"۔ میں "+nx.ur+" کے بارے میں مفت ڈسکوری کال چاہتا ہوں۔";
  var wa="https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg);
  var h='<div style="text-align:center">'+badgeHtml(test.badge)+'<h2 style="margin-top:8px">'+esc(lang==="ur"?test.ur:test.en)+'</h2></div>'
    +'<div class="bandname">'+esc(lang==="ur"?res.bandUr:res.bandEn)+'</div>'
    +'<div class="scoreline"><span id="scoreNum">0</span> '+t("scoreOf")+' '+res.displayMax+'</div>'
    +'<div class="gauge"><div class="gtrack"><div class="gfill"></div><div class="gmark" style="inset-inline-start:calc('+res.pct+'% - 2px)"></div></div>'
    +'<div class="glabels"><span>0</span><span>'+res.displayMax+'</span></div></div>';
  if(res.traits){
    if(test.chart!=="bars") h+='<div class="radarwrap">'+radarSVG(res.traits)+'</div>';
    res.traits.forEach(function(tr){
      h+='<div class="traitrow"><span class="tn">'+esc(lang==="ur"?tr.ur:tr.en)+'</span><span class="tbar"><span class="tfill" style="width:'+tr.pct+'%"></span></span><span class="tv">'+tr.pct+'%</span></div>';
    });
    if(res.code) h+='<p style="text-align:center;margin-top:10px"><b>'+t("yourCode")+':</b> <span class="en" style="font-size:19px;color:var(--sea-hi)">'+esc(res.code)+'</span></p>';
  }
  if(res.bars){
    res.bars.forEach(function(br){
      h+='<div class="traitrow"><span class="tn">'+esc(lang==="ur"?br.ur:br.en)+'</span><span class="tbar"><span class="tfill" style="width:'+br.pct+'%"></span></span><span class="tv">'+br.pct+'%</span></div>';
    });
  }
  h+='<div class="mini" style="margin-top:14px"><h4>'+t("meaning")+'</h4><p>'+esc(lang==="ur"?res.meanUr:res.meanEn)+'</p></div>'
    +'<div class="cols"><div class="mini"><h4>💪 '+t("strengths")+'</h4><p>'+esc(lang==="ur"?res.sUr:res.sEn)+'</p></div>'
    +'<div class="mini"><h4>⚠️ '+t("watchouts")+'</h4><p>'+esc(lang==="ur"?res.wUr:res.wEn)+'</p></div></div>'
    +(res.gUr?'<div class="mini" style="margin-top:14px"><h4>🌱 '+(lang==="ur"?"اس ہفتے کے عملی قدم":"Practical steps this week")+'</h4><ul style="margin:4px 0 0;padding-inline-start:20px">'+(lang==="ur"?res.gUr:res.gEn).map(function(g){return '<li style="margin:5px 0">'+esc(g)+'</li>';}).join("")+'</ul></div>':"")
    +(res.guide?'<div class="guide-block"><h4>🤝 AIDE رہنما — '+(lang==="ur"?"خودکار رہنمائی":"Automated Guidance")+'</h4><p>'+esc(lang==="ur"?res.guide.ur:res.guide.en)+'</p><div class="gmicro">'+(lang==="ur"?"یہ رہنمائی آپ کے جوابات کے نمونے سے اسی آلے میں بنی ہے — کوئی ڈیٹا باہر نہیں گیا۔ لائیو AI (Gemini) سے یہی رہنمائی مزید گہری ہوگی۔":"This guidance was generated inside this tool from the pattern of your answers — no data left your device. With live AI (Gemini) this same guidance becomes deeper.")+'</div></div>':"")
    +(test.sig?'<div class="signote">'+esc(lang==="ur"?test.copyUr:test.copyEn)+'<br>'+(lang==="ur"?SIG_HONESTY_UR:SIG_HONESTY_EN)+'<br>'+(lang==="ur"?"چار ہفتے بعد یہی جائزہ دوبارہ دے کر اپنی تبدیلی خود ناپیں۔":"Retake this same assessment after four weeks and measure your own change.")+'</div>':"")
    +(test.companion?'<div class="mini" style="margin-top:14px"><h4>📖 '+(lang==="ur"?"مکمل تصویر: والدین آئینہ":"The Full Picture: Parenting Mirror")+'</h4><p>'+(lang==="ur"?"یہ مختصر آئینہ صرف دو جہتوں کو دیکھتا ہے۔ مکمل چھ جہتوں کی تصویر کے لیے والدین آئینہ کریں — اور کتاب «بچے کا غصہ، والدین کا راستہ» اسی راستے کی تفصیلی رہنمائی ہے (کتابوں کی فہرست میں موجود)۔":"This short mirror sees only two dimensions. For the full six-dimension picture, take the Parenting Mirror — and the book 'Bache Ka Ghussa, Walidain Ka Rasta' is the detailed guide on this same path (available in the book catalogue).")+'</p><div class="btnrow"><button class="btn" onclick="openIntro(\'parenting\')">'+(lang==="ur"?"والدین آئینہ شروع کریں":"Start the Parenting Mirror")+'</button></div></div>':"")
    +'<div class="nextstep"><h4>'+t("nextStep")+': '+esc(lang==="ur"?nx.ur:nx.en)+'</h4>'
    +'<div class="btnrow"><a class="btn wa" target="_blank" rel="noopener" href="'+wa+'">💬 '+t("freeCall")+'</a></div></div>'
    +'<div class="btnrow"><button class="btn" onclick="shareCard()">🖼 '+t("share")+'</button>'
    +'<button class="btn ghost" onclick="showView(\'dash\')">'+t("dash")+'</button>'
    +'<button class="btn ghost" onclick="showView(\'hub\',true)">'+t("home")+'</button></div>'
    +'<div class="savednote">'+t("saved")+'</div>'
    +(test.src?'<div class="savednote">'+esc(test.src)+'</div>':"");
  $("resultPanel").innerHTML=h;
  /* staged reveal: gauge → score → meaning → chart → columns → CTA */
  var rp=$("resultPanel");
  rp.querySelectorAll(":scope > *").forEach(function(el,i){ el.classList.add("acrv"); el.style.animationDelay=Math.min(i*80,640)+"ms"; });
  var gm=rp.querySelector(".gmark");
  if(gm && !AC_RM){
    var tgt=gm.style.getPropertyValue("inset-inline-start");
    gm.style.transition="none"; gm.style.setProperty("inset-inline-start","0%");
    void gm.offsetWidth;
    gm.style.transition=""; gm.style.setProperty("inset-inline-start",tgt);
  }
  var gf=rp.querySelector(".gfill");
  if(gf){
    if(!AC_RM){ gf.style.transition="none"; gf.style.transform="scaleX(0)"; void gf.offsetWidth; gf.style.transition=""; }
    gf.style.transform="scaleX("+(res.pct/100)+")";
  }
  setTimeout(function(){
    var sn=$("scoreNum"); if(!sn) return;
    if(res.frac && !AC_RM){ var st0=null; (function tick(ts){ if(!st0)st0=ts; var pp=Math.min((ts-st0)/700,1), ee=1-Math.pow(1-pp,3); sn.textContent=(res.displayScore*ee).toFixed(1); if(pp<1) requestAnimationFrame(tick); else sn.textContent=res.displayScore.toFixed(1); })(performance.now()); }
    else if(res.frac){ sn.textContent=res.displayScore.toFixed(1); }
    else countUp(sn,res.displayScore,700);
  }, AC_RM?0:150);
  window._lastResult={test:test,res:res};
}


/* ============ PERSONALISED GUIDANCE (local, data-driven — not a model) ============ */
function _itemTheme(t,idx){
  if(!t.items||!t.items[idx]) return null;
  var it=t.items[idx];
  if(typeof it==="string") return (t.itemsUr&&t.itemsUr[idx])?t.itemsUr[idx]:it;
  return it.ur||it.en||null;
}
function _lowestItem(t,answers){
  var i,idx=-1,best=1e9;
  if(t.type==="sig"){
    for(i=0;i<t.items.length;i++){ var v=answers[i]==null?1:answers[i]; if(v<best){best=v;idx=i;} }
    return idx>=0?_itemTheme(t,idx):null;
  }
  if(t.type==="bank"){
    var bt=t.bank;
    for(i=0;i<bt.qs.length;i++){ var bv=answers[i]||0; if(bt.rev.indexOf(i)>=0) bv=3-bv; if(bv<best){best=bv;idx=i;} }
    return idx>=0?bt.qs[idx]:null;
  }
  if(t.type==="scale"||t.type==="scale7"||t.type==="who5"){
    var mx=t.perMax!=null?t.perMax:5, mn=t.minPer||0;
    for(i=0;i<t.items.length;i++){ var a=answers[i]==null?mn:answers[i]; if(t.rev&&t.rev.indexOf(i)>=0) a=(mx+mn)-a; if(a<best){best=a;idx=i;} }
    return idx>=0?_itemTheme(t,idx):null;
  }
  return null;
}
function guidanceFor(t,res,answers){
  var hash=7,i;
  for(i=0;i<answers.length;i++){ var av=answers[i]; hash=(hash*31+(av==null?3:av+3))>>>0; }
  var oi=hash%3, ci=hash%2;
  var theme=_lowestItem(t,answers);
  if(theme&&theme.length>85) theme=theme.slice(0,85)+"…";
  /* Urdu */
  var openU=["آپ کے جوابات کا نقشہ یہ کہتا ہے: ","آئینے میں جو تصویر ابھری، اس کا خلاصہ سادہ ہے: ","آپ کے جوابات سے تین باتیں صاف نظر آئیں: "][oi];
  var sU=[openU+"آپ کا مجموعی درجہ «"+res.bandUr+"» میں آیا ہے۔"];
  if(res.topUr&&res.weakUr&&res.topUr!==res.weakUr){
    if(oi===1){ sU.push("روشنی سب سے زیادہ «"+res.topUr+"» میں ہے — یہ آپ کی وہ طاقت ہے جس پر باقی عمارت کھڑی ہو سکتی ہے۔"); sU.push("اور اگلا قدم «"+res.weakUr+"» سے شروع ہوتا ہے؛ یہیں کی چھوٹی، مستقل کوشش سب سے بڑا فرق ڈالے گی۔"); }
    else if(oi===2){ sU.push("پہلی بات — طاقت «"+res.topUr+"» ہے۔"); sU.push("دوسری بات — اگلا قدم «"+res.weakUr+"» ہے؛ کمزوری کو دشمن نہ سمجھیں، یہ صرف اگلی مشق کا نام ہے۔"); }
    else { sU.push("سب سے نمایاں طاقت «"+res.topUr+"» ہے، اور اگلا قدم «"+res.weakUr+"» سے جڑا ہے — یہیں توجہ سب سے زیادہ رنگ لائے گی۔"); }
  } else if(res.topUr){
    sU.push("آپ کی نمایاں جہت «"+res.topUr+"» ہے — اسی کو بنیاد بنا کر آگے بڑھیں۔");
  }
  if(theme&&(oi!==2||!res.topUr)){ sU.push("ایک جواب خاص طور پر کمزور رہا: «"+theme+"» — اسی نکتے پر اس ہفتے کی مشق سب سے کارآمد ہوگی۔"); }
  sU.push(["یاد رکھیں: یہ نقشہ فیصلہ نہیں، سمت ہے — اصل تبدیلی آنے والے ہفتوں کے چھوٹے قدموں سے آئے گی۔","آخری بات: آج کا ایک چھوٹا قدم، کل کے بڑے عزم سے زیادہ قیمتی ہے۔"][ci]);
  /* English */
  var openE=["Your answers draw this map: ","The picture in the mirror, in short: ","Three things stand out in your answers: "][oi];
  var sE=[openE+"your overall band is \u201C"+res.bandEn+"\u201D."];
  if(res.topEn&&res.weakEn&&res.topEn!==res.weakEn){
    sE.push("Your clearest light is in \u201C"+res.topEn+"\u201D — the strength the rest can be built on.");
    sE.push("And your next step begins with \u201C"+res.weakEn+"\u201D; small, steady effort there will make the biggest difference.");
  } else if(res.topEn){
    sE.push("Your most prominent dimension is \u201C"+res.topEn+"\u201D — build forward from it.");
  }
  if(theme&&(oi!==2||!res.topEn)){ sE.push("One answer stood out as the weakest: \u201C"+theme+"\u201D — practice on this point will serve you most this week."); }
  sE.push(["Remember: this map is not a verdict — it is a direction. Real change comes from small steps in the coming weeks.","One last thing: one small step today is worth more than a grand resolve tomorrow."][ci]);
  return {ur:sU.join(" "),en:sE.join(" ")};
}

/* ============ AIDE ASSISTANT (demo: local knowledge engine) ============ */
var _asstSeeded=false;
function asstToggle(open){
  var p=$("asstPanel"); if(!p) return;
  var willOpen = open!=null?open:p.classList.contains("hidden");
  p.classList.toggle("hidden",!willOpen);
  if(willOpen&&!_asstSeeded){ _asstSeeded=true;
    asstAdd("bot","السلام علیکم! میں AIDE اسسٹنٹ ہوں۔ پروگراموں کی فیس، صحیح ٹیسٹ کے انتخاب، بکنگ یا کتابوں کے بارے میں پوچھیں — میں یہیں جواب دوں گا۔","Assalam-o-Alaikum! I am the AIDE Assistant. Ask me about programme fees, choosing the right test, booking, or the books — I will answer right here.");
  }
  if(willOpen){ var inp=$("asstInput"); if(inp) setTimeout(function(){ inp.focus(); },80); }
}
function asstAdd(who,ur,en,extra){
  var box=$("asstMsgs"); if(!box) return;
  var d=document.createElement("div");
  d.className="amsg "+who;
  var main=lang==="ur"?ur:en, sub=lang==="ur"?en:ur;
  d.innerHTML='<div class="amain">'+esc(main)+'</div>'+(sub&&sub!==main?'<div class="asub">'+esc(sub)+'</div>':"")+(extra||"");
  box.appendChild(d); box.scrollTop=box.scrollHeight;
}
function _asstTestBtns(ids){
  var h='<div class="abtns">';
  ids.forEach(function(id){ var tt=BY_ID[id]; if(tt) h+='<button class="btn sm" onclick="asstToggle(false);openIntro(\''+id+'\')">'+esc(lang==="ur"?tt.ur:tt.en)+'</button>'; });
  return h+'</div>';
}
var _ASST_WA='<div class="abtns"><a class="btn sm wa" target="_blank" rel="noopener" href="https://wa.me/923309222029">💬 WhatsApp پر بکنگ / بات کریں</a></div>';
function asstReply(qraw){
  var q=" "+(qraw||"").toLowerCase()+" ";
  function has(){ for(var i=0;i<arguments.length;i++){ if(q.indexOf(arguments[i])>=0) return true; } return false; }
  var feeWord=has("فیس","fee","fees","price","قیمت","چارج","cost","rate","ریٹ");
  /* booking */
  if(has("بکنگ","booking","book kar","appointment","اپوائنٹمنٹ","وقت لینا","ملاقات بک","سشن بک")){
    return {ur:"بکنگ بہت آسان ہے: نیچے والے WhatsApp بٹن سے پیغام بھیجیں — ٹیم آپ کو استاد/کوچ اور وقت کی تصدیق کر دے گی۔ سنگل کوچنگ سیشن PKR 7,500 (افتتاحی پیشکش میں 14 نومبر تا 31 دسمبر 2026: PKR 6,000) اور 4 سیشنز کا پیکج PKR 26,000 ہے۔",en:"Booking is simple: send a message on the WhatsApp button below — the team will confirm your coach and time. A single coaching session is PKR 7,500 (PKR 6,000 during the opening offer, 14 November–31 December 2026); the 4-session package is PKR 26,000.",wa:true};
  }
  /* privacy / dashboard */
  if(has("privacy","پرائیویسی","ڈیٹا","data","dashboard","ڈیش بورڈ","محفوظ","save ہو","delete","حذف")){
    return {ur:"آپ کے نتائج صرف اسی براؤزر میں محفوظ ہوتے ہیں — کوئی سرور، کوئی اکاؤنٹ، کوئی تیسرا فریق نہیں۔ «میرا ڈیش بورڈ» میں پوری تاریخ، رجحان اور ہر نتیجہ حذف کرنے کا اختیار موجود ہے؛ «تمام ڈیٹا صاف کریں» سے سب کچھ ایک کلک میں ختم ہو جاتا ہے۔",en:"Your results live only in this browser — no server, no account, no third party. In 'My Dashboard' you will find your full history, trends, and the option to delete any result; 'Clear all data' removes everything in one click."};
  }
  /* books */
  if(has("کتاب","book","books","پہلا سال","شادی سے پہلے","بچے کا غصہ")){
    return {ur:"ویب سائٹ پر 55 کتابیں موجود ہیں — شادی، گھر، والدین، دل و ذہن، کمیونٹی اور قیادت۔ ہر کتاب کے ساتھ مشق نامہ مفت ہے۔ قیمتیں 890 سے 1,990 روپے؛ 8 موضوعاتی مجموعے بھی ہیں۔ 14 نومبر تا 31 دسمبر 2026 افتتاحی رعایت 20 فیصد ہے۔ پہلی چار کتابوں کی تمہید اور پہلا باب مفت پڑھے جا سکتے ہیں۔ خرید اردو کتابوں کے صفحے سے کارٹ اور WhatsApp کے ذریعے ہوتی ہے۔",en:"The website carries 55 books — marriage, home, parenting, heart and mind, community and leadership. Every book includes a free workbook. Prices run from PKR 890 to 1,990, with 8 themed bundles. A 20% opening discount runs 14 November–31 December 2026. The introduction and first chapter of the first four books are free to read. Buying is via the Urdu books page cart and WhatsApp."};
  }
  /* specific programme fees */
  if(feeWord&&has("pldp","قیادت پروگرام","leadership programme","leadership program")) return {ur:"PLDP (Prophetic Leadership Development Program) کی فیس PKR 45,000 ہے؛ ارلی برڈ PKR 36,000۔ اسی پروگرام کا داخلی پیمانہ اسوہ قیادت آئینہ ہے — چاہیں تو پہلے وہ ٹیسٹ کر لیں۔",en:"PLDP (Prophetic Leadership Development Program) costs PKR 45,000; early bird PKR 36,000. Its own in-programme measure is the USWA Leadership Mirror — you can take that test first if you like.",tests:["leadership"]};
  if(feeWord&&has("habit","عادت")) return {ur:"Habit Architecture کی فیس PKR 12,000 ہے؛ ارلی برڈ PKR 9,000۔ اس کا اپنا نقشہ «عادت معماری نقشہ» یہیں موجود ہے۔",en:"Habit Architecture costs PKR 12,000; early bird PKR 9,000. Its own map — the Habit Architecture Map — is right here.",tests:["habits"]};
  if(feeWord&&has("strong homes","سکون","گھر پروگرام","steady hearts")) return {ur:"Strong Homes, Steady Hearts کی فیس PKR 12,000 ہے۔ اس کا اپنا پیمانہ «سکونِ گھر اشاریہ» یہیں سے شروع کیا جا سکتا ہے۔",en:"Strong Homes, Steady Hearts costs PKR 12,000. Its own measure — the Home Harmony Index — can be started right here.",tests:["relationships"]};
  if(feeWord&&has("rise","رائز")) return {ur:"RISE: Youth Life Design کی فیس PKR 15,000 ہے؛ ارلی برڈ PKR 12,000۔ نوجوانوں کے لیے اس کا اپنا آلہ «سمت اشاریہ» ہے۔",en:"RISE: Youth Life Design costs PKR 15,000; early bird PKR 12,000. Its own instrument for young people is the Direction Index.",tests:["sama"]};
  if(has("teach with heart","دلِ استاد پروگرام","استاد پروگرام","teacher programme","teacher program")&&feeWord) return {ur:"Teach With Heart اداروں کے لیے تجویز (proposal) کی بنیاد پر طے ہوتا ہے — اس کی کوئی عوامی فیس نہیں۔ تفصیل کے لیے WhatsApp پر رابطہ کریں۔",en:"Teach With Heart is arranged for institutions on a proposal basis — there is no public fee. Please contact us on WhatsApp for details.",wa:true};
  if(has("corporate","کارپوریٹ","کمپنی")&&feeWord) return {ur:"کارپوریٹ پروگرام تجویز (proposal) کی بنیاد پر طے ہوتے ہیں — کوئی عوامی ریٹ کارڈ نہیں۔ ضرورت بتائیں، ٹیم تجویز بھیج دے گی۔",en:"Corporate programmes are arranged on a proposal basis — there is no public rate card. Share your need and the team will send a proposal.",wa:true};
  if(feeWord&&has("session","سشن","کوچنگ","coaching")) return {ur:"سنگل کوچنگ سیشن PKR 7,500 ہے (افتتاحی پیشکش میں 14 نومبر تا 31 دسمبر 2026: PKR 6,000) اور 4 سیشنز کا پیکج PKR 26,000۔ بکنگ WhatsApp پر ہوتی ہے۔",en:"A single coaching session is PKR 7,500 (PKR 6,000 during the opening offer, 14 November–31 December 2026) and the 4-session package is PKR 26,000. Booking is via WhatsApp.",wa:true};
  if(feeWord) return {ur:"اہم فیس ایک نظر میں: PLDP 45,000 (ارلی برڈ 36,000) · Habit Architecture 12,000 (ارلی برڈ 9,000) · Strong Homes 12,000 · RISE 15,000 (ارلی برڈ 12,000) · سنگل کوچنگ سیشن 7,500 (افتتاحی: 6,000، 14 نومبر تا 31 دسمبر 2026) · 4 سیشنز پیکج 26,000۔ Teach With Heart اور کارپوریٹ پروگرام تجویز کی بنیاد پر ہوتے ہیں۔",en:"Key fees at a glance: PLDP 45,000 (early bird 36,000) · Habit Architecture 12,000 (early bird 9,000) · Strong Homes 12,000 · RISE 15,000 (early bird 12,000) · single coaching session 7,500 (opening: 6,000, 14 November–31 December 2026) · 4-session package 26,000. Teach With Heart and corporate programmes are proposal-based.",wa:true};
  /* recommender */
  if(has("غصہ","anger","بچہ","بچے","child","kid")) return {ur:"بچے کے غصے کے لیے دو قدم ہیں: پہلے چھ سوالات کا «غصے کے لمحے کا فوری آئینہ»، پھر مکمل «والدین آئینہ»۔ دونوں نیچے کے بٹنوں سے شروع کریں۔",en:"For a child's anger there are two steps: first the six-question Anger-Moment Mirror, then the full Parenting Mirror. Start either from the buttons below.",tests:["childanger","parenting"]};
  if(has("نیند","دباؤ","stress","sleep","anxiety","ٹینشن","پریشانی","ذہنی دباؤ")) return {ur:"دباؤ اور نیند کے لیے «دباؤ و تناؤ جائزہ» سے شروع کریں؛ چاہیں تو اس کے بعد PSS-10 بھی کر لیں — دونوں مل کر تصویر صاف کر دیں گے۔",en:"For stress and sleep, start with the Stress & Pressure Check; you can follow it with the PSS-10 — together they make the picture clear.",tests:["stress","pss"]};
  if(has("قیادت","leadership","leader","ٹیم لیڈ","manager","مینیجر")) return {ur:"قیادت کے لیے AIDE کا دستخطی آلہ «اسوہ قیادت آئینہ» ہے — PLDP کے چار ستونوں پر 20 سوالات۔ یہی آلہ پروگرام کے اندر بھی استعمال ہوتا ہے۔",en:"For leadership, AIDE's signature instrument is the USWA Leadership Mirror — 20 questions on PLDP's four pillars; the same tool used inside the programme.",tests:["leadership"]};
  if(has("عادت","habit","routine","روٹین")) return {ur:"عادت کے لیے «عادت معماری نقشہ» کریں — یہ آپ کی سب سے کمزور دیوار کا نام لے کر بتائے گا کہ نظام کہاں سے ٹوٹتا ہے۔",en:"For habits, take the Habit Architecture Map — it will name your weakest wall and show where the system breaks.",tests:["habits"]};
  if(has("شادی","رشتہ","میاں","بیوی","spouse","marriage","relationship","گھر کا سکون","ازدواجی")) return {ur:"رشتے اور گھر کے سکون کے لیے «سکونِ گھر اشاریہ» موزوں ہے — پانچ جہتوں میں گھر کی اصل صحت۔ Load بانٹنے اور مرمت کی رفتار سمیت۔",en:"For relationships and home peace, the Home Harmony Index fits — the home's real health across five dimensions, including shared load and speed of repair.",tests:["relationships"]};
  if(has("کیریئر","career","نوجوان","youth","سمت","direction","طالب علم","student","مستقبل")) return {ur:"نوجوانوں اور سمت کے لیے پہلے «سمت اشاریہ» (RISE) کریں؛ کیریئر دلچسپیوں کے لیے اس کے ساتھ Holland دلچسپی نقشہ (RIASEC) بھی معاون ہوگا۔",en:"For young people and direction, start with the RISE Direction Index; for career interests, the Holland Interest Map (RIASEC) alongside it will help.",tests:["sama","riasec"]};
  if(has("سیلز","sales","بیچ","selling","گاہک","customer","فروخت")) return {ur:"سیلز کے لیے «بیع رویہ آئینہ» ہے — دباؤ نہیں، اعتماد: سننا، تشخیص، فالو اپ، انکار سے سنبھلنا اور سچائی۔",en:"For sales, there is the Sales Conduct Mirror — trust, not pressure: listening, diagnosis, follow-up, recovering from rejection, and truthfulness.",tests:["sales"]};
  if(has("استاد","teacher","teaching","کلاس","تدریس")) return {ur:"اساتذہ کے لیے «دلِ استاد اشاریہ» ہے — Teach With Heart کی بنیاد پر پانچ جہتیں، بشمول استاد کی اپنی توانائی۔",en:"For teachers, there is the Teach With Heart Index — five dimensions on the Teach With Heart foundation, including the teacher's own energy.",tests:["teacher"]};
  if(has("کون سا ٹیسٹ","which test","ٹیسٹ تجویز","recommend","سمجھ نہیں آ رہا")) return {ur:"اپنی کیفیت دو چار لفظوں میں لکھیں — مثلاً «بچے کا غصہ»، «نیند اور دباؤ»، «قیادت»، «عادت»، «شادی»، «کیریئر»، «سیلز» یا «استاد» — میں موزوں ٹیسٹ بتا دوں گا۔",en:"Write your situation in a few words — e.g. 'child anger', 'sleep and stress', 'leadership', 'habit', 'marriage', 'career', 'sales' or 'teacher' — and I will point you to the right test."};
  if(has("السلام","hello","salam","hi ","ہیلو","آداب")) return {ur:"وعلیکم السلام! خوش آمدید۔ پروگرام، فیس، ٹیسٹ کے انتخاب، بکنگ یا کتابوں کے بارے میں جو پوچھنا ہو، لکھیں۔",en:"Wa Alaikum Assalam! Welcome. Ask about programmes, fees, choosing a test, booking, or the books."};
  return {ur:"اس سوال کا جواب میرے مقامی علم سے باہر ہے — معذرت۔ بہتر ہوگا کہ ٹیم سے براہِ راست WhatsApp پر پوچھ لیں؛ یا اپنا موضوع دو چار لفظوں میں لکھیں (مثلاً: فیس، بچے کا غصہ، قیادت، بکنگ، کتابیں) تاکہ میں یہیں رہنمائی کر سکوں۔",en:"That question is beyond my local knowledge — apologies. It is best to ask the team directly on WhatsApp; or write your topic in a few words (e.g. fees, child anger, leadership, booking, books) so I can guide you right here.",wa:true};
}
function asstSend(prefill){
  var inp=$("asstInput");
  var q=(prefill!=null?prefill:(inp?inp.value:"")).trim();
  if(!q) return;
  if(inp) inp.value="";
  asstAdd("user",q,q);
  var r=asstReply(q);
  setTimeout(function(){
    var extra="";
    if(r.tests) extra+=_asstTestBtns(r.tests);
    if(r.wa) extra+=_ASST_WA;
    asstAdd("bot",r.ur,r.en,extra);
  }, AC_RM?0:350);
}

/* ============ SHARE CARD (canvas) ============ */
function shareCard(){
  var lr=window._lastResult; if(!lr) return;
  var test=lr.test,res=lr.res,cv=$("shareCanvas"),ctx=cv.getContext("2d");
  var g=ctx.createLinearGradient(0,0,1200,630); g.addColorStop(0,"#0A1A3B"); g.addColorStop(1,"#06101F");
  ctx.fillStyle=g; ctx.fillRect(0,0,1200,630);
  ctx.strokeStyle="#3DAB94"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(1085,90,58,0.4,4.4); ctx.stroke();
  ctx.fillStyle="#3DAB94"; ctx.fillRect(0,0,14,630);
  ctx.textAlign="right";
  ctx.fillStyle="#4FBFA7"; ctx.font="700 44px 'Plus Jakarta Sans',sans-serif"; ctx.fillText("AIDE",1160,110);
  ctx.fillStyle="#A9BAC4"; ctx.font="26px 'Plus Jakarta Sans',sans-serif"; ctx.fillText("Imran Aslam | Life Coach & Trainer",1160,152);
  ctx.fillStyle="#FFFFFF"; ctx.font="700 54px 'Noto Nastaliq Urdu',serif"; ctx.fillText(lang==="ur"?test.ur:test.en,1160,270);
  ctx.fillStyle="#9FE8D6"; ctx.font="700 60px 'Noto Nastaliq Urdu',serif"; ctx.fillText(lang==="ur"?res.bandUr:res.bandEn,1160,390);
  if(res.topUr){ ctx.fillStyle="#EDF3F1"; ctx.font="34px 'Noto Nastaliq Urdu',serif"; ctx.fillText(t("topTrait")+": "+(lang==="ur"?res.topUr:res.topEn),1160,470); }
  if(res.code){ ctx.fillStyle="#EDF3F1"; ctx.font="700 40px 'Plus Jakarta Sans',sans-serif"; ctx.fillText(res.code,1160,470); }
  ctx.fillStyle="#A9BAC4"; ctx.font="24px 'Plus Jakarta Sans',sans-serif"; ctx.fillText("From Awareness to Excellence",1160,560);
  var a=document.createElement("a"); a.download="aide-result-"+test.id+".png"; a.href=cv.toDataURL("image/png"); a.click();
}

/* ============ DASHBOARD ============ */
function sparkSVG(hist){
  if(!hist||hist.length<2) return "";
  var w=150,h=44,mx=100,step=w/(Math.max(hist.length-1,1));
  var pts=hist.map(function(r,i){ return (i*step).toFixed(1)+","+(h-4-(r.pct/100)*(h-10)).toFixed(1); }).join(" ");
  return '<svg class="spark" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><polyline pathLength="1" points="'+pts+'" fill="none" stroke="#4FBFA7" stroke-width="2.5"/><circle cx="'+((hist.length-1)*step).toFixed(1)+'" cy="'+(h-4-(hist[hist.length-1].pct/100)*(h-10)).toFixed(1)+'" r="4" fill="#4FBFA7"/></svg>';
}
function toggleExp(id,btn){
  var ex=$("exp-"+id); if(!ex) return;
  var open=ex.classList.toggle("open");
  if(btn) btn.textContent=(lang==="ur"?(open?"تاریخ چھپائیں ▴":"مکمل تاریخ ▾"):(open?"Hide history ▴":"Full history ▾"));
}
function dashStats(){
  var ids=Object.keys(store.results).filter(function(id){ return store.results[id]&&store.results[id].length; });
  var inprog=Object.keys(store.progress).filter(function(id){ return BY_ID[id]; }).length;
  var avg=0;
  if(ids.length){ avg=Math.round(ids.reduce(function(s,id){ var hh=store.results[id]; return s+hh[hh.length-1].pct; },0)/ids.length); }
  return {ids:ids,done:ids.length,inprog:inprog,avg:avg};
}
function animateDash(){
  var st=dashStats();
  if(!_dashCounted){
    countUp($("statDone"),st.done,600);
    countUp($("statProg"),st.inprog,600);
    countUp($("statAvg"),st.avg,700);
    _dashCounted=true;
  }
  var rings=$("dashGrid").querySelectorAll(".ringfg");
  requestAnimationFrame(function(){ requestAnimationFrame(function(){
    rings.forEach(function(r){ r.style.strokeDashoffset=r.getAttribute("data-off"); });
  }); });
}
function renderDash(){
  var rb="";
  Object.keys(store.progress).forEach(function(id){
    var test=BY_ID[id]; if(!test) return;
    var n=test.type==="bank"?test.bank.qs.length:test.items.length;
    rb+='<div class="nextstep" style="margin-bottom:14px"><h4>'+esc(lang==="ur"?test.ur:test.en)+' — '+((store.progress[id].idx||0)+1)+'/'+n+'</h4><div class="btnrow"><button class="btn" onclick="openIntro(\''+id+'\')">'+t("resume")+'</button></div></div>';
  });
  $("resumeBox").innerHTML=rb;
  var st=dashStats(), ids=st.ids;
  var h='<div class="statsrow">'
    +'<div class="statbox"><b id="statDone">'+st.done+'</b><span>'+(lang==="ur"?"مکمل شدہ ٹیسٹ":"Tests completed")+'</span></div>'
    +'<div class="statbox"><b id="statProg">'+st.inprog+'</b><span>'+(lang==="ur"?"جاری ٹیسٹ":"In progress")+'</span></div>'
    +'<div class="statbox"><b id="statAvg">'+st.avg+'</b><span>'+(lang==="ur"?"اوسط بینڈ درجہ (%)":"Average band position (%)")+'</span></div></div>';
  h+='<div class="ringsrow">';
  CATS.forEach(function(c){
    var tot=PLAYABLE.filter(function(x){ return x.cat===c.id; }).length;
    var dn=PLAYABLE.filter(function(x){ return x.cat===c.id && store.results[x.id] && store.results[x.id].length; }).length;
    var pc=tot?Math.round(dn/tot*100):0, C=2*Math.PI*26;
    h+='<div class="ringbox"><svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="7"/><circle class="ringfg" cx="32" cy="32" r="26" fill="none" stroke="#4FBFA7" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+C.toFixed(1)+'" data-off="'+(C*(1-pc/100)).toFixed(1)+'" transform="rotate(-90 32 32)"/></svg>'
      +'<div class="rl">'+esc(lang==="ur"?c.ur:c.en)+'<br><b>'+dn+' / '+tot+'</b> · '+pc+'%</div></div>';
  });
  h+='</div>';
  if(!ids.length){
    h+='<div class="empty" style="grid-column:1/-1">'+t("empty")+'<div style="margin-top:14px"><button class="btn pulse" onclick="showView(\'hub\')">'+t("start")+'</button></div></div>';
    $("dashGrid").innerHTML=h;
    animateDash();
    return;
  }
  ids.forEach(function(id){
    var test=BY_ID[id]; if(!test) return;
    var hist=store.results[id], last=hist[hist.length-1];
    var d=new Date(last.date);
    var rows=hist.slice().reverse().map(function(r){
      var dd=new Date(r.date);
      return '<div class="histrow"><span>'+dd.toLocaleDateString(lang==="ur"?"ur-PK":"en-GB")+'</span><b>'+esc(lang==="ur"?r.bandUr:r.bandEn)+'</b><span>'+r.score+' '+t("scoreOf")+' '+r.max+'</span></div>';
    }).join("");
    h+='<div class="dashcard">'+badgeHtml(test.badge)+'<h3>'+esc(lang==="ur"?test.ur:test.en)+'</h3>'
      +'<div class="bandname" style="text-align:start;font-size:21px">'+esc(lang==="ur"?last.bandUr:last.bandEn)+'</div>'
      +'<div class="hist"><div>'+sparkSVG(hist)+'</div><div class="histitem">'+last.score+' '+t("scoreOf")+' '+last.max+'<br>'+d.toLocaleDateString(lang==="ur"?"ur-PK":"en-GB")+' · '+hist.length+' '+t("attempts")+'</div></div>'
      +'<div class="exp" id="exp-'+id+'"><div><div class="histfull">'+rows+'</div></div></div>'
      +'<div class="btnrow"><button class="btn" onclick="openIntro(\''+id+'\')">'+t("retake")+'</button>'
      +'<button class="btn ghost" onclick="toggleExp(\''+id+'\',this)">'+(lang==="ur"?"مکمل تاریخ ▾":"Full history ▾")+'</button>'
      +'<button class="btn ghost" onclick="delResult(\''+id+'\')">'+t("del")+'</button></div></div>';
  });
  $("dashGrid").innerHTML=h;
  animateDash();
}
function delResult(id){ delete store.results[id]; save(); renderDash(); }
function clearAll(){ store={results:{},progress:{}}; _dashCounted=false; save(); renderDash(); renderHub(); }

/* ============ LANGUAGE ============ */
function applyLang(){
  document.documentElement.lang = lang==="ur"?"ur":"en";
  $("tabHub").textContent=t("hub"); $("tabDash").textContent=t("dash");
  $("langBtn").textContent = lang==="ur"?"EN":"اردو";
  $("brandName").textContent=t("brand"); $("brandSub").textContent=t("brandSub");
  $("heroH").innerHTML=t("heroH"); $("heroP").textContent=t("heroP");
  $("privacyLine").textContent=t("priv");
  $("dashH").textContent=t("dashH"); $("dashP").textContent=t("dashP"); $("dashPriv").textContent=t("priv").replace("🔒 ","");
  $("clearAllBtn").textContent=t("clearAll"); $("footNote").textContent=t("foot");
}
function toggleLang(){
  function flip(){
    lang = lang==="ur"?"en":"ur";
    applyLang(); renderHub();
    if(!$("view-dash").classList.contains("hidden")) renderDash();
  }
  if(AC_RM){ flip(); return; }
  document.body.classList.add("fadeout");
  setTimeout(function(){ flip(); document.body.classList.remove("fadeout"); },170);
}

/* init */
applyLang(); renderHub();
