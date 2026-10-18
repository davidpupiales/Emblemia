(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ===== Preloader ===== */
  document.body.classList.add('is-loading');
  const finishLoading = () => {
    $('#preloader').classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
  };
  window.addEventListener('load', () => setTimeout(finishLoading, 1300));
  setTimeout(finishLoading, 3500); // seguridad

  /* ===== Año ===== */
  $('#year').textContent = new Date().getFullYear();

  /* ===== Reveal al hacer scroll ===== */
  $$('.steps li').forEach((li, i) => li.style.setProperty('--i', i));
  $$('.grid .card, .swatches .swatch, .why__list li').forEach((el, i) =>
    el.style.setProperty('--d', `${(i % 6) * 0.08}s`));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ===== Header: fondo, ocultar al bajar, barra de progreso ===== */
  const header = $('#header');
  const bar = $('#progress');
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('is-stuck', y > 40);
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !$('#nav').classList.contains('is-open'));
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    $$('[data-parallax]').forEach((el) => {
      el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.parallax)}px, 0)`;
    });
    lastY = y; ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ===== Menú móvil ===== */
  const burger = $('#burger');
  const nav = $('#nav');
  const toggleNav = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleNav(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => toggleNav(false)));

  /* ===== Moneda 3D: canto con capas + inclinación con el mouse ===== */
  const coin = $('#coin');
  for (let i = -6; i <= 6; i++) {
    const edge = document.createElement('div');
    edge.className = 'coin__edge';
    edge.style.transform = `translateZ(${i}px)`;
    coin.insertBefore(edge, coin.firstChild);
  }
  const stage = $('#coinStage');
  if (fine && !reduce) {
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = `rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg)`;
    });
    stage.addEventListener('mouseleave', () => { stage.style.transform = ''; });
    stage.style.transition = 'transform .4s ease-out';
    stage.style.transformStyle = 'preserve-3d';
  }

  /* ===== Chispas de fundición ===== */
  const sparks = $('#sparks');
  if (!reduce) {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = 6 + Math.random() * 8 + 's';
      s.style.animationDelay = -Math.random() * 12 + 's';
      const size = 2 + Math.random() * 3;
      s.style.width = s.style.height = size + 'px';
      sparks.appendChild(s);
    }
  }

  /* ===== Cursor personalizado ===== */
  const cursor = $('#cursor');
  if (fine) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY; cursor.style.opacity = 1;
    });
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      const half = cursor.offsetWidth / 2;
      cursor.style.transform = `translate(${cx - half}px, ${cy - half}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', (e) => cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .card')));
  }

  /* ===== Botones magnéticos ===== */
  if (fine && !reduce) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ===== Tarjetas: inclinación 3D y brillo que sigue al mouse ===== */
  if (fine && !reduce) {
    $$('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
        card.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 8).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ===== Moneda del inicio: pausar fuera de pantalla ===== */
  new IntersectionObserver(([e]) => { coin.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; }).observe(stage);

  /* ===== Catálogo + visor 3D + Wompi ===== */
  const PRICE = 30000, PRICE_TXT = '$30.000 COP';
  const WOMPI = {
    publicKey: 'pub_test_REEMPLAZAR',             // tu llave pública de Wompi
    redirectUrl: location.origin + '/gracias.html',
    testMode: true,                                // datos de comprador de prueba precargados en Wompi
    testUser: { name: 'Usuario de Prueba', email: 'prueba@emblemia.co', phone: '3001234567' },
    signatureEndpoint: null                        // backend: POST {coin, reference} → {signature, reference?}
  };
  const RIM = { gold: '#c9a24e', silver: '#d9dde2' }, EDGE = { gold: '#8a6a2c', silver: '#6f757d' };

  // Caras de muestra (SVG) para las monedas sin foto: cámbialas poniendo la ruta de tu imagen en COINS
  const mint = (metal, label, back) => {
    const g = metal === 'gold' ? ['#7a5316', '#f3d58a', '#b98a2c', '#fff0b8'] : ['#6f737a', '#eceef1', '#9aa0a8', '#fafbfc'];
    const txt = back ? 'MEMORIA HECHA SÍMBOLO' : label.toUpperCase();
    return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset=".25" stop-color="${g[1]}"/><stop offset=".5" stop-color="${g[2]}"/><stop offset=".75" stop-color="${g[3]}"/><stop offset="1" stop-color="${g[0]}"/></linearGradient><path id="t" d="M135 500a365 365 0 0 1 730 0"/></defs><circle cx="500" cy="500" r="498" fill="url(#m)"/><circle cx="500" cy="500" r="462" fill="none" stroke="${g[0]}" stroke-width="14" stroke-dasharray="3 14" opacity=".6"/><circle cx="500" cy="500" r="300" fill="${g[0]}" opacity=".16"/><g transform="translate(500 520) scale(3.2) translate(-50 -60)"><polygon points="50,2 54,12 65,12 56,19 60,30 50,23 40,30 44,19 35,12 46,12" fill="${g[0]}"/><path d="M50 40 L86 58 V74 M86 92 L50 112 L14 92 V58 L50 40 M14 76 H58" fill="none" stroke="${g[0]}" stroke-width="9"/></g><text font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="58" letter-spacing="10" fill="${g[0]}" text-anchor="middle"><textPath href="#t" startOffset="50%">${txt}</textPath></text></svg>`);
  };
  const COINS = [
    ['carnaval', 'Corpocarnaval', 'Máscara en relieve y esmalte.', 'moneda-carnaval.webp', 'gold'],
    ['pasto100', 'Pasto 100 años', 'Carnaval, 1927–2027.', 'moneda-pasto100.webp', 'gold'],
    ['identidad', 'Identidad', 'Isotipo en relieve, acabado oro.', mint('gold', 'Identidad'), 'gold'],
    ['memoria', 'Memoria', 'Isotipo en relieve, plata antigua.', mint('silver', 'Memoria'), 'silver'],
    ['pertenencia', 'Pertenencia', 'Isotipo en relieve, acabado dorado.', mint('gold', 'Pertenencia'), 'gold'],
    ['honor', 'Honor', 'Isotipo en relieve, acabado plata.', mint('silver', 'Honor'), 'silver']
  ].map(([id, name, desc, img, metal]) => ({ id, name, desc, img, metal, back: mint(metal, '', true) }));

  const money = (n) => '$' + n.toLocaleString('es-CO') + ' COP';
  const qty = Object.fromEntries(COINS.map((c) => [c.id, 1]));
  const qtyUI = (id) => `<div class="qty" data-qty-for="${id}"><button type="button" data-qty="-1" aria-label="Quitar una moneda">&minus;</button><output aria-live="polite">${qty[id]}</output><button type="button" data-qty="1" aria-label="Agregar una moneda">+</button></div>`;
  const refresh = (id) => {
    const n = qty[id];
    $$(`[data-price-for="${id}"]`).forEach((el) => { el.textContent = n > 1 ? `${n} monedas: ${money(PRICE * n)}` : money(PRICE); });
    $$(`.qty[data-qty-for="${id}"] output`).forEach((el) => { el.textContent = n; });
  };
  $('#catGrid').innerHTML = COINS.map((c) => `<article class="cat-coin" style="--rim:${RIM[c.metal]}"><div class="cat-coin__img"><img src="${c.img}" alt="Moneda ${c.name}" width="230" height="230" loading="lazy"></div><h3>${c.name}</h3><p>${c.desc}</p><span class="price" data-price-for="${c.id}">${PRICE_TXT}</span>${qtyUI(c.id)}<div class="cat-coin__btns"><button type="button" class="btn btn--small btn--ghost" data-view="${c.id}">Ver medalla en 3D</button><button type="button" class="btn btn--small" data-buy="${c.id}">Comprar</button></div></article>`).join('');

  const stack = [];
  const openModal = (m) => {
    m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-modal'); stack.push([m, document.activeElement]);
    setTimeout(() => $('[data-close]', m).focus(), 60);
  };
  const closeTop = () => {
    const [m, from] = stack.pop() || [];
    if (!m) return;
    m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true');
    if (!stack.length) document.body.classList.remove('has-modal');
    if (m.id === 'viewer') cancelAnimationFrame(raf);
    if (from && from.focus) from.focus();
  };

  // Visor: gira solo (≈7 s por vuelta) y se puede arrastrar
  const vCoin = $('#vCoin'), vStage = $('#vStage');
  let ang = 0, vel = 0, drag = null, raf = 0, last = 0;
  const SPEED = reduce ? 0 : 50; // grados por segundo
  const frame = (t) => {
    const dt = Math.min((t - last) / 1000, 0.05); last = t;
    if (drag === null) { ang += SPEED * dt + vel; vel *= 0.92; }
    vCoin.style.transform = `rotateX(-8deg) rotateY(${ang}deg)`;
    raf = requestAnimationFrame(frame);
  };
  vStage.addEventListener('pointerdown', (e) => { drag = e.clientX; vel = 0; vStage.setPointerCapture(e.pointerId); });
  vStage.addEventListener('pointermove', (e) => { if (drag === null) return; const dx = (e.clientX - drag) * 0.6; drag = e.clientX; ang += dx; vel = dx; });
  ['pointerup', 'pointercancel'].forEach((ev) => vStage.addEventListener(ev, () => { drag = null; }));

  const openViewer = (id) => {
    const c = COINS.find((x) => x.id === id);
    vCoin.style.setProperty('--rim', RIM[c.metal]); vCoin.style.setProperty('--edge', EDGE[c.metal]);
    vCoin.innerHTML = `<div class="coin__face coin__face--front"><img src="${c.img}" alt="Moneda ${c.name}"></div><div class="coin__face coin__face--back"><img src="${c.back}" alt="Reverso de la moneda ${c.name}"></div>`;
    for (let i = -6; i <= 6; i++) {
      const d = document.createElement('div'); d.className = 'coin__edge'; d.style.transform = `translateZ(${i}px)`;
      vCoin.insertBefore(d, vCoin.firstChild);
    }
    $('#vName').textContent = c.name; $('#vDesc').textContent = c.desc; $('#vPrice').dataset.priceFor = c.id; $('#vQtyBox').innerHTML = qtyUI(c.id); refresh(c.id);
    $('#vBuy').dataset.buy = c.id;
    ang = 0; vel = 0; last = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    openModal($('#viewer'));
  };

  // Wompi Web Checkout. El precio y la firma deben venir del backend (ver signatureEndpoint)
  const buy = async (id) => {
    if (WOMPI.publicKey.includes('REEMPLAZAR')) return alert('Falta la llave pública de Wompi en script.js (WOMPI.publicKey).');
    const q = new URLSearchParams({ 'public-key': WOMPI.publicKey, currency: 'COP', 'amount-in-cents': PRICE * 100 * qty[id], reference: `EMB-${id}-x${qty[id]}-${Date.now()}`, 'redirect-url': WOMPI.redirectUrl });
    if (WOMPI.testMode) {
      q.set('customer-data:full-name', WOMPI.testUser.name); q.set('customer-data:email', WOMPI.testUser.email);
      q.set('customer-data:phone-number', WOMPI.testUser.phone); q.set('customer-data:phone-number-prefix', '+57');
    }
    try {
      if (WOMPI.signatureEndpoint) {
        const r = await fetch(WOMPI.signatureEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ coin: id, reference: q.get('reference') }) });
        const d = await r.json();
        q.set('signature:integrity', d.signature);
        if (d.reference) q.set('reference', d.reference);
      }
    } catch { return alert('No pudimos iniciar el pago. Intenta de nuevo.'); }
    location.href = 'https://checkout.wompi.co/p/?' + q;
  };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open-catalog],[data-close],[data-qty],[data-view],[data-buy]');
    if (!t) return;
    if (t.matches('[data-open-catalog]')) openModal($('#catalog'));
    else if (t.matches('[data-close]')) closeTop();
    else if (t.dataset.qty) { const id = t.closest('.qty').dataset.qtyFor; qty[id] = Math.min(20, Math.max(1, qty[id] + Number(t.dataset.qty))); refresh(id); }
    else if (t.dataset.view) openViewer(t.dataset.view);
    else buy(t.dataset.buy);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTop(); });
})();
