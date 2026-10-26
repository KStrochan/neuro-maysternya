const $ = (s) => document.querySelector(s);
const PRICES = { uk: { start: 79, site: 99, full: 299, fmt: (n) => n + ' грн' }, en: { start: 1.99, site: 2.49, full: 6.99, fmt: (n) => '$' + n.toFixed(2) } };
const EN = {
  navInside: 'What’s inside', navPrice: 'Pricing', navFaq: 'FAQ', nav: 'Get it',
  e1: 'Claude for small business', h1: '20 prompts that put Claude to work for your business', lead1: 'Copy, replace the', brackets: '[brackets]',
  lead2: 'with your details, and Claude writes posts, replies to customers, website copy and does your pricing maths.', cta: 'Get it for $1.99', cta2: 'What’s inside',
  ctaNote: 'PDF right after payment · works on free Claude', e2: 'Step 1', h2a: 'Copy a ready-made prompt', p2: 'Every prompt already has a role, a task and an output format. You only replace what is in brackets.',
  e3: 'Step 2', h2b: 'Fill the brackets with your business', p3: '“A coffee shop next to a university”, “students” — and the prompt is yours. No setup.',
  e4: 'Step 3', h2c: 'Get a finished result', p4: 'A month of content as a table, a reply to a customer, website copy — in a minute instead of an evening.',
  e5: '“Start”', h2d: '20 prompts across 6 areas', p5: 'Marketing, sales, website copy, spreadsheets, pricing and team. Plus 5 rules that make Claude answer like a pro.', cta3: 'Get it for $1.99',
  pcHead: 'Prompt · content plan', pc1: 'You are an SMM manager. Write a one-month content plan for', pcS1: '[a coffee shop next to a university]', pc2: 'Audience:', pcS2: '[students]',
  pc3: 'Format: a table with date, topic, format and copy.', pcAns: 'Claude', pcAnsT: 'Done: 30 posts, 8 Reels and 4 carousels as a table you can paste into Google Sheets.',
  flowK: 'How it works', flowH: 'Three steps to a finished result',
  k0: 'What’s inside', catsH: '20 “Start” prompts across 6 areas', k1: 'Instagram & marketing', k1p: 'Content plans, carousels, Reels hooks.', k2: 'Sales & customers', k2p: 'Answering “too expensive”, reviews, FAQ.',
  k3: 'Website copy', k3p: 'Hero section, “Why us”, rewriting copy.', k4: 'Operations & spreadsheets', k4p: 'Shift checklists, Google Sheets formulas.', k5: 'Money & pricing', k5p: 'Break-even point, cost of goods.', k6: 'Team & productivity', k6p: 'Job posts, onboarding, planning your week.',
  ladK: 'Pricing', ladH: 'Start small. Add more when you need it', t1s: 'Step 1', t1h: 'Start', t1p: '20 prompts and 5 rules of a good prompt. PDF, 5 pages.', t2s: 'Add-on at checkout', t2h: 'A website in one evening',
  t2p: 'Brief, 4 ready prompts, editing commands and free hosting.', t3s: 'Full pack', t3h: 'Everything', t3a: '50 prompts in 6 categories', t3b: '3 Claude Projects: café, salon, online store', t3c: '“Website in one evening” guide',
  coK: 'Checkout', coH: 'Get “Start”', coLead: 'Leave your contact and we will send the payment link and the PDF. Once online payment is live, the file will arrive automatically.',
  lStart: '“Start”: 20 prompts + 5 rules', bumpH: 'Add “A website in one evening”', bumpP: 'Brief, 4 prompts and free publishing. A site for your business in 2–3 hours.', tot: 'Total', fName: 'Name', fContact: 'Email or Telegram', submit: 'Get it',
  agree: 'By clicking the button you agree to the', privacyLink: 'privacy policy', faqK: 'Questions', faqH: 'FAQ',
  q1: 'Do I need a paid Claude plan?', a1: 'No. Every prompt works on the free plan. A paid plan gives you more messages per day.', q2: 'I have never used AI tools. Will I manage?', a2: 'Yes. The first page explains how to write prompts, and each prompt only needs copying and filling in the brackets.',
  q3: 'How is “Start” different from the full pack?', a3: '“Start” is the 20 most useful prompts. The full pack has 50 prompts, 3 ready Claude Projects and the website guide. Start small and upgrade for the price difference.',
  q4: 'Do the prompts work in ChatGPT or Gemini?', a4: 'Mostly yes, they are written in plain language. But we wrote them for Claude.',
  thH: 'Thank you! Your order is in', thLead: 'We will get in touch shortly and send your PDF.', ofTag: 'One offer while you are here', ofC: 'Claude learns about your business once and remembers it in every chat',
  ofYes: 'Yes, add it to my order', ofNo: 'No, thanks', foot: '© 2026 Neuro Maysternya · independent guide, not affiliated with Anthropic. Claude is a trademark of Anthropic.', privacyFoot: 'Privacy policy',
};
const MSG = {
  uk: { need: "Вкажіть ім'я і контакт.", sending: 'Надсилаємо…', fail: 'Не вдалося надіслати заявку. Спробуйте ще раз за хвилину.', added: 'Додали повний пакет до вашої заявки.', noThanks: 'Добре! Чекайте на повідомлення від нас.',
    ofH: (d) => `Перейдіть на повний пакет за ${d}`, ofWhy: (f, p) => `Це різниця між повним пакетом (${f}) і тим, що ви вже взяли (${p}).`, product: 'Старт', bump: 'Сайт за вечір', full: 'Повний пакет (доплата)', cta: 'Отримати за ', total: 'Разом: ' },
  en: { need: 'Please enter your name and contact.', sending: 'Sending…', fail: 'Could not send your order. Please try again in a minute.', added: 'The full pack has been added to your order.', noThanks: 'All good! Watch for our message.',
    ofH: (d) => `Upgrade to the full pack for ${d}`, ofWhy: (f, p) => `That is the difference between the full pack (${f}) and what you already chose (${p}).`, product: 'Start', bump: 'Website in one evening', full: 'Full pack (upgrade)', cta: 'Get it for ', total: 'Total: ' },
};
const UK = {};
document.querySelectorAll('[data-i]').forEach((el) => { UK[el.dataset.i] = UK[el.dataset.i] || el.textContent; });

let lang = 'uk', order = null;
try { if (location.hash === '#en' || localStorage.getItem('nm-lang') === 'en') lang = 'en'; } catch (e) { if (location.hash === '#en') lang = 'en'; }
const DEMO = location.hash === '#demo';
const money = (n) => PRICES[lang].fmt(Math.round(n * 100) / 100);

function renderPrices() {
  const P = PRICES[lang];
  document.querySelectorAll('[data-price]').forEach((el) => { const k = el.dataset.price; el.textContent = (k === 'site' ? '+' : '') + money(P[k]); });
  ['cta'].forEach((k) => { const el = document.querySelector(`[data-i="${k}"]`); if (el) el.textContent = MSG[lang].cta + money(P.start); });
  $('#total').textContent = money(P.start + ($('#bump').checked ? P.site : 0));
  if (order) renderOffer();
}
function renderOffer() {
  const P = PRICES[lang], paid = P.start + (order.bump ? P.site : 0);
  $('#ofH').textContent = MSG[lang].ofH(money(Math.max(P.full - paid, 0)));
  $('#ofWhy').textContent = MSG[lang].ofWhy(money(P.full), money(paid));
}
function applyLang() {
  document.documentElement.lang = lang;
  const dict = lang === 'en' ? EN : UK;
  document.querySelectorAll('[data-i]').forEach((el) => { const v = dict[el.dataset.i]; if (v) el.textContent = v; });
  $('#l-uk').setAttribute('aria-pressed', lang === 'uk'); $('#l-en').setAttribute('aria-pressed', lang === 'en');
  $('#contact').placeholder = lang === 'uk' ? '@username, +380… або email' : 'you@example.com or @username';
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
$('#bump').addEventListener('change', renderPrices);
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
  const st = $('#status'), name = $('#name').value.trim(), contact = $('#contact').value.trim(), bump = $('#bump').checked, P = PRICES[lang];
  if (!name || !contact) { st.className = 'status err'; st.textContent = MSG[lang].need; return; }
  st.className = 'status'; st.textContent = MSG[lang].sending; $('#submit').disabled = true;
  const items = [MSG[lang].product + ' ' + money(P.start)].concat(bump ? [MSG[lang].bump + ' ' + money(P.site)] : []);
  try {
    await send({ site: `Нейро Майстерня (${lang.toUpperCase()})`, name, contact, product: items.join(' + '), comment: MSG[lang].total + money(P.start + (bump ? P.site : 0)) });
    order = { name, contact, bump };
    renderOffer();
    $('#landing').hidden = true; $('#thanks').hidden = false; $('#demoNote').hidden = !DEMO;
    scrollTo(0, 0); onScroll();
  } catch {
    st.className = 'status err'; st.textContent = MSG[lang].fail;
  } finally { $('#submit').disabled = false; }
});
$('#ofYes').addEventListener('click', async () => {
  const st = $('#ofStatus'), P = PRICES[lang], diff = Math.max(P.full - P.start - (order.bump ? P.site : 0), 0);
  st.className = 'status'; st.textContent = MSG[lang].sending;
  try {
    await send({ site: `Нейро Майстерня (${lang.toUpperCase()})`, name: order.name, contact: order.contact, product: MSG[lang].full + ' ' + money(diff) });
    st.className = 'status ok'; st.textContent = MSG[lang].added; $('#ofYes').disabled = true; $('#ofNo').disabled = true;
  } catch { st.className = 'status err'; st.textContent = MSG[lang].fail; }
});
$('#ofNo').addEventListener('click', () => { const st = $('#ofStatus'); st.className = 'status ok'; st.textContent = MSG[lang].noThanks; $('#ofYes').disabled = true; $('#ofNo').disabled = true; });
