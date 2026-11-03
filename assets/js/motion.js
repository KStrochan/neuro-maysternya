// Motion layer: the live prompt (type your business into the brackets), the giant brackets that open on scroll,
// the moving line of slot words, word-by-word headings and the phone buy bar.
// Only opacity/transform are animated. Without this file, or with prefers-reduced-motion,
// the page shows a finished example prompt and all three steps as plain content.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => 1 - Math.pow(1 - t, 3);
const en = () => root.lang === 'en';

function splitWords(el, base = 0, step = 70) {
  const frag = document.createDocumentFragment();
  el.textContent.split(/([ \t\r\n]+)/).forEach((part) => {
    if (!part) return;
    if (/^[ \t\r\n]+$/.test(part)) { frag.append(part); return; }
    const w = document.createElement('span'); w.className = 'w';
    const i = document.createElement('span'); i.className = 'wi'; i.textContent = part;
    w.append(i); frag.append(w);
  });
  el.textContent = ''; el.append(frag);
  el.querySelectorAll('.wi').forEach((w, k) => w.style.setProperty('--d', `${base + k * step}ms`));
}

// ---------- the live prompt ----------
// Sample replies only show the shape of an answer; the card says so («Приклад відповіді»).
const PRESETS = {
  uk: [
    { short: "кав'ярня", biz: "кав'ярня біля університету", who: 'студенти', plan: [['Пн', 'Reels', 'Як ми готуємо першу каву о 7:30'], ['Ср', 'Карусель', '5 способів не заснути на парі'], ['Пт', 'Пост', 'Знижка на каву зі студентським']] },
    { short: 'салон', biz: 'салон краси в центрі міста', who: 'жінки 25–45', plan: [['Пн', 'Reels', 'Фарбування за 60 секунд: до і після'], ['Ср', 'Карусель', '5 помилок у догляді за волоссям'], ['Пт', 'Сторіз', 'Опитування: який колір наступний?']] },
    { short: 'магазин', biz: 'інтернет-магазин кераміки', who: 'ті, хто шукає подарунок', plan: [['Пн', 'Reels', 'Як ми пакуємо замовлення'], ['Ср', 'Карусель', '7 подарунків до 500 грн'], ['Пт', 'Пост', 'Історія майстра за цією чашкою']] },
  ],
  en: [
    { short: 'coffee shop', biz: 'a coffee shop next to a university', who: 'students', plan: [['Mon', 'Reels', 'How we pull the first shot at 7:30'], ['Wed', 'Carousel', '5 ways to stay awake in class'], ['Fri', 'Post', 'Student card discount on coffee']] },
    { short: 'salon', biz: 'a beauty salon in the city centre', who: 'women aged 25–45', plan: [['Mon', 'Reels', 'Colouring in 60 seconds: before and after'], ['Wed', 'Carousel', '5 hair care mistakes'], ['Fri', 'Stories', 'Poll: which colour is next?']] },
    { short: 'store', biz: 'an online ceramics store', who: 'people looking for a gift', plan: [['Mon', 'Reels', 'How we pack an order'], ['Wed', 'Carousel', '7 gifts under $15'], ['Fri', 'Post', 'The maker behind this mug']] },
  ],
};
const customPlan = (b) => (en()
  ? [['Mon', 'Reels', `A day in the life: ${b}`], ['Wed', 'Carousel', '5 questions customers ask most'], ['Fri', 'Post', `Why people choose ${b}`]]
  : [['Пн', 'Reels', `Один день із життя: ${b}`], ['Ср', 'Карусель', '5 питань, які клієнти ставлять найчастіше'], ['Пт', 'Пост', `Чому клієнти обирають нас: ${b}`]]);

let currentShort = () => PRESETS.uk[0].short;

function livePrompt() {
  const card = document.querySelector('.prompt-card');
  if (!card) return;
  const input = card.querySelector('#biz'), who = card.querySelector('.slot-2'), answer = card.querySelector('.answer'), plan = card.querySelector('.plan');
  const buttons = [...card.querySelectorAll('.preset')];
  let run = 0, auto = !reduced, index = 0, debounce = 0;
  const list = () => PRESETS[en() ? 'en' : 'uk'];
  let short = list()[0].short;
  currentShort = () => short;

  const renderPlan = (rows) => {
    plan.textContent = '';
    rows.forEach((r, i) => {
      const li = document.createElement('li'); li.style.setProperty('--i', i);
      const d = document.createElement('span'); d.textContent = r[0];
      const f = document.createElement('b'); f.textContent = r[1];
      const t = document.createElement('span'); t.textContent = r[2];
      li.append(d, f, t); plan.append(li);
    });
  };
  const think = async (id, rows) => {
    if (!reduced) {
      answer.classList.remove('show'); answer.classList.add('wait');
      await sleep(850);
      if (id !== run) return;
    }
    renderPlan(rows);
    answer.classList.remove('wait');
    if (!reduced) { void answer.offsetWidth; answer.classList.add('show'); }
  };
  async function choose(i, { typed = true } = {}) {
    const id = ++run, p = list()[i];
    index = i; short = p.short;
    buttons.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
    who.textContent = `[${p.who}]`;
    if (typed && !reduced) {
      input.value = '';
      for (const ch of p.biz) {
        if (id !== run) return;
        input.value += ch;
        await sleep(32);
      }
    } else input.value = p.biz;
    await think(id, p.plan);
  }
  const stopAuto = () => { auto = false; answer.setAttribute('aria-live', 'polite'); };
  buttons.forEach((b, i) => b.addEventListener('click', () => { stopAuto(); choose(i); }));
  input.addEventListener('focus', () => { stopAuto(); run++; answer.classList.remove('wait'); });
  input.addEventListener('input', () => {
    stopAuto();
    const id = ++run, v = input.value.trim().slice(0, 60);
    buttons.forEach((b) => b.setAttribute('aria-pressed', false));
    who.textContent = en() ? '[your customers]' : '[ваші клієнти]';
    short = v || list()[index].short;
    clearTimeout(debounce);
    if (v) debounce = setTimeout(() => think(id, customPlan(v)), 450);
  });
  card.addEventListener('submit', (e) => e.preventDefault());

  // Language switch: main.js rewrites the texts, then the example follows.
  new MutationObserver(() => { stopAuto(); choose(0, { typed: false }); }).observe(root, { attributes: true, attributeFilter: ['lang'] });

  choose(0, { typed: false });
  if (auto) {
    const heroInView = { v: true };
    new IntersectionObserver(([e]) => { heroInView.v = e.isIntersecting; }).observe(card);
    (async () => {
      await sleep(7000);
      while (auto) {
        if (heroInView.v) await choose((index + 1) % buttons.length);
        await sleep(6500);
      }
    })();
  }
}

// ---------- scene: the brackets open ----------
function bracketScene() {
  const scene = document.getElementById('how-it-works');
  if (!scene) return null;
  root.classList.add('js-scene');
  const left = scene.querySelector('.bl'), right = scene.querySelector('.br'), word = scene.querySelector('.bword'), row = scene.querySelector('.brow');
  const steps = [...scene.querySelectorAll('.bsteps li')];
  const N = 3;
  let current = -1, blue = false, shownWord = '';
  const words = () => (en() ? ['your details', currentShort(), 'done'] : ['ваші дані', currentShort(), 'готово']);
  return function render() {
    const r = scene.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));
    const width = row.clientWidth, glyph = left.getBoundingClientRect().width;
    const maxShift = Math.max(40, width / 2 - glyph / 2);
    const open = ease(clamp(p / .42));
    const shift = 30 + (maxShift - 30) * open;
    left.style.transform = `translateX(${-shift}px)`;
    right.style.transform = `translateX(${shift}px)`;
    const s = Math.min(N - 1, Math.floor(p * N));
    word.style.opacity = clamp((open - .15) * 3);
    word.style.transform = `scale(${.7 + .3 * open})`;
    const w = words()[s];
    if (w !== shownWord) { shownWord = w; word.textContent = w; }
    if (s !== current) { current = s; steps.forEach((el, i) => el.classList.toggle('on', i === s)); }
    const b = p > .7;
    if (b !== blue) { blue = b; root.classList.toggle('bluefield', b); }
  };
}

// ---------- the moving line ----------
function ticker() {
  const box = document.querySelector('.ticker');
  if (!box) return null;
  const lines = [...box.querySelectorAll('p')];
  return () => {
    const r = box.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = (innerHeight - r.top) / (innerHeight + r.height);
    lines[0].style.transform = `translateX(${-p * 30}%)`;
    lines[1].style.transform = `translateX(${-34 + p * 30}%)`;
  };
}

// ---------- reveals ----------
const REVEAL = '.lead,.cat,.fit>div,.recap-list li,.price-now,#orderForm,.faq details,.final p,.final .btn';
function reveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  document.querySelectorAll(REVEAL).forEach((el) => {
    const sibs = [...el.parentElement.children];
    el.style.setProperty('--rd', `${(sibs.indexOf(el) % 2) * 90}ms`);
    el.classList.add('rv'); io.observe(el);
  });
  document.querySelectorAll('.title,.final h2').forEach((el) => {
    if (root.lang === 'en') return; // the English texts arrive through main.js and stay plain
    splitWords(el, 0, 55); el.classList.add('split'); io.observe(el);
  });
  const share = document.querySelector('.share');
  if (share) { io.observe(share); }
  document.querySelectorAll('.cat .n').forEach((b) => {
    const to = +b.textContent;
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return; o.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const k = clamp((t - t0) / 900);
        b.textContent = Math.round(to * ease(k));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: .6 }).observe(b);
  });
}

// ---------- sticky buy bar on phones ----------
function buyBar() {
  const hero = document.getElementById('hero'), order = document.getElementById('checkout');
  if (!hero || !order) return;
  const bar = document.createElement('div');
  bar.className = 'm-buy'; bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<div><b></b><small></small></div><a class="btn" href="#checkout" tabindex="-1"></a>';
  const sync = () => {
    bar.querySelector('b').textContent = document.querySelector('[data-price]').textContent;
    bar.querySelector('small').textContent = en() ? '250 prompts, 3 projects' : '250 промптів, 3 проєкти';
    bar.querySelector('.btn').textContent = en() ? 'Buy now' : 'Купити';
  };
  sync();
  new MutationObserver(() => setTimeout(sync)).observe(root, { attributes: true, attributeFilter: ['lang'] });
  document.body.append(bar);
  let heroGone = false, orderSeen = false;
  const update = () => bar.classList.toggle('show', heroGone && !orderSeen && !document.getElementById('landing')?.hidden);
  new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting; update(); }).observe(hero);
  new IntersectionObserver(([e]) => { orderSeen = e.isIntersecting; update(); }, { threshold: .05 }).observe(order);
}

// ---------- boot ----------
livePrompt();
buyBar();
if (!reduced) {
  root.classList.add('motion');
  const h1 = document.querySelector('.hero h1');
  if (h1) splitWords(h1, 150, 75);
  root.classList.add('intro');
  reveals();
  const renders = [bracketScene(), ticker()].filter(Boolean);
  let queued = false;
  const frame = () => { queued = false; renders.forEach((r) => r()); };
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);
  frame();
}
