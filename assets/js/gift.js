// Free-gift popup: 20 «Старт» prompts for an email. Shows once per browser —
// on exit intent (desktop) or after 30 s on the page — and never over the checkout or in the English version.
const box = document.getElementById('gift');
const seen = () => { try { return localStorage.getItem('nm-gift') === '1'; } catch { return false; } };
const remember = () => { try { localStorage.setItem('nm-gift', '1'); } catch {} };

function open() {
  if (!box || seen() || document.documentElement.lang === 'en') return;
  if (document.getElementById('landing')?.hidden) return;
  const co = document.getElementById('checkout')?.getBoundingClientRect();
  if (co && co.top < innerHeight && co.bottom > 0) return; // buyer is already at the checkout
  if (document.activeElement && document.activeElement.closest('#orderForm')) return;
  remember();
  box.hidden = false;
  requestAnimationFrame(() => box.classList.add('on'));
  setTimeout(() => document.getElementById('giftEmail')?.focus({ preventScroll: true }), 350);
}
function close() { box.classList.remove('on'); setTimeout(() => { box.hidden = true; }, 250); }

if (box) {
  setTimeout(open, 30000);
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget && e.clientY <= 0) open(); });
  document.getElementById('giftClose').addEventListener('click', close);
  document.getElementById('giftNo').addEventListener('click', close);
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) close(); });
  document.getElementById('giftForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const st = document.getElementById('giftStatus'), email = document.getElementById('giftEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { st.className = 'status err'; st.textContent = 'Вкажіть правильний email.'; return; }
    st.className = 'status'; st.textContent = 'Надсилаємо…';
    try {
      const r = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contact: email, stage: 'gift', lang: 'uk' }) });
      if (!r.ok) throw new Error();
      st.className = 'status ok'; st.textContent = 'Готово! PDF уже летить на пошту. Перевірте «Спам», якщо не бачите.';
      e.target.querySelector('button').disabled = true;
      setTimeout(close, 3500);
    } catch {
      st.className = 'status err'; st.textContent = 'Не вдалося надіслати. Спробуйте ще раз за хвилину.';
    }
  });
}
