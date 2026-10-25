// «Нейро Майстерня»: the mascot Дужка presents a prompt card; on scroll the [brackets]
// fill in with a real business, Claude's answer unfolds, then six category cards fan out.
import { cameraPath, seg, textTexture } from './story.js';

const COBALT = '#2945e6', SLOT_BG = '#e7ebff', INK = '#15151a', MUTED = '#5c5c66';

function card(THREE, draw, w = 3.4, h = 2.1) {
  const tex = textTexture((g, cw, ch) => {
    g.clearRect(0, 0, cw, ch);
    g.fillStyle = '#ffffff';
    g.beginPath(); g.roundRect(4, 4, cw - 8, ch - 8, 36); g.fill();
    g.strokeStyle = '#dddbd3'; g.lineWidth = 3; g.stroke();
    draw(g, cw, ch);
  }, 1024, Math.round(1024 * h / w));
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, toneMapped: false }));
  m.castShadow = true;
  return m;
}

/** Writes a prompt where [slots] are drawn as cobalt pills; returns nothing. */
function promptText(g, parts, x, y, maxW, lh, font) {
  g.font = font; g.textBaseline = 'alphabetic';
  let cx = x, cy = y;
  const words = [];
  parts.forEach(([kind, text]) => text.split(' ').forEach((w, i, arr) => words.push([kind, w + (i < arr.length - 1 ? ' ' : '')])));
  words.forEach(([kind, w]) => {
    const ww = g.measureText(w).width;
    if (cx + ww > x + maxW) { cx = x; cy += lh; }
    if (kind === 'slot') {
      g.fillStyle = SLOT_BG; g.beginPath(); g.roundRect(cx - 4, cy - lh * 0.72, ww + 2, lh * 0.95, 10); g.fill();
      g.fillStyle = COBALT;
    } else g.fillStyle = INK;
    g.fillText(w, cx, cy);
    cx += ww;
  });
}

export function buildPrompt({ THREE, scene, camera, reduced, lang = 'uk' }) {
  const L = lang === 'en';
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d4c8, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 8, 7); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 });
  key.shadow.bias = -0.0006; key.shadow.normalBias = 0.03; key.shadow.radius = 8;
  scene.add(key);
  const blue = new THREE.PointLight(0x8fa2ff, 14, 16, 2); blue.position.set(-4, 3, 3); scene.add(blue);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -2.2; ground.receiveShadow = true; scene.add(ground);

  // ---------- Дужка ----------
  const mascot = new THREE.Group(); scene.add(mascot);
  const sh = new THREE.Shape();
  const r = 0.55, w = 2.4, h = 2.0, x0 = -w / 2, y0 = -h / 2;
  sh.moveTo(x0 + r, y0); sh.lineTo(x0 + 0.95, y0); sh.lineTo(x0 + 0.35, y0 - 0.6); sh.lineTo(x0 + 0.5, y0);
  sh.lineTo(x0 + w - r, y0); sh.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  sh.lineTo(x0 + w, y0 + h - r); sh.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  sh.lineTo(x0 + r, y0 + h); sh.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  sh.lineTo(x0, y0 + r); sh.quadraticCurveTo(x0, y0, x0 + r, y0);
  const bodyGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.16, bevelSegments: 6, curveSegments: 16 });
  bodyGeo.translate(0, 0, -0.27);
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x2945e6, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const body = new THREE.Mesh(bodyGeo, bodyMat); body.castShadow = true; mascot.add(body);
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: 0.2 });
  const pink = new THREE.MeshStandardMaterial({ color: 0xff9db0, roughness: 0.6, transparent: true, opacity: 0.85 });
  const eyes = [];
  [-0.42, 0.42].forEach((x) => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), white); e.position.set(x, 0.18, 0.42); e.scale.z = 0.5; mascot.add(e);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), dark); p.position.set(x + 0.05, 0.15, 0.53); mascot.add(p); eyes.push(p);
    const c = new THREE.Mesh(new THREE.CircleGeometry(0.15, 20), pink); c.position.set(x * 1.45, -0.25, 0.46); c.scale.y = 0.6; mascot.add(c);
  });
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.055, 10, 24, Math.PI), white);
  smile.rotation.z = Math.PI; smile.position.set(0, -0.18, 0.46); mascot.add(smile);
  const cursor = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.12), bodyMat); cursor.position.set(0, 1.42, 0); mascot.add(cursor);
  // bracket arms: [ on the left, ] on the right (waving)
  const armMat = new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: 0.35 });
  function bracket(dir) {
    const g = new THREE.Group();
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, 0.14), armMat); g.add(bar);
    [0.41, -0.41].forEach((y) => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.14), armMat); t.position.set(0.1 * dir, y, 0); g.add(t); });
    g.children.forEach((c) => (c.castShadow = true));
    return g;
  }
  const armL = bracket(1); armL.position.set(-1.62, -0.05, 0); mascot.add(armL);
  const armR = bracket(-1); armR.position.set(1.62, 0.05, 0); mascot.add(armR);
  const armPivot = new THREE.Group(); armPivot.position.set(1.4, -0.3, 0); mascot.add(armPivot);
  armR.position.set(0.22, 0.35, 0); armPivot.add(armR);

  // ---------- prompt card: empty brackets → filled ----------
  const pre = L ? 'You are a social media marketer. My business: ' : 'Ти SMM-спеціаліст. Мій бізнес: ';
  const mid = L ? '. My customers: ' : '. Мої клієнти: ';
  const post = L ? '. Create a 4-week content plan, 3 posts a week. As a table.' : '. Склади контент-план на 4 тижні по 3 пости. Таблицею.';
  const head = (g, cw, title) => { g.fillStyle = MUTED; g.font = "600 34px 'IBM Plex Mono', monospace"; g.fillText(title, 56, 82); };
  const promptEmpty = card(THREE, (g, cw) => { head(g, cw, L ? 'PROMPT #01 · MARKETING' : 'ПРОМПТ №01 · МАРКЕТИНГ'); promptText(g, [['t', pre], ['slot', L ? '[business]' : '[опис]'], ['t', mid], ['slot', L ? '[who]' : '[хто]'], ['t', post]], 56, 170, 910, 64, "500 44px 'IBM Plex Mono', monospace"); });
  const promptFull = card(THREE, (g, cw) => { head(g, cw, L ? 'PROMPT #01 · MARKETING' : 'ПРОМПТ №01 · МАРКЕТИНГ'); promptText(g, [['t', pre], ['slot', L ? 'a coffee shop next to a university' : "кав'ярня біля університету"], ['t', mid], ['slot', L ? 'students' : 'студенти'], ['t', post]], 56, 170, 910, 64, "500 44px 'IBM Plex Mono', monospace"); });
  promptFull.material.opacity = 0;
  const promptGroup = new THREE.Group(); promptGroup.add(promptEmpty); promptFull.position.z = 0.002; promptGroup.add(promptFull); scene.add(promptGroup);

  // ---------- answer card ----------
  const rows = L ? [['Week 1', 'New seasonal latte', 'Reels'], ['Week 1', 'Study spot of the week', 'Carousel'], ['Week 2', 'Barista behind the bar', 'Reels'], ['Week 2', 'Exam-season deal', 'Post']]
                 : [['Тиждень 1', 'Новий сезонний раф', 'Reels'], ['Тиждень 1', 'Місце для навчання', 'Карусель'], ['Тиждень 2', 'Бариста за роботою', 'Reels'], ['Тиждень 2', 'Акція на сесію', 'Пост']];
  const answer = card(THREE, (g, cw) => {
    g.fillStyle = COBALT; g.beginPath(); g.arc(80, 80, 26, 0, Math.PI * 2); g.fill();
    g.fillStyle = INK; g.font = "700 40px Onest, sans-serif"; g.fillText(L ? 'Content plan · 4 weeks' : 'Контент-план · 4 тижні', 128, 94);
    rows.forEach((rw, i) => {
      const y = 190 + i * 92;
      g.fillStyle = i % 2 ? '#ffffff' : '#f4f3ef'; g.fillRect(50, y - 58, cw - 100, 86);
      g.fillStyle = MUTED; g.font = "500 32px 'IBM Plex Mono', monospace"; g.fillText(rw[0], 70, y);
      g.fillStyle = INK; g.font = "500 36px Onest, sans-serif"; g.fillText(rw[1], 300, y);
      g.fillStyle = COBALT; g.font = "600 30px 'IBM Plex Mono', monospace"; g.fillText(rw[2], cw - 250, y);
    });
  }, 3.4, 2.3);
  scene.add(answer);

  // ---------- six category cards ----------
  const cats = L ? [['04', 'Instagram'], ['04', 'Sales'], ['03', 'Website copy'], ['03', 'Operations'], ['03', 'Pricing'], ['03', 'Team']]
                 : [['04', 'Instagram'], ['04', 'Продажі'], ['03', 'Тексти для сайту'], ['03', 'Операції'], ['03', 'Гроші і ціни'], ['03', 'Команда']];
  const catCards = cats.map(([n, t], i) => {
    const c = card(THREE, (g) => {
      g.fillStyle = COBALT; g.font = "600 120px 'IBM Plex Mono', monospace"; g.fillText(n, 60, 190);
      g.fillStyle = INK; g.font = "700 64px Onest, sans-serif"; g.fillText(t, 60, 330);
    }, 1.9, 1.25);
    c.userData = { a: -0.95 + i * 0.38 };
    scene.add(c);
    return c;
  });

  const cam = cameraPath([
    { p: 0.00, pos: [0, 0.6, 11], look: [0, 0.2, 0] },
    { p: 0.18, pos: [1.2, 0.9, 8.6], look: [1.0, 0.4, 0] },
    { p: 0.38, pos: [1.1, 0.6, 6.6], look: [1.0, 0.5, 0] },
    { p: 0.58, pos: [0.6, 1.0, 8.4], look: [1.2, 0.2, 0] },
    { p: 0.78, pos: [0, 2.2, 12.5], look: [0, 0.7, 0] },
    { p: 1.00, pos: [0, 2.6, 13.5], look: [0, 0.9, 0] },
  ]);

  return (p, t) => {
    cam(p, camera);
    const amb = reduced ? 0 : 1;
    // mascot: idle bob + wave, then steps aside
    const aside = seg(p, 0.14, 0.3), back = seg(p, 0.72, 0.86);
    const k = aside * (1 - back);
    mascot.position.set(3.6 * k, Math.sin(t * 1.6) * 0.08 * amb + 0.2 - 0.5 * k, -2.2 * k);
    mascot.rotation.y = -0.45 * k + Math.sin(t * 0.7) * 0.06 * amb;
    armPivot.rotation.z = (Math.sin(t * 4) * 0.35 + 0.2) * amb * (1 - k * 0.7);
    eyes.forEach((e) => (e.position.x = (e.position.x > 0 ? 0.47 : -0.37) - k * 0.1));
    cursor.visible = amb ? Math.floor(t * 1.8) % 2 === 0 : true;

    // prompt card flies in, brackets fill, then it steps back for the answer
    const inC = seg(p, 0.12, 0.26), fill = seg(p, 0.36, 0.46), shift = seg(p, 0.52, 0.62), out = seg(p, 0.72, 0.82);
    promptGroup.position.set(0.9 - 0.5 * shift, 0.45 + (1 - inC) * -3 + shift * 0.75, -0.2 - shift * 1.0);
    promptGroup.rotation.set((1 - inC) * 0.6, -0.1 + (1 - inC) * 0.5 + shift * 0.1, 0);
    promptGroup.scale.setScalar(Math.max(0.001, inC * (1 - out)));
    promptFull.material.opacity = fill;
    promptEmpty.material.opacity = 1 - fill * 0.999;

    const ans = seg(p, 0.54, 0.66);
    answer.position.set(1.7 + (1 - ans) * 2.5, -0.35, 0.7);
    answer.rotation.set(0, -0.22 + (1 - ans) * -0.4, (1 - ans) * 0.15);
    answer.scale.setScalar(Math.max(0.001, ans * (1 - out)));

    const fan = seg(p, 0.78, 0.94);
    catCards.forEach((c) => {
      const a = c.userData.a * fan;
      c.position.set(Math.sin(a) * 4.4, 2.1 - (1 - Math.cos(a)) * 1.6 - (1 - fan) * 1.5, -1.8 - (1 - Math.cos(a)) * 0.8);
      c.rotation.set(0, -a * 0.6, -a * 0.25);
      c.scale.setScalar(Math.max(0.001, fan));
    });
  };
}
