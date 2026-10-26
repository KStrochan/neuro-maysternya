import { checkout } from './pay.js';
import { startPromo, price } from './promo.js';

// Launch price first: it rewrites prices in the markup before the Ukrainian texts are captured below.
startPromo();

const $ = (s) => document.querySelector(s);
const PRICES = { uk: { full: price(), fmt: (n) => n + ' грн' }, en: { full: 6.99, fmt: (n) => '$' + n.toFixed(2) } };
const EN = {
  navInside: 'What’s inside', navPrice: 'Price', navFaq: 'FAQ', nav: 'Get it',
  e1: 'Claude for small business', h1: '250 prompts that put Claude to work for your business', lead1: 'Copy, replace the', brackets: '[brackets]',
  lead2: 'with your details, and Claude writes posts, replies to customers, website copy and does your pricing maths.', cta: 'Get it for $6.99', cta2: 'What’s inside',
  ctaNote: 'PDF after payment · works on free Claude', e2: 'Step 1', h2a: 'Copy a ready-made prompt', p2: 'Every prompt already has a role, a task and an output format. You only replace what is in brackets.',
  e3: 'Step 2', h2b: 'Fill the brackets with your business', p3: '“A coffee shop next to a university”, “students” — and the prompt is yours. No setup.',
  e4: 'Step 3', h2c: 'Get a finished result', p4: 'A month of content as a table, a reply to a customer, website copy — in a minute instead of an evening.',
  pcHead: 'Prompt · content plan', pc1: 'You are an SMM manager. Write a one-month content plan for', pcS1: '[a coffee shop next to a university]', pc2: 'Audience:', pcS2: '[students]',
  pc3: 'Format: a table with date, topic, format and copy.', pcAns: 'Claude', pcAnsT: 'Done: 30 posts, 8 Reels and 4 carousels as a table you can paste into Google Sheets.',
  flowK: 'How it works', flowH: 'Three steps to a finished result',
  k0: 'What’s inside', catsH: '250 prompts across 12 areas',
  k1: 'Instagram & content', k1p: 'Content plans, carousels, Reels, stories.',
  k2: 'Ads & lead generation', k2p: 'Meta and Google ad copy, audiences, budget tests.',
  k3: 'Sales & messaging', k3p: '“Too expensive”, “I’ll think about it”, upsells, scripts.',
  k4: 'Reviews & loyalty', k4p: 'Collecting reviews, rewards, referral programme.',
  k5: 'Website copy', k5p: 'Hero section, FAQ, product cards, SEO.',
  k6: 'Operations & spreadsheets', k6p: 'Procedures, checklists, Google Sheets formulas.',
  k7: 'Money & pricing', k7p: 'Break-even, raising prices, budgeting.',
  k8: 'Team & hiring', k8p: 'Job posts, interviews, motivation, onboarding.',
  k9: 'Personal productivity', k9p: 'Decisions, weekly planning, negotiations.',
  k10: 'For cafés & restaurants', k10p: 'Menus, recipe cards, lunch deals, guests.',
  k11: 'For salons & beauty pros', k11p: 'Bookings, reminders, aftercare notes.',
  k12: 'For online stores', k12p: 'Product listings, abandoned carts, returns, shipping.',
  ladK: 'Price', ladH: 'Everything in one pack', t3h: 'Full pack', t3a: '250 prompts in 12 categories', t3b: '3 Claude Projects: café, salon, online store',
  t3c: '“Website in one evening” guide: brief, prompts and free publishing', t3d: '5 rules that make Claude answer like a pro', t3n: 'One payment · PDF, 29 pages', cta3: 'Get the pack',
  coK: 'Checkout', coH: 'Get the full pack', coLead: 'Leave your email and we will send you the payment details and the PDF.',
  lFull: 'Full pack: 250 prompts, 3 projects, guide', fName: 'Name', fContact: 'Email', submit: 'Get it',
  agree: 'By clicking the button you agree to the', privacyLink: 'privacy policy', faqK: 'Questions', faqH: 'FAQ',
  q1: 'Do I need a paid Claude plan?', a1: 'No. Every prompt works on the free plan. A paid plan gives you more messages per day.', q2: 'I have never used AI tools. Will I manage?', a2: 'Yes. The first page explains how to write prompts, and each prompt only needs copying and filling in the brackets.',
  q3: 'What are Claude Projects?', a3: 'Ready-made instructions for a café, a salon and an online store. Claude learns about your business once and remembers it in every chat of the project.',
  q4: 'Do the prompts work in ChatGPT or Gemini?', a4: 'Mostly yes, they are written in plain language. But we wrote them for Claude.',
  chip1: "PDF by email right after payment",
  chip2: "Works on free Claude",
  chip3: "Less than 2 UAH per prompt",
  fitK: "Is it for you",
  fitH: "This pack is for you if you…",
  fitYes: "Yes, it fits",
  fitNo: "Probably not, if you",
  y1: "Run a small business or work for yourself",
  y2: "Have heard of Claude but don’t know what to type",
  y3: "Spend evenings on posts, replies and copy",
  y4: "Want a simple website without a developer",
  y5: "Don’t want to pay an SMM manager for every content plan",
  y6: "Prefer ready templates to theory",
  n1: "Are looking for a “million overnight” without doing the work",
  n2: "Already write complex prompts and build AI agents",
  rcK: "Let’s add it up",
  rcH: "Everything you get for one payment",
  r1: "250 prompts in 12 categories",
  r1p: "content, ads, sales, website, money, team",
  r2: "3 Claude Projects",
  r2p: "café, salon, online store",
  r3: "“Website in one evening” guide",
  r3p: "brief, prompts and free publishing",
  r4: "5 rules of a good prompt",
  r4p: "after them Claude answers like a pro",
  r5: "Numbered contents",
  r5p: "find the right prompt in 10 seconds",
  rcTot: "Total",
  rcCta: "Get the pack",
  finH: "Your business won’t start saving time until you press the button",
  finP: "Your first content plan — 5 minutes after payment.",
  finCta: "Get 250 prompts",
  gTag: "Gift",
  gH: "Wait! Grab 20 prompts for free",
  gP: "The most useful prompts for marketing, sales and pricing — the PDF arrives in a minute.",
  gBtn: "Get the gift",
  gNo: "No, thanks",
  thH: 'Thank you! Your order is in', thLead: 'We will email you about payment shortly. Check your spam folder if you do not see it.',
  foot: '© 2026 Neuro Maysternya · independent guide, not affiliated with Anthropic. Claude is a trademark of Anthropic.', privacyFoot: 'Privacy policy',
};
const MSG = {
  uk: { need: 'Вкажіть правильний email.', sending: 'Надсилаємо…', fail: 'Не вдалося надіслати заявку. Спробуйте ще раз за хвилину.', product: 'Повний пакет', cta: 'Отримати за ' },
  en: { need: 'Please enter a valid email.', sending: 'Sending…', fail: 'Could not send your order. Please try again in a minute.', product: 'Full pack', cta: 'Get it for ' },
};
const UK = {};
document.querySelectorAll('[data-i]').forEach((el) => { UK[el.dataset.i] = UK[el.dataset.i] || el.textContent; });

let lang = 'uk';
try { if (location.hash === '#en' || localStorage.getItem('nm-lang') === 'en') lang = 'en'; } catch (e) { if (location.hash === '#en') lang = 'en'; }
const DEMO = location.hash === '#demo';
const money = (n) => PRICES[lang].fmt(Math.round(n * 100) / 100);

function renderPrices() {
  const P = PRICES[lang];
  document.querySelectorAll('[data-price]').forEach((el) => { el.textContent = money(P[el.dataset.price]); });
  const cta = document.querySelector('[data-i="cta"]');
  if (cta) cta.textContent = MSG[lang].cta + money(P.full);
}
function applyLang() {
  document.documentElement.lang = lang;
  const dict = lang === 'en' ? EN : UK;
  document.querySelectorAll('[data-i]').forEach((el) => { const v = dict[el.dataset.i]; if (v) el.textContent = v; });
  $('#l-uk').setAttribute('aria-pressed', lang === 'uk'); $('#l-en').setAttribute('aria-pressed', lang === 'en');
  renderPrices();
}
function switchLang(l) {
  if (l === lang) return;
  lang = l;
  try { localStorage.setItem('nm-lang', l); } catch (e) {}
  if (l === 'en') history.replaceState(null, '', '#en'); else history.replaceState(null, '', location.pathname + location.search);
  applyLang();
}
$('#l-uk').addEventListener('click', () => switchLang('uk'));
$('#l-en').addEventListener('click', () => switchLang('en'));
applyLang();

const hero = document.getElementById('hero');
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('solid', !$('#landing').hidden && hero.getBoundingClientRect().bottom < 80 || $('#landing').hidden);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- funnel ----------
async function send(payload) {
  if (DEMO) return;
  const r = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('send');
}
$('#orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const st = $('#status'), name = '', contact = $('#contact').value.trim(), P = PRICES[lang];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) { st.className = 'status err'; st.textContent = MSG[lang].need; return; }
  st.className = 'status'; st.textContent = MSG[lang].sending; $('#submit').disabled = true;
  try {
    const site = `Нейро Майстерня (${lang.toUpperCase()})`, product = MSG[lang].product + ' — ' + money(P.full);
    const showThanks = () => { $('#landing').hidden = true; $('#thanks').hidden = false; $('#demoNote').hidden = !DEMO; scrollTo(0, 0); onScroll(); };
    // Ukrainian buyers pay by EasyPay card transfer; the English version stays a pre-order.
    if (lang === 'uk' && !DEMO) {
      const lead = (t) => { $('[data-i="thLead"]').textContent = t; };
      const mode = await checkout($('#orderForm'), { site, product, price: money(P.full), amount: P.full, name, contact,
        onDone: (delivered) => { if (!delivered) lead('Перевіряємо оплату — PDF прийде на вашу пошту протягом дня.'); setTimeout(showThanks, 1600); } });
      if (mode === 'lead') { lead('Ми надіслали підтвердження на вашу пошту і напишемо щодо оплати.'); showThanks(); }
    } else {
      await send({ site, name, contact, product, lang, stage: 'lead' });
      showThanks();
    }
  } catch {
    st.className = 'status err'; st.textContent = MSG[lang].fail;
  } finally { const b = $('#submit'); if (b) b.disabled = false; }
});
